# 🎨 Implementação de Gerenciamento de Banners

## 📋 Tarefas Realizadas

### ✅ 1. Schema do Banco de Dados
- Adicionado `bannerDesktopUrl` em `shared/schema.ts`
- Adicionado `bannerMobileUrl` em `shared/schema.ts`
- Migração executada com sucesso no banco de dados

### 🔄 2. Próximos Passos

#### **A. Atualizar Interface SystemSettings**
Adicionar campos de banner na interface TypeScript:
```typescript
interface SystemSettings {
  // ... campos existentes
  bannerDesktopUrl?: string;
  bannerMobileUrl?: string;
}
```

#### **B. Adicionar Estado para Banners**
```typescript
const [selectedImages, setSelectedImages] = useState<{
  logo?: { data: string; file: File } | null;
  favicon?: { data: string; file: File } | null;
  bannerDesktop?: { data: string; file: File } | null;
  bannerMobile?: { data: string; file: File } | null;
}>({});
```

#### **C. Criar Seção de Banners na UI**
Adicionar após a seção de "Nome e Descrição do Site":
- Upload de Banner Desktop (recomendado: 1920x400px)
- Upload de Banner Mobile (recomendado: 800x600px)
- Preview das imagens
- Botões de upload e restaurar padrão

#### **D. Atualizar Endpoint de Upload**
Modificar `/api/admin/upload-image` para aceitar:
- `bannerDesktop`
- `bannerMobile`

#### **E. Atualizar BannerCarousel**
Modificar `client/src/components/banner-carousel.tsx` para:
- Buscar URLs dos banners das configurações do sistema
- Mostrar banner desktop em telas grandes
- Mostrar banner mobile em telas pequenas

## 🎯 Tamanhos Recomendados

### **Banner Desktop:**
- **Largura**: 1920px
- **Altura**: 400-500px
- **Formato**: JPG ou PNG
- **Peso**: Máximo 500KB

### **Banner Mobile:**
- **Largura**: 800px
- **Altura**: 600-800px
- **Formato**: JPG ou PNG
- **Peso**: Máximo 300KB

## 📱 Responsividade

```css
/* Desktop */
@media (min-width: 768px) {
  background-image: url(bannerDesktopUrl);
}

/* Mobile */
@media (max-width: 767px) {
  background-image: url(bannerMobileUrl);
}
```

## 🚀 Fluxo de Uso

1. Admin acessa "Configurações do Sistema"
2. Vai na aba "Aparência"
3. Rola até "Banners Promocionais"
4. Clica em "Selecionar Banner Desktop"
5. Escolhe imagem (1920x400px)
6. Clica em "Carregar Imagem"
7. Repete para Banner Mobile (800x600px)
8. Salva configurações
9. Banner aparece na homepage automaticamente

---

**Status**: Banco de dados pronto ✅
**Próximo**: Implementar UI no painel admin
