export default function About() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-32">

      <div className="max-w-4xl mx-auto text-center">

        <h1 className="text-6xl font-bold">
          About <span className="text-[#D4AF37]">Coffco</span>
        </h1>


        <p className="text-gray-400 text-xl leading-9 mt-10">
          Coffco is a premium coffee brand providing delicious
          coffee experiences through carefully crafted beverages.
          Our goal is to make high-quality coffee accessible
          and convenient for students and coffee lovers alike.
        </p>


        <p className="text-gray-400 text-xl leading-9 mt-8">
          With a focus on rich flavours, quality ingredients,
          and a premium experience, Coffco brings your favourite
          coffee moments closer to you.
        </p>


        <div className="mt-16 grid md:grid-cols-3 gap-8">

          <div className="bg-[#111] p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Premium Quality
            </h2>
            <p className="text-gray-400 mt-3">
              Carefully selected ingredients for a smooth taste.
            </p>
          </div>


          <div className="bg-[#111] p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Convenient
            </h2>
            <p className="text-gray-400 mt-3">
              Coffee designed for your fast-paced lifestyle.
            </p>
          </div>


          <div className="bg-[#111] p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Made For Students
            </h2>
            <p className="text-gray-400 mt-3">
              Bringing premium coffee to your campus.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}