const STORAGE_USUARIOS =
    "unisoporte_usuarios";

const STORAGE_SOLICITUDES =
    "unisoporte_solicitudes";


function obtenerUsuarios() {

    try {

        const datos =
            localStorage.getItem(
                STORAGE_USUARIOS
            );


        return datos
            ? JSON.parse(datos)
            : [];

    } catch (error) {

        console.error(
            "Error al obtener usuarios:",
            error
        );

        return [];
    }
}


function guardarUsuarios(
    usuarios
) {

    localStorage.setItem(
        STORAGE_USUARIOS,
        JSON.stringify(
            usuarios
        )
    );
}


function obtenerSolicitudes() {

    try {

        const datos =
            localStorage.getItem(
                STORAGE_SOLICITUDES
            );


        return datos
            ? JSON.parse(datos)
            : [];

    } catch (error) {

        console.error(
            "Error al obtener solicitudes:",
            error
        );

        return [];
    }
}


function guardarSolicitudes(
    solicitudes
) {

    localStorage.setItem(
        STORAGE_SOLICITUDES,
        JSON.stringify(
            solicitudes
        )
    );
}


function buscarSolicitud(
    codigo
) {

    return obtenerSolicitudes()
        .find(
            solicitud =>
                solicitud.codigo ===
                codigo
        ) || null;
}


function actualizarSolicitud(
    solicitudActualizada
) {

    const solicitudes =
        obtenerSolicitudes();


    const indice =
        solicitudes.findIndex(
            solicitud =>
                solicitud.codigo ===
                solicitudActualizada.codigo
        );


    if (indice === -1) {

        return false;
    }


    solicitudActualizada
        .fechaActualizacion =
            new Date()
                .toLocaleString(
                    "es-PE"
                );


    solicitudes[indice] =
        solicitudActualizada;


    guardarSolicitudes(
        solicitudes
    );


    return true;
}