import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

// Inicializa el conector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // servidor de comunicación
  qrcodeModal: QRCodeModal,
});

// Si no hay sesión activa, crea una nueva
if (!connector.connected) {
  connector.createSession();
}

// Escucha eventos
connector.on("connect", (error, payload) => {
  if (error) throw error;
  const { accounts, chainId } = payload.params[0];
  console.log("Conectado:", accounts, "Chain:", chainId);
});

connector.on("disconnect", (error, payload) => {
  if (error) throw error;
  console.log("Desconectado");
});
