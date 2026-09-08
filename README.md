# AquaGuard AI

AquaGuard AI adalah aplikasi web responsif untuk membantu pembudidaya ikan memantau kualitas air, menerima peringatan dini, berkonsultasi dengan asisten AI, dan mengelola sewa perangkat sensor berbasis Hardware-as-a-Service (HaaS).

## Fitur Utama

- Dashboard kesehatan tiga kolam dengan indikator DO, pH, suhu, dan amonia.
- Peringatan dini dan rekomendasi tindakan untuk kondisi air yang memburuk.
- AquaBot berbahasa Indonesia yang menggunakan konteks telemetri Kolam B.
- Direktori konsultasi ahli perikanan dan PPL.
- Pengelolaan langganan HaaS, invoice, pilihan metode pembayaran, serta simulasi pembayaran.
- Penguncian otomatis layanan sensor dan AI ketika sewa menunggak.
- Riwayat monitoring, notifikasi, profil hatchery, dan pusat bantuan.

## Teknologi

- React 19, TypeScript, Vite, dan Tailwind CSS 4.
- Netlify Functions untuk endpoint AquaBot dan pengelolaan langganan.
- Netlify AI Gateway dengan OpenAI untuk respons AquaBot.
- Netlify Database, Drizzle ORM, dan migrasi terkelola untuk data langganan, invoice, pembayaran, serta chat.
- Lucide React untuk ikon antarmuka.

## Menjalankan Secara Lokal

1. Pastikan Node.js 22 dan pnpm tersedia.
2. Jalankan `pnpm install`.
3. Jalankan `netlify dev --port 8889` agar Functions, AI Gateway, dan Database ikut diemulasikan.
4. Buka alamat lokal yang ditampilkan Netlify CLI.

Gunakan akun demo yang sudah terisi pada layar login. Alur pembayaran bersifat simulasi dan tidak memproses dana nyata.

## Struktur Penting

- `src/App.tsx` berisi seluruh alur dan komponen antarmuka utama.
- `src/index.css` berisi design system dan aturan responsif.
- `netlify/functions/aquabot.mts` menyediakan endpoint AI.
- `netlify/functions/subscription.mts` mengelola status sewa dan invoice demo.
- `db/schema.ts` mendefinisikan skema database.
- `netlify/database/migrations` berisi migrasi yang dijalankan saat deploy.
