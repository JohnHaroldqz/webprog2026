import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import cors from "cors";
import aboutRoutes from './routes/aboutRoutes.ts';
import productRoutes from './routes/productRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import { logger } from './middlewares/logger.ts';
import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from './db.ts';
import postRoutes from './routes/postRoutes.ts';
import orderRoutes from './routes/orderRoutes.ts';
import commentsRoutes from './routes/commentRoutes.ts';

process.loadEnvFile()

export const app: Application = express();
const corsMW = cors()
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: ['http://localhost:4000', 'http://localhost:5173', 'https://www.deploymenthost.com'],
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions))
app.use(express.json())

// Middleware to log HTTP requests
app.use((req, res, next) => {
  logger.warn(`${req.method} ${req.url} ${req.ip} "${req.get('user-agent')}"`);
  //console.log(`manual console log: ${req.method} ${req.url}`)
  next();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).send('Internal Server Error');
});

//Routes
app.use('/about', aboutRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/comments', commentsRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with TypeScript and Express!');
});

console.log('Environment: ' + process.env.NODE_ENV)
if (process.env.NODE_ENV !== "test") {
  await connectToDatabase();
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
  process.on("SIGINT", async () => {
    await disconnectFromDatabase();
    console.log("Server shutting down");
    process.exit(0);
  });
}