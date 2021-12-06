const d = document
const $SaldoTotal = d.getElementById("SaldoTotal")
const $PendienteTotal = d.getElementById("PendienteTotal")
const $CantidadTotal = d.getElementById("CantidadTotal")
const $bntFiltro2 = d.getElementById("Filtrar2")
const $Hasta = d.getElementById("Hasta")
const $Desde = d.getElementById("Desde")
const $tbody = d.getElementById("tbody")
const $Cliente = d.getElementById("Cliente")
const $contenedorBoton = d.getElementById("contenedorBoton")
const $contenedorBoton2 = d.getElementById("contenedorBoton2")
const busqueda = document.getElementById('buscar');
const table = document.getElementById("tabla").tBodies[0];
const solicitarCliente = async (data) => {
return await fetch("/solicitar-facturas-cliente", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
    "Content-type": "application/json; charset=utf-8",
    },
})
    .then((response) => {
    return response.json();
    })
    .then((response) => {
        let tr = ""
        for(i=0; i< response.facturas.length;i++){
            if(tr == ""){
                let linea = `
                <tr>
                    <td class="text-center text-light">${response.facturas[i].Factura}</td>
                    <td class="text-center text-light">${response.facturas[i].date}</td>
                    <td class="text-center text-light">${response.facturas[i].Vencimiento}</td>
                    <td class="text-center text-light">${response.facturas[i].Cliente}</td>
                    <td class="text-center text-light">${response.facturas[i].Documento}</td>
                    <td class="text-center text-light">${response.facturas[i].CantidadTotal}</td>
                    <td class="text-center text-light">${response.facturas[i].PrecioTotal}</td>
                    <td class="text-center text-light">${response.facturas[i].PendienteAPagar}</td>
                    <td class="text-center text-light">
                        <a href="/model-print/${response.facturas[i].Factura}" class="text-success">Ver</a>
                    </td>
                    <td class="text-center text-light">
                        <a href="/facturacion/historial-pagos/${response.facturas[i]._id}" class="text-success">Historial</a>
                    </td>
                    <td class="text-center text-light">
                        <a href="/factura-ajustar-vencimiento/${response.facturas[i]._id}" class="text-success">Ajustar</a>
                    </td>
                </tr>
                `
                tr = linea
            }
            else{
                let linea = `
                <tr>
                    <td class="text-center text-light">${response.facturas[i].Factura}</td>
                    <td class="text-center text-light">${response.facturas[i].date}</td>
                    <td class="text-center text-light">${response.facturas[i].Vencimiento}</td>
                    <td class="text-center text-light">${response.facturas[i].Cliente}</td>
                    <td class="text-center text-light">${response.facturas[i].Documento}</td>
                    <td class="text-center text-light">${response.facturas[i].CantidadTotal}</td>
                    <td class="text-center text-light">${response.facturas[i].PrecioTotal}</td>
                    <td class="text-center text-light">${response.facturas[i].PendienteAPagar}</td>
                    <td class="text-center text-light">
                        <a href="/model-print/${response.facturas[i].Factura}" class="text-success">Ver</a>
                    </td>
                    <td class="text-center text-light">
                        <a href="/facturacion/historial-pagos/${response.facturas[i]._id}" class="text-success">Historial</a>
                    </td>
                      <td class="text-center text-light">
                        <a href="/factura-ajustar-vencimiento/${response.facturas[i]._id}" class="text-success">Ajustar</a>
                    </td>
                </tr>
                `
                tr += linea
            }
            $tbody.innerHTML = tr
            
        }
        console.log(response)
        $CantidadTotal.textContent = response.CantidadTotalGeneral
        $SaldoTotal.textContent = response.TotalSaldo
        $PendienteTotal.textContent = response.TotalNeto
    });
};

document.addEventListener("keydown", e => {
    if(e.keyCode == 120 ){
        window.open('/facturacion/acceso-directo-stock', 'Stock', "width=1400, heigh=100%")
    }
})
busqueda.addEventListener("keydown", e => {
    if(e.keyCode == 13){
    e.preventDefault()
    }
})
buscaTabla = function () {
    texto = busqueda.value.toLowerCase();
    let r = 0;
    while (row = table.rows[r++]) {
        if (row.innerText.toLowerCase().indexOf(texto) !== -1)
            row.style.display = null;
        else
            row.style.display = 'none';
    }
}
busqueda.addEventListener('keyup', buscaTabla);

$Cliente.onchange = () => {
    if($Cliente.value != 0){
        let data = {
            Cliente: $Cliente.value,
            Desde : $Desde.value,
            Hasta : $Hasta.value,   
            }
        solicitarCliente(data)
    }else{
        if($Hasta.value && $Desde.value ){
            let data = {
                Cliente: $Cliente.value,
                Desde : $Desde.value,
                Hasta : $Hasta.value,   
                }
            solicitarCliente(data) 
        }else{
            alert("Debe ingresar datos de busqueda")
        }
    }
}

$(document).ready(function () {
$(".js-exam").select2();
})
