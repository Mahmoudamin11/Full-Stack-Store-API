import "express-async-errors";
import { Request, Response } from "express";

export const getAllProductsStatic  = async (req:Request, res : Response) => { 
    throw new Error("Error here")
    res.status(200).json({msg:"Products testing route"})
}

export const getAllProducts  = async (req:Request, res : Response) => { 
    res.status(200).json({msg:"Products route"})
}

