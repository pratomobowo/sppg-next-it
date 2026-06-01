'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
// ─── Import Leaflet CSS ───
import 'leaflet/dist/leaflet.css'

type DapurStatus = 'normal' | 'warning' | 'kritis'

type Dapur = {
  id: string
  nama: string
  alamat: string
  status: DapurStatus
  porsiHariIni: number
  coords: [number, number]
  hasCctv: boolean
}

type School = {
  id: string
  nama: string
  coords: [number, number]
  porsiDiterima: number
  status: string
}

// ─── Props ───
type MapInnerProps = {
  dapurs: Dapur[]
  selectedDapurId: string | null
  setSelectedDapurId: (id: string | null) => void
  onViewCctv: (dapur: Dapur) => void
}

const MOCK_SCHOOLS: School[] = [
  { id: 'sch-1', nama: 'SDN Cipete 01', coords: [-6.2680, 106.8012], porsiDiterima: 150, status: 'Tiba' },
  { id: 'sch-2', nama: 'SDN Cipete 02', coords: [-6.2705, 106.8080], porsiDiterima: 145, status: 'Tiba' },
  { id: 'sch-3', nama: 'SMPN 12 Jakarta', coords: [-6.2505, 106.7989], porsiDiterima: 150, status: 'Dalam Perjalanan' },
  { id: 'sch-4', nama: 'SDN Pondok Labu 04', coords: [-6.3020, 106.7995], porsiDiterima: 100, status: 'Belum Dikirim' }
]

export default function MapInner({ dapurs, selectedDapurId, setSelectedDapurId, onViewCctv }: MapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})

  // Custom DivIcons
  const getKitchenIcon = (status: DapurStatus) => {
    const bg = status === 'normal' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg ${bg} text-white text-xs font-semibold animate-pulse">🍳</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    })
  }

  const getSchoolIcon = () => {
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg bg-blue-500 text-white text-xs font-semibold">🏫</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    })
  }

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Center on Jakarta
    const map = L.map(mapContainerRef.current).setView([-6.2608, 106.8209], 13)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Fit bounds automatically when map loaded
    const bounds = L.latLngBounds([...dapurs.map((d) => d.coords), ...MOCK_SCHOOLS.map((s) => s.coords)])
    map.fitBounds(bounds, { padding: [40, 40] })

    // Add Kitchen markers
    dapurs.forEach((dapur) => {
      const marker = L.marker(dapur.coords, { icon: getKitchenIcon(dapur.status) })
        .addTo(map)
        .on('click', () => {
          setSelectedDapurId(dapur.id)
        })

      // Popup Content HTML
      const popupDiv = document.createElement('div')
      popupDiv.className = 'p-1.5 space-y-1.5'
      popupDiv.innerHTML = `
        <h4 class="font-bold text-sm text-foreground">${dapur.nama}</h4>
        <p class="text-xs text-muted-foreground">${dapur.alamat}</p>
        <div class="flex justify-between text-xs font-semibold pt-1 border-t">
          <span>Kapasitas:</span>
          <span>${dapur.porsiHariIni} porsi/hari</span>
        </div>
      `
      
      const btnContainer = document.createElement('div')
      btnContainer.className = 'flex gap-1.5 mt-2'
      
      if (dapur.hasCctv) {
        const btnCctv = document.createElement('button')
        btnCctv.className = 'px-2 py-1 bg-primary text-primary-foreground rounded text-[10px] font-medium hover:opacity-95'
        btnCctv.innerText = 'Lihat CCTV'
        btnCctv.onclick = (e) => {
          e.stopPropagation()
          onViewCctv(dapur)
        }
        btnContainer.appendChild(btnCctv)
      }

      popupDiv.appendChild(btnContainer)
      marker.bindPopup(popupDiv)

      markersRef.current[dapur.id] = marker
    })

    // Add School markers
    MOCK_SCHOOLS.forEach((school) => {
      const marker = L.marker(school.coords, { icon: getSchoolIcon() })
        .addTo(map)
        .bindPopup(`
          <div class="p-1">
            <h4 class="font-bold text-sm">${school.nama}</h4>
            <p class="text-xs text-muted-foreground mt-0.5">Porsi: ${school.porsiDiterima} porsi</p>
            <p class="text-xs font-semibold mt-1">Status: <span class="${school.status === 'Tiba' ? 'text-emerald-600' : 'text-amber-600'}">${school.status}</span></p>
          </div>
        `)
      
      markersRef.current[school.id] = marker
    })

    // Draw Polylines (Dapur 1 -> School 1, School 2)
    L.polyline([
      [-6.2608, 106.8209], // Dapur Sejahtera 1
      [-6.2680, 106.8012]  // SDN Cipete 01
    ], { color: '#3b82f6', weight: 3, dashArray: '5, 10' }).addTo(map)

    L.polyline([
      [-6.2608, 106.8209], // Dapur Sejahtera 1
      [-6.2705, 106.8080]  // SDN Cipete 02
    ], { color: '#3b82f6', weight: 3, dashArray: '5, 10' }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [dapurs, onViewCctv, setSelectedDapurId])

  // Center Map when selectedDapurId changes
  useEffect(() => {
    if (!mapRef.current || !selectedDapurId) return
    const marker = markersRef.current[selectedDapurId]
    const dapur = dapurs.find((d) => d.id === selectedDapurId)
    if (marker && dapur) {
      mapRef.current.setView(dapur.coords, 14)
      marker.openPopup()
    }
  }, [selectedDapurId, dapurs])

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg" style={{ minHeight: '500px' }} />
}
