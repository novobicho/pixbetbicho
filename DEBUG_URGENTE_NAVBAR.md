# 🔍 DEBUG URGENTE - Navbar Azul

## 📋 Passo a Passo para Debug

### **1. Abra o Console do Navegador**
1. Pressione `F12` no navegador
2. Clique na aba **"Console"**
3. Recarregue a página (`Ctrl + Shift + R`)

### **2. Procure por estas mensagens:**
```
Navbar - System Settings: {primaryColor: "...", ...}
Navbar - Primary Color: #...
Navbar - RGB: {r: ..., g: ..., b: ...}
Navbar - Gradient Style: {background: "..."}
```

### **3. O que verificar:**

#### **Se aparecer:**
```
Navbar - Primary Color: #6366f1  (roxo)
Navbar - RGB: {r: 99, g: 102, b: 241}
```
✅ **Significa**: O código está pegando a cor roxa corretamente!
❌ **Problema**: O CSS não está sendo aplicado

#### **Se aparecer:**
```
Navbar - Primary Color: #2563eb  (azul)
```
❌ **Problema**: O `systemSettings` está vindo com a cor antiga ou `undefined`

### **4. Teste a API Manualmente**

No console, cole este código:
```javascript
fetch('/api/system-settings')
  .then(r => r.json())
  .then(d => {
    console.log('=== API RESPONSE ===');
    console.log('Primary Color:', d.primaryColor);
    console.log('Full Settings:', d);
  })
```

**O que deve aparecer:**
```
Primary Color: #6366f1  (ou a cor que você configurou)
```

### **5. Se a API retornar a cor correta mas a navbar continuar azul:**

Isso significa que há um problema de cache do React Query.

**Solução:**
1. Abra o DevTools (F12)
2. Vá em "Application" (ou "Aplicativo")
3. Clique em "Clear storage" (Limpar armazenamento)
4. Marque "Cache Storage" e "Local Storage"
5. Clique em "Clear site data"
6. Recarregue a página

### **6. Se nada funcionar:**

Vamos forçar a cor diretamente no código.

**Me envie:**
1. Screenshot do console mostrando os logs
2. Screenshot da resposta da API (`/api/system-settings`)
3. A cor que você configurou (ex: `#6366f1`)

## 🚨 Ação Imediata

**FAÇA AGORA:**
1. Abra F12
2. Vá em Console
3. Recarregue a página
4. Tire um screenshot do console
5. Me envie o screenshot

Vou identificar exatamente onde está o problema!
