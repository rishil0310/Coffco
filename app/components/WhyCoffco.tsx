import { Coffee, Truck, ShieldCheck, Star } from "lucide-react";

const features = [
  {
    icon: Coffee,
    title: "Premium Coffee",
    desc: "Made with high-quality coffee for a rich and satisfying taste.",
  },
  {
    icon: Star,
    title: "Delicious Flavours",
    desc: "Original, Vanilla and Double Espresso crafted for every coffee lover.",
  },
  {
    icon: Truck,
    title: "Next-Day Delivery",
    desc: "Delivered directly to your NMIMS Mumbai classroom the next day.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    desc: "Carefully prepared and packaged to deliver a consistently premium experience.",
  },
];

export default function WhyCoffco() {
  return (
    <section className="bg-[#090909] text-white py-28">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center">
          Why <span className="text-[#D4AF37]">Coffco?</span>
        </h2>

        <p className="text-center text-gray-400 mt-5 mb-16 max-w-2xl mx-auto">
          A premium coffee brand delivering delicious bottled coffee with rich
          flavour, smooth texture and convenient next-day classroom delivery.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-[#111] rounded-3xl p-8 border border-white/10 hover:border-[#D4AF37] transition"
              >
                <Icon
                  size={42}
                  className="text-[#D4AF37] mb-6"
                />

                <h3 className="text-2xl font-bold mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-7">
                  {feature.desc}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}