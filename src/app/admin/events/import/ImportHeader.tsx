import { UploadCloud } from "lucide-react";

export default function ImportHeader() {
  return (
    <div className="rounded-xl border bg-background p-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
          <UploadCloud className="h-7 w-7 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Import Card Shows
          </h1>

          <p className="max-w-3xl text-sm text-muted-foreground">
            Import Trading Card Database (TCDB) event listings into KLLCTRS.
            Generate the TCDB calendar URL, download the calendar page, upload
            the saved HTML, review the detected events, upload the individual
            event pages, and finally import everything into the database.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 1
          </p>

          <p className="mt-2 font-medium">Generate Calendar URL</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 2
          </p>

          <p className="mt-2 font-medium">Upload Calendar HTML</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 3
          </p>

          <p className="mt-2 font-medium">Upload Detail Pages</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 4
          </p>

          <p className="mt-2 font-medium">Import Events</p>
        </div>
      </div>
    </div>
  );
}
