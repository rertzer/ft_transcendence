-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "game_won" INTEGER,
    "game_lost" INTEGER,
    "game_played" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFA" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "qr_code" TEXT NOT NULL,
    "ascii_secret" TEXT NOT NULL,
    "authenticator" TEXT NOT NULL,

    CONSTRAINT "TwoFA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "friendship_status" TEXT,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL,
    "player_one_id" INTEGER NOT NULL,
    "player_two_id" INTEGER NOT NULL,
    "winner_id" INTEGER,
    "game_status" TEXT,
    "player_one_score" INTEGER,
    "player_two_score" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatChannels" (
    "id" INTEGER NOT NULL,
    "owner" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "ChatChannels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatChannelsUser" (
    "id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_role" TEXT NOT NULL,

    CONSTRAINT "ChatChannelsUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMsgHistory" (
    "id" INTEGER NOT NULL,
    "chat_channels_id" INTEGER NOT NULL,
    "chat_channels_user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "ChatMsgHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMsg" (
    "id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "msg_status" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "DirectMsg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "blocked_user_id" INTEGER NOT NULL,
    "date_blocked" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);
