const $btnConvertir = document.querySelector('#convertir')
const $resultado = document.querySelector('#resultado')
const $valorCLP = (document.getElementById('monto'))
const $selectMoneda = document.querySelector('#moneda')
const url = 'https://mindicador.cl/api'
let chartInstance = null

async function cargarOpcionesMonedas() {
    try {
        const res = await fetch(url)
        data = await res.json()
        
        for (const moneda in data) {
            if (moneda === 'dolar' || moneda === 'euro') {
                const option = document.createElement('option')
                option.value = moneda
                option.innerText = moneda.charAt(0).toUpperCase() + moneda.slice(1).toLowerCase()
                $selectMoneda.appendChild(option)
            }
        }
    } catch (error) {
        mostrarResultado('Error al cargar las opciones de monedas')
        console.error(error)
    }   
}

cargarOpcionesMonedas()

function mostrarResultado(mensaje) {
    $resultado.innerHTML = mensaje
}

async function getMoneda(moneda) {
    try {
        const res = await fetch(`${url}/${moneda}`)
        const data = await res.json()  
        return data
    } catch (error) {
        mostrarResultado('Error al obtener el valor de la moneda')
        console.error(error)
    }
}

$btnConvertir.addEventListener('click', async () => {
    const selectMoneda = document.getElementById('moneda').value
    const valorMoneda = await getMoneda(selectMoneda)
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
    renderGrafica(valorMoneda, selectMoneda) 
})

$valorCLP.addEventListener('input', () => {
    $resultado.classList.remove('warning')
    mostrarResultado('')
})

function getAndCreateDataToChart(moneda, nombreMoneda) {
    const labels = moneda.serie.slice(0, 10).map(item => item.fecha.slice(0, 10)).reverse()
    const valores = moneda.serie.slice(0, 10).map(item => item.valor).reverse()

    const datasets = [
        {
            label: `Historial últimos 10 dias - ${nombreMoneda.charAt(0).toUpperCase() + nombreMoneda.slice(1).toLowerCase()}`,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: valores
        }
    ] 

    return { labels, datasets }
}

function renderGrafica(moneda, nombreMoneda) {
    const data = getAndCreateDataToChart(moneda, nombreMoneda)

    const config = {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                },
                title: {
                    color: 'white'
                },
                tooltip: {
                    titleColor: 'white',
                    bodyColor: 'white',
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 10,
                            family: 'system-ui',
                        }
                    },
                    grid: {
                        color: 'rgba(61, 61, 61, 0.78)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(61, 61, 61, 0.78)'
                    }
                }
            }
        }
    }

    const myChart = document.getElementById('grafico')
    myChart.style.border = '1px dotted #ffffff88';
    
    if (chartInstance) chartInstance.destroy()
    chartInstance = new Chart(myChart, config)
}
