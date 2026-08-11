export default function Contact() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-32">

      <div className="max-w-4xl mx-auto text-center">


        <h1 className="text-6xl font-bold">
          Contact <span className="text-[#D4AF37]">Coffco</span>
        </h1>


        <p className="text-gray-400 text-xl mt-6">
          Have questions or need assistance with your order?
          Get in touch with us.
        </p>



        <div className="grid md:grid-cols-2 gap-8 mt-16">


          <div className="bg-[#111] p-10 rounded-3xl">

            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Phone
            </h2>

            <p className="text-gray-300 mt-4 text-lg">
              8780933110
            </p>

          </div>



          <div className="bg-[#111] p-10 rounded-3xl">

            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Email
            </h2>

            <p className="text-gray-300 mt-4 text-lg">
              coffco71@gmail.com
            </p>

          </div>


        </div>



        <div className="mt-10 bg-[#111] p-10 rounded-3xl">

          <h2 className="text-2xl font-bold text-[#D4AF37]">
            Delivery
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Next-day delivery available in NMIMS Mumbai classrooms.
          </p>

        </div>


      </div>

    </main>
  );
}