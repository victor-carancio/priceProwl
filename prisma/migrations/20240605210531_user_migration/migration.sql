-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGameWishList" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserGameWishList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "gameName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreGame" (
    "id" SERIAL NOT NULL,
    "store" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "gamepass" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "StoreGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorePrice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discount_percent" TEXT NOT NULL DEFAULT '-',
    "initial_price" TEXT NOT NULL DEFAULT '-',
    "final_price" TEXT NOT NULL DEFAULT '-',
    "offer_end_date" TIMESTAMP(3),
    "store_game_id" INTEGER NOT NULL,

    CONSTRAINT "StorePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameOnInfoGame" (
    "game_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "GameOnInfoGame_pkey" PRIMARY KEY ("game_id","info_game_id")
);

-- CreateTable
CREATE TABLE "InfoGame" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "first_release_date" TEXT,
    "storyline" TEXT,
    "summary" VARCHAR(3500),
    "version_title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfoGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cover" (
    "id" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgeRatings" (
    "id" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "synopsis" VARCHAR(3500),
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "AgeRatings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlternativeName" (
    "id" INTEGER NOT NULL,
    "comment" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "AlternativeName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlternativeNameOnInfoGame" (
    "alternative_name_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "AlternativeNameOnInfoGame_pkey" PRIMARY KEY ("alternative_name_id","info_game_id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "id" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEngine" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GameEngine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEngineOnInfoGame" (
    "game_engine_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "GameEngineOnInfoGame_pkey" PRIMARY KEY ("game_engine_id","info_game_id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenreOnInfoGame" (
    "genre_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "GenreOnInfoGame_pkey" PRIMARY KEY ("genre_id","info_game_id")
);

-- CreateTable
CREATE TABLE "InvolvedCompany" (
    "id" INTEGER NOT NULL,
    "developer" BOOLEAN NOT NULL,
    "porting" BOOLEAN NOT NULL,
    "publisher" BOOLEAN NOT NULL,
    "supporting" BOOLEAN NOT NULL,
    "company_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "InvolvedCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL,
    "country" INTEGER,
    "name" TEXT NOT NULL,
    "start_date" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyLogo" (
    "id" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "CompanyLogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordOnInfoGame" (
    "keyword_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "KeywordOnInfoGame_pkey" PRIMARY KEY ("keyword_id","info_game_id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" INTEGER NOT NULL,
    "abbreviation" TEXT,
    "alternative_name" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformLogo" (
    "id" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "platform_id" INTEGER NOT NULL,

    CONSTRAINT "PlatformLogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformOnInfoGame" (
    "platform_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "PlatformOnInfoGame_pkey" PRIMARY KEY ("platform_id","info_game_id")
);

-- CreateTable
CREATE TABLE "PlayerPerspective" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PlayerPerspective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerPerspectiveOnInfoGame" (
    "player_perspective_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "PlayerPerspectiveOnInfoGame_pkey" PRIMARY KEY ("player_perspective_id","info_game_id")
);

-- CreateTable
CREATE TABLE "ReleaseDate" (
    "id" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "region" INTEGER NOT NULL,
    "platform_id" INTEGER NOT NULL,

    CONSTRAINT "ReleaseDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screenshot" (
    "id" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "Screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageSupport" (
    "id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "LanguageSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "native_name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserGameWishList_game_id_user_id_key" ON "UserGameWishList"("game_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cover_info_game_id_key" ON "Cover"("info_game_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyLogo_company_id_key" ON "CompanyLogo"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformLogo_platform_id_key" ON "PlatformLogo"("platform_id");

-- AddForeignKey
ALTER TABLE "UserGameWishList" ADD CONSTRAINT "UserGameWishList_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGameWishList" ADD CONSTRAINT "UserGameWishList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreGame" ADD CONSTRAINT "StoreGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorePrice" ADD CONSTRAINT "StorePrice_store_game_id_fkey" FOREIGN KEY ("store_game_id") REFERENCES "StoreGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameOnInfoGame" ADD CONSTRAINT "GameOnInfoGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameOnInfoGame" ADD CONSTRAINT "GameOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cover" ADD CONSTRAINT "Cover_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgeRatings" ADD CONSTRAINT "AgeRatings_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternativeNameOnInfoGame" ADD CONSTRAINT "AlternativeNameOnInfoGame_alternative_name_id_fkey" FOREIGN KEY ("alternative_name_id") REFERENCES "AlternativeName"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternativeNameOnInfoGame" ADD CONSTRAINT "AlternativeNameOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEngineOnInfoGame" ADD CONSTRAINT "GameEngineOnInfoGame_game_engine_id_fkey" FOREIGN KEY ("game_engine_id") REFERENCES "GameEngine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEngineOnInfoGame" ADD CONSTRAINT "GameEngineOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreOnInfoGame" ADD CONSTRAINT "GenreOnInfoGame_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreOnInfoGame" ADD CONSTRAINT "GenreOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvolvedCompany" ADD CONSTRAINT "InvolvedCompany_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvolvedCompany" ADD CONSTRAINT "InvolvedCompany_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyLogo" ADD CONSTRAINT "CompanyLogo_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordOnInfoGame" ADD CONSTRAINT "KeywordOnInfoGame_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "Keyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordOnInfoGame" ADD CONSTRAINT "KeywordOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformLogo" ADD CONSTRAINT "PlatformLogo_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformOnInfoGame" ADD CONSTRAINT "PlatformOnInfoGame_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformOnInfoGame" ADD CONSTRAINT "PlatformOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPerspectiveOnInfoGame" ADD CONSTRAINT "PlayerPerspectiveOnInfoGame_player_perspective_id_fkey" FOREIGN KEY ("player_perspective_id") REFERENCES "PlayerPerspective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPerspectiveOnInfoGame" ADD CONSTRAINT "PlayerPerspectiveOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseDate" ADD CONSTRAINT "ReleaseDate_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screenshot" ADD CONSTRAINT "Screenshot_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageSupport" ADD CONSTRAINT "LanguageSupport_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageSupport" ADD CONSTRAINT "LanguageSupport_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
