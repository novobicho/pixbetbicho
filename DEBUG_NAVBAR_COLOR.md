# 🔍 Debug: Navbar não está usando a cor verde

## Problema
A navbar continua azul mesmo após alterar a cor do sistema para verde (`#059669`).

## Solução Aplicada

### 1. **Adicionado refetch automático**
```typescript
const { data: systemSettings } = useQuery<SystemSettings>({
  queryKey: ["/api/system-settings"],
  refetchOnMount: true,      // Busca ao montar
  refetchOnWindowFocus: true, // Busca ao focar janela
  staleTime: 0,              // Nunca usa cache
});
```

### 2. **Como testar**

#### **Opção 1: Recarregar a página**
1. Pressione `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)
2. Isso força um reload completo sem cache
3. A navbar deve ficar verde

#### **Opção 2: Limpar cache do navegador**
1. Abra DevTools (F12)
2. Clique com botão direito no ícone de reload
3. Selecione "Limpar cache e recarregar"

#### **Opção 3: Verificar no console**
1. Abra DevTools (F12)
2. Vá na aba "Console"
3. Digite:
```javascript
fetch('/api/system-settings')
  .then(r => r.json())
  .then(d => console.log('Cor do sistema:', d.primaryColor))
```
4. Verifique se retorna `#059669` (verde)

### 3. **Verificar se o servidor está atualizado**

Execute no terminal:
```bash
docker-compose restart app
```

Isso reinicia apenas o container da aplicação.

### 4. **Verificar no banco de dados**

Se ainda não funcionar, verifique se a cor foi salva corretamente:

1. Acesse o painel de admin
2. Vá em "Configurações do Sistema"
3. Verifique se a cor principal está como `#059669`
4. Se não estiver, altere novamente e salve

## Por que isso acontece?

O React Query faz cache das requisições para melhorar performance. 
Quando você alterou a cor, o cache antigo (azul) ainda estava ativo.

Com as mudanças aplicadas:
- `staleTime: 0` → Nunca usa cache
- `refetchOnMount: true` → Busca sempre ao montar
- `refetchOnWindowFocus: true` → Busca ao voltar para a aba

## Teste Rápido

1. **Recarregue a página** com `Ctrl + Shift + R`
2. A navbar deve ficar **verde** (`#059669`)
3. Se ainda estiver azul, reinicie o Docker:
   ```bash
   docker-compose restart
   ```

## Resultado Esperado

✅ Navbar verde com gradiente
✅ Cor muda automaticamente ao alterar nas configurações
✅ Sem necessidade de recarregar manualmente
