// ---------- 1. PROTECCIÓN: sin sesión no se entra ----------
const USUARIO = "micine";
const CLAVE_SESION = "micine-sesion";

if (sessionStorage.getItem(CLAVE_SESION) !== USUARIO) {
	// No pasó por el login: vuelve al login (replace = no se puede volver con "Atrás")
	location.replace("index.html");
} else {
	document.getElementById("app").classList.remove("d-none");
	iniciarApp();
}


function iniciarApp() {

	// ---------- 2. DATOS ----------

	// Géneros: de acá salen los chips, el ícono y el color de cada tarjeta
	const GENEROS = [
		{ nombre: "Comedia",         icono: "bi-emoji-laughing",  clase: "genero-comedia" },
		{ nombre: "Drama",           icono: "bi-heartbreak",      clase: "genero-drama" },
		{ nombre: "Terror",          icono: "bi-moon-stars",      clase: "genero-terror" },
		{ nombre: "Animación",       icono: "bi-balloon",         clase: "genero-animacion" },
		{ nombre: "Ciencia ficción", icono: "bi-rocket-takeoff",  clase: "genero-cienciaf" },
		{ nombre: "Acción",          icono: "bi-lightning",       clase: "genero-accion" }
	];

	// Filtros de la lista
	const FILTROS = [
		{ texto: "Todas",     valor: "todas" },
		{ texto: "Películas", valor: "pelicula" },
		{ texto: "Series",    valor: "serie" }
	];

	// Lista de la cuenta: se guarda en el navegador con el nombre del usuario
	const usuario = sessionStorage.getItem(CLAVE_SESION);
	const CLAVE_LISTA = "micine-lista-" + usuario;

	// Arranca vacía; si la cuenta ya tenía cosas guardadas, las carga
	let titulos = [];
	const guardado = localStorage.getItem(CLAVE_LISTA);
	if (guardado !== null) {
		titulos = JSON.parse(guardado);
	}

	// Guarda la lista actual en la cuenta (se llama cada vez que cambia)
	function guardarLista() {
		localStorage.setItem(CLAVE_LISTA, JSON.stringify(titulos));
	}

	// Lo que el usuario va eligiendo
	let generoElegido = GENEROS[0].nombre;
	let puntajeElegido = 0;
	let filtroActual = "todas";


	// ---------- 3. ELEMENTOS DEL HTML ----------
	const saludo = document.getElementById("saludo");
	const iniciales = document.getElementById("iniciales");
	const btnSalir = document.getElementById("btn-salir");

	const formAgregar = document.getElementById("form-agregar");
	const inputTitulo = document.getElementById("input-titulo");
	const contGeneros = document.getElementById("lista-generos");
	const contEstrellas = document.getElementById("estrellas");
	const errorPuntaje = document.getElementById("error-puntaje");

	const contador = document.getElementById("contador");
	const btnLimpiar = document.getElementById("btn-limpiar");
	const contFiltros = document.getElementById("filtros");
	const grilla = document.getElementById("grilla");
	const mensajeVacio = document.getElementById("mensaje-vacio");


	// ---------- 4. ENCABEZADO Y CERRAR SESIÓN ----------
	saludo.textContent = "Hola, " + usuario;
	iniciales.textContent = usuario.slice(0, 2).toUpperCase();

	btnSalir.addEventListener("click", () => {
		sessionStorage.removeItem(CLAVE_SESION); // borra la sesión
		location.replace("index.html");
	});


	// ---------- 5. FUNCIONES DE AYUDA ----------

	// Busca los datos de un género por su nombre
	function buscarGenero(nombre) {
		for (let i = 0; i < GENEROS.length; i++) {
			if (GENEROS[i].nombre === nombre) {
				return GENEROS[i];
			}
		}
		return GENEROS[0];
	}

	// Crea los íconos de estrellas (llenas y vacías) dentro de un elemento
	function dibujarEstrellas(contenedor, puntaje) {
		for (let i = 1; i <= 5; i++) {
			const estrella = document.createElement("i");
			estrella.className = i <= puntaje ? "bi bi-star-fill" : "bi bi-star";
			contenedor.appendChild(estrella);
		}
	}


	// ---------- 6. CHIPS DE GÉNERO (con for) ----------
	function mostrarGeneros() {
		contGeneros.innerHTML = "";

		for (let i = 0; i < GENEROS.length; i++) {
			const genero = GENEROS[i];

			const radio = document.createElement("input");
			radio.type = "radio";
			radio.className = "btn-check";
			radio.name = "genero";
			radio.id = "genero-" + i;
			radio.checked = genero.nombre === generoElegido;
			radio.addEventListener("change", () => {
				generoElegido = genero.nombre;
			});

			const chip = document.createElement("label");
			chip.className = "btn btn-outline-primary btn-sm rounded-pill";
			chip.htmlFor = radio.id;
			chip.innerHTML = '<i class="bi ' + genero.icono + '"></i> ' + genero.nombre;

			contGeneros.appendChild(radio);
			contGeneros.appendChild(chip);
		}
	}


	// ---------- 7. ESTRELLAS PARA PUNTUAR (con for) ----------
	function mostrarEstrellasFormulario() {
		contEstrellas.innerHTML = "";

		for (let i = 1; i <= 5; i++) {
			const boton = document.createElement("button");
			boton.type = "button";
			boton.className = "btn btn-link link-primary fs-3 p-0 lh-1";
			boton.setAttribute("aria-label", i + " estrellas");
			boton.innerHTML = i <= puntajeElegido ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';

			boton.addEventListener("click", () => {
				puntajeElegido = i;
				errorPuntaje.classList.add("d-none");
				mostrarEstrellasFormulario(); // vuelve a dibujar con el nuevo puntaje
			});

			contEstrellas.appendChild(boton);
		}
	}


	// ---------- 8. FILTROS (con for) ----------
	function mostrarFiltros() {
		contFiltros.innerHTML = "";

		for (let i = 0; i < FILTROS.length; i++) {
			const filtro = FILTROS[i];

			const radio = document.createElement("input");
			radio.type = "radio";
			radio.className = "btn-check";
			radio.name = "filtro";
			radio.id = "filtro-" + filtro.valor;
			radio.checked = filtro.valor === filtroActual;
			radio.addEventListener("change", () => {
				filtroActual = filtro.valor;
				mostrarGrilla();
			});

			const etiqueta = document.createElement("label");
			etiqueta.className = "btn btn-outline-primary btn-sm";
			etiqueta.htmlFor = radio.id;
			etiqueta.textContent = filtro.texto;

			contFiltros.appendChild(radio);
			contFiltros.appendChild(etiqueta);
		}
	}


	// ---------- 9. GRILLA DE TARJETAS (con for) ----------
	function mostrarGrilla() {
		grilla.innerHTML = "";
		let mostrados = 0;

		for (let i = 0; i < titulos.length; i++) {
			const item = titulos[i];

			// Si no coincide con el filtro, se saltea
			if (filtroActual !== "todas" && item.tipo !== filtroActual) {
				continue;
			}
			mostrados++;

			const genero = buscarGenero(item.genero);

			// Columna de la grilla
			const col = document.createElement("div");
			col.className = "col";

			// Tarjeta
			const card = document.createElement("div");
			card.className = "card h-100 border-0 bg-body-secondary rounded-4 overflow-hidden position-relative";

			// Miniatura con el ícono del género
			const portada = document.createElement("div");
			portada.className = "d-flex align-items-center justify-content-center py-4 display-6 " + genero.clase;
			portada.innerHTML = '<i class="bi ' + genero.icono + '"></i>';

			// Etiqueta PELI / SERIE (sobre el fondo oscuro, para que siempre se lea)
			const etiqueta = document.createElement("span");
			etiqueta.className = "badge bg-body text-primary position-absolute top-0 start-0 m-2";
			etiqueta.innerHTML = item.tipo === "pelicula"
				? '<i class="bi bi-film"></i> PELI'
				: '<i class="bi bi-tv"></i> SERIE';

			// Botón borrar
			const btnBorrar = document.createElement("button");
			btnBorrar.type = "button";
			btnBorrar.className = "btn btn-sm bg-body text-primary rounded-circle lh-1 p-1 position-absolute top-0 end-0 m-2";
			btnBorrar.innerHTML = '<i class="bi bi-x-lg"></i>';
			btnBorrar.setAttribute("aria-label", "Borrar " + item.titulo);
			btnBorrar.addEventListener("click", () => {
				borrarTitulo(item.id);
			});

			// Título y estrellas
			const cuerpo = document.createElement("div");
			cuerpo.className = "card-body p-2";

			const nombre = document.createElement("h3");
			nombre.className = "card-title small fw-semibold text-truncate mb-1";
			nombre.textContent = item.titulo; // textContent: seguro aunque escriban < >

			const estrellas = document.createElement("div");
			estrellas.className = "text-primary small";
			dibujarEstrellas(estrellas, item.puntaje);

			// Armado: se meten unos dentro de otros
			cuerpo.appendChild(nombre);
			cuerpo.appendChild(estrellas);
			card.appendChild(portada);
			card.appendChild(etiqueta);
			card.appendChild(btnBorrar);
			card.appendChild(cuerpo);
			col.appendChild(card);
			grilla.appendChild(col);
		}

		contador.textContent = "· " + titulos.length;
		mensajeVacio.classList.toggle("d-none", mostrados > 0);
	}


	// ---------- 10. AGREGAR ----------
	formAgregar.addEventListener("submit", (e) => {
		e.preventDefault();

		const titulo = inputTitulo.value.trim();
		const tipo = formAgregar.querySelector('input[name="tipo"]:checked').value;

		// Validaciones
		inputTitulo.classList.toggle("is-invalid", titulo === "");
		errorPuntaje.classList.toggle("d-none", puntajeElegido > 0);
		if (titulo === "" || puntajeElegido === 0) return;

		titulos.unshift({
			id: Date.now(),
			titulo: titulo,
			tipo: tipo,
			genero: generoElegido,
			puntaje: puntajeElegido
		});
		guardarLista();

		// Limpia el formulario
		inputTitulo.value = "";
		puntajeElegido = 0;
		mostrarEstrellasFormulario();
		mostrarGrilla();
	});

	inputTitulo.addEventListener("input", () => inputTitulo.classList.remove("is-invalid"));


	// ---------- 11. BORRAR UNO Y BORRAR TODOS ----------
	function borrarTitulo(id) {
		const nuevaLista = [];
		for (let i = 0; i < titulos.length; i++) {
			if (titulos[i].id !== id) {
				nuevaLista.push(titulos[i]);
			}
		}
		titulos = nuevaLista;
		guardarLista();
		mostrarGrilla();
	}

	btnLimpiar.addEventListener("click", () => {
		titulos = [];
		guardarLista();
		mostrarGrilla();
	});


	// ---------- 12. INICIO ----------
	mostrarGeneros();
	mostrarEstrellasFormulario();
	mostrarFiltros();
	mostrarGrilla();
}
