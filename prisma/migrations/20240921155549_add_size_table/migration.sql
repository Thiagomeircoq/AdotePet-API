/*
  Warnings:

  - You are about to drop the column `size` on the `tbpets` table. All the data in the column will be lost.
  - Added the required column `size_id` to the `tbpets` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `tbpets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- AlterTable
ALTER TABLE "tbpets" DROP COLUMN "size",
ADD COLUMN     "size_id" INTEGER NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateTable
CREATE TABLE "tbsize" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(50) NOT NULL,

    CONSTRAINT "tbsize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tbpets" ADD CONSTRAINT "tbpets_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "tbsize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
