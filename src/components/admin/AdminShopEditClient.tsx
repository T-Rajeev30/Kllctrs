"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ArrowLeft, Save, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  shop: any;
}

export default function AdminShopEditClient({ shop }: Props) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: shop.name ?? "",
    slug: shop.slug ?? "",
    address: shop.address ?? "",
    city: shop.city ?? "",
    state: shop.state ?? "",
    zip_code: shop.zip_code ?? "",
    phone: shop.phone ?? "",
    website: shop.website ?? "",
    specialty: shop.specialty ?? "both",
    status: shop.status ?? "pending",
    lat: shop.lat ?? "",
    lng: shop.lng ?? "",
    google_place_id: shop.google_place_id ?? "",
  });

  async function saveShop() {
    setSaving(true);

    const res = await fetch(`/api/admin/shops/${shop.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Failed to save");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/shop"
        className="inline-flex items-center gap-2 text-sm text-[#5f2eea]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="rounded-2xl border border-violet-100 bg-white p-6 space-y-5">
        <h1 className="text-2xl font-black">Edit Shop</h1>

        <Input
          label="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <Input
          label="Slug"
          value={form.slug}
          onChange={(v) => setForm({ ...form, slug: v })}
        />

        <Input
          label="Address"
          value={form.address}
          onChange={(v) => setForm({ ...form, address: v })}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="City"
            value={form.city}
            onChange={(v) => setForm({ ...form, city: v })}
          />

          <Input
            label="State"
            value={form.state}
            onChange={(v) => setForm({ ...form, state: v })}
          />

          <Input
            label="Zip"
            value={form.zip_code}
            onChange={(v) => setForm({ ...form, zip_code: v })}
          />
        </div>

        <Input
          label="Phone"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />

        <Input
          label="Website"
          value={form.website}
          onChange={(v) => setForm({ ...form, website: v })}
        />

        <Input
          label="Google Place ID"
          value={form.google_place_id}
          onChange={(v) =>
            setForm({
              ...form,
              google_place_id: v,
            })
          }
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Latitude"
            value={String(form.lat)}
            onChange={(v) => setForm({ ...form, lat: v })}
          />

          <Input
            label="Longitude"
            value={String(form.lng)}
            onChange={(v) => setForm({ ...form, lng: v })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Specialty"
            value={form.specialty}
            onChange={(v) =>
              setForm({
                ...form,
                specialty: v,
              })
            }
            options={["sports", "pokemon", "both"]}
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(v) =>
              setForm({
                ...form,
                status: v,
              })
            }
            options={["approved", "pending", "rejected"]}
          />
        </div>

        <button
          onClick={saveShop}
          disabled={saving}
          className="h-11 px-5 rounded-xl bg-green-600 text-white font-bold flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Save Shop
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block mb-1 text-sm">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 border rounded-xl"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block mb-1 text-sm">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 border rounded-xl"
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
