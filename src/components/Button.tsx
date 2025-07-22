import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Button({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={clsx(
        "rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50",
        className
      )}
    />
  );
}
