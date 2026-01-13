import type { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Log da requisição
    logger.info(`→ ${req.method} ${req.path}`, {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Interceptar o fim da resposta
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

        logger[logLevel](`← ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`, {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            contentLength: res.get('content-length')
        });
    });

    next();
}
