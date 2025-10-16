# verificar-rutas.ps1

Write-Host "`n🔍 Verificando rutas en wallet.html..." -ForegroundColor Cyan

# 1. Cargar contenido del HTML
$html = Get-Content ".\wallet.html" -Raw

# 2. Buscar enlaces a CSS y JS
$cssRutas = ($html -split "`n") | Where-Object { $_ -match "<link.*href=" }
$jsRutas = ($html -split "`n") | Where-Object { $_ -match "<script.*src=" }

# 3. Extraer rutas
function extraerRuta($linea) {
  if ($linea -match 'href=["'']([^"'']+)["'']') { return $matches[1] }
  elseif ($linea -match 'src=["'']([^"'']+)["'']') { return $matches[1] }
  else { return $null }
}

# 4. Verificar existencia de cada archivo
foreach ($linea in $cssRutas + $jsRutas) {
  $ruta = extraerRuta $linea
  if ($ruta) {
    $rutaLocal = Join-Path $PWD.Path $ruta
    if (Test-Path $rutaLocal) {
      Write-Host "✅ Ruta válida: $ruta"
    } else {
      Write-Host "❌ Ruta rota: $ruta → No se encuentra en el sistema" -ForegroundColor Red
    }
  }
}

Write-Host "`n✅ Verificación completa. Corrige las rutas rotas marcadas en rojo." -ForegroundColor Green
