// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
// images:{
//   remotePatterns:[
//     {
//       protocol:'https',
//       hostname:'utfs.io',
//       port:'',
//     }
//   ]
// },
// // experimental: {
// //   nodeMiddleware: true, // تفعيل دعم Node.js Runtime لـ Middleware
// // } 
// };
 

//  export default nextConfig;
 /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
  experimental: {
    runtime: 'nodejs', // بدلاً من edge
  },
};

module.exports = nextConfig;
