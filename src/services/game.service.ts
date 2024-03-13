import { BadRequestError } from "../responses/customApiError";
import { steamPrice } from "../types";
// import { steamPrice } from "../types";

import { isString } from "../utils/validation";
import { getDataFromUrl } from "./gettingData.service";



export const findOneGameByName = async (title:string) : Promise<steamPrice> =>{

    if(!isString(title)){
        throw new BadRequestError("invalid field");
    }

    const gameData = await getDataFromUrl(title);
    const {name,steam_appid,header_image,price_overview} = gameData[0].data
    
    return {name,steam_appid,header_image,price_overview}
    
}

export const findAllGamesByName = async (title:string):Promise<steamPrice[]>=>{
    if(!isString(title)){
        throw new BadRequestError("invalid field");
    }

    const gameData = await getDataFromUrl(title);
    const gamesPrices = gameData.map((game)=>{
        const {name,steam_appid,header_image,price_overview} = game.data;
        return {name,steam_appid,header_image,price_overview}
    })
    return gamesPrices
}