import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"

interface SystemSettings {
    bannerDesktopUrl?: string;
    bannerMobileUrl?: string;
}

export function BannerCarousel() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [isMobile, setIsMobile] = React.useState(false)

    // Buscar configurações do sistema
    const { data: settings } = useQuery<SystemSettings>({
        queryKey: ["/api/settings"],
    })

    // Detectar se é mobile
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Autoplay
    React.useEffect(() => {
        if (!api) {
            return
        }

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 5000) // 5 segundos

        return () => clearInterval(intervalId)
    }, [api])

    // Usar banner apropriado baseado no tamanho da tela
    const bannerUrl = isMobile
        ? (settings?.bannerMobileUrl || '/img/banner-mobile.jpg')
        : (settings?.bannerDesktopUrl || '/img/banner-desktop.jpg')

    const banners = [
        {
            id: 1,
            image: bannerUrl,
        }
    ]

    return (
        <div className="w-full">
            <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id} className="pl-0">
                            <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg">
                                {/* Banner Image */}
                                <img
                                    src={banner.image}
                                    alt="Banner promocional"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback para imagem padrão se houver erro
                                        const target = e.target as HTMLImageElement
                                        target.src = isMobile
                                            ? '/img/banner-mobile.jpg'
                                            : '/img/banner-desktop.jpg'
                                    }}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Controles do carousel - apenas se houver mais de 1 banner */}
                {banners.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-none text-white" />
                        <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-none text-white" />
                    </>
                )}
            </Carousel>
        </div>
    )
}
