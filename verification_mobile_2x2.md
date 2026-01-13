# ✅ Principais Cotações - Layout 2x2 Mobile

## 🎨 Mudanças Implementadas

### **1. Layout Mobile 2x2**
✅ **Grid 2 colunas x 2 linhas**: Todas as 4 opções visíveis
✅ **Sem scroll horizontal**: Tudo na tela
✅ **Compacto**: Cards menores e otimizados
✅ **Gap reduzido**: 12px entre cards

### **2. Nomes Simplificados**
✅ **"Duque de Grupo"** → **"Grupo"**
✅ **"Milhar"** → **"Milhar"**
✅ **"Centena"** → **"Centena"**
✅ **"Dezena"** → **"Dezena"**

## 📱 Visual Mobile (2x2)

```
┌──────────┐ ┌──────────┐
│  GRUPO   │ │  MILHAR  │
│  Paga    │ │  Paga    │
│ R$ 2000  │ │ R$ 8000  │
│ [JOGAR]  │ │ [JOGAR]  │
└──────────┘ └──────────┘

┌──────────┐ ┌──────────┐
│ CENTENA  │ │  DEZENA  │
│  Paga    │ │  Paga    │
│ R$ 800   │ │ R$ 84    │
│ [JOGAR]  │ │ [JOGAR]  │
└──────────┘ └──────────┘
```

## 🎯 Tamanhos Mobile

### **Cards:**
- **Largura**: 50% - gap (auto)
- **Padding**: 12px
- **Gap**: 12px
- **Altura**: Auto (compacto)

### **Tipografia:**
- **Título**: `text-[11px]` (11px)
- **Label "Paga"**: `text-[9px]` (9px)
- **Multiplicador "1x"**: `text-[10px]` (10px)
- **Valor**: `text-base` (16px)
- **Botão**: `text-[10px]` (10px)

### **Espaçamento:**
- **Padding card**: `p-3` (12px)
- **Margin bottom título**: `mb-2` (8px)
- **Margin bottom odds**: `mb-2` (8px)
- **Padding botão**: `py-1.5` (6px vertical)

## 💻 Desktop

- **Grid**: 2 colunas (md) ou 4 colunas (lg)
- **Cards maiores**: Padding `p-6`
- **Texto maior**: Mantém tamanhos originais
- **Hover effects**: Elevação e sombra

## 📊 Comparação

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Layout Mobile | Scroll horizontal | Grid 2x2 |
| Cards visíveis | 2-3 (scroll) | 4 (todos) |
| Nome | "Duque de Grupo" | "Grupo" |
| Interação | Swipe | Nenhuma |
| Espaço | ~200px altura | ~280px altura |

## ✨ Benefícios

### **Usabilidade:**
✅ **Todas as opções visíveis**: Sem precisar rolar
✅ **Comparação fácil**: Ver todos os valores de uma vez
✅ **Nomes claros**: "Grupo" em vez de "Duque de Grupo"
✅ **Touch-friendly**: Cards maiores para tocar

### **Visual:**
✅ **Organizado**: Grid simétrico 2x2
✅ **Compacto**: Ocupa menos espaço que antes
✅ **Gradientes**: Valores em destaque
✅ **Consistente**: Mesmo estilo em todos os cards

### **Performance:**
✅ **Sem scroll**: Menos interação necessária
✅ **Renderização simples**: Grid estático
✅ **Rápido**: Sem animações de scroll

## 🎨 Detalhes de Design

### **Cores:**
- **Gradiente topo**: Laranja (#f97316) → Vermelho (#ef4444)
- **Valor**: Gradiente laranja/vermelho
- **Botão**: Azul gradiente (#2563eb → #1d4ed8)
- **Fundo**: Branco

### **Bordas:**
- **Card**: `rounded-xl` (12px)
- **Botão**: `rounded-lg` (8px)
- **Barra topo**: `h-1` (4px)

### **Sombras:**
- **Card**: `shadow-lg`
- **Botão**: `shadow-md` → `shadow-lg` (hover)

## 🔧 Função simplifyName()

```typescript
const simplifyName = (name: string): string => {
  if (name.toLowerCase().includes('grupo')) return 'Grupo';
  if (name.toLowerCase().includes('milhar')) return 'Milhar';
  if (name.toLowerCase().includes('centena')) return 'Centena';
  if (name.toLowerCase().includes('dezena')) return 'Dezena';
  return name;
};
```

Transforma:
- "Duque de Grupo" → "Grupo"
- "Milhar" → "Milhar"
- "Centena" → "Centena"
- "Dezena" → "Dezena"

## 📱 Breakpoints

- **< 768px**: Grid 2x2 (mobile)
- **≥ 768px**: Grid 2 colunas (tablet)
- **≥ 1024px**: Grid 4 colunas (desktop)

## ✅ Resultado Final

### **Mobile:**
```
┌─────────────────────────┐
│ PRINCIPAIS COTAÇÕES     │
├──────────┬──────────────┤
│  GRUPO   │   MILHAR     │
│ R$ 2000  │  R$ 8000     │
│ [JOGAR]  │  [JOGAR]     │
├──────────┼──────────────┤
│ CENTENA  │   DEZENA     │
│ R$ 800   │   R$ 84      │
│ [JOGAR]  │  [JOGAR]     │
└──────────┴──────────────┘
```

✅ **4 opções visíveis**
✅ **Sem scroll**
✅ **Nomes simplificados**
✅ **Compacto e bonito**

---

**Teste agora no mobile e veja todas as 4 opções de uma vez!** 📱✨
