import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Draw, Animal } from "@/types";

export function RecentResultsDisplay() {
    const { data: draws } = useQuery<Draw[]>({
        queryKey: ["/api/draws/recent"],
        queryFn: async () => {
            const res = await fetch("/api/draws/recent?limit=4");
            if (!res.ok) throw new Error("Failed to fetch recent draws");
            return res.json();
        }
    });

    const { data: animals } = useQuery<Animal[]>({
        queryKey: ["/api/animals"],
    });

    const getAnimalData = (animalId: number | null) => {
        if (!animalId || !animals) return { group: "-", name: "-" };
        const animal = animals.find(a => a.id === animalId);
        return animal
            ? { group: String(animal.group).padStart(2, '0'), name: animal.name }
            : { group: "-", name: "-" };
    };

    if (!draws || !draws.length) return null;

    return (
        <div className="w-full bg-white py-12 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-800">Últimos Resultados</h2>
                    </div>
                    <Link href="/results">
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium group">
                            Ver todos os resultados
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {draws.map((draw) => {
                        const animalData = getAnimalData(draw.resultAnimalId);

                        return (
                            <Card key={draw.id} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl ring-1 ring-gray-100">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1 line-clamp-2">{draw.name}</h4>
                                            <div className="flex items-center text-xs text-gray-400 font-medium mt-1">
                                                <Calendar className="h-3 w-3 mr-1.5" />
                                                {new Date(draw.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs font-bold px-2.5 py-1">
                                            {draw.time}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-100 relative overflow-hidden">
                                            {/* Decorative element */}
                                            <div className="absolute -right-2 -bottom-2 text-yellow-100 opacity-50">
                                                <Trophy className="h-16 w-16" />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="text-[10px] text-yellow-700 font-bold uppercase mb-2 flex items-center gap-1">
                                                    <Trophy className="h-3 w-3" /> 1º Prêmio
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white font-bold text-base shadow-sm">
                                                            {animalData.group}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-gray-500 font-medium uppercase">Bicho</span>
                                                            <span className="font-bold text-gray-900 capitalize text-xs">{animalData.name}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="text-[9px] text-gray-500 font-medium uppercase block">Milhar</span>
                                                        <span className="font-mono text-lg font-extrabold text-blue-600 tracking-tight">
                                                            {draw.resultNumber1 || "----"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
