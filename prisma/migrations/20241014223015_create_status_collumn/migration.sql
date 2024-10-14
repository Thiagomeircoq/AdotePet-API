-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "tbuser" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';