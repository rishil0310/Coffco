import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyCoffco from "./components/WhyCoffco";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />
      <Hero />
      <WhyCoffco />
      <FeaturedProducts />
      <Footer />
    </main>
  );
}
