import About from "@/components/about"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import { Suspense, lazy } from "react";
import { 
  getHeroContent, 
  getAboutContent, 
  getGalleryContent, 
  getClientsContent, 
  getFooterContent 
} from "@/lib/content";

const Galery = lazy(() => import("@/components/galery"));
const Clients = lazy(() => import("@/components/clients"));

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch all content in parallel
  const [heroData, aboutData, galleryData, clientsData, footerData] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getGalleryContent(),
    getClientsContent(),
    getFooterContent(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero data={heroData} />
      <About data={aboutData} />
      <Suspense fallback={<div className="h-[1460px] bg-white flex items-center justify-center">Carregando galeria...</div>}>
        <Galery data={galleryData} />
      </Suspense>
      <Suspense fallback={<div className="h-[270px] bg-white flex items-center justify-center">Carregando clientes...</div>}>
        <Clients data={clientsData} />
      </Suspense>
      <Footer data={footerData} />
    </div>
  )
}
