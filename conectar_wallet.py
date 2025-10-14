import os
from pywalletconnect import WalletConnect

# Cargar Project ID desde variable o directamente
project_id = "TU_PROJECT_ID"  # Reemplaza con tu ID real

try:
    # Crear sesión WalletConnect
    wc = WalletConnect(project_id=project_id)

    # Generar URI para escanear con Trust Wallet
    uri = wc.connect()
    print("🔗 Escanea este código QR con Trust Wallet:")
    print(uri)

    # Esperar conexión
    wc.wait_for_connection()
    print("✅ Conectado a Trust Wallet")

    # Obtener dirección conectada
    if wc.accounts:
        address = wc.accounts[0]
        print(f"📥 Dirección conectada: {address}")
    else:
        print("⚠️ No se detectó ninguna cuenta conectada.")

except Exception as e:
    print("❌ Error al conectar con WalletConnect:")
    print(str(e))
