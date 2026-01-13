# Verificação da Atualização dos Sortudos do Dia

A seção "Sortudos do Dia" foi simplificada conforme solicitado.

## O que mudou:

1.  **Informações Removidas:**
    *   Número da aposta (ex: "08-52-48").
    *   Local e horário da extração (ex: "BA 21h").
2.  **Informações Mantidas:**
    *   Tipo de aposta (ex: "Terno De Dezena").
    *   Nome do ganhador (ex: "Joao P.").
    *   Valor apostado (ex: "Apostou: R$ 2,00").
    *   Valor ganho (ex: "Ganhou: R$ 1.000,00").

## Como Verificar

1.  Acesse `http://localhost:3000/`.
2.  Role até a seção **SORTUDOS DO DIA**.
3.  Verifique os cards amarelos. Eles devem conter **apenas**:
    *   O tipo de jogo no topo esquerdo.
    *   O número do ranking no topo direito (#1, #2, etc).
    *   O nome da pessoa no centro.
    *   O valor apostado e o valor ganho na parte inferior.
4.  Confirme que **não** há mais informações de horário, local (sigla de estado) ou números sorteados visíveis nos cards.
