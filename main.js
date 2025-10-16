// src/main.js

// 🧠 Lógica QR
import { generateQRCode } from './core/qrcode.js';

// 🎨 Renderizado visual
import { renderSVG } from './renderer/svg.js';
import { renderTerminal } from './renderer/terminal.js';

// 🛠️ Utilidades
import { encodeKanji } from './helper/to-sjis.js';

// 💼 Funciones de wallet
import { connectWallet } from './scripts/walletconnect.js';
import { getBalance } from './scripts/balance.js';
import { verifySession } from './scripts/session.js';

// 🧾 Paneles HTML
import { loadPanel } from './templates/panel.js';

// 🎭 Estilos
import './styles/style.css';

// 🚀 Ejecución principal
function startApp() {
  verifySession();
  connectWallet();
  loadPanel();

  const qr = generateQRCode("Rey de Ventas");
  renderSVG(qr);
  renderTerminal(qr);
}

// ⏯️ Ejecutar al cargar
startApp();
