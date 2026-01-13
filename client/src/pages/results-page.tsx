import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Trophy } from "lucide-react";
import { Animal, Draw } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsPage() {
    // Função para obter a data atual no horário do Brasil (UTC-3)
    const getBrazilDate = () => {
        const now = new Date();
        // Ajustar para o horário do Brasil (UTC-3)
        const brazilTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
        // Retornar apenas a data (sem horário) no formato local
        const year = brazilTime.getUTCFullYear();
        const month = brazilTime.getUTCMonth();
        const day = brazilTime.getUTCDate();
        return new Date(year, month, day);
    };

    const [selectedDate, setSelectedDate] = useState<Date>(getBrazilDate());

    // Fetch animals for mapping
    const { data: animals } = useQuery<Animal[]>({
        queryKey: ["/api/animals"],
    });

    // Fetch results for the selected date
    const { data: results, isLoading } = useQuery<Draw[]>({
        queryKey: ["/api/draws/results", selectedDate.toISOString().split('T')[0]],
        queryFn: async () => {
            const res = await fetch(`/api/draws/results?date=${selectedDate.toISOString()}`);
            if (!res.ok) throw new Error("Failed to fetch results");
            return res.json();
        },
    });

    const getAnimalName = (id: number | null) => {
        if (!id || !animals) return "-";
        const animal = animals.find(a => a.id === id);
        return animal ? animal.name : "-";
    };

    const getAnimalGroup = (id: number | null) => {
        if (!id || !animals) return "-";
        const animal = animals.find(a => a.id === id);
        return animal ? animal.group.toString().padStart(2, '0') : "-";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados do Jogo do Bicho</h1>
                        <p className="text-gray-600 flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
                        ))}
                    </div>
                ) : results && results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((draw) => (
                            <Card key={draw.id} className="overflow-hidden border-t-4 border-t-blue-600 shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="bg-blue-50 pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-bold text-blue-900">
                                            {draw.name}
                                        </CardTitle>
                                        <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">
                                            {draw.time}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Extração: {format(new Date(draw.date), "dd/MM/yyyy")}
                                    </p>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-100 hover:bg-gray-100">
                                                <TableHead className="w-[50px] text-center font-bold text-gray-700">#</TableHead>
                                                <TableHead className="text-center font-bold text-gray-700">Milhar</TableHead>
                                                <TableHead className="text-center font-bold text-gray-700">Grupo</TableHead>
                                                <TableHead className="text-left font-bold text-gray-700">Bicho</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                { pos: 1, animal: draw.resultAnimalId, number: draw.resultNumber1 },
                                                { pos: 2, animal: draw.resultAnimalId2, number: draw.resultNumber2 },
                                                { pos: 3, animal: draw.resultAnimalId3, number: draw.resultNumber3 },
                                                { pos: 4, animal: draw.resultAnimalId4, number: draw.resultNumber4 },
                                                { pos: 5, animal: draw.resultAnimalId5, number: draw.resultNumber5 },
                                                { pos: 6, animal: draw.resultAnimalId6, number: draw.resultNumber6 },
                                                { pos: 7, animal: draw.resultAnimalId7, number: draw.resultNumber7 },
                                                { pos: 8, animal: draw.resultAnimalId8, number: draw.resultNumber8 },
                                                { pos: 9, animal: draw.resultAnimalId9, number: draw.resultNumber9 },
                                                { pos: 10, animal: draw.resultAnimalId10, number: draw.resultNumber10 },
                                            ].map((item) => (
                                                <TableRow key={item.pos} className={item.pos === 1 ? "bg-yellow-50 font-medium" : ""}>
                                                    <TableCell className="text-center py-2">
                                                        {item.pos === 1 ? <Trophy className="w-4 h-4 text-yellow-600 mx-auto" /> : `${item.pos}º`}
                                                    </TableCell>
                                                    <TableCell className="text-center py-2 font-mono text-gray-800">
                                                        {item.number || "----"}
                                                    </TableCell>
                                                    <TableCell className="text-center py-2 font-mono text-blue-600 font-bold">
                                                        {getAnimalGroup(item.animal)}
                                                    </TableCell>
                                                    <TableCell className="text-left py-2 capitalize text-gray-700">
                                                        {getAnimalName(item.animal)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">Nenhum resultado encontrado</h3>
                        <p className="text-gray-500 mt-2">Não há sorteios finalizados para esta data.</p>
                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
