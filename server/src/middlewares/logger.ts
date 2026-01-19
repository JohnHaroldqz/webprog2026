import { createLogger, format, Logger, transports } from "winston";

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

export const logger: Logger = createLogger({
  level: level(),
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
})