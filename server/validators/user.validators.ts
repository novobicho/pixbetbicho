import { z } from 'zod';

// Validator para registro de usuário
export const registerUserValidator = z.object({
    username: z.string()
        .min(3, 'Username deve ter no mínimo 3 caracteres')
        .max(50, 'Username deve ter no máximo 50 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e underscore'),
    password: z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .max(100, 'Senha muito longa'),
    email: z.string().email('Email inválido').optional(),
    name: z.string().min(1, 'Nome é obrigatório').max(100).optional()
});

// Validator para login
export const loginValidator = z.object({
    username: z.string().min(1, 'Username é obrigatório'),
    password: z.string().min(1, 'Senha é obrigatória')
});

// Validator para atualizar perfil
export const updateProfileValidator = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional()
});

// Validator para bloquear usuário (admin)
export const blockUserValidator = z.object({
    blocked: z.boolean(),
    blockReason: z.string().optional()
});
