import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCustomToast } from "@/components/custom-toast";
import { Animal, Draw, GameMode, SystemSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2, Check, AlertCircle, Trophy } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Reusing the same schema logic as mobile-bet-wizard-new.tsx for consistency
const formSchema = z.object({
    drawId: z.number({ required_error: "Selecione um sorteio" }),
    gameModeId: z.number({ required_error: "Selecione uma modalidade" }),
    premioType: z.string({ required_error: "Selecione o prêmio" }),
    amount: z.number({ required_error: "Digite o valor" }).min(1, "Mínimo R$ 1,00"),
    type: z.string(),
    animalId: z.number().optional(),
    betNumber: z.string().optional(),
    betNumbers: z.array(z.string()).optional(),
});

type BetFormData = z.infer<typeof formSchema>;

interface ModernBettingModalProps {
    draws: Draw[];
    animals: Animal[];
    gameModes: GameMode[];
    systemSettings?: SystemSettings;
    onComplete?: () => void;
}

export function ModernBettingModal({ draws, animals, gameModes, systemSettings, onComplete }: ModernBettingModalProps) {
    const { toast } = useToast();
    const customToast = useCustomToast();
    const [activeModality, setActiveModality] = useState<string>("");
    const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);

    const form = useForm<BetFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 5,
            premioType: "1",
            type: "group",
        },
    });

    // Set default draw
    useEffect(() => {
        if (draws.length > 0 && !form.getValues("drawId")) {
            form.setValue("drawId", draws[0].id);
        }
    }, [draws, form]);

    // Set default game mode
    useEffect(() => {
        if (gameModes.length > 0 && !activeModality) {
            const groupMode = gameModes.find(m => m.name.toLowerCase().includes("grupo") && !m.name.toLowerCase().includes("duque"));
            if (groupMode) {
                setActiveModality(groupMode.id.toString());
                form.setValue("gameModeId", groupMode.id);
                form.setValue("type", "group");
            }
        }
    }, [gameModes, activeModality, form]);

    const betMutation = useMutation({
        mutationFn: async (data: BetFormData) => {
            const res = await apiRequest("POST", "/api/bets", data);
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Aposta realizada!", description: "Boa sorte!" });
            customToast.addToast({ title: "Sucesso", message: "Aposta realizada com sucesso!", type: "success" });
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            if (onComplete) onComplete();
        },
        onError: (error: any) => {
            toast({ title: "Erro", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (data: BetFormData) => {
        const potentialWin = data.amount * (selectedGameMode?.odds || 0);
        if (systemSettings?.maxPayout && potentialWin > systemSettings.maxPayout) {
            toast({
                title: "Limite Excedido",
                description: `O prêmio potencial excede o limite de R$ ${systemSettings.maxPayout.toFixed(2)}`,
                variant: "destructive"
            });
            return;
        }
        betMutation.mutate(data);
    };

    const handleModalityChange = (modeId: string) => {
        setActiveModality(modeId);
        const mode = gameModes.find(m => m.id.toString() === modeId);
        if (mode) {
            form.setValue("gameModeId", mode.id);
            // Simple mapping logic - expand as needed for other types
            if (mode.name.toLowerCase().includes("grupo")) form.setValue("type", "group");
            else if (mode.name.toLowerCase().includes("milhar")) form.setValue("type", "thousand");
            else if (mode.name.toLowerCase().includes("centena")) form.setValue("type", "hundred");
            else if (mode.name.toLowerCase().includes("dezena")) form.setValue("type", "dozen");
        }
    };

    const selectedGameMode = gameModes.find(m => m.id.toString() === activeModality);

    return (
        <div className="flex flex-col h-full max-h-[80vh]">
            <div className="px-4 py-2 border-b bg-gray-50/50">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-2 p-1">
                        {gameModes.map((mode) => (
                            <Button
                                key={mode.id}
                                variant={activeModality === mode.id.toString() ? "default" : "outline"}
                                className={`rounded-full px-6 ${activeModality === mode.id.toString() ? "bg-primary text-white shadow-md" : "hover:bg-gray-100"}`}
                                onClick={() => handleModalityChange(mode.id.toString())}
                            >
                                {mode.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <ScrollArea className="flex-1 p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Draw Selection */}
                        <FormField
                            control={form.control}
                            name="drawId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sorteio</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o sorteio" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {draws.map((draw) => (
                                                <SelectItem key={draw.id} value={draw.id.toString()}>
                                                    {draw.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Animal Selection Grid (Only for Group bets for now) */}
                        {selectedGameMode?.name.toLowerCase().includes("grupo") && (
                            <div className="space-y-3">
                                <FormLabel>Escolha o Bicho</FormLabel>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                    {animals.map((animal) => (
                                        <div
                                            key={animal.id}
                                            className={`
                        cursor-pointer rounded-lg border p-2 text-center transition-all hover:scale-105
                        ${selectedAnimal === animal.id
                                                    ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-1"
                                                    : "border-gray-200 hover:border-primary/50"}
                      `}
                                            onClick={() => {
                                                setSelectedAnimal(animal.id);
                                                form.setValue("animalId", animal.id);
                                            }}
                                        >
                                            <div className="text-xs font-bold text-gray-500 mb-1">{animal.group}</div>
                                            <div className="text-2xl mb-1">🦁</div> {/* Placeholder icon, ideally dynamic */}
                                            <div className="text-[10px] font-medium truncate">{animal.name}</div>
                                        </div>
                                    ))}
                                </div>
                                {form.formState.errors.animalId && (
                                    <p className="text-sm font-medium text-destructive">Selecione um animal</p>
                                )}
                            </div>
                        )}

                        {/* Numeric Input (For non-group bets) */}
                        {!selectedGameMode?.name.toLowerCase().includes("grupo") && (
                            <FormField
                                control={form.control}
                                name="betNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número da Aposta</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o número..." {...field} className="text-lg font-mono tracking-widest" maxLength={4} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Amount Input */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor (R$)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                    className="pl-9 text-lg font-bold"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Atalhos</FormLabel>
                                <div className="flex gap-2">
                                    {[5, 10, 20].map(val => (
                                        <Button
                                            key={val}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => form.setValue("amount", val)}
                                        >
                                            {val}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary Alert */}
                        <Alert className={`border-primary/20 ${systemSettings?.maxPayout && (form.watch("amount") * (selectedGameMode?.odds || 0)) > systemSettings.maxPayout
                            ? "bg-red-50 border-red-200"
                            : "bg-primary/5"
                            }`}>
                            {systemSettings?.maxPayout && (form.watch("amount") * (selectedGameMode?.odds || 0)) > systemSettings.maxPayout ? (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : (
                                <Trophy className="h-4 w-4 text-primary" />
                            )}
                            <AlertTitle className={
                                systemSettings?.maxPayout && (form.watch("amount") * (selectedGameMode?.odds || 0)) > systemSettings.maxPayout
                                    ? "text-red-600 font-bold"
                                    : "text-primary font-bold"
                            }>
                                {systemSettings?.maxPayout && (form.watch("amount") * (selectedGameMode?.odds || 0)) > systemSettings.maxPayout
                                    ? "Limite de Prêmio Excedido"
                                    : "Ganho Potencial"
                                }
                            </AlertTitle>
                            <AlertDescription className="text-gray-600">
                                R$ {(form.watch("amount") * (selectedGameMode?.odds || 0)).toFixed(2)}
                                {systemSettings?.maxPayout && (form.watch("amount") * (selectedGameMode?.odds || 0)) > systemSettings.maxPayout && (
                                    <span className="block text-xs text-red-500 mt-1">
                                        O prêmio máximo permitido é R$ {systemSettings.maxPayout.toFixed(2)}
                                    </span>
                                )}
                            </AlertDescription>
                        </Alert>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                            disabled={betMutation.isPending}
                        >
                            {betMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
                                </>
                            ) : (
                                "Confirmar Aposta"
                            )}
                        </Button>

                    </form>
                </Form>
            </ScrollArea>
        </div>
    );
}


