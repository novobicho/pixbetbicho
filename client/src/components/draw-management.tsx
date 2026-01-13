import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Draw, Animal } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye, Trash, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DrawTemplatesManagement } from "./draw-templates-management";

export function DrawManagement() {
  const { toast } = useToast();
  const [newDrawDialogOpen, setNewDrawDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [editDrawDialogOpen, setEditDrawDialogOpen] = useState(false);
  const [editResultDialogOpen, setEditResultDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [isEditingResult, setIsEditingResult] = useState(false);

  // Estados para IDs dos animais (usados para enviar ao backend)
  const [resultAnimalId, setResultAnimalId] = useState<string>("");
  const [resultAnimalId2, setResultAnimalId2] = useState<string>("");
  const [resultAnimalId3, setResultAnimalId3] = useState<string>("");
  const [resultAnimalId4, setResultAnimalId4] = useState<string>("");
  const [resultAnimalId5, setResultAnimalId5] = useState<string>("");
  const [resultAnimalId6, setResultAnimalId6] = useState<string>("");
  const [resultAnimalId7, setResultAnimalId7] = useState<string>("");
  const [resultAnimalId8, setResultAnimalId8] = useState<string>("");
  const [resultAnimalId9, setResultAnimalId9] = useState<string>("");
  const [resultAnimalId10, setResultAnimalId10] = useState<string>("");

  // Estados para objetos dos animais (usado para exibição)
  const [resultAnimal1, setResultAnimal1] = useState<Animal | null>(null);
  const [resultAnimal2, setResultAnimal2] = useState<Animal | null>(null);
  const [resultAnimal3, setResultAnimal3] = useState<Animal | null>(null);
  const [resultAnimal4, setResultAnimal4] = useState<Animal | null>(null);
  const [resultAnimal5, setResultAnimal5] = useState<Animal | null>(null);
  const [resultAnimal6, setResultAnimal6] = useState<Animal | null>(null);
  const [resultAnimal7, setResultAnimal7] = useState<Animal | null>(null);
  const [resultAnimal8, setResultAnimal8] = useState<Animal | null>(null);
  const [resultAnimal9, setResultAnimal9] = useState<Animal | null>(null);
  const [resultAnimal10, setResultAnimal10] = useState<Animal | null>(null);

  // Estados para números dos prêmios
  const [resultNumber1, setResultNumber1] = useState<string>("");
  const [resultNumber2, setResultNumber2] = useState<string>("");
  const [resultNumber3, setResultNumber3] = useState<string>("");
  const [resultNumber4, setResultNumber4] = useState<string>("");
  const [resultNumber5, setResultNumber5] = useState<string>("");
  const [resultNumber6, setResultNumber6] = useState<string>("");
  const [resultNumber7, setResultNumber7] = useState<string>("");
  const [resultNumber8, setResultNumber8] = useState<string>("");
  const [resultNumber9, setResultNumber9] = useState<string>("");
  const [resultNumber10, setResultNumber10] = useState<string>("");

  // Estado para novo sorteio
  const [newDrawData, setNewDrawData] = useState({
    name: "",
    time: "",
    date: ""
  });

  // Estado para edição de sorteio
  const [editDrawData, setEditDrawData] = useState({
    name: "",
    time: "",
    date: ""
  });

  // Estado para filtro de data (padrão: hoje)
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // YYYY-MM-DD (data local)
  });

  const { data: allDraws, isLoading } = useQuery<Draw[]>({
    queryKey: ["/api/draws"],
  });

  // Filtrar draws por data
  const draws = allDraws?.filter(draw => {
    // Filtrar por data se houver filtro ativo
    if (filterDate) {
      const drawDate = new Date(draw.date).toISOString().split('T')[0];
      return drawDate === filterDate;
    }

    return true;
  });

  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const createDrawMutation = useMutation({
    mutationFn: async (drawData: { name: string; time: string; date: string }) => {
      const res = await apiRequest("POST", "/api/draws", drawData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sorteio criado com sucesso",
      });
      setNewDrawDialogOpen(false);
      setNewDrawData({ name: "", time: "", date: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/draws"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draws/upcoming"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar sorteio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar um sorteio
  const updateDrawMutation = useMutation({
    mutationFn: async ({
      drawId,
      drawData
    }: {
      drawId: number;
      drawData: {
        name: string;
        time: string;
        date: string
      }
    }) => {
      const res = await apiRequest("PUT", `/api/draws/${drawId}`, drawData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sorteio atualizado com sucesso",
      });
      setEditDrawDialogOpen(false);
      setSelectedDraw(null);
      queryClient.invalidateQueries({ queryKey: ["/api/draws"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draws/upcoming"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar sorteio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutação para excluir um sorteio
  const deleteDrawMutation = useMutation({
    mutationFn: async (drawId: number) => {
      const res = await apiRequest("DELETE", `/api/draws/${drawId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sorteio excluído com sucesso",
      });
      setDeleteDialogOpen(false);
      setSelectedDraw(null);
      queryClient.invalidateQueries({ queryKey: ["/api/draws"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draws/upcoming"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir sorteio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutação para atualização automática de resultado
  const autoUpdateDrawMutation = useMutation({
    mutationFn: async (drawId: number) => {
      const res = await apiRequest("POST", `/api/draws/${drawId}/auto-update`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Resultado atualizado automaticamente",
        description: "O resultado foi buscado e atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/draws"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draws/upcoming"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na atualização automática",
        description: error.message || "Não foi possível buscar o resultado. Verifique se o nome do sorteio corresponde ao site.",
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar todos os sorteios pendentes do dia
  const updateAllDrawsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/draws/auto-update-all`);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Atualização em lote concluída",
        description: `${data.success} sorteios atualizados com sucesso${data.failed > 0 ? `, ${data.failed} falharam` : ''}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/draws"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draws/upcoming"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na atualização em lote",
        description: error.message || "Não foi possível atualizar os sorteios",
        variant: "destructive",
      });
    },
  });



  const updateDrawResultMutation = useMutation({
    mutationFn: async ({
      drawId,
      animalId,
      animalId2,
      animalId3,
      animalId4,
      animalId5,
      animalId6,
      animalId7,
      animalId8,
      animalId9,
      animalId10,
      resultNumber1,
      resultNumber2,
      resultNumber3,
      resultNumber4,
      resultNumber5,
      resultNumber6,
      resultNumber7,
      resultNumber8,
      resultNumber9,
      resultNumber10
    }: {
      drawId: number;
      animalId: number;
      animalId2?: number;
      animalId3?: number;
      animalId4?: number;
      animalId5?: number;
      animalId6?: number;
      animalId7?: number;
      animalId8?: number;
      animalId9?: number;
      animalId10?: number;
      resultNumber1: string;
      resultNumber2?: string;
      resultNumber3?: string;
      resultNumber4?: string;
      resultNumber5?: string;
      resultNumber6?: string;
      resultNumber7?: string;
      resultNumber8?: string;
      resultNumber9?: string;
      resultNumber10?: string;
    }) => {
      const res = await apiRequest("PUT", `/api/draws/${drawId}/result`, {
        animalId,
        animalId2,
        animalId3,
        animalId4,
        animalId5,
        animalId6,
        animalId7,
        animalId8,
        animalId9,
        animalId10,
        resultNumber1,
        resultNumber2,
        resultNumber3,
        resultNumber4,
        resultNumber5,
        resultNumber6,
        resultNumber7,
        resultNumber8,
        resultNumber9,
        resultNumber10
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: isEditingResult
          ? "Resultado atualizado com sucesso"
          : "Resultado registrado com sucesso",
        description: isEditingResult
          ? "Os resultados do sorteio foram atualizados"
          : "Apostas processadas e saldos atualizados para os vencedores",
      });
      setResultDialogOpen(false);
      setSelectedDraw(null);
      setIsEditingResult(false);

      // Invalidate all relevant caches to force refresh
      console.log("Invalidando caches após o processamento do resultado do sorteio");

      // Invalidate draw-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/draws"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draws/upcoming"] });

      // Invalidate bet-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bets"] });

      // Invalidate user data to show updated balance
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });

      // Delay a bit and invalidate again to ensure data is fresh
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/bets"] });
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: isEditingResult ? "Erro ao atualizar resultado" : "Erro ao registrar resultado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateDraw = () => {
    if (!newDrawData.name || !newDrawData.time || !newDrawData.date) {
      toast({
        title: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    // Transformar a data e hora em um formato ISO compatível com o backend
    // Pegamos a data do input type="date" e adicionamos o horário para criar um timestamp válido
    try {
      // Extrair apenas a parte da data do input (YYYY-MM-DD)
      const datePart = newDrawData.date;

      // Extrair a parte do tempo (HH:MM)
      const timePart = newDrawData.time;

      // Verificar se o formato do horário é válido (HH:MM)
      if (!/^\d{1,2}:\d{2}$/.test(timePart)) {
        toast({
          title: "Formato de horário inválido",
          description: "Use o formato HH:MM (ex: 14:00)",
          variant: "destructive",
        });
        return;
      }

      // Criar um objeto Date combinando data e hora,
      // ajustando para manter a data correta independente do fuso horário
      const [hours, minutes] = timePart.split(':').map(Number);

      // Usar uma abordagem que preserva a data exata selecionada pelo usuário
      // Formato: 'YYYY-MM-DDT00:00:00.000Z'
      const dateWithoutTime = `${datePart}T00:00:00.000Z`;
      const fullDate = new Date(dateWithoutTime);

      // Corrigir o offset de fuso horário para garantir que a data se mantenha a mesma
      const offset = fullDate.getTimezoneOffset() * 60000; // Offset em milissegundos
      const dateWithoutOffset = new Date(fullDate.getTime() + offset);

      // Agora adicionar as horas e minutos
      dateWithoutOffset.setHours(hours, minutes, 0, 0);

      // Criar objeto com os dados formatados
      const formattedDrawData = {
        name: newDrawData.name,
        time: newDrawData.time,
        date: dateWithoutOffset.toISOString() // Convertendo para ISO string para enviar ao backend
      };

      console.log("Enviando dados para criação de sorteio:", formattedDrawData);

      createDrawMutation.mutate(formattedDrawData);
    } catch (error) {
      toast({
        title: "Erro ao processar data e hora",
        description: "Verifique se os formatos estão corretos",
        variant: "destructive",
      });
    }
  };

  const handleSetResult = () => {
    if (!selectedDraw || !resultAnimalId) {
      toast({
        title: "Selecione pelo menos o 1° prêmio",
        variant: "destructive",
      });
      return;
    }

    // Verificar se pelo menos um número foi fornecido para o 1º prêmio
    if (!resultNumber1) {
      toast({
        title: "Informe o número do 1° prêmio",
        description: "É necessário inserir o número da milhar para o 1º prêmio",
        variant: "destructive",
      });
      return;
    }

    // Construir objeto com parâmetros para a mutação
    const mutationParams: {
      drawId: number;
      animalId: number;
      animalId2?: number;
      animalId3?: number;
      animalId4?: number;
      animalId5?: number;
      animalId6?: number;
      animalId7?: number;
      animalId8?: number;
      animalId9?: number;
      animalId10?: number;
      resultNumber1: string;
      resultNumber2?: string;
      resultNumber3?: string;
      resultNumber4?: string;
      resultNumber5?: string;
      resultNumber6?: string;
      resultNumber7?: string;
      resultNumber8?: string;
      resultNumber9?: string;
      resultNumber10?: string;
    } = {
      drawId: selectedDraw.id,
      animalId: parseInt(resultAnimalId),
      resultNumber1: resultNumber1.padStart(4, '0'), // Garantir 4 dígitos para milhar
    };

    // Adicionar prêmios opcionais se foram preenchidos
    if (resultAnimalId2 && resultAnimalId2 !== "0") {
      mutationParams.animalId2 = parseInt(resultAnimalId2);
      if (resultNumber2) {
        mutationParams.resultNumber2 = resultNumber2.padStart(4, '0');
      }
    }

    if (resultAnimalId3 && resultAnimalId3 !== "0") {
      mutationParams.animalId3 = parseInt(resultAnimalId3);
      if (resultNumber3) {
        mutationParams.resultNumber3 = resultNumber3.padStart(4, '0');
      }
    }

    if (resultAnimalId4 && resultAnimalId4 !== "0") {
      mutationParams.animalId4 = parseInt(resultAnimalId4);
      if (resultNumber4) {
        mutationParams.resultNumber4 = resultNumber4.padStart(4, '0');
      }
    }

    if (resultAnimalId5 && resultAnimalId5 !== "0") {
      mutationParams.animalId5 = parseInt(resultAnimalId5);
      if (resultNumber5) {
        mutationParams.resultNumber5 = resultNumber5.padStart(4, '0');
      }
    }

    if (resultAnimalId6 && resultAnimalId6 !== "0") {
      mutationParams.animalId6 = parseInt(resultAnimalId6);
      if (resultNumber6) {
        mutationParams.resultNumber6 = resultNumber6.padStart(4, '0');
      }
    }

    if (resultAnimalId7 && resultAnimalId7 !== "0") {
      mutationParams.animalId7 = parseInt(resultAnimalId7);
      if (resultNumber7) {
        mutationParams.resultNumber7 = resultNumber7.padStart(4, '0');
      }
    }

    if (resultAnimalId8 && resultAnimalId8 !== "0") {
      mutationParams.animalId8 = parseInt(resultAnimalId8);
      if (resultNumber8) {
        mutationParams.resultNumber8 = resultNumber8.padStart(4, '0');
      }
    }

    if (resultAnimalId9 && resultAnimalId9 !== "0") {
      mutationParams.animalId9 = parseInt(resultAnimalId9);
      if (resultNumber9) {
        mutationParams.resultNumber9 = resultNumber9.padStart(4, '0');
      }
    }

    if (resultAnimalId10 && resultAnimalId10 !== "0") {
      mutationParams.animalId10 = parseInt(resultAnimalId10);
      if (resultNumber10) {
        mutationParams.resultNumber10 = resultNumber10.padStart(4, '0');
      }
    }

    console.log("Atualizando sorteio com parâmetros:", mutationParams);
    updateDrawResultMutation.mutate(mutationParams);
  };

  const openResultDialog = (draw: Draw) => {
    setSelectedDraw(draw);

    if (isEditingResult && draw.status === "completed") {
      // Preencher com valores existentes se for edição
      setResultAnimalId(draw.resultAnimalId ? String(draw.resultAnimalId) : "");
      setResultAnimalId2(draw.resultAnimalId2 ? String(draw.resultAnimalId2) : "");
      setResultAnimalId3(draw.resultAnimalId3 ? String(draw.resultAnimalId3) : "");
      setResultAnimalId4(draw.resultAnimalId4 ? String(draw.resultAnimalId4) : "");
      setResultAnimalId5(draw.resultAnimalId5 ? String(draw.resultAnimalId5) : "");
      setResultAnimalId6(draw.resultAnimalId6 ? String(draw.resultAnimalId6) : "");
      setResultAnimalId7(draw.resultAnimalId7 ? String(draw.resultAnimalId7) : "");
      setResultAnimalId8(draw.resultAnimalId8 ? String(draw.resultAnimalId8) : "");
      setResultAnimalId9(draw.resultAnimalId9 ? String(draw.resultAnimalId9) : "");
      setResultAnimalId10(draw.resultAnimalId10 ? String(draw.resultAnimalId10) : "");

      // Buscar objetos de animais correspondentes
      if (animals) {
        setResultAnimal1(draw.resultAnimalId ? animals.find((a: Animal) => a.id === draw.resultAnimalId) || null : null);
        setResultAnimal2(draw.resultAnimalId2 ? animals.find((a: Animal) => a.id === draw.resultAnimalId2) || null : null);
        setResultAnimal3(draw.resultAnimalId3 ? animals.find((a: Animal) => a.id === draw.resultAnimalId3) || null : null);
        setResultAnimal4(draw.resultAnimalId4 ? animals.find((a: Animal) => a.id === draw.resultAnimalId4) || null : null);
        setResultAnimal5(draw.resultAnimalId5 ? animals.find((a: Animal) => a.id === draw.resultAnimalId5) || null : null);
        setResultAnimal6(draw.resultAnimalId6 ? animals.find((a: Animal) => a.id === draw.resultAnimalId6) || null : null);
        setResultAnimal7(draw.resultAnimalId7 ? animals.find((a: Animal) => a.id === draw.resultAnimalId7) || null : null);
        setResultAnimal8(draw.resultAnimalId8 ? animals.find((a: Animal) => a.id === draw.resultAnimalId8) || null : null);
        setResultAnimal9(draw.resultAnimalId9 ? animals.find((a: Animal) => a.id === draw.resultAnimalId9) || null : null);
        setResultAnimal10(draw.resultAnimalId10 ? animals.find((a: Animal) => a.id === draw.resultAnimalId10) || null : null);
      }

      // Carregar os valores numéricos, se existirem
      setResultNumber1(draw.resultNumber1 || "");
      setResultNumber2(draw.resultNumber2 || "");
      setResultNumber3(draw.resultNumber3 || "");
      setResultNumber4(draw.resultNumber4 || "");
      setResultNumber5(draw.resultNumber5 || "");
      setResultNumber6(draw.resultNumber6 || "");
      setResultNumber7(draw.resultNumber7 || "");
      setResultNumber8(draw.resultNumber8 || "");
      setResultNumber9(draw.resultNumber9 || "");
      setResultNumber10(draw.resultNumber10 || "");
    } else {
      // Resetar todos os valores para novo resultado
      setResultAnimalId("");
      setResultAnimalId2("");
      setResultAnimalId3("");
      setResultAnimalId4("");
      setResultAnimalId5("");
      setResultAnimalId6("");
      setResultAnimalId7("");
      setResultAnimalId8("");
      setResultAnimalId9("");
      setResultAnimalId10("");

      // Resetar os objetos dos animais
      setResultAnimal1(null);
      setResultAnimal2(null);
      setResultAnimal3(null);
      setResultAnimal4(null);
      setResultAnimal5(null);
      setResultAnimal6(null);
      setResultAnimal7(null);
      setResultAnimal8(null);
      setResultAnimal9(null);
      setResultAnimal10(null);

      // Resetar os números dos prêmios
      setResultNumber1("");
      setResultNumber2("");
      setResultNumber3("");
      setResultNumber4("");
      setResultNumber5("");
      setResultNumber6("");
      setResultNumber7("");
      setResultNumber8("");
      setResultNumber9("");
      setResultNumber10("");
    }

    setResultDialogOpen(true);
  };

  // Função para abrir o diálogo de edição
  const openEditDialog = (draw: Draw) => {
    setSelectedDraw(draw);

    // Preencher o formulário com os dados atuais do sorteio
    setEditDrawData({
      name: draw.name,
      time: draw.time,
      date: new Date(draw.date).toISOString().split('T')[0], // Formato YYYY-MM-DD
    });

    setEditDrawDialogOpen(true);
  };

  // Função para abrir o diálogo de exclusão
  const openDeleteDialog = (draw: Draw) => {
    setSelectedDraw(draw);
    setDeleteDialogOpen(true);
  };

  // Função para atualizar um sorteio
  const handleUpdateDraw = () => {
    if (!selectedDraw) return;

    if (!editDrawData.name || !editDrawData.time || !editDrawData.date) {
      toast({
        title: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extrair apenas a parte da data do input (YYYY-MM-DD)
      const datePart = editDrawData.date;

      // Extrair a parte do tempo (HH:MM)
      const timePart = editDrawData.time;

      // Verificar se o formato do horário é válido (HH:MM)
      if (!/^\d{1,2}:\d{2}$/.test(timePart)) {
        toast({
          title: "Formato de horário inválido",
          description: "Use o formato HH:MM (ex: 14:00)",
          variant: "destructive",
        });
        return;
      }

      // Criar um objeto Date combinando data e hora,
      // ajustando para manter a data correta independente do fuso horário
      const [hours, minutes] = timePart.split(':').map(Number);

      // Usar uma abordagem que preserva a data exata selecionada pelo usuário
      // Formato: 'YYYY-MM-DDT00:00:00.000Z'
      const dateWithoutTime = `${datePart}T00:00:00.000Z`;
      const fullDate = new Date(dateWithoutTime);

      // Corrigir o offset de fuso horário para garantir que a data se mantenha a mesma
      const offset = fullDate.getTimezoneOffset() * 60000; // Offset em milissegundos
      const dateWithoutOffset = new Date(fullDate.getTime() + offset);

      // Agora adicionar as horas e minutos
      dateWithoutOffset.setHours(hours, minutes, 0, 0);

      // Criar objeto com os dados formatados
      const formattedDrawData = {
        name: editDrawData.name,
        time: editDrawData.time,
        date: dateWithoutOffset.toISOString() // Convertendo para ISO string para enviar ao backend
      };

      console.log("Enviando dados para atualização de sorteio:", formattedDrawData);

      updateDrawMutation.mutate({
        drawId: selectedDraw.id,
        drawData: formattedDrawData
      });
    } catch (error) {
      toast({
        title: "Erro ao processar data e hora",
        description: "Verifique se os formatos estão corretos",
        variant: "destructive",
      });
    }
  };

  // Função para excluir um sorteio
  const handleDeleteDraw = () => {
    if (!selectedDraw) return;
    deleteDrawMutation.mutate(selectedDraw.id);
  };

  const renderDrawStatus = (draw: Draw) => {
    if (draw.status === "pending") {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Aguardando
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Finalizado
        </Badge>
      );
    }
  };

  // Encontrar animal pelo número da aposta (milhar)
  const findAnimalByNumber = (number: string): Animal | null => {
    if (!animals || !number) return null;

    // Pegar os dois últimos dígitos para determinar o grupo
    const lastTwoDigits = parseInt(number.slice(-2));

    // No jogo do bicho, cada grupo corresponde a 4 números finais:
    // Grupo 1 (Avestruz): 01, 02, 03, 04
    // Grupo 2 (Águia): 05, 06, 07, 08
    // ...
    // Calculando o grupo baseado no número final
    const groupNumber = Math.ceil(lastTwoDigits / 4);

    // Para números que terminam em 00, pertencem ao grupo 25 (Vaca)
    const animalGroup = lastTwoDigits === 0 ? 25 : groupNumber;

    // Encontrar o animal pelo grupo
    return animals.find(animal => animal.group === animalGroup) || null;
  };

  const getAnimalName = (animalId: number | null) => {
    if (!animalId || !animals) return "-";
    const animal = animals.find(a => a.id === animalId);
    return animal ? `Grupo ${String(animal.group).padStart(2, '0')} - ${animal.name}` : "-";
  };

  return (
    <Tabs defaultValue="draws" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="draws">Sorteios</TabsTrigger>
        <TabsTrigger value="templates">Templates Recorrentes</TabsTrigger>
      </TabsList>

      <TabsContent value="draws">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Gerenciar Sorteios</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateAllDrawsMutation.mutate()}
                disabled={updateAllDrawsMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${updateAllDrawsMutation.isPending ? 'animate-spin' : ''}`} />
                {updateAllDrawsMutation.isPending ? 'Atualizando...' : 'Atualizar Todos'}
              </Button>
              <Button
                size="sm"
                onClick={() => setNewDrawDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Novo Sorteio
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtro de Data */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <Label htmlFor="filter-date" className="sm:w-32">
                Filtrar por data:
              </Label>
              <Input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="sm:w-48"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = String(today.getMonth() + 1).padStart(2, '0');
                  const day = String(today.getDate()).padStart(2, '0');
                  setFilterDate(`${year}-${month}-${day}`);
                }}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterDate("")}
              >
                Todas
              </Button>
              <span className="text-sm text-muted-foreground">
                {draws?.length || 0} extração(ões) encontrada(s)
              </span>
            </div>

            {/* Versão Desktop - Tabela */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sorteio</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : draws && draws.length > 0 ? (
                    draws.map((draw) => (
                      <TableRow key={draw.id}>
                        <TableCell className="font-medium">{draw.name}</TableCell>
                        <TableCell>{draw.time}</TableCell>
                        <TableCell>
                          {new Date(draw.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{renderDrawStatus(draw)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">1°: {getAnimalName(draw.resultAnimalId)}</span>
                            {draw.resultAnimalId2 && (
                              <span className="text-xs">2°: {getAnimalName(draw.resultAnimalId2)}</span>
                            )}
                            {draw.resultAnimalId3 && (
                              <span className="text-xs">3°: {getAnimalName(draw.resultAnimalId3)}</span>
                            )}
                            {draw.resultAnimalId4 && (
                              <span className="text-xs">4°: {getAnimalName(draw.resultAnimalId4)}</span>
                            )}
                            {draw.resultAnimalId5 && (
                              <span className="text-xs">5°: {getAnimalName(draw.resultAnimalId5)}</span>
                            )}
                            {draw.resultAnimalId6 && (
                              <span className="text-xs">6°: {getAnimalName(draw.resultAnimalId6)}</span>
                            )}
                            {draw.resultAnimalId7 && (
                              <span className="text-xs">7°: {getAnimalName(draw.resultAnimalId7)}</span>
                            )}
                            {draw.resultAnimalId8 && (
                              <span className="text-xs">8°: {getAnimalName(draw.resultAnimalId8)}</span>
                            )}
                            {draw.resultAnimalId9 && (
                              <span className="text-xs">9°: {getAnimalName(draw.resultAnimalId9)}</span>
                            )}
                            {draw.resultAnimalId10 && (
                              <span className="text-xs">10°: {getAnimalName(draw.resultAnimalId10)}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {draw.status === "pending" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-green-600 hover:text-green-800"
                                      onClick={() => {
                                        setIsEditingResult(false);
                                        openResultDialog(draw);
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                      </svg>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Lançar resultado</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            {draw.status === "pending" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-purple-600 hover:text-purple-800"
                                      onClick={() => autoUpdateDrawMutation.mutate(draw.id)}
                                      disabled={autoUpdateDrawMutation.isPending}
                                    >
                                      <RefreshCw className={`h-4 w-4 ${autoUpdateDrawMutation.isPending ? 'animate-spin' : ''}`} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Buscar resultado automaticamente</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            {draw.status === "completed" && (
                              <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-amber-600 hover:text-amber-800"
                                        onClick={() => {
                                          setIsEditingResult(true);
                                          openResultDialog(draw);
                                        }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Editar resultado manualmente</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-purple-600 hover:text-purple-800"
                                        onClick={() => autoUpdateDrawMutation.mutate(draw.id)}
                                        disabled={autoUpdateDrawMutation.isPending}
                                      >
                                        <RefreshCw className={`h-4 w-4 ${autoUpdateDrawMutation.isPending ? 'animate-spin' : ''}`} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Re-buscar resultado automaticamente</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => openEditDialog(draw)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Editar sorteio</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {draw.status === "pending" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => openDeleteDialog(draw)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Excluir sorteio</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Nenhum sorteio encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Versão Mobile - Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {isLoading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : draws && draws.length > 0 ? (
                draws.map((draw) => (
                  <div
                    key={draw.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex flex-col mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">{draw.name}</h3>
                        {renderDrawStatus(draw)}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{draw.time}</span>
                          <span>•</span>
                          <span>{new Date(draw.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {draw.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-green-600 hover:text-green-800"
                                onClick={() => {
                                  setIsEditingResult(false);
                                  openResultDialog(draw);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg> Resultado
                              </Button>
                            )}

                            {draw.status === "completed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-amber-600 hover:text-amber-800"
                                onClick={() => {
                                  setIsEditingResult(true);
                                  openResultDialog(draw);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg> Editar Resultado
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-blue-600 hover:text-blue-800"
                              onClick={() => openEditDialog(draw)}
                            >
                              <Pencil className="h-4 w-4 mr-1" /> Editar
                            </Button>

                            {draw.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-red-600 hover:text-red-800"
                                onClick={() => openDeleteDialog(draw)}
                              >
                                <Trash className="h-4 w-4 mr-1" /> Excluir
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resultados em formato mobile */}
                    {(draw.resultAnimalId || draw.resultAnimalId2 || draw.resultAnimalId3 ||
                      draw.resultAnimalId4 || draw.resultAnimalId5) && (
                        <div className="mt-2 border-t pt-2">
                          <div className="font-medium text-sm mb-1">Resultados:</div>
                          <div className="flex flex-col gap-1 text-sm">
                            {draw.resultAnimalId && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">1° Prêmio:</span>
                                <span className="text-primary-dark">{getAnimalName(draw.resultAnimalId)}</span>
                              </div>
                            )}

                            {draw.resultAnimalId2 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">2° Prêmio:</span>
                                <span>{getAnimalName(draw.resultAnimalId2)}</span>
                              </div>
                            )}

                            {draw.resultAnimalId3 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">3° Prêmio:</span>
                                <span>{getAnimalName(draw.resultAnimalId3)}</span>
                              </div>
                            )}

                            {draw.resultAnimalId4 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">4° Prêmio:</span>
                                <span>{getAnimalName(draw.resultAnimalId4)}</span>
                              </div>
                            )}

                            {draw.resultAnimalId5 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">5° Prêmio:</span>
                                <span>{getAnimalName(draw.resultAnimalId5)}</span>
                              </div>
                            )}

                            {(draw as any).resultAnimalId6 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">6° Prêmio:</span>
                                <span>{getAnimalName((draw as any).resultAnimalId6)}</span>
                              </div>
                            )}

                            {(draw as any).resultAnimalId7 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">7° Prêmio:</span>
                                <span>{getAnimalName((draw as any).resultAnimalId7)}</span>
                              </div>
                            )}

                            {(draw as any).resultAnimalId8 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">8° Prêmio:</span>
                                <span>{getAnimalName((draw as any).resultAnimalId8)}</span>
                              </div>
                            )}

                            {(draw as any).resultAnimalId9 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">9° Prêmio:</span>
                                <span>{getAnimalName((draw as any).resultAnimalId9)}</span>
                              </div>
                            )}

                            {(draw as any).resultAnimalId10 && (
                              <div className="flex gap-1">
                                <span className="text-gray-500 font-medium min-w-[80px]">10° Prêmio:</span>
                                <span>{getAnimalName((draw as any).resultAnimalId10)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  Nenhum sorteio encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates">
        <DrawTemplatesManagement />
      </TabsContent>

      {/* New Draw Dialog */}
      <Dialog open={newDrawDialogOpen} onOpenChange={setNewDrawDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[550px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Novo Sorteio</DialogTitle>
            <DialogDescription>
              Crie um novo sorteio do Jogo do Bicho.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="draw-name" className="sm:text-right">
                Nome
              </Label>
              <Input
                id="draw-name"
                value={newDrawData.name}
                onChange={(e) => setNewDrawData({ ...newDrawData, name: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="draw-time" className="sm:text-right">
                Horário
              </Label>
              <Input
                id="draw-time"
                value={newDrawData.time}
                onChange={(e) => setNewDrawData({ ...newDrawData, time: e.target.value })}
                placeholder="Ex: 14:00"
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="draw-date" className="sm:text-right">
                Data
              </Label>
              <Input
                id="draw-date"
                type="date"
                value={newDrawData.date}
                onChange={(e) => setNewDrawData({ ...newDrawData, date: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewDrawDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateDraw} disabled={createDrawMutation.isPending}>
              {createDrawMutation.isPending ? "Criando..." : "Criar sorteio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Draw Dialog */}
      <Dialog open={editDrawDialogOpen} onOpenChange={setEditDrawDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[550px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Editar Sorteio</DialogTitle>
            <DialogDescription>
              Altere as informações do sorteio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="edit-draw-name" className="sm:text-right">
                Nome
              </Label>
              <Input
                id="edit-draw-name"
                value={editDrawData.name}
                onChange={(e) => setEditDrawData({ ...editDrawData, name: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="edit-draw-time" className="sm:text-right">
                Horário
              </Label>
              <Input
                id="edit-draw-time"
                value={editDrawData.time}
                onChange={(e) => setEditDrawData({ ...editDrawData, time: e.target.value })}
                placeholder="Ex: 14:00"
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="edit-draw-date" className="sm:text-right">
                Data
              </Label>
              <Input
                id="edit-draw-date"
                type="date"
                value={editDrawData.date}
                onChange={(e) => setEditDrawData({ ...editDrawData, date: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDrawDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateDraw} disabled={updateDrawMutation.isPending}>
              {updateDrawMutation.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o sorteio "{selectedDraw?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDraw}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteDrawMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Result Dialog */}
      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl p-2 sm:p-6 overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {isEditingResult ? "Editar Resultado" : "Registrar Resultado"}
            </DialogTitle>
            <DialogDescription>
              {isEditingResult
                ? `Altere os números dos prêmios para o sorteio ${selectedDraw?.name}.`
                : `Insira os números dos 10 prêmios para o sorteio ${selectedDraw?.name}.`}
              Apenas o 1° prêmio é obrigatório.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="numbers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="numbers">Por Números</TabsTrigger>
              <TabsTrigger value="animals">Por Animais</TabsTrigger>
            </TabsList>

            {/* Aba de entrada por números */}
            <TabsContent value="numbers" className="space-y-4">
              <div className="grid gap-4 py-2">
                {/* 1° Prêmio (Obrigatório) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-1" className="sm:text-right font-bold">
                    1° Prêmio
                  </Label>
                  <Input
                    id="result-number-1"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber1 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber1(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId(animalObj.id.toString());
                          setResultAnimal1(animalObj);
                        } else {
                          setResultAnimalId("");
                          setResultAnimal1(null);
                        }
                      } else {
                        setResultAnimalId("");
                        setResultAnimal1(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal1 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal1.group).padStart(2, '0')} - {resultAnimal1.name}
                        </Badge>
                      </div>
                    ) : resultNumber1 && resultNumber1.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 2° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-2" className="sm:text-right">
                    2° Prêmio
                  </Label>
                  <Input
                    id="result-number-2"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber2 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber2(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId2(animalObj.id.toString());
                          setResultAnimal2(animalObj);
                        } else {
                          setResultAnimalId2("");
                          setResultAnimal2(null);
                        }
                      } else {
                        setResultAnimalId2("");
                        setResultAnimal2(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal2 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal2.group).padStart(2, '0')} - {resultAnimal2.name}
                        </Badge>
                      </div>
                    ) : resultNumber2 && resultNumber2.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 3° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-3" className="sm:text-right">
                    3° Prêmio
                  </Label>
                  <Input
                    id="result-number-3"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber3 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber3(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId3(animalObj.id.toString());
                          setResultAnimal3(animalObj);
                        } else {
                          setResultAnimalId3("");
                          setResultAnimal3(null);
                        }
                      } else {
                        setResultAnimalId3("");
                        setResultAnimal3(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal3 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal3.group).padStart(2, '0')} - {resultAnimal3.name}
                        </Badge>
                      </div>
                    ) : resultNumber3 && resultNumber3.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 4° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-4" className="sm:text-right">
                    4° Prêmio
                  </Label>
                  <Input
                    id="result-number-4"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber4 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber4(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId4(animalObj.id.toString());
                          setResultAnimal4(animalObj);
                        } else {
                          setResultAnimalId4("");
                          setResultAnimal4(null);
                        }
                      } else {
                        setResultAnimalId4("");
                        setResultAnimal4(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal4 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal4.group).padStart(2, '0')} - {resultAnimal4.name}
                        </Badge>
                      </div>
                    ) : resultNumber4 && resultNumber4.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 5° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-5" className="sm:text-right">
                    5° Prêmio
                  </Label>
                  <Input
                    id="result-number-5"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber5 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber5(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId5(animalObj.id.toString());
                          setResultAnimal5(animalObj);
                        } else {
                          setResultAnimalId5("");
                          setResultAnimal5(null);
                        }
                      } else {
                        setResultAnimalId5("");
                        setResultAnimal5(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal5 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal5.group).padStart(2, '0')} - {resultAnimal5.name}
                        </Badge>
                      </div>
                    ) : resultNumber5 && resultNumber5.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 6° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-6" className="sm:text-right">
                    6° Prêmio
                  </Label>
                  <Input
                    id="result-number-6"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber6 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber6(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId6(animalObj.id.toString());
                          setResultAnimal6(animalObj);
                        } else {
                          setResultAnimalId6("");
                          setResultAnimal6(null);
                        }
                      } else {
                        setResultAnimalId6("");
                        setResultAnimal6(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal6 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal6.group).padStart(2, '0')} - {resultAnimal6.name}
                        </Badge>
                      </div>
                    ) : resultNumber6 && resultNumber6.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 7° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-7" className="sm:text-right">
                    7° Prêmio
                  </Label>
                  <Input
                    id="result-number-7"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber7 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber7(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId7(animalObj.id.toString());
                          setResultAnimal7(animalObj);
                        } else {
                          setResultAnimalId7("");
                          setResultAnimal7(null);
                        }
                      } else {
                        setResultAnimalId7("");
                        setResultAnimal7(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal7 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal7.group).padStart(2, '0')} - {resultAnimal7.name}
                        </Badge>
                      </div>
                    ) : resultNumber7 && resultNumber7.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 8° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-8" className="sm:text-right">
                    8° Prêmio
                  </Label>
                  <Input
                    id="result-number-8"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber8 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber8(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId8(animalObj.id.toString());
                          setResultAnimal8(animalObj);
                        } else {
                          setResultAnimalId8("");
                          setResultAnimal8(null);
                        }
                      } else {
                        setResultAnimalId8("");
                        setResultAnimal8(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal8 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal8.group).padStart(2, '0')} - {resultAnimal8.name}
                        </Badge>
                      </div>
                    ) : resultNumber8 && resultNumber8.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 9° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-9" className="sm:text-right">
                    9° Prêmio
                  </Label>
                  <Input
                    id="result-number-9"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber9 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber9(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId9(animalObj.id.toString());
                          setResultAnimal9(animalObj);
                        } else {
                          setResultAnimalId9("");
                          setResultAnimal9(null);
                        }
                      } else {
                        setResultAnimalId9("");
                        setResultAnimal9(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal9 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal9.group).padStart(2, '0')} - {resultAnimal9.name}
                        </Badge>
                      </div>
                    ) : resultNumber9 && resultNumber9.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 10° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-number-10" className="sm:text-right">
                    10° Prêmio
                  </Label>
                  <Input
                    id="result-number-10"
                    placeholder="Número (4 dígitos)"
                    className="sm:col-span-2"
                    maxLength={4}
                    value={resultNumber10 || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setResultNumber10(value);
                      if (value.length === 4) {
                        const animalObj = findAnimalByNumber(value);
                        if (animalObj) {
                          setResultAnimalId10(animalObj.id.toString());
                          setResultAnimal10(animalObj);
                        } else {
                          setResultAnimalId10("");
                          setResultAnimal10(null);
                        }
                      } else {
                        setResultAnimalId10("");
                        setResultAnimal10(null);
                      }
                    }}
                  />
                  <div className="col-span-2">
                    {resultAnimal10 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Grupo {String(resultAnimal10.group).padStart(2, '0')} - {resultAnimal10.name}
                        </Badge>
                      </div>
                    ) : resultNumber10 && resultNumber10.length === 4 ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Animal não encontrado</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba de entrada por animais */}
            <TabsContent value="animals" className="space-y-4">
              <div className="grid gap-4 py-2">
                {/* 1° Prêmio (Obrigatório) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-1" className="sm:text-right font-bold">
                    1° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId}
                    onValueChange={(value) => {
                      setResultAnimalId(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal1(animal);
                          setResultNumber1(""); // Limpa o número ao selecionar animal diretamente
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 1° prêmio (obrigatório)" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-2" className="sm:text-right">
                    2° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId2}
                    onValueChange={(value) => {
                      setResultAnimalId2(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal2(animal);
                          setResultNumber2(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal2(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 2° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-3" className="sm:text-right">
                    3° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId3}
                    onValueChange={(value) => {
                      setResultAnimalId3(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal3(animal);
                          setResultNumber3(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal3(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 3° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-4" className="sm:text-right">
                    4° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId4}
                    onValueChange={(value) => {
                      setResultAnimalId4(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal4(animal);
                          setResultNumber4(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal4(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 4° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 5° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-5" className="sm:text-right">
                    5° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId5}
                    onValueChange={(value) => {
                      setResultAnimalId5(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal5(animal);
                          setResultNumber5(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal5(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 5° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 6° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-6" className="sm:text-right">
                    6° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId6}
                    onValueChange={(value) => {
                      setResultAnimalId6(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal6(animal);
                          setResultNumber6(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal6(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 6° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 7° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-7" className="sm:text-right">
                    7° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId7}
                    onValueChange={(value) => {
                      setResultAnimalId7(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal7(animal);
                          setResultNumber7(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal7(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 7° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 8° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-8" className="sm:text-right">
                    8° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId8}
                    onValueChange={(value) => {
                      setResultAnimalId8(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal8(animal);
                          setResultNumber8(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal8(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 8° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 9° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-9" className="sm:text-right">
                    9° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId9}
                    onValueChange={(value) => {
                      setResultAnimalId9(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal9(animal);
                          setResultNumber9(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal9(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 9° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 10° Prêmio (Opcional) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="result-animal-10" className="sm:text-right">
                    10° Prêmio
                  </Label>
                  <Select
                    value={resultAnimalId10}
                    onValueChange={(value) => {
                      setResultAnimalId10(value);
                      if (value && animals) {
                        const animal = animals.find(a => a.id.toString() === value);
                        if (animal) {
                          setResultAnimal10(animal);
                          setResultNumber10(""); // Limpa o número ao selecionar animal diretamente
                        }
                      } else {
                        setResultAnimal10(null);
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o animal do 10° prêmio (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">- Não informar -</SelectItem>
                      {animals?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          Grupo {String(animal.group).padStart(2, '0')} - {animal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-5 w-5 text-blue-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Os números são usados para apostas em dezenas, centenas e milhares</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Os números inseridos serão usados para calcular os prêmios de dezenas, centenas e milhares.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setResultDialogOpen(false);
              setIsEditingResult(false);
            }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSetResult}
              disabled={updateDrawResultMutation.isPending || !resultAnimalId}
              className={isEditingResult ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              {updateDrawResultMutation.isPending
                ? (isEditingResult ? "Atualizando..." : "Registrando...")
                : (isEditingResult ? "Atualizar resultado" : "Registrar resultado")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
