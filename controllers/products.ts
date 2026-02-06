import "express-async-errors";
import type { Request, Response } from "express";

import product from "../models/product.js";

type ProductQuery = { 
    featured?: boolean
    page?:number
    company?:string
}

export const getAllProductsStatic = async (req: Request, res: Response) => {
  const products = await product.find({ name: "utopia sofa" });
  res.status(200).json({ products, nbHits: products.length }); // number of total porducts
};

export const getAllProducts = async (req: Request, res: Response) => {
  const {featured, company} = req.query;
  const queryObject:ProductQuery = {}

  if (featured) { 
    queryObject.featured = featured == "true" ? true : false
  }
  if (company && typeof company == "string") { 
    queryObject.company = company
  }
  console.log(queryObject);
  
  const products = await product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};
