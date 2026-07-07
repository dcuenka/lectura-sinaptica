import Link from "next/link";
import Image from "next/image";
import RegisterForm from "@/components/RegisterForm";
import { BRAND } from "@/lib/brand";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <Image
          src={BRAND.logo}
          alt={BRAND.name}
          width={64}
          height={64}
          className="mx-auto h-16 w-16 object-contain"
        />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 text-center">Crear cuenta</h1>
        <p className="mt-1 text-sm text-slate-500 text-center">
          Únete a {BRAND.name}
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
