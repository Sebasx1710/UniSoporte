const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// ========================================
// CONFIGURACIÓN GENERAL
// ========================================

app.use(express.json());


// ========================================
// CONFIGURACIÓN DE GMAIL + NODEMAILER
// ========================================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }

});


// ========================================
// ALMACENAMIENTO TEMPORAL DE CÓDIGOS
// ========================================

const codigosVerificacion = new Map();


// ========================================
// RUTA PRINCIPAL
// ========================================

app.get("/", (req, res) => {

    res.json({

        sistema: "UniSoporte",

        backend: "activo",

        servicioCorreo:
            "Gmail + Nodemailer",

        mensaje:
            "Servidor de verificación funcionando correctamente."

    });

});


// ========================================
// COMPROBAR CONEXIÓN CON GMAIL
// ========================================

app.get(
    "/api/correo/estado",
    async (req, res) => {

        try {

            await transporter.verify();

            return res.json({

                exito: true,

                mensaje:
                    "Conexión con Gmail establecida correctamente."

            });

        } catch (error) {

            console.error(
                "ERROR DE CONEXIÓN CON GMAIL:",
                error
            );

            return res.status(500).json({

                exito: false,

                mensaje:
                    "No se pudo conectar con Gmail. Revisa las credenciales del archivo .env."

            });

        }

    }
);


// ========================================
// GENERAR CÓDIGO SEGURO DE 6 DÍGITOS
// ========================================

function generarCodigo() {

    return crypto
        .randomInt(
            100000,
            1000000
        )
        .toString();

}


// ========================================
// VALIDAR FORMATO DEL CORREO
// ========================================

function correoValido(correo) {

    const formatoCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return formatoCorreo.test(correo);

}


// ========================================
// OCULTAR PARTE DEL CORREO
// ========================================

function ocultarCorreo(correo) {

    const partes =
        correo.split("@");

    if (partes.length !== 2) {

        return correo;

    }

    const nombre =
        partes[0];

    const visible =
        nombre.substring(
            0,
            Math.min(
                3,
                nombre.length
            )
        );

    return `${visible}***@${partes[1]}`;

}


// ========================================
// ENVIAR CÓDIGO DE VERIFICACIÓN
// ========================================

app.post(
    "/api/verificacion/enviar",
    async (req, res) => {

        try {

            const {
                correo,
                nombre
            } = req.body;


            // =================================
            // VALIDAR DATOS
            // =================================

            if (
                !correo ||
                !nombre
            ) {

                return res
                    .status(400)
                    .json({

                        exito: false,

                        mensaje:
                            "El nombre y el correo son obligatorios."

                    });

            }


            const correoNormalizado =
                correo
                    .toLowerCase()
                    .trim();


            const nombreNormalizado =
                nombre
                    .toString()
                    .trim();


            // =================================
            // VALIDAR NOMBRE
            // =================================

            if (
                nombreNormalizado.length < 2
            ) {

                return res
                    .status(400)
                    .json({

                        exito: false,

                        mensaje:
                            "Ingrese un nombre válido."

                    });

            }


            // =================================
            // VALIDAR FORMATO DEL CORREO
            // =================================

            if (
                !correoValido(
                    correoNormalizado
                )
            ) {

                return res
                    .status(400)
                    .json({

                        exito: false,

                        mensaje:
                            "Ingrese un correo electrónico válido."

                    });

            }


            // =================================
            // EVITAR REENVÍOS MUY RÁPIDOS
            // =================================

            const codigoAnterior =
                codigosVerificacion.get(
                    correoNormalizado
                );


            if (
                codigoAnterior &&
                codigoAnterior.ultimoEnvio
            ) {

                const tiempoTranscurrido =
                    Date.now() -
                    codigoAnterior.ultimoEnvio;


                const tiempoEspera =
                    60 * 1000;


                if (
                    tiempoTranscurrido <
                    tiempoEspera
                ) {

                    const segundosRestantes =
                        Math.ceil(
                            (
                                tiempoEspera -
                                tiempoTranscurrido
                            ) / 1000
                        );


                    return res
                        .status(429)
                        .json({

                            exito: false,

                            mensaje:
                                `Espera ${segundosRestantes} segundos antes de solicitar otro código.`

                        });

                }

            }


            // =================================
            // GENERAR NUEVO CÓDIGO
            // =================================

            const codigo =
                generarCodigo();


            // Código válido durante 10 minutos

            const expiracion =
                Date.now() +
                (
                    10 *
                    60 *
                    1000
                );


            // =================================
            // CONTENIDO DEL CORREO
            // =================================

            const opcionesCorreo = {

                from: {

                    name:
                        "UniSoporte",

                    address:
                        process.env.EMAIL_USER

                },


                to:
                    correoNormalizado,


                subject:
                    "Código de verificación - UniSoporte",


                html: `

                <div style="
                    margin:0;
                    padding:40px 15px;
                    background:#f3f6f9;
                    font-family:Arial, Helvetica, sans-serif;
                ">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 4px 15px rgba(0,0,0,0.08);
                    ">


                        <div style="
                            background:#173f67;
                            color:#ffffff;
                            padding:28px 32px;
                        ">

                            <h1 style="
                                margin:0;
                                font-size:28px;
                            ">
                                UniSoporte
                            </h1>

                            <p style="
                                margin:8px 0 0;
                                font-size:14px;
                                opacity:0.9;
                            ">
                                Sistema de Gestión de Solicitudes de Soporte IT
                            </p>

                        </div>


                        <div style="
                            padding:32px;
                            color:#263238;
                        ">

                            <h2 style="
                                margin-top:0;
                                color:#173f67;
                            ">
                                Verificación de correo
                            </h2>


                            <p>
                                Hola <strong>${nombreNormalizado}</strong>,
                            </p>


                            <p>
                                Hemos recibido una solicitud
                                para registrar una cuenta de
                                profesor en UniSoporte.
                            </p>


                            <p>
                                Para continuar con tu registro,
                                utiliza el siguiente código:
                            </p>


                            <div style="
                                text-align:center;
                                margin:35px 0;
                            ">

                                <span style="
                                    display:inline-block;
                                    background:#eef4f8;
                                    color:#173f67;
                                    font-size:34px;
                                    font-weight:bold;
                                    letter-spacing:8px;
                                    padding:20px 28px;
                                    border-radius:10px;
                                ">

                                    ${codigo}

                                </span>

                            </div>


                            <p>
                                Este código tendrá una vigencia de
                                <strong>10 minutos</strong>.
                            </p>


                            <p>
                                Por seguridad, no compartas este
                                código con ninguna otra persona.
                            </p>


                            <p>
                                Si no solicitaste crear una cuenta
                                en UniSoporte, puedes ignorar este
                                mensaje.
                            </p>


                            <hr style="
                                border:none;
                                border-top:1px solid #dddddd;
                                margin:28px 0;
                            ">


                            <p style="
                                margin-bottom:0;
                                font-size:12px;
                                color:#777777;
                            ">

                                Este es un mensaje automático
                                generado por UniSoporte.

                                <br><br>

                                Plataforma universitaria de
                                gestión de solicitudes de soporte IT.

                            </p>

                        </div>

                    </div>

                </div>

                `

            };


            // =================================
            // ENVIAR CORREO REAL CON GMAIL
            // =================================

            const resultado =
                await transporter.sendMail(
                    opcionesCorreo
                );


            // =================================
            // GUARDAR CÓDIGO TEMPORAL
            // =================================
            // Solo se guarda después de que
            // Gmail acepte el envío.

            codigosVerificacion.set(
                correoNormalizado,
                {

                    codigo:
                        codigo,

                    expiracion:
                        expiracion,

                    intentos:
                        0,

                    ultimoEnvio:
                        Date.now()

                }
            );


            console.log(
                "======================================"
            );

            console.log(
                "Código de verificación enviado."
            );

            console.log(
                `Destino: ${correoNormalizado}`
            );

            console.log(
                `Message ID: ${resultado.messageId}`
            );

            console.log(
                "======================================"
            );


            // =================================
            // RESPUESTA AL FRONTEND
            // =================================

            return res.json({

                exito:
                    true,

                mensaje:
                    "Código de verificación enviado correctamente.",

                correo:
                    ocultarCorreo(
                        correoNormalizado
                    )

            });


        } catch (error) {

            console.error(
                "======================================"
            );

            console.error(
                "ERROR AL ENVIAR EL CORREO"
            );

            console.error(
                error
            );

            console.error(
                "======================================"
            );


            return res
                .status(500)
                .json({

                    exito:
                        false,

                    mensaje:
                        "No se pudo enviar el correo de verificación."

                });

        }

    }
);


// ========================================
// VERIFICAR CÓDIGO
// ========================================

app.post(
    "/api/verificacion/verificar",
    (req, res) => {

        const {
            correo,
            codigo
        } = req.body;


        // =================================
        // VALIDAR CAMPOS
        // =================================

        if (
            !correo ||
            !codigo
        ) {

            return res
                .status(400)
                .json({

                    exito:
                        false,

                    mensaje:
                        "Ingrese el código de verificación."

                });

        }


        const correoNormalizado =
            correo
                .toLowerCase()
                .trim();


        const registro =
            codigosVerificacion.get(
                correoNormalizado
            );


        // =================================
        // VERIFICACIÓN NO EXISTE
        // =================================

        if (!registro) {

            return res
                .status(400)
                .json({

                    exito:
                        false,

                    mensaje:
                        "No existe una verificación pendiente para este correo."

                });

        }


        // =================================
        // VERIFICAR EXPIRACIÓN
        // =================================

        if (
            Date.now() >
            registro.expiracion
        ) {

            codigosVerificacion.delete(
                correoNormalizado
            );


            return res
                .status(400)
                .json({

                    exito:
                        false,

                    mensaje:
                        "El código ha expirado. Solicite uno nuevo."

                });

        }


        // =================================
        // CONTROL DE INTENTOS
        // =================================

        if (
            registro.intentos >= 5
        ) {

            codigosVerificacion.delete(
                correoNormalizado
            );


            return res
                .status(429)
                .json({

                    exito:
                        false,

                    mensaje:
                        "Se superó el número máximo de intentos. Solicite un nuevo código."

                });

        }


        // =================================
        // CÓDIGO INGRESADO
        // =================================

        const codigoIngresado =
            codigo
                .toString()
                .trim();


        // El código siempre debe tener
        // exactamente 6 números.

        if (
            !/^\d{6}$/.test(
                codigoIngresado
            )
        ) {

            return res
                .status(400)
                .json({

                    exito:
                        false,

                    mensaje:
                        "El código debe contener 6 números."

                });

        }


        // =================================
        // CÓDIGO INCORRECTO
        // =================================

        if (
            registro.codigo !==
            codigoIngresado
        ) {

            registro.intentos++;


            const intentosRestantes =
                5 -
                registro.intentos;


            // Si llegó al quinto intento,
            // eliminamos la verificación.

            if (
                registro.intentos >= 5
            ) {

                codigosVerificacion.delete(
                    correoNormalizado
                );


                return res
                    .status(429)
                    .json({

                        exito:
                            false,

                        mensaje:
                            "Código incorrecto. Superaste el máximo de intentos. Solicita un código nuevo."

                    });

            }


            return res
                .status(400)
                .json({

                    exito:
                        false,

                    mensaje:
                        `Código incorrecto. Te quedan ${intentosRestantes} intento(s).`

                });

        }


        // =================================
        // CÓDIGO CORRECTO
        // =================================

        codigosVerificacion.delete(
            correoNormalizado
        );


        console.log(
            `Correo verificado correctamente: ${correoNormalizado}`
        );


        return res.json({

            exito:
                true,

            verificado:
                true,

            mensaje:
                "Correo electrónico verificado correctamente."

        });

    }
);


// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(
    PORT,
    async () => {

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "        UNISOPORTE BACKEND"
        );

        console.log(
            "======================================"
        );

        console.log(
            `Servidor: http://localhost:${PORT}`
        );

        console.log(
            "Correo: Gmail + Nodemailer"
        );

        console.log(
            "======================================"
        );


        // =================================
        // PROBAR CONEXIÓN CON GMAIL
        // =================================

        try {

            await transporter.verify();


            console.log(
                "✓ Gmail conectado correctamente."
            );


        } catch (error) {

            console.log(
                "✗ No se pudo conectar con Gmail."
            );

            console.log(
                "Revisa EMAIL_USER y EMAIL_APP_PASSWORD en .env."
            );


            console.error(
                error.message
            );

        }


        console.log(
            "======================================"
        );

    }
);