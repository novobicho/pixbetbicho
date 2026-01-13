import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato customizado para logs
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;

    // Adicionar stack trace se houver erro
    if (stack) {
        msg += `\n${stack}`;
    }

    // Adicionar metadados se houver
    if (Object.keys(metadata).length > 0) {
        msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return msg;
});

// Criar logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
        // Console (desenvolvimento)
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),

        // Arquivo de erros
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs', 'error.log'),
            level: 'error',
            format: combine(
                winston.format.json()
            ),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),

        // Arquivo combinado (todos os logs)
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs', 'combined.log'),
            format: combine(
                winston.format.json()
            ),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});

// Em produção, não logar no console (apenas em arquivos)
if (process.env.NODE_ENV === 'production') {
    logger.remove(logger.transports[0]); // Remove console transport
}

export default logger;
