const d = document
const $agregados = d.getElementById("agregados")
const $agregadosPrecio = d.getElementById("agregadosPrecio")
const $tbody = d.getElementById("tbody")
const busqueda = d.getElementById("buscar");
const table = d.getElementById("tabla").tBodies[0];
const garantias = d.getElementById("Garantias")
let acepto

buscaTabla = function () {
    texto = busqueda.value.toLowerCase();
    let r = 0;
    while ((row = table.rows[r++])) {
      if (row.innerText.toLowerCase().indexOf(texto) !== -1)
        row.style.display = null;
      else row.style.display = "none";
    }
  };

busqueda.addEventListener("keyup", buscaTabla);

//fetch para cambiar cantidad 
const cambiarCantidad = async (data) => {
    return await fetch("/cambiar-cantidad-producto-lista", {
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
            d.getElementById("message").innerHTML = ``
        }else{
          d.getElementById("message").innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Ocurrio un problema inesperado al intentar registrar los productos. Por favor, comunicate con soporte. 
          </div>
          `
          window.scrollTo(0,0)
        }
      });
  };


//fetch para eliminar producto de la lista
const eliminarProducto = async (data) => {
    return await fetch("/eliminar-producto-lista", {
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
            d.getElementById("message").innerHTML = `
            <div class="mt-2 alert alert-success alert-dismissible fade show" role="alert">
              Producto eliminado de la lista correctamente. 
            </div>
            `
            window.scrollTo(0,0)
        }else{
          d.getElementById("message").innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Ocurrio un problema inesperado al intentar registrar los productos. Por favor, comunicate con soporte. 
          </div>
          `
        }
      });
  };
//fetch para enviar orden
const enviarOrden = async (data) => {
  return await fetch("/registrar-orden", {
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
      d.body.innerHTML += `
      <div class="modal rounded" id="Modal" style="display: block; background-color: rgba(0,0,0,0.7)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content rounded" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-body">
            <h3 class="text-light text-center">Orden registrada correctamente</h3>
              <div class="row">
                <div class="col-sm-12 text-center">
                  <img src="/css/assets/check.png"/ width="360px" height="295px">
                </div>
                <div class="col-sm-12 text-center">
                  <a href="/consultar-ordenes" class="btn btn-warning" style="font-size: 20px;">Ir a consulta de ordenes</a>    
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
      `
      d.addEventListener("click", e => {
        if(e.target.textContent != "Ir a consulta de ordenes"){
          location.reload()
        }
      })
      }else{
        d.getElementById("message").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Ocurrio un problema inesperado al intentar registrar los productos. Por favor, comunicate con soporte. 
        </div>
        `
        window.scrollTo(0,0)
      }
    });
};



//ruta para recibir info de la lista de compra temporal

fetch("/ver-lista-compra", {
    method: "POST",
  })
    .then((response) => {
      return response.json();
    })
    .then((respuesta) => {
      if(respuesta){

        $agregados.textContent = respuesta.CantidadTotal
        $agregadosPrecio.textContent = `$${respuesta.PrecioTotal}`
        
        for(i= 0 ; i< respuesta.Productos.length; i++){
    let tr = `
    <tr style="background-color: rgba(0,0,0,0.3);">
    <td class="text-light text-center"><p>${respuesta.Productos[i].CodigoT}</p></td>
    <td class="text-light text-center"><p>${respuesta.Productos[i].CodigoG}</p></td>
    <td class="text-light text-center"><p>${respuesta.Productos[i].Descripcion}</p></td>
    <td class="text-light text-center"><p>${respuesta.Productos[i].TipoProducto}</p></td>
    <td class="text-light text-center"><p>${respuesta.Productos[i].Posicion}</p></td>
    <td class="text-light text-center"><p>${respuesta.Productos[i].Modelo}</p></td>
    <td class="text-light text-center"><p>$${respuesta.Productos[i].PrecioUnidad}</p></td>
    <td class="text-light text-center"><p>$${respuesta.Productos[i].PrecioTotal}</p></td>
    <td class="text-light text-center"><input type="number" min="1" class="cantidad form-control" 
    data-valorAnterior="${respuesta.Productos[i].Cantidad}" data-PrecioAnterior="${respuesta.Productos[i].PrecioTotal}"
    value="${respuesta.Productos[i].Cantidad}" style="background-color: white;"></td>
    <td class="text-light text-center"><button class="btn btn-danger">Eliminar</button></td>
    </tr>
    `
    $tbody.innerHTML += tr
  }
}

    d.addEventListener("click", e => {
        if(e.target == garantias){
          if(!acepto){
            acepto = true
            return
          }if(acepto == true){
            acepto = false
          }
        }

        if(e.target.textContent == "Eliminar"){
            fila = e.target.parentElement.parentElement
            $agregados.textContent = +$agregados.textContent - +fila.children[8].firstElementChild.value
            $agregadosPrecio.textContent = (+$agregadosPrecio.textContent.replace("$", "") - +fila.children[7].firstElementChild.textContent.replace("$","")).toFixed(2)
            console.log($agregadosPrecio.textContent.substr(1, $agregadosPrecio.textContent.length))
            $agregadosPrecio.textContent = `$${$agregadosPrecio.textContent}`
            $tbody.removeChild(e.target.parentElement.parentElement)
            let producto = {
                CodigoT: fila.children[0].firstElementChild.textContent
            }
            eliminarProducto(producto)
        }if(e.target.textContent == "Registrar"){
          if($agregados.textContent == "" || $agregados.textContent == 0){
            d.getElementById("message").innerHTML = `
            <div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
              Para registrar una orden de compra debe agregar mas de 1 producto. 
            </div>
            `
          }else{
            if(acepto == true){

              e.preventDefault()
              let registrado = {Ok : "Registrado"}
              enviarOrden(registrado)
            }else{
              d.getElementById("message").innerHTML = `
              <div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
                Para registrar la orden debe aceptar los terminos de devolución y garantías. 
              </div>
              `

            }
          }
        }
    })
    d.addEventListener("change", e => {
        if(e.target.classList.contains("cantidad")){
            let fila = e.target.parentElement.parentElement
            let valorAnterior = e.target.getAttribute("data-valorAnterior")
            let precioAnterior = e.target.getAttribute("data-precioAnterior")
            let valor = e.target.value
            let precio = (+valor * +fila.children[6].firstElementChild.textContent.replace("$","")).toFixed(2)
            fila.children[7].firstElementChild.textContent = `$${precio}`
            $agregados.textContent = +$agregados.textContent - +valorAnterior
            $agregados.textContent = +$agregados.textContent + +valor
            $agregadosPrecio.textContent = (+$agregadosPrecio.textContent.replace("$", "") - +precioAnterior).toFixed(2)
            $agregadosPrecio.textContent = (+$agregadosPrecio.textContent + +precio).toFixed(2) 
            $agregadosPrecio.textContent = `$${$agregadosPrecio.textContent}`
            e.target.setAttribute("data-valorAnterior", valor)
            e.target.setAttribute("data-precioAnterior", precio)

            let orden = {
                CodigoT: fila.children[0].firstElementChild.textContent,
                Cantidad: valor,
                Precio: precio,
                CantidadTotal: $agregados.textContent,
                PrecioTotal: $agregadosPrecio.textContent.replace("$", "")
            }
            cambiarCantidad(orden)
        }
    })
})