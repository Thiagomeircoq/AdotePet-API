/*
  Warnings:

  - The primary key for the `tbbreed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tbpets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tbspecies` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "tbbreed" DROP CONSTRAINT "tbbreed_species_id_fkey";

-- DropForeignKey
ALTER TABLE "tbpets" DROP CONSTRAINT "tbpets_breed_id_fkey";

-- DropForeignKey
ALTER TABLE "tbpets" DROP CONSTRAINT "tbpets_species_id_fkey";

-- AlterTable
ALTER TABLE "tbbreed" DROP CONSTRAINT "tbbreed_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "species_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tbbreed_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tbbreed_id_seq";

-- AlterTable
ALTER TABLE "tbpets" DROP CONSTRAINT "tbpets_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "species_id" SET DATA TYPE TEXT,
ALTER COLUMN "breed_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tbpets_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tbpets_id_seq";

-- AlterTable
ALTER TABLE "tbspecies" DROP CONSTRAINT "tbspecies_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tbspecies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tbspecies_id_seq";

-- AddForeignKey
ALTER TABLE "tbpets" ADD CONSTRAINT "tbpets_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "tbspecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbpets" ADD CONSTRAINT "tbpets_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "tbbreed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbbreed" ADD CONSTRAINT "tbbreed_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "tbspecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
