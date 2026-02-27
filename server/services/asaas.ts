// Asaas Payment Service
// Docs: https://docs.asaas.com

export interface AsaasConfig {
    apiKey: string;
    sandbox: boolean;
    baseUrl: string;
}

export interface AsaasPixPayment {
    amount: number;
    externalId: string;
    customerName: string;
    customerEmail: string;
    customerDocument: string;
}

export interface AsaasPixResponse {
    id: string; // payment id in Asaas
    status: string;
    amount: number;
    qrCode: string; // actual text for copy-paste PIX
    transactionId: string; // Asaas payment ID
}

export interface AsaasWithdrawal {
    amount: number;
    name: string;
    document: string;
    externalId: string;
    pixKey: string;
    pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';
    description: string;
}

export interface AsaasWithdrawalResponse {
    id: string;
    status: string;
    amount: number;
    fee?: number;
}

export class AsaasService {
    private config: AsaasConfig;

    constructor(apiKey: string, sandbox: boolean) {
        this.config = {
            apiKey,
            sandbox,
            baseUrl: sandbox ? 'https://sandbox.asaas.com/api/v3' : 'https://api.asaas.com/v3'
        };

        if (!this.config.apiKey) {
            throw new Error("ASAAS credentials not configured");
        }

        console.log('💎 ASAAS: Serviço configurado:', {
            sandbox: this.config.sandbox
        });
    }

    private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
        const headers: Record<string, string> = {
            'access_token': this.config.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        try {
            const url = `${this.config.baseUrl}${endpoint}`;
            console.log(`📡 ASAAS: ${method} ${url}`, body ? JSON.stringify(body) : '');

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
                console.error(`🔥 ASAAS: Erro HTTP ${response.status} em ${method} ${endpoint}:`, responseData);
                throw new Error(`ASAAS API Error ${response.status}: ${JSON.stringify(responseData)}`);
            }

            return responseData;
        } catch (error) {
            console.error(`🔥 ASAAS: Erro na requisição ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    private async getOrCreateCustomer(name: string, email: string, document: string): Promise<string> {
        let cleanDocument = document ? document.replace(/\\D/g, '') : '';

        try {
            let searchParams = new URLSearchParams();
            if (cleanDocument) searchParams.append('cpfCnpj', cleanDocument);
            else if (email && email.includes('@')) searchParams.append('email', email);

            if (searchParams.toString()) {
                const searchResponse = await this.makeRequest(`/customers?${searchParams.toString()}`);
                if (searchResponse.data && searchResponse.data.length > 0) {
                    return searchResponse.data[0].id;
                }
            }
        } catch (err) {
            console.log('ASAAS get customer warning', err);
        }

        try {
            const payload: any = {
                name: name || 'Cliente Plataforma',
                email: email && email.includes('@') ? email : undefined
            };
            if (cleanDocument) {
                payload.cpfCnpj = cleanDocument;
            }

            const response = await this.makeRequest('/customers', 'POST', payload);
            return response.id;
        } catch (err) {
            console.error('ASAAS Error creating customer:', err);
            const response = await this.makeRequest('/customers', 'POST', {
                name: name || 'Cliente Plataforma',
                email: email && email.includes('@') ? email : `user-${Date.now()}@exemplo.com`
            });
            return response.id;
        }
    }

    async createPixPayment(payment: AsaasPixPayment): Promise<AsaasPixResponse> {
        try {
            const customerId = await this.getOrCreateCustomer(
                payment.customerName,
                payment.customerEmail,
                payment.customerDocument
            );

            const payload = {
                customer: customerId,
                billingType: 'PIX',
                value: payment.amount,
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
                externalReference: payment.externalId,
                description: `Depósito Plataforma - ${payment.externalId}`
            };

            const response = await this.makeRequest('/payments', 'POST', payload);

            const qrCodeResponse = await this.makeRequest(`/payments/${response.id}/pixQrCode`);

            return {
                id: response.id,
                status: response.status || 'PENDING',
                amount: response.value,
                qrCode: qrCodeResponse.payload,
                transactionId: response.id
            };
        } catch (error) {
            console.error('🔥 ASAAS: Erro ao criar pagamento PIX:', error);
            throw error;
        }
    }

    async getPaymentStatus(paymentId: string): Promise<string> {
        try {
            const response = await this.makeRequest(`/payments/${paymentId}`);
            if (response.status === 'RECEIVED' || response.status === 'CONFIRMED' || response.status === 'RECEIVED_IN_CASH') {
                return 'completed';
            }
            if (response.status === 'PENDING') return 'pending';
            if (response.status === 'OVERDUE' || response.status === 'REFUNDED') return 'failed';
            return 'pending';
        } catch (error) {
            console.error('🔥 ASAAS: Erro ao buscar pagamento:', error);
            throw error;
        }
    }

    async getTransferStatus(transferId: string): Promise<string> {
        try {
            const response = await this.makeRequest(`/transfers/${transferId}`);
            if (response.status === 'DONE' || response.status === 'EFFECTIVATED') return 'completed';
            if (response.status === 'FAILED' || response.status === 'CANCELLED') return 'failed';
            if (response.status === 'PENDING' || response.status === 'BANK_PROCESSING') return 'processing';
            return 'pending';
        } catch (error) {
            console.error('🔥 ASAAS: Erro ao buscar transferencia:', error);
            throw error;
        }
    }

    async createWithdrawal(withdrawal: AsaasWithdrawal): Promise<AsaasWithdrawalResponse> {
        try {
            let asaasPixKeyType = withdrawal.pixKeyType;
            if (asaasPixKeyType === 'RANDOM' as any) asaasPixKeyType = 'EVP';

            const payload = {
                value: withdrawal.amount,
                pixAddressKey: withdrawal.pixKey,
                pixAddressKeyType: asaasPixKeyType,
                description: withdrawal.description || 'Saque da plataforma',
                externalReference: withdrawal.externalId
            };

            const response = await this.makeRequest('/transfers', 'POST', payload);

            return {
                id: response.id,
                status: 'PROCESSING',
                amount: response.value,
                fee: response.transferFee || 0
            };
        } catch (error) {
            console.error('🔥 ASAAS: Erro ao criar saque PIX:', error);
            throw error;
        }
    }

    async getBalance(): Promise<number> {
        try {
            const response = await this.makeRequest('/finance/balance');
            return Number(response.balance || 0);
        } catch (error) {
            console.error('🔥 ASAAS: Erro ao consultar saldo:', error);
            return 0;
        }
    }
}

export async function createAsaasService(gatewayId?: number): Promise<AsaasService> {
    const { storage } = await import('../storage');

    if (gatewayId) {
        const gateway = await storage.getPaymentGateway(gatewayId);
        if (!gateway || gateway.type !== 'asaas') {
            throw new Error('Gateway ASAAS não encontrado');
        }
        return new AsaasService(gateway.apiKey || '', gateway.sandbox || false);
    } else {
        const gateways = await storage.getAllPaymentGateways();
        const asaasGateway = gateways.find(g => g.type === 'asaas' && g.isActive);

        if (asaasGateway) {
            return new AsaasService(asaasGateway.apiKey || '', asaasGateway.sandbox || false);
        }

        const apiKey = process.env.ASAAS_API_KEY || '';
        const sandbox = process.env.ASAAS_SANDBOX === 'true';

        return new AsaasService(apiKey, sandbox);
    }
}
