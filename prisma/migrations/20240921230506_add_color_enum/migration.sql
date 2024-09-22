/*
  Warnings:

  - Changed the type of `color` on the `tbpets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BRANCO', 'PRETO', 'MARROM', 'CINZA', 'DOURADO', 'BEGE', 'AMARELO', 'AZUL', 'VERMELHO', 'VERDE');

-- AlterTable
ALTER TABLE "tbpets" DROP COLUMN "color",
ADD COLUMN     "color" "Color" NOT NULL;
