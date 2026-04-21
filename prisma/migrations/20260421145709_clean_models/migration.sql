/*
  Warnings:

  - The primary key for the `candidate_scores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `candidate_scores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `candidates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `candidates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `jobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[uuid]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `candidateId` on the `candidate_scores` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uuid` was added to the `candidates` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `jobId` on the `candidates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uuid` was added to the `jobs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "candidate_scores" DROP CONSTRAINT "candidate_scores_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "candidates" DROP CONSTRAINT "candidates_jobId_fkey";

-- AlterTable
ALTER TABLE "candidate_scores" DROP CONSTRAINT "candidate_scores_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "candidateId",
ADD COLUMN     "candidateId" INTEGER NOT NULL,
ADD CONSTRAINT "candidate_scores_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "candidates" DROP CONSTRAINT "candidates_pkey",
ADD COLUMN     "appFormText" TEXT,
ADD COLUMN     "extraText" TEXT,
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "jobId",
ADD COLUMN     "jobId" INTEGER NOT NULL,
ADD CONSTRAINT "candidates_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_pkey",
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_scores_candidateId_key" ON "candidate_scores"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_uuid_key" ON "candidates"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_uuid_key" ON "jobs"("uuid");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_scores" ADD CONSTRAINT "candidate_scores_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
