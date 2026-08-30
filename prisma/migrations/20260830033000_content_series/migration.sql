CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Series_slug_key" ON "Series"("slug");

ALTER TABLE "Post"
ADD COLUMN "seriesId" TEXT,
ADD COLUMN "lessonNumber" INTEGER;

CREATE INDEX "Post_seriesId_lessonNumber_idx" ON "Post"("seriesId", "lessonNumber");

ALTER TABLE "Post" ADD CONSTRAINT "Post_seriesId_fkey"
FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;
