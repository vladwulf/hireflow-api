/*
  Warnings:

  - You are about to drop the column `sections` on the `templates` table. All the data in the column will be lost.
  - Made the column `description` on table `templates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "sections",
ALTER COLUMN "description" SET NOT NULL;
