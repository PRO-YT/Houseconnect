import Link from "next/link";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[color:var(--color-accent-strong)]",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  ghost:
    "bg-transparent text-slate-700 ring-1 ring-transparent hover:bg-slate-100",
  dark: "bg-slate-950 text-white hover:bg-slate-800",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonVariants = keyof typeof variants;
type ButtonSizes = keyof typeof sizes;

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariants;
  size?: ButtonSizes;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  href,
  variant = "primary",
  size = "md",
  children,
}: {
  className?: string;
  href: string;
  variant?: ButtonVariants;
  size?: ButtonSizes;
  children: React.ReactNode;
}) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition duration-200",
        variants[variant],
        sizes[size],
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
