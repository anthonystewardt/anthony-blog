ALTER TABLE "User"
ADD COLUMN "bio" TEXT,
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "jobTitle" TEXT,
ADD COLUMN "website" TEXT,
ADD COLUMN "githubUrl" TEXT,
ADD COLUMN "linkedinUrl" TEXT;

ALTER TABLE "Post" ADD COLUMN "notificationSentAt" TIMESTAMP(3);

CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "academyName" TEXT NOT NULL DEFAULT 'Anthony Academy',
    "tagline" TEXT NOT NULL DEFAULT 'Aprende construyendo proyectos reales',
    "description" TEXT,
    "baseUrl" TEXT NOT NULL DEFAULT 'http://localhost:3000',
    "senderName" TEXT NOT NULL DEFAULT 'Anthony Academy',
    "senderEmail" TEXT NOT NULL DEFAULT 'onboarding@resend.dev',
    "replyToEmail" TEXT,
    "notifyOnPublish" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Subscriber"
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "confirmedAt" TIMESTAMP(3),
ADD COLUMN "confirmationToken" TEXT,
ADD COLUMN "unsubscribeToken" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Subscriber"
SET "confirmationToken" = gen_random_uuid()::text,
    "unsubscribeToken" = gen_random_uuid()::text,
    "active" = false;

ALTER TABLE "Subscriber"
ALTER COLUMN "confirmationToken" SET NOT NULL,
ALTER COLUMN "unsubscribeToken" SET NOT NULL;

CREATE UNIQUE INDEX "Subscriber_confirmationToken_key" ON "Subscriber"("confirmationToken");
CREATE UNIQUE INDEX "Subscriber_unsubscribeToken_key" ON "Subscriber"("unsubscribeToken");
