/*
=========================================
UNISOPORTE
CONTROLADOR DE AUTENTICACIÓN
=========================================
*/


/*
=========================================
CÓDIGO DE AUTORIZACIÓN ADMINISTRATIVA

IMPORTANTE:

Este código sirve únicamente para simular
una verificación administrativa dentro
del prototipo.

En un sistema real esta validación debería
realizarse desde un servidor/backend.
=========================================
*/

const CODIGO_AUTORIZACION_ADMIN =
    "UCV-ADMIN-2026";


/*
=========================================
INICIAR SESIÓN
=========================================
*/

function iniciarSesion(
    usuarioIngresado,
    passwordIngresado
) {

    const usuarios =
        obtenerUsuarios();


    const nombreUsuario =
        usuarioIngresado
            .toLowerCase()
            .trim();


    const usuarioEncontrado =
        usuarios.find(
            usuario =>

                usuario.usuario
                    .toLowerCase() ===
                    nombreUsuario

                &&

                usuario.password ===
                    passwordIngresado
        );


    if (!usuarioEncontrado) {

        return {

            exito: false,

            mensaje:
                "Usuario o contraseña incorrectos."

        };

    }


    if (
        usuarioEncontrado.estado ===
        "INACTIVO"
    ) {

        return {

            exito: false,

            mensaje:
                "Esta cuenta se encuentra inactiva. Comuníquese con el administrador."

        };

    }


    guardarSesion(
        usuarioEncontrado
    );


    redirigirSegunRol(
        usuarioEncontrado.rol
    );


    return {

        exito: true,

        mensaje:
            "Inicio de sesión correcto."

    };

}


/*
=========================================
REDIRECCIÓN SEGÚN ROL
=========================================
*/

function redirigirSegunRol(
    rol
) {

    switch (rol) {

        case "PROFESOR":

            window.location.href =
                "pages/profesor.html";

            break;


        case "TECNICO":

            window.location.href =
                "pages/tecnico.html";

            break;


        case "ADMIN":

            window.location.href =
                "pages/admin.html";

            break;


        default:

            /*
            Si por algún motivo existe un
            usuario sin un rol válido,
            eliminamos la sesión.
            */

            if (
                typeof cerrarSesion ===
                "function"
            ) {

                cerrarSesion();

            }

            alert(
                "El usuario no tiene un rol válido."
            );

    }

}


/*
=========================================
VALIDACIONES
=========================================
*/


/*
Ahora UniSoporte permite cualquier
dirección de correo con formato válido.

Ejemplos:

usuario@gmail.com
usuario@hotmail.com
usuario@outlook.com
usuario@ucvvirtual.edu.pe
usuario@universidad.edu.pe
*/

function validarCorreo(
    correo
) {

    if (!correo) {

        return false;

    }


    const correoNormalizado =
        correo
            .toLowerCase()
            .trim();


    const formatoCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return formatoCorreo.test(
        correoNormalizado
    );

}


/*
=========================================
COMPROBAR USUARIO REPETIDO
=========================================
*/

function usuarioExiste(
    nombreUsuario
) {

    const usuarios =
        obtenerUsuarios();


    return usuarios.some(
        usuario =>

            usuario.usuario
                .toLowerCase() ===

            nombreUsuario
                .toLowerCase()
                .trim()
    );

}


/*
=========================================
COMPROBAR CORREO REPETIDO
=========================================
*/

function correoExiste(
    correo
) {

    const usuarios =
        obtenerUsuarios();


    return usuarios.some(
        usuario =>

            usuario.correo &&

            usuario.correo
                .toLowerCase() ===

            correo
                .toLowerCase()
                .trim()
    );

}


/*
=========================================
GENERAR ID DE USUARIO
=========================================
*/

function generarIdUsuario() {

    const usuarios =
        obtenerUsuarios();


    if (
        usuarios.length === 0
    ) {

        return 1;

    }


    const ids =
        usuarios.map(
            usuario =>
                Number(usuario.id) || 0
        );


    return Math.max(...ids) + 1;

}


/*
=========================================
VALIDAR DATOS DE REGISTRO
=========================================
*/

function validarDatosRegistro(
    datos
) {

    /*
    NOMBRE
    */

    if (
        !datos.nombre ||
        datos.nombre.trim().length < 5
    ) {

        return {

            valido: false,

            mensaje:
                "Ingrese sus nombres y apellidos completos."

        };

    }


    /*
    CORREO
    */

    if (
        !datos.correo
    ) {

        return {

            valido: false,

            mensaje:
                "Ingrese su correo electrónico."

        };

    }


    /*
    VALIDAR FORMATO DEL CORREO

    Ya no se exige @ucvvirtual.edu.pe.
    */

    if (
        !validarCorreo(
            datos.correo
        )
    ) {

        return {

            valido: false,

            mensaje:
                "Ingrese un correo electrónico válido."

        };

    }


    /*
    CORREO YA REGISTRADO
    */

    if (
        correoExiste(
            datos.correo
        )
    ) {

        return {

            valido: false,

            mensaje:
                "El correo electrónico ya se encuentra registrado."

        };

    }


    /*
    USUARIO
    */

    if (
        !datos.usuario ||
        datos.usuario.trim().length < 4
    ) {

        return {

            valido: false,

            mensaje:
                "El usuario debe tener al menos 4 caracteres."

        };

    }


    /*
    EL USUARIO NO PUEDE TENER ESPACIOS
    */

    if (
        /\s/.test(
            datos.usuario
        )
    ) {

        return {

            valido: false,

            mensaje:
                "El nombre de usuario no puede contener espacios."

        };

    }


    /*
    USUARIO REPETIDO
    */

    if (
        usuarioExiste(
            datos.usuario
        )
    ) {

        return {

            valido: false,

            mensaje:
                "El nombre de usuario ya está registrado."

        };

    }


    /*
    CONTRASEÑA
    */

    if (
        !datos.password ||
        datos.password.length < 6
    ) {

        return {

            valido: false,

            mensaje:
                "La contraseña debe tener al menos 6 caracteres."

        };

    }


    /*
    CONFIRMAR CONTRASEÑA
    */

    if (
        datos.password !==
        datos.confirmarPassword
    ) {

        return {

            valido: false,

            mensaje:
                "Las contraseñas no coinciden."

        };

    }


    return {

        valido: true,

        mensaje:
            "Datos correctos."

    };

}


/*
=========================================
REGISTRO PÚBLICO

IMPORTANTE:

Una persona que se registra desde
la pantalla pública SIEMPRE será PROFESOR.

Esta función será ejecutada después
de verificar correctamente el código
enviado al correo electrónico.
=========================================
*/

function registrarProfesorPublico(
    datos
) {

    const validacion =
        validarDatosRegistro(
            datos
        );


    if (
        !validacion.valido
    ) {

        return {

            exito: false,

            mensaje:
                validacion.mensaje

        };

    }


    const usuarios =
        obtenerUsuarios();


    const nuevoUsuario =
        new Usuario(

            generarIdUsuario(),

            datos.nombre.trim(),

            datos.correo
                .toLowerCase()
                .trim(),

            datos.usuario
                .toLowerCase()
                .trim(),

            datos.password,

            "PROFESOR",

            "ACTIVO"

        );


    usuarios.push(
        nuevoUsuario
    );


    guardarUsuarios(
        usuarios
    );


    return {

        exito: true,

        mensaje:
            "Cuenta de profesor creada correctamente. Ya puede iniciar sesión.",

        usuario:
            nuevoUsuario

    };

}


/*
=========================================
REGISTRO ADMINISTRATIVO
=========================================
*/

function crearUsuarioDesdeAdmin(
    datos,
    codigoAutorizacion = ""
) {

    const usuarioActual =
        obtenerUsuarioActual();


    /*
    DEBE EXISTIR UNA SESIÓN
    */

    if (
        !usuarioActual
    ) {

        return {

            exito: false,

            mensaje:
                "No existe una sesión activa."

        };

    }


    /*
    CONDICIONAL DE SEGURIDAD

    Solo un administrador puede
    crear usuarios desde este método.
    */

    if (
        usuarioActual.rol !==
        "ADMIN"
    ) {

        return {

            exito: false,

            mensaje:
                "No tiene autorización para crear usuarios."

        };

    }


    /*
    ROLES PERMITIDOS
    */

    const rolesPermitidos = [

        "PROFESOR",
        "TECNICO",
        "ADMIN"

    ];


    if (
        !rolesPermitidos.includes(
            datos.rol
        )
    ) {

        return {

            exito: false,

            mensaje:
                "El rol seleccionado no es válido."

        };

    }


    /*
    VALIDAR DATOS
    */

    const validacion =
        validarDatosRegistro(
            datos
        );


    if (
        !validacion.valido
    ) {

        return {

            exito: false,

            mensaje:
                validacion.mensaje

        };

    }


    /*
    SEGUNDA VERIFICACIÓN

    Para crear otro ADMINISTRADOR
    necesitamos un código adicional.
    */

    if (
        datos.rol === "ADMIN"
    ) {

        if (
            codigoAutorizacion !==
            CODIGO_AUTORIZACION_ADMIN
        ) {

            return {

                exito: false,

                mensaje:
                    "Código de autorización administrativa incorrecto."

            };

        }

    }


    /*
    CREAR USUARIO
    */

    const usuarios =
        obtenerUsuarios();


    const nuevoUsuario =
        new Usuario(

            generarIdUsuario(),

            datos.nombre.trim(),

            datos.correo
                .toLowerCase()
                .trim(),

            datos.usuario
                .toLowerCase()
                .trim(),

            datos.password,

            datos.rol,

            "ACTIVO"

        );


    usuarios.push(
        nuevoUsuario
    );


    guardarUsuarios(
        usuarios
    );


    return {

        exito: true,

        mensaje:
            `${obtenerNombreRol(datos.rol)} creado correctamente.`,

        usuario:
            nuevoUsuario

    };

}


/*
=========================================
OBTENER NOMBRE DEL ROL
=========================================
*/

function obtenerNombreRol(
    rol
) {

    switch (rol) {

        case "PROFESOR":

            return "Profesor";


        case "TECNICO":

            return "Técnico";


        case "ADMIN":

            return "Administrador";


        default:

            return "Usuario";

    }

}