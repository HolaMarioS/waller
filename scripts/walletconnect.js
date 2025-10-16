// walletconnect.js

// Detectar y conectar wallet
async function conectarWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();
      const walletAddress = response.publicKey.toString();
      document.getElementById("walletAddress").textContent = walletAddress;
      console.log("Wallet conectada:", walletAddress);
    } catch (err) {
      console.error("Error al conectar wallet:", err);
      alert("No se pudo conectar la wallet.");
    }
  } else {
    alert("Wallet Phantom no detectada. Instálala desde https://phantom.app");
  }
}

// Escuchar botón de conexión
document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("connectWallet");
  if (boton) {
    boton.addEventListener("click", conectarWallet);
  }
});
