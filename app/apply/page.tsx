"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ApplyPage() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.files) {
      setForm({
        ...form,
        [name]: e.target.files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

const uploadFile = async (file: File) => {
  const filePath = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const licenseFrontUrl = await uploadFile(form.licenseFront);
      const licenseBackUrl = await uploadFile(form.licenseBack);
      const aadhaarFrontUrl = await uploadFile(form.aadhaarFront);
      const aadhaarBackUrl = await uploadFile(form.aadhaarBack);

      const { error } = await supabase.from("applications").insert([
        {
          name: form.name,
          phone: form.phone,
          whatsapp: form.whatsapp,
          city: form.city,
          pincode: form.pincode,
          house: form.house,
          street: form.street,
          bike: form.bike,
          license_front: licenseFrontUrl,
          license_back: licenseBackUrl,
          aadhaar_front: aadhaarFrontUrl,
          aadhaar_back: aadhaarBackUrl,
          status: "pending",
        },
      ]);

      if (error) throw error;

      alert("Application submitted successfully");
      setForm({});
    } catch (error) {
      console.error(error);
      alert("Submission failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Partner Application
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="house"
          placeholder="House Name / Number"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="street"
          placeholder="Street Name"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <select
          name="bike"
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        >
          <option value="">Do you have a bike?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <div>
          <label className="block mb-2">Driving License Front</label>
          <input type="file" name="licenseFront" onChange={handleChange} required />
        </div>

        <div>
          <label className="block mb-2">Driving License Back</label>
          <input type="file" name="licenseBack" onChange={handleChange} required />
        </div>

        <div>
          <label className="block mb-2">Aadhaar Front</label>
          <input type="file" name="aadhaarFront" onChange={handleChange} required />
        </div>

        <div>
          <label className="block mb-2">Aadhaar Back</label>
          <input type="file" name="aadhaarBack" onChange={handleChange} required />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

      </form>
    </div>
  );
}
