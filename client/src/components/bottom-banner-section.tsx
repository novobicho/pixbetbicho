import React from "react";
import { Button } from "@/components/ui/button";

export function BottomBannerSection() {
    return (
        <div className="w-full bg-gradient-to-r from-indigo-900 to-blue-900 text-white py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
                <div className="mb-8 md:mb-0 text-center md:text-left">
                    <h2 className="text-4xl md:text-6xl font-black text-yellow-400 mb-2">R$ 12.970,01</h2>
                    <p className="text-blue-200 text-sm mb-6">Próximo sorteio</p>

                    <div className="flex space-x-4 text-center justify-center md:justify-start">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold bg-white/10 rounded-lg p-2 backdrop-blur-sm">04</div>
                            <div className="text-xs text-blue-300 mt-1">Dia</div>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold self-start mt-2">:</div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold bg-white/10 rounded-lg p-2 backdrop-blur-sm">01</div>
                            <div className="text-xs text-blue-300 mt-1">Horas</div>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold self-start mt-2">:</div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold bg-white/10 rounded-lg p-2 backdrop-blur-sm">17</div>
                            <div className="text-xs text-blue-300 mt-1">Min</div>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold self-start mt-2">:</div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold bg-white/10 rounded-lg p-2 backdrop-blur-sm">55</div>
                            <div className="text-xs text-blue-300 mt-1">Seg</div>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-blue-200">
                        Último ganhador (1º Lugar) <br />
                        <span className="text-white font-bold">🏆 ODAIR A.</span> | <span className="text-yellow-400 font-bold">R$ 4.000,00</span>
                    </div>
                </div>

                <div className="relative">
                    {/* Coins Image Placeholder - using CSS shapes/emojis for now */}
                    <div className="text-9xl filter drop-shadow-2xl animate-bounce">
                        💰
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/20 skew-x-12 transform origin-bottom-left"></div>
        </div>
    );
}
