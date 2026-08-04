import ProductCard from "./ProductCard";
import { products } from "../data/products";

export default function FeaturedProducts() {
  return (
    <section id="products" className="bg-black text-white py-28">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center">
          Featured <span className="text-[#D4AF37]">Products</span>
        </h2>

        <p className="text-center text-gray-400 mt-5 mb-16">
          Discover our premium bottled coffee collection.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}