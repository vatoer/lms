import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });

//ts.ignore
// db.$on("query", async (e) => {
//   console.log(`${e.query} ${e.params}`);
// });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
