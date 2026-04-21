/*
  Warnings:

  - You are about to drop the column `jobDescription` on the `templates` table. All the data in the column will be lost.
  - Added the required column `template` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "jobDescription",
ADD COLUMN     "template" TEXT NOT NULL;
