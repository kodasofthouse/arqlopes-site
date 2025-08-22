"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import MailIcon from "@/public/icons/mail-icon.svg";
import PhoneIcon from "@/public/icons/phone-icon.svg";
import LocationIcon from "@/public/icons/location-icon.svg";
import { Open_Sans, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import SeloFooter from "@/public/images/selo-footer.png";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { sendContactEmail } from "@/app/actions/send-email";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });

export default function Footer() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await sendContactEmail(formData);

            setMessage({
                type: result.success ? "success" : "error",
                text: result.message,
            });

            setTimeout(() => {
                setMessage(null);
            }, 5000);

            if (result.success) {
                const form = document.getElementById(
                    "contact-form"
                ) as HTMLFormElement;
                form?.reset();
            }
        });
    }

    const handleScrollTo = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            const yOffset = -100;
            const y =
                section.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <footer
            id="contato"
            className="text-white pt-[61px] px-6 relative flex bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url('/images/footer-background.jpg')`,
            }}
        >
            <div className="max-w-[1342px] mx-auto w-full">
                <div className="flex flex-col lg:flex-row w-full justify-between gap-12 mb-16">
                    <div className="space-y-[66.74px] w-full">
                        <h2
                            className={`${spaceGrotesk.className} text-3xl lg:text-[36px] font-medium leading-tight text-center lg:text-left`}
                        >
                            Quer dar início à sua obra
                            <br />
                            com{" "}
                            <span className="font-bold">
                                quem entende do
                                <br />
                                assunto?
                            </span>
                        </h2>

                        <div
                            className={`${openSans.className} space-y-10 flex flex-col items-center lg:items-start`}
                        >
                            <div className="flex items-center gap-6">
                                <Image
                                    src={PhoneIcon}
                                    alt="Ícone de reforma"
                                    className="w-[38px] h-[38px]"
                                />
                                <span className="text-[22px] lg:text-[22px]">
                                    (31) 97203-1160
                                </span>
                            </div>

                            <div className="flex items-center gap-6">
                                <Image
                                    src={MailIcon}
                                    alt="Ícone de e-mail"
                                    className="w-[38px] h-[38px]"
                                />
                                <span className="text-[22px] lg:text-[22px]">
                                    contato@arqlopes.com.br
                                </span>
                            </div>

                            <div className="flex items-start gap-6">
                                <Image
                                    src={LocationIcon}
                                    alt="Ícone de localização"
                                    className="w-[38px] h-[38px]"
                                />
                                <div className="text-[22px] lg:text-[22px]">
                                    <div>Rua Hidra, 301, Sala 304</div>
                                    <div>Belo Horizonte</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#5d5d5d] p-[32px] lg:p-[42px] w-full lg:w-[1000px] md:w-[852px] h-auto lg:h-[607px] md:h-[607px] mx-auto lg:mr-[66px]">
                        <div className="text-center mb-10 -gap-2">
                            <p
                                className={`${spaceGrotesk.className} text-[32px] lg:text-[36px] text-white`}
                            >
                                Dúvidas?
                            </p>
                            <h3
                                className={`${spaceGrotesk.className} text-[22px] lg:text-[26px] font-semibold text-white`}
                            >
                                Fale com a gente
                            </h3>
                        </div>

                        {/* <div className="space-y-[20px] lg:space-y-[32px]">
                            <Input
                                placeholder="Prazer, qual seu nome?"
                                className="bg-transparent border-[1.25px] pl-[38px] border-[#a78f62] text-white placeholder:text-white placeholder:text-[18px] h-[60px] lg:h-[74.75px] rounded-none"
                            />
                            <Input
                                placeholder="Seu melhor e-mail"
                                type="email"
                                className="bg-transparent border-[1.25px] pl-[38px] border-[#a78f62] text-white placeholder:text-white placeholder:text-[18px] h-[60px] lg:h-[74.75px] rounded-none"
                            />
                            <Input
                                placeholder="Sim, seu telefone"
                                type="tel"
                                className="bg-transparent border-[1.25px] pl-[38px] border-[#a78f62] text-white placeholder:text-white placeholder:text-[18px] h-[60px] lg:h-[74.75px] rounded-none"
                            />
                            <Button className="w-full lg:w-[258.51px] h-[50px] lg:h-[57.26px] bg-white text-black text-[18px] hover:bg-gray-200 font-medium border-[1.34px] border-[#A78F62]">
                                Solicitar orçamento
                            </Button>
                        </div> */}
                        {/* Success/Error Message */}
                        {message && (
                            <div
                                className={`mb-4 p-3 rounded-md text-center ${
                                    message.type === "success"
                                        ? "bg-green-100 text-green-800 border border-green-300"
                                        : "bg-red-100 text-red-800 border border-red-300"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form
                            id="contact-form"
                            action={handleSubmit}
                            className="space-y-[20px] lg:space-y-[32px]"
                        >
                            <Input
                                name="name"
                                placeholder="Prazer, qual seu nome?"
                                required
                                disabled={isPending}
                                className="bg-transparent border-[1.25px] pl-[26px] border-[#a78f62] text-white placeholder:text-white placeholder:text-[18px] py-8 rounded-none disabled:opacity-50"
                            />
                            <Input
                                name="email"
                                placeholder="Seu melhor e-mail"
                                type="email"
                                required
                                disabled={isPending}
                                className="bg-transparent border-[1.25px] pl-[26px] border-[#a78f62] text-white placeholder:text-white placeholder:text-[18px] py-8 rounded-none disabled:opacity-50"
                            />
                            <Input
                                name="phone"
                                placeholder="Sim, seu telefone"
                                type="tel"
                                required
                                disabled={isPending}
                                maxLength={15}
                                className="bg-transparent border-[1.25px] pl-[26px] border-[#a78f62] text-white placeholder:text-white placeholder:text-[18px] py-8 rounded-none disabled:opacity-50"
                            />
                            {!message && (
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full lg:w-[258.51px] h-[50px] lg:h-[57.26px] bg-white text-black text-[18px] hover:bg-gray-200 font-medium border-[1.34px] border-[#A78F62] disabled:opacity-50 disabled:cursor-not-allowed py-8 rounded-none"
                                >
                                    {isPending
                                        ? "Enviando..."
                                        : "Solicitar orçamento"}
                                </Button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between gap-16 items-center lg:items-start">
                    <div className="space-y-[42px] text-center lg:text-left w-full">
                        <Image
                            src={SeloFooter}
                            alt="Selo de qualidade"
                            height={180}
                            className="mx-auto lg:mx-0"
                        />

                        <p
                            className="text-[18px] lg:text-[18px]"
                            style={{ lineHeight: "180%" }}
                        >
                            <span className="font-bold ">
                                Mais do que construir:
                            </span>{" "}
                            realizamos
                            <br />
                            projetos com propósito.
                        </p>

                        <div className="flex gap-4 justify-center lg:justify-start">
                            {[Facebook, Instagram, Linkedin].map(
                                (Icon, idx) => (
                                    <Link
                                        key={idx}
                                        href={"#"}
                                        className="w-[55px] h-[55px] lg:w-[65px] lg:h-[65px] hover:bg-white hover:text-[#001D1D] border border-white rounded-full flex items-center justify-center"
                                    >
                                        <Icon className="w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]" />
                                    </Link>
                                )
                            )}
                        </div>
                    </div>

                    <div className="mt-10 lg:mt-[70px] text-center lg:text-left w-full">
                        <h4
                            className={`${spaceGrotesk.className} text-[22px] lg:text-[22px] font-medium mb-6`}
                        >
                            Acesso Rápido
                        </h4>
                        <nav className="space-y-4 text-[18px] lg:text-[18px]">
                            <div>
                                <button
                                    onClick={() => handleScrollTo("hero")}
                                    className="text-white hover:text-[#d9d9d9] transition-colors"
                                >
                                    Home
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleScrollTo("features")}
                                    className="text-white hover:text-[#d9d9d9] transition-colors"
                                >
                                    Nossos Serviços
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleScrollTo("about")}
                                    className="text-white hover:text-[#d9d9d9] transition-colors"
                                >
                                    Sobre
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleScrollTo("galery")}
                                    className="text-white hover:text-[#d9d9d9] transition-colors"
                                >
                                    Nosso Portfolio
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleScrollTo("clients")}
                                    className="text-white hover:text-[#d9d9d9] transition-colors"
                                >
                                    Clientes
                                </button>
                            </div>
                        </nav>
                    </div>

                    <div className="mt-10 lg:mt-[70px] w-full text-center lg:text-left">
                        <h4
                            className={`${spaceGrotesk.className} text-[22px] lg:text-[22px] font-semibold mb-6`}
                        >
                            Quer saber das novidades?
                        </h4>
                        <div className="space-y-4 lg:space-y-[27px] flex flex-col items-center lg:items-start">
                            <Input
                                placeholder="Seu melhor email"
                                className="bg-white text-[#161616] text-[18px] lg:text-[18px] w-full max-w-[500px] h-[60px] lg:h-[80px] border border-[#FBB404] rounded-none placeholder:font-bold placeholder:text-[#161616] pl-4"
                            />
                            <Button className="bg-white text-[#020202] hover:bg-gray-100 font-medium border border-[#A78F62] w-full max-w-[237px] h-[50px] lg:h-[61px] text-[18px] lg:text-[18px] rounded-none border-[1.34px] border-[#A78F62]">
                                Ficar informado
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-[61px] lg:pt-[121px] pb-[61px]">
                    <p className="text-[18px] lg:text-[18px] font-regular text-white">
                        © {new Date().getFullYear()} Projeto Desenvolvido por{" "}
                        <span className="font-black text-[#F9F0D9]">
                            Insiders
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
