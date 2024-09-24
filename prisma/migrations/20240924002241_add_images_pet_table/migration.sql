-- CreateTable
CREATE TABLE "tbpet_images" (
    "id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbpet_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tbpet_images" ADD CONSTRAINT "tbpet_images_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "tbpets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
