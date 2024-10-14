-- CreateTable
CREATE TABLE "tbuser" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "person_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbuser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbperson" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "profile_picture" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbperson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbrole" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbrole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbpermission" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbpermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbuser_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbuser_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "tbrole_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbrole_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbuser_email_key" ON "tbuser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbuser_person_id_key" ON "tbuser"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbrole_name_key" ON "tbrole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbpermission_name_key" ON "tbpermission"("name");

-- AddForeignKey
ALTER TABLE "tbuser" ADD CONSTRAINT "tbuser_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "tbperson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbuser_roles" ADD CONSTRAINT "tbuser_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbuser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbuser_roles" ADD CONSTRAINT "tbuser_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tbrole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbrole_permissions" ADD CONSTRAINT "tbrole_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tbrole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbrole_permissions" ADD CONSTRAINT "tbrole_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "tbpermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
