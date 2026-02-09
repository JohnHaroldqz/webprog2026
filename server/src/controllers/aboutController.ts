import type { RequestHandler } from "express"
import { logger } from "../middlewares/logger.ts"

export const getAbout:RequestHandler = (req, res) => {
  res.send('The about page is working')
}

export const getError:RequestHandler = (req, res) => {
 //throw new Error("This is an error message")
    logger.error("Error message")  
    res.status(500).send('Internal Server Error');

}