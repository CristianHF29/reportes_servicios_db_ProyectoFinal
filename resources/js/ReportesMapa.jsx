// resources/js/ReportesMapa.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // plugin de heatmap

// Arregla los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ReportesMapa({ reportes }) {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const heatLayerRef = useRef(null);

    // Crear el mapa solo una vez
    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("mapa-reportes").setView(
            [13.6929, -89.2182], // Centro aproximado San Salvador
            11
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
    }, []);

    // Actualizar marcadores + heatmap cuando cambien los reportes
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Limpiar marcadores anteriores
        markersRef.current.forEach((m) => map.removeLayer(m));
        markersRef.current = [];

        // Puntos para heatmap
        const puntosHeat = [];

        reportes.forEach((r) => {
            if (!r.latitud || !r.longitud) return;

            const lat = Number(r.latitud);
            const lng = Number(r.longitud);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            // Marcador normal
            const marker = L.marker([lat, lng]).addTo(map);

            marker.bindPopup(
                `<strong>${r.titulo || "(Sin título)"}</strong><br/>
                ${r.descripcion || ""}<br/>
                <small>${r.departamento || "-"} / ${r.municipio || "-"}</small>`
            );

            markersRef.current.push(marker);

            // Punto para capa de calor: [lat, lng, intensidad]
            puntosHeat.push([lat, lng, 1.0]);
        });

        // Limpiar heatmap anterior
        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
            heatLayerRef.current = null;
        }

        // Crear nueva capa de calor
        if (puntosHeat.length > 0) {
            const heat = L.heatLayer(puntosHeat, {
                radius: 30,
                blur: 5,
                maxZoom: 12,
                gradient: {
                    0.0: "#ff6666",
                    1.0: "#ff6666",
                },
            }).addTo(map);

            heatLayerRef.current = heat;

            const group = L.featureGroup([...markersRef.current]);
            map.fitBounds(group.getBounds().pad(0.2));
        } else {
            // Si no hay puntos, recéntramos
            map.setView([13.6929, -89.2182], 11);
        }
    }, [reportes]);

    return (
        <div
            id="mapa-reportes"
            style={{
                width: "100%",
                height: "380px",
                borderRadius: "10px",
                overflow: "hidden",
            }}
        ></div>
    );
}

export default ReportesMapa;