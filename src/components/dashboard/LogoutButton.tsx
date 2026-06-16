"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="h-9 px-4 rounded-md border border-input text-sm hover:bg-accent"
    >
      Sign out
    </button>
  );
}
