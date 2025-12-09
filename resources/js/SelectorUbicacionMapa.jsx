// resources/js/SelectorUbicacionMapa.jsx
import React from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Arreglo de íconos (igual que en ReportesMapa)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL(
        "leaflet/dist/images/marker-icon-2x.png",
        import.meta.url
    ).toString(),
    iconUrl: new URL(
        "leaflet/dist/images/marker-icon.png",
        import.meta.url
    ).toString(),
    shadowUrl: new URL(
        "leaflet/dist/images/marker-shadow.png",
        import.meta.url
    ).toString(),
});

// Componente interno que escucha clicks en el mapa
function LocationMarker({ value, onChange }) {
    useMapEvents({
        click(e) {
            onChange({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            });
        },
    });

    if (!value) return null;

    return <Marker position={[value.lat, value.lng]} />;
}

function SelectorUbicacionMapa({ lat, lng, onChange }) {
    const value =
        lat && lng
            ? { lat: Number(lat), lng: Number(lng) }
            : null;

    // Centro por defecto: San Salvador (puedes ajustarlo)
    const defaultCenter = { lat: 13.6989, lng: -89.1914 };
    const center = value || defaultCenter;

    return (
        <div className="map-wrapper">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: "260px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker value={value} onChange={onChange} />
            </MapContainer>
            <p className="small-text" style={{ marginTop: "0.35rem" }}>
                Haz clic en el mapa para marcar la ubicación aproximada del
                incidente. Las coordenadas se llenarán automáticamente.
            </p>
        </div>
    );
}

export default SelectorUbicacionMapa;
