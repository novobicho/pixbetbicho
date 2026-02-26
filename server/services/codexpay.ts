// Usando fetch nativo do Node.js

export interface CodexPayConfig {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
}

export interface CodexPayPixPayment {
    amount: number;
    externalId: string;
    customerName: string;
    customerEmail: string;
    customerDocument: string;
    callbackUrl?: string;
}

export interface CodexPayPixResponse {
    id: string;
    status: string;
    amount: number;
    qrCode: string;
    transactionId: string;
}

export interface CodexPayWithdrawal {
    amount: number;
    name: string;
    document: string;
    externalId: string;
    pixKey: string;
    pixKeyType: 'CPF' | 'EMAIL' | 'PHONE' | 'RANDOM';
    description: string;
    callbackUrl?: string;
}

export interface CodexPayWithdrawalResponse {
    id: string;
    status: string;
    amount: number;
    fee: number;
}

export class CodexPayService {
    private config: CodexPayConfig;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;

    constructor(clientId: string, clientSecret: string) {
        this.config = {
            clientId,
            clientSecret,
            baseUrl: 'https://api.codexpay.app'
        };

        if (!this.config.clientId || !this.config.clientSecret) {
            throw new Error("CODEXPAY credentials not configured");
        }

        console.log('💎 CODEXPAY: Serviço configurado:', {
            baseUrl: this.config.baseUrl,
            clientId: this.config.clientId.substring(0, 10) + '...'
        });
    }

    private async getAccessToken(): Promise<string> {
        // Verificar se o token ainda é válido (assumindo 2 horas de validade padrão, com margem)
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            console.log('🔑 CODEXPAY: Obtendo novo token de acesso...');

            const response = await fetch(`${this.config.baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    client_id: this.config.clientId,
                    client_secret: this.config.clientSecret
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`CODEXPAY Auth Error: ${response.status} ${error}`);
            }

            const data = await response.json();

            this.accessToken = data.token;
            // Definimos uma expiração conservadora (1 hora)
            this.tokenExpiry = new Date(Date.now() + (60 * 60 * 1000));

            console.log('✅ CODEXPAY: Token de acesso obtido com sucesso!');
            return this.accessToken!;
        } catch (error) {
            console.error('🔥 CODEXPAY: Erro ao obter token de acesso:', error);
            throw error;
        }
    }

    private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
        const accessToken = await this.getAccessToken();

        const headers: Record<string, string> = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        try {
            const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`CODEXPAY API Error: ${response.status} ${error}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`🔥 CODEXPAY: Erro na requisição ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    async createPixPayment(payment: CodexPayPixPayment): Promise<CodexPayPixResponse> {
        console.log('💎 CODEXPAY: Criando pagamento PIX:', {
            amount: payment.amount,
            externalId: payment.externalId
        });

        const payload = {
            amount: payment.amount,
            external_id: payment.externalId,
            clientCallbackUrl: payment.callbackUrl,
            payer: {
                name: payment.customerName,
                email: payment.customerEmail,
                document: payment.customerDocument
            }
        };

        try {
            const response = await this.makeRequest('/api/payments/deposit', 'POST', payload);

            const qrData = response.qrCodeResponse;

            console.log('✅ CODEXPAY: Pagamento PIX criado com sucesso:', {
                transactionId: qrData.transactionId,
                status: qrData.status
            });

            return {
                id: qrData.transactionId,
                status: qrData.status,
                amount: qrData.amount,
                qrCode: qrData.qrcode,
                transactionId: qrData.transactionId
            };
        } catch (error) {
            console.error('🔥 CODEXPAY: Erro ao criar pagamento PIX:', error);
            throw error;
        }
    }

    async createWithdrawal(withdrawal: CodexPayWithdrawal): Promise<CodexPayWithdrawalResponse> {
        console.log('💎 CODEXPAY: Criando saque PIX:', {
            amount: withdrawal.amount,
            pixKey: withdrawal.pixKey,
            externalId: withdrawal.externalId
        });

        const payload = {
            amount: withdrawal.amount,
            pix_key: withdrawal.pixKey,
            pix_key_type: withdrawal.pixKeyType.toLowerCase(),
            external_id: withdrawal.externalId,
            description: withdrawal.description,
            clientCallbackUrl: withdrawal.callbackUrl
        };

        try {
            const response = await this.makeRequest('/api/withdrawals/withdraw', 'POST', payload);

            const wData = response.withdrawal;

            console.log('✅ CODEXPAY: Saque PIX criado com sucesso:', {
                transactionId: wData.transactionId,
                status: wData.status
            });

            return {
                id: wData.transactionId,
                status: wData.status,
                amount: wData.amount,
                fee: wData.fee
            };
        } catch (error) {
            console.error('🔥 CODEXPAY: Erro ao criar saque PIX:', error);
            throw error;
        }
    }
}

// Factory para criar instâncias baseadas no banco de dados ou env
export async function createCodexPayService(gatewayId?: number): Promise<CodexPayService> {
    const { storage } = await import('../storage');

    if (gatewayId) {
        const gateway = await storage.getPaymentGateway(gatewayId);
        if (!gateway || gateway.type !== 'codexpay') {
            throw new Error('Gateway CODEXPAY não encontrado');
        }
        return new CodexPayService(gateway.apiKey || '', gateway.secretKey || '');
    } else {
        const gateways = await storage.getAllPaymentGateways();
        const codexpayGateway = gateways.find(g => g.type === 'codexpay' && g.isActive);

        if (codexpayGateway) {
            console.log('💎 CODEXPAY: Usando gateway do painel administrativo:', {
                gatewayId: codexpayGateway.id,
                name: codexpayGateway.name
            });
            return new CodexPayService(codexpayGateway.apiKey || '', codexpayGateway.secretKey || '');
        }

        // Fallback para env vars se não houver no banco
        const clientId = process.env.CODEXPAY_CLIENT_ID || '';
        const clientSecret = process.env.CODEXPAY_CLIENT_SECRET || '';

        if (!clientId || !clientSecret) {
            throw new Error('Configuração CODEXPAY não encontrada (DB ou ENV)');
        }

        return new CodexPayService(clientId, clientSecret);
    }
}

