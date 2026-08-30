CREATE TYPE "ContentType" AS ENUM ('ARTICLE', 'CLASS', 'NOTE', 'TUTORIAL');

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT 'violet',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

ALTER TABLE "Post"
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "type" "ContentType" NOT NULL DEFAULT 'ARTICLE',
ADD COLUMN "youtubeUrl" TEXT,
ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "readingTime" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "seoDescription" TEXT,
ADD COLUMN "publishedAt" TIMESTAMP(3),
ADD COLUMN "categoryId" TEXT;

ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
