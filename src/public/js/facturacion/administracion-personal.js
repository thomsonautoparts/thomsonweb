const d = document 
const $Entrada = d.getElementById("Entrada")
const $Salida = d.getElementById("Salida")
const $Agregar = d.getElementById("Agregar")
const $fecha = d.getElementById("fecha")
const $Comentario = d.getElementById("Comentario")
const $monto = d.getElementById("monto") 

const cerrarMes = async (data) => {
return await fetch(`/cerrar-Mes-personal`, {
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
const elimiarFecha = async (data) => {
return await fetch(`/eliminar-fecha-mes-personal`, {
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
const editMes = async (data) => {
return await fetch(`/editar-fecha-mes-personal`, {
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

const enviarNuevoMes = async (data) => {
return await fetch("/enviar-mes-administrativo-personal", {
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
    console.log(response)
    if(response.error != ""){
            d.getElementById("errors").innerHTML += `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${response.error}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        `  
    }else{
        d.getElementById("errors").innerHTML = `
              <div class="modal shadow" id="Modal" style="display: block; background-color: rgba(0,0,0,0.3); " tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                    <div class="modal-content" style="background-color: rgba(250,250,250,1);">
                        <div class="modal-body">
                                <h3 class="text-center text-success">FECHA AGREGADA CORRECTAMENTE</h3>
                            <hr class="text-light">
                                <div class="text-center">
                                    <button type="button" class="btn btn-primary mt-3" data-bs-dismiss="modal">Cerrar</button>
                                </div>
                        </form>
                        </div>
                    </div>
                    </div>
                </div>
        `

        d.addEventListener("click", e=> {
            if(e.target.textContent == "Cerrar"){
                location.reload()
            }
        })
    }

})
}


$Entrada.onchange = () => {
    if($Entrada.value){
        $Salida.setAttribute("readonly","")
        $Salida.removeAttribute("placeholder")
    }else{
        $Salida.setAttribute("placeholder","Ingrese salida")
        $Salida.removeAttribute("readonly")
    }
}
$Salida.onchange = () => {
    if($Salida.value){
        $Entrada.setAttribute("readonly","")
        $Entrada.removeAttribute("placeholder")
    }else{
        $Entrada.setAttribute("placeholder","Ingrese entrada")
        $Entrada.removeAttribute("readonly")
    }
}

d.addEventListener("click", e=> {
if(e.target == $Agregar){
    let errors = 0
    if(!$Entrada.value && !$Salida.value){
        d.getElementById("errors").innerHTML += `
           <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Debe introducir una entrada o salida.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        `   
        errors ++
    }
    if(!$fecha.value){
        d.getElementById("errors").innerHTML += `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Debe introducir una fecha.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        `   
        errors ++
    }
    if(!$Comentario.value){
          d.getElementById("errors").innerHTML += `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Debe introducir un comentario.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `   
         errors ++
    }
    if(errors == 0){
        let Timestamp = Date.now();
        let Mes
        let Año = $fecha.value.substr(0,4)
        let Monto
        let Total = 0

        if($monto.value == 0){
            Monto = 0
        }else{
            Monto = $monto.value.replaceAll("$","")
            Monto = Monto.replaceAll(",","")
            Monto = +Monto
        }
        Total = (+Monto + +$Entrada.value - +$Salida.value).toFixed(2)
        if($fecha.value.substr(5,2) == 01){Mes = "ENERO"}
        if($fecha.value.substr(5,2) == 02){Mes = "FEBRERO"}
        if($fecha.value.substr(5,2) == 03){Mes = "MARZO"}
        if($fecha.value.substr(5,2) == 04){Mes = "ABRIRL"}
        if($fecha.value.substr(5,2) == 05){Mes = "MAYO"}
        if($fecha.value.substr(5,2) == 06){Mes = "JUNIO"}
        if($fecha.value.substr(5,2) == 07){Mes = "JULIO"}
        if($fecha.value.substr(5,2) == 08){Mes = "AGOSTO"}
        if($fecha.value.substr(5,2) == 09){Mes = "SEPTIEMBRE"}
        if($fecha.value.substr(5,2) == 10){Mes = "OCTUBRE"}
        if($fecha.value.substr(5,2) == 11){Mes = "NOVIEMBRE"}
        if($fecha.value.substr(5,2) == 12){Mes = "DICIEMBRE"}
        let dia = {
            Timestamp: Timestamp,
            Fecha: $fecha.value,
            Monto: Monto,
            Entrada: $Entrada.value,
            Salida: $Salida.value,
            Total: Total,
            Comentario: $Comentario.value,
        }
        let data = {
          Año: Año,
          Mes: Mes,
          NumeroMes: $fecha.value.substr(5,2),
          dia: dia,
        }
        enviarNuevoMes(data)
    }
}
if(e.target.textContent == "Editar"){
    let fila = e.target.parentElement.parentElement
    let Estado = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.textContent
    if(Estado == "(CERRADO)"){
           d.getElementById("errors").innerHTML += `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            El mes a editar se encuentra en estado "Cerrado".
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        `  
    }else{
        let id = fila.children[6].firstElementChild.getAttribute("data-ide")
        fila.children[2].innerHTML = `<td><input type="number" step="any" class="form-control" value="${fila.children[2].getAttribute("data-valor")}"></td>`
        fila.children[3].innerHTML = `<td><input type="number" step="any" class="form-control" value="${fila.children[3].getAttribute("data-valor")}"></td>`
        fila.children[4].innerHTML = `<td><input type="text" class="form-control" value="${fila.children[4].textContent}"></td>`
        fila.children[6].innerHTML = `<td><a href="#" data-ide="${id}" class="text-success">Actualizar</a> <a href="#" class="text-danger">Eliminar</a></td>`
    

    }
}
if(e.target.textContent == "Actualizar"){
    let fila = e.target.parentElement.parentElement
    let id = fila.children[6].firstElementChild.getAttribute("data-ide")
    if(!fila.children[2].firstElementChild.value && !fila.children[3].firstElementChild.value){
          d.getElementById("errors").innerHTML += `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Para poder actualizar debe introducir una entrada o una salida.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        `  
    }else{
        let Monto = fila.children[1].textContent
        Monto = Monto.replaceAll("$","")
        Monto = Monto.replaceAll(",","")
    let data = {
        fecha: fila.children[0].textContent,
        _id: id, 
        Monto:Monto,
        Entrada:fila.children[2].firstElementChild.value,
        Salida: fila.children[3].firstElementChild.value,
        Comentario: fila.children[4].firstElementChild.value
    }

        editMes(data)

    }
}
if(e.target.textContent == "Eliminar"){
    console.log("Eliminar")
    let fila = e.target.parentElement.parentElement
    let id = fila.children[6].firstElementChild.getAttribute("data-ide")
    let data = {
        fecha: fila.children[0].textContent,
        _id: id, 

    }
    console.log(data)
    elimiarFecha(data)

}
if(e.target.textContent == "CERRAR MES"){
   let _id = e.target.getAttribute("data-mes")
    d.getElementById("errors").innerHTML = `
        <div class="modal shadow" id="Modal" style="display: block; background-color: rgba(0,0,0,0.3); " tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content" style="background-color: rgba(250,250,250,1);">
                <div class="modal-body">
                        <h4 class="text-center text-dark">¿Estas seguro que quieres cerrar el mes?</h3>
                    <hr class="text-light">
                        <div class="text-center">
                            <button type="button" class="btn btn-primary mt-3" data-mesId="${_id}" data-bs-dismiss="modal">CERRAR</button>
                        </div>
                </form>
                </div>
            </div>
            </div>
        </div>
`

}
if(e.target.textContent == "CERRAR"){
   let id = e.target.getAttribute("data-mesId")
   let data = {
       _id: id
   }
   cerrarMes(data)
}

})