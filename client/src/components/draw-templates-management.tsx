import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash, Plus, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type DrawTemplate = {
    id: number;
    name: string;
    time: string;
    daysOfWeek: number[];
    active: boolean;
};

const DAYS_OF_WEEK = [
    { id: 0, label: "Dom" },
    { id: 1, label: "Seg" },
    { id: 2, label: "Ter" },
    { id: 3, label: "Qua" },
    { id: 4, label: "Qui" },
    { id: 5, label: "Sex" },
    { id: 6, label: "Sáb" },
];

export function DrawTemplatesManagement() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<DrawTemplate | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        time: "",
        daysOfWeek: [] as number[],
        active: true,
    });

    const { data: templates, isLoading } = useQuery<DrawTemplate[]>({
        queryKey: ["/api/draw-templates"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await apiRequest("POST", "/api/draw-templates", data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/draw-templates"] });
            toast({ title: "Template criado com sucesso" });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: Error) => {
            toast({
                title: "Erro ao criar template",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
            const res = await apiRequest("PUT", `/api/draw-templates/${id}`, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/draw-templates"] });
            toast({ title: "Template atualizado com sucesso" });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: Error) => {
            toast({
                title: "Erro ao atualizar template",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/draw-templates/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/draw-templates"] });
            toast({ title: "Template excluído com sucesso" });
        },
        onError: (error: Error) => {
            toast({
                title: "Erro ao excluir template",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const resetForm = () => {
        setFormData({
            name: "",
            time: "",
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Default to all days
            active: true,
        });
        setEditingTemplate(null);
    };

    const handleOpenDialog = (template?: DrawTemplate) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({
                name: template.name,
                time: template.time,
                daysOfWeek: template.daysOfWeek,
                active: template.active,
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.time || formData.daysOfWeek.length === 0) {
            toast({
                title: "Preencha todos os campos obrigatórios",
                description: "Nome, horário e pelo menos um dia da semana são necessários.",
                variant: "destructive",
            });
            return;
        }

        if (editingTemplate) {
            updateMutation.mutate({ id: editingTemplate.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const toggleDay = (dayId: number) => {
        setFormData((prev) => {
            const days = prev.daysOfWeek.includes(dayId)
                ? prev.daysOfWeek.filter((d) => d !== dayId)
                : [...prev.daysOfWeek, dayId];
            return { ...prev, daysOfWeek: days.sort() };
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Templates de Sorteio Recorrente</CardTitle>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" /> Novo Template
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Horário</TableHead>
                                <TableHead>Dias da Semana</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : templates?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        Nenhum template encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                templates?.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell className="font-medium">{template.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                {template.time}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {DAYS_OF_WEEK.map((day) => (
                                                    <Badge
                                                        key={day.id}
                                                        variant={template.daysOfWeek.includes(day.id) ? "default" : "outline"}
                                                        className={!template.daysOfWeek.includes(day.id) ? "text-muted-foreground opacity-50" : ""}
                                                    >
                                                        {day.label}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={template.active ? "default" : "secondary"}>
                                                {template.active ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDialog(template)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => {
                                                    if (confirm("Tem certeza que deseja excluir este template?")) {
                                                        deleteMutation.mutate(template.id);
                                                    }
                                                }}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingTemplate ? "Editar Template" : "Novo Template"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome do Sorteio</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Sorteio da Manhã"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time">Horário</Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Dias da Semana</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {DAYS_OF_WEEK.map((day) => (
                                    <div key={day.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`day-${day.id}`}
                                            checked={formData.daysOfWeek.includes(day.id)}
                                            onCheckedChange={() => toggleDay(day.id)}
                                        />
                                        <label
                                            htmlFor={`day-${day.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {day.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, active: checked === true })
                                }
                            />
                            <Label htmlFor="active">Ativo</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                            {editingTemplate ? "Salvar Alterações" : "Criar Template"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
