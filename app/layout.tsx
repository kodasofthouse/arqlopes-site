import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Arq Lopes - Obras que impressionam no resultado e surpreendem",
    description:
        "Alta performance, rigor técnico e acabamento impecável são nossas marcas registradas.",
    generator: "Next.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={montserrat.className}>{children}</body>
        </html>
    );
}
