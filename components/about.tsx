import LogoWithColor from "@/public/logos/logo-color.svg";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import CircularText from "./CircularText/CircularText";
import CountUp from "./CountUp/CountUp";
import LogoWithSlogan from "@/public/logos/logo-with-slogan.svg";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function About() {
    return (
        <section id="about" className="flex bg-white min-h-screen lg:h-[886px] px-4 py-12">
            <div className="max-w-[1342px] mx-auto w-full items-center flex flex-col justify-center">
                
                <div className="flex flex-col lg:flex-row items-center lg:items-center max-w-[931px] mb-[60px] lg:mb-[92px] gap-10 lg:gap-0">
                    
                    <div className="relative flex items-center justify-center lg:mr-[171px]">
                        {/* <CircularText
                            text="MAIS DO QUE CONSTRUIR:   PROJETAMOS PROPÓSITOS   "
                            onHover="speedUp"
                            spinDuration={60}
                            className={`${spaceGrotesk.className} !text-[#045B64] font-bold !tracking-wider text-2xl h-[200px] w-[200px] lg:h-[285px] lg:w-[285px]`}
                        /> */}
                        <div className="flex items-center justify-center h-[140px] lg:h-[285.1px] lg:w-[273.95px]">
                            <Image
                                src={LogoWithSlogan}
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
                            Somos a ArqLopes
                        </h1>

                        <p className="text-[16px] lg:text-[18.35px] text-[#181D23] leading-relaxed whitespace-normal">
                            Com sede em Belo Horizonte e atuação em todo o
                            estado de Minas Gerais, a ArqLopes nasceu da visão
                            do engenheiro Rafael Lopes, trazendo em seu DNA o
                            rigor técnico e o cuidado artesanal em cada etapa da
                            obra.
                            <br />
                            <br />
                            Temos mais de 10 anos de experiência na execução de
                            obras residenciais, comerciais, corporativas e
                            industriais — sempre com atenção aos acabamentos,
                            escolha criteriosa de materiais e total respeito aos
                            prazos.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between bg-[#045B64] rounded-[11.21px] px-[16px] py-[32px] lg:py-[48px] w-full gap-6 lg:gap-0">
                    <div className="flex flex-row lg:flex-row items-center justify-center font-regular text-white text-[20px] gap-2 lg:gap-[14px] flex-1 text-center lg:text-left">
                        <div className="flex items-center gap-2">
                            <CountUp
                                from={0}
                                to={150}
                                separator=","
                                direction="up"
                                duration={1}
                                className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                            />
                            <p
                                className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                            >
                                +
                            </p>
                        </div>
                        <p>Projetos entregues</p>
                    </div>

                    <div className="flex flex-row lg:flex-row items-center justify-center font-regular text-white text-[20px] gap-2 lg:gap-[14px] flex-1 text-center lg:text-left border-t lg:border-t-0 lg:border-l lg:border-r border-white py-4 lg:py-0">
                        <div className="flex items-center gap-2">
                            <CountUp
                                from={0}
                                to={50}
                                separator=","
                                direction="up"
                                duration={1}
                                className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                            />
                            <p
                                className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                            >
                                +
                            </p>
                        </div>
                        <p>Clientes atendidos</p>
                    </div>

                    <div className="flex flex-row lg:flex-row items-center justify-center font-regular text-white text-[20px] gap-2 lg:gap-[14px] flex-1 text-center lg:text-left border-t lg:border-t-0 border-white py-4 lg:py-0">
                        <div className="flex items-center gap-2">
                            <CountUp
                                from={0}
                                to={150}
                                separator=","
                                direction="up"
                                duration={1}
                                className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                            />
                            <p
                                className={`${spaceGrotesk.className} font-medium text-[40px] lg:text-[60px]`}
                            >
                                +
                            </p>
                        </div>
                        <p>Projetos entregues</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
