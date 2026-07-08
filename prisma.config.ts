import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./backend/prisma/schema.prisma",
  migrations: {
    path: "./backend/prisma/migrations",
    seed: "npx tsx database/seeds/seed_data.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
