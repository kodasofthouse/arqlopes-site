"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const handleScrollTo = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            const yOffset = -100;
            const y =
                section.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 0);
            setIsMenuOpen(false);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <header>
            <div
                className={clsx(
                    "px-6 py-5 fixed top-0 left-0 w-full z-40 transition-all duration-300",
                    {
                        "backdrop-blur-md bg-black/20": hasScrolled,
                        "bg-transparent": !hasScrolled,
                    }
                )}
            >
                <nav className="flex items-center justify-between max-w-[1428.1px] mx-auto relative">
                    <div className="flex items-center mr-8">
                        <Link href="/">
                            <Image
                                src="/logos/arqlopes-logo.svg"
                                alt="Arq Lopes Logo"
                                width={247}
                                height={52}
                            />
                        </Link>
                    </div>

                    <div className="hidden md:flex min-[1536px]:text-lg min-[1537px]:text-[17px] items-center space-x-10">
                        <button
                            onClick={() => handleScrollTo("hero")}
                            className="text-white hover:text-[#d9d9d9] transition-colors"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => handleScrollTo("features")}
                            className="text-white hover:text-[#d9d9d9] transition-colors"
                        >
                            Nossos Serviços
                        </button>
                        <button
                            onClick={() => handleScrollTo("about")}
                            className="text-white hover:text-[#d9d9d9] transition-colors"
                        >
                            Sobre
                        </button>
                        <button
                            onClick={() => handleScrollTo("galery")}
                            className="text-white hover:text-[#d9d9d9] transition-colors"
                        >
                            Nosso Portfolio
                        </button>
                        <button
                            onClick={() => {}}
                            className="text-white hover:text-[#d9d9d9] transition-colors"
                        >
                            Orçamento
                        </button>
                    </div>

                    <Button
                        onClick={() => {}}
                        className="bg-white text-[16px] text-[#191919] font-medium hover:bg-[#d9d9d9] hidden md:flex rounded-none px-8 py-6"
                    >
                        Faça um orçamento
                    </Button>

                    <button
                        className="md:hidden text-white z-50"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {<Menu size={32} />}
                    </button>

                    {isMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30 md:hidden"
                            onClick={toggleMenu}
                        />
                    )}
                </nav>
            </div>
            <div
                className={clsx(
                    "fixed inset-0 w-4/5 ml-auto flex flex-col justify-start bg-[#191919] text-white transform transition-transform duration-300 ease-in-out md:hidden z-50 pt-20 px-6",
                    {
                        "translate-x-0": isMenuOpen,
                        "translate-x-full": !isMenuOpen,
                    }
                )}
            >
                <button
                    className="md:hidden text-white self-end -mt-8 mb-12"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {<X size={32} />}
                </button>
                <nav className="flex flex-col space-y-8 text-xl items-end">
                    <button onClick={() => handleScrollTo("hero")}>Home</button>
                    <button onClick={() => handleScrollTo("features")}>
                        Nossos Serviços
                    </button>
                    <button onClick={() => handleScrollTo("about")}>
                        Sobre
                    </button>
                    <button onClick={() => handleScrollTo("galery")}>
                        Nosso Portfolio
                    </button>
                    <button onClick={() => {}}>Orçamento</button>
                    <Button
                        onClick={() => {}}
                        className="mt-8 bg-white text-[#191919] font-medium hover:bg-[#d9d9d9] rounded-none border border-[#7C6B4D] w-full h-[40px]"
                    >
                        Faça um orçamento
                    </Button>
                </nav>
            </div>
        </header>
    );
}
