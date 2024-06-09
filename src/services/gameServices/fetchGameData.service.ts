import { BadRequestError } from "../../responses/customApiError";
import { InfoGame } from "../../types";
import { parseTitle } from "../../utils/game.utils";
import { gameIgdbQueries } from "../../utils/igdbQueries";

export const getGameInfoFromIgdb = async (
  title: string,
): Promise<InfoGame[]> => {
  if (!title) {
    throw new BadRequestError("Title cannot be undefined");
  }
  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Client-ID": `${process.env.CLIENT_ID}`,
      "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: `search "${parseTitle(title)}"+${gameIgdbQueries}`,
  });

  const data: InfoGame[] = await res.json();

  const filterVersions: InfoGame[] = await data.filter((game: InfoGame) => {
    return (
      !game.version_title &&
      !game.keywords?.some(
        (keyword: any) =>
          keyword.name.includes("fanmade") || keyword.name.includes("fangame"),
      )
    );
  });

  return filterVersions;
};
