import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
// export const testPrisma = new PrismaClientTest();

export default prisma;

// export default process.env.NODE_ENV === "test" ? testPrisma : devPrisma;
