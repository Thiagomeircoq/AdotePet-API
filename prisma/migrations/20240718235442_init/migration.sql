-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "financial";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "register";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "social";

-- CreateTable
CREATE TABLE "register"."tbpersons" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbpersons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."tbusers" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "person_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbusers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."tbaccounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbaccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social"."tbcontacts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbcontacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial"."tbtransactions" (
    "id" TEXT NOT NULL,
    "sender_wallet_id" TEXT NOT NULL,
    "receiver_wallet_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbtransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial"."tbwallets" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbwallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbpersons_cpf_key" ON "register"."tbpersons"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tbpersons_phone_number_key" ON "register"."tbpersons"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "tbusers_username_key" ON "auth"."tbusers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tbaccounts_account_number_key" ON "auth"."tbaccounts"("account_number");

-- AddForeignKey
ALTER TABLE "auth"."tbusers" ADD CONSTRAINT "tbusers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "register"."tbpersons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."tbaccounts" ADD CONSTRAINT "tbaccounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."tbusers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."tbcontacts" ADD CONSTRAINT "tbcontacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."tbusers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."tbcontacts" ADD CONSTRAINT "tbcontacts_contact_user_id_fkey" FOREIGN KEY ("contact_user_id") REFERENCES "auth"."tbusers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial"."tbtransactions" ADD CONSTRAINT "tbtransactions_sender_wallet_id_fkey" FOREIGN KEY ("sender_wallet_id") REFERENCES "financial"."tbwallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial"."tbtransactions" ADD CONSTRAINT "tbtransactions_receiver_wallet_id_fkey" FOREIGN KEY ("receiver_wallet_id") REFERENCES "financial"."tbwallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial"."tbwallets" ADD CONSTRAINT "tbwallets_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "auth"."tbaccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
