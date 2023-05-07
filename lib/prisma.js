import { PrismaClient, Prisma } from "@prisma/client";

let prismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  if (!global.prismaClientGlobal) {
    global.prismaClientGlobal = new PrismaClient();
  }
  prismaClient = global.prismaClientGlobal;
}

export { prismaClient, Prisma };
