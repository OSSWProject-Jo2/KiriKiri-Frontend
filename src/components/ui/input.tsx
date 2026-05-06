import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full outline-none focus:ring-2 focus:ring-violet-300 ${className}`}
      {...props}
    />
  );
}
