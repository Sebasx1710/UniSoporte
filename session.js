const SESSION_KEY = "unisoporte_usuario_actual";

function guardarSesion(usuario) {

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(usuario)
    );
}

function obtenerUsuarioActual() {

    const datos =
        sessionStorage.getItem(SESSION_KEY);

    if (!datos) {
        return null;
    }

    return JSON.parse(datos);
}

function cerrarSesion() {

    sessionStorage.removeItem(SESSION_KEY);

    window.location.href = "../index.html";
}

function validarSesion() {

    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        window.location.href = "../index.html";
        return null;
    }

    return usuario;
}

function validarRol(rolPermitido) {

    const usuario = validarSesion();

    if (!usuario) {
        return;
    }

    if (usuario.rol !== rolPermitido) {

        alert(
            "No tiene permisos para acceder a esta sección."
        );

        window.location.href = "../index.html";
    }
}