// session.js

function guardarSesionWallet(publicKey) {
  localStorage.setItem("walletConnected", "true");
  localStorage.setItem("walletAddress", publicKey.toString());
  console.log("🔐 Sesión guardada:", publicKey.toString());
}

function cargarSesionWallet() {
  const conectado = localStorage.getItem("walletConnected") === "true";
  const direccion = localStorage.getItem("walletAddress");

  if (conectado && direccion) {
    document.getElementById("walletAddress").textContent = direccion;
    console.log("🔄 Sesión restaurada:", direccion);
    return direccion;
  }

  console.log("⚠️ No hay sesión activa.");
  return null;
}

function cerrarSesionWallet() {
  localStorage.removeItem("walletConnected");
  localStorage.removeItem("walletAddress");
  console.log("🔓 Sesión cerrada.");
}

// Detectar conexión y guardar sesión
if (window.solana) {
  window.solana.on("connect", () => {
    guardarSesionWallet(window.solana.publicKey);
  });

  // Restaurar sesión al cargar
  document.addEventListener("DOMContentLoaded", () => {
    const direccion = cargarSesionWallet();
    if (direccion) {
      // Puedes llamar funciones como obtenerBalanceSOL() aquí si quieres
    }
  });
}

