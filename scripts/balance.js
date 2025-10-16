// balance.js

const tokenMap = {
  "EPjFWdd5AufqSSqeM2qTz3TnY3mKXhMZgqZz3Wz5z4k": { nombre: "USDC", icono: "usdc.svg" },
  "Es9vMFrzaCERz3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z": { nombre: "USDT", icono: "usdt.svg" },
  "4k3Dyjzvzp8e3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z": { nombre: "Raydium", icono: "ray.svg" },
  "SRMuA3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3": { nombre: "Serum", icono: "serum.svg" },
  "DezXz3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3": { nombre: "Bonk", icono: "bonk.svg" },
  "mSoLz3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3": { nombre: "mSOL", icono: "msol.svg" },
  "7dHbW3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3": { nombre: "stSOL", icono: "stsol.svg" },
  "JitoG3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3": { nombre: "JitoSOL", icono: "jito.svg" }
};

async function obtenerBalanceSOL() {
  if (window.solana && window.solana.isConnected) {
    try {
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl("mainnet-beta"),
        "confirmed"
      );
      const publicKey = window.solana.publicKey;
      const balanceLamports = await connection.getBalance(publicKey);
      const balanceSOL = balanceLamports / solanaWeb3.LAMPORTS_PER_SOL;

      document.getElementById("solBalance").textContent = balanceSOL.toFixed(4);
      console.log("Balance SOL actualizado:", balanceSOL);
    } catch (err) {
      console.error("Error al obtener balance SOL:", err);
      alert("No se pudo obtener el balance.");
    }
  } else {
    console.warn("Wallet no conectada.");
  }
}

async function obtenerTokensSPL() {
  if (window.solana && window.solana.isConnected) {
    try {
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl("mainnet-beta"),
        "confirmed"
      );
      const publicKey = window.solana.publicKey;
      const tokens = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      });

      const contenedor = document.getElementById("splTokens");
      contenedor.innerHTML = "";

      tokens.value.forEach((account) => {
        const info = account.account.data.parsed.info;
        const cantidad = parseFloat(info.tokenAmount.uiAmountString);
        const mint = info.mint;

        if (cantidad > 0) {
          const token = tokenMap[mint] || { nombre: mint.slice(0, 4), icono: "default.svg" };

          const tokenDiv = document.createElement("div");
          tokenDiv.className = "token-item";
          tokenDiv.innerHTML = `
            <img src="assets/icons/${token.icono}" alt="${token.nombre}" class="token-icon" />
            <span><strong>${token.nombre}:</strong> ${cantidad.toFixed(4)}</span>
          `;
          contenedor.appendChild(tokenDiv);
        }
      });
    } catch (err) {
      console.error("Error al obtener tokens SPL:", err);
    }
  }
}

// Activar al conectar wallet o al cargar
document.addEventListener("DOMContentLoaded", () => {
  if (window.solana) {
    window.solana.on("connect", () => {
      obtenerBalanceSOL();
      obtenerTokensSPL();
    });

    if (window.solana.isConnected) {
      obtenerBalanceSOL();
      obtenerTokensSPL();
    }
  }

  const boton = document.getElementById("checkBalance");
  if (boton) {
    boton.addEventListener("click", () => {
      obtenerBalanceSOL();
      obtenerTokensSPL();
    });
  }
});
