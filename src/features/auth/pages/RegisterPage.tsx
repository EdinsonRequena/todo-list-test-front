import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import { FieldSet } from "../../../components/FieldSet";
import { Button } from "../../../components/Button";

interface FormVals {
  email: string;
  password: string;
}

export function RegisterPage() {
  const { register: signup } = useAuth();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormVals>();

  const onSubmit = async (d: FormVals) => {
    try {
      await signup(d.email, d.password);
      nav("/tasks");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("password", { message: err.message });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-5 rounded bg-gray-800 p-8"
      >
        <h1 className="text-center text-2xl font-bold">Register</h1>

        <FieldSet
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email?.message}
        />
        <FieldSet
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          register={register}
          error={errors.password?.message}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "..." : "Create account"}
        </Button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
