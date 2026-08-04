import FeaturedProducts from "../components/FeaturedProducts";

export default function Shop() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="py-32 text-center px-8">

        <h1 className="text-6xl font-bold">
          Our Coffee
        </h1>

        <p className="text-gray-400 mt-6 text-xl max-w-2xl mx-auto">
          Premium coffee crafted for those who appreciate
          rich flavours and a smooth experience.
        </p>

      </section>


      <FeaturedProducts />

    </main>
  );
}