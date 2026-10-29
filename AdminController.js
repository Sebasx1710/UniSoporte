function obtenerTecnicos() {

    return obtenerUsuarios()
        .filter(
            usuario =>
                usuario.rol === "TECNICO"
                &&
                usuario.estado !== "INACTIVO"
        );
}



function obtenerEstadisticasAdmin() {

    const solicitudes =
        obtenerSolicitudes();


    return {

        pendientes:
            solicitudes.filter(
                s =>
                    s.estado ===
                    "Pendiente"
            ).length,

        asignadas:
            solicitudes.filter(
                s =>
                    s.estado ===
                    "Asignada"
            ).length,

        atencion:
            solicitudes.filter(
                s =>
                    s.estado ===
                    "En atención"
            ).length,

        resueltas:
            solicitudes.filter(
                s =>
                    s.estado ===
                    "Resuelta"
            ).length,

        total:
            solicitudes.length
    };
}



function obtenerReporteCategorias() {

    const solicitudes =
        obtenerSolicitudes();


    const categorias = {

        "Tecnológico": 0,

        "Académico": 0,

        "Administrativo": 0
    };


    solicitudes.forEach(
        solicitud => {

            if (
                categorias[
                    solicitud.categoria
                ] !== undefined
            ) {

                categorias[
                    solicitud.categoria
                ]++;
            }
        }
    );


    return categorias;
}



function obtenerReportePrioridades() {

    const solicitudes =
        obtenerSolicitudes();


    return {

        alta:
            solicitudes.filter(
                s =>
                    s.prioridad ===
                    "Alta"
            ).length,

        media:
            solicitudes.filter(
                s =>
                    s.prioridad ===
                    "Media"
            ).length,

        baja:
            solicitudes.filter(
                s =>
                    s.prioridad ===
                    "Baja"
            ).length
    };
}



function cambiarEstadoUsuario(
    idUsuario
) {

    const sesion =
        obtenerUsuarioActual();


    if (
        !sesion ||
        sesion.rol !== "ADMIN"
    ) {

        return {

            exito: false,

            mensaje:
                "Operación no autorizada."
        };
    }


    if (
        Number(sesion.id) ===
        Number(idUsuario)
    ) {

        return {

            exito: false,

            mensaje:
                "No puede desactivar su propia cuenta mientras tiene una sesión activa."
        };
    }


    const usuarios =
        obtenerUsuarios();


    const usuario =
        usuarios.find(
            u =>
                Number(u.id) ===
                Number(idUsuario)
        );


    if (!usuario) {

        return {

            exito: false,

            mensaje:
                "Usuario no encontrado."
        };
    }


    usuario.estado =
        usuario.estado === "INACTIVO"
            ? "ACTIVO"
            : "INACTIVO";


    guardarUsuarios(
        usuarios
    );


    return {

        exito: true,

        mensaje:
            `Usuario ${usuario.estado.toLowerCase()} correctamente.`
    };
}