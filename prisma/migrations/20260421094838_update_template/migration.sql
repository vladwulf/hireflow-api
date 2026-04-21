/*
  Warnings:

  - You are about to drop the column `description` on the `templates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `templates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobDescription` to the `templates` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `templates` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "description",
ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "templates_uuid_key" ON "templates"("uuid");
