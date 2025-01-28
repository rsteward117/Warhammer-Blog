-- CreateTable
CREATE TABLE "Commentlikes" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Commentlikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Commentlikes_userId_commentId_key" ON "Commentlikes"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Commentlikes" ADD CONSTRAINT "Commentlikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentlikes" ADD CONSTRAINT "Commentlikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
