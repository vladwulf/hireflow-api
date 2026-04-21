-- AlterTable: add description with a temporary default for existing rows, then drop the default
ALTER TABLE "templates" ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "template" DROP NOT NULL;

ALTER TABLE "templates" ALTER COLUMN "description" DROP DEFAULT;
