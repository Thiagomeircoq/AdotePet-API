/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `tbperson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `tbperson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbperson" ADD COLUMN     "about" TEXT,
ADD COLUMN     "cpf" VARCHAR(11) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbperson_cpf_key" ON "tbperson"("cpf");
