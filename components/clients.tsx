"use client";

import { Space_Grotesk } from "next/font/google";
import {
    Marquee,
    MarqueeContent,
    MarqueeFade,
    MarqueeItem,
} from "./ui/shadcn-io/marquee";
import type { ClientsContent } from "@/types/content";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface ClientsProps {
    data: ClientsContent;
}

export default function Clients({ data }: ClientsProps) {
    // Split title by line breaks if it contains them
    const titleParts = data.title.split('\n');

    return (
        <section
            id="clients"
            className="flex bg-white flex-col items-center justify-center h-[270px]"
        >
            <div className="max-w-[1342px] w-full flex flex-col md:flex-row gap-6 mx-auto my-[226.86px] items-center">
                <h1
                    className={
                        spaceGrotesk.className +
                        " text-[#181D23] text-[24px] lg:text-[40px] font-medium lg:text-nowrap text-center text0cent md:text-left "
                    }
                >
                    {titleParts.length > 1 ? (
                        <>
                            {titleParts[0]}
                            <br />
                            {titleParts.slice(1).join(' ')}
                        </>
                    ) : (
                        <>
                            Clientes que
                            <br />
                            confiam na ArqLopes
                        </>
                    )}
                </h1>

                <div className="flex-1">
                    <Marquee className="flex-1">
                        <MarqueeFade side="left" />
                        <MarqueeFade side="right" />
                        <MarqueeContent>
                            {data.clients.map((client) => (
                                <MarqueeItem key={client.id}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt={client.name}
                                        className="overflow-hidden w-[150px] lg:w-[180px] h-auto object-contain mx-0"
                                        src={client.logo}
                                    />
                                </MarqueeItem>
                            ))}
                        </MarqueeContent>
                    </Marquee>
                </div>
            </div>
        </section>
    );
}
