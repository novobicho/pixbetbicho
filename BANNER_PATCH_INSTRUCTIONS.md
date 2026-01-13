# Mudanças Necessárias no system-settings.tsx

## 1. Atualizar linha ~310 (função uploadSelectedImage)

### ANTES:
```typescript
// Atualizar a URL da imagem nas configurações
updateSettings(imageType === 'logo' ? 'logoUrl' : 'faviconUrl', data.imageUrl);
```

### DEPOIS:
```typescript
// Atualizar a URL da imagem nas configurações
const settingsKey = 
  imageType === 'logo' ? 'logoUrl' :
  imageType === 'favicon' ? 'faviconUrl' :
  imageType === 'bannerDesktop' ? 'bannerDesktopUrl' :
  'bannerMobileUrl';

updateSettings(settingsKey, data.imageUrl);
```

## 2. Adicionar seção de banners após linha ~900

Copiar todo o conteúdo do arquivo `BANNER_SECTION_CODE.tsx` e colar após a seção de "Nome e Descrição do Site" (depois da tag `</div>` que fecha essa seção).

## 3. Atualizar função restoreDefaults (linha ~376)

### ADICIONAR ao objeto de configurações padrão:
```typescript
bannerDesktopUrl: "/img/banner-desktop.jpg",
bannerMobileUrl: "/img/banner-mobile.jpg"
```

## Localização das Mudanças

- **Linha 310**: Lógica de mapeamento de settingsKey
- **Linha 376-397**: Função restoreDefaults
- **Linha 900**: Adicionar seção de banners (após Nome e Descrição)

## Teste

Após fazer as mudanças:
1. Reiniciar o Docker: `docker-compose restart app`
2. Acessar painel admin
3. Ir em "Configurações do Sistema" > "Aparência"
4. Rolar até "Banners Promocionais"
5. Testar upload de imagens
