// =========================================================
// MiCine · LOGIN SIMULADO
// =========================================================

// Usuario ya creado (el único que puede entrar)
const USUARIO = {
	usuario: "micine",
	password: "micine123"
};

// Nombre con el que se guarda la sesión en el navegador
const CLAVE_SESION = "micine-sesion";

// Si ya inició sesión antes (y no la cerró), va directo a la app
if (sessionStorage.getItem(CLAVE_SESION) === USUARIO.usuario) {
	location.replace("app.html");
}

// ---------- Elementos del HTML ----------
const formLogin = document.getElementById("form-login");
const inputUsuario = document.getElementById("login-usuario");
const inputPass = document.getElementById("login-pass");
const btnVerPass = document.getElementById("btn-ver-pass");

// ---------- Funciones ----------

// Pone el campo en rojo con un mensaje debajo
function marcarError(input, mensaje) {
	input.classList.add("is-invalid");
	input.parentElement.querySelector(".invalid-feedback").textContent = mensaje;
}

// ---------- Al apretar "Entrar a la sala" ----------
formLogin.addEventListener("submit", (e) => {
	e.preventDefault(); // evita que la página se recargue

	const usuario = inputUsuario.value.trim().toLowerCase();
	const password = inputPass.value;

	// 1) Campos vacíos
	let hayVacios = false;
	if (usuario === "") {
		marcarError(inputUsuario, "Completá tu usuario.");
		hayVacios = true;
	}
	if (password === "") {
		marcarError(inputPass, "Completá tu contraseña.");
		hayVacios = true;
	}
	if (hayVacios) return;

	// 2) El usuario no es el guardado
	if (usuario !== USUARIO.usuario) {
		marcarError(inputUsuario, "Ese usuario no está registrado.");
		return;
	}

	// 3) La contraseña no es la guardada
	if (password !== USUARIO.password) {
		inputPass.value = ""; // borra la contraseña para volver a escribirla
		marcarError(inputPass, "Contraseña incorrecta. Intentá de nuevo.");
		inputPass.focus();
		return;
	}

	// 4) Todo correcto: guarda la sesión y pasa a la app
	sessionStorage.setItem(CLAVE_SESION, usuario);
	location.replace("app.html");
});

// Saca el rojo apenas el usuario vuelve a escribir
inputUsuario.addEventListener("input", () => inputUsuario.classList.remove("is-invalid"));
inputPass.addEventListener("input", () => inputPass.classList.remove("is-invalid"));

// Mostrar / ocultar contraseña
btnVerPass.addEventListener("click", () => {
	const oculta = inputPass.type === "password";
	inputPass.type = oculta ? "text" : "password";
	btnVerPass.innerHTML = oculta ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
});
