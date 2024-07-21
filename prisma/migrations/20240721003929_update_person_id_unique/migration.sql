/*
  Warnings:

  - A unique constraint covering the columns `[person_id]` on the table `tbusers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tbusers_person_id_key" ON "auth"."tbusers"("person_id");
