import { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

type ButtonVariant = "primary" | "secondary";

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
  const baseStyles = "px-3 py-1 rounded-sm text-sm md:text-base transition-colors";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md dark:shadow-none"
      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md dark:shadow-none";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
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
  const baseStyles = "px-3 py-1 rounded-sm text-sm md:text-base transition-colors";
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
