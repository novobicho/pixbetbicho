# Guia de Configuração de Sorteios para Atualização Automática

## Como Nomear os Sorteios

Para que o sistema consiga buscar os resultados automaticamente no site resultadofacil.com.br, o nome do sorteio deve seguir um padrão específico que contenha:

1. **Sigla do Estado** (2 letras maiúsculas)
2. **Horário** (formato HH:MM)
3. **Período** (manhã, tarde ou noite) - opcional mas recomendado

### Exemplos de Nomes Corretos:

```
✅ Jogo do Bicho LOTECE - CE, 14:00 (tarde)
✅ PT-BA 11:20 (manhã)
✅ Jogo do Bicho CE 18:00 (noite)
✅ LOTECE - CE 09:00 (manhã)
✅ Paraíba - PB 14:00 (tarde)
```

### Exemplos de Nomes Incorretos:

```
❌ Jogo do Bicho (falta estado e horário)
❌ LOTECE 14:00 (falta sigla do estado)
❌ Ceará 14h (horário no formato errado)
❌ CE (falta horário)
```

## Mapeamento de Estados

O sistema reconhece os seguintes estados:

| Sigla | Nome da Loteria no Site |
|-------|------------------------|
| CE    | lotece                 |
| BA    | bahia                  |
| PB    | paraiba                |
| RJ    | rio                    |
| SP    | sao-paulo              |
| PE    | pernambuco             |
| RN    | rio-grande-do-norte    |
| AL    | alagoas                |
| SE    | sergipe                |
| MA    | maranhao               |
| PI    | piaui                  |

## Como o Sistema Funciona

1. **Extração de Informações**: O sistema analisa o nome do sorteio e extrai:
   - Estado (ex: "CE")
   - Horário (ex: "14:00")
   - Período (ex: "tarde")

2. **Construção da URL**: Com base no estado, o sistema monta a URL:
   ```
   https://www.resultadofacil.com.br/resultado-do-jogo-do-bicho/CE
   ```

3. **Busca e Filtragem**: O sistema:
   - Acessa a página do estado
   - Procura pela seção com o horário específico (ex: "14:00")
   - Extrai os 10 prêmios da tabela correspondente
   - Valida a data (se fornecida)
   - Atualiza o banco de dados

## Atualização Automática

O sistema possui **duas formas** de atualização:

### 1. Automática (Cron Job)
- Executa **a cada 30 minutos**
- Horário de funcionamento: **9h às 23h**
- Busca todos os sorteios com status "pending"

### 2. Manual (Botão na Interface)
- Clique no botão roxo de **refresh** (🔄)
- Força a busca imediata do resultado
- Útil para resultados que acabaram de sair

## Troubleshooting

### Resultado não está sendo encontrado?

1. **Verifique o nome do sorteio**:
   - Contém a sigla do estado?
   - Horário está no formato HH:MM?
   - Exemplo: "Jogo do Bicho LOTECE - CE, 14:00 (tarde)"

2. **Verifique a URL gerada**:
   - Acesse os logs do servidor
   - Procure por: `[ResultScraper] Buscando resultado em:`
   - Teste a URL manualmente no navegador

3. **Verifique se o resultado já saiu**:
   - Acesse: https://www.resultadofacil.com.br/resultado-do-jogo-do-bicho/CE
   - Substitua "CE" pela sigla do seu estado
   - Procure pelo horário do seu sorteio na página

4. **Verifique a data**:
   - O sistema busca resultados da data do sorteio
   - Certifique-se que a data está correta

### Logs Úteis

No console do servidor, procure por:

```
[ResultScraper] Informações extraídas: { state: 'CE', time: '14:00', period: 'tarde', loteria: 'lotece' }
[ResultScraper] Buscando resultado em: https://www.resultadofacil.com.br/jogo-do-bicho/lotece/14-00
[ResultScraper] ✅ Encontrados 10 prêmios: ...
```

## Exemplo Completo

### Cadastrar um Sorteio:

1. Nome: `Jogo do Bicho LOTECE - CE, 14:00 (tarde)`
2. Data: `2025-12-04`
3. Horário: `14:00`
4. Status: `pending`

### O Sistema Irá:

1. Extrair: `{ state: 'CE', time: '14:00', period: 'tarde' }`
2. Acessar: `https://www.resultadofacil.com.br/resultado-do-jogo-do-bicho/CE`
3. Procurar pela seção com horário "14:00"
4. Buscar tabela com os 10 prêmios
5. Atualizar o banco com os resultados
6. Mudar status para: `completed`

## Notas Importantes

- ⏰ O cron job executa **a cada 30 minutos** (9h-23h)
- 🔄 Use o botão manual para forçar atualização imediata
- 📅 A data do sorteio é usada para validação
- 🌐 O site deve estar acessível e com a estrutura HTML esperada
- 📊 O sistema busca exatamente 10 prêmios (1º ao 10º)
