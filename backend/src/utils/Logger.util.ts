import path from 'path';
import winston from 'winston';

// Winston logger configuration
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message} ${stack ? `\nStack: ${stack}` : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'error.log') })
  ]
});

export default logger;
