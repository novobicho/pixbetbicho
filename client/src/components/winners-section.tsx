import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Simple seeded random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export function WinnersSection() {
  // Generate data based on current date to keep it consistent for the day
  const { winners, totalPrize } = useMemo(() => {
    const today = new Date();
    const seedStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
    let seed = parseInt(seedStr);

    // Generate total prize between 55k and 500k
    const minPrize = 55000;
    const maxPrize = 500000;
    const totalPrizeVal = minPrize + (seededRandom(seed++) * (maxPrize - minPrize));

    const names = ["João", "Maria", "Pedro", "Ana", "Carlos", "Fernanda", "Luiz", "Beatriz", "Rafael", "Juliana", "Marcos", "Patrícia", "Bruno", "Camila", "Gabriel"];
    const lastNames = ["S.", "M.", "P.", "A.", "C.", "F.", "L.", "B.", "R.", "J.", "G.", "O.", "D."];
    const locations = ["RJ", "SP", "MG", "BA", "RS", "PE", "CE", "PR", "SC", "GO"];
    const betTypes = ["Milhar", "Centena", "Grupo", "Duque de Dezena", "Terno de Dezena", "Passe"];

    const generatedWinners = Array.from({ length: 4 }).map((_, i) => {
      const name = `${names[Math.floor(seededRandom(seed++) * names.length)]} ${lastNames[Math.floor(seededRandom(seed++) * lastNames.length)]}`;
      const location = locations[Math.floor(seededRandom(seed++) * locations.length)];
      const hour = Math.floor(seededRandom(seed++) * 12) + 9; // 9h to 21h
      const minute = Math.floor(seededRandom(seed++) * 60).toString().padStart(2, '0');
      const type = betTypes[Math.floor(seededRandom(seed++) * betTypes.length)];

      const betAmount = (Math.floor(seededRandom(seed++) * 50) + 2).toFixed(2); // 2 to 52
      const winAmount = (parseFloat(betAmount) * (Math.floor(seededRandom(seed++) * 500) + 10)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      const drawNum = Math.floor(seededRandom(seed++) * 10000).toString().padStart(4, '0');

      return {
        name,
        location,
        time: `${hour}h${minute}`,
        type,
        amount: winAmount,
        bet: `R$ ${betAmount.replace('.', ',')}`,
        draw: drawNum
      };
    });

    return {
      winners: generatedWinners,
      totalPrize: totalPrizeVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-green-500 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              SORTUDOS DO DIA
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2.5 rounded-xl border border-green-100 shadow-sm">
            <span className="text-2xl">💰</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium uppercase">Ontem pagamos</span>
              <span className="text-lg font-extrabold text-green-600">{totalPrize}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {winners.map((winner, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl ring-1 ring-gray-100">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />

              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">{winner.type}</h4>
                    <p className="font-semibold text-gray-700 text-base">{winner.name}</p>
                  </div>
                  <Badge className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-2.5 py-1 shadow-sm">
                    #{index + 1}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-[10px] text-gray-500 font-medium uppercase mb-1">Apostou</div>
                    <div className="text-sm font-bold text-gray-700">{winner.bet}</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute -right-2 -bottom-2 text-green-100 opacity-50">
                      <span className="text-4xl">💵</span>
                    </div>

                    <div className="relative z-10">
                      <div className="text-[10px] text-green-700 font-bold uppercase mb-1 flex items-center gap-1">
                        <span>🎉</span> Ganhou
                      </div>
                      <div className="text-xl font-extrabold text-green-600 tracking-tight">{winner.amount}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
