// Seleccionar el formulario y el botón
const form = document.querySelector("form");
// En lugar de:

// Usar:
const btnRegistro = document.getElementById("btnRegistro");
// Función para mostrar error
function mostrarError(input, mensaje) {
  const textbox = input.parentElement;
  textbox.classList.add("error");
  textbox.classList.remove("success");

  // Crear o actualizar mensaje de error
  let errorMsg = textbox.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("span");
    errorMsg.className = "error-message";
    textbox.appendChild(errorMsg);
  }
  errorMsg.textContent = mensaje;
}

// Función para mostrar éxito
function mostrarExito(input) {
  const textbox = input.parentElement;
  textbox.classList.remove("error");
  textbox.classList.add("success");

  const errorMsg = textbox.querySelector(".error-message");
  if (errorMsg) {
    errorMsg.remove();
  }
}

// Validar email
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validar edad (debe ser número y mayor a 0)
function validarEdad(edad) {
  return !isNaN(edad) && edad > 0 && edad < 120;
}

// Validar contraseñas coinciden
function validarContraseñas(password, confirmPassword) {
  return password === confirmPassword && password.length >= 6;
}

// Evento de validación en tiempo real
form.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", function () {
    const nombre = this.name;
    const valor = this.value.trim();

    if (valor === "") {
      mostrarError(this, "Este campo es obligatorio");
      return;
    }

    // Validaciones específicas
    if (nombre === "Email" && !validarEmail(valor)) {
      mostrarError(this, "Email inválido");
    } else if (nombre === "Edad" && !validarEdad(valor)) {
      mostrarError(this, "Edad inválida");
    } else if (nombre === "contraseña" && valor.length < 6) {
      mostrarError(this, "La contraseña debe tener al menos 6 caracteres");
    } else if (nombre === "Confirmar contraseña") {
      const password = form.querySelector('input[name="contraseña"]').value;
      if (valor !== password) {
        mostrarError(this, "Las contraseñas no coinciden");
      } else {
        mostrarExito(this);
      }
    } else {
      mostrarExito(this);
    }
  });
});

// Validación al enviar el formulario
btnRegistro.addEventListener("click", function (e) {
  e.preventDefault();

  let formularioValido = true;
  const inputs = form.querySelectorAll("input[required]");

  inputs.forEach((input) => {
    const valor = input.value.trim();
    const nombre = input.name;

    if (valor === "") {
      mostrarError(input, "Este campo es obligatorio");
      formularioValido = false;
    } else if (nombre === "Email" && !validarEmail(valor)) {
      mostrarError(input, "Email inválido");
      formularioValido = false;
    } else if (nombre === "Edad" && !validarEdad(valor)) {
      mostrarError(input, "Edad inválida");
      formularioValido = false;
    } else if (nombre === "contraseña" && valor.length < 6) {
      mostrarError(input, "La contraseña debe tener al menos 6 caracteres");
      formularioValido = false;
    } else if (nombre === "Confirmar contraseña") {
      const password = form.querySelector('input[name="contraseña"]').value;
      if (valor !== password) {
        mostrarError(input, "Las contraseñas no coinciden");
        formularioValido = false;
      }
    }
  });

  if (formularioValido) {
    // Redirige a index.html después del mensaje
    window.location.href = "index.html";
  } else {
    // Animación adicional para el botón
    btnRegistro.style.animation = "shake 0.5s";
    setTimeout(() => {
      btnRegistro.style.animation = "";
    }, 500);
  }
});
