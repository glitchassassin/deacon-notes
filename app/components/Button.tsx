import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

const variantStyles = {
  primary:
    "px-3 py-1 rounded-sm text-sm md:text-base bg-blue-500 text-white hover:bg-blue-600 shadow-md dark:shadow-none focus:ring-blue-500",
  secondary:
    "px-3 py-1 rounded-sm text-sm md:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md dark:shadow-none focus:ring-gray-500",
  danger:
    "px-3 py-1 rounded-sm text-sm md:text-base bg-red-600 text-white hover:bg-red-700 shadow-md dark:shadow-none focus:ring-red-500",
  link: "text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 p-0",
  "link-danger":
    "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-0",
} as const;

type ButtonVariant = keyof typeof variantStyles;

type BaseButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

type LinkButtonProps = BaseButtonProps & {
  to: string;
};

export function Button({
  children,
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer";

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  variant = "secondary",
  className = "",
  to,
  ...props
}: LinkButtonProps) {
  const baseStyles =
    "px-3 py-1 rounded-sm text-sm md:text-base transition-colors";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md dark:shadow-none"
      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md dark:shadow-none";

  return (
    <Link
      to={to}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
