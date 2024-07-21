-- DropForeignKey
ALTER TABLE "auth"."tbusers" DROP CONSTRAINT "tbusers_person_id_fkey";

-- AddForeignKey
ALTER TABLE "auth"."tbusers" ADD CONSTRAINT "tbusers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "register"."tbpersons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
