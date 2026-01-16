import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Check,
  CreditCard,
  Palette,
  Sliders,
  ToggleLeft,
  Wallet,
  Upload,
  Lock
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Função para formatar valores monetários no padrão brasileiro
const formatCurrency = (value: number): string => {
  return value.toFixed(2).replace('.', ',');
};

// Função para converter valores monetários em formato brasileiro para número
const parseMoneyValue = (value: string): number => {
  // Remove espaços, pontos de milhar e substitui vírgula por ponto
  const cleanValue = value.replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
  const number = parseFloat(cleanValue);
  return isNaN(number) ? 0 : number;
};

// Interfaces para configurações do sistema
interface SystemSettings {
  maxBetAmount: number;
  maxPayout: number;
  minBetAmount: number;
  defaultBetAmount: number;
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
  allowUserRegistration: boolean;
  allowDeposits: boolean;
  allowWithdrawals: boolean;
  maintenanceMode: boolean;
  autoApproveWithdrawals: boolean; // Nova opção: aprovar saques automaticamente até um valor
  autoApproveWithdrawalLimit: number; // Limite para aprovação automática de saques
  siteName: string; // Nome do site
  siteDescription: string; // Descrição do site 
  logoUrl: string; // URL da logo do site
  faviconUrl: string; // URL do ícone que fica na barra do navegador
  allowBonusBets: boolean; // Permite apostas com saldo de bônus
  bannerDesktopUrl?: string; // URL do banner para desktop
  bannerMobileUrl?: string; // URL do banner para mobile
}

export function SystemSettings() {
  const { toast } = useToast();

  // Buscar configurações atuais do backend
  const { data: settingsData, isLoading } = useQuery<SystemSettings>({
    queryKey: ["/api/admin/settings"],
  });

  // Atualizar as configurações quando os dados forem carregados
  useEffect(() => {
    if (settingsData) {
      // Usando valores reais diretamente, sem conversão
      console.log("Recebido do backend (valores reais):", {
        maxBetAmount: settingsData.maxBetAmount,
        maxPayout: settingsData.maxPayout,
        minBetAmount: settingsData.minBetAmount,
        defaultBetAmount: settingsData.defaultBetAmount
      });

      setSettings(settingsData);
    }
  }, [settingsData]);

  // Estado local para exibir as configurações e fazer edições
  const [settings, setSettings] = useState<SystemSettings>({
    maxBetAmount: 50,
    maxPayout: 500,
    minBetAmount: 0.5,
    defaultBetAmount: 2,
    mainColor: "#4f46e5",
    secondaryColor: "#6366f1",
    accentColor: "#f97316",
    allowUserRegistration: true,
    allowDeposits: true,
    allowWithdrawals: true,
    maintenanceMode: false,
    autoApproveWithdrawals: true,
    autoApproveWithdrawalLimit: 30,
    siteName: "Jogo do Bicho",
    siteDescription: "A melhor plataforma de apostas online",
    logoUrl: "/img/logo.png",
    faviconUrl: "/img/favicon.png",
    allowBonusBets: true, // Por padrão, permitir apostas com bônus
    bannerDesktopUrl: "/img/banner-desktop.jpg",
    bannerMobileUrl: "/img/banner-mobile.jpg"
  });

  // Estado para controlar quando houve mudanças
  const [hasChanges, setHasChanges] = useState(false);

  // Estado para armazenar imagens selecionadas para upload
  const [selectedImages, setSelectedImages] = useState<{
    logo?: { data: string; file: File } | null;
    favicon?: { data: string; file: File } | null;
    bannerDesktop?: { data: string; file: File } | null;
    bannerMobile?: { data: string; file: File } | null;
  }>({});

  // Estados para o diálogo de senha para a aba de aparência
  const [currentTab, setCurrentTab] = useState("limits");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAppearanceUnlocked, setIsAppearanceUnlocked] = useState(false);

  // Refs para inputs de arquivo
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const bannerDesktopInputRef = useRef<HTMLInputElement>(null);
  const bannerMobileInputRef = useRef<HTMLInputElement>(null);

  // Função para verificar a senha quando tentar acessar a aba de aparência
  const handleTabChange = (value: string) => {
    if (value === "appearance" && !isAppearanceUnlocked) {
      // Abrir o diálogo de senha
      setPasswordDialogOpen(true);
      // Prevenir a mudança de aba até que a senha seja verificada
      return;
    }

    // Para outras abas ou se a aparência já estiver desbloqueada, permitir a mudança
    setCurrentTab(value);
  };

  // Função para verificar a senha
  const verifyPassword = () => {
    const correctPassword = "victor654"; // Senha definida

    if (password === correctPassword) {
      // Senha correta
      setIsAppearanceUnlocked(true);
      setPasswordDialogOpen(false);
      setPassword("");
      setPasswordError("");
      // Mudar para a aba de aparência
      setCurrentTab("appearance");

      toast({
        title: "Acesso liberado",
        description: "Agora você pode editar as configurações de aparência.",
        variant: "default",
      });
    } else {
      // Senha incorreta
      setPasswordError("Senha incorreta. Tente novamente.");
      setPassword("");
    }
  };

  // Mutação para salvar as configurações
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SystemSettings) => {
      const res = await apiRequest("PUT", "/api/admin/settings", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas com sucesso",
        description: "As alterações foram aplicadas ao sistema.",
      });
      setHasChanges(false);

      // Invalidar o cache para buscar as configurações atualizadas
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao salvar configurações",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Função para atualizar configurações
  const updateSettings = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Função para selecionar imagem (logo, favicon ou banners)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, imageType: 'logo' | 'favicon' | 'bannerDesktop' | 'bannerMobile') => {
    console.log(`handleImageUpload chamado para: ${imageType}`);
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
      toast({
        title: "Erro ao selecionar imagem",
        description: "A imagem deve ter menos de 2MB",
        variant: "destructive",
      });
      return;
    }

    // Converter a imagem para base64 para preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== 'string') return;

      const imageData = e.target.result;

      // Armazenar a imagem selecionada no estado
      setSelectedImages(prev => ({
        ...prev,
        [imageType]: {
          data: imageData,
          file: file
        }
      }));

      toast({
        title: "Imagem selecionada",
        description: `Clique em "Carregar Imagem" para concluir o upload.`,
        variant: "default",
      });
    };

    reader.readAsDataURL(file);
  };

  // Função para fazer o upload da imagem selecionada
  const uploadSelectedImage = async (imageType: 'logo' | 'favicon' | 'bannerDesktop' | 'bannerMobile') => {
    const selectedImage = selectedImages[imageType];
    if (!selectedImage) {
      toast({
        title: "Erro ao fazer upload",
        description: "Nenhuma imagem selecionada para upload",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`Iniciando upload de imagem ${imageType}...`);

      // Usar o endpoint real para upload de imagens
      const url = '/api/admin/upload-image';
      console.log(`Enviando para URL: ${url}`);

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage.data,
          imageType
        }),
        credentials: 'include' as RequestCredentials // Importante para enviar cookies (autenticação)
      };

      console.log('Iniciando requisição fetch...');
      const response = await fetch(url, requestOptions);
      console.log(`Resposta da API de upload: status ${response.status}`);

      // Verificar se o tipo de conteúdo é JSON
      const contentType = response.headers.get('content-type');
      console.log(`Tipo de conteúdo da resposta: ${contentType}`);

      if (!response.ok) {
        let errorMessage = 'Erro ao fazer upload da imagem';
        try {
          const errorData = await response.json();
          console.error('Erro na resposta da API:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Erro ao parsear resposta de erro:', e);
          const text = await response.text();
          console.error('Texto da resposta:', text);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
        console.log('Dados recebidos após upload:', data);
      } catch (e) {
        console.error('Erro ao parsear JSON da resposta:', e);
        const text = await response.text();
        console.error('Texto da resposta:', text);
        throw new Error('Erro ao processar resposta do servidor');
      }

      if (!data.imageUrl) {
        throw new Error('A API não retornou uma URL de imagem válida');
      }

      // Atualizar a URL da imagem nas configurações
      const settingsKey =
        imageType === 'logo' ? 'logoUrl' :
          imageType === 'favicon' ? 'faviconUrl' :
            imageType === 'bannerDesktop' ? 'bannerDesktopUrl' :
              'bannerMobileUrl';

      updateSettings(settingsKey, data.imageUrl);

      // Limpar a imagem selecionada depois de fazer upload
      setSelectedImages(prev => ({
        ...prev,
        [imageType]: null
      }));

      toast({
        title: "Upload realizado com sucesso",
        description: `A imagem foi salva e configurada como ${imageType === 'logo' ? 'logo' : 'favicon'} do site.`,
        variant: "default",
      });

      // Recarregar a página para aplicar as mudanças no favicon (se for o caso)
      if (imageType === 'favicon') {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      let errorMessage = 'Erro desconhecido ao fazer o upload da imagem';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Verificar se é um erro relacionado ao tamanho do arquivo
      const errorStr = String(error).toLowerCase();
      if (errorStr.includes('payload') && errorStr.includes('large')) {
        errorMessage = 'O arquivo é muito grande. Tente reduzir o tamanho da imagem.';
      }

      // Adicionar mais verificações específicas
      if (errorStr.includes('permissão') || errorStr.includes('permission')) {
        errorMessage = 'Erro de permissão ao salvar a imagem. Verifique se você está logado como administrador.';
      } else if (errorStr.includes('diretório') || errorStr.includes('directory')) {
        errorMessage = 'Erro ao criar diretório. Verifique as permissões do sistema.';
      } else if (errorStr.includes('json')) {
        errorMessage = 'Erro ao processar resposta do servidor. Verifique os logs do console.';
      }

      toast({
        title: "Erro ao fazer upload",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Função que formata os valores monetários para exibição
  const formatMoneyDisplay = (value: number): string => {
    return `R$ ${formatCurrency(value)}`;
  };

  // Função para salvar todas as configurações
  const saveSettings = () => {
    // Usamos os valores reais diretamente, sem conversão
    console.log("Enviando para o backend (valores reais):", {
      maxBetAmount: settings.maxBetAmount,
      maxPayout: settings.maxPayout,
      minBetAmount: settings.minBetAmount,
      defaultBetAmount: settings.defaultBetAmount,
      allowBonusBets: settings.allowBonusBets
    });

    saveSettingsMutation.mutate(settings);
  };

  // Função para restaurar valores padrão
  const restoreDefaults = () => {
    setSettings({
      maxBetAmount: 50,
      maxPayout: 500,
      minBetAmount: 0.5,
      defaultBetAmount: 2,
      mainColor: "#4f46e5",
      secondaryColor: "#6366f1",
      accentColor: "#f97316",
      allowUserRegistration: true,
      allowDeposits: true,
      allowWithdrawals: true,
      maintenanceMode: false,
      autoApproveWithdrawals: true,
      autoApproveWithdrawalLimit: 30,
      siteName: "Jogo do Bicho",
      siteDescription: "A melhor plataforma de apostas online",
      logoUrl: "/img/logo.png",
      faviconUrl: "/img/favicon.png",
      allowBonusBets: true,
      bannerDesktopUrl: "/img/banner-desktop.jpg",
      bannerMobileUrl: "/img/banner-mobile.jpg"
    });
    setHasChanges(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-5 w-5" />
          Configurações do Sistema
        </CardTitle>
        <CardDescription>
          Configure os limites, aparência e comportamento da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Diálogo de senha para a aba de aparência */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Acesso Restrito</DialogTitle>
              <DialogDescription>
                A seção de Aparência é protegida. Por favor, informe a senha para continuar.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      verifyPassword();
                    }
                  }}
                  className={`w-full ${passwordError ? 'border-red-500' : ''}`}
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={verifyPassword}>Verificar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="limits" className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Limites
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center gap-1"
            >
              <Palette className="h-4 w-4" />
              Aparência
              {!isAppearanceUnlocked && <Lock className="ml-1 h-3 w-3" />}
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1">
              <ToggleLeft className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* Aba de Limites */}
          <TabsContent value="limits">
            <div className="space-y-6">
              <div className="grid gap-5">
                <div>
                  <Label htmlFor="max-bet" className="text-base font-medium mb-2 block">Aposta Máxima (R$)</Label>
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                      <Input
                        id="max-bet"
                        type="text"
                        inputMode="decimal"
                        value={formatCurrency(settings.maxBetAmount)}
                        onChange={(e) => {
                          const parsedValue = parseMoneyValue(e.target.value);
                          updateSettings("maxBetAmount", parsedValue);
                        }}
                        className="pl-8 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Valor máximo para apostas individuais
                    </p>
                    <Badge className="bg-primary">R$ {settings.maxBetAmount.toFixed(2).replace('.', ',')}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Label htmlFor="max-payout" className="text-base font-medium mb-2 block">Premiação Máxima (R$)</Label>
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                      <Input
                        id="max-payout"
                        type="text"
                        inputMode="decimal"
                        value={formatCurrency(settings.maxPayout)}
                        onChange={(e) => {
                          const parsedValue = parseMoneyValue(e.target.value);
                          updateSettings("maxPayout", parsedValue);
                        }}
                        className="pl-8 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Valor máximo de prêmio por aposta
                    </p>
                    <Badge className="bg-green-600">R$ {settings.maxPayout.toFixed(2).replace('.', ',')}</Badge>
                  </div>
                </div>

                {/* Aposta Mínima */}
                <div className="pt-4 border-t border-gray-200">
                  <Label htmlFor="min-bet" className="text-base font-medium mb-2 block">Aposta Mínima (R$)</Label>
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                      <Input
                        id="min-bet"
                        type="text"
                        inputMode="decimal"
                        value={formatCurrency(settings.minBetAmount)}
                        onChange={(e) => {
                          const parsedValue = parseMoneyValue(e.target.value);
                          updateSettings("minBetAmount", parsedValue);
                        }}
                        className="pl-8 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Valor mínimo para novas apostas
                    </p>
                    <Badge className="bg-blue-600">R$ {settings.minBetAmount.toFixed(2).replace('.', ',')}</Badge>
                  </div>
                </div>

                {/* Aposta Padrão */}
                <div className="pt-4 border-t border-gray-200">
                  <Label htmlFor="default-bet" className="text-base font-medium mb-2 block">Aposta Padrão (R$)</Label>
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                      <Input
                        id="default-bet"
                        type="text"
                        inputMode="decimal"
                        value={formatCurrency(settings.defaultBetAmount)}
                        onChange={(e) => {
                          const parsedValue = parseMoneyValue(e.target.value);
                          updateSettings("defaultBetAmount", parsedValue);
                        }}
                        className="pl-8 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Valor pré-selecionado em novos formulários de aposta
                    </p>
                    <Badge className="bg-green-500">R$ {settings.defaultBetAmount.toFixed(2).replace('.', ',')}</Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Atenção aos limites</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Definir limites muito altos pode aumentar o risco financeiro da plataforma.
                      Recomendamos valores que sua operação possa suportar com segurança.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-base font-medium mb-2">Sugestões de configuração</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateSettings("maxBetAmount", 5);
                      updateSettings("maxPayout", 5000);
                      updateSettings("minBetAmount", 0.5);
                      updateSettings("defaultBetAmount", 1);
                    }}
                  >
                    Conservador
                    <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded px-1">R$5,00 / R$5.000,00</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateSettings("maxBetAmount", 50);
                      updateSettings("maxPayout", 25000);
                      updateSettings("minBetAmount", 1);
                      updateSettings("defaultBetAmount", 2);
                    }}
                  >
                    Moderado
                    <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 rounded px-1">R$50,00 / R$25.000,00</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateSettings("maxBetAmount", 200);
                      updateSettings("maxPayout", 100000);
                      updateSettings("minBetAmount", 2);
                      updateSettings("defaultBetAmount", 5);
                    }}
                  >
                    Agressivo
                    <span className="ml-1 text-xs bg-red-100 text-red-700 rounded px-1">R$200,00 / R$100.000,00</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Aba de Aparência - Versão melhorada */}
          <TabsContent value="appearance">
            <div className="space-y-6">
              {/* Identidade do Site */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Identidade do Site</h3>

                <div className="grid grid-cols-1 gap-6">
                  {/* Logo do Site */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo-url" className="font-medium text-base mb-2 block">
                        Logo do Site
                      </Label>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center w-full md:w-40 h-32">
                          {settings.logoUrl ? (
                            <img
                              src={settings.logoUrl}
                              alt="Logo do site"
                              className="max-w-full max-h-24 object-contain"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <Palette className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-xs">Logo não definida</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <Input
                            id="logo-url"
                            type="text"
                            placeholder="URL da logo (ex: /img/logo.png)"
                            value={settings.logoUrl}
                            onChange={(e) => updateSettings("logoUrl", e.target.value)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500">
                            Informe o caminho da imagem que aparecerá como logo principal do site.
                            Recomendamos uma imagem PNG transparente, dimensões aproximadas de 200x60px.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => updateSettings("logoUrl", "/img/logo.png")}
                            >
                              Restaurar Padrão
                            </Button>
                            <div>
                              <input
                                type="file"
                                ref={logoInputRef}
                                className="hidden"
                                accept="image/png,image/jpeg,image/svg+xml"
                                onChange={(e) => handleImageUpload(e, 'logo')}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="text-xs flex items-center gap-1"
                                onClick={() => {
                                  console.log("Clicou no botão de upload de logo");
                                  logoInputRef.current?.click();
                                }}
                              >
                                <Upload className="h-3 w-3" />
                                Selecionar Imagem
                              </Button>
                            </div>
                          </div>

                          {/* Mostrar imagem selecionada com botão de carregar */}
                          {selectedImages.logo && (
                            <div className="mt-2 border border-dashed border-gray-300 p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={selectedImages.logo.data}
                                    alt="Logo preview"
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Imagem selecionada: {selectedImages.logo.file.name}
                                  </p>
                                  <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => uploadSelectedImage('logo')}
                                  >
                                    Carregar Imagem
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Favicon */}
                    <div className="pt-4 border-t border-gray-100">
                      <Label htmlFor="favicon-url" className="font-medium text-base mb-2 block">
                        Ícone do Site (Favicon)
                      </Label>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center w-full md:w-40 h-32">
                          {settings.faviconUrl ? (
                            <img
                              src={`${settings.faviconUrl}?v=${Date.now()}`}
                              alt="Favicon do site"
                              className="w-16 h-16 object-contain"
                              onError={(e) => {
                                console.log("Erro ao carregar favicon:", e);
                                // Adiciona classe para destacar erro
                                e.currentTarget.classList.add("border-red-500");
                                // Tenta recarregar com caminho absoluto se o erro persistir
                                if (!e.currentTarget.src.includes('/img/favicon.png')) {
                                  e.currentTarget.src = '/img/favicon.png';
                                }
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <Palette className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-xs">Ícone não definido</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <Input
                            id="favicon-url"
                            type="text"
                            placeholder="URL do favicon (ex: /img/favicon.png)"
                            value={settings.faviconUrl}
                            onChange={(e) => updateSettings("faviconUrl", e.target.value)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500">
                            URL do ícone que aparece na aba do navegador. Formatos recomendados: ICO, PNG ou SVG.
                            Tamanho ideal: 32x32px ou 64x64px.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => updateSettings("faviconUrl", "/img/favicon.png")}
                            >
                              Restaurar Padrão
                            </Button>
                            <div>
                              <input
                                type="file"
                                ref={faviconInputRef}
                                className="hidden"
                                accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
                                onChange={(e) => handleImageUpload(e, 'favicon')}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="text-xs flex items-center gap-1"
                                onClick={() => {
                                  console.log("Clicou no botão de upload de favicon");
                                  faviconInputRef.current?.click();
                                }}
                              >
                                <Upload className="h-3 w-3" />
                                Selecionar Imagem
                              </Button>
                            </div>
                          </div>

                          {/* Mostrar imagem selecionada com botão de carregar */}
                          {selectedImages.favicon && (
                            <div className="mt-2 border border-dashed border-gray-300 p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={selectedImages.favicon.data}
                                    alt="Favicon preview"
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Imagem selecionada: {selectedImages.favicon.file.name}
                                  </p>
                                  <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => uploadSelectedImage('favicon')}
                                  >
                                    Carregar Imagem
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nome e descrição do site */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="site-name" className="font-medium text-base mb-2 block">
                            Nome do Site
                          </Label>
                          <Input
                            id="site-name"
                            type="text"
                            placeholder="Nome do seu site"
                            value={settings.siteName}
                            onChange={(e) => updateSettings("siteName", e.target.value)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Nome que aparecerá no título das páginas e cabeçalhos.
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="site-description" className="font-medium text-base mb-2 block">
                            Descrição do Site
                          </Label>
                          <Input
                            id="site-description"
                            type="text"
                            placeholder="Descrição breve do seu site"
                            value={settings.siteDescription}
                            onChange={(e) => updateSettings("siteDescription", e.target.value)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Breve descrição que aparecerá em meta tags e páginas de login.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Banners Promocionais */}
                    <div className="pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-medium mb-4">Banners Promocionais</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Configure banners diferentes para desktop e mobile para evitar distorções.
                      </p>

                      <div className="grid grid-cols-1 gap-6">
                        {/* Banner Desktop */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="banner-desktop-url" className="font-medium text-base mb-2 block">
                              Banner Desktop
                            </Label>
                            <div className="flex flex-col gap-4">
                              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                                {settings.bannerDesktopUrl ? (
                                  <img src={settings.bannerDesktopUrl} alt="Banner Desktop" className="max-w-full max-h-[180px] object-contain rounded" />
                                ) : (
                                  <div className="text-gray-400 text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-2" />
                                    <span className="text-sm">Banner Desktop não definido</span>
                                    <p className="text-xs mt-1">Recomendado: 1920x400px</p>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                <Input id="banner-desktop-url" type="text" placeholder="URL do banner desktop (ex: /img/banner-desktop.jpg)" value={settings.bannerDesktopUrl || ''} onChange={(e) => updateSettings("bannerDesktopUrl", e.target.value)} className="w-full" />
                                <p className="text-xs text-gray-500">Banner exibido em telas grandes (desktop/tablet). Tamanho recomendado: 1920x400px. Formato: JPG ou PNG.</p>

                                <div className="flex flex-wrap gap-2">
                                  <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => updateSettings("bannerDesktopUrl", "/img/banner-desktop.jpg")}>Restaurar Padrão</Button>
                                  <div>
                                    <input type="file" ref={bannerDesktopInputRef} style={{ opacity: 0, position: 'absolute', zIndex: -1, width: 0, height: 0, pointerEvents: 'none' }} accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleImageUpload(e, 'bannerDesktop')} />
                                    <Button type="button" variant="secondary" size="sm" className="text-xs flex items-center gap-1" onClick={() => {
                                      console.log("Botão selecionar banner desktop clicado");
                                      bannerDesktopInputRef.current?.click();
                                    }}>
                                      <Upload className="h-3 w-3" />Selecionar Imagem
                                    </Button>
                                  </div>
                                </div>

                                {selectedImages.bannerDesktop && (
                                  <div className="mt-2 border border-dashed border-gray-300 p-3 rounded-md bg-blue-50">
                                    <div className="flex items-center gap-3">
                                      <div className="h-16 w-24 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={selectedImages.bannerDesktop.data} alt="Banner Desktop preview" className="h-full w-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs text-gray-600 mb-1 font-medium">{selectedImages.bannerDesktop.file.name}</p>
                                        <p className="text-xs text-gray-500 mb-2">Tamanho: {(selectedImages.bannerDesktop.file.size / 1024).toFixed(0)} KB</p>
                                        <Button type="button" variant="default" size="sm" className="text-xs" onClick={() => uploadSelectedImage('bannerDesktop')}>Carregar Banner Desktop</Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Banner Mobile */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <div>
                            <Label htmlFor="banner-mobile-url" className="font-medium text-base mb-2 block">Banner Mobile</Label>
                            <div className="flex flex-col gap-4">
                              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                                {settings.bannerMobileUrl ? (
                                  <img src={settings.bannerMobileUrl} alt="Banner Mobile" className="max-w-full max-h-[180px] object-contain rounded" />
                                ) : (
                                  <div className="text-gray-400 text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-2" />
                                    <span className="text-sm">Banner Mobile não definido</span>
                                    <p className="text-xs mt-1">Recomendado: 800x600px</p>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                <Input id="banner-mobile-url" type="text" placeholder="URL do banner mobile (ex: /img/banner-mobile.jpg)" value={settings.bannerMobileUrl || ''} onChange={(e) => updateSettings("bannerMobileUrl", e.target.value)} className="w-full" />
                                <p className="text-xs text-gray-500">Banner exibido em telas pequenas (smartphones). Tamanho recomendado: 800x600px. Formato: JPG ou PNG.</p>

                                <div className="flex flex-wrap gap-2">
                                  <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => updateSettings("bannerMobileUrl", "/img/banner-mobile.jpg")}>Restaurar Padrão</Button>
                                  <div>
                                    <input type="file" ref={bannerMobileInputRef} style={{ opacity: 0, position: 'absolute', zIndex: -1, width: 0, height: 0, pointerEvents: 'none' }} accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleImageUpload(e, 'bannerMobile')} />
                                    <Button type="button" variant="secondary" size="sm" className="text-xs flex items-center gap-1" onClick={() => {
                                      console.log("Botão selecionar banner mobile clicado");
                                      bannerMobileInputRef.current?.click();
                                    }}>
                                      <Upload className="h-3 w-3" />Selecionar Imagem
                                    </Button>
                                  </div>
                                </div>

                                {selectedImages.bannerMobile && (
                                  <div className="mt-2 border border-dashed border-gray-300 p-3 rounded-md bg-green-50">
                                    <div className="flex items-center gap-3">
                                      <div className="h-16 w-24 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={selectedImages.bannerMobile.data} alt="Banner Mobile preview" className="h-full w-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs text-gray-600 mb-1 font-medium">{selectedImages.bannerMobile.file.name}</p>
                                        <p className="text-xs text-gray-500 mb-2">Tamanho: {(selectedImages.bannerMobile.file.size / 1024).toFixed(0)} KB</p>
                                        <Button type="button" variant="default" size="sm" className="text-xs" onClick={() => uploadSelectedImage('bannerMobile')}>Carregar Banner Mobile</Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">📐 Tamanhos Recomendados</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700">
                            <div><strong>Desktop:</strong> 1920x400px (paisagem)<br />Ideal para telas grandes e widescreen</div>
                            <div><strong>Mobile:</strong> 800x600px (retrato)<br />Otimizado para smartphones</div>
                          </div>
                          <p className="text-xs text-blue-600 mt-2">💡 Dica: Use imagens diferentes para evitar distorções. O sistema escolhe automaticamente qual banner exibir baseado no tamanho da tela.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Esquema de Cores */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Esquema de Cores</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna de seleção de cores */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="main-color" className="font-medium text-base mb-2 inline-flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: settings.mainColor }}></div>
                        Cor Principal
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="main-color"
                          type="color"
                          value={settings.mainColor}
                          onChange={(e) => updateSettings("mainColor", e.target.value)}
                          className="w-14 h-14 p-1 rounded-full cursor-pointer"
                        />
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={settings.mainColor}
                            onChange={(e) => updateSettings("mainColor", e.target.value)}
                            maxLength={7}
                            className="font-mono mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            Botões, cabeçalhos e elementos interativos
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondary-color" className="font-medium text-base mb-2 inline-flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: settings.secondaryColor }}></div>
                        Cor Secundária
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => updateSettings("secondaryColor", e.target.value)}
                          className="w-14 h-14 p-1 rounded-full cursor-pointer"
                        />
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={settings.secondaryColor}
                            onChange={(e) => updateSettings("secondaryColor", e.target.value)}
                            maxLength={7}
                            className="font-mono mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            Bordas, elementos secundários e realces
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accent-color" className="font-medium text-base mb-2 inline-flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: settings.accentColor }}></div>
                        Cor de Destaque
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => updateSettings("accentColor", e.target.value)}
                          className="w-14 h-14 p-1 rounded-full cursor-pointer"
                        />
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={settings.accentColor}
                            onChange={(e) => updateSettings("accentColor", e.target.value)}
                            maxLength={7}
                            className="font-mono mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            Notificações, tags e elementos de destaque
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coluna de pré-visualização */}
                  <div>
                    <h4 className="font-medium mb-3">Pré-visualização do Tema</h4>
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      {/* Barra de navegação simulada */}
                      <div className="p-3" style={{ backgroundColor: settings.mainColor }}>
                        <div className="flex justify-between items-center">
                          <div className="text-white font-bold">Logo do Site</div>
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                            <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                            <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                          </div>
                        </div>
                      </div>

                      {/* Corpo da página simulado */}
                      <div className="p-4 bg-white">
                        <h5 className="text-sm font-bold" style={{ color: settings.mainColor }}>
                          Título da Seção
                        </h5>
                        <div className="w-full h-3 bg-gray-100 my-2"></div>
                        <div className="w-3/4 h-3 bg-gray-100 mb-3"></div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button
                            size="sm"
                            style={{ backgroundColor: settings.mainColor }}
                            className="text-white"
                          >
                            Botão Principal
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            style={{ borderColor: settings.secondaryColor, color: settings.secondaryColor }}
                          >
                            Secundário
                          </Button>
                          <Badge style={{ backgroundColor: settings.accentColor }}>
                            Destaque
                          </Badge>
                        </div>

                        <div className="mt-4 rounded p-2" style={{ backgroundColor: `${settings.mainColor}15` }}>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${settings.mainColor}30` }}>
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: settings.mainColor }}></div>
                            </div>
                            <div className="ml-2">
                              <div className="h-2 w-20 rounded" style={{ backgroundColor: settings.mainColor }}></div>
                              <div className="h-2 w-16 mt-1 rounded bg-gray-200"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Temas predefinidos */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Temas Predefinidos</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={() => {
                            updateSettings("mainColor", "#0044c6");
                            updateSettings("secondaryColor", "#0044c6");
                            updateSettings("accentColor", "#00c721");
                          }}
                        >
                          <div className="flex space-x-1 items-center">
                            <div className="w-4 h-4 rounded-full bg-[#0044c6]"></div>
                            <div className="w-4 h-4 rounded-full bg-[#0044c6]"></div>
                            <div className="w-4 h-4 rounded-full bg-[#00c721]"></div>
                          </div>
                          <span className="text-xs mt-1 block">Azul Clássico</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={() => {
                            updateSettings("mainColor", "#9333ea");
                            updateSettings("secondaryColor", "#a855f7");
                            updateSettings("accentColor", "#f97316");
                          }}
                        >
                          <div className="flex space-x-1 items-center">
                            <div className="w-4 h-4 rounded-full bg-[#9333ea]"></div>
                            <div className="w-4 h-4 rounded-full bg-[#a855f7]"></div>
                            <div className="w-4 h-4 rounded-full bg-[#f97316]"></div>
                          </div>
                          <span className="text-xs mt-1 block">Roxo Vibrante</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={() => {
                            updateSettings("mainColor", "#059669");
                            updateSettings("secondaryColor", "#10b981");
                            updateSettings("accentColor", "#f59e0b");
                          }}
                        >
                          <div className="flex space-x-1 items-center">
                            <div className="w-4 h-4 rounded-full bg-[#059669]"></div>
                            <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
                            <div className="w-4 h-4 rounded-full bg-[#f59e0b]"></div>
                          </div>
                          <span className="text-xs mt-1 block">Verde Natureza</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <Palette className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Dicas de Personalização</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Escolha cores que combinem entre si e reflitam a identidade visual da sua marca.
                      Cores vibrantes geram mais engajamento, enquanto tons mais sóbrios transmitem confiança.
                    </p>
                    <ul className="mt-2 text-sm text-blue-700 list-disc pl-4">
                      <li>Use a cor principal para elementos interativos como botões e links</li>
                      <li>A cor secundária deve ser complementar à principal e usada em elementos de suporte</li>
                      <li>A cor de destaque deve contrastar com as demais, ideal para chamar atenção</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Aba do Sistema */}
          <TabsContent value="system">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Cadastro de usuários</Label>
                    <p className="text-sm text-gray-500">
                      Permite que novos usuários se cadastrem na plataforma.
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowUserRegistration}
                    onCheckedChange={(checked) => updateSettings("allowUserRegistration", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Depósitos</Label>
                    <p className="text-sm text-gray-500">
                      Permite que os usuários realizem depósitos na plataforma.
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowDeposits}
                    onCheckedChange={(checked) => updateSettings("allowDeposits", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Saques</Label>
                    <p className="text-sm text-gray-500">
                      Permite que os usuários realizem saques da plataforma.
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowWithdrawals}
                    onCheckedChange={(checked) => updateSettings("allowWithdrawals", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Apostas com Bônus</Label>
                    <p className="text-sm text-gray-500">
                      Permite que os usuários utilizem saldo de bônus para realizar apostas.
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowBonusBets}
                    onCheckedChange={(checked) => updateSettings("allowBonusBets", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base text-red-600 font-medium">Modo Manutenção</Label>
                    <p className="text-sm text-gray-500">
                      Quando ativado, apenas administradores podem acessar o sistema.
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSettings("maintenanceMode", checked)}
                  />
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base text-green-600 font-medium">Aprovação Automática de Saques</Label>
                      <p className="text-sm text-gray-500">
                        Saques abaixo do limite serão aprovados automaticamente.
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoApproveWithdrawals}
                      onCheckedChange={(checked) => updateSettings("autoApproveWithdrawals", checked)}
                    />
                  </div>

                  {settings.autoApproveWithdrawals && (
                    <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
                      <Label htmlFor="auto-approve-limit" className="text-base font-medium mb-2 block">
                        Limite para Aprovação Automática (R$)
                      </Label>
                      <div className="flex items-center">
                        <div className="relative w-full">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                          <Input
                            id="auto-approve-limit"
                            type="text"
                            inputMode="decimal"
                            value={formatCurrency(settings.autoApproveWithdrawalLimit)}
                            onChange={(e) => {
                              const parsedValue = parseMoneyValue(e.target.value);
                              updateSettings("autoApproveWithdrawalLimit", parsedValue);
                            }}
                            className="pl-8 font-semibold"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Saques até este valor serão aprovados automaticamente sem revisão manual.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-green-600">R$ {settings.autoApproveWithdrawalLimit.toFixed(2).replace('.', ',')}</Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSettings("autoApproveWithdrawalLimit", 30)}
                          >
                            R$30,00
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSettings("autoApproveWithdrawalLimit", 50)}
                          >
                            R$50,00
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSettings("autoApproveWithdrawalLimit", 100)}
                          >
                            R$100,00
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Modo de Manutenção</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Ativar o modo de manutenção bloqueará o acesso de todos os usuários não-administradores.
                      Use esta opção com cautela.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Aprovação Automática de Saques</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      A aprovação automática de saques ajuda a agilizar o processo para pequenos valores,
                      mas configure um limite seguro para sua operação. Saques acima do limite ainda
                      necessitarão de aprovação manual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={restoreDefaults}>
          Restaurar Padrões
        </Button>
        <Button
          disabled={!hasChanges || saveSettingsMutation.isPending}
          onClick={saveSettings}
          className="flex items-center gap-1"
        >
          {saveSettingsMutation.isPending ? (
            "Salvando..."
          ) : (
            <>
              <Check className="h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}