/*
  Warnings:

  - You are about to drop the column `species` on the `tbpets` table. All the data in the column will be lost.
  - Added the required column `species_id` to the `tbpets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbpets" DROP COLUMN "species",
ADD COLUMN     "species_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "tbspecies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "tbspecies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tbpets" ADD CONSTRAINT "tbpets_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "tbspecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
