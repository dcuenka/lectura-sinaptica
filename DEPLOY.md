# Guía para publicar Lectura Sináptica en internet

El objetivo es tener una **URL pública** (por ejemplo `https://lectura-sinaptica.vercel.app`)
que puedas compartir con tus alumnos para que se inscriban.

Necesitas crear **3 cuentas gratuitas** (una sola vez). Sigue los pasos en orden.

---

## Paso 1 — Subir el código a GitHub

GitHub guarda tu código en la nube; desde ahí Vercel lo tomará.

1. Crea una cuenta en https://github.com (gratis).
2. Crea un repositorio nuevo (botón **New**), por ejemplo `lectura-sinaptica`.
   - Déjalo **vacío** (sin README, sin .gitignore).
3. Avísame y yo subo el código por ti con los comandos de git, **o** copia la URL
   del repositorio (algo como `https://github.com/tu-usuario/lectura-sinaptica.git`)
   y pégamela aquí.

---

## Paso 2 — Crear la base de datos en la nube (Neon)

En tu computadora la base de datos es un archivo local (SQLite). En internet no sirve:
hace falta una base de datos en la nube. **Neon** ofrece Postgres gratis.

1. Crea una cuenta en https://neon.tech (puedes entrar con tu cuenta de Google).
2. Crea un proyecto nuevo (por ejemplo `lectura-sinaptica`).
3. Copia la **cadena de conexión** (Connection String). Se ve así:
   ```
   postgresql://usuario:contraseña@ep-xxxx.neon.tech/dbname?sslmode=require
   ```
4. Pégamela aquí. Con eso yo:
   - Cambio la configuración a Postgres.
   - Creo las tablas en la base de datos de la nube.
   - Cargo los ejercicios de ejemplo.

---

## Paso 3 — Publicar en Vercel

Vercel es donde vivirá la app y te dará la URL pública.

1. Crea una cuenta en https://vercel.com **usando "Continue with GitHub"** (así se conectan solos).
2. Botón **Add New → Project** e importa tu repositorio `lectura-sinaptica`.
3. En **Environment Variables** agrega estas tres (yo te doy los valores exactos):
   - `DATABASE_URL` → la cadena de Neon del Paso 2
   - `NEXTAUTH_SECRET` → un secreto largo (yo te lo genero)
   - `NEXTAUTH_URL` → la URL que te dé Vercel (ej: `https://lectura-sinaptica.vercel.app`)
4. Botón **Deploy** y espera ~2 minutos.

¡Listo! Tendrás tu URL pública.

---

## Después de publicar: cómo se inscriben los alumnos

1. Entras a la URL pública → **Registrarse** → **Profesor** → creas tu cuenta.
2. Creas una clase y copias el **código de invitación** (ej: `77BDKQ`).
3. Compartes a tus alumnos **la URL + el código** (WhatsApp, correo, pizarrón).
4. Cada alumno entra a la URL → **Registrarse** → **Alumno** → escribe el código → queda inscrito.

Sin el código, nadie puede entrar a tu clase.

---

## (Opcional) Dominio propio

Si quieres una dirección tipo `https://lecturasinaptica.com` en vez de `.vercel.app`,
compra un dominio (~$10 USD/año en Namecheap, GoDaddy, etc.) y lo conectas en
Vercel → Settings → Domains. Te ayudo cuando llegues a ese punto.
