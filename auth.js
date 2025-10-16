// Simulación de usuarios
let users = JSON.parse(localStorage.getItem("users")) || [];

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

// Registro
document.getElementById("register-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("new-username").value;
  const password = hashPassword(document.getElementById("new-password").value);
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Cuenta creada. Ahora inicia sesión.");
  window.location.href = "login.html";
});

// Inicio de sesión
document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = hashPassword(document.getElementById("password").value);
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
});
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
