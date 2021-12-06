const d = document 
const $btnAgregar = d.getElementById("Agregar")
const $FechaEstimada = d.getElementById("FechaEstimada")
const $Comentario = d.getElementById("Comentario")
const $Total = d.getElementById("Total")
const $FechaEstimadaEdit = d.getElementById("FechaEstimadaEdit")
const $ComentarioEdit = d.getElementById("ComentarioEdit")
const $TotalEdit = d.getElementById("TotalEdit")
const $UltimoPagoEdit = d.getElementById("UltimoPagoEdit")
const $btnEliminar = d.getElementById("Eliminar")
const $btnEditar = d.getElementById("Editar")
const $btnPagar = d.getElementById("Pagar")
const $tBody = d.getElementById("tBody")
let Monto = 0
let MontoPagado = 0
let _id


fetch("/ver-anio-administrativo", {
    method: "POST",
  })
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        Monto = response
    })

const actualizarCuentaPorPagar = async (data) => {
    return await fetch("/actualizar-pago-de-cuentas-por-pagar", {
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
        location.reload()
    })
}
const PagarCuenta = async (data) => {
    return await fetch("/registrar-pago-pendiente", {
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
        if(response.error != ""){
            d.getElementById("errors").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${response.error}.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `
        }else{
            let data = {
                _id: _id,
                MontoPagado: MontoPagado
            }
            actualizarCuentaPorPagar(data)
        }
    })
}


const EditarCuenta = async (data) => {
    return await fetch("/editar-cuenta-pagar", {
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
        if(response){
            location.reload()
        }
    })
}


const EliminarCuenta = async (data) => {
    return await fetch("/eliminar-cuenta-pagar", {
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
        if(response){
            location.reload()
        }
    })
}

const AgregarCuentaPagar = async (data) => {
    return await fetch("/agregar-cuenta-pagar", {
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
        if(response){
            location.reload()
        }
    })
}

d.addEventListener("click", e => {
    if(e.target == $btnAgregar){
        let errors = 0
        if(!$FechaEstimada.value){
            d.getElementById("errors").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                El campo "Fecha estimada" no puede estar vacia.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `

            errors++
        }
        if(!$Comentario.value){

            d.getElementById("errors").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                El campo "Comentario" no puede estar vacia.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `

            errors++
        }
        if(!$Total.value){

            d.getElementById("errors").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                El campo "Total" no puede estar vacia.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `
            errors++
        }
        if(errors == 0){

            let fecha = {
                FechaEstimada : $FechaEstimada.value,
                Comentario : ($Comentario.value).toUpperCase(),
                Total : $Total.value, 
            }
            

            AgregarCuentaPagar(fecha)

        }
    }if(e.target.textContent == "Eliminar"){
        let data = {
            Timestamp: e.target.getAttribute("data-Timestamp")
        }
        EliminarCuenta(data)
    }if(e.target.textContent == "Editar"){
        let fila = e.target.parentElement.parentElement
        let Fecha = e.target.parentElement.parentElement.children[0].textContent
        let Comentario = e.target.parentElement.parentElement.children[1].textContent
        let Total = e.target.parentElement.parentElement.children[2].textContent.replace("$", "")
        Total = Total.replace(",","")
        Total = Total.replace(",",".")
        let UltimoPago = e.target.parentElement.parentElement.children[3].textContent.replace("$", "")
        UltimoPago = UltimoPago.replace(",","")
        UltimoPago = UltimoPago.replace(",",".")
        fila.children[0].innerHTML = `<input type="date" class="form-control" value="${Fecha}">`
        fila.children[1].innerHTML = `<input type="text" class="form-control" value="${Comentario}">`
        fila.children[2].innerHTML = `<input type="number" class="form-control" value="${+Total}">`
        fila.children[3].innerHTML = `<input type="number" class="form-control" value="${+UltimoPago}">`
        fila.children[4].innerHTML = ``
        fila.children[6].innerHTML = `<button class="btn btn-success">Actualizar</button>`
    }if(e.target.textContent == "Actualizar"){
        fila = e.target.parentElement.parentElement
        let data = {
            Timestamp : fila.children[5].firstElementChild.getAttribute("data-timestamp"),
            Comentario : fila.children[1].firstElementChild.value.toUpperCase(),
            Total : fila.children[2].firstElementChild.value,
            UltimoPago : fila.children[3].firstElementChild.value,
            FechaEstimada: fila.children[0].firstElementChild.value,
        }


        EditarCuenta(data)

    }if(e.target.textContent == "Pagar"){
        fila = e.target.parentElement.parentElement
        let Timestamp = Date.now();
        let Fecha = new Date();
        let dia;
        let mes;
        let año = Fecha.getFullYear();
        if (Fecha.getDate() < 10) {
          dia = `0${Fecha.getDate()}`;
        } else {
          dia = Fecha.getDate();
        }
        if (Fecha.getMonth() + 1 < 10) {
          mes = `0${Fecha.getMonth() + 1}`;
        } else {
          mes = Fecha.getMonth() + 1;
        }
        Fecha = `${año}-${mes}-${dia}`;
        let TotalAPagar = e.target.parentElement.parentElement.children[2].textContent.replace("$", "")
        TotalAPagar = TotalAPagar.replace("$","");
        TotalAPagar = TotalAPagar.replace(",","");
        TotalAPagar = parseFloat(TotalAPagar);
        let TotalCuenta = (+TotalAPagar - +fila.children[4].firstElementChild.value).toFixed(2)
        let Total = (+Monto -  +fila.children[4].firstElementChild.value).toFixed(2)
        dia = {
            Timestamp: Timestamp,
            Fecha: Fecha,
            Entrada: 0,
            Salida: fila.children[4].firstElementChild.value,
            Comentario: fila.children[1].textContent,
        }
        let Mes
        if(Fecha.substr(5,2) == 01){Mes = "ENERO"}
        if(Fecha.substr(5,2) == 02){Mes = "FEBRERO"}
        if(Fecha.substr(5,2) == 03){Mes = "MARZO"}
        if(Fecha.substr(5,2) == 04){Mes = "ABRIRL"}
        if(Fecha.substr(5,2) == 05){Mes = "MAYO"}
        if(Fecha.substr(5,2) == 06){Mes = "JUNIO"}
        if(Fecha.substr(5,2) == 07){Mes = "JULIO"}
        if(Fecha.substr(5,2) == 08){Mes = "AGOSTO"}
        if(Fecha.substr(5,2) == 09){Mes = "SEPTIEMBRE"}
        if(Fecha.substr(5,2) == 10){Mes = "OCTUBRE"}
        if(Fecha.substr(5,2) == 11){Mes = "NOVIEMBRE"}
        if(Fecha.substr(5,2) == 12){Mes = "DICIEMBRE"}
        let data = {
          Año: año,
          Mes: Mes,
          NumeroMes: Fecha.substr(5,2),
          dia: dia,
        }
        _id = e.target.getAttribute("data-ide")
        MontoPagado = +dia.Salida
        PagarCuenta(data)
    }
})

document.addEventListener("keydown", e => {
    if(e.keyCode == 120 ){
        window.open('/facturacion/acceso-directo-stock', 'Stock', "width=1400, heigh=100%")
    }
})