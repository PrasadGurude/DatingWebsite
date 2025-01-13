-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'jony',
    "requestedIds" TEXT[],
    "matchStatus" BOOLEAN NOT NULL DEFAULT false,
    "matchId" TEXT NOT NULL DEFAULT '',
    "picture" TEXT,
    "age" INTEGER NOT NULL DEFAULT 18,
    "engYear" INTEGER NOT NULL DEFAULT 1,
    "branch" TEXT DEFAULT 'CE',
    "gender" TEXT,
    "insta_id" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
