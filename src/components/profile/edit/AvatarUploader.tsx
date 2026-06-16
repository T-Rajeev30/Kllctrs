"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, User } from "lucide-react";

interface AvatarUploaderProps {
  avatarUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect?: (file: File) => void;
}

export default function AvatarUploader({
  avatarUrl,
  previewUrl,
  onFileSelect,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    onFileSelect?.(file);
  }

  const imageSrc = previewUrl || avatarUrl;

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={handleClick}
        className="
          group
          relative
          h-32
          w-32
          overflow-hidden
          rounded-full
          border-4
          border-white
          bg-zinc-100
          shadow-xl
          transition-transform
          duration-300
          hover:scale-[1.03]
        "
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="Profile Avatar"
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-12 w-12 text-zinc-400" />
          </div>
        )}

        {/* Overlay */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-black/40
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        >
          <Camera className="h-8 w-8 text-white" />
        </div>

        {/* Camera Button */}

        <div
          className="
            absolute
            bottom-2
            right-2
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#6D3DF5]
            shadow-lg
          "
        >
          <Camera className="h-4 w-4 text-white" />
        </div>
      </button>

      <button
        type="button"
        onClick={handleClick}
        className="
          mt-4
          rounded-xl
          bg-violet-100
          px-4
          py-2
          text-sm
          font-medium
          text-violet-700
          transition
          hover:bg-violet-200
        "
      >
        Change Photo
      </button>

      <p className="mt-2 text-xs text-zinc-500">PNG, JPG or WEBP</p>
    </div>
  );
}
