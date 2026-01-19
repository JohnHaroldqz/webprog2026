import express, { type Application, type Request, type Response } from "express";
import { randomBytes } from "node:crypto";
import aboutRoutes from "./routes/aboutRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";

process.loadEnvFile();


const app: Application = express();
const port = process.env.PORT || 4000;

// Routes
app.use('/about', aboutRoutes);
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript and Express!!!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});