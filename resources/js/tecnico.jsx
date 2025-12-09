import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "../css/app.css";

// Tag de estado (igual que en admin)
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

function TecnicoApp() {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchReportes = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetch("/tecnico/reportes");
                if (!res.ok) throw new Error("Error al obtener reportes");
                const data = await res.json();
                setReportes(data || []);
            } catch (e) {
                console.error(e);
                setError("No se pudieron cargar tus reportes asignados.");
            } finally {
                setLoading(false);
            }
        };

        fetchReportes();
    }, []);

    const actualizarEstado = async (id, nuevoEstado) => {
        setUpdatingId(id);
        setError("");

        try {
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const res = await fetch(`/tecnico/reportes/${id}/estado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": token ?? "",
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!res.ok) {
                throw new Error("Error al actualizar el estado");
            }

            const actualizado = await res.json();

            setReportes((prev) =>
                prev.map((r) => (r.id === id ? actualizado : r))
            );
        } catch (err) {
            console.error(err);
            setError("No se pudo actualizar el estado del reporte.");
        } finally {
            setUpdatingId(null);
        }
    };

    const navToPublic = () => {
        window.location.href = "/";
    };

    const handleLogout = (e) => {
        e.preventDefault();
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";

        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        if (token) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "_token";
            input.value = token;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div>
                    <h1>Panel técnico - Mis reportes asignados</h1>
                    <p className="small-text-second">
                        Aquí puedes ver y actualizar el estado de los incidentes que tienes asignados.
                    </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={navToPublic}
                        style={{
                            backgroundColor: "transparent",
                            color: "#fff",
                            borderRadius: "999px",
                            border: "1px solid rgba(255,255,255,0.4)",
                            padding: "0.3rem 0.9rem",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                        }}
                    >
                        Ir a vista pública
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: "#C0392B",
                            color: "#fff",
                            borderRadius: "999px",
                            border: "none",
                            padding: "0.3rem 0.9rem",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="app-main">
                {/* Card centrada igual que en admin */}
                <section className="card">
                    <h2>Mis reportes asignados</h2>

                    {loading && <p className="small-text">Cargando reportes...</p>}
                    {error && <p className="error-msg">{error}</p>}

                    {reportes.length === 0 && !loading && (
                        <p className="small-text">
                            No tienes reportes asignados por el momento.
                        </p>
                    )}

                    {reportes.length > 0 && (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Código</th>
                                        <th>Título</th>
                                        <th>Descripción</th>
                                        <th>Ubicación</th>
                                        <th>Proveedor</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportes.map((r) => (
                                        <tr key={r.id}>
                                            <td>{r.id}</td>

                                            {/* NUEVA COLUMNA: CÓDIGO */}
                                            <td>{r.codigo || "N/A"}</td>

                                            <td>{r.titulo || "(Sin título)"}</td>
                                            <td>
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
                                            <td className="cell-acciones">
                                                <div className="acciones-wrapper">
                                                    <select
                                                        className="acciones-select"
                                                        value={r.estado}
                                                        disabled={
                                                            updatingId === r.id ||
                                                            r.estado === "descartado"
                                                        }
                                                        onChange={(e) =>
                                                            actualizarEstado(
                                                                r.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="en_proceso">
                                                            En proceso
                                                        </option>
                                                        <option value="resuelto">
                                                            Resuelto
                                                        </option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

const rootElement = document.getElementById("tecnico-root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<TecnicoApp />);
}