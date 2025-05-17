const $btnConvertir = document.querySelector('#convertir')
const $resultado = document.querySelector('#resultado')
const $selectMoneda = document.getElementById('moneda')
const $valorCLP = (document.getElementById('monto'))


async function getMonedas() {
    try {
        const dolar = await fetch('https://mindicador.cl/api/dolar')
        const euro = await fetch('https://mindicador.cl/api/euro')
        
        const dataDolar = await dolar.json()
        const dataEuro = await euro.json()

        const valorActualDolar = dataDolar.serie[0].valor
        const valorActualEuro = dataEuro.serie[0].valor

        return { valorActualDolar, valorActualEuro }

    } catch (error) {
        console.error('Error al obtener los datos:', error) 
    }
}

function calcularConversion(valorCLP, valorMoneda) {
    return valorCLP / valorMoneda
}

function mostrarResultado(mensaje) {
    $resultado.innerHTML = mensaje
}


async function convertirMoneda() {
    const { valorActualDolar, valorActualEuro } = await getMonedas()
    const valorDolar = valorActualDolar
    const valorEuro = valorActualEuro
    
    $btnConvertir.addEventListener('click', () => {
        const montoCLP = Number($valorCLP.value)
        const moneda = $selectMoneda.value
        let result = 0
        
        if (moneda === 'dolar') {
            result = calcularConversion(montoCLP, valorDolar)
            mostrarResultado(`Resultado: $${result.toFixed(2)} USD`)
        }
        else if (moneda === 'euro') {
            result = calcularConversion(montoCLP, valorEuro)
            mostrarResultado(`Resultado: $${result.toFixed(2)} € `)
        }
        else {
            mostrarResultado('Seleccione una moneda válida')
        }

        $valorCLP.value = ''

    })
}

convertirMoneda()
