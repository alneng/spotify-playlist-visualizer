-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "playlistName" TEXT NOT NULL,
    "playlistUrl" TEXT NOT NULL,
    "playlistImageUrl" TEXT NOT NULL,
    "playlistOwnerName" TEXT NOT NULL,
    "playlistOwnerUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "vector" DECIMAL(65,30)[],

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_playlistId_key" ON "Playlist"("playlistId");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("playlistId") ON DELETE RESTRICT ON UPDATE CASCADE;
