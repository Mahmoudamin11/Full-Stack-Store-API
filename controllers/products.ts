import "express-async-errors";
import type { Request, Response } from "express";

import product, { ProductDocument } from "../models/product.js";

type ProductQuery = Omit<Partial<ProductDocument>, "name"> & { name?: RegExp } & {[key:string] : any};

export const getAllProductsStatic = async (req: Request, res: Response) => {
  const products = await product
    .find({ price: { $gt: 30 } })
    .select("name price")
    .sort({ price: 1 })
    .skip(4)
    .limit(4);
  res.status(200).json({ products, nbHits: products.length }); // number of total porducts
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject: ProductQuery = {};

  if (featured) queryObject.featured = featured == "true" ? true : false;

  if (name != undefined && typeof name == "string")
    queryObject.name = new RegExp(name, "i");

  if (company && typeof company == "string") queryObject.company = company;
  
  
    if (numericFilters) { 
      const operatorMap : Record<string, string> = { 
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      }
      const regExp = /(>=|<=|>|<|=)/g;
      let filters = (numericFilters as string).replace(regExp, (match:string) => `-${operatorMap[match]}-`)
  
      console.log(filters);
  
      const options = ['price', 'rating']
      const parts = filters.split(',')
      console.log("Parts", parts);
      
      parts.forEach((query:string) => {
        const [field, operator, value] = query.split('-')
  
        if (options.includes(field)) { 
            queryObject[field] = {[operator]: Number(value)}
        }
      })
      console.log(queryObject);
      
    }
  const result = product.find(queryObject); // still a mongoose query so that u can sort it below or do anything else
  if (sort && typeof sort == "string") {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList); // still a query here
  }

  if (fields && typeof fields == "string") {
    const fieldsList = fields.split(",").join(" ");
    result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = page == 1 ? limit : (page - 1) * limit;
  result.skip(skip).limit(limit);
  


  const products = await result; // await for it and it returns a plain JS array

  res.status(200).json({ products, nbHits: products.length });
};
