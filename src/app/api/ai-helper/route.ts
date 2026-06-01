import { type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// ─── Config ────────────────────────────────────────────────────────────────────
const AI_BASE_URL = 'https://9router.xbbh.net/v1'
const AI_MODEL = 'cmc/deepseek/deepseek-v4-pro'

// ─── Base System Prompt ────────────────────────────────────────────────────────
const BASE_SYSTEM_PROMPT = `Kamu adalah AI Helper untuk sistem SPPG MBG (Sistem Pengolahan Pangan dan Gizi – Makan Bergizi Gratis).
Kamu adalah asisten analitik cerdas yang membantu owner dan pengelola SPPG memahami kondisi operasional secara mendalam.

KEMAMPUAN ANALITIK UTAMA:
- Mengidentifikasi dapur yang merugi atau boros anggaran
- Mendeteksi anomali keuangan (pengeluaran tidak wajar, tren negatif)
- Merekomendasikan menu terbaik berdasarkan nilai gizi dan efisiensi biaya
- Menganalisis stok kritis dan risiko kehabisan bahan baku
- Memantau procurement yang tertunda dan risikonya
- Memberikan insight perbandingan antar dapur/yayasan

KONTEKS SISTEM SPPG MBG:
- SPPG adalah dapur produksi makanan bergizi gratis untuk anak-anak sekolah (program MBG)
- Dikelola oleh yayasan dan diawasi oleh BGN (Badan Gizi Nasional)
- Setiap dapur memiliki anggaran harian, kapasitas produksi, dan mitra supplier

MODUL SISTEM:
1. Master Data: Data dapur, penjadwalan menu, katalog supplier, katalog item & gizi, harga acuan
2. Procurement/DO: Draft DO, approval multi-level (Kepala SPPG → SPPI → Full Authorize), histori DO
3. Accounting: Anggaran harian, kas masuk/keluar, dana 12 hari, laporan keuangan
4. Inventory: Stok bahan baku, penerimaan, pengeluaran, alert minimum stok
5. Laporan Harian: Produksi, penerima manfaat, dokumentasi
6. Maps & CCTV: Peta lokasi dapur, monitoring live
7. Pengiriman: Tracking distribusi makanan
8. Approval Queue: Antrian persetujuan DO dan laporan
9. WA Gateway: Notifikasi WhatsApp otomatis

PANDUAN RESPONS:
- Gunakan data aktual SPPG yang diberikan untuk menjawab secara spesifik
- Sebutkan nama dapur, nominal angka, dan persentase secara eksplisit
- Prioritaskan anomali dan risiko dengan label ⚠️ atau 🔴
- Berikan rekomendasi tindakan yang konkret dan actionable
- Format jawaban dengan rapi: gunakan bullet points, bold untuk highlight penting
- Jika ada tren positif, beri label ✅
- Jawab dalam Bahasa Indonesia yang profesional tapi mudah dipahami`

// ─── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  role: 'user' | 'assistant'
  content: string
}

// ─── Route Handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { messages: Message[]; contextData?: string }
    const { messages, contextData } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages are required' }, { status: 400 })
    }

    const apiKey = process.env.AI_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'AI_API_KEY tidak dikonfigurasi. Tambahkan ke .env.local.' },
        { status: 500 }
      )
    }

    // Inject SPPG data context into system prompt if provided
    const systemPrompt = contextData
      ? `${BASE_SYSTEM_PROMPT}\n\n${contextData}`
      : BASE_SYSTEM_PROMPT

    const requestBody = {
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: false,
    }

    const aiResponse = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!aiResponse.ok) {
      const errText = await aiResponse.text()
      console.error('AI API error:', aiResponse.status, errText)
      return Response.json(
        { error: `Gagal menghubungi AI (${aiResponse.status}). Periksa konfigurasi API.` },
        { status: 502 }
      )
    }

    const data = await aiResponse.json()
    const text: string = data?.choices?.[0]?.message?.content ?? ''

    if (!text) {
      return Response.json({ error: 'Tidak ada respons dari AI.' }, { status: 500 })
    }

    return Response.json({ reply: text })
  } catch (err) {
    console.error('AI Helper error:', err)
    return Response.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 })
  }
}
