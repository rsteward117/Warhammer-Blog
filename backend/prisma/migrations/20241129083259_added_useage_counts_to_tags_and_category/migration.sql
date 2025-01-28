-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0;
