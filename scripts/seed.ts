const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Art" },
        { name: "Business" },
        { name: "Education" },
        { name: "Entertainment" },
        { name: "Music" },
        { name: "Photography" },
        { name: "Programming" },
        { name: "Sports" },
        { name: "Engineering" },
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
