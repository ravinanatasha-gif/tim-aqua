import type { Config } from "@netlify/functions"
import OpenAI from "openai"
import { db } from "../../db/client"
import { chatMessages } from "../../db/schema"

const openai = new OpenAI()

export default async (request: Request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Metode tidak didukung." }, { status: 405 })
  }

  const body = (await request.json()) as { message?: string; userId?: string }
  const message = body.message?.trim()
  const userId = body.userId || "AG-USER-4412"

  if (!message || message.length > 1200) {
    return Response.json({ error: "Pertanyaan harus berisi 1–1200 karakter." }, { status: 400 })
  }

  const telemetry = "Kolam B: DO 4,9 mg/L (menurun), pH 7,0, suhu 28,5°C, amonia 0,02 mg/L, luas 20 m², komoditas lele."

  await db.insert(chatMessages).values({ userId, role: "user", content: message })

  try {
    const response = await openai.responses.create({
      model: "gpt-5.2",
      instructions: `Anda adalah AquaBot, asisten budidaya perikanan untuk petani Indonesia. Jawab dalam Bahasa Indonesia yang sederhana, praktis, tenang, dan ringkas. Gunakan telemetri sensor ini bila relevan: ${telemetry} Berikan langkah tindakan berurutan dan prioritaskan keselamatan ikan. Jangan mengarang diagnosis pasti. Jika ada kematian massal, penyakit menular, atau kondisi kritis, sarankan eskalasi ke PPL atau dokter hewan ikan. Jangan menyarankan obat keras tanpa pemeriksaan ahli.`,
      input: message,
      max_output_tokens: 500,
    })

    const answer = response.output_text || "Maaf, AquaBot belum dapat menyusun jawaban. Silakan coba lagi."
    await db.insert(chatMessages).values({ userId, role: "assistant", content: answer })
    return Response.json({ answer, telemetry })
  } catch (error) {
    console.error("AquaBot request failed", error instanceof Error ? error.message : "unknown error")
    return Response.json(
      { error: "AquaBot sedang sulit dihubungi. Coba beberapa saat lagi atau hubungi ahli/PPL." },
      { status: 503 },
    )
  }
}

export const config: Config = {
  path: "/api/aquabot",
}
