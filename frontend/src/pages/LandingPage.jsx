import { HeroSection } from "@/components/Landing/HeroSection"
import { Newsletter } from "@/components/Landing/NewsLetter"
import { FreshArrivals } from "@/components/Landing/FreshArrivals"
import Footer from "@/components/Footer"
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <FreshArrivals />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

