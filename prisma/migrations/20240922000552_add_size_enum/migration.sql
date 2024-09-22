/*
  Warnings:

  - You are about to drop the column `size_id` on the `tbpets` table. All the data in the column will be lost.
  - You are about to drop the `tbsize` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `size` to the `tbpets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('FILHOTE', 'PEQUENO', 'MEDIO', 'GRANDE');

-- DropForeignKey
ALTER TABLE "tbpets" DROP CONSTRAINT "tbpets_size_id_fkey";

-- AlterTable
ALTER TABLE "tbpets" DROP COLUMN "size_id",
ADD COLUMN     "size" "Size" NOT NULL;

-- DropTable
DROP TABLE "tbsize";
