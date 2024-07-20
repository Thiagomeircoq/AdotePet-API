/*
  Warnings:

  - Made the column `date_of_birth` on table `tbpersons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "register"."tbpersons" ALTER COLUMN "date_of_birth" SET NOT NULL;
