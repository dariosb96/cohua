-- ENUMS
CREATE TYPE "Side" AS ENUM ('LONG', 'SHORT');
CREATE TYPE "Result" AS ENUM ('WIN', 'LOSS', 'BE');
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- USER
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- ACCOUNT
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DECIMAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- TRADE
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" "Side" NOT NULL,

    "entry" DECIMAL NOT NULL,
    "exit" DECIMAL,
    "stopLoss" DECIMAL NOT NULL,
    "takeProfit" DECIMAL,
    "size" DECIMAL NOT NULL,

    "risk" DECIMAL,
    "reward" DECIMAL,
    "rr" DECIMAL,
    "pnl" DECIMAL,
    "fee" DECIMAL,
    "balanceAfter" DECIMAL,

    "status" "TradeStatus" NOT NULL DEFAULT 'OPEN',
    "result" "Result",

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    "accountId" TEXT NOT NULL,
    "setupId" TEXT,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Trade_accountId_createdAt_idx" ON "Trade"("accountId", "createdAt");

-- SETUP
CREATE TABLE "Setup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Setup_pkey" PRIMARY KEY ("id")
);

-- TAG
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- TRADE TAG
CREATE TABLE "TradeTag" (
    "tradeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TradeTag_pkey" PRIMARY KEY ("tradeId","tagId")
);

-- RELACIONES
ALTER TABLE "Account"
ADD CONSTRAINT "Account_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Trade"
ADD CONSTRAINT "Trade_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "Account"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Trade"
ADD CONSTRAINT "Trade_setupId_fkey"
FOREIGN KEY ("setupId") REFERENCES "Setup"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Setup"
ADD CONSTRAINT "Setup_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TradeTag"
ADD CONSTRAINT "TradeTag_tradeId_fkey"
FOREIGN KEY ("tradeId") REFERENCES "Trade"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TradeTag"
ADD CONSTRAINT "TradeTag_tagId_fkey"
FOREIGN KEY ("tagId") REFERENCES "Tag"("id")
ON DELETE CASCADE ON UPDATE CASCADE;