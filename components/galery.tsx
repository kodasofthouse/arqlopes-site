"use client";

import HandwriteText from "@/public/common/handwrite-construir.svg";
import Image, { StaticImageData } from "next/image";
import GaleryImageOne from "@/public/images/galery/galery-01.jpg";
import GaleryImageTwo from "@/public/images/galery/galery-02.jpg";
import GaleryImageThree from "@/public/images/galery/galery-03.jpg";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import ArrowLeftIcon from "@/public/icons/arrow-left-icon.svg";
import ArrowRightIcon from "@/public/icons/arrow-right-icon.svg";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const GaleryData = [
    {
        imageSrc: GaleryImageOne,
        title: "Residência C|K",
        tag: "Residencial",
    },
    {
        imageSrc: GaleryImageTwo,
        title: "Comercial XYZ",
        tag: "Comercial",
    },
    {
        imageSrc: GaleryImageThree,
        title: "Reforma ABC",
        tag: "Reforma",
    },
    {
        imageSrc: GaleryImageOne,
        title: "Residência C|K2",
        tag: "Residencial",
    },
    { imageSrc: GaleryImageTwo, title: "Comercial XYZ2", tag: "Comercial" },
    { imageSrc: GaleryImageThree, title: "Reforma ABC2", tag: "Reforma" },
];

const GaleryCard = ({
    imageSrc,
    title,
    tag,
}: {
    imageSrc: StaticImageData;
    title: string;
    tag: string;
}) => {
    return (
        <div className="flex w-full relative group transition-transform duration-300 hover:scale-[1.01] z-10 hover:z-20">
            <div
                className="absolute inset-0 flex items-end left-0 pl-[36px] pb-[46px] 
                    opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            >
                <div className="flex flex-col items-start">
                    <h2
                        className={
                            spaceGrotesk.className +
                            " text-[#C17F6F] text-[28px] md:text-[34px] font-medium pb-2"
                        }
                    >
                        {title}
                    </h2>
                    <span className="bg-[#C17F6F] w-[140px] md:w-[160px] text-[#020202] text-xs text-center font-medium py-2 rounded-full mb-6 md:mb-[51px]">
                        {tag}
                    </span>
                    <Link
                        href="#"
                        className={
                            spaceGrotesk.className +
                            " relative text-white text-[16px] md:text-[18px] font-medium hover:text-[#C17F6F] transition-colors"
                        }
                    >
                        <span className="relative inline-flex items-start gap-2">
                            <span className="mb-2">Ver todo o projeto</span>
                            <span
                                className="absolute left-0 bottom-0"
                                style={{
                                    width: "75%",
                                    height: "2px",
                                    background: "currentColor",
                                    borderRadius: "1px",
                                    display: "block",
                                }}
                                aria-hidden="true"
                            />
                        </span>
                    </Link>
                </div>
            </div>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(20deg, rgba(0, 0, 0, 0.65) 0%, rgba(0,0,0,0) 35%)",
                }}
            />

            <Image
                src={imageSrc}
                alt="Project Image"
                className="w-full h-full object-cover"
            />

            
        </div>
    );
};

export default function Galery() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    return (
        <section
            id="galery"
            className="flex bg-white border-t border-[#E5E5E5] flex-col items-center justify-center h-[1460px]"
        >
            <div className="max-w-[1342px] w-full mx-auto lg:my-[226.86px] w-full items-center flex flex-col justify-center">
                <div className="flex items-center">
                    <div className="flex flex-col flex-1 items-center justify-center">
                        <h1
                            className={
                                spaceGrotesk.className +
                                " text-2xl text-[#2A2524] lg:text-[50px] font-medium lg:text-nowrap pb-[32px] text-center"
                            }
                            style={{ lineHeight: "108%" }}
                        >
                            Mais do que
                        </h1>
                        <Image
                            src={HandwriteText}
                            alt="Texto manuscrito: Construir"
                            className="mx-auto lg:-mt-[86px] w-[350px] lg:w-[650px] -mt-[66px] lg:-mb-[26px] -mb-[10px]"
                            width={350}
                            sizes="(max-width: 661.08px)"
                        />

                        <p className="text-md lg:text-[21.37px] text-[#181D23] text-center leading-relaxed lg:text-nowrap pb-[58px]">
                            realizamos projetos com propósito.
                        </p>
                        <p
                            className=" text-md lg:text-[18px] text-[#181D23] text-center leading-relaxed lg:text-nowrap pb-[58px] lg:px-0 px-8"
                            style={{ lineHeight: "180%" }}
                        >
                            Conheça alguns dos projetos que a Arqlopes
                            Construções teve o prazer
                            <span className="hidden lg:inline">
                                <br />
                            </span>
                            de transformar em realidade. Nossa galeria destaca a
                            excelência.
                        </p>
                    </div>
                </div>

                <div className="h-[867.63px] w-full hidden md:flex">
                    <div className="relative w-full h-full flex items-center">
                        <div className="absolute bottom-[62px] right-[62px] flex items-center justify-center gap-4">
                            <button
                                onClick={() =>
                                    setCurrentIndex((prev) =>
                                        prev === 0
                                            ? GaleryData.length - 3
                                            : prev - 1
                                    )
                                }
                                className="z-30 bg-[#045B64] rounded-full h-[75px] w-[75px] flex items-center justify-center transition-all border border-transparent hover:border-white"
                                aria-label="Anterior"
                                type="button"
                            >
                                <Image
                                    src={ArrowLeftIcon}
                                    alt="Seta para a esquerda"
                                    width={24}
                                    height={24}
                                />
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentIndex((prev) =>
                                        prev >= GaleryData.length - 3
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="z-30 bg-[#045B64] rounded-full p-3 h-[75px] w-[75px] flex items-center justify-center transition-all border border-transparent hover:border-white"
                                aria-label="Próximo"
                                type="button"
                            >
                                <Image
                                    src={ArrowRightIcon}
                                    alt="Seta para a direita"
                                />
                            </button>
                        </div>

                        <div className="flex flex-row w-full h-full justify-center">
                            {GaleryData.slice(
                                currentIndex,
                                currentIndex + 3
                            ).map((item, idx) => (
                                <GaleryCard
                                    key={item.title + idx}
                                    imageSrc={item.imageSrc}
                                    title={item.title}
                                    tag={item.tag}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:hidden w-full px-4 relative ">
                    <div className="w-full h-full relative flex items-center justify-center">
                        <div className="absolute bottom-[50%] w-full flex items-center justify-between px-4 z-30">
                            <button
                                onClick={() =>
                                    setCurrentIndex((prev) =>
                                        prev === 0
                                            ? GaleryData.length - 1
                                            : prev - 1
                                    )
                                }
                                className="bg-[#045B64] rounded-full h-[50px] w-[50px] flex items-center justify-center border border-transparent hover:border-white transition-all"
                                aria-label="Anterior"
                                type="button"
                            >
                                <Image
                                    src={ArrowLeftIcon}
                                    alt="Seta para a esquerda"
                                    width={20}
                                    height={20}
                                />
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentIndex((prev) =>
                                        prev === GaleryData.length - 1
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="bg-[#045B64] rounded-full h-[50px] w-[50px] flex items-center justify-center border border-transparent hover:border-white transition-all"
                                aria-label="Próximo"
                                type="button"
                            >
                                <Image
                                    src={ArrowRightIcon}
                                    alt="Seta para a direita"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </div>
                        <GaleryCard
                            imageSrc={GaleryData[currentIndex].imageSrc}
                            title={GaleryData[currentIndex].title}
                            tag={GaleryData[currentIndex].tag}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
