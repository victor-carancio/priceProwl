import { GameInfoAndPrices } from "../types";
import {
  Game,
  StoreGame,
  StorePrice,
  InfoGame,
  AgeRating,
  AlternativeName,
  Artwork,
  GameEngine,
  Genre,
  InvolvedCompany,
  Company,
  CompanyLogo,
  Language,
  LanguageSupport,
  PlatformLogo,
  Screenshot,
  Video,
  PlayerPerspective,
  ReleaseDate,
  Platform,
  Keyword,
} from "../entities/index.entity";

export const storeGameData = async (gamesData: GameInfoAndPrices[]) => {
  for (const game of gamesData) {
    //todo: comprobar que el juego ya existe

    let newGame = await Game.findOneBy({ gameName: game.gameName });
    if (!newGame) {
      newGame = new Game();
      newGame.gameName = game.gameName;
      newGame.stores = [];
    }

    for (const store of game.stores) {
      const existingStore = newGame.stores.find(
        (el) => el.store === store.store
      );

      if (!existingStore) {
        const newStore = new StoreGame();
        newStore.store = store.store;
        newStore.info = [];

        newGame.stores = [...(newGame.stores || []), newStore];
      }

      const newStoreInfo = new StorePrice();
      newStoreInfo.url = store.info.url;

      newStoreInfo.discount_percent = store.info.discount_percent || "-";
      newStoreInfo.initial_price = store.info.initial_price || "-";
      newStoreInfo.final_price = store.info.final_price || "-";
      newStoreInfo.edition = store.info.edition;

      const targetStore =
        existingStore || newGame.stores.find((el) => el.store === store.store);

      if (targetStore) {
        const existingPrice = targetStore.info.find(
          (price) =>
            price.initial_price === newStoreInfo.initial_price &&
            price.discount_percent === newStoreInfo.discount_percent &&
            price.final_price === newStoreInfo.final_price &&
            price.edition === newStoreInfo.edition
        );

        if (!existingPrice) {
          targetStore.info = [...(targetStore.info || []), newStoreInfo];
        }
      }
    }

    if (!game.infoGame || game.infoGame.length <= 0) {
      await newGame.save();
      continue;
    }

    for (const info of game.infoGame) {
      const newInfoGame = new InfoGame();
      newInfoGame.id = info.id;
      newInfoGame.name = info.name;
      newInfoGame.storyline = info.storyline;
      newInfoGame.summary = info.summary;
      newInfoGame.first_release_date = info.first_release_date;
      newInfoGame.version_title = info.version_title || "-";

      newInfoGame.cover = {
        id: info.cover.id,
        height: info.cover.height,
        url: info.cover.url,
        width: info.cover.width,
      };

      for (const age_rating of info.age_ratings) {
        const newAgeRating = new AgeRating();
        newAgeRating.id = age_rating.id;
        newAgeRating.category = age_rating.category;
        newAgeRating.rating = age_rating.rating;

        newAgeRating.synopsis = age_rating.synopsis || "-";
        newInfoGame.age_ratings = [
          ...(newInfoGame.age_ratings || []),
          newAgeRating,
        ];
        await newAgeRating.save();
      }

      for (const alternative_name of info.alternative_names) {
        const newAlternativeName = new AlternativeName();
        newAlternativeName.id = alternative_name.id;
        newAlternativeName.comment = alternative_name.comment;
        newAlternativeName.name = alternative_name.name;

        newInfoGame.alternative_names = [
          ...(newInfoGame.alternative_names || []),
          newAlternativeName,
        ];
        await newAlternativeName.save();
      }

      if ("artwork" in info) {
        for (const artwork of info.artworks) {
          const newArtwork = new Artwork();
          newArtwork.id = artwork.id;
          newArtwork.height = artwork.height;
          newArtwork.url = artwork.url;
          newArtwork.width = artwork.width;

          newInfoGame.artworks = [...(newInfoGame.artworks || []), newArtwork];
          await newArtwork.save();
        }
      }

      if ("game_engines" in info) {
        for (const gameEngine of info.game_engines) {
          const newGameEngine = new GameEngine();
          newGameEngine.id = gameEngine.id;
          newGameEngine.name = gameEngine.name;

          newInfoGame.game_engines = [
            ...(newInfoGame.game_engines || []),
            newGameEngine,
          ];
          await newGameEngine.save();
        }
      }

      for (const genre of info.genres) {
        const newGenre = new Genre();
        newGenre.id = genre.id;
        newGenre.name = genre.name;

        newInfoGame.genres = [...(newInfoGame.genres || []), newGenre];
        await newGenre.save();
      }

      for (const involved_company of info.involved_companies) {
        const newInvolvedCompany = new InvolvedCompany();
        newInvolvedCompany.id = involved_company.id;
        newInvolvedCompany.developer = involved_company.developer;
        newInvolvedCompany.porting = involved_company.porting;
        newInvolvedCompany.publisher = involved_company.publisher;
        newInvolvedCompany.supporting = involved_company.supporting;

        let company = await Company.findOneBy({
          id: involved_company.company.id,
        });
        console.log(involved_company.id);
        console.log("-----------------------------");
        console.log(company);

        if (!company) {
          console.log(`no entra ${company}`);
          const newCompany = new Company();
          newCompany.id = involved_company.company.id;
          newCompany.country = involved_company.company.country;
          newCompany.name = involved_company.company.name;
          newCompany.start_date = involved_company.company.start_date;

          if ("logo" in involved_company.company) {
            const newCompanyLogo = new CompanyLogo();
            newCompanyLogo.id = involved_company.company.logo.id;
            newCompanyLogo.height = involved_company.company.logo.height;
            newCompanyLogo.url = involved_company.company.logo.url;
            newCompanyLogo.width = involved_company.company.logo.width;

            newCompany.logo = newCompanyLogo;
            await newCompanyLogo.save();
          }

          company = newCompany;
          await newCompany.save();
        }

        newInvolvedCompany.company = company;

        newInfoGame.involved_companies = [
          ...(newInfoGame.involved_companies || []),
          newInvolvedCompany,
        ];
        await newInvolvedCompany.save();
      }

      for (const keyword of info.keywords) {
        const newKeyword = new Keyword();
        newKeyword.id = keyword.id;
        newKeyword.name = keyword.name;

        newInfoGame.keywords = [...(newInfoGame.keywords || []), newKeyword];
        await newKeyword.save();
      }

      for (const platform of info.platforms) {
        let currPlatform = await Platform.findOneBy({ id: platform.id });

        if (!currPlatform) {
          const newPlatform = new Platform();
          newPlatform.id = platform.id;
          newPlatform.abbreviation = platform.abbreviation;
          newPlatform.alternative_name = platform.alternative_name;
          newPlatform.name = platform.name;

          const platformLogo = new PlatformLogo();
          platformLogo.id = platform.platform_logo.id;
          platformLogo.height = platform.platform_logo.height;
          platformLogo.url = platform.platform_logo.url;
          platformLogo.width = platform.platform_logo.width;

          newPlatform.platform_logo = platformLogo;

          currPlatform = newPlatform;
          await newPlatform.save();
        }

        newInfoGame.platforms = [
          ...(newInfoGame.platforms || []),
          currPlatform,
        ];
      }

      for (const playerPerspective of info.player_perspectives) {
        const newPlayerPerspective = new PlayerPerspective();
        newPlayerPerspective.id = playerPerspective.id;
        newPlayerPerspective.name = playerPerspective.name;

        newInfoGame.player_perspective = [
          ...(newInfoGame.player_perspective || []),
          newPlayerPerspective,
        ];
        await newPlayerPerspective.save();
      }

      for (const releaseDate of info.release_dates) {
        const newReleaseDate = new ReleaseDate();
        newReleaseDate.id = releaseDate.id;
        newReleaseDate.category = releaseDate.category;
        newReleaseDate.date = releaseDate.date;
        newReleaseDate.region = releaseDate.region;

        let platform = await Platform.findOneBy({
          id: releaseDate.platform.id,
        });

        if (!platform) {
          const newPlatform = new Platform();
          newPlatform.id = releaseDate.platform.id;
          newPlatform.abbreviation = releaseDate.platform.abbreviation;
          newPlatform.alternative_name = releaseDate.platform.alternative_name;
          newPlatform.name = releaseDate.platform.name;

          const platformLogo = new PlatformLogo();
          platformLogo.id = releaseDate.platform.platform_logo.id;
          platformLogo.height = releaseDate.platform.platform_logo.height;
          platformLogo.url = releaseDate.platform.platform_logo.url;
          platformLogo.width = releaseDate.platform.platform_logo.width;

          newPlatform.platform_logo = platformLogo;

          platform = newPlatform;
          await platformLogo.save();
          await newPlatform.save();
        }

        newReleaseDate.platform = platform;
        newInfoGame.release_dates = [
          ...(newInfoGame.release_dates || []),
          newReleaseDate,
        ];
        await newReleaseDate.save();
      }

      for (const screenshot of info.screenshots) {
        const newScreenshot = new Screenshot();
        newScreenshot.id = screenshot.id;
        newScreenshot.height = screenshot.height;
        newScreenshot.url = screenshot.url;
        newScreenshot.width = screenshot.width;

        newInfoGame.screenshots = [
          ...(newInfoGame.screenshots || []),
          newScreenshot,
        ];
        await newScreenshot.save();
      }

      for (const video of info.videos) {
        const newVideo = new Video();
        newVideo.id = video.id;
        newVideo.name = video.name;
        newVideo.video_id = video.video_id;

        newInfoGame.videos = [...(newInfoGame.videos || []), newVideo];
        await newVideo.save();
      }

      if ("languague_supports" in info) {
        for (const languageSupport of info.language_supports) {
          const newLanguageSupport = new LanguageSupport();
          newLanguageSupport.id = languageSupport.id;

          let language = await Language.findOneBy({
            id: languageSupport.language.id,
          });

          if (!language) {
            const newLanguage = new Language();
            newLanguage.id = languageSupport.language.id;
            newLanguage.name = languageSupport.language.name;
            newLanguage.native_name = languageSupport.language.native_name;
            newLanguage.locale = languageSupport.language.locale;

            language = newLanguage;
            await newLanguage.save();
          }

          newLanguageSupport.language = language;
          newInfoGame.language_supports = [
            ...(newInfoGame.language_supports || []),
            newLanguageSupport,
          ];
          await newLanguageSupport.save();
        }
      }

      newGame.infoGame = [...(newGame.infoGame || []), newInfoGame];
      await newInfoGame.save();
    }

    //TODO: agregar condicion si infogame ya existe

    await newGame.save();
    const allGames = await Game.find();
    for (const game of allGames) {
      console.log(game.infoGame);
    }
  }
};

// const saveNewStorePrice = (game:GameInfoAndPrices, newGame:Game)=>{

//   for (const store of game.stores) {
//     const newStore = new StoreGame();
//     newStore.store = store.store;

//     const newStoreInfo = new StorePrice();
//     newStoreInfo.url = store.info.url;

//     newStoreInfo.discount_percent = store.info.discount_percent || "-";
//     newStoreInfo.initial_price = store.info.initial_price || "-";
//     newStoreInfo.final_price = store.info.final_price || "-";
//     newStoreInfo.edition = store.info.edition;

//     newStore.info = [newStoreInfo];
//     newGame.stores = [...(newGame.stores || []), newStore];
//   }
// }
