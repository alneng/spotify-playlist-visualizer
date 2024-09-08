-- CreateTable
CREATE TABLE "Access_Token" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Access_Token_pkey" PRIMARY KEY ("id")
);
