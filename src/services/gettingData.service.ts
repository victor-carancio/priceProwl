import { BadRequestError, NotFoundError } from "../responses/customApiError";
import { InfoGame, gamesSearch } from "../types";
import { parseTitle, parseUrl } from "../utils/game.utils";
import { gameIgdbQueries } from "../utils/igdbQueries";

const steamIdUrl = "https://store.steampowered.com/api/appdetails?appids=";
const steamNameUrl = "https://steamcommunity.com/actions/SearchApps/";

export const getDataFromUrl = async (title: string) => {
  const gameIds = await fetch(steamNameUrl + parseUrl(title, "%20"));
  const gameIdsRes: gamesSearch[] = await gameIds.json();
  const gameList = gameIdsRes.filter((game) =>
    game.name.toLowerCase().includes(title.trim())
  );

  if (
    gameList.length &&
    gameIdsRes.length === 0 &&
    !gameIdsRes[0].name.toLowerCase().includes(title.trim())
  ) {
    throw new NotFoundError("Game Not found ");
  }

  const gamesToGet: gamesSearch[] =
    gameList.length > 0 ? [...gameList] : [...gameIdsRes];

  const gameData = await getDataFromArrayOfGames(gamesToGet);

  return gameData.map((game) => {
    const key = Object.keys(game);
    const gameId = gamesToGet.filter((curr) => key[0] === curr.appid);
    return game[gameId[0].appid];
  });
};

export const getDataFromArrayOfGames = async (games: gamesSearch[]) => {
  const gameData = games.map(async (game) => {
    const res = await fetch(steamIdUrl + game.appid + "&cc=&l=spanish");
    const data = await res.json();
    return data;
  });
  const gamePromises = await Promise.all(gameData);
  return gamePromises;
};

export const getGameInfoFromIgdb = async (
  title: string
): Promise<InfoGame[]> => {
  if (!title) {
    throw new BadRequestError("Title cannot be undefined");
  }
  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": `${process.env.CLIENT_ID}`,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: `search "${parseTitle(title)}"+${gameIgdbQueries}`,
  });

  const data: InfoGame[] = await res.json();

  const filterVersions: InfoGame[] = await data.filter((game: InfoGame) => {
    return (
      !game.version_title &&
      !game.keywords?.some(
        (keyword: any) =>
          keyword.name.includes("fanmade") || keyword.name.includes("fangame")
      )
    );
  });

  return filterVersions;
};

// const getPlatforms = async (platformsList: any) => {
//   const platformToString: [] = platformsList.map((platform: number) =>
//     platform.toString()
//   );

//   const res = await fetch("https://api.igdb.com/v4/platforms", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Client-ID": `${process.env.CLIENT_ID}`,
//       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//     },
//     body: `fields name; where id = (${platformToString.join(",")});`,
//   });
//   const platformName = await res.json();

//   return platformName;
// };

// const getArtworks = async (artworksList: any) => {
//   const artworkToString: [] = artworksList.map((platform: number) =>
//     platform.toString()
//   );

//   const res = await fetch("https://api.igdb.com/v4/artworks", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Client-ID": `${process.env.CLIENT_ID}`,
//       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//     },
//     body: `fields url, image_id,width,height,image_id; where id = (${artworkToString.join(
//       ","
//     )});`,
//   });
//   const artworkName = await res.json();

//   return artworkName;
// };

// const getGenres = async (genresList: any) => {
//   const genresToString: [] = genresList.map((genre: number) =>
//     genre.toString()
//   );

//   const res = await fetch("https://api.igdb.com/v4/genres", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Client-ID": `${process.env.CLIENT_ID}`,
//       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//     },
//     body: `fields name,url; where id = (${genresToString.join(",")});`,
//   });
//   const genresName = await res.json();

//   return genresName;
// };

// const getInvolvedCompanies = async (companiesList: any) => {
//   const companiesToString: [] = companiesList.map((company: number) =>
//     company.toString()
//   );

//   const res = await fetch("https://api.igdb.com/v4/involved_companies", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Client-ID": `${process.env.CLIENT_ID}`,
//       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//     },
//     body: `fields company, porting, publisher, developer; where id = (${companiesToString.join(
//       ","
//     )});`,
//   });
//   const companies = await res.json();
//   const companyName = companies.map(async (curr: any) => {
//     const company = await getCompany(curr.company);
//     return { ...curr, company };
//   });

//   const companiesNames = await Promise.all(companyName);

//   return companiesNames;
// };

// export const getCompany = async (company: any) => {
//   const res = await fetch("https://api.igdb.com/v4/companies", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Client-ID": `${process.env.CLIENT_ID}`,
//       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//     },
//     body: `fields name; where changed_company_id = ${company};`,
//   });
//   const companyName = await res.json();

//   return companyName;
// };

// const getScreenshots = async (screenshotsList: any) => {
//   const screenshotsToString: [] = screenshotsList.map((genre: number) =>
//     genre.toString()
//   );

//   const res = await fetch("https://api.igdb.com/v4/screenshots", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Client-ID": `${process.env.CLIENT_ID}`,
//       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//     },
//     body: `fields url; where id = (${screenshotsToString.join(",")});`,
//   });
//   const screenshots = await res.json();

//   return screenshots;
// };

// // const getRealeaseDates = async (datesList: any) => {
// //   const datesToString: [] = datesList.map((date: number) => date.toString());

// //   const res = await fetch("https://api.igdb.com/v4/release_dates", {
// //     method: "POST",
// //     headers: {
// //       Accept: "application/json",
// //       "Client-ID": `${process.env.CLIENT_ID}`,
// //       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
// //     },
// //     body: `date,region,platform,m,y,category; where id = (${datesToString.join(
// //       ","
// //     )});`,
// //   });
// //   const dates = await res.json();

// //   return dates;
// // };
