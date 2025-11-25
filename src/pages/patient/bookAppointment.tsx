import React, { useState } from "react";

const BookAppointment = () => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    dentist: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Submit:", form);
    alert("Booked (demo) 😄");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Contact Us
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-stretch">
          {/* LEFT: Image */}
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg"
                alt="Dentist and patient"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="md:w-1/2">
            <div className="bg-gray-100 rounded-3xl shadow-xl p-6 md:p-8">
              {/* Blue tab */}
              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md"
                >
                  Book an appointment
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <span className="mr-2 text-gray-400 text-lg">📅</span>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full text-sm outline-none border-none bg-transparent"
                    />
                  </div>

                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <span className="mr-2 text-gray-400 text-lg">⏰</span>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="w-full text-sm outline-none border-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <span className="mr-2 text-gray-400 text-lg">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full text-sm outline-none border-none bg-transparent"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <span className="mr-2 text-gray-400 text-lg">📞</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full text-sm outline-none border-none bg-transparent"
                    />
                  </div>

                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <span className="mr-2 text-gray-400 text-lg">✉️</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full text-sm outline-none border-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Select dentist */}
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <select
                    name="dentist"
                    value={form.dentist}
                    onChange={handleChange}
                    className="w-full text-sm outline-none border-none bg-transparent"
                  >
                    <option value="">Select dentist</option>
                    <option value="dr-john">Dr. John Smith</option>
                    <option value="dr-anna">Dr. Anna Nguyen</option>
                    <option value="dr-lee">Dr. Lee Tran</option>
                  </select>
                </div>

                {/* Message */}
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <textarea
                    name="message"
                    placeholder="Your message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full text-sm outline-none border-none bg-transparent resize-none"
                  />
                </div>

                {/* Button */}
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className="px-10 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors"
                  >
                    Book now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookAppointment;
