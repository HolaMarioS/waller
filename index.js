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
