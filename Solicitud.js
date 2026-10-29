class Solicitud {

    constructor(
        codigo,
        titulo,
        categoria,
        descripcion,
        prioridad,
        profesor
    ) {

        this.codigo =
            codigo;

        this.titulo =
            titulo;

        this.categoria =
            categoria;

        this.descripcion =
            descripcion;

        this.prioridad =
            prioridad;


        this.estado =
            "Pendiente";


        this.profesor =
            profesor;

        this.tecnico =
            "";


        this.archivo =
            "";

        this.observacion =
            "";

        this.solucion =
            "";


        this.fechaRegistro =
            new Date()
                .toLocaleString(
                    "es-PE"
                );


        this.fechaActualizacion =
            this.fechaRegistro;


        this.historial =
            [];
    }
}