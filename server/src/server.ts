import express, { type Application, type Request, type Response } from "express";
import { randomBytes } from "node:crypto";

const app: Application = express();
const port = 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript and Express!");
});

app.get('/about', (req, res) => {
  res.send('This is the about page.');
});

app.get('/products', (req, res) => {
  res.send('This is the products page.');
});

type UserType = {
    id: number,
    firstName: string,
    lastName: string,
}

const users: UserType[] = [
  { "id": 1, "firstName": "Ainer", "lastName": "D" },
  { "id": 2, "firstName": "Harold", "lastName": "D" },
  { "id": 3, "firstName": "Ryza", "lastName": "D" }
];

function shuffleArray(array: UserType[]) {
  let currentIndex = array.length
  while (0 !== currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    const temporaryValue = array[currentIndex];
    if (temporaryValue && array[randomIndex]) {
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }
    }
    return array;
  }

app.get('/api/users', (req, res) => {
    shuffleArray(users);
  res.status(200).json(users);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });