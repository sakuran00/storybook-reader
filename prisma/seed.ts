

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { BOOKS } from "@/data/books"; 

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seeding...");
  await prisma.page.deleteMany({});
  await prisma.book.deleteMany({});

  for (const book of BOOKS) {
    const existingBook = await prisma.book.findUnique({
      where: { id: book.id },
    });

    if (!existingBook) {
      console.log(`Creating book: ${book.title}`);

      await prisma.book.create({
        data: {
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.cover,
          status: book.status,
          pages: {
            create: book.pages?.map((page, index) => ({
              pageNumber: index + 1,
              imageUrl: page.image,
              textJaUrl: page.textJa,
              textEnUrl: page.textEn,
              audioJaUrl: page.audioJa,
              audioEnUrl: page.audioEn,
              videoUrl: page.movie,
            })) || [],
          },
        },
      });
    } else {
      console.log(`Book already exists: ${book.title}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });