# 🎬 MiCine

**Tu cine, tus estrellas.**

MiCine es una aplicación web para guardar y puntuar las películas y series que mirás. Cada usuario tiene su propia lista, donde puede agregar títulos, ponerles de 1 a 5 estrellas, filtrarlos y borrarlos.

🔗 **Demo online:** [https://TU-SITIO.netlify.app](https://TU-SITIO.netlify.app)

---

## 🔑 Cómo entrar

| Usuario | Contraseña |
|---|---|
| `micine` | `micine123` |

---

## ✨ Funcionalidades

### Login simulado
- Valida que el usuario y la contraseña no estén vacíos.
- Compara los datos con el usuario guardado en JavaScript.
- Muestra un mensaje distinto si el usuario no existe o si la contraseña es incorrecta.
- Permite mostrar u ocultar la contraseña.
- **No se puede entrar a la app sin iniciar sesión**: si se abre `app.html` directamente, redirige al login.

### Lista de películas y series
- **Agregar** un título eligiendo:
  - si es **película o serie**,
  - el **género** (Comedia, Drama, Terror, Animación, Ciencia ficción o Acción),
  - el **puntaje** de 1 a 5 estrellas.
- **Filtrar** la lista: Todas, Películas o Series.
- **Borrar** un título o **limpiar** toda la lista.
- Cada tarjeta muestra un **ícono y un color según el género**.
- La lista **se guarda en la cuenta**: queda guardada aunque se recargue la página o se cierre sesión.

---

## 🛠️ Tecnologías

- **HTML5**
- **CSS3**: solo para la fuente y los colores.
- **Bootstrap 5.3**: estructura, componentes y utilidades.
- **Bootstrap Icons**
- **JavaScript**: manipulación del DOM con `for`, `createElement` y `appendChild`.

---

## 📁 Estructura del proyecto

```
micine/
├── index.html   → Pantalla de login
├── app.html     → Pantalla de la lista
├── styles.css   → Fuente y colores
├── login.js     → Validación del login y creación de la sesión
└── app.js       → Protección de la página y lógica de la lista
```

---

## 💾 Cómo se guardan los datos

- **La sesión** se guarda con `sessionStorage`, que se borra al cerrar la pestaña.
- **La lista de cada usuario** se guarda con `localStorage`, con una clave propia para cada usuario (`micine-lista-<usuario>`), y queda guardada aunque se cierre el navegador.

### ⚠️ Limitación
Como es un **login simulado sin servidor**, los datos se guardan **solo en el navegador del dispositivo donde se cargaron**. Si se inicia sesión desde otro celular u otra computadora, la lista aparece vacía.

Para compartir los datos entre dispositivos habría que conectar una **base de datos en línea**, como **Firebase** o **Supabase**, que es la mejora prevista a futuro.

---

## ▶️ Cómo usarlo de forma local

1. Descargar o clonar el repositorio.
2. Abrir `index.html` en el navegador.
3. Iniciar sesión con los datos de prueba.

---

## 👤 Autor

**TU NOMBRE** · Proyecto para el curso de **NOMBRE DEL CURSO**.
