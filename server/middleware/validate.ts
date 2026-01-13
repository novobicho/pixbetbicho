import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import logger from '../logger';

export function validate(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validar o body da requisição
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                logger.warn('Validation error', {
                    path: req.path,
                    errors
                });

                return res.status(400).json({
                    message: 'Dados inválidos',
                    errors
                });
            }

            logger.error('Unexpected validation error', { error });
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    };
}
