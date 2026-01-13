import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameMode } from "@/types";
import { TrendingUp } from "lucide-react";

interface LiveOddsSectionProps {
    gameModes: GameMode[];
}

export function LiveOddsSection({ gameModes }: LiveOddsSectionProps) {
    // Filter to show only the main bet types in specific order
    const betTypeOrder = ['grupo', 'milhar', 'centena', 'dezena'];

    const displayModes = betTypeOrder
        .map(typeName => gameModes.find(mode =>
            mode.active && mode.name.toLowerCase().includes(typeName)
        ))
        .filter(Boolean) as GameMode[];

    // Simplify bet type names
    const simplifyName = (name: string): string => {
        if (name.toLowerCase().includes('grupo')) return 'Grupo';
        if (name.toLowerCase().includes('milhar')) return 'Milhar';
        if (name.toLowerCase().includes('centena')) return 'Centena';
        if (name.toLowerCase().includes('dezena')) return 'Dezena';
        return name;
    };

    return (
        <div className="w-full bg-gradient-to-b from-white to-gray-50 py-8 md:py-12 border-b border-gray-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 md:mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
                        <h3 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                            PRINCIPAIS COTAÇÕES
                        </h3>
                    </div>
                    <a href="#" className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hidden sm:block">
                        Ver todas
                    </a>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayModes.length > 0 ? (
                        displayModes.map((mode) => (
                            <Card key={mode.id} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl ring-1 ring-gray-100">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500" />

                                <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                                    <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{simplifyName(mode.name)}</h4>

                                    <div className="my-4">
                                        <span className="text-xs text-gray-400 font-medium uppercase block mb-1">Paga</span>
                                        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                            <span className="text-lg text-gray-400 font-medium mr-1">1x</span>
                                            R$ {mode.odds.toFixed(2)}
                                        </p>
                                    </div>

                                    <Button className="w-full mt-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold transition-all duration-300 rounded-xl shadow-sm hover:shadow-md">
                                        JOGAR AGORA
                                    </Button>
                                </CardContent>

                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-4 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">Carregando cotações...</p>
                        </div>
                    )}
                </div>

                {/* Mobile Grid - 2x2 */}
                <div className="md:hidden">
                    <div className="grid grid-cols-2 gap-3">
                        {displayModes.length > 0 ? (
                            displayModes.map((mode) => (
                                <Card
                                    key={mode.id}
                                    className="relative overflow-hidden border-0 shadow-lg bg-white rounded-xl"
                                >
                                    {/* Gradient top bar */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500" />

                                    <CardContent className="p-3 flex flex-col items-center text-center">
                                        {/* Bet Type */}
                                        <h4 className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2">
                                            {simplifyName(mode.name)}
                                        </h4>

                                        {/* Odds */}
                                        <div className="mb-2">
                                            <span className="text-[9px] text-gray-400 font-medium uppercase block mb-0.5">Paga</span>
                                            <div className="flex items-baseline justify-center gap-0.5">
                                                <span className="text-[10px] text-gray-400 font-medium">1x</span>
                                                <p className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                                                    R$ {mode.odds.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Button */}
                                        <Button
                                            size="sm"
                                            className="w-full text-[10px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all py-1.5 h-auto"
                                        >
                                            JOGAR
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 text-sm font-medium">Carregando...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
