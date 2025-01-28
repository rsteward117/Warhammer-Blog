/*
  Warnings:

  - You are about to drop the column `usageCount` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "usageCount";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "usageCount";
