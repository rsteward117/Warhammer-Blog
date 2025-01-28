/*
  Warnings:

  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_userId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Likes";

-- CreateTable
CREATE TABLE "Postlikes" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Postlikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Postlikes_userId_postId_key" ON "Postlikes"("userId", "postId");

-- AddForeignKey
ALTER TABLE "Postlikes" ADD CONSTRAINT "Postlikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postlikes" ADD CONSTRAINT "Postlikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
