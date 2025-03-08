import { auth } from "./auth";

export { auth as middleware };

export const config = {
  runtime: 'nodejs', // أو 'edge' إذا كنت تريد استخدام Edge Runtime
};