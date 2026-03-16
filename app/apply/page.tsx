"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FormState = {
  name?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  pincode?: string;
  house?: string;
  street?: string;
  bike?: string;
  licenseFront?: File;
  licenseBack?: File;
  aadhaarFront?: File;
  aadhaarBack?: File;
};

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const uploadFile = async (file: File) => {
    const filePath = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return data.publicUrl;

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !form.licenseFront ||
        !form.licenseBack ||
        !form.aadhaarFront ||
        !form.aadhaarBack
      ) {
        alert("Please upload all documents");
        setLoading(false);
        return;
      }

      const licenseFrontUrl = await uploadFile(form.licenseFront);
      const licenseBackUrl = await uploadFile(form.licenseBack);
      const aadhaarFrontUrl = await uploadFile(form.aadhaarFront);
      const aadhaarBackUrl = await uploadFile(form.aadhaarBack);

      const { data: area } = await supabase
        .from("serviceable_pincodes")
        .select("*")
        .eq("pincode", form.pincode)
        .single();

      let status = "pending";

      if (form.bike === "no") {
        status = "rejected";
      } else if (!area) {
        status = "approved";
      } else if (area.used_slots < area.max_slots) {
        status = "approved";

        await supabase
          .from("serviceable_pincodes")
          .update({
            used_slots: area.used_slots + 1
          })
          .eq("id", area.id);

      } else {
        status = "pending";
      }

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
          status,
        },
      ]);

      if (error) throw error;

      if (status === "approved") {
        alert("Application approved automatically.");
      } else if (status === "rejected") {
        alert("Application rejected. Bike is required.");
      } else {
        alert("Application submitted. Admin will review.");
      }

      setForm({});
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }

    setLoading(false);

  };

  return (<div className="max-w-3xl mx-auto py-16 px-6"> <h1 className="text-3xl font-bold mb-10 text-center">
    Partner Application </h1>

    <form onSubmit={handleSubmit} className="space-y-6">

      <input
        name="name"
        type="text"
        placeholder="Full Name"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="phone"
        type="text"
        placeholder="Phone Number"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="whatsapp"
        type="text"
        placeholder="WhatsApp Number"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="city"
        type="text"
        placeholder="City"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="pincode"
        type="text"
        placeholder="Pincode"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="house"
        type="text"
        placeholder="House Name / Number"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="street"
        type="text"
        placeholder="Street Name"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <select
        name="bike"
        required
        onChange={handleChange}
        className="w-full border p-3 rounded"
      >
        <option value="">Do you have a bike?</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <div>
        <label className="block mb-2">Driving License Front</label>
        <input
          type="file"
          name="licenseFront"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-2">Driving License Back</label>
        <input
          type="file"
          name="licenseBack"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-2">Aadhaar Front</label>
        <input
          type="file"
          name="aadhaarFront"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-2">Aadhaar Back</label>
        <input
          type="file"
          name="aadhaarBack"
          required
          onChange={handleChange}
        />
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
