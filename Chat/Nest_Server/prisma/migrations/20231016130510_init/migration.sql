-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
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
CREATE TABLE "ChatChannelsUser" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_role" TEXT NOT NULL,
    "date_joined" TIMESTAMP(3) NOT NULL,
    "date_left" TIMESTAMP(3),

    CONSTRAINT "ChatChannelsUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatChannels" (
    "id" SERIAL NOT NULL,
    "owner" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "ChatChannels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMsgHistory" (
    "id" SERIAL NOT NULL,
    "chat_channels_id" INTEGER NOT NULL,
    "chat_channels_user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "ChatMsgHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMsg" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "msg_status" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "DirectMsg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFA" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "qr_code" TEXT NOT NULL,
    "ascii_secret" TEXT NOT NULL,
    "authenticator" TEXT NOT NULL,

    CONSTRAINT "TwoFA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "friendship_status" TEXT,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player_one_id" INTEGER NOT NULL,
    "player_two_id" INTEGER NOT NULL,
    "winner_id" INTEGER,
    "game_status" TEXT,
    "player_one_score" INTEGER,
    "player_two_score" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "blocked_user_id" INTEGER NOT NULL,
    "date_blocked" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatChannelsUser_channel_id_key" ON "ChatChannelsUser"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatChannels_owner_key" ON "ChatChannels"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFA_user_id_key" ON "TwoFA"("user_id");

-- AddForeignKey
ALTER TABLE "ChatChannelsUser" ADD CONSTRAINT "chat_channels_user" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatChannelsUser" ADD CONSTRAINT "ChatChannelsUser_id_fkey" FOREIGN KEY ("id") REFERENCES "ChatChannels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatChannels" ADD CONSTRAINT "ChatChannels_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMsgHistory" ADD CONSTRAINT "ChatMsgHistory_chat_channels_id_fkey" FOREIGN KEY ("chat_channels_id") REFERENCES "ChatChannels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMsgHistory" ADD CONSTRAINT "ChatMsgHistory_chat_channels_user_id_fkey" FOREIGN KEY ("chat_channels_user_id") REFERENCES "ChatChannelsUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMsg" ADD CONSTRAINT "DirectMsg_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMsg" ADD CONSTRAINT "DirectMsg_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFA" ADD CONSTRAINT "TwoFA_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
