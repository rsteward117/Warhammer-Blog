-- DropForeignKey
ALTER TABLE "Commentlikes" DROP CONSTRAINT "Commentlikes_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Postlikes" DROP CONSTRAINT "Postlikes_postId_fkey";

-- AddForeignKey
ALTER TABLE "Postlikes" ADD CONSTRAINT "Postlikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentlikes" ADD CONSTRAINT "Commentlikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
