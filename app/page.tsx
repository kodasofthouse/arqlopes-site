import About from "@/components/about"
//import Clients from "@/components/clients"
import Footer from "@/components/footer"
//import Galery from "@/components/galery"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import { Suspense, lazy } from "react";

const Galery = lazy(() => import("@/components/galery"));
const Clients = lazy(() => import("@/components/clients"));

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <About />
      <Suspense fallback={<div>Loading...</div>}>
        <Galery />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Clients />
      </Suspense>
      <Footer />
    </div>
  )
}
