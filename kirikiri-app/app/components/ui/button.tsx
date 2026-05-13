import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className = "",
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55";
  const hasCustomBackground = className.includes("bg-");
  const hasCustomTextColor = className.includes("text-");
  const backgroundClass =
    variant === "ghost"
      ? "bg-transparent hover:bg-slate-100"
      : hasCustomBackground
        ? ""
        : "bg-slate-950 hover:bg-slate-800";
  const textClass = hasCustomTextColor
    ? ""
    : variant === "ghost"
      ? "text-slate-700"
      : "text-white";

  return (
    <button
      type={type}
      className={`${base} ${sizeClasses[size]} ${backgroundClass} ${textClass} ${className}`}
      {...props}
    />
  );
}
