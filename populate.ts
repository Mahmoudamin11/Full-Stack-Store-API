import "dotenv/config";
import connectDB from "./db/connect.js";
import Product from "./models/product.js";
import jsonProducts from "./products.json" with { type: "json" }

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    // optional: clear collection first
    await Product.deleteMany();

    // insert JSON data
    await Product.create(jsonProducts as any);

    console.log("Database populated successfully ✅");
    process.exit(0);
  } catch (error: any) {
    console.error("ERROR NAME:", error?.name);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("FULL ERROR:", error);
    process.exit(1);
  }
};

start();
