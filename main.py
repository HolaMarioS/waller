import json
import re
import getpass
import hashlib

def hash_clave(clave):
    return hashlib.sha256(clave.encode()).hexdigest()

CONFIG_FILE = "config.json"
USERS_FILE = "users.json"
TRANSACTIONS_FILE = "transactions.json"

# 📁 Cargar configuración
def load_config():
    with open(CONFIG_FILE, "r") as f:
        return json.load(f)

# 📁 Cargar y guardar usuarios
def load_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

# 📁 Cargar y guardar transacciones
def load_transactions():
    with open(TRANSACTIONS_FILE, "r") as f:
        return json.load(f)

def save_transactions(txns):
    with open(TRANSACTIONS_FILE, "w") as f:
        json.dump(txns, f, indent=2)

# 📧 Validar correo
def validar_correo(correo):
    patron = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(patron, correo)

# 🔐 Autenticación
def autenticar_usuario(username):
    users = load_users()
    if username not in users:
        print("❌ Usuario no encontrado.")
        return False
    clave = getpass.getpass("Ingresa tu clave: ")
    if hash_clave(clave) != users[username]["clave"]:
        print("🔒 Clave incorrecta.")
        return False
    return True

# 👤 Registro de usuario
def register_user(username, email):
    users = load_users()
    if username in users:
        print("⚠️ Usuario ya existe.")
        return
    if not validar_correo(email):
        print("❌ Correo inválido.")
        return
    if email == load_config()["admin_email"]:
        print("⚠️ Ese correo está reservado para el administrador.")
        return
    clave = getpass.getpass("Crea una clave secreta: ")
    users[username] = {
        "email": email,
        "balance": 0,
        "clave": hash_clave(clave),
        "is_admin": False
    }
    save_users(users)
    print(f"✅ Usuario {username} registrado con éxito.")

# 💰 Depósito
def deposit(username, amount):
    if not autenticar_usuario(username):
        return
    config = load_config()
    users = load_users()
    if username not in users:
        print("❌ Usuario no encontrado.")
        return
    fee = round(amount * config["deposit_fee_percent"] / 100, 8)
    net = round(amount - fee, 8)
    users[username]["balance"] += net
    users["admin"]["balance"] += fee
    save_users(users)
    print(f"💰 {net} CBC añadidos a {username}. Comisión de {fee} CBC enviada al admin.")

# 🔁 Envío entre usuarios
def send_funds(sender, receiver, amount):
    if not autenticar_usuario(sender):
        return
    users = load_users()
    if sender not in users or receiver not in users:
        print("❌ Usuario no encontrado.")
        return
    if users[sender]["balance"] < amount:
        print("⚠️ Saldo insuficiente.")
        return
    users[sender]["balance"] -= amount
    users[receiver]["balance"] += amount
    save_users(users)

    txns = load_transactions()
    txns.append({
        "from": sender,
        "to": receiver,
        "amount": amount
    })
    save_transactions(txns)
    print(f"✅ {amount} CBC enviados de {sender} a {receiver}.")

# 📊 Ver transacciones
def ver_transacciones(usuario):
    if not autenticar_usuario(usuario):
        return
    txns = load_transactions()
    print(f"📄 Transacciones de {usuario}:")
    for t in txns:
        if t["from"] == usuario or t["to"] == usuario:
            print(f" - {t['from']} → {t['to']}: {t['amount']} CBC")

# 🔐 Mostrar hashes
def mostrar_hashes():
    users = load_users()
    print("🔐 Claves encriptadas de usuarios:")
    for username, data in users.items():
        clave = data.get("clave", "")
        if len(clave) == 64 and all(c in "0123456789abcdef" for c in clave.lower()):
            print(f"✅ {username}: clave en formato SHA-256")
        else:
            print(f"⚠️ {username}: clave NO encriptada o formato incorrecto")

# 🧪 Validar datos de usuarios
def validar_datos_usuarios():
    users = load_users()
    print("🧪 Validando correos y balances de usuarios:")
    for username, data in users.items():
        correo = data.get("email", "")
        balance = data.get("balance", None)
        if validar_correo(correo):
            print(f"✅ {username}: correo válido ({correo})")
        else:
            print(f"⚠️ {username}: correo inválido ({correo})")
        if isinstance(balance, (int, float)) and balance >= 0:
            print(f"✅ {username}: balance válido ({balance} CBC)")
        else:
            print(f"⚠️ {username}: balance inválido ({balance})")

# 🔍 Validar transacciones
def validar_transacciones():
    txns = load_transactions()
    print("🧪 Validando transacciones:")
    for i, t in enumerate(txns):
        origen = t.get("from")
        destino = t.get("to")
        cantidad = t.get("amount")
        errores = []
        if not isinstance(origen, str) or origen.strip() == "":
            errores.append("origen inválido")
        if not isinstance(destino, str) or destino.strip() == "":
            errores.append("destino inválido")
        if not isinstance(cantidad, (int, float)) or cantidad <= 0:
            errores.append("cantidad inválida")
        if errores:
            print(f"⚠️ Transacción #{i + 1} con errores: {', '.join(errores)}")
        else:
            print(f"✅ Transacción #{i + 1} válida: {origen} → {destino}, {cantidad} CBC")

# 💎 Emisión RIM
reserva_global = 6_000_000_000_000
usuarios = {
    "Mario": {
        "saldo": 0,
        "rol": "admin"
    }
}

def emitir_rim(destinatario, cantidad):
    global reserva_global
    if destinatario in usuarios:
        if cantidad <= reserva_global:
            usuarios[destinatario]["saldo"] += cantidad
            reserva_global -= cantidad
            print(f"✅ Se emitieron {cantidad} RIM a {destinatario}.")
            print(f"Nuevo saldo de {destinatario}: {usuarios[destinatario]['saldo']} RIM")
            print(f"Reserva restante: {reserva_global} RIM")
        else:
            print("❌ No hay suficiente RIM en la reserva.")
    else:
        print("❌ Usuario no encontrado.")

# 🔄 Conversión RIM a cripto
intercambios = {
    "BTC": {"tasa": 0.000000015},
    "ETH": {"tasa": 0.00000025},
    "USDT": {"tasa": 0.0001}
}

def convertir_rim_a_btc(cantidad_rim, tasa_rim_btc):
    return cantidad_rim * tasa_rim_btc

def enviar_rim(destino_wallet, cantidad, usuario):
    if usuarios[usuario]["saldo"] >= cantidad:
        usuarios[usuario]["saldo"] -= cantidad
        print(f"✅ {cantidad} RIM enviados a {destino_wallet}")
    else:
        print("❌ Saldo insuficiente.")

def recibir_rim(origen_wallet, cantidad, usuario):
    usuarios[usuario]["saldo"] += cantidad
    print(f"✅ {cantidad} RIM recibidos desde {origen_wallet}")

# 🧭 Menú principal
if __name__ == "__main__":
    print("🌐 Bienvenido a RIM Wallet")
    opcion = input("¿Registrar usuario (r), depositar (d), enviar (s), ver transacciones (t), ver hashes (h), validar usuarios (v), validar transacciones (x)? ")

    if opcion == "r":
        u = input("Nombre de usuario: ")
        e = input("Correo: ")
        register_user(u, e)

    elif opcion == "d":
        u = input("Usuario: ")
        try:
            a = float(input("Cantidad a depositar: "))
            deposit(u, a)
        except ValueError:
            print("❌ Cantidad inválida.")

  

                       