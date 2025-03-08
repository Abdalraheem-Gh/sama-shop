// import { auth } from "./auth";

// export { auth as middleware };

// export const config = {
//   runtime: 'nodejs', // أو 'edge' إذا كنت تريد استخدام Edge Runtime
// }; 
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth: middleware } = NextAuth(authConfig);