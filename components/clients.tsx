import { Space_Grotesk } from "next/font/google";
import ClientOneLogo from "@/public/logos/clients/client-1.png";
import ClientTwoLogo from "@/public/logos/clients/client-2.png";
import ClientThreeLogo from "@/public/logos/clients/cliente-3.png";
import ClientFourLogo from "@/public/logos/clients/client-4.png";
import ClientFiveLogo from "@/public/logos/clients/client-5.png";
import ClientSixLogo from "@/public/logos/clients/client-6.png";
import ClientSevenLogo from "@/public/logos/clients/client-7.png";
import {
    Marquee,
    MarqueeContent,
    MarqueeFade,
    MarqueeItem,
} from "./ui/shadcn-io/marquee";
import Image from "next/image";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function Clients() {

    const clientLogos = [
        ClientOneLogo,
        ClientTwoLogo,
        ClientThreeLogo,
        ClientFourLogo,
        ClientFiveLogo,
        ClientSixLogo,
        ClientSevenLogo,
    ];

    return (
        <section
            id="clients"
            className="flex bg-white flex-col items-center justify-center h-[270px]"
        >
            <div className="max-w-[1342px] w-full flex flex-col md:flex-row gap-6 mx-auto my-[226.86px] w-full items-center">
                <h1
                    className={
                        spaceGrotesk.className +
                        " text-[#181D23] text-[24px] lg:text-[40px] font-medium lg:text-nowrap text-center text0cent md:text-left "
                    }
                >
                    Clientes que
                    <br />
                    confiam na ArqLopes
                </h1>

                <div className="flex-1">
                    <Marquee className="flex-1">
                        <MarqueeFade side="left" />
                        <MarqueeFade side="right" />
                        <MarqueeContent>
                            {clientLogos.map((logo, index) => (
                                <MarqueeItem key={index}>
                                    <Image
                                        alt={`Client Logo ${index + 1}`}
                                        className="overflow-hidden w-[150px] lg:w-[180px] object-cover mx-0"
                                        src={logo}
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
