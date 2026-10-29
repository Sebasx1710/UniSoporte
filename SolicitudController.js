function generarCodigoSolicitud() {

    const solicitudes = obtenerSolicitudes();

    let numero = 1;

    if (solicitudes.length > 0) {

        const numeros = solicitudes.map(s => {

            const partes = s.codigo.split("-");

            return parseInt(partes[1]) || 0;
        });

        numero = Math.max(...numeros) + 1;
    }

    return "SOL-" +
        String(numero).padStart(3, "0");
}


function crearSolicitud(datos) {

    const solicitudes =
        obtenerSolicitudes();

    const solicitud =
        new Solicitud(
            generarCodigoSolicitud(),
            datos.titulo,
            datos.categoria,
            datos.descripcion,
            datos.prioridad,
            datos.profesor
        );


    solicitud.archivo =
        datos.archivo || "";

    solicitud.historial = [

        {
            fecha:
                new Date()
                    .toLocaleString("es-PE"),

            accion:
                "Solicitud registrada",

            detalle:
                "La solicitud fue registrada por el profesor."
        }

    ];


    solicitudes.push(solicitud);

    guardarSolicitudes(solicitudes);

    return solicitud;
}


function obtenerSolicitudesProfesor(usuarioProfesor) {

    return obtenerSolicitudes()
        .filter(
            solicitud =>
                solicitud.profesor ===
                usuarioProfesor
        );
}


function obtenerSolicitudesTecnico(nombreTecnico) {

    return obtenerSolicitudes()
        .filter(
            solicitud =>
                solicitud.tecnico ===
                nombreTecnico
        );
}


function obtenerTodasLasSolicitudes() {

    return obtenerSolicitudes();
}


function asignarSolicitudTecnico(
    codigo,
    tecnico
) {

    const solicitud =
        buscarSolicitud(codigo);

    if (!solicitud) {

        return {
            exito: false,
            mensaje:
                "No se encontró la solicitud."
        };
    }


    if (solicitud.estado !== "Pendiente") {

        return {
            exito: false,
            mensaje:
                "La solicitud ya fue asignada."
        };
    }


    solicitud.tecnico =
        tecnico;

    solicitud.estado =
        "Asignada";


    agregarHistorial(
        solicitud,
        "Solicitud asignada",
        `La solicitud fue asignada a ${tecnico}.`
    );


    actualizarSolicitud(solicitud);


    return {
        exito: true,
        mensaje:
            "Solicitud asignada correctamente."
    };
}


function iniciarAtencionSolicitud(codigo) {

    const solicitud =
        buscarSolicitud(codigo);


    if (!solicitud) {

        return {
            exito: false,
            mensaje:
                "Solicitud no encontrada."
        };
    }


    if (solicitud.estado !== "Asignada") {

        return {
            exito: false,
            mensaje:
                "La solicitud no se encuentra asignada."
        };
    }


    solicitud.estado =
        "En atención";


    agregarHistorial(
        solicitud,
        "Atención iniciada",
        "El técnico inició la atención de la solicitud."
    );


    actualizarSolicitud(solicitud);


    return {
        exito: true,
        mensaje:
            "Atención iniciada correctamente."
    };
}


function registrarObservacion(
    codigo,
    observacion
) {

    const solicitud =
        buscarSolicitud(codigo);


    if (!solicitud) {

        return {
            exito: false,
            mensaje:
                "Solicitud no encontrada."
        };
    }


    solicitud.observacion =
        observacion;


    agregarHistorial(
        solicitud,
        "Observación registrada",
        observacion
    );


    actualizarSolicitud(solicitud);


    return {
        exito: true,
        mensaje:
            "Observación registrada."
    };
}


function resolverSolicitud(
    codigo,
    solucion
) {

    const solicitud =
        buscarSolicitud(codigo);


    if (!solicitud) {

        return {
            exito: false,
            mensaje:
                "Solicitud no encontrada."
        };
    }


    if (solicitud.estado !==
        "En atención") {

        return {
            exito: false,
            mensaje:
                "La solicitud debe estar en atención antes de resolverse."
        };
    }


    if (!solucion.trim()) {

        return {
            exito: false,
            mensaje:
                "Debe registrar una solución."
        };
    }


    solicitud.solucion =
        solucion.trim();

    solicitud.estado =
        "Resuelta";


    agregarHistorial(
        solicitud,
        "Solicitud resuelta",
        solucion.trim()
    );


    actualizarSolicitud(solicitud);


    return {
        exito: true,
        mensaje:
            "Solicitud resuelta correctamente."
    };
}


function agregarHistorial(
    solicitud,
    accion,
    detalle
) {

    if (!Array.isArray(
        solicitud.historial
    )) {

        solicitud.historial = [];
    }


    solicitud.historial.push({

        fecha:
            new Date()
                .toLocaleString("es-PE"),

        accion:
            accion,

        detalle:
            detalle
    });
}


function contarSolicitudesPorEstado(
    solicitudes
) {

    return {

        pendientes:
            solicitudes.filter(
                s =>
                    s.estado === "Pendiente" ||
                    s.estado === "Asignada"
            ).length,

        atencion:
            solicitudes.filter(
                s =>
                    s.estado === "En atención"
            ).length,

        resueltas:
            solicitudes.filter(
                s =>
                    s.estado === "Resuelta"
            ).length,

        total:
            solicitudes.length
    };
}