import Solflare from '@solflare-wallet/sdk';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const wallet = new Solflare();
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

wallet.on('connect', async () => {
  const pubKey = wallet.publicKey.toString();
  console.log('✅ Conectado:', pubKey);

  // Mostrar clave pública
  document.getElementById("wallet-balance").textContent = `✔️ ${pubKey}`;

  // Obtener balance en SOL
  const balanceLamports = await connection.getBalance(new PublicKey(pubKey));
  const balanceSOL = balanceLamports / 1e9;
  document.getElementById("wallet-balance").textContent = `💰 ${balanceSOL.toFixed(4)} SOL`;

  // Mostrar tokens SPL
  await mostrarTokens(wallet.publicKey);
});

wallet.on('disconnect', () => {
  console.log('❌ Desconectado');
  document.getElementById("wallet-balance").textContent = "Desconectado";
  document.getElementById("tokens").innerHTML = "";
});

export async function conectarWallet() {
  try {
    await wallet.connect();
  } catch (error) {
    console.error('Error al conectar:', error);
  }
}

async function mostrarTokens(publicKey) {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  const tokensDiv = document.getElementById("tokens");
  tokensDiv.innerHTML = "<h3>Tokens SPL:</h3>";

  tokenAccounts.value.forEach((accountInfo) => {
    const tokenAmount = accountInfo.account.data.parsed.info.tokenAmount;
    const mintAddress = accountInfo.account.data.parsed.info.mint;

    if (tokenAmount.uiAmount > 0) {
      const tokenDiv = document.createElement("div");
      tokenDiv.textContent = `🪙 ${mintAddress}: ${tokenAmount.uiAmount}`;
      tokensDiv.appendChild(tokenDiv);
    }
  });
}
import './style.css';
document.getElementById("btn-qr").onclick = () => {
  window.location.href = "/qr.html";
};
import './walletconnect.js';

document.getElementById("connect-wallet").onclick = () => {
  // Aquí puedes disparar la conexión si no se ha iniciado
};
document.getElementById("logout-btn").onclick = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
};
// session.js
const user = localStorage.getItem("loggedInUser");

if (!user) {
  alert("Debes iniciar sesión para acceder a esta sección.");
  window.location.href = "login.html";
}
localStorage.setItem("walletPublicKey", publicKey);
document.getElementById("wallet-key").textContent = localStorage.getItem("walletPublicKey") || "No conectada";
const walletKey = localStorage.getItem("walletPublicKey");
if (!walletKey) {
  alert("Conecta tu wallet para acceder a funciones avanzadas.");
  // Puedes redirigir o desactivar botones aquí
}

localStorage.removeItem("loggedInUser");
localStorage.removeItem("walletPublicKey");
window.location.href = "login.html";

setInterval(getBalance, 10000); // cada 10 segundos
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

const conection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const publicKey = new PublicKey(localStorage.getItem("walletPublicKey"));

async function updateBalance() {
  const lamports = await connection.getBalance(publicKey);
  const sol = lamports / LAMPORTS_PER_SOL;
  document.getElementById("balance-value").textContent = sol.toFixed(4) + " SOL";
}

updateBalance();
setInterval(updateBalance, 10000); // cada 10 segundos
document.getElementById("btn-qr").onclick = () => {
  document.getElementById("qr-panel").style.display = "block";
};
document.getElementById("connectWallet").addEventListener("click", async () => {
  if (window.solana) {
    try {
      const response = await window.solana.connect();
      document.getElementById("walletAddress").textContent = response.publicKey.toString();
    } catch (err) {
      console.error("Error al conectar wallet:", err);
    }
  } else {
    alert("Wallet no detectada. Instala Phantom o Solflare.");
  }
});
document.getElementById("checkBalance").addEventListener("click", async () => {
  if (window.solana && window.solana.isConnected) {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl("mainnet-beta"),
      "confirmed"
    );
    const publicKey = window.solana.publicKey;
    const balance = await connection.getBalance(publicKey);
    document.getElementById("solBalance").textContent = (balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
  } else {
    alert("Wallet no conectada.");
  }
});
