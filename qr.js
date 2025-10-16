import QRCode from 'qrcode';

const container = document.getElementById('qr-container');
const walletAddress = 'tu_clave_publica_o_enlace';

QRCode.toCanvas(walletAddress, { width: 200 }, (err, canvas) => {
  if (err) console.error(err);
  container.appendChild(canvas);
});
.qr-image {
  border: 4px solid #0077cc;
  background-color: #e0f0ff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px #0077cc88;
  width: 220px;
}
