/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';
import { compare } from './lib/encrypt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
// import NextAuth, { NextAuthConfig } from 'next-auth';
// import {PrismaAdapter} from'@auth/prisma-adapter'
// import {prisma}from '@/db/prisma'
// import  CredentialsProvider  from 'next-auth/providers/credentials';
// import { compareSync } from 'bcrypt-ts-edge';
// import  {cookies}  from 'next/headers';
// import { NextResponse } from 'next/server'; 
// export const config={
//     pages:{
//         signIn:'/sign-in',
//         error:'/sign-in'
//     },
//     session:{
//         strategy:'jwt',
//         maxAge: 30 * 24 * 60 * 60, // 30 days
//     },
//     adapter:PrismaAdapter(prisma),
//     providers:[CredentialsProvider(
//         {
//             credentials:{
//                 email:{type :'email'},
//                 password:{type :'password'},
//             },
//             async authorize(credentials){
//                 if(credentials==null) return null;
//                 //Find user in database
//                 const user=await prisma.user.findFirst({
//                     where:{
//                         email:credentials.email as string
//                     }
//                 });
//                 //Check if user exists and if the password matches
//                 if(user && user.password){
//                     const isMatch=compareSync(credentials.password as string,user.password);
//                     //if password is correct ,return user
//                     if(isMatch){return{
//                         id:user.id,
//                         name:user.name,
//                         email:user.email,
//                         role:user.role
//                     }}
//                 }
//                 //If user dosnt exist  or password does not match return null 
//                 return null;
//             },
//         }
//     ),
// ],
//     callbacks:{
//         async session({ session,user,trigger,token }:any) {
//             //Set the user ID from the token
//             session.user.id=token.sub;
//             session.user.role=token.role;
//             session.user.name=token.name;
//             //If there is an updates,set the user name
//             if(trigger==='update'){
//                 session.user.name=user.name;
//             }
//             return session
//           },
//           async jwt({token,session,user,trigger}:any){
//             //Assign user fields to token
//             if(user){
//                 token.role=user.role;
//                 token.id=user.id;
//                 //If user has no name then use the email
//                 if(user.name==='NO_NAME'){
//                     token.name=user.email!.split('@')[0]; //! تستخدم لاخبار تايبسكريبت ان القيمة لن تكون غير معرفة بالتأكيييد
//                 }
//                 //Update  database to reflect the token name
//                 await prisma.user.update({
//                     where:{id:user.id},
//                     data:{name:token.name}
//                 })
//             }
//             if(trigger==='signIn'||trigger==='signUp'){
//                 const cookieObject=await cookies();
//                 const sessionCartId=cookieObject.get('sessionCartId')?.value;
//                 if(sessionCartId){
//                     const sessionCart=await prisma.cart.findFirst({
//                         where:{sessionCartId}
//                     });
//                     if(sessionCart){
//                         //Delete current user cart
//                         await prisma.cart.deleteMany({
//                             where:{userId:user.id}
//                         });
//                         //Assign new cart
//                         await prisma.cart.update({
//                             where:{id:sessionCart.id},
//                             data:{userId:user.id}
//                         })
//                     }
//                 }
//             }

//             //Handel session updates
//             if(session?.user.name &&trigger==='update'){
//                 token.name=session.user.name
//             }
//             return token;
//           },
//           authorized({request,auth}:any){
//             //Array of regex petterns of paths we want to protect
//             const protectedPaths = [
//                 /\/shipping-address/,
//                 /\/payment-method/,
//                 /\/place-order/,
//                 /\/profile/,
//                 /\/user\/(.*)/,
//                 /\/order\/(.*)/,
//                 /\/admin/,
//               ];

//               //Get pathname from the req URL object
//               const {pathname}=request.nextUrl;
//               // Check if user is not authenticated and on a protected path
//               if(!auth &&protectedPaths.some((p)=>p.test(pathname)))return false
//             //Check for session cart cookie
//             if(!request.cookies.get('sessionCartId')){
//                 //Generate new session cart id cookie
//                 const sessionCartId= crypto.randomUUID();
//                 //Clone the req headers 
//                 const newRequestHeaders=new Headers(request.headers);
//                 //Create new response and add the headers
//                 const response=NextResponse.next({
//                     request:{
//                         headers:newRequestHeaders,
//                     }
//                 })
//                 //Set newly generated session Cart ID in the response cookies 
//                 response.cookies.set('sessionCartId',sessionCartId)
//                 return response
//             }else{
//                 return true;
//             }
//           }
//     },
// } satisfies NextAuthConfig;

// export const {handlers,auth,signIn,signOut}=NextAuth(config);




// // استيراد NextAuth ودالة الإعداد NextAuthConfig من مكتبة next-auth
// import NextAuth, { NextAuthConfig } from 'next-auth';

// // استيراد محول Prisma للتواصل مع قاعدة البيانات من مكتبة @auth/prisma-adapter
// import { PrismaAdapter } from '@auth/prisma-adapter';

// // استيراد كائن prisma المُعرف في ملف إعداد قاعدة البيانات
// import { prisma } from '@/db/prisma';

// // استيراد مزود التوثيق باستخدام بيانات الاعتماد (البريد الإلكتروني وكلمة المرور)
// import CredentialsProvider from 'next-auth/providers/credentials';

// // استيراد دالة compareSync من مكتبة bcrypt-ts-edge للمقارنة بين كلمات المرور
// import { compareSync } from 'bcrypt-ts-edge';

// // إعداد تكوين NextAuth مع كافة الإعدادات المطلوبة
// export const config = {
//   // تخصيص الصفحات الخاصة بتسجيل الدخول والأخطاء
//   pages: {
//     signIn: '/sign-in', // تحديد صفحة تسجيل الدخول
//     error: '/sign-in'   // تحديد صفحة الخطأ (مثلاً عند فشل تسجيل الدخول)
//   },
//   // إعدادات الجلسة
//   session: {
//     strategy: 'jwt',             // استخدام JWT لإدارة الجلسات
//     maxAge: 30 * 24 * 60 * 60,     // مدة صلاحية الجلسة (30 يوم)
//   },
//   // ربط NextAuth بقاعدة البيانات باستخدام PrismaAdapter
//   adapter: PrismaAdapter(prisma),
//   // تعريف مزودي التوثيق
//   providers: [
//     // استخدام مزود التوثيق باستخدام بيانات الاعتماد (البريد الإلكتروني وكلمة المرور)
//     CredentialsProvider({
//       // تحديد الحقول المطلوبة لتسجيل الدخول
//       credentials: {
//         email: { type: 'email' },        // حقل البريد الإلكتروني
//         password: { type: 'password' }     // حقل كلمة المرور
//       },
//       // دالة authorize للتحقق من صحة بيانات الاعتماد وإرجاع بيانات المستخدم في حال كانت صحيحة
//       async authorize(credentials) {
//         // التحقق من وجود بيانات الاعتماد المُرسلة
//         if (credentials == null) return null;
        
//         // البحث عن المستخدم في قاعدة البيانات باستخدام البريد الإلكتروني المُدخل
//         const user = await prisma.user.findFirst({
//           where: {
//             email: credentials.email as string
//           }
//         });
        
//         // التحقق من وجود المستخدم وكلمة المرور لديه
//         if (user && user.password) {
//           // مقارنة كلمة المرور المُدخلة مع كلمة المرور المخزنة (المشفرة)
//           const isMatch = compareSync(credentials.password as string, user.password);
//           // إذا كانت كلمة المرور صحيحة، يتم إرجاع بيانات المستخدم الأساسية
//           if (isMatch) {
//             return {
//               id: user.id,
//               name: user.name,
//               email: user.email,
//               role: user.role
//             };
//           }
//         }
//         // في حالة عدم تطابق البيانات أو عدم وجود المستخدم، يتم إرجاع null
//         return null;
//       },
//     })
//   ],
//   // تعريف الـ callbacks لتعديل سلوك الجلسة والتوكن
//   callbacks: {
//     // دالة session لتحديث بيانات الجلسة قبل إرجاعها للمستخدم
//     async session({ session, user, trigger, token }: any) {
//       // تعيين معرف المستخدم المستخرج من التوكن إلى الجلسة
//       session.user.id = token.sub;
//       // تعيين دور المستخدم المستخرج من التوكن إلى الجلسة
//       session.user.role = token.role;
//       // تعيين اسم المستخدم المستخرج من التوكن إلى الجلسة
//       session.user.name = token.name;
//       // إذا كان هناك تحديث (مثلاً تغيير الاسم)، يتم تعديل اسم المستخدم في الجلسة
//       if (trigger === 'update') {
//         session.user.name = user.name;
//       }
//       // إرجاع الجلسة المُحدثة
//       return session;
//     },
//     // دالة jwt لتحديث التوكن وإضافة بيانات المستخدم إليه
//     async jwt({ token, session, user, trigger }: any) {
//       // في حالة وجود بيانات المستخدم (أي بعد عملية تسجيل الدخول)
//       if (user) {
//         // إضافة دور المستخدم إلى التوكن
//         token.role = user.role;
//         // إذا كان اسم المستخدم هو "NO_NAME"، يتم استخراج الاسم من البريد الإلكتروني
//         if (user.name === 'NO_NAME') {
//           token.name = user.email!.split('@')[0]; // تقسيم البريد الإلكتروني وأخذ الجزء الأول كاسم
//         }
//         // تحديث قاعدة البيانات لتعيين الاسم الجديد للمستخدم بناءً على التوكن
//         await prisma.user.update({
//           where: { id: user.id },
//           data: { name: token.name }
//         });
//       }
//       // إرجاع التوكن المُحدث
//       return token;
//     }
//   },
// } satisfies NextAuthConfig; // التأكد من أن التكوين يتوافق مع واجهة NextAuthConfig

// // تهيئة NextAuth باستخدام التكوين المُحدد وتصدير الدوال الخاصة بالتعامل مع التوثيق
// export const { handlers, auth, signIn, signOut } = NextAuth(config);
