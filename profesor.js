document.addEventListener(
    "DOMContentLoaded",
    function () {

        validarRol("PROFESOR");


        const usuario =
            obtenerUsuarioActual();


        if (!usuario) {
            return;
        }


        cargarDatosUsuario();

        configurarNavegacion();

        configurarFormulario();

        configurarModal();

        actualizarPanelProfesor();


        function cargarDatosUsuario() {

            document.getElementById(
                "nombreUsuario"
            ).textContent =
                usuario.nombre;


            document.getElementById(
                "nombreUsuarioSidebar"
            ).textContent =
                usuario.nombre;


            document.getElementById(
                "saludoProfesor"
            ).textContent =
                `Bienvenido, ${usuario.nombre}`;
        }


        function configurarNavegacion() {

            const botones =
                document.querySelectorAll(
                    ".menu-item"
                );


            botones.forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        function () {

                            mostrarSeccion(
                                this.dataset.section
                            );

                            botones.forEach(
                                b =>
                                    b.classList.remove(
                                        "active"
                                    )
                            );

                            this.classList.add(
                                "active"
                            );
                        }
                    );

                }
            );


            document.getElementById(
                "btnNuevaRapida"
            ).addEventListener(
                "click",
                () =>
                    mostrarSeccion("nueva")
            );


            document.getElementById(
                "btnCancelarSolicitud"
            ).addEventListener(
                "click",
                function () {

                    document.getElementById(
                        "formSolicitud"
                    ).reset();

                    mostrarSeccion(
                        "inicio"
                    );
                }
            );


            document.getElementById(
                "btnCerrarSesion"
            ).addEventListener(
                "click",
                cerrarSesion
            );
        }


        function mostrarSeccion(
            nombre
        ) {

            document
                .querySelectorAll(
                    ".seccion"
                )
                .forEach(
                    seccion =>
                        seccion.classList.remove(
                            "active"
                        )
                );


            const seleccionada =
                document.getElementById(
                    `seccion-${nombre}`
                );


            if (seleccionada) {

                seleccionada.classList.add(
                    "active"
                );
            }


            if (
                nombre === "inicio" ||
                nombre === "solicitudes" ||
                nombre === "historial"
            ) {

                actualizarPanelProfesor();
            }
        }


        function configurarFormulario() {

            const formulario =
                document.getElementById(
                    "formSolicitud"
                );


            formulario.addEventListener(
                "submit",
                function (evento) {

                    evento.preventDefault();


                    const titulo =
                        document.getElementById(
                            "titulo"
                        ).value.trim();

                    const categoria =
                        document.getElementById(
                            "categoria"
                        ).value;

                    const prioridad =
                        document.getElementById(
                            "prioridad"
                        ).value;

                    const descripcion =
                        document.getElementById(
                            "descripcion"
                        ).value.trim();

                    const archivoInput =
                        document.getElementById(
                            "archivo"
                        );

                    const mensaje =
                        document.getElementById(
                            "mensajeFormulario"
                        );


                    mensaje.textContent = "";
                    mensaje.className =
                        "form-message";


                    if (
                        !titulo ||
                        !categoria ||
                        !prioridad ||
                        !descripcion
                    ) {

                        mensaje.textContent =
                            "Complete todos los campos obligatorios.";

                        mensaje.classList.add(
                            "error"
                        );

                        return;
                    }


                    const archivo =
                        archivoInput.files.length
                            ? archivoInput
                                .files[0].name
                            : "";


                    const solicitud =
                        crearSolicitud({

                            titulo:
                                titulo,

                            categoria:
                                categoria,

                            prioridad:
                                prioridad,

                            descripcion:
                                descripcion,

                            profesor:
                                usuario.usuario,

                            archivo:
                                archivo
                        });


                    mensaje.textContent =
                        `${solicitud.codigo} registrada correctamente.`;

                    mensaje.classList.add(
                        "success"
                    );


                    formulario.reset();


                    actualizarPanelProfesor();


                    setTimeout(
                        () =>
                            mostrarSeccion(
                                "solicitudes"
                            ),
                        800
                    );
                }
            );
        }


        function actualizarPanelProfesor() {

            const solicitudes =
                obtenerSolicitudesProfesor(
                    usuario.usuario
                );


            actualizarContadores(
                solicitudes
            );

            cargarSolicitudesRecientes(
                solicitudes
            );

            cargarTablaSolicitudes(
                solicitudes
            );

            cargarHistorial(
                solicitudes
            );
        }


        function actualizarContadores(
            solicitudes
        ) {

            const datos =
                contarSolicitudesPorEstado(
                    solicitudes
                );


            document.getElementById(
                "contadorPendientes"
            ).textContent =
                datos.pendientes;


            document.getElementById(
                "contadorAtencion"
            ).textContent =
                datos.atencion;


            document.getElementById(
                "contadorResueltas"
            ).textContent =
                datos.resueltas;


            document.getElementById(
                "contadorTotal"
            ).textContent =
                datos.total;
        }


        function cargarSolicitudesRecientes(
            solicitudes
        ) {

            const tabla =
                document.getElementById(
                    "tablaRecientes"
                );


            tabla.innerHTML = "";


            const recientes =
                [...solicitudes]
                    .reverse()
                    .slice(0, 5);


            if (
                recientes.length === 0
            ) {

                tabla.innerHTML = `
                    <tr>
                        <td colspan="5"
                            class="empty-table">
                            Todavía no has registrado solicitudes.
                        </td>
                    </tr>
                `;

                return;
            }


            recientes.forEach(
                solicitud => {

                    tabla.innerHTML += `

                        <tr>

                            <td>
                                <strong>
                                    ${solicitud.codigo}
                                </strong>
                            </td>

                            <td>
                                ${solicitud.titulo}
                            </td>

                            <td>
                                ${crearBadgePrioridad(
                                    solicitud.prioridad
                                )}
                            </td>

                            <td>
                                ${crearBadgeEstado(
                                    solicitud.estado
                                )}
                            </td>

                            <td>
                                ${solicitud.fechaRegistro}
                            </td>

                        </tr>
                    `;
                }
            );
        }


        function cargarTablaSolicitudes(
            solicitudes
        ) {

            const tabla =
                document.getElementById(
                    "tablaSolicitudesProfesor"
                );


            tabla.innerHTML = "";


            if (
                solicitudes.length === 0
            ) {

                tabla.innerHTML = `
                    <tr>
                        <td colspan="7"
                            class="empty-table">
                            No existen solicitudes registradas.
                        </td>
                    </tr>
                `;

                return;
            }


            [...solicitudes]
                .reverse()
                .forEach(
                    solicitud => {

                        const fila =
                            document.createElement(
                                "tr"
                            );


                        fila.innerHTML = `

                            <td>
                                <strong>
                                    ${solicitud.codigo}
                                </strong>
                            </td>

                            <td>
                                ${solicitud.titulo}
                            </td>

                            <td>
                                ${solicitud.categoria}
                            </td>

                            <td>
                                ${crearBadgePrioridad(
                                    solicitud.prioridad
                                )}
                            </td>

                            <td>
                                ${crearBadgeEstado(
                                    solicitud.estado
                                )}
                            </td>

                            <td>
                                ${solicitud.tecnico ||
                                "Sin asignar"}
                            </td>

                            <td>
                                <button
                                    class="btn-table">
                                    Ver
                                </button>
                            </td>
                        `;


                        fila
                            .querySelector(
                                ".btn-table"
                            )
                            .addEventListener(
                                "click",
                                () =>
                                    mostrarModalDetalle(
                                        solicitud
                                    )
                            );


                        tabla.appendChild(
                            fila
                        );
                    }
                );
        }


        function cargarHistorial(
            solicitudes
        ) {

            const contenedor =
                document.getElementById(
                    "listaHistorial"
                );


            contenedor.innerHTML = "";


            const eventos = [];


            solicitudes.forEach(
                solicitud => {

                    const historial =
                        solicitud.historial ||
                        [];


                    historial.forEach(
                        item => {

                            eventos.push({

                                codigo:
                                    solicitud.codigo,

                                titulo:
                                    solicitud.titulo,

                                fecha:
                                    item.fecha,

                                accion:
                                    item.accion,

                                detalle:
                                    item.detalle
                            });
                        }
                    );
                }
            );


            if (
                eventos.length === 0
            ) {

                contenedor.innerHTML = `

                    <div class="empty-state">

                        <h3>
                            Sin historial
                        </h3>

                        <p>
                            Aún no existen movimientos
                            registrados.
                        </p>

                    </div>
                `;

                return;
            }


            eventos
                .reverse()
                .forEach(
                    evento => {

                        contenedor.innerHTML += `

                            <article
                                class="historial-item">

                                <div
                                    class="historial-point">
                                </div>

                                <div>

                                    <div
                                        class="historial-header">

                                        <strong>
                                            ${evento.codigo}
                                        </strong>

                                        <span>
                                            ${evento.fecha}
                                        </span>

                                    </div>

                                    <h4>
                                        ${evento.accion}
                                    </h4>

                                    <p>
                                        ${evento.detalle}
                                    </p>

                                </div>

                            </article>
                        `;
                    }
                );
        }


        function configurarModal() {

            document.getElementById(
                "cerrarModal"
            ).addEventListener(
                "click",
                cerrarModalDetalle
            );


            document.getElementById(
                "modalDetalle"
            ).addEventListener(
                "click",
                function (evento) {

                    if (
                        evento.target ===
                        this
                    ) {

                        cerrarModalDetalle();
                    }
                }
            );
        }

    }
);