import {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";

const notFound = (_req:Request, res:Response) => {
    return res.status(StatusCodes.NOT_FOUND).send("Route does not exist");
}

export default notFound