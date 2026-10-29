function inicializarDatos() {

    const usuarios =
        obtenerUsuarios();


    if (usuarios.length === 0) {

        const usuariosIniciales = [

            new Usuario(
                1,
                "Profesor Demo",
                "profesor@ucvvirtual.edu.pe",
                "profesor",
                "1234",
                "PROFESOR"
            ),

            new Usuario(
                2,
                "Carlos Mendoza",
                "soporte@ucvvirtual.edu.pe",
                "tecnico",
                "1234",
                "TECNICO"
            ),

            new Usuario(
                3,
                "Administrador UniSoporte",
                "administrador@ucvvirtual.edu.pe",
                "admin",
                "1234",
                "ADMIN"
            )

        ];


        guardarUsuarios(
            usuariosIniciales
        );


        console.log(
            "Usuarios iniciales creados."
        );
    }
}


inicializarDatos();