import { z } from 'zod';

// Validator para criar aposta
export const createBetValidator = z.object({
    drawId: z.number().int().positive('ID do sorteio deve ser positivo'),
    gameModeId: z.number().int().positive('ID do modo de jogo deve ser positivo'),
    amount: z.number()
        .positive('Valor deve ser positivo')
        .min(0.5, 'Valor mínimo é R$ 0,50')
        .max(100000, 'Valor máximo é R$ 100.000'),
    type: z.string().min(1, 'Tipo de aposta é obrigatório'),
    animalId: z.number().int().positive().optional(),
    animalId2: z.number().int().positive().optional(),
    animalId3: z.number().int().positive().optional(),
    animalId4: z.number().int().positive().optional(),
    animalId5: z.number().int().positive().optional(),
    betNumbers: z.array(z.string()).optional(),
    premioType: z.string().optional(),
    useBonusBalance: z.boolean().optional(),
    potentialWinAmount: z.number().optional()
});

// Validator para atualizar resultado de aposta
export const updateBetResultValidator = z.object({
    status: z.enum(['pending', 'won', 'lost']),
    winAmount: z.number().nonnegative().optional()
});
