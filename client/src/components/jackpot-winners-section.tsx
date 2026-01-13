import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function JackpotWinnersSection() {
    const winners = [
        { place: "1º Lugar", name: "Flavia F.", id: "01859617", amount: "R$ 350,00", color: "bg-yellow-100 border-yellow-300" },
        { place: "12º Lugar", name: "Marcelo R.", id: "00267114", amount: "R$ 350,00", color: "bg-yellow-50 border-yellow-200" },
        { place: "13º Lugar", name: "Sergio T.", id: "00089917", amount: "R$ 350,00", color: "bg-yellow-50 border-yellow-200" },
        { place: "14º Lugar", name: "Genivaldo A.", id: "00682143", amount: "R$ 350,00", color: "bg-yellow-50 border-yellow-200" },
    ];

    return (
        <div className="w-full bg-gray-50 py-10">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <Trophy className="mr-2 text-yellow-500 h-5 w-5" /> GANHADORES DO JACKPOT
                    </h3>
                    <a href="#" className="text-sm text-blue-600 hover:underline">Ver todos</a>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                    Distribuímos <span className="font-bold text-blue-600">R$ 20.000,00</span> para 55 ganhadores do jackpot referente ao período de 30/11/25 a 06/12/25!
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {winners.map((winner, index) => (
                        <Card key={index} className={`${winner.color} border hover:shadow-md transition-shadow`}>
                            <CardContent className="p-4 text-center">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-700 text-sm flex items-center">
                                        <Trophy className="h-3 w-3 mr-1 text-yellow-600" /> {winner.place}
                                    </span>
                                    <span className="text-[10px] bg-yellow-400 text-yellow-900 px-1 rounded">#{index + 1}</span>
                                </div>

                                <p className="font-medium text-gray-800 mb-1">{winner.name}</p>
                                <div className="bg-white/50 text-gray-600 text-xs py-1 px-2 rounded mb-2 inline-block font-mono">
                                    {winner.id}
                                </div>

                                <div className="text-lg font-extrabold text-gray-900">Ganhou: <span className="underline decoration-yellow-400">{winner.amount}</span></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
