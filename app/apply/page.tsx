"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type UploadedFile = File & {
  previewUrl?: string;
};

type FormState = {
  name?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  city?: string;
  pincode?: string;
  house?: string;
  street?: string;
  bike?: string;
  licenseFront?: UploadedFile;
  licenseBack?: UploadedFile;
  aadhaarFront?: UploadedFile;
  aadhaarBack?: UploadedFile;
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

      if (!file) return;

      const nextFile: UploadedFile = Object.assign(file, {
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      });

      setForm((prev) => ({
        ...prev,
        [name]: nextFile,
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
    const extension = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase()
      : "";
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const fileName = [safeBaseName || "upload", uniqueId]
      .filter(Boolean)
      .join("-");
    const filePath = extension ? `${fileName}.${extension}` : fileName;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const submission = {
        name: String(formData.get("name") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        whatsapp: String(formData.get("whatsapp") ?? "").trim(),
        city: String(formData.get("city") ?? "").trim(),
        pincode: String(formData.get("pincode") ?? "").trim(),
        house: String(formData.get("house") ?? "").trim(),
        street: String(formData.get("street") ?? "").trim(),
        bike: String(formData.get("bike") ?? "").trim(),
      };

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

      const { data: slot } = await supabase
        .from("serviceable_pincodes")
        .select("*")
        .eq("pincode", submission.pincode)
        .maybeSingle();

      let status = "rejected";
      let rejectionReason: "bike_required" | "pincode_full" | null = null;

      if (submission.bike === "no") {
        status = "rejected";
        rejectionReason = "bike_required";
      } else {
        if (!slot) {
          status = "approved";
        } else {
          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("pincode", submission.pincode)
            .eq("status", "approved");

          if (count !== null && count < slot.max_slots) {
            status = "approved";
          } else {
            status = "rejected";
            rejectionReason = "pincode_full";
          }
        }
      }

      const { error } = await supabase.from("applications").insert([
        {
          name: submission.name,
          phone: submission.phone,
          email: submission.email,
          whatsapp: submission.whatsapp,
          city: submission.city,
          pincode: submission.pincode,
          house: submission.house,
          street: submission.street,
          bike: submission.bike,
          license_front: licenseFrontUrl,
          license_back: licenseBackUrl,
          aadhaar_front: aadhaarFrontUrl,
          aadhaar_back: aadhaarBackUrl,
          status,
        },
      ]);

      if (error) throw error;

      if (status === "approved") {
        console.log("PARTNER APPROVAL WEBHOOK");
        console.log(
          "WEBHOOK URL",
          "https://n8n-production-303d4.up.railway.app/webhook/partner-approved"
        );

        try {
          const webhookResponse = await fetch(
            "https://n8n-production-303d4.up.railway.app/webhook/partner-approved",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: submission.name,
                email: submission.email,
                phone: submission.phone,
                city: submission.city,
                pincode: submission.pincode,
              }),
            }
          );

          if (!webhookResponse.ok) {
            console.warn(
              "PARTNER APPROVAL WEBHOOK WARNING",
              webhookResponse.status
            );
          }
        } catch (webhookError) {
          console.warn("PARTNER APPROVAL WEBHOOK WARNING", webhookError);
        }

        alert("Application approved automatically. Check your email.");
      } else if (status === "rejected") {
        console.log("REJECTION WEBHOOK");
        console.log(
          "WEBHOOK URL",
          "https://n8n-production-303d4.up.railway.app/webhook/rejection-mail"
        );

        try {
          const webhookResponse = await fetch(
            "https://n8n-production-303d4.up.railway.app/webhook/rejection-mail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: submission.name,
                email: submission.email,
                phone: submission.phone,
                city: submission.city,
                pincode: submission.pincode,
                status,
                reason: rejectionReason,
              }),
            }
          );

          if (!webhookResponse.ok) {
            console.warn("REJECTION WEBHOOK WARNING", webhookResponse.status);
          }
        } catch (webhookError) {
          console.warn("REJECTION WEBHOOK WARNING", webhookError);
        }

        if (rejectionReason === "bike_required") {
          alert("Application rejected. Bike is required.");
        } else {
          alert("Application rejected. This pincode is full.");
        }
      }

      setForm({});
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }

    setLoading(false);
  };

  const renderPreview = (file?: UploadedFile) => {
    if (!file) return null;

    const previewUrl = file.previewUrl;

    if (!previewUrl) return null;

    return (
      <img
        src={previewUrl}
        alt={file.name}
        className="mt-3 h-32 w-auto rounded border object-cover"
      />
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Partner Application
      </h1>

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
          name="email"
          type="email"
          placeholder="Email Address"
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
          <input type="file" name="licenseFront" required onChange={handleChange} />
          {renderPreview(form.licenseFront)}
        </div>

        <div>
          <label className="block mb-2">Driving License Back</label>
          <input type="file" name="licenseBack" required onChange={handleChange} />
          {renderPreview(form.licenseBack)}
        </div>

        <div>
          <label className="block mb-2">Aadhaar Front</label>
          <input type="file" name="aadhaarFront" required onChange={handleChange} />
          {renderPreview(form.aadhaarFront)}
        </div>

        <div>
          <label className="block mb-2">Aadhaar Back</label>
          <input type="file" name="aadhaarBack" required onChange={handleChange} />
          {renderPreview(form.aadhaarBack)}
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
