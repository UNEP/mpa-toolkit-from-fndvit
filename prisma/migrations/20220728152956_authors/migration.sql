/*
  Warnings:

  - You are about to drop the column `img` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ChapterToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChapterToUser" DROP CONSTRAINT "_ChapterToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChapterToUser" DROP CONSTRAINT "_ChapterToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "img";

-- DropTable
DROP TABLE "_ChapterToUser";

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "img" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuthorToChapter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToChapter_AB_unique" ON "_AuthorToChapter"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToChapter_B_index" ON "_AuthorToChapter"("B");

-- AddForeignKey
ALTER TABLE "_AuthorToChapter" ADD CONSTRAINT "_AuthorToChapter_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToChapter" ADD CONSTRAINT "_AuthorToChapter_B_fkey" FOREIGN KEY ("B") REFERENCES "Chapter"("pageId") ON DELETE CASCADE ON UPDATE CASCADE;
