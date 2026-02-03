/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Repository_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Repository_ownerId_name_key" ON "Repository"("ownerId", "name");
