import { NotFoundError } from "../responses/customApiError";
import { gamesSearch } from "../types";
import { parseUrl } from "../utils/game";

const steamIdUrl= "https://store.steampowered.com/api/appdetails?appids=";
const steamNameUrl ="https://steamcommunity.com/actions/SearchApps/";


export const getDataFromUrl = async (title:string) =>{

    const gameIds = await fetch(steamNameUrl+parseUrl(title))
    const gameIdsRes: gamesSearch[]= await gameIds.json();
    const gameList= gameIdsRes.filter((game)=> game.name.toLowerCase().includes(title.trim()))
   
    if( gameList.length &&gameIdsRes.length === 0 && !gameIdsRes[0].name.toLowerCase().includes(title.trim())){
       
        throw new NotFoundError("Game Not found ")
    }

    const gamesToGet:gamesSearch[] = gameList.length > 0 ?  [...gameList] : [...gameIdsRes]

    const gameData =  await getDataFromArrayOfGames(gamesToGet)
 
    return gameData.map((game)=>{
        const key = Object.keys(game)
        const gameId= gamesToGet.filter((curr) =>  key[0] === curr.appid)  
        return game[gameId[0].appid]  
    })
  
} 

export const getDataFromArrayOfGames = async(games:gamesSearch[])=>{
    const gameData = games.map(async (game)=>{
        const res = await fetch(steamIdUrl+game.appid+"&cc=&l=spanish")
        const data = await res.json()
        return data
    })
    const gamePromises = await Promise.all(gameData)
    return gamePromises

}