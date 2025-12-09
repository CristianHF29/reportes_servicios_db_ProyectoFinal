import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "../css/app.css";

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

function AdminApp() {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const [tecnicos, setTecnicos] = useState([]);
    const [loadingTecnicos, setLoadingTecnicos] = useState(false);

    // PAGINACIÓN
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    // FILTRO
    const [filtroTipo, setFiltroTipo] = useState("todos");

    // CARGA DE REPORTES (paginados + filtro)
    const fetchReportes = async (pageArg = 1, tipoArg = filtroTipo) => {
        setLoading(true);
        setError("");

        try {
            let url = `/api/admin/reportes?per_page=10&page=${pageArg}`;
            if (tipoArg !== "todos") {
                url += `&tipo_servicio=${tipoArg}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error("Error al obtener reportes");

            const data = await res.json();
            setReportes(data.data || []);
            setPage(data.current_page);
            setLastPage(data.last_page);
            setTotal(data.total);
        } catch (e) {
            console.error(e);
            setError("No se pudieron cargar los reportes.");
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const nuevoTipo = e.target.value;
        setFiltroTipo(nuevoTipo);
        fetchReportes(1, nuevoTipo);
    };

    const irPaginaAnterior = () => {
        if (page > 1) fetchReportes(page - 1);
    };

    const irPaginaSiguiente = () => {
        if (page < lastPage) fetchReportes(page + 1);
    };

    // CARGAR TÉCNICOS (con conteos)
    const fetchTecnicos = async () => {
        setLoadingTecnicos(true);
        try {
            const res = await fetch("/api/admin/tecnicos");
            if (!res.ok) throw new Error("Error al obtener técnicos");
            const data = await res.json();
            setTecnicos(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingTecnicos(false);
        }
    };

    useEffect(() => {
        fetchReportes(1, filtroTipo);
        fetchTecnicos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ACTUALIZAR ESTADO
    const actualizarEstado = async (id, nuevoEstado) => {
        setUpdatingId(id);
        setError("");

        try {
            const res = await fetch(`/api/reportes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!res.ok) throw new Error("Error al actualizar estado");

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

    // ASIGNAR TÉCNICO (con límite de 5 por día)
    const asignarTecnico = async (id, assigneeId) => {
        setUpdatingId(id);
        setError("");

        try {
            const res = await fetch(`/api/admin/reportes/${id}/asignar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ assignee_id: assigneeId || null }),
            });

            if (res.status === 422) {
                const body = await res.json();

                if (window.Swal) {
                    Swal.fire({
                        title: "No se puede asignar",
                        text:
                            body.message ||
                            "El técnico ya tiene el máximo de reportes para hoy.",
                        icon: "warning",
                        confirmButtonText: "Aceptar",
                    });
                } else {
                    alert(
                        body.message ||
                            "El técnico ya tiene el máximo de reportes para hoy."
                    );
                }

                // Rebotar el valor del select recargando la lista
                fetchReportes(page, filtroTipo);
                fetchTecnicos();
                return;
            }

            if (!res.ok) {
                throw new Error("Error al asignar técnico");
            }

            const actualizado = await res.json();

            setReportes((prev) =>
                prev.map((r) => (r.id === id ? actualizado : r))
            );

            // Actualizamos conteos de técnicos
            fetchTecnicos();
        } catch (err) {
            console.error(err);
            setError("No se pudo asignar el técnico a este reporte.");
        } finally {
            setUpdatingId(null);
        }
    };

    // LOGOUT + IR A PÚBLICA
    const navToPublic = () => {
        window.location.href = "/";
    };

    const handleLogout = async () => {
        try {
            const token = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            await fetch("/logout", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": token,
                    Accept: "application/json",
                },
            });

            window.location.href = "/login";
        } catch (error) {
            console.error("Error al cerrar sesión", error);
            alert("No se pudo cerrar la sesión. Intenta de nuevo.");
        }
    };

    // RENDER
    return (
        <div className="app-container">
            <header className="app-header">
                <div>
                    <h1>Panel Administrativo - Reportes de servicios</h1>
                    <p className="small-text-second">
                        Uso interno para administradores: gestión de estados de reportes y asignación de técnicos.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                    }}
                >
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
                {/* ================== GESTIÓN DE REPORTES ================== */}
                <section className="card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginBottom: "0.8rem",
                            gap: "0.4rem",
                        }}
                    >
                        <label className="small-text">Filtrar:</label>

                        <select
                            value={filtroTipo}
                            onChange={handleFiltroChange}
                            style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.8rem",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                width: "130px",
                            }}
                        >
                            <option value="todos">Todos</option>
                            <option value="electricidad">Electricidad</option>
                            <option value="agua">Agua</option>
                            <option value="internet">Internet</option>
                        </select>

                        <span
                            className="small-text"
                            style={{ marginLeft: "0.8rem" }}
                        >
                            Total: {total}
                        </span>
                    </div>

                    <h2>Gestión de reportes</h2>

                    {loading && <p className="small-text">Cargando...</p>}
                    {error && <p className="error-msg">{error}</p>}

                    {reportes.length === 0 && !loading && (
                        <p className="small-text">No hay reportes.</p>
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
                                        <th>Técnico</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportes.map((r) => (
                                        <tr key={r.id}>
                                            <td>{r.id}</td>
                                            <td>{r.codigo || "N/A"}</td>
                                            <td>{r.titulo || "(Sin título)"}</td>
                                            <td className="small-text">
                                                {r.descripcion}
                                            </td>
                                            <td className="small-text">
                                                {r.departamento || "-"} /{" "}
                                                {r.municipio || "-"}
                                                {r.zona ? ` · ${r.zona}` : ""}
                                            </td>
                                            <td className="small-text">
                                                {r.proveedor || "-"}
                                            </td>
                                            <td>{estadoTag(r.estado)}</td>

                                            {/* Técnico asignado */}
                                            <td className="cell-tecnico">
                                                <select
                                                    disabled={
                                                        updatingId === r.id ||
                                                        loadingTecnicos
                                                    }
                                                    value={r.assignee_id || ""}
                                                    onChange={(e) =>
                                                        asignarTecnico(
                                                            r.id,
                                                            e.target.value ||
                                                                null
                                                        )
                                                    }
                                                    className="tecnico-select"
                                                >
                                                    <option value="">
                                                        Sin asignar
                                                    </option>
                                                    {tecnicos.map((t) => (
                                                        <option
                                                            key={t.id}
                                                            value={t.id}
                                                        >
                                                            {t.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            {/* Acciones (estado) */}
                                            <td className="cell-acciones">
                                                <div className="acciones-wrapper">
                                                    <select
                                                        className="acciones-select"
                                                        value={r.estado}
                                                        disabled={
                                                            updatingId === r.id
                                                        }
                                                        onChange={(e) =>
                                                            actualizarEstado(
                                                                r.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="pendiente">
                                                            Pendiente
                                                        </option>
                                                        <option value="en_proceso">
                                                            En proceso
                                                        </option>
                                                        <option value="resuelto">
                                                            Resuelto
                                                        </option>
                                                        <option value="descartado">
                                                            Descartado
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

                    {lastPage > 1 && (
                        <div
                            style={{
                                marginTop: "1rem",
                                display: "flex",
                                justifyContent: "center",
                                gap: "1rem",
                                alignItems: "center",
                            }}
                        >
                            <button
                                disabled={page === 1}
                                onClick={irPaginaAnterior}
                                className="btn-white"
                            >
                                ← Anterior
                            </button>

                            <span className="small-text">
                                Página {page} de {lastPage}
                            </span>

                            <button
                                disabled={page === lastPage}
                                onClick={irPaginaSiguiente}
                                className="btn-white"
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </section>

                {/* ================== RESUMEN DE TÉCNICOS ================== */}
                <section className="card">
                    <h2>Resumen de técnicos</h2>
                    <p className="small-text">
                        Cantidad de reportes asignados por técnico.
                    </p>

                    {loadingTecnicos && (
                        <p className="small-text">Cargando técnicos...</p>
                    )}

                    {tecnicos.length === 0 && !loadingTecnicos && (
                        <p className="small-text">
                            Aún no hay técnicos registrados.
                        </p>
                    )}

                    {tecnicos.length > 0 && (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Total asignados</th>
                                        <th>Pendientes</th>
                                        <th>Asignados hoy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tecnicos.map((t) => (
                                        <tr key={t.id}>
                                            <td>{t.name}</td>
                                            <td className="small-text">
                                                {t.email}
                                            </td>
                                            <td>{t.total_reportes ?? 0}</td>
                                            <td>{t.pendientes_reportes ?? 0}</td>
                                            <td>{t.hoy_reportes ?? 0}</td>
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

const rootElement = document.getElementById("admin-root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<AdminApp />);
}