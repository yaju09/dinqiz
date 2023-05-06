import { PrismaClient, Prisma } from "@prisma/client";

let prismaClient;

if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  if (!global.prismaClientGlobal) {
    global.prismaClientGlobal = new PrismaClient();
  }
  prismaClient = global.prismaClientGlobal;
}

export { prismaClient, Prisma };
