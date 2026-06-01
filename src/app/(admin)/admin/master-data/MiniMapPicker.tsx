'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type MiniMapPickerProps = {
  value: string // "lat, lng"
  onChange: (value: string) => void
}

export default function MiniMapPicker({ value, onChange }: MiniMapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  // Parse current value or fallback to Jakarta center
  const parseCoords = (val: string): [number, number] => {
    if (!val || val === '-') return [-6.2608, 106.8209]
    const parts = val.split(',')
    const lat = parseFloat(parts[0])
    const lng = parseFloat(parts[1])
    if (isNaN(lat) || isNaN(lng)) return [-6.2608, 106.8209]
    return [lat, lng]
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const initialCoords = parseCoords(value)
    
    // Initialize Leaflet map
    const map = L.map(containerRef.current, {
      zoomControl: false // keep it simple for mini-map
    }).setView(initialCoords, 13)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)

    // Custom marker icon
    const markerIcon = L.divIcon({
      className: 'custom-picker-icon',
      html: `<div class="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow bg-primary text-white text-xs">📍</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    // Add draggable marker
    const marker = L.marker(initialCoords, {
      icon: markerIcon,
      draggable: true
    }).addTo(map)
    markerRef.current = marker

    // Update value on dragend
    marker.on('dragend', () => {
      const latLng = marker.getLatLng()
      onChange(`${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}`)
    })

    // Click map to set marker coordinate
    map.on('click', (e) => {
      const latLng = e.latlng
      marker.setLatLng(latLng)
      onChange(`${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}`)
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  // Sync marker position when parent value changes externally
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return
    const currentCoords = parseCoords(value)
    const markerCoords = markerRef.current.getLatLng()
    
    if (markerCoords.lat !== currentCoords[0] || markerCoords.lng !== currentCoords[1]) {
      markerRef.current.setLatLng(currentCoords)
      mapRef.current.panTo(currentCoords)
    }
  }, [value])

  return (
    <div className="space-y-1.5">
      <div ref={containerRef} className="h-[180px] w-full rounded border overflow-hidden" />
      <span className="text-[10px] text-muted-foreground block">
        Klik peta atau geser pin merah untuk mengubah koordinat dapur secara visual.
      </span>
    </div>
  )
}
