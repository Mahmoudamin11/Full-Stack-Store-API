import "dotenv/config";

import express from "express";
import connectDB from "./db/connect.js";
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import productsRrouter from "./routes/products.js"

const app = express();

const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send(`<h1>Store API</h1><a href="api/v1/products">Products</a>`);
});

app.use('/api/v1/products', productsRrouter)

app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(port, () => console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
