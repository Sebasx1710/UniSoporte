function obtenerClaseEstado(estado) {

    switch (estado) {

        case "Pendiente":
            return "estado-pendiente";

        case "Asignada":
            return "estado-asignada";

        case "En atención":
            return "estado-atencion";

        case "Resuelta":
            return "estado-resuelta";

        default:
            return "";
    }
}


function obtenerClasePrioridad(
    prioridad
) {

    switch (prioridad) {

        case "Alta":
            return "prioridad-alta";

        case "Media":
            return "prioridad-media";

        case "Baja":
            return "prioridad-baja";

        default:
            return "";
    }
}


function crearBadgeEstado(estado) {

    return `
        <span class="estado-badge
        ${obtenerClaseEstado(estado)}">
            ${estado}
        </span>
    `;
}


function crearBadgePrioridad(
    prioridad
) {

    return `
        <span class="prioridad-badge
        ${obtenerClasePrioridad(prioridad)}">
            ${prioridad}
        </span>
    `;
}


function mostrarModalDetalle(
    solicitud
) {

    const modal =
        document.getElementById(
            "modalDetalle"
        );

    const contenido =
        document.getElementById(
            "contenidoModal"
        );


    if (!modal || !contenido) {
        return;
    }


    contenido.innerHTML = `

        <div class="detalle-grid">

            <div>
                <span>Código</span>
                <strong>
                    ${solicitud.codigo}
                </strong>
            </div>

            <div>
                <span>Estado</span>
                ${crearBadgeEstado(
                    solicitud.estado
                )}
            </div>

            <div>
                <span>Categoría</span>
                <strong>
                    ${solicitud.categoria}
                </strong>
            </div>

            <div>
                <span>Prioridad</span>
                ${crearBadgePrioridad(
                    solicitud.prioridad
                )}
            </div>

            <div>
                <span>Técnico</span>
                <strong>
                    ${solicitud.tecnico ||
                    "Sin asignar"}
                </strong>
            </div>

            <div>
                <span>Fecha</span>
                <strong>
                    ${solicitud.fechaRegistro}
                </strong>
            </div>

        </div>


        <div class="detalle-bloque">

            <span>Título</span>

            <p>
                ${solicitud.titulo}
            </p>

        </div>


        <div class="detalle-bloque">

            <span>Descripción</span>

            <p>
                ${solicitud.descripcion}
            </p>

        </div>


        <div class="detalle-bloque">

            <span>Observación técnica</span>

            <p>
                ${solicitud.observacion ||
                "Sin observaciones registradas."}
            </p>

        </div>


        <div class="detalle-bloque">

            <span>Solución</span>

            <p>
                ${solicitud.solucion ||
                "La solicitud aún no cuenta con una solución."}
            </p>

        </div>
    `;


    modal.classList.add(
        "show"
    );
}


function cerrarModalDetalle() {

    const modal =
        document.getElementById(
            "modalDetalle"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );
    }
}