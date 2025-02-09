export const APP_NAME=process.env.NEXT_PUBLIC_APP_NAME||'Sama-Shop';
export const APP_DESCRIPTION=process.env.NEXT_PUBLIC_APP_DESCRIPTION||"a Modern ecommerce platform built with Next.js ";
export const SERVER_URL=process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const LATEST_PRODUCTS_LIMIT=Number(process.env.LATEST_PRODUCTS_LIMIT)||4;// فيني حط LATEST_PRODUCTS_LIMIT بملف env و اعطيه قيمة و لكن فيما بعد

export const signInDefaultValues={
    email:'',
    password:''
}

export const signUpDefaultValues={
    name:'',
    email:'',
    password:'',
    confirmPassword:''
}