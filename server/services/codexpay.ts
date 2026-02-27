// CodexPay Payment Service
// API Base: https://api.codexpay.com.br
// Docs: https://api.codexpay.app/api-docs/

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
    fee?: number;
}

export class CodexPayService {
    private config: CodexPayConfig;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;

    constructor(clientId: string, clientSecret: string) {
        this.config = {
            clientId,
            clientSecret,
            // URL CORRETA da API CodexPay (mesma da documentação)
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
        // Verificar se o token ainda é válido (com margem de 5 min)
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
                throw new Error(`CODEXPAY Auth Error: ${response.status} - ${error}`);
            }

            const data = await response.json();

            if (!data.token) {
                throw new Error(`CODEXPAY: Token não recebido na resposta de autenticação`);
            }

            this.accessToken = data.token;
            // Token conservador: 55 minutos (JWT expira em 1h, renovamos antes)
            this.tokenExpiry = new Date(Date.now() + (55 * 60 * 1000));

            console.log('✅ CODEXPAY: Token de acesso obtido com sucesso! User:', data.user?.email || data.user?.name);
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
            const url = `${this.config.baseUrl}${endpoint}`;
            console.log(`📡 CODEXPAY: ${method} ${url}`, body ? JSON.stringify(body) : '');

            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            const responseText = await response.text();
            let responseData: any;

            try {
                responseData = JSON.parse(responseText);
            } catch {
                responseData = { raw: responseText };
            }

            if (!response.ok) {
                console.error(`🔥 CODEXPAY: Erro HTTP ${response.status} em ${method} ${endpoint}:`, responseData);
                throw new Error(`CODEXPAY API Error ${response.status}: ${responseText}`);
            }

            return responseData;
        } catch (error) {
            console.error(`🔥 CODEXPAY: Erro na requisição ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Criar pagamento PIX (depósito)
     * POST /api/payments/deposit
     * Retorna QR Code para o usuário pagar
     */
    async createPixPayment(payment: CodexPayPixPayment): Promise<CodexPayPixResponse> {
        console.log('💎 CODEXPAY: Criando pagamento PIX:', {
            amount: payment.amount,
            externalId: payment.externalId
        });

        // Remover caracteres não numéricos do CPF
        const cleanDocument = payment.customerDocument.replace(/\D/g, '');

        // Payload conforme documentação oficial
        const payload: any = {
            amount: payment.amount,
            external_id: payment.externalId,
            clientCallbackUrl: payment.callbackUrl,  // Campo correto: clientCallbackUrl
            payer: {
                name: payment.customerName,
                email: payment.customerEmail,
                document: cleanDocument
            }
        };

        try {
            const response = await this.makeRequest('/api/payments/deposit', 'POST', payload);

            // A API retorna: { message, qrCodeResponse: { transactionId, status, qrcode, amount } }
            const qrData = response.qrCodeResponse || response;

            if (!qrData) {
                throw new Error('CODEXPAY: Resposta inválida - qrCodeResponse não encontrado');
            }

            console.log('✅ CODEXPAY: Pagamento PIX criado com sucesso:', {
                transactionId: qrData.transactionId,
                status: qrData.status,
                hasQrCode: !!qrData.qrcode
            });

            return {
                id: qrData.transactionId,
                status: qrData.status || 'PENDING',
                amount: qrData.amount || payment.amount,
                qrCode: qrData.qrcode || '',   // qrcode = string base64 ou código EMV
                transactionId: qrData.transactionId
            };
        } catch (error) {
            console.error('🔥 CODEXPAY: Erro ao criar pagamento PIX:', error);
            throw error;
        }
    }

    /**
     * Solicitar saque via PIX
     * POST /api/withdrawals/withdraw
     * Parâmetros: amount, name, document, external_id, pix_key, key_type, description, clientCallbackUrl
     */
    async createWithdrawal(withdrawal: CodexPayWithdrawal): Promise<CodexPayWithdrawalResponse> {
        console.log('💎 CODEXPAY: Criando saque PIX:', {
            amount: withdrawal.amount,
            pixKey: withdrawal.pixKey,
            pixKeyType: withdrawal.pixKeyType,
            externalId: withdrawal.externalId
        });

        // Remover caracteres não numéricos do CPF
        const cleanDocument = withdrawal.document.replace(/\D/g, '');

        // Payload conforme documentação oficial
        // key_type deve ser: CPF, EMAIL, PHONE, RANDOM (uppercase)
        const payload = {
            amount: withdrawal.amount,
            name: withdrawal.name,
            document: cleanDocument,
            external_id: withdrawal.externalId,
            pix_key: withdrawal.pixKey,
            key_type: withdrawal.pixKeyType.toUpperCase(),  // Campo correto: key_type (não pix_key_type)
            description: withdrawal.description || 'Saque da plataforma',
            clientCallbackUrl: withdrawal.callbackUrl
        };

        try {
            const response = await this.makeRequest('/api/withdrawals/withdraw', 'POST', payload);

            // A API retorna: { message, withdrawal: { transaction_id, status, amount, type } }
            const wData = response.withdrawal || response;

            if (!wData) {
                throw new Error('CODEXPAY: Resposta inválida - withdrawal não encontrado');
            }

            console.log('✅ CODEXPAY: Saque PIX criado com sucesso:', {
                transactionId: wData.transaction_id || wData.transactionId,
                status: wData.status
            });

            return {
                id: wData.transaction_id || wData.transactionId || withdrawal.externalId,
                status: wData.status || 'COMPLETED',
                amount: wData.amount || withdrawal.amount,
                fee: wData.fee
            };
        } catch (error) {
            console.error('🔥 CODEXPAY: Erro ao criar saque PIX:', error);
            throw error;
        }
    }

    /**
     * Verificar saldo da conta no gateway
     * A documentação oficial não expõe um endpoint de saldo público.
     * Retorna 0 se não disponível.
     */
    async getBalance(): Promise<number> {
        try {
            // Tentar endpoint de saldo (pode não existir na CodexPay)
            const endpoints = [
                '/api/account/balance',
                '/api/balance',
                '/api/merchant/balance'
            ];

            for (const endpoint of endpoints) {
                try {
                    console.log(`💰 CODEXPAY: Verificando saldo em: ${endpoint}`);
                    const response = await this.makeRequest(endpoint, 'GET');
                    const balance = response.balance || response.amount || response.data?.balance;
                    if (balance !== undefined && balance !== null) {
                        return Number(balance);
                    }
                } catch (err: any) {
                    if (err.message.includes('404') || err.message.includes('405')) {
                        console.log(`ℹ️ CODEXPAY: Endpoint ${endpoint} não disponível.`);
                        continue;
                    }
                    // Para outros erros (401, 500), parar
                    console.warn(`⚠️ CODEXPAY: Erro ao consultar ${endpoint}:`, err.message);
                    break;
                }
            }

            console.log('ℹ️ CODEXPAY: Endpoint de saldo não disponível na API.');
            return 0;
        } catch (error) {
            console.error('🔥 CODEXPAY: Erro ao consultar saldo:', error);
            return 0;
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
            throw new Error('Configuração CODEXPAY não encontrada (DB ou ENV). Configure o gateway no painel admin.');
        }

        return new CodexPayService(clientId, clientSecret);
    }
}
