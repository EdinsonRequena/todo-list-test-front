import { type InputHTMLAttributes } from "react";
import {
  type Path,
  type UseFormRegister,
  type FieldValues,
} from "react-hook-form";

interface Props<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  id: keyof T & string;
  label: string;
  register: UseFormRegister<T>;
  error?: string;
}

export function FieldSet<T extends FieldValues>({
  id,
  label,
  error,
  register,
  ...rest
}: Props<T>) {
  return (
    <fieldset className="space-y-1">
      <label htmlFor={id} className="text-sm text-gray-300">
        {label}
      </label>
      <input
        id={id}
        {...register(id as Path<T>)}
        {...rest}
        className="w-full rounded bg-gray-800 p-2 text-gray-100 focus:outline-none"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </fieldset>
  );
}
