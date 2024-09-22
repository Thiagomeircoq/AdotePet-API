-- AlterTable
ALTER TABLE "tbpets" ADD COLUMN     "breed_id" INTEGER;

-- CreateTable
CREATE TABLE "tbbreed" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "species_id" INTEGER NOT NULL,

    CONSTRAINT "tbbreed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tbpets" ADD CONSTRAINT "tbpets_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "tbbreed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbbreed" ADD CONSTRAINT "tbbreed_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "tbspecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
