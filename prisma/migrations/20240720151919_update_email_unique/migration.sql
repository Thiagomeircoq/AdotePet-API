/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `tbusers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tbusers_email_key" ON "auth"."tbusers"("email");
