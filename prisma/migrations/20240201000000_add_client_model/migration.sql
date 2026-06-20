-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "segment" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "images" JSONB NOT NULL DEFAULT '[]',
    "technologies" TEXT[],
    "metrics" JSONB NOT NULL DEFAULT '[]',
    "linkDemo" TEXT,
    "linkGithub" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);