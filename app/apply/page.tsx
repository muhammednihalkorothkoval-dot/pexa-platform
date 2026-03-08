"use client";

import { useState } from "react";

export default function ApplyPage() {

  const [form, setForm] = useState<any>({});

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const fileToBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") resolve(result);
          else reject(new Error("Failed to read file"));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

    try {
      const payload = {
        name: form.name || "",
        phone: form.phone || "",
        whatsapp: form.whatsapp || "",
        pincode: form.pincode || "",
        city: form.city || "",
        house: form.house || "",
        street: form.street || "",
        bike: form.bike || "",
        licenseFront: form.licenseFront ? await fileToBase64(form.licenseFront) : "",
        licenseBack: form.licenseBack ? await fileToBase64(form.licenseBack) : "",
        aadhaarFront: form.aadhaarFront ? await fileToBase64(form.aadhaarFront) : "",
        aadhaarBack: form.aadhaarBack ? await fileToBase64(form.aadhaarBack) : "",
      };

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Submission failed");
      }

      alert("Application submitted successfully!");
      setForm({});
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#F7F7F7] py-16 px-4">

      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-[#111111]">
          Become a PEXA Partner
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Fill the form below to start working with PEXA
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
            <input
              type="tel"
              name="whatsapp"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">City Name</label>
            <input
              type="text"
              name="city"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* House */}
          <div>
            <label className="block text-sm font-medium mb-1">House Name / Number</label>
            <input
              type="text"
              name="house"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium mb-1">Street Name</label>
            <input
              type="text"
              name="street"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Bike */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Do you have a Bike?
            </label>

            <select
              name="bike"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          {/* DOCUMENT UPLOAD SECTION */}

          <div className="grid md:grid-cols-2 gap-10 pt-6">

            {/* DRIVING LICENSE */}
            <div>

              <h3 className="text-yellow-500 font-semibold mb-4 tracking-widest text-sm">
                DRIVING LICENSE
              </h3>

              {/* Front */}
              <label className="block border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer hover:border-yellow-400 transition mb-4">

                <p className="font-semibold text-gray-600">FRONT SIDE</p>
                <p className="text-sm text-gray-400">Click or drag to upload</p>

                <input
                  type="file"
                  name="licenseFront"
                  onChange={handleChange}
                  className="hidden"
                  required
                />

              </label>

              {/* Back */}
              <label className="block border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer hover:border-yellow-400 transition">

                <p className="font-semibold text-gray-600">BACK SIDE</p>
                <p className="text-sm text-gray-400">Click or drag to upload</p>

                <input
                  type="file"
                  name="licenseBack"
                  onChange={handleChange}
                  className="hidden"
                  required
                />

              </label>

            </div>

            {/* AADHAAR CARD */}
            <div>

              <h3 className="text-yellow-500 font-semibold mb-4 tracking-widest text-sm">
                AADHAAR CARD
              </h3>

              {/* Front */}
              <label className="block border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer hover:border-yellow-400 transition mb-4">

                <p className="font-semibold text-gray-600">FRONT SIDE</p>
                <p className="text-sm text-gray-400">Click or drag to upload</p>

                <input
                  type="file"
                  name="aadhaarFront"
                  onChange={handleChange}
                  className="hidden"
                  required
                />

              </label>

              {/* Back */}
              <label className="block border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer hover:border-yellow-400 transition">

                <p className="font-semibold text-gray-600">BACK SIDE</p>
                <p className="text-sm text-gray-400">Click or drag to upload</p>

                <input
                  type="file"
                  name="aadhaarBack"
                  onChange={handleChange}
                  className="hidden"
                  required
                />

              </label>

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:scale-105 transition mt-6"
          >
            Submit Application
          </button>

        </form>

      </div>

    </section>
  );
}