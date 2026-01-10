import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { getSiteMetadata } from "@/lib/content";

const montserrat = Montserrat({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
    try {
        const metadata = await getSiteMetadata();
        
        return {
            title: metadata.seoTitle,
            description: metadata.seoDescription,
            generator: "Next.js",
            openGraph: {
                title: metadata.seoTitle,
                description: metadata.seoDescription,
                siteName: metadata.siteName,
                images: metadata.ogImage ? [metadata.ogImage] : [],
            },
        };
    } catch (error) {
        // Fallback metadata if CMS is unavailable
        console.error("Failed to fetch metadata from CMS:", error);
        return {
            title: "Arq Lopes - Obras que impressionam no resultado e surpreendem",
            description:
                "Alta performance, rigor técnico e acabamento impecável são nossas marcas registradas.",
            generator: "Next.js",
        };
    }
}

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
