/*
  Warnings:

  - You are about to drop the column `department` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `jobs` table. All the data in the column will be lost.
  - The primary key for the `templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `templateId` on the `jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_templateId_fkey";

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "department",
DROP COLUMN "notes",
ADD COLUMN     "category" TEXT NOT NULL,
DROP COLUMN "templateId",
ADD COLUMN     "templateId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "templates" DROP CONSTRAINT "templates_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "templates_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
