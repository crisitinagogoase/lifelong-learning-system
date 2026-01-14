declare module '@/app/auth' {
  import { AuthOptions } from 'next-auth';    
  export const authOptions: AuthOptions;
}

declare module '@/lib/prisma-extensions' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export default prisma;
}

declare module 'mammoth';
declare module 'pdf-parse';
declare module 'openai';
