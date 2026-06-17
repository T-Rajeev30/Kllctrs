"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function AdminShopManagerClient({
  initialShops,
}: {
  initialShops: any[];
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return initialShops;

    const q = search.toLowerCase();

    return initialShops.filter((shop) =>
      [shop.name, shop.city, shop.state, shop.website, shop.slug]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [initialShops, search]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Shop Manager</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search shops..."
        className="w-full h-12 px-4 border rounded-xl"
      />

      <div className="rounded-xl border">
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filtered.map((shop) => (
              <tr key={shop.id}>
                <td>{shop.name}</td>
                <td>{shop.city}</td>
                <td>{shop.state}</td>
                <td>{shop.status}</td>

                <td>
                  <Link href={`/admin/shop/${shop.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
