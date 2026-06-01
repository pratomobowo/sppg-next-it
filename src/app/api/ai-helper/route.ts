import { type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// ─── Config ────────────────────────────────────────────────────────────────────
const AI_BASE_URL = 'https://9router.xbbh.net/v1'
const AI_MODEL = 'cmc/deepseek/deepseek-v4-pro'

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Kamu adalah AI Helper untuk sistem SPPG MBG (Sistem Pengolahan Pangan dan Gizi – Makan Bergizi Gratis).
Kamu adalah asisten cerdas yang membantu owner, super admin, dan pengelola SPPG memahami kondisi operasional dapur, keuangan, procurement, dan gizi.

Konteks sistem SPPG MBG:
- SPPG adalah dapur produksi makanan bergizi gratis untuk anak-anak sekolah (program MBG – Makan Bergizi Gratis)
- Dikelola oleh yayasan dan diawasi oleh BGN (Badan Gizi Nasional)
- Setiap dapur (SPPG) memiliki kapasitas produksi dan mitra supplier

Modul yang ada dalam sistem:
1. **Master Data**: Data dapur (SPPG), penjadwalan menu harian, katalog supplier, katalog item & gizi, harga acuan bahan
2. **Procurement / DO (Delivery Order)**: Pembuatan draft DO, approval multi-level (Kepala SPPG → Kepala SPPI → Full Authorize), histori DO
3. **Accounting / Keuangan**: Anggaran harian dapur, realisasi pengeluaran, dana 12 hari, laporan keuangan, RAB (Rencana Anggaran Biaya)
4. **Inventory**: Stok bahan baku, penerimaan barang, pengeluaran bahan, minimum stok alert
5. **Laporan Harian**: Laporan produksi harian, jumlah penerima manfaat, foto dokumentasi
6. **Maps & CCTV**: Peta lokasi dapur, monitoring CCTV live
7. **Pengiriman**: Tracking pengiriman makanan ke sekolah
8. **Approval Queue**: Antrian persetujuan DO dan laporan
9. **WA Gateway**: Notifikasi WhatsApp otomatis

Role pengguna:
- Super Administrator: akses penuh semua fitur
- PIC Dapur (Admin Yayasan): operasional harian dapur
- Kepala SPPG (Lvl 1): approval DO level 1
- Kepala SPPI (Lvl 2): approval DO level 2
- Full Authorize (Lvl 3): approval final + akses keuangan
- BGN (Badan Gizi Nasional): monitoring kepatuhan gizi
- Investor: dashboard keuangan & laporan operasional

Panduan respons:
- Jawab dalam Bahasa Indonesia yang ramah dan profesional
- Berikan informasi yang akurat tentang fitur dan proses dalam sistem SPPG
- Jika ditanya data spesifik yang tidak tersedia, jelaskan cara mengaksesnya di sistem
- Gunakan bullet points dan format yang rapi untuk jawaban kompleks
- Sertakan tips operasional yang berguna bila relevan
- Jika ada pertanyaan teknis, berikan solusi langkah demi langkah

Kamu siap membantu dengan pertanyaan seputar: menu gizi, anggaran, procurement, stok, laporan, approval, dan semua hal terkait operasional SPPG MBG.`

// ─── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  role: 'user' | 'assistant'
  content: string
}

// ─── Route Handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] }

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

    const requestBody = {
      model: AI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
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
