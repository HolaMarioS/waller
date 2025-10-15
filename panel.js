
  import Solflare from 'https://cdn.skypack.dev/@solflare-wallet/sdk';

  const wallet = new Solflare();

  wallet.on('connect', () => {
    console.log('Conectado a Solflare:', wallet.publicKey.toString());
    document.getElementById("wallet-balance").textContent = "Conectado ✔️";
  });

  wallet.on('disconnect', () => {
    console.log('Desconectado de Solflare');
    document.getElementById("wallet-balance").textContent = "Desconectado ❌";
  });

  // Botón para conectar
  document.getElementById("connect-solflare").addEventListener("click", async () => {
    try {
      await wallet.connect();
    } catch (error) {
      console.error("Error al conectar:", error);
    }
  });

