document.addEventListener(
    "DOMContentLoaded",
    function () {

        validarRol("TECNICO");


        const usuario =
            obtenerUsuarioActual();


        if (!usuario) {
            return;
        }


        cargarUsuario();

        configurarNavegacion();

        configurarModal();

        actualizarPanel();


        function cargarUsuario() {

            document.getElementById(
                "nombreUsuario"
            ).textContent =
                usuario.nombre;


            document.getElementById(
                "nombreUsuarioSidebar"
            ).textContent =
                usuario.nombre;


            document.getElementById(
                "saludoTecnico"
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
                    s =>
                        s.classList.remove(
                            "active"
                        )
                );


            const seccion =
                document.getElementById(
                    `seccion-${nombre}`
                );


            if (seccion) {

                seccion.classList.add(
                    "active"
                );
            }


            actualizarPanel();
        }


        function actualizarPanel() {

            const solicitudes =
                obtenerSolicitudesTecnico(
                    usuario.nombre
                );


            cargarContadores(
                solicitudes
            );

            cargarInicio(
                solicitudes
            );

            cargarAsignadas(
                solicitudes
            );

            cargarAtencion(
                solicitudes
            );

            cargarResueltas(
                solicitudes
            );
        }


        function cargarContadores(
            solicitudes
        ) {

            const asignadas =
                solicitudes.filter(
                    s =>
                        s.estado ===
                        "Asignada"
                ).length;


            const atencion =
                solicitudes.filter(
                    s =>
                        s.estado ===
                        "En atención"
                ).length;


            const resueltas =
                solicitudes.filter(
                    s =>
                        s.estado ===
                        "Resuelta"
                ).length;


            document.getElementById(
                "contadorAsignadas"
            ).textContent =
                asignadas;


            document.getElementById(
                "contadorAtencion"
            ).textContent =
                atencion;


            document.getElementById(
                "contadorResueltas"
            ).textContent =
                resueltas;
        }


        function cargarInicio(
            solicitudes
        ) {

            const tabla =
                document.getElementById(
                    "tablaInicioTecnico"
                );


            const asignadas =
                solicitudes.filter(
                    s =>
                        s.estado ===
                        "Asignada"
                );


            tabla.innerHTML = "";


            if (
                asignadas.length === 0
            ) {

                tabla.innerHTML = `

                    <tr>

                        <td colspan="5"
                            class="empty-table">

                            No tienes solicitudes
                            pendientes de atención.

                        </td>

                    </tr>
                `;

                return;
            }


            asignadas
                .slice(0, 5)
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

                                <button
                                    class="btn-table btn-iniciar">

                                    Iniciar atención

                                </button>

                            </td>
                        `;


                        fila
                            .querySelector(
                                ".btn-iniciar"
                            )
                            .addEventListener(
                                "click",
                                () =>
                                    iniciarAtencion(
                                        solicitud.codigo
                                    )
                            );


                        tabla.appendChild(
                            fila
                        );
                    }
                );
        }


        function cargarAsignadas(
            solicitudes
        ) {

            const tabla =
                document.getElementById(
                    "tablaAsignadas"
                );


            const asignadas =
                solicitudes.filter(
                    s =>
                        s.estado ===
                        "Asignada"
                );


            tabla.innerHTML = "";


            if (
                asignadas.length === 0
            ) {

                tabla.innerHTML = `

                    <tr>

                        <td colspan="6"
                            class="empty-table">

                            No existen solicitudes
                            asignadas.

                        </td>

                    </tr>
                `;

                return;
            }


            asignadas.forEach(
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
                            ${solicitud.profesor}
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
                            ${solicitud.fechaRegistro}
                        </td>

                        <td>

                            <button
                                class="btn-primary btn-iniciar">

                                Iniciar atención

                            </button>

                        </td>
                    `;


                    fila
                        .querySelector(
                            ".btn-iniciar"
                        )
                        .addEventListener(
                            "click",
                            () =>
                                iniciarAtencion(
                                    solicitud.codigo
                                )
                        );


                    tabla.appendChild(
                        fila
                    );
                }
            );
        }


        function iniciarAtencion(
            codigo
        ) {

            const resultado =
                iniciarAtencionSolicitud(
                    codigo
                );


            alert(
                resultado.mensaje
            );


            if (
                resultado.exito
            ) {

                actualizarPanel();

                mostrarSeccion(
                    "atencion"
                );
            }
        }


        function cargarAtencion(
            solicitudes
        ) {

            const contenedor =
                document.getElementById(
                    "listaAtencion"
                );


            const atencion =
                solicitudes.filter(
                    s =>
                        s.estado ===
                        "En atención"
                );


            contenedor.innerHTML = "";


            if (
                atencion.length === 0
            ) {

                contenedor.innerHTML = `

                    <div class="panel empty-state">

                        <h3>
                            Sin solicitudes en atención
                        </h3>

                        <p>
                            Inicia la atención de una
                            solicitud asignada.
                        </p>

                    </div>
                `;

                return;
            }


            atencion.forEach(
                solicitud => {

                    const tarjeta =
                        document.createElement(
                            "article"
                        );


                    tarjeta.className =
                        "ticket-atencion";


                    tarjeta.innerHTML = `

                        <div
                            class="ticket-header">

                            <div>

                                <span
                                    class="ticket-code">

                                    ${solicitud.codigo}

                                </span>

                                <h3>
                                    ${solicitud.titulo}
                                </h3>

                            </div>

                            ${crearBadgePrioridad(
                                solicitud.prioridad
                            )}

                        </div>


                        <div
                            class="ticket-info">

                            <p>
                                <strong>
                                    Profesor:
                                </strong>

                                ${solicitud.profesor}
                            </p>

                            <p>
                                <strong>
                                    Categoría:
                                </strong>

                                ${solicitud.categoria}
                            </p>

                        </div>


                        <div
                            class="ticket-description">

                            ${solicitud.descripcion}

                        </div>


                        <div class="form-group">

                            <label>
                                Observación técnica
                            </label>

                            <textarea
                                class="input-observacion"
                                rows="3"
                                placeholder="Registre una observación...">${solicitud.observacion || ""}</textarea>

                        </div>


                        <button
                            class="btn-secondary btn-observacion">

                            Guardar observación

                        </button>


                        <div class="form-group solucion-group">

                            <label>
                                Solución aplicada
                            </label>

                            <textarea
                                class="input-solucion"
                                rows="4"
                                placeholder="Describe la solución aplicada..."></textarea>

                        </div>


                        <button
                            class="btn-primary btn-resolver">

                            Marcar como resuelta

                        </button>
                    `;


                    tarjeta
                        .querySelector(
                            ".btn-observacion"
                        )
                        .addEventListener(
                            "click",
                            function () {

                                const observacion =
                                    tarjeta
                                        .querySelector(
                                            ".input-observacion"
                                        )
                                        .value
                                        .trim();


                                if (
                                    !observacion
                                ) {

                                    alert(
                                        "Ingrese una observación."
                                    );

                                    return;
                                }


                                const resultado =
                                    registrarObservacion(
                                        solicitud.codigo,
                                        observacion
                                    );


                                alert(
                                    resultado.mensaje
                                );


                                actualizarPanel();
                            }
                        );


                    tarjeta
                        .querySelector(
                            ".btn-resolver"
                        )
                        .addEventListener(
                            "click",
                            function () {

                                const solucion =
                                    tarjeta
                                        .querySelector(
                                            ".input-solucion"
                                        )
                                        .value
                                        .trim();


                                if (!solucion) {

                                    alert(
                                        "Ingrese la solución aplicada."
                                    );

                                    return;
                                }


                                const resultado =
                                    resolverSolicitud(
                                        solicitud.codigo,
                                        solucion
                                    );


                                alert(
                                    resultado.mensaje
                                );


                                if (
                                    resultado.exito
                                ) {

                                    actualizarPanel();

                                    mostrarSeccion(
                                        "resueltas"
                                    );
                                }
                            }
                        );


                    contenedor.appendChild(
                        tarjeta
                    );
                }
            );
        }


        function cargarResueltas(
            solicitudes
        ) {

            const tabla =
                document.getElementById(
                    "tablaResueltas"
                );


            const resueltas =
                solicitudes.filter(
                    s =>
                        s.estado ===
                        "Resuelta"
                );


            tabla.innerHTML = "";


            if (
                resueltas.length === 0
            ) {

                tabla.innerHTML = `

                    <tr>

                        <td colspan="6"
                            class="empty-table">

                            No existen solicitudes
                            resueltas.

                        </td>

                    </tr>
                `;

                return;
            }


            resueltas.forEach(
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
                            ${solicitud.profesor}
                        </td>

                        <td>
                            ${solicitud.titulo}
                        </td>

                        <td>
                            ${crearBadgePrioridad(
                                solicitud.prioridad
                            )}
                        </td>

                        <td class="solution-cell">
                            ${solicitud.solucion}
                        </td>

                        <td>

                            <button
                                class="btn-table btn-ver">

                                Ver

                            </button>

                        </td>
                    `;


                    fila
                        .querySelector(
                            ".btn-ver"
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


        function configurarModal() {

            document.getElementById(
                "cerrarModal"
            ).addEventListener(
                "click",
                cerrarModalDetalle
            );
        }

    }
);