-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "keywords" JSONB NOT NULL,
    "genres" JSONB NOT NULL,
    "theme" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteMood" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteMood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "inputType" TEXT NOT NULL DEFAULT 'manual',
    "journalTextSaved" BOOLEAN NOT NULL DEFAULT false,
    "searchQuery" TEXT,
    "apiSource" TEXT NOT NULL,
    "resultData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedPlaylist" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "userId" TEXT,
    "playlistHistoryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "SharedPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "statusCode" INTEGER,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_key_key" ON "Mood"("key");

-- CreateIndex
CREATE INDEX "FavoriteMood_moodId_idx" ON "FavoriteMood"("moodId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteMood_userId_moodId_key" ON "FavoriteMood"("userId", "moodId");

-- CreateIndex
CREATE INDEX "PlaylistHistory_userId_idx" ON "PlaylistHistory"("userId");

-- CreateIndex
CREATE INDEX "PlaylistHistory_mood_idx" ON "PlaylistHistory"("mood");

-- CreateIndex
CREATE UNIQUE INDEX "SharedPlaylist_shareId_key" ON "SharedPlaylist"("shareId");

-- CreateIndex
CREATE INDEX "SharedPlaylist_userId_idx" ON "SharedPlaylist"("userId");

-- CreateIndex
CREATE INDEX "SharedPlaylist_playlistHistoryId_idx" ON "SharedPlaylist"("playlistHistoryId");

-- AddForeignKey
ALTER TABLE "FavoriteMood" ADD CONSTRAINT "FavoriteMood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMood" ADD CONSTRAINT "FavoriteMood_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Mood"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistHistory" ADD CONSTRAINT "PlaylistHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPlaylist" ADD CONSTRAINT "SharedPlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPlaylist" ADD CONSTRAINT "SharedPlaylist_playlistHistoryId_fkey" FOREIGN KEY ("playlistHistoryId") REFERENCES "PlaylistHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
