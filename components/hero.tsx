"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import clsx from "clsx";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const backgroundImages = [
    "/banner-hero-arq.jpg",
    "/banner-hero-arq-2.jpg",
    "/banner-hero-arq-3.jpg",
    "/banner-hero-arq-4.jpg",
];

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const animateTransition = () => {
            const current = bgRefs.current[currentIndex];
            const nextIndex = (currentIndex + 1) % backgroundImages.length;
            const next = bgRefs.current[nextIndex];

            if (!current || !next) return;

            gsap.set(next, { opacity: 0, scale: 1.1, xPercent: 5, zIndex: 1 });
            gsap.set(current, { zIndex: 2 });

            const tl = gsap.timeline({
                onComplete: () => setCurrentIndex(nextIndex),
            });

            tl.to(current, {
                duration: 15,
                xPercent: -6,
                ease: "none",
            })
                .to(
                    current,
                    {
                        duration: 2,
                        opacity: 0,
                        ease: "power2.out",
                    },
                    "-=1.8"
                )
                .to(
                    next,
                    {
                        duration: 1,
                        opacity: 1,
                        ease: "power2.out",
                    },
                    "<"
                );
        };

        const interval = setInterval(animateTransition, 1000);

        gsap.set(bgRefs.current[currentIndex], {
            opacity: 1,
            scale: 1.1,
            xPercent: 5,
        });

        return () => clearInterval(interval);
    }, [currentIndex]);

    /* transição com blur */
    /* useEffect(() => {
        const animateTransition = () => {
            const current = bgRefs.current[currentIndex];
            const nextIndex = (currentIndex + 1) % backgroundImages.length;
            const next = bgRefs.current[nextIndex];

            if (!current || !next) return;

            gsap.set(next, {
                opacity: 0,
                scale: 1.1,
                xPercent: 5,
                filter: "blur(8px)",
                zIndex: 1,
            });

            gsap.set(current, {
                zIndex: 2,
            });

            const tl = gsap.timeline({
                onComplete: () => setCurrentIndex(nextIndex),
            });

            tl.to(current, {
                duration: 15,
                xPercent: -5,
                ease: "none",
            })
                .to(
                    current,
                    {
                        duration: 2,
                        opacity: 0,
                        filter: "blur(8px)",
                        ease: "power2.out",
                    },
                    "-=1.8"
                )
                .to(
                    next,
                    {
                        duration: 2,
                        opacity: 1,
                        filter: "blur(0px)",
                        ease: "power2.out",
                    },
                    "<"
                );
        };

        const interval = setInterval(animateTransition, 7000);

        gsap.set(bgRefs.current[currentIndex], {
            opacity: 1,
            scale: 1.1,
            xPercent: 5,
            filter: "blur(0px)",
        });

        return () => clearInterval(interval);
    }, [currentIndex]); */

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsMounted(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <section id="hero" className="bg-[#3E4247] overflow-hidden">
            {backgroundImages.map((src, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        bgRefs.current[i] = el;
                    }}
                    className={clsx(
                        "absolute inset-0 bg-cover bg-center scale-[1.1] bg-no-repeat transition-all duration-1000 ease-out",
                        "will-change-transform will-change-opacity",
                        isMounted ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                    )}
                    style={{
                        backgroundImage: `url(${src})`,
                        opacity: i === currentIndex ? 1 : 0,
                    }}
                />
            ))}

            <div className="relative min-h-screen flex flex-col z-10 justify-center px-4 py-16 md:h-[108vh] lg:py-0">
                <div className="max-w-[1428.1px] mx-auto w-full sm:px-6 min-[1536px]:px-6 min-[1537px]:px-0 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="lg:text-left">
                            <h1
                                className={
                                    spaceGrotesk.className +
                                    " text-4xl min-[1536px]:text-[60px] min-[1537px]:text-[66px] text-white font-light pb-8 leading-tight"
                                }
                            >
                                Obras que
                                <br />
                                impressionam no
                                <br />
                                <span className="block font-bold">
                                    resultado e<br />
                                </span>
                                <span className="block font-bold">
                                    surpreendem.
                                </span>
                            </h1>

                            <p className="text-[18px] lg:text-[22px] text-[#d9d9d9] leading-relaxed pb-10 whitespace-normal">
                                Alta performance, rigor técnico e acabamento
                                impecável são nossas marcas registradas.
                            </p>

                            <Button className="bg-white text-[#181C20] text-lg hover:bg-[#d9d9d9] rounded-none font-medium px-10 py-8">
                                Faça um orçamento
                            </Button>
                        </div>

                        <div className="hidden lg:flex justify-end lg:justify-end self-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/gifs/hero-decorative.gif"
                                alt="Elemento decorativo"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <section
                id="features"
                className="max-w-6xl mx-auto relative z-20 -mt-24 px-4"
            >
                <div className="flex flex-col lg:flex-row">
                    <div className="bg-[#045D66] px-8 pt-10 pb-8 text-white flex-1">
                        <div className="mb-6">
                            <Image
                                src="/icons/comercial-construction-icon.svg"
                                alt="Obras Comerciais Icon"
                                className="w-11"
                                width={44}
                                height={44}
                            />
                        </div>
                        <h3
                            className={
                                spaceGrotesk.className +
                                " mb-4 text-[20px] lg:text-[22px] leading-[32px] font-semibold"
                            }
                        >
                            Obras Comerciais
                        </h3>
                        <p className="text-[16px] lg:text-[16px] leading-relaxed mb-6 whitespace-normal">
                            Execução completa para franquias, lojas e
                            restaurantes. Já realizamos obras para marcas como
                            Burger King e Data Energia.
                        </p>
                        <Link
                            href={"#"}
                            className={
                                spaceGrotesk.className +
                                " text-white border-b border-white pb-1 text-[18px] hover:opacity-80 transition-opacity"
                            }
                        >
                            Faça um orçamento
                        </Link>
                    </div>

                    <div className="bg-vermelho2 px-8 pt-10 pb-8 text-white flex-1">
                        <div className="mb-6">
                            <Image
                                src="/icons/residential-construction-icon.svg"
                                alt="Construções Residenciais Icon"
                                className="w-11"
                                width={44}
                                height={44}
                            />
                        </div>
                        <h3
                            className={
                                spaceGrotesk.className +
                                " mb-4 text-[20px] lg:text-[22px] leading-[32px] font-semibold"
                            }
                        >
                            Construções Residenciais
                        </h3>
                        <p className="text-[16px] lg:text-[16px] leading-relaxed mb-6 whitespace-normal">
                            Casas, edifícios e condomínios de alto padrão, com
                            foco em durabilidade, beleza e conforto.
                        </p>
                    </div>

                    <div className="bg-amarelo px-8 pt-10 pb-8 text-white flex-1">
                        <div className="mb-6">
                            <Image
                                src="/icons/tecnical-reform-icon.svg"
                                alt="Reformas Técnicas e Ampliações Icon"
                                className="w-11"
                                width={44}
                                height={44}
                            />
                        </div>
                        <h3
                            className={
                                spaceGrotesk.className +
                                " mb-4 text-[20px] lg:text-[22px] leading-[32px] font-semibold"
                            }
                        >
                            Reformas Técnicas
                        </h3>
                        <p className="text-[16px] lg:text-[16px] leading-relaxed mb-6 whitespace-normal">
                            Requalificações estruturais e remodelações com
                            mínimo impacto e máximo cuidado com o espaço já
                            existente.
                        </p>
                    </div>
                </div>
            </section>
        </section>
    );
}
