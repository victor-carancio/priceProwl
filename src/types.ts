export interface gamesSearch{
    appid:string,
    name:string,
    icon:string,
    logo:string
}

export interface steamPrice{
    name:string,
    steam_appid:number,
    header_image:string,
    price_overview:{
        currency:string,
        initial:number,
        final:number,
        discount_percent:number,
        inital_formatted:string,
        final_formatted:string
    }
}

export interface epicGames{
    gameName:string | null,
    typeS:string | null,
    url:string | null,
    discount_percent:string | null,
    inital_price:string | null,
    final_price:string | null
    
}