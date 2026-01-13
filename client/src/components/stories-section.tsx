import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getAnimalEmoji } from "@/lib/animal-icons";

export function StoriesSection() {
    const stories = [
        { id: 1, name: "Dicas", color: "bg-blue-500", icon: "💡" },
        { id: 2, name: "Resultados", color: "bg-green-500", icon: "📊" },
        { id: 3, name: "Promoções", color: "bg-purple-500", icon: "🎁" },
        { id: 4, name: "Vencedores", color: "bg-yellow-500", icon: "🏆" },
        { id: 5, name: "Ao Vivo", color: "bg-red-500", icon: "🔴" },
        { id: 6, name: "Suporte", color: "bg-gray-500", icon: "🎧" },
    ];

    return (
        <div className="w-full bg-white py-6 border-b">
            <div className="container mx-auto px-4">
                <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center">
                    <span className="mr-2">📸</span> Stories
                </h3>
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-6 pb-4">
                        {stories.map((story) => (
                            <div key={story.id} className="flex flex-col items-center space-y-2 cursor-pointer group">
                                <div className={`w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600 group-hover:scale-105 transition-transform`}>
                                    <div className={`w-full h-full rounded-full border-2 border-white flex items-center justify-center text-2xl bg-white`}>
                                        {story.icon}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-700">{story.name}</span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
}
