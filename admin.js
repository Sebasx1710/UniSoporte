document.addEventListener(
    "DOMContentLoaded",
    function () {


        validarRol(
            "ADMIN"
        );


        const usuario =
            obtenerUsuarioActual();


        if (!usuario) {
            return;
        }


        let codigoSeleccionado =
            null;



        cargarUsuario();

        configurarNavegacion();

        configurarFiltros();

        configurarModales();

        configurarGestionUsuarios();

        actualizarAdmin();



        function cargarUsuario() {

            document.getElementById(
                "nombreUsuario"
            ).textContent =
                usuario.nombre;


            document.getElementById(
                "nombreUsuarioSidebar"
            ).textContent =
                usuario.nombre;
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


            actualizarAdmin();
        }



        function actualizarAdmin() {

            cargarContadores();

            cargarPendientes();

            cargarSolicitudes();

            cargarUsuarios();

            cargarReportes();
        }



        function cargarContadores() {

            const datos =
                obtenerEstadisticasAdmin();


            document.getElementById(
                "contadorPendientes"
            ).textContent =
                datos.pendientes;


            document.getElementById(
                "contadorAsignadas"
            ).textContent =
                datos.asignadas;


            document.getElementById(
                "contadorAtencion"
            ).textContent =
                datos.atencion;


            document.getElementById(
                "contadorResueltas"
            ).textContent =
                datos.resueltas;
        }



        function cargarPendientes() {

            const tabla =
                document.getElementById(
                    "tablaPendientes"
                );


            const solicitudes =
                obtenerSolicitudes()
                    .filter(
                        solicitud =>
                            solicitud.estado ===
                            "Pendiente"
                    );


            tabla.innerHTML =
                "";


            if (
                solicitudes.length === 0
            ) {

                tabla.innerHTML = `

                    <tr>

                        <td
                            colspan="6"
                            class="empty-table"
                        >
                            No existen solicitudes pendientes.
                        </td>

                    </tr>
                `;

                return;
            }


            solicitudes.forEach(
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
                            ${solicitud.categoria}
                        </td>

                        <td>
                            ${crearBadgePrioridad(
                                solicitud.prioridad
                            )}
                        </td>

                        <td>

                            <button
                                class="btn-table btn-asignar"
                            >
                                Asignar
                            </button>

                        </td>
                    `;


                    fila
                        .querySelector(
                            ".btn-asignar"
                        )
                        .addEventListener(
                            "click",
                            () =>
                                abrirAsignacion(
                                    solicitud.codigo
                                )
                        );


                    tabla.appendChild(
                        fila
                    );
                }
            );
        }



        function cargarSolicitudes() {

            const tabla =
                document.getElementById(
                    "tablaSolicitudesAdmin"
                );


            let solicitudes =
                obtenerSolicitudes();


            const estado =
                document.getElementById(
                    "filtroEstado"
                ).value;


            const prioridad =
                document.getElementById(
                    "filtroPrioridad"
                ).value;


            if (estado) {

                solicitudes =
                    solicitudes.filter(
                        solicitud =>
                            solicitud.estado ===
                            estado
                    );
            }


            if (prioridad) {

                solicitudes =
                    solicitudes.filter(
                        solicitud =>
                            solicitud.prioridad ===
                            prioridad
                    );
            }


            tabla.innerHTML =
                "";


            if (
                solicitudes.length === 0
            ) {

                tabla.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            class="empty-table"
                        >
                            No existen solicitudes para mostrar.
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
                                    class="btn-table btn-ver"
                                >
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



        function cargarUsuarios() {

            const tabla =
                document.getElementById(
                    "tablaUsuarios"
                );


            const usuarios =
                obtenerUsuarios();


            tabla.innerHTML =
                "";


            usuarios.forEach(
                item => {

                    const estado =
                        item.estado ||
                        "ACTIVO";


                    const fila =
                        document.createElement(
                            "tr"
                        );


                    fila.innerHTML = `

                        <td>
                            ${item.id}
                        </td>

                        <td>
                            ${item.nombre}
                        </td>

                        <td>
                            ${item.correo ||
                            "No registrado"}
                        </td>

                        <td>
                            ${item.usuario}
                        </td>

                        <td>

                            <span class="rol-badge">
                                ${item.rol}
                            </span>

                        </td>

                        <td>

                            <span
                                class="usuario-estado
                                ${estado === "ACTIVO"
                                    ? "usuario-activo"
                                    : "usuario-inactivo"}"
                            >
                                ${estado}
                            </span>

                        </td>

                        <td>

                            <button
                                class="btn-table btn-estado-usuario"
                            >
                                ${estado === "ACTIVO"
                                    ? "Desactivar"
                                    : "Activar"}
                            </button>

                        </td>
                    `;


                    fila
                        .querySelector(
                            ".btn-estado-usuario"
                        )
                        .addEventListener(
                            "click",
                            function () {

                                const resultado =
                                    cambiarEstadoUsuario(
                                        item.id
                                    );


                                alert(
                                    resultado.mensaje
                                );


                                if (
                                    resultado.exito
                                ) {

                                    cargarUsuarios();
                                }
                            }
                        );


                    tabla.appendChild(
                        fila
                    );
                }
            );
        }



        function cargarReportes() {

            const contenedor =
                document.getElementById(
                    "contenedorReportes"
                );


            const estados =
                obtenerEstadisticasAdmin();


            const categorias =
                obtenerReporteCategorias();


            const prioridades =
                obtenerReportePrioridades();


            contenedor.innerHTML = `

                <article class="report-card">

                    <h3>
                        Resumen general
                    </h3>

                    <div class="report-value">
                        ${estados.total}
                    </div>

                    <p>
                        Solicitudes registradas
                    </p>

                </article>


                <article class="report-card">

                    <h3>
                        Categorías
                    </h3>

                    <ul>

                        <li>
                            Tecnológico

                            <strong>
                                ${categorias["Tecnológico"]}
                            </strong>
                        </li>

                        <li>
                            Académico

                            <strong>
                                ${categorias["Académico"]}
                            </strong>
                        </li>

                        <li>
                            Administrativo

                            <strong>
                                ${categorias["Administrativo"]}
                            </strong>
                        </li>

                    </ul>

                </article>


                <article class="report-card">

                    <h3>
                        Prioridades
                    </h3>

                    <ul>

                        <li>
                            Alta
                            <strong>
                                ${prioridades.alta}
                            </strong>
                        </li>

                        <li>
                            Media
                            <strong>
                                ${prioridades.media}
                            </strong>
                        </li>

                        <li>
                            Baja
                            <strong>
                                ${prioridades.baja}
                            </strong>
                        </li>

                    </ul>

                </article>


                <article class="report-card">

                    <h3>
                        Resueltas
                    </h3>

                    <div class="report-value">
                        ${estados.resueltas}
                    </div>

                    <p>
                        Solicitudes solucionadas
                    </p>

                </article>
            `;
        }



        /*
        =====================================
        ASIGNACIÓN DE TÉCNICO
        =====================================
        */


        function abrirAsignacion(
            codigo
        ) {

            codigoSeleccionado =
                codigo;


            document.getElementById(
                "codigoAsignacion"
            ).textContent =
                `Solicitud: ${codigo}`;


            const select =
                document.getElementById(
                    "selectTecnico"
                );


            select.innerHTML =
                `<option value="">
                    Seleccione un técnico
                </option>`;


            obtenerTecnicos()
                .forEach(
                    tecnico => {

                        select.innerHTML += `

                            <option
                                value="${tecnico.nombre}"
                            >
                                ${tecnico.nombre}
                            </option>
                        `;
                    }
                );


            document.getElementById(
                "modalAsignar"
            ).classList.add(
                "show"
            );
        }



        function configurarFiltros() {

            document.getElementById(
                "filtroEstado"
            ).addEventListener(
                "change",
                cargarSolicitudes
            );


            document.getElementById(
                "filtroPrioridad"
            ).addEventListener(
                "change",
                cargarSolicitudes
            );
        }



        function configurarModales() {

            document.getElementById(
                "cerrarModalAsignar"
            ).addEventListener(
                "click",
                cerrarAsignacion
            );


            document.getElementById(
                "cerrarModal"
            ).addEventListener(
                "click",
                cerrarModalDetalle
            );


            document.getElementById(
                "btnConfirmarAsignacion"
            ).addEventListener(
                "click",
                function () {

                    const tecnico =
                        document.getElementById(
                            "selectTecnico"
                        ).value;


                    if (!tecnico) {

                        alert(
                            "Seleccione un técnico."
                        );

                        return;
                    }


                    const resultado =
                        asignarSolicitudTecnico(
                            codigoSeleccionado,
                            tecnico
                        );


                    alert(
                        resultado.mensaje
                    );


                    if (
                        resultado.exito
                    ) {

                        cerrarAsignacion();

                        actualizarAdmin();
                    }
                }
            );
        }



        function cerrarAsignacion() {

            document.getElementById(
                "modalAsignar"
            ).classList.remove(
                "show"
            );


            codigoSeleccionado =
                null;
        }



        /*
        =====================================
        GESTIÓN DE USUARIOS
        =====================================
        */


        function configurarGestionUsuarios() {

            const modal =
                document.getElementById(
                    "modalNuevoUsuario"
                );


            const formulario =
                document.getElementById(
                    "formNuevoUsuario"
                );


            const rol =
                document.getElementById(
                    "adminRol"
                );


            document.getElementById(
                "btnNuevoUsuario"
            ).addEventListener(
                "click",
                function () {

                    formulario.reset();

                    limpiarMensajeUsuario();

                    document.getElementById(
                        "grupoCodigoAdmin"
                    ).classList.add(
                        "hidden"
                    );


                    modal.classList.add(
                        "show"
                    );
                }
            );


            document.getElementById(
                "cerrarModalUsuario"
            ).addEventListener(
                "click",
                cerrarModalUsuario
            );


            document.getElementById(
                "btnCancelarUsuario"
            ).addEventListener(
                "click",
                cerrarModalUsuario
            );


            rol.addEventListener(
                "change",
                function () {

                    const grupo =
                        document.getElementById(
                            "grupoCodigoAdmin"
                        );


                    if (
                        this.value ===
                        "ADMIN"
                    ) {

                        grupo.classList.remove(
                            "hidden"
                        );

                    } else {

                        grupo.classList.add(
                            "hidden"
                        );


                        document.getElementById(
                            "codigoAdmin"
                        ).value =
                            "";
                    }
                }
            );


            formulario.addEventListener(
                "submit",
                function (evento) {

                    evento.preventDefault();


                    const datos = {

                        nombre:
                            document.getElementById(
                                "adminNombre"
                            ).value.trim(),

                        correo:
                            document.getElementById(
                                "adminCorreo"
                            ).value.trim(),

                        usuario:
                            document.getElementById(
                                "adminUsuario"
                            ).value.trim(),

                        rol:
                            document.getElementById(
                                "adminRol"
                            ).value,

                        password:
                            document.getElementById(
                                "adminPassword"
                            ).value,

                        confirmarPassword:
                            document.getElementById(
                                "adminConfirmar"
                            ).value
                    };


                    const codigo =
                        document.getElementById(
                            "codigoAdmin"
                        ).value.trim();


                    const resultado =
                        crearUsuarioDesdeAdmin(
                            datos,
                            codigo
                        );


                    const mensaje =
                        document.getElementById(
                            "mensajeNuevoUsuario"
                        );


                    mensaje.textContent =
                        resultado.mensaje;


                    mensaje.className =
                        "form-message";


                    mensaje.classList.add(
                        resultado.exito
                            ? "success"
                            : "error"
                    );


                    if (
                        resultado.exito
                    ) {

                        formulario.reset();


                        document.getElementById(
                            "grupoCodigoAdmin"
                        ).classList.add(
                            "hidden"
                        );


                        cargarUsuarios();
                    }
                }
            );


            function cerrarModalUsuario() {

                modal.classList.remove(
                    "show"
                );


                formulario.reset();

                limpiarMensajeUsuario();
            }


            function limpiarMensajeUsuario() {

                const mensaje =
                    document.getElementById(
                        "mensajeNuevoUsuario"
                    );


                mensaje.textContent =
                    "";

                mensaje.className =
                    "form-message";
            }
        }

    }
);