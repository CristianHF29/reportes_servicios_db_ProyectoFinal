// resources/js/app.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "../css/app.css";
import ReportesMapa from "./ReportesMapa";
import SelectorUbicacionMapa from "./SelectorUbicacionMapa";

/* ====== Tags visuales ====== */
function tipoTag(tipo) {
    if (tipo === "electricidad") {
        return <span className="tag tag-elec">Electricidad</span>;
    }
    if (tipo === "agua") {
        return <span className="tag tag-agua">Agua</span>;
    }
    if (tipo === "internet") {
        return <span className="tag tag-internet">Internet</span>;
    }
    return null;
}

function estadoTag(estado) {
    if (estado === "resuelto") {
        return <span className="tag tag-estado-resuelto">RESUELTO</span>;
    }
    if (estado === "en_proceso") {
        return <span className="tag tag-estado-proceso">EN PROCESO</span>;
    }
    if (estado === "pendiente") {
        return <span className="tag tag-estado-pendiente">PENDIENTE</span>;
    }
    if (estado === "descartado") {
        return <span className="tag tag-estado-descartado">DESCARTADO</span>;
    }
    return null;
}

/* ====== Proveedores por tipo ====== */
const proveedoresPorServicio = {
    electricidad: ["AES CAESS", "AES CLESA", "AES EEO", "AES DEUSEM"],
    agua: ["ANDA", "ASA"],
    internet: ["Tigo", "Claro"],
};

function App() {
    // Tabla: solo últimos 10 (cualquier estado)
    const [reportes, setReportes] = useState([]);
    // Mapa: todos los que no estén resueltos ni descartados
    const [reportesMapa, setReportesMapa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        tipo_servicio: "electricidad",
        titulo: "",
        descripcion: "",
        proveedor: "",
        departamento: "",
        municipio: "",
        zona: "",
        latitud: "",
        longitud: "",
    });

    /* ================== Cargar reportes ================== */
    const fetchReportes = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/reportes?per_page=200");
            if (!res.ok) throw new Error("Error al obtener reportes");
            const data = await res.json();

            const lista = data.data || [];

            // Ordenamos por id de mayor a menor (= más recientes primero)
            const ordenados = [...lista].sort((a, b) => b.id - a.id);

            // Tabla pública: últimos 10 (sin importar estado)
            setReportes(ordenados.slice(0, 10));

            // Mapa / heatmap: SOLO reportes que NO estén resueltos NI descartados
            const activos = ordenados.filter(
                (r) => r.estado !== "resuelto" && r.estado !== "descartado"
            );
            setReportesMapa(activos);
        } catch (e) {
            console.error(e);
            setError("No se pudieron cargar los reportes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportes();
    }, []);

    /* ================== formulario ================== */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const payload = {
            ...form,
            latitud: form.latitud ? Number(form.latitud) : null,
            longitud: form.longitud ? Number(form.longitud) : null,
        };

        try {
            const res = await fetch("/api/reportes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 422) {
                const body = await res.json();
                console.error(body);
                setError("Revisa los datos del formulario.");
                return;
            }

            if (!res.ok) {
                throw new Error("Error al guardar el reporte");
            }

            const nuevo = await res.json();

            //  Alerta con codigo
            if (window.Swal && nuevo.codigo) {
                Swal.fire({
                    title: "Reporte registrado",
                    text: `Tu número de reporte es: ${nuevo.codigo}`,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });
            }

            // Tabla: insertamos el nuevo al inicio y recortamos a 10
            setReportes((prev) => [nuevo, ...prev].slice(0, 10));

            // Mapa: insertamos solo si NO está resuelto NI descartado
            if (nuevo.estado !== "resuelto" && nuevo.estado !== "descartado") {
                setReportesMapa((prev) => [nuevo, ...prev]);
            }

            // Limpiar formulario (menos tipo_servicio)
            setForm((prev) => ({
                ...prev,
                titulo: "",
                descripcion: "",
                proveedor: "",
                departamento: "",
                municipio: "",
                zona: "",
                latitud: "",
                longitud: "",
            }));
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al guardar el reporte.");
        } finally {
            setSaving(false);
        }
    };

    /* ================== RENDER ================== */
    return (
        <div className="app-container">
            <header className="app-header">
                <div>
                    <h1>Plataforma de Reporte de Servicios</h1>
                    <p className="small-text-second">
                        Reporte y monitoreo de fallas de electricidad, agua e internet.
                    </p>
                </div>
                <div className="header-badge">ReportaSV</div>
            </header>

            <main className="app-main">
                {/* ===== LISTADO PÚBLICO (últimos 10, sin ID) ===== */}
                <section className="card">
                    <h2>Historial de reportes recientes</h2>

                    {loading && <p className="small-text">Cargando reportes...</p>}
                    {error && <p className="error-msg">{error}</p>}

                    {!loading && reportes.length === 0 && (
                        <p className="small-text">
                            Aún no hay reportes registrados. Crea el primero desde el formulario.
                        </p>
                    )}

                    {reportes.length > 0 && (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Servicio</th>
                                        <th>Título / Descripción</th>
                                        <th>Ubicación</th>
                                        <th>Proveedor</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportes.map((r) => (
                                        <tr key={r.id}>
                                            <td>{tipoTag(r.tipo_servicio)}</td>
                                            <td>
                                                <strong>{r.titulo || "(Sin título)"}</strong>
                                                <br />
                                                <span className="small-text">
                                                    {r.descripcion}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small-text">
                                                    {r.departamento || "-"} /{" "}
                                                    {r.municipio || "-"}
                                                    {r.zona ? ` · ${r.zona}` : ""}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small-text">
                                                    {r.proveedor || "-"}
                                                </span>
                                            </td>
                                            <td>{estadoTag(r.estado)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* ===== MAPA DE REPORTES (solo pendientes + en_proceso) ===== */}
                <section className="card card-map">
                    <h2>Mapa de reportes</h2>
                    <p className="small-text">
                        Los puntos aparecen solo para reportes que tienen latitud y
                        longitud registrados y que aún no han sido marcados como resueltos
                        o descartados.
                    </p>
                    <ReportesMapa reportes={reportesMapa} />
                </section>

                {/* ===== FORMULARIO NUEVO REPORTE ===== */}
                <section className="card">
                    <h2>Nuevo reporte de servicio</h2>
                    <p className="small-text">
                        Completa la información del incidente para registrarlo en el sistema.
                    </p>

                    <form onSubmit={handleSubmit} className="form-grid">
                        <div>
                            <label htmlFor="tipo_servicio">Tipo de servicio</label>
                            <select
                                id="tipo_servicio"
                                name="tipo_servicio"
                                value={form.tipo_servicio}
                                onChange={handleChange}
                            >
                                <option value="electricidad">Electricidad</option>
                                <option value="agua">Agua</option>
                                <option value="internet">Internet</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="proveedor">Proveedor</label>
                            <select
                                id="proveedor"
                                name="proveedor"
                                value={form.proveedor}
                                onChange={handleChange}
                                disabled={!form.tipo_servicio}
                            >
                                <option value="">Selecciona un proveedor</option>
                                {proveedoresPorServicio[form.tipo_servicio]?.map(
                                    (prov, i) => (
                                        <option key={i} value={prov}>
                                            {prov}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-grid-full">
                            <label htmlFor="titulo">Título</label>
                            <input
                                id="titulo"
                                name="titulo"
                                value={form.titulo}
                                onChange={handleChange}
                                placeholder="Ej: Corte de luz en colonia Escalón"
                            />
                        </div>

                        <div className="form-grid-full">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                placeholder="Describe brevemente el problema, hora aproximada, zona afectada..."
                            />
                        </div>

                        <div>
                            <label htmlFor="departamento">Departamento</label>
                            <input
                                id="departamento"
                                name="departamento"
                                value={form.departamento}
                                onChange={handleChange}
                                placeholder="San Salvador, La Libertad..."
                            />
                        </div>

                        <div>
                            <label htmlFor="municipio">Municipio</label>
                            <input
                                id="municipio"
                                name="municipio"
                                value={form.municipio}
                                onChange={handleChange}
                                placeholder="Lourdes, Mejicanos, Soyapango..."
                            />
                        </div>

                        <div className="form-grid-full">
                            <label htmlFor="zona">Zona / Colonia</label>
                            <input
                                id="zona"
                                name="zona"
                                value={form.zona}
                                onChange={handleChange}
                                placeholder="Colonia, residencial, barrio..."
                            />
                        </div>

                        <div>
                            <label htmlFor="latitud">Latitud</label>
                            <input
                                id="latitud"
                                name="latitud"
                                type="number"
                                step="0.000001"
                                disabled
                                value={form.latitud}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="longitud">Longitud</label>
                            <input
                                id="longitud"
                                name="longitud"
                                type="number"
                                step="0.000001"
                                disabled
                                value={form.longitud}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="form-grid-full error-msg">{error}</div>
                        )}

                        <div className="form-grid-full" style={{ marginTop: "1rem" }}>
                            <SelectorUbicacionMapa
                                lat={form.latitud}
                                lng={form.longitud}
                                onChange={({ lat, lng }) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        latitud: lat.toFixed(6),
                                        longitud: lng.toFixed(6),
                                    }))
                                }
                            />
                        </div>

                        <div className="form-grid-full" style={{ marginTop: "0.5rem" }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Registrar reporte"}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}