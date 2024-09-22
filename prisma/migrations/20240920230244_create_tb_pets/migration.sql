-- CreateTable
CREATE TABLE "tbpets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "species" INTEGER NOT NULL,
    "color" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbpets_pkey" PRIMARY KEY ("id")
);
