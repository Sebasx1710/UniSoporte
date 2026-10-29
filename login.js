document.addEventListener(
    "DOMContentLoaded",
    function () {

        // =========================================
        // VISTAS
        // =========================================

        const vistaLogin =
            document.getElementById("vistaLogin");

        const vistaRegistro =
            document.getElementById("vistaRegistro");

        const vistaVerificacion =
            document.getElementById("vistaVerificacion");


        // =========================================
        // FORMULARIOS
        // =========================================

        const formLogin =
            document.getElementById("formLogin");

        const formRegistro =
            document.getElementById("formRegistro");

        const formVerificacion =
            document.getElementById("formVerificacion");


        // =========================================
        // DATOS TEMPORALES DEL REGISTRO
        // =========================================
        // Aquí guardamos temporalmente los datos.
        // La cuenta todavía NO se crea.

        let datosRegistroPendiente = null;

        let correoPendiente = "";

        let reenviandoCodigo = false;


        // =========================================
        // CAMBIAR ENTRE VISTAS
        // =========================================

        function mostrarVista(vista) {

            vistaLogin.classList.remove("active");
            vistaRegistro.classList.remove("active");
            vistaVerificacion.classList.remove("active");

            vista.classList.add("active");

        }


        document.getElementById(
            "btnIrRegistro"
        ).addEventListener(
            "click",
            function () {

                mostrarVista(vistaRegistro);

            }
        );


        document.getElementById(
            "btnVolverLogin"
        ).addEventListener(
            "click",
            function () {

                limpiarRegistro();

                mostrarVista(vistaLogin);

            }
        );


        // =========================================
        // CAMBIAR CORREO O DATOS
        // =========================================

        document.getElementById(
            "btnCambiarCorreo"
        ).addEventListener(
            "click",
            function () {

                limpiarMensajeVerificacion();

                document.getElementById(
                    "codigoVerificacion"
                ).value = "";

                mostrarVista(vistaRegistro);

            }
        );


        // =========================================
        // MOSTRAR CONTRASEÑA LOGIN
        // =========================================

        document.getElementById(
            "btnMostrarLogin"
        ).addEventListener(
            "click",
            function () {

                alternarPassword(
                    "password",
                    this
                );

            }
        );


        // =========================================
        // MOSTRAR CONTRASEÑA REGISTRO
        // =========================================

        document.getElementById(
            "btnMostrarRegistro"
        ).addEventListener(
            "click",
            function () {

                alternarPassword(
                    "registroPassword",
                    this
                );

            }
        );


        // =========================================
        // INICIAR SESIÓN
        // =========================================

        formLogin.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const usuario =
                    document.getElementById(
                        "usuario"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "password"
                    ).value;


                const mensaje =
                    document.getElementById(
                        "mensajeError"
                    );


                mensaje.textContent = "";


                if (
                    usuario === "" ||
                    password === ""
                ) {

                    mensaje.textContent =
                        "Complete todos los campos.";

                    return;

                }


                const resultado =
                    iniciarSesion(
                        usuario,
                        password
                    );


                if (!resultado.exito) {

                    mensaje.textContent =
                        resultado.mensaje;

                }

            }
        );


        // =========================================
        // PASO 1
        // REGISTRO DEL PROFESOR
        // =========================================

        formRegistro.addEventListener(
            "submit",
            async function (evento) {

                evento.preventDefault();


                const mensaje =
                    document.getElementById(
                        "mensajeRegistro"
                    );


                const boton =
                    document.getElementById(
                        "btnCrearCuenta"
                    );


                mensaje.textContent = "";

                mensaje.className =
                    "form-message";


                // =================================
                // CAPTURAR DATOS
                // =================================

                const datos = {

                    nombre:
                        document.getElementById(
                            "registroNombre"
                        ).value.trim(),

                    correo:
                        document.getElementById(
                            "registroCorreo"
                        ).value.trim(),

                    usuario:
                        document.getElementById(
                            "registroUsuario"
                        ).value.trim(),

                    password:
                        document.getElementById(
                            "registroPassword"
                        ).value,

                    confirmarPassword:
                        document.getElementById(
                            "registroConfirmar"
                        ).value

                };


                // =================================
                // VALIDAR DATOS LOCALMENTE
                // =================================
                // IMPORTANTE:
                // Todavía NO creamos la cuenta.

                const validacion =
                    validarDatosRegistro(datos);


                if (!validacion.valido) {

                    mensaje.textContent =
                        validacion.mensaje;

                    mensaje.classList.add(
                        "error"
                    );

                    return;

                }


                // =================================
                // DESACTIVAR BOTÓN
                // =================================

                boton.disabled = true;

                boton.textContent =
                    "Enviando código...";


                try {

                    // =================================
                    // SOLICITAR CÓDIGO AL BACKEND
                    // =================================

                    const respuesta =
                        await fetch(
                            "http://localhost:3000/api/verificacion/enviar",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        correo:
                                            datos.correo,

                                        nombre:
                                            datos.nombre

                                    })

                            }
                        );


                    const resultado =
                        await respuesta.json();


                    if (
                        !respuesta.ok ||
                        !resultado.exito
                    ) {

                        mensaje.textContent =
                            resultado.mensaje ||
                            "No se pudo enviar el código.";

                        mensaje.classList.add(
                            "error"
                        );

                        return;

                    }


                    // =================================
                    // GUARDAR DATOS TEMPORALES
                    // =================================

                    datosRegistroPendiente =
                        datos;


                    correoPendiente =
                        datos.correo
                            .toLowerCase()
                            .trim();


                    // =================================
                    // MOSTRAR CORREO OCULTO
                    // =================================

                    document.getElementById(
                        "correoVerificacion"
                    ).textContent =
                        resultado.correo ||
                        correoPendiente;


                    // =================================
                    // LIMPIAR CÓDIGO ANTERIOR
                    // =================================

                    document.getElementById(
                        "codigoVerificacion"
                    ).value = "";


                    limpiarMensajeVerificacion();


                    // =================================
                    // MOSTRAR VERIFICACIÓN
                    // =================================

                    mostrarVista(
                        vistaVerificacion
                    );


                    setTimeout(
                        function () {

                            document.getElementById(
                                "codigoVerificacion"
                            ).focus();

                        },
                        100
                    );


                } catch (error) {

                    console.error(
                        "Error al conectar con el backend:",
                        error
                    );


                    mensaje.textContent =
                        "No se pudo conectar con el servidor de UniSoporte. Verifique que el backend esté ejecutándose.";

                    mensaje.classList.add(
                        "error"
                    );


                } finally {

                    boton.disabled = false;

                    boton.textContent =
                        "Continuar y verificar correo";

                }

            }
        );


        // =========================================
        // PASO 2
        // VERIFICAR CÓDIGO
        // =========================================

        formVerificacion.addEventListener(
            "submit",
            async function (evento) {

                evento.preventDefault();


                const mensaje =
                    document.getElementById(
                        "mensajeVerificacion"
                    );


                const boton =
                    document.getElementById(
                        "btnVerificarCodigo"
                    );


                mensaje.textContent = "";

                mensaje.className =
                    "form-message";


                // =================================
                // COMPROBAR REGISTRO PENDIENTE
                // =================================

                if (
                    !datosRegistroPendiente ||
                    !correoPendiente
                ) {

                    mensaje.textContent =
                        "No existe un registro pendiente. Vuelva a completar el formulario.";

                    mensaje.classList.add(
                        "error"
                    );

                    return;

                }


                // =================================
                // OBTENER CÓDIGO
                // =================================

                const codigo =
                    document.getElementById(
                        "codigoVerificacion"
                    ).value.trim();


                // =================================
                // VALIDAR 6 DÍGITOS
                // =================================

                if (
                    !/^\d{6}$/.test(codigo)
                ) {

                    mensaje.textContent =
                        "Ingrese el código de 6 dígitos.";

                    mensaje.classList.add(
                        "error"
                    );

                    return;

                }


                boton.disabled = true;

                boton.textContent =
                    "Verificando...";


                try {

                    // =================================
                    // CONSULTAR AL BACKEND
                    // =================================

                    const respuesta =
                        await fetch(
                            "http://localhost:3000/api/verificacion/verificar",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        correo:
                                            correoPendiente,

                                        codigo:
                                            codigo

                                    })

                            }
                        );


                    const resultado =
                        await respuesta.json();


                    // =================================
                    // CÓDIGO INCORRECTO
                    // =================================

                    if (
                        !respuesta.ok ||
                        !resultado.exito ||
                        !resultado.verificado
                    ) {

                        mensaje.textContent =
                            resultado.mensaje ||
                            "El código ingresado no es válido.";

                        mensaje.classList.add(
                            "error"
                        );

                        return;

                    }


                    // =================================
                    // CORREO VERIFICADO
                    // =================================
                    // AHORA SÍ CREAMOS LA CUENTA.

                    const resultadoRegistro =
                        registrarProfesorPublico(
                            datosRegistroPendiente
                        );


                    if (
                        !resultadoRegistro.exito
                    ) {

                        mensaje.textContent =
                            resultadoRegistro.mensaje;

                        mensaje.classList.add(
                            "error"
                        );

                        return;

                    }


                    // =================================
                    // CUENTA CREADA
                    // =================================

                    mensaje.textContent =
                        "Correo verificado. Cuenta creada correctamente.";

                    mensaje.classList.add(
                        "success"
                    );


                    const usuarioCreado =
                        datosRegistroPendiente.usuario;


                    // =================================
                    // LIMPIAR REGISTRO PENDIENTE
                    // =================================

                    datosRegistroPendiente =
                        null;

                    correoPendiente =
                        "";


                    formRegistro.reset();

                    formVerificacion.reset();


                    // =================================
                    // VOLVER AL LOGIN
                    // =================================

                    setTimeout(
                        function () {

                            mostrarVista(
                                vistaLogin
                            );


                            document.getElementById(
                                "usuario"
                            ).value =
                                usuarioCreado;


                            document.getElementById(
                                "password"
                            ).value =
                                "";


                            document.getElementById(
                                "password"
                            ).focus();


                            limpiarMensajeVerificacion();

                        },
                        1500
                    );


                } catch (error) {

                    console.error(
                        "Error al verificar código:",
                        error
                    );


                    mensaje.textContent =
                        "No se pudo conectar con el servidor de UniSoporte.";

                    mensaje.classList.add(
                        "error"
                    );


                } finally {

                    boton.disabled = false;

                    boton.textContent =
                        "Verificar y crear cuenta";

                }

            }
        );


        // =========================================
        // REENVIAR CÓDIGO
        // =========================================

        document.getElementById(
            "btnReenviarCodigo"
        ).addEventListener(
            "click",
            async function () {

                if (reenviandoCodigo) {

                    return;

                }


                const mensaje =
                    document.getElementById(
                        "mensajeVerificacion"
                    );


                mensaje.textContent = "";

                mensaje.className =
                    "form-message";


                if (
                    !datosRegistroPendiente ||
                    !correoPendiente
                ) {

                    mensaje.textContent =
                        "No existe un registro pendiente.";

                    mensaje.classList.add(
                        "error"
                    );

                    return;

                }


                reenviandoCodigo = true;

                this.disabled = true;

                this.textContent =
                    "Enviando...";


                try {

                    const respuesta =
                        await fetch(
                            "http://localhost:3000/api/verificacion/enviar",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        correo:
                                            correoPendiente,

                                        nombre:
                                            datosRegistroPendiente.nombre

                                    })

                            }
                        );


                    const resultado =
                        await respuesta.json();


                    if (
                        !respuesta.ok ||
                        !resultado.exito
                    ) {

                        mensaje.textContent =
                            resultado.mensaje ||
                            "No se pudo reenviar el código.";

                        mensaje.classList.add(
                            "error"
                        );

                        return;

                    }


                    document.getElementById(
                        "codigoVerificacion"
                    ).value = "";


                    mensaje.textContent =
                        "Se envió un nuevo código a tu correo.";

                    mensaje.classList.add(
                        "success"
                    );


                } catch (error) {

                    console.error(
                        "Error al reenviar código:",
                        error
                    );


                    mensaje.textContent =
                        "No se pudo conectar con el servidor.";

                    mensaje.classList.add(
                        "error"
                    );


                } finally {

                    reenviandoCodigo = false;

                    this.disabled = false;

                    this.textContent =
                        "Reenviar código";

                }

            }
        );


        // =========================================
        // SOLO PERMITIR NÚMEROS EN EL CÓDIGO
        // =========================================

        document.getElementById(
            "codigoVerificacion"
        ).addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

            }
        );


        // =========================================
        // MOSTRAR / OCULTAR CONTRASEÑA
        // =========================================

        function alternarPassword(
            idInput,
            boton
        ) {

            const input =
                document.getElementById(
                    idInput
                );


            if (
                input.type ===
                "password"
            ) {

                input.type =
                    "text";

                boton.textContent =
                    "Ocultar";

            } else {

                input.type =
                    "password";

                boton.textContent =
                    "Ver";

            }

        }


        // =========================================
        // LIMPIAR REGISTRO
        // =========================================

        function limpiarRegistro() {

            formRegistro.reset();

            formVerificacion.reset();


            datosRegistroPendiente =
                null;

            correoPendiente =
                "";


            const mensaje =
                document.getElementById(
                    "mensajeRegistro"
                );


            mensaje.textContent = "";

            mensaje.className =
                "form-message";


            limpiarMensajeVerificacion();

        }


        // =========================================
        // LIMPIAR MENSAJE VERIFICACIÓN
        // =========================================

        function limpiarMensajeVerificacion() {

            const mensaje =
                document.getElementById(
                    "mensajeVerificacion"
                );


            mensaje.textContent = "";

            mensaje.className =
                "form-message";

        }

    }
);