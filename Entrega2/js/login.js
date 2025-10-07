// Seleccionar el formulario y el botón
const loginForm = document.querySelector("form");
const loginBtn = document.getElementById("loginBtn");

// Funciones para mostrar errores o éxitos
function mostrarError(input, mensaje) {
  const textbox = input.parentElement;
  textbox.classList.add("error");
  textbox.classList.remove("success");

  let errorMsg = textbox.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("span");
    errorMsg.className = "error-message";
    textbox.appendChild(errorMsg);
  }
  errorMsg.textContent = mensaje;
}

function mostrarExito(input) {
  const textbox = input.parentElement;
  textbox.classList.remove("error");
  textbox.classList.add("success");

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
    } else {
      mostrarExito(input);
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

  // ✅ AQUÍ ESTABA EL PROBLEMA: Faltaba la acción después de validar
  
  // Opción 1: Enviar el formulario (si tienes un backend)
  // loginForm.submit();
  
  // Opción 2: Redirigir a otra página (simulando login exitoso)
  console.log("✅ Login exitoso!");
  loginBtn.value = "Ingresando...";
  loginBtn.disabled = true;
  
  // Simular delay de servidor y redirigir
  setTimeout(() => {
    window.location.href = "index.html"; 
  }, 1000);
  

});

// Limpiar errores al escribir
loginForm.querySelectorAll("input[required]").forEach((input) => {
  input.addEventListener("input", function() {
    if (this.value.trim() !== "") {
      mostrarExito(this);
    }
  });
});