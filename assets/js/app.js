const $btnConvertir = document.querySelector('#convertir')
const $resultado = document.querySelector('#resultado')
const $valorCLP = (document.getElementById('monto'))

function mostrarResultado(mensaje) {
    $resultado.innerHTML = mensaje
}

async function getMonedas(moneda) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${moneda}`)
        const data = await res.json()        
        const valorActual = data.serie[0].valor
        return valorActual
        
    } catch (error) {
        console.error('Error al obtener los datos:', error) 
    }
}

$btnConvertir.addEventListener('click', async () => {
    const selectMoneda = document.getElementById('moneda').value
    const valorActual = await getMonedas(selectMoneda)
    $resultado.classList.remove('error')

    if (isNaN($valorCLP.value) || $valorCLP.value <= 0) {
        $resultado.classList.add('error')
        mostrarResultado('Por favor, ingresa un monto válido en CLP') 
        return
    }

    const montoCLP = Number($valorCLP.value)
    monedaConvertida = (montoCLP / valorActual).toFixed(2)

    const simbol = selectMoneda === 'dolar' ? 'USD' : '€' 
    mostrarResultado(`Resultado: ${monedaConvertida} ${simbol}`)
    $valorCLP.value = ''
})

