import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans dark:bg-black">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <UseCases />
      <CTA />
      <Footer />
    </div>
  );
}
