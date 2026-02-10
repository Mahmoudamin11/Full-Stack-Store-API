import "express-async-errors";
import type { Request, Response } from "express";

import product, { ProductDocument } from "../models/product.js";

type ProductQuery = Omit<Partial<ProductDocument>, "name"> & { name?: RegExp };

export const getAllProductsStatic = async (req: Request, res: Response) => {
  const products = await product.find({}).select('name price').sort('name').skip(4).limit(4)
  res.status(200).json({ products, nbHits: products.length }); // number of total porducts
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { featured, company, name, sort, fields } = req.query;
  const queryObject: ProductQuery = {};

  if (featured) queryObject.featured = featured == "true" ? true : false;

  if (name != undefined && typeof name == "string")
    queryObject.name = new RegExp(name, "i");

  if (company && typeof company == "string") queryObject.company = company;

  const result = product.find(queryObject); // still a mongoose query so that u can sort it below or do anything else

  if (sort && typeof sort == 'string') { 
    const sortList = (sort).split(',').join(' ')
    result.sort(sortList) // still a query here
  }

  if (fields && typeof fields == 'string') { 
    const fieldsList = (fields).split(',').join(' ')
    result.select(fieldsList)
  }
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip  = page == 1 ? limit : (page - 1) * limit
  result.skip(skip).limit(limit)

  // if (limit && typeof limit == 'string') { 
  //   const limitNumber = Number(limit)
  //   result.limit(limitNumber)
  // }


  const products = await result; // await for it and it returns a plain JS array

  res.status(200).json({ products, nbHits: products.length });
};
