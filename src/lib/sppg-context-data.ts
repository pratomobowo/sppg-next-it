/**
 * sppg-context-data.ts
 *
 * Centralized SPPG mock data for the AI Helper context injection.
 * This module aggregates data from all SPPG modules so the AI can
 * answer analytical questions about the real state of the SPPG ecosystem.
 *
 * When a real backend is available, replace the MOCK_ constants
 * with API calls and keep buildSppgContext() as-is.
 */

// ─── Dapur / SPPG ────────────────────────────────────────────────────────────

export const SPPG_DAPUR = [
  { id: 1, nama: 'Dapur Al-Falah 1', yayasan: 'Yayasan Al-Falah', lokasi: 'Jakarta Selatan', kapasitas: 300, porsiHariIni: 234, anggaranHarian: 3_510_000, realisasiHarian: 3_120_000, status: 'Aktif' },
  { id: 2, nama: 'Dapur Al-Falah 2', yayasan: 'Yayasan Al-Falah', lokasi: 'Jakarta Timur', kapasitas: 250, porsiHariIni: 180, anggaranHarian: 2_700_000, realisasiHarian: 2_850_000, status: 'Aktif' },
  { id: 3, nama: 'Dapur Al-Falah 3', yayasan: 'Yayasan Al-Falah', lokasi: 'Depok', kapasitas: 200, porsiHariIni: 0, anggaranHarian: 3_000_000, realisasiHarian: 0, status: 'Nonaktif' },
  { id: 4, nama: 'Dapur Nurul Iman 1', yayasan: 'Yayasan Nurul Iman', lokasi: 'Bandung', kapasitas: 400, porsiHariIni: 310, anggaranHarian: 4_650_000, realisasiHarian: 4_200_000, status: 'Aktif' },
  { id: 5, nama: 'Dapur Nurul Iman 2', yayasan: 'Yayasan Nurul Iman', lokasi: 'Cimahi', kapasitas: 200, porsiHariIni: 145, anggaranHarian: 2_175_000, realisasiHarian: 2_450_000, status: 'Aktif' },
  { id: 6, nama: 'Dapur Baiturrahman 1', yayasan: 'Yayasan Baiturrahman', lokasi: 'Surabaya', kapasitas: 350, porsiHariIni: 280, anggaranHarian: 4_200_000, realisasiHarian: 3_980_000, status: 'Aktif' },
  { id: 7, nama: 'Dapur Baiturrahman 2', yayasan: 'Yayasan Baiturrahman', lokasi: 'Sidoarjo', kapasitas: 250, porsiHariIni: 0, anggaranHarian: 3_750_000, realisasiHarian: 0, status: 'Nonaktif' },
  { id: 8, nama: 'Dapur Al-Falah 4', yayasan: 'Yayasan Al-Falah', lokasi: 'Bekasi', kapasitas: 250, porsiHariIni: 195, anggaranHarian: 2_925_000, realisasiHarian: 3_100_000, status: 'Aktif' },
  { id: 9, nama: 'Dapur Nurul Iman 3', yayasan: 'Yayasan Nurul Iman', lokasi: 'Cianjur', kapasitas: 200, porsiHariIni: 160, anggaranHarian: 2_400_000, realisasiHarian: 2_180_000, status: 'Aktif' },
  { id: 10, nama: 'Dapur Baiturrahman 3', yayasan: 'Yayasan Baiturrahman', lokasi: 'Malang', kapasitas: 300, porsiHariIni: 220, anggaranHarian: 3_300_000, realisasiHarian: 3_050_000, status: 'Aktif' },
  { id: 11, nama: 'Dapur Al-Falah 5', yayasan: 'Yayasan Al-Falah', lokasi: 'Tangerang', kapasitas: 220, porsiHariIni: 175, anggaranHarian: 2_625_000, realisasiHarian: 2_480_000, status: 'Aktif' },
  { id: 12, nama: 'Dapur Baiturrahman 4', yayasan: 'Yayasan Baiturrahman', lokasi: 'Gresik', kapasitas: 150, porsiHariIni: 90, anggaranHarian: 1_350_000, realisasiHarian: 1_280_000, status: 'Aktif' },
]

// ─── Keuangan / Accounting ────────────────────────────────────────────────────

export const SPPG_KEUANGAN = {
  sisaKas: 12_450_000,
  totalDanaMasuk: 57_000_000,
  totalDanaKeluar: 44_550_000,
  kasMasuk: [
    { id: 'KM-001', tanggal: '2026-05-25', sumber: 'BOS Pusat', jumlah: 15_000_000, status: 'Terverifikasi' },
    { id: 'KM-002', tanggal: '2026-05-20', sumber: 'Donasi', jumlah: 5_000_000, status: 'Terverifikasi' },
    { id: 'KM-003', tanggal: '2026-05-18', sumber: 'Dana Desa', jumlah: 8_000_000, status: 'Pending' },
    { id: 'KM-004', tanggal: '2026-05-15', sumber: 'BOS Pusat', jumlah: 12_000_000, status: 'Terverifikasi' },
    { id: 'KM-005', tanggal: '2026-05-10', sumber: 'Donasi Korporat', jumlah: 10_000_000, status: 'Terverifikasi' },
    { id: 'KM-006', tanggal: '2026-05-05', sumber: 'Dana Yayasan', jumlah: 7_000_000, status: 'Pending' },
  ],
  kasKeluar: [
    { id: 'KK-001', tanggal: '2026-05-31', kategori: 'Bahan Baku', deskripsi: 'Pembelian beras 500kg', jumlah: 6_000_000 },
    { id: 'KK-002', tanggal: '2026-05-30', kategori: 'Transportasi', deskripsi: 'Bensin pengiriman', jumlah: 350_000 },
    { id: 'KK-003', tanggal: '2026-05-29', kategori: 'Bahan Baku', deskripsi: 'Pembelian ayam 200kg', jumlah: 7_000_000 },
    { id: 'KK-004', tanggal: '2026-05-28', kategori: 'Honor', deskripsi: 'Honor tenaga masak minggu 4', jumlah: 4_500_000 },
    { id: 'KK-005', tanggal: '2026-05-27', kategori: 'Bahan Baku', deskripsi: 'Pembelian sayur & bumbu', jumlah: 2_800_000 },
    { id: 'KK-006', tanggal: '2026-05-26', kategori: 'Transportasi', deskripsi: 'Sewa kendaraan distribusi', jumlah: 1_200_000 },
    { id: 'KK-007', tanggal: '2026-05-25', kategori: 'Lainnya', deskripsi: 'Peralatan dapur', jumlah: 850_000 },
    { id: 'KK-008', tanggal: '2026-05-24', kategori: 'Honor', deskripsi: 'Honor tenaga masak minggu 3', jumlah: 4_500_000 },
    { id: 'KK-009', tanggal: '2026-05-23', kategori: 'Bahan Baku', deskripsi: 'Pembelian beras 300kg', jumlah: 3_600_000 },
    { id: 'KK-010', tanggal: '2026-05-22', kategori: 'Bahan Baku', deskripsi: 'Pembelian minyak goreng', jumlah: 2_100_000 },
    { id: 'KK-011', tanggal: '2026-05-20', kategori: 'Lainnya', deskripsi: 'Bayar listrik & air dapur', jumlah: 1_800_000 },
    { id: 'KK-012', tanggal: '2026-05-18', kategori: 'Transportasi', deskripsi: 'BBM kendaraan operasional', jumlah: 950_000 },
  ],
  dana12Hari: [
    { periode: 'Periode 1 Juni', tanggalMulai: '2026-06-01', tanggalAkhir: '2026-06-12', total: 14_400_000, status: 'Diajukan' },
    { periode: 'Periode 2 Juni', tanggalMulai: '2026-06-13', tanggalAkhir: '2026-06-24', total: 14_400_000, status: 'Diajukan' },
    { periode: 'Periode 3 Mei', tanggalMulai: '2026-05-18', tanggalAkhir: '2026-05-30', total: 14_400_000, status: 'Disetujui' },
    { periode: 'Periode 4 Mei', tanggalMulai: '2026-05-05', tanggalAkhir: '2026-05-17', total: 14_400_000, status: 'Disetujui' },
  ],
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export const SPPG_INVENTORY = [
  { id: 'INV-001', nama: 'Beras', kategori: 'Bahan Pokok', stokAkhir: 20, satuan: 'kg', status: 'Kritis', nilaiStok: 240_000 },
  { id: 'INV-002', nama: 'Minyak Goreng', kategori: 'Bahan Pokok', stokAkhir: 15, satuan: 'liter', status: 'Rendah', nilaiStok: 210_000 },
  { id: 'INV-003', nama: 'Telur', kategori: 'Protein', stokAkhir: 50, satuan: 'butir', status: 'Normal', nilaiStok: 150_000 },
  { id: 'INV-004', nama: 'Ayam', kategori: 'Protein', stokAkhir: 10, satuan: 'kg', status: 'Rendah', nilaiStok: 350_000 },
  { id: 'INV-005', nama: 'Sayur', kategori: 'Sayuran', stokAkhir: 20, satuan: 'kg', status: 'Normal', nilaiStok: 100_000 },
  { id: 'INV-006', nama: 'Tahu', kategori: 'Protein', stokAkhir: 20, satuan: 'pcs', status: 'Normal', nilaiStok: 40_000 },
  { id: 'INV-007', nama: 'Tempe', kategori: 'Protein', stokAkhir: 10, satuan: 'pcs', status: 'Rendah', nilaiStok: 30_000 },
  { id: 'INV-008', nama: 'Ikan', kategori: 'Protein', stokAkhir: 5, satuan: 'kg', status: 'Kritis', nilaiStok: 175_000 },
  { id: 'INV-009', nama: 'Gula', kategori: 'Bahan Pokok', stokAkhir: 10, satuan: 'kg', status: 'Rendah', nilaiStok: 180_000 },
  { id: 'INV-010', nama: 'Garam', kategori: 'Bumbu', stokAkhir: 20, satuan: 'kg', status: 'Normal', nilaiStok: 40_000 },
]

// ─── Procurement / DO ─────────────────────────────────────────────────────────

export const SPPG_PROCUREMENT = [
  { id: 'DO-042', tanggal: '2026-05-31', dapur: 'Dapur Al-Falah 1', supplier: 'CV Berkah Pangan', items: 8, totalNilai: 8_500_000, status: 'Pending Approval Lvl 1' },
  { id: 'DO-041', tanggal: '2026-05-30', dapur: 'Dapur Nurul Iman 1', supplier: 'PT Sumber Makmur', items: 5, totalNilai: 6_200_000, status: 'Pending Approval Lvl 2' },
  { id: 'DO-040', tanggal: '2026-05-29', dapur: 'Dapur Baiturrahman 1', supplier: 'CV Berkah Pangan', items: 6, totalNilai: 7_100_000, status: 'Approved' },
  { id: 'DO-039', tanggal: '2026-05-28', dapur: 'Dapur Al-Falah 2', supplier: 'UD Sejahtera', items: 4, totalNilai: 3_800_000, status: 'Approved' },
  { id: 'DO-038', tanggal: '2026-05-27', dapur: 'Dapur Nurul Iman 2', supplier: 'PT Sumber Makmur', items: 7, totalNilai: 5_600_000, status: 'Approved' },
  { id: 'DO-037', tanggal: '2026-05-26', dapur: 'Dapur Al-Falah 4', supplier: 'CV Berkah Pangan', items: 3, totalNilai: 2_900_000, status: 'Pending Approval Lvl 1' },
  { id: 'DO-036', tanggal: '2026-05-25', dapur: 'Dapur Baiturrahman 3', supplier: 'UD Sejahtera', items: 5, totalNilai: 4_200_000, status: 'Approved' },
]

// ─── Menu Schedule ────────────────────────────────────────────────────────────

export const SPPG_MENU_SCHEDULE = [
  {
    hari: 'Senin', tanggal: '2026-06-02',
    menu: [
      { waktu: 'Sarapan', nama: 'Nasi + Telur Dadar + Susu', kalori: 450, protein: 18, karbohidrat: 65, lemak: 12, biayaPerPorsi: 8_500 },
      { waktu: 'Makan Siang', nama: 'Nasi + Ayam Goreng + Sayur Bayam', kalori: 650, protein: 32, karbohidrat: 78, lemak: 18, biayaPerPorsi: 15_000 },
    ]
  },
  {
    hari: 'Selasa', tanggal: '2026-06-03',
    menu: [
      { waktu: 'Sarapan', nama: 'Bubur Ayam + Kerupuk', kalori: 380, protein: 14, karbohidrat: 58, lemak: 10, biayaPerPorsi: 7_000 },
      { waktu: 'Makan Siang', nama: 'Nasi + Ikan Goreng + Tempe + Sayur', kalori: 600, protein: 28, karbohidrat: 72, lemak: 16, biayaPerPorsi: 13_500 },
    ]
  },
  {
    hari: 'Rabu', tanggal: '2026-06-04',
    menu: [
      { waktu: 'Sarapan', nama: 'Roti + Telur Rebus + Susu', kalori: 420, protein: 20, karbohidrat: 52, lemak: 14, biayaPerPorsi: 9_000 },
      { waktu: 'Makan Siang', nama: 'Nasi + Daging Sapi + Tahu + Lalapan', kalori: 720, protein: 38, karbohidrat: 80, lemak: 22, biayaPerPorsi: 18_500 },
    ]
  },
  {
    hari: 'Kamis', tanggal: '2026-06-05',
    menu: [
      { waktu: 'Sarapan', nama: 'Nasi Kuning + Ayam Suwir', kalori: 480, protein: 22, karbohidrat: 68, lemak: 14, biayaPerPorsi: 9_500 },
      { waktu: 'Makan Siang', nama: 'Nasi + Rendang + Sayur Asem', kalori: 680, protein: 34, karbohidrat: 75, lemak: 24, biayaPerPorsi: 17_000 },
    ]
  },
  {
    hari: 'Jumat', tanggal: '2026-06-06',
    menu: [
      { waktu: 'Sarapan', nama: 'Nasi + Tempe Goreng + Teh', kalori: 350, protein: 12, karbohidrat: 55, lemak: 8, biayaPerPorsi: 6_000 },
      { waktu: 'Makan Siang', nama: 'Nasi + Ikan Bakar + Tahu + Kangkung', kalori: 580, protein: 30, karbohidrat: 68, lemak: 14, biayaPerPorsi: 12_500 },
    ]
  },
]

// ─── Supplier ─────────────────────────────────────────────────────────────────

export const SPPG_SUPPLIERS = [
  { id: 'SUP-001', nama: 'CV Berkah Pangan', kategori: 'Bahan Pokok & Protein', rating: 4.5, totalDO: 28, nilaiTotal: 185_000_000, statusAktif: true },
  { id: 'SUP-002', nama: 'PT Sumber Makmur', kategori: 'Bahan Pokok', rating: 4.2, totalDO: 22, nilaiTotal: 142_000_000, statusAktif: true },
  { id: 'SUP-003', nama: 'UD Sejahtera', kategori: 'Sayuran & Bumbu', rating: 4.0, totalDO: 15, nilaiTotal: 68_000_000, statusAktif: true },
  { id: 'SUP-004', nama: 'CV Maju Bersama', kategori: 'Protein & Ikan', rating: 3.8, totalDO: 10, nilaiTotal: 54_000_000, statusAktif: false },
]

// ─── Context Builder ──────────────────────────────────────────────────────────

/**
 * Builds a comprehensive text snapshot of the current SPPG data state.
 * This is injected into the AI system prompt so it can answer
 * data-specific analytical questions.
 */
export function buildSppgContext(): string {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // ── Dapur Analysis ─────────────────────────────────────────────────────────
  const activeDapur = SPPG_DAPUR.filter(d => d.status === 'Aktif')
  const inactiveDapur = SPPG_DAPUR.filter(d => d.status === 'Nonaktif')
  const totalPorsiHariIni = activeDapur.reduce((s, d) => s + d.porsiHariIni, 0)
  const totalKapasitas = activeDapur.reduce((s, d) => s + d.kapasitas, 0)

  // Dapur merugi: realisasi > anggaran
  const dapurMerugi = activeDapur.filter(d => d.realisasiHarian > d.anggaranHarian)
  // Dapur efisien: realisasi < 95% anggaran
  const dapurEfisien = activeDapur.filter(d => d.realisasiHarian <= d.anggaranHarian * 0.95 && d.realisasiHarian > 0)
  // Utilisasi kapasitas per dapur
  const dapurUtilisasi = activeDapur.map(d => ({
    nama: d.nama,
    utilisasi: Math.round((d.porsiHariIni / d.kapasitas) * 100),
    selisihAnggaran: d.realisasiHarian - d.anggaranHarian,
    statusKeuangan: d.realisasiHarian > d.anggaranHarian ? 'MERUGI' : 'SURPLUS'
  }))

  // ── Keuangan Analysis ──────────────────────────────────────────────────────
  const { sisaKas, totalDanaMasuk, totalDanaKeluar, kasKeluar, kasMasuk, dana12Hari } = SPPG_KEUANGAN
  const rasioSisaKas = Math.round((sisaKas / totalDanaMasuk) * 100)

  // Pengeluaran terbesar
  const topKeluar = [...kasKeluar].sort((a, b) => b.jumlah - a.jumlah).slice(0, 3)

  // Kategori pengeluaran
  const pengeluaranPerKategori: Record<string, number> = {}
  kasKeluar.forEach(k => {
    pengeluaranPerKategori[k.kategori] = (pengeluaranPerKategori[k.kategori] || 0) + k.jumlah
  })

  // Kas masuk pending
  const kasMasukPending = kasMasuk.filter(k => k.status === 'Pending')

  // Dana 12 hari pending
  const dana12Pending = dana12Hari.filter(d => d.status === 'Diajukan')

  // ── Inventory Analysis ─────────────────────────────────────────────────────
  const stokKritis = SPPG_INVENTORY.filter(i => i.status === 'Kritis')
  const stokRendah = SPPG_INVENTORY.filter(i => i.status === 'Rendah')

  // ── Procurement Analysis ───────────────────────────────────────────────────
  const doPending = SPPG_PROCUREMENT.filter(d => d.status.includes('Pending'))
  const doApproved = SPPG_PROCUREMENT.filter(d => d.status === 'Approved')
  const totalNilaiProcurement = SPPG_PROCUREMENT.reduce((s, d) => s + d.totalNilai, 0)

  // ── Menu Analysis ──────────────────────────────────────────────────────────
  const allMenu = SPPG_MENU_SCHEDULE.flatMap(d => d.menu)
  const menuTermahal = [...allMenu].sort((a, b) => b.biayaPerPorsi - a.biayaPerPorsi)[0]
  const menuTermurah = [...allMenu].sort((a, b) => a.biayaPerPorsi - b.biayaPerPorsi)[0]
  const menuProteinTertinggi = [...allMenu].sort((a, b) => b.protein - a.protein)[0]
  const rataKalori = Math.round(allMenu.reduce((s, m) => s + m.kalori, 0) / allMenu.length)
  const rataBiayaPerPorsi = Math.round(allMenu.reduce((s, m) => s + m.biayaPerPorsi, 0) / allMenu.length)

  // ── Build Text ─────────────────────────────────────────────────────────────
  return `
=== DATA AKTUAL SPPG MBG (Snapshot: ${today}) ===

--- RINGKASAN OPERASIONAL ---
Total Dapur Terdaftar: ${SPPG_DAPUR.length} (Aktif: ${activeDapur.length}, Nonaktif: ${inactiveDapur.length})
Total Porsi Hari Ini: ${totalPorsiHariIni.toLocaleString('id-ID')} porsi
Total Kapasitas Aktif: ${totalKapasitas.toLocaleString('id-ID')} porsi
Utilisasi Kapasitas: ${Math.round((totalPorsiHariIni / totalKapasitas) * 100)}%
Dapur Nonaktif: ${inactiveDapur.map(d => d.nama + ' (' + d.lokasi + ')').join(', ')}

--- STATUS KEUANGAN SETIAP DAPUR ---
${dapurUtilisasi.map(d =>
    `• ${d.nama}: Utilisasi ${d.utilisasi}%, Selisih Anggaran ${d.selisihAnggaran > 0 ? '+' : ''}Rp${d.selisihAnggaran.toLocaleString('id-ID')} [${d.statusKeuangan}]`
  ).join('\n')}

--- DAPUR MERUGI (Realisasi > Anggaran) ---
${dapurMerugi.length === 0 ? 'Tidak ada dapur yang merugi saat ini.' :
    dapurMerugi.map(d =>
      `• ${d.nama} (${d.lokasi}): Anggaran Rp${d.anggaranHarian.toLocaleString('id-ID')}, Realisasi Rp${d.realisasiHarian.toLocaleString('id-ID')}, Selisih +Rp${(d.realisasiHarian - d.anggaranHarian).toLocaleString('id-ID')}`
    ).join('\n')}

--- DAPUR PALING EFISIEN ---
${dapurEfisien.slice(0, 3).map(d =>
    `• ${d.nama}: Hemat Rp${(d.anggaranHarian - d.realisasiHarian).toLocaleString('id-ID')} dari anggaran`
  ).join('\n')}

--- KEUANGAN GLOBAL ---
Total Dana Masuk: Rp${totalDanaMasuk.toLocaleString('id-ID')}
Total Dana Keluar: Rp${totalDanaKeluar.toLocaleString('id-ID')}
Sisa Kas: Rp${sisaKas.toLocaleString('id-ID')} (${rasioSisaKas}% dari total masuk)
${rasioSisaKas < 25 ? '⚠️ PERINGATAN: Sisa kas di bawah 25% — risiko likuiditas!' : '✅ Kas dalam kondisi aman.'}

Kas Masuk Pending (belum terverifikasi): ${kasMasukPending.length} item, total Rp${kasMasukPending.reduce((s, k) => s + k.jumlah, 0).toLocaleString('id-ID')}

Pengeluaran per Kategori (bulan ini):
${Object.entries(pengeluaranPerKategori).sort(([, a], [, b]) => b - a).map(([kat, jml]) =>
    `• ${kat}: Rp${jml.toLocaleString('id-ID')}`
  ).join('\n')}

Pengeluaran Terbesar 3:
${topKeluar.map(k => `• ${k.deskripsi} (${k.tanggal}): Rp${k.jumlah.toLocaleString('id-ID')}`).join('\n')}

Dana 12 Hari Pending Approval: ${dana12Pending.length} periode, total Rp${dana12Pending.reduce((s, d) => s + d.total, 0).toLocaleString('id-ID')}

--- INVENTORY / STOK BAHAN BAKU ---
Stok KRITIS (segera restock): ${stokKritis.map(i => `${i.nama} (${i.stokAkhir} ${i.satuan})`).join(', ')}
Stok RENDAH (perlu diperhatikan): ${stokRendah.map(i => `${i.nama} (${i.stokAkhir} ${i.satuan})`).join(', ')}
Total Item Stok Normal: ${SPPG_INVENTORY.filter(i => i.status === 'Normal').length}

--- PROCUREMENT (DO) TERBARU ---
DO Pending Approval: ${doPending.length} DO
${doPending.map(d => `• ${d.id} - ${d.dapur} - ${d.supplier} - Rp${d.totalNilai.toLocaleString('id-ID')} [${d.status}]`).join('\n')}
DO Approved (5 hari terakhir): ${doApproved.length} DO
Total Nilai Procurement Aktif: Rp${totalNilaiProcurement.toLocaleString('id-ID')}

--- ANALISIS MENU MINGGU INI ---
Menu Termahal: ${menuTermahal.nama} (Rp${menuTermahal.biayaPerPorsi.toLocaleString('id-ID')}/porsi)
Menu Termurah: ${menuTermurah.nama} (Rp${menuTermurah.biayaPerPorsi.toLocaleString('id-ID')}/porsi)
Menu Protein Tertinggi: ${menuProteinTertinggi.nama} (${menuProteinTertinggi.protein}g protein/porsi)
Rata-rata Kalori/Porsi: ${rataKalori} kkal
Rata-rata Biaya/Porsi: Rp${rataBiayaPerPorsi.toLocaleString('id-ID')}

Menu Harian Minggu Ini:
${SPPG_MENU_SCHEDULE.map(h =>
    `• ${h.hari}: ${h.menu.map(m => m.nama + ' (' + m.waktu + ', ' + m.kalori + ' kkal, Rp' + m.biayaPerPorsi.toLocaleString('id-ID') + '/porsi)').join(' | ')}`
  ).join('\n')}

--- SUPPLIER ---
${SPPG_SUPPLIERS.map(s =>
    `• ${s.nama}: Rating ${s.rating}/5, Total DO: ${s.totalDO}, Nilai: Rp${s.nilaiTotal.toLocaleString('id-ID')}, Status: ${s.statusAktif ? 'Aktif' : 'Nonaktif'}`
  ).join('\n')}

=== AKHIR DATA SNAPSHOT ===

Analisis dan jawab pertanyaan user berdasarkan data di atas. Jika ada anomali atau risiko, sebutkan secara spesifik dengan angka. Berikan rekomendasi actionable.`
}
