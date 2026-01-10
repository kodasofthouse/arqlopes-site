"use client";

import { Space_Grotesk } from "next/font/google";
import CountUp from "./CountUp/CountUp";
import type { AboutContent } from "@/types/content";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface AboutProps {
    data: AboutContent;
}

export default function About({ data }: AboutProps) {
    // Split description by double newlines for paragraphs
    const descriptionParts = data.description.split('\n\n');

    return (
        <section id="about" className="flex bg-white min-h-screen lg:h-[886px] px-4 py-12">
            <div className="max-w-[1342px] mx-auto w-full items-center flex flex-col justify-center">
                
                <div className="flex flex-col lg:flex-row items-center lg:items-center max-w-[931px] mb-[60px] lg:mb-[92px] gap-10 lg:gap-0">
                    
                    <div className="relative flex items-center justify-center lg:mr-[171px]">
                        <div className="flex items-center justify-center h-[140px] lg:h-[285.1px] lg:w-[273.95px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logos/logo-with-slogan.svg"
                                alt="ArqLopes Logo"
                                className="h-[140px] lg:h-[285.1px] lg:w-[273.95px] object-contain self-center"
                            />
                        </div>
                    </div>

                    
                    <div className="flex flex-col text-center lg:text-left">
                        <h1
                            className={`${spaceGrotesk.className} text-3xl text-[#2A2524] lg:text-[40px] font-medium whitespace-normal pb-[24px] lg:pb-[32px]`}
                            style={{ lineHeight: "108%" }}
                        >
                            {data.title}
                        </h1>

                        <p className="text-[16px] lg:text-[18px] text-[#181D23] leading-relaxed whitespace-normal">
                            {descriptionParts.map((part, index) => (
                                <span key={index}>
                                    {part}
                                    {index < descriptionParts.length - 1 && (
                                        <>
                                            <br />
                                            <br />
                                        </>
                                    )}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between bg-[#045B64] rounded-[11.21px] px-[16px] py-[32px] lg:py-[48px] w-full gap-6 lg:gap-0">
                    {data.stats.map((stat, index) => (
                        <div 
                            key={stat.id}
                            className={`flex flex-row lg:flex-row items-center justify-center font-regular text-white text-[20px] gap-2 lg:gap-[14px] flex-1 text-center lg:text-left ${
                                index > 0 ? 'border-t lg:border-t-0 lg:border-l border-white py-4 lg:py-0' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <CountUp
                                    from={0}
                                    to={stat.value}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                                />
                                <p
                                    className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                                >
                                    {stat.suffix}
                                </p>
                            </div>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
