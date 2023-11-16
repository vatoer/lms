const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Electronics" },
        { name: "Books" },
        { name: "Clothes" },
        { name: "Furniture" },
        { name: "Other" },
      ],
    });
    console.log("seeded categories");
  } catch (error) {
    console.error("error seeding categories: ", error);
  } finally {
    await db.$disconnect();
  }
}

main();
