import { Request,Response } from "express";
import { findAllGamesByName, findOneGameByName } from "../services/game.service";

export const getOneGame = async(req:Request, res:Response)=>{
    const {title} = req.body;
    const data = await findOneGameByName(title);
    return res.status(200).json({data})
}

export const getAllGamesMatchesWithName = async (req:Request, res:Response)=>{
    const {title} = req.body;
    const data = await findAllGamesByName(title);
    return res.status(200).json({data})
}