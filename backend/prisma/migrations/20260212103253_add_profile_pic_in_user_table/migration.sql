-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePic" TEXT,
ALTER COLUMN "bio" SET DEFAULT ARRAY['']::TEXT[];
