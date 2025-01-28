/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postImageUrl" TEXT;

-- DropTable
DROP TABLE "Image";
