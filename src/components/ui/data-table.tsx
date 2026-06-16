export function DataTable() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-[#020617] text-[var(--text-muted)]">
          <tr>

            <th className="px-4 py-3 font-medium">Name</th>

            <th className="px-4 py-3 font-medium">Location</th>

            <th className="px-4 py-3 font-medium">Date</th>

          </tr>
        </thead>

        <tbody>

          <tr className="border-t border-[var(--border)] hover:bg-[#020617]">

            <td className="px-4 py-3">Dallas Show</td>

            <td className="px-4 py-3 text-neutral-400">Texas</td>

            <td className="px-4 py-3 text-neutral-400">March</td>

          </tr>

        </tbody>

      </table>

    </div>
  )
}