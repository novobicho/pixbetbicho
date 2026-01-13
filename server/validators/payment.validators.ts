import { z } from 'zod';

// Validator para criar depósito
export const createDepositValidator = z.object({
    amount: z.number()
        .positive('Valor deve ser positivo')
        .min(1, 'Valor mínimo de depósito é R$ 1,00')
        .max(1000000, 'Valor máximo de depósito é R$ 1.000.000'),
    gatewayId: z.number().int().positive('Gateway de pagamento inválido')
});

// Validator para criar saque
export const createWithdrawalValidator = z.object({
    amount: z.number()
        .positive('Valor deve ser positivo')
        .min(1, 'Valor mínimo de saque é R$ 1,00'),
    pixKey: z.string().min(1, 'Chave PIX é obrigatória'),
    pixKeyType: z.enum(['cpf', 'cnpj', 'email', 'phone', 'random'], {
        errorMap: () => ({ message: 'Tipo de chave PIX inválido' })
    })
});

// Validator para processar saque (admin)
export const processWithdrawalValidator = z.object({
    status: z.enum(['approved', 'rejected']),
    rejectionReason: z.string().optional(),
    notes: z.string().optional()
});
