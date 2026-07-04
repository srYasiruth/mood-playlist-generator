import { PrismaClient } from "@prisma/client";
import { moodDefinitions } from "../src/utils/moodMapping";

const prisma = new PrismaClient();

async function main() {
  for (const mood of Object.values(moodDefinitions)) {
    await prisma.mood.upsert({
      where: { key: mood.id },
      update: {
        name: mood.name,
        description: mood.description,
        keywords: mood.queries,
        genres: mood.genres,
        theme: {
          energy: mood.energy,
          fallbackImage: mood.fallbackImage
        }
      },
      create: {
        key: mood.id,
        name: mood.name,
        description: mood.description,
        keywords: mood.queries,
        genres: mood.genres,
        theme: {
          energy: mood.energy,
          fallbackImage: mood.fallbackImage
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
