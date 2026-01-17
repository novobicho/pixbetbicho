import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Chave para armazenar o tema no localStorage
const THEME_STORAGE_KEY = 'bichomania-theme';

// Interface para as configurações do sistema
interface SystemSettings {
  maxBetAmount: number;
  maxPayout: number;
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
  allowUserRegistration: boolean;
  allowDeposits: boolean;
  allowWithdrawals: boolean;
  maintenanceMode: boolean;
}

// Interface apenas para as cores do tema
interface ThemeColors {
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Função para converter cor hex para HSL
function hexToHSL(hex: string): string {
  // Remover o # se existir
  hex = hex.replace('#', '');

  // Converter hex para RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // acromático
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

// Função para gerar uma versão mais escura da cor
function getDarkerHexColor(hex: string): string {
  // Remover o # se existir
  hex = hex.replace('#', '');

  // Converter hex para RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Escurecer os valores (multiplicar por 0.8)
  r = Math.round(Math.max(0, r * 0.8));
  g = Math.round(Math.max(0, g * 0.8));
  b = Math.round(Math.max(0, b * 0.8));

  // Converter de volta para hex
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Função para aplicar as cores do tema ao documento
function applyThemeColors(colors: ThemeColors) {
  try {
    const doc = document.documentElement;

    // Converter cores hex para HSL e aplicar como variáveis CSS
    if (colors.mainColor) {
      const mainColorHSL = hexToHSL(colors.mainColor);
      doc.style.setProperty('--primary', mainColorHSL);

      // Gerar versão mais escura para hover
      const darkerMainColor = getDarkerHexColor(colors.mainColor);
      const darkerMainColorHSL = hexToHSL(darkerMainColor);
      doc.style.setProperty('--primary-dark', darkerMainColorHSL);

      // Atualizar também a cor de destaque do anel
      doc.style.setProperty('--ring', mainColorHSL);
    }

    if (colors.secondaryColor) {
      const secondaryColorHSL = hexToHSL(colors.secondaryColor);
      doc.style.setProperty('--secondary', secondaryColorHSL);
    }

    if (colors.accentColor) {
      const accentColorHSL = hexToHSL(colors.accentColor);
      doc.style.setProperty('--accent', accentColorHSL);
    }

    // Armazenar no localStorage para futuras visitas
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(colors));

    return true;
  } catch (error) {
    console.error("Erro ao aplicar cores do tema:", error);
    return false;
  }
}

// Função para inicializar o tema (deve ser chamada antes da renderização do App)
export function initializeTheme() {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      const themeColors = JSON.parse(storedTheme) as ThemeColors;
      // Aplicar diretamente sem esperar renderização
      applyThemeColors(themeColors);
      console.log("🎨 Tema inicializado do cache local:", themeColors.mainColor);
      return true;
    }
  } catch (error) {
    console.error("Erro ao inicializar tema:", error);
  }
  return false;
}

// Componente de provedor de tema
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Buscar configurações do sistema (endpoint público)
  const { data: settings } = useQuery<SystemSettings>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos para evitar flicker
  });

  // Aplicar cores do tema quando as configurações forem carregadas da API
  // Isso atualizará o tema se houver mudanças no servidor e atualizará o cache local
  useEffect(() => {
    if (settings) {
      const themeColors: ThemeColors = {
        mainColor: settings.mainColor,
        secondaryColor: settings.secondaryColor,
        accentColor: settings.accentColor
      };

      const success = applyThemeColors(themeColors);

      if (success) {
        console.log("🎨 Tema sincronizado com o servidor:", themeColors.mainColor);
      }
    }
  }, [settings]);

  return <>{children}</>;
}