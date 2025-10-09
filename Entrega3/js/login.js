// Seleccionar el formulario y el botón
const loginForm = document.querySelector("form");
const loginBtn = document.getElementById("loginBtn");

// Función para mostrar errores
function mostrarError(input, mensaje) {
  const textbox = input.parentElement;
  textbox.classList.add("error");

  let errorMsg = textbox.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("span");
    errorMsg.className = "error-message";
    textbox.appendChild(errorMsg);
  }
  errorMsg.textContent = mensaje;
}

// Función para limpiar errores
function limpiarError(input) {
  const textbox = input.parentElement;
  textbox.classList.remove("error");

  const errorMsg = textbox.querySelector(".error-message");
  if (errorMsg) {
    errorMsg.remove();
  }
}

// Evento click del botón
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  let formularioValido = true;
  const inputs = loginForm.querySelectorAll("input[required]");

  // Validar cada campo
  inputs.forEach((input) => {
    const valor = input.value.trim();
    if (valor === "") {
      mostrarError(input, "Este campo es obligatorio");
      formularioValido = false;
    }
  });

  // Si hay error, animación shake
  if (!formularioValido) {
    loginBtn.style.animation = "shake 0.5s";
    setTimeout(() => {
      loginBtn.style.animation = "";
    }, 500);
    return;
  }

  // Cambiar a "Ingresando..."
  loginBtn.value = "Ingresando...";
  loginBtn.disabled = true;

  // Simular delay y transformar en pulgar
  setTimeout(() => {
    // Ocultar el input y crear el pulgar
    loginBtn.style.display = "none";

    const thumbsUpDiv = document.createElement("div");
    thumbsUpDiv.className = "thumbs-up";
    thumbsUpDiv.innerHTML = `
      <svg width="50" height="50" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 11H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3"/>
      </svg>
    `;
    loginBtn.parentElement.appendChild(thumbsUpDiv);

    // Redirigir después de mostrar el pulgar
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }, 1000);
});

// Limpiar errores al escribir
loginForm.querySelectorAll("input[required]").forEach((input) => {
  input.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      limpiarError(this);
    }
  });
});
