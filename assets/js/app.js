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
        return data
    } catch (error) {
        console.error('Error al obtener los datos:', error) 
    }
}

$btnConvertir.addEventListener('click', async () => {
    const selectMoneda = document.getElementById('moneda').value
    const valorMoneda = await getMonedas(selectMoneda)
    console.log(valorMoneda)
    const valorActual = valorMoneda.serie[0].valor

    if (isNaN($valorCLP.value) || $valorCLP.value <= 0) {
        $resultado.classList.add('warning')
        mostrarResultado('Por favor, ingresa un monto válido en CLP') 
        return
    }

    const montoCLP = Number($valorCLP.value)
    monedaConvertida = (montoCLP / valorActual).toFixed(2)

    const simbol = selectMoneda === 'dolar' ? 'USD' : '€' 
    mostrarResultado(`Resultado: ${monedaConvertida} ${simbol}`)
    $valorCLP.value = ''
})

$valorCLP.addEventListener('input', () => {
    $resultado.classList.remove('warning')
    mostrarResultado('')
})