class Usuario {

    constructor(
        id,
        nombre,
        correo,
        usuario,
        password,
        rol,
        estado = "ACTIVO",
        fechaRegistro = null
    ) {

        this.id = id;

        this.nombre = nombre;

        this.correo = correo;

        this.usuario = usuario;

        this.password = password;

        this.rol = rol;

        this.estado = estado;

        this.fechaRegistro =
            fechaRegistro ||
            new Date().toLocaleString("es-PE");
    }
}