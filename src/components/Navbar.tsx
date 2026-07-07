import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export default async function Navbar() {
  const session = await auth();

  const dashboardHref =
    session?.user.role === ROLES.TEACHER ? "/dashboard/teacher" : "/dashboard/student";

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-700">
          <span className="text-2xl">🧠</span>
          Lectura Sináptica
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          {session ? (
            <>
              <Link href={dashboardHref} className="text-slate-600 hover:text-indigo-700">
                Mi panel
              </Link>
              <span className="hidden sm:inline text-slate-400">
                {session.user.name}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-md bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-slate-200 transition">
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-indigo-700">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-4 py-1.5 text-white hover:bg-indigo-700 transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
