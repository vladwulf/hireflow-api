/*
  Warnings:

  - You are about to drop the column `sections` on the `templates` table. All the data in the column will be lost.
  - Added the required column `category` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "sections",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];
