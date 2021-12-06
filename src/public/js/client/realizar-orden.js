const busqueda = document.getElementById("buscar");
const table = document.getElementById("tabla").tBodies[0];
const d = document;
const $agregados = d.getElementById("agregados")
const $estado = d.querySelectorAll(".estado")
let productos = []
let validacionLista = ""
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

for(r=0; r < $estado.length; r++){
  if($estado[r].textContent == "PRODUCCIÓN"){
    $estado[r].parentElement.classList.add("bg-warning")
    $estado[r].parentElement.classList.add("text-dark")
  }
  if($estado[r].textContent == "SIN STOCK"){
    $estado[r].parentElement.classList.add("bg-danger")
    $estado[r].parentElement.classList.add("text-light")
  }
  if($estado[r].textContent == "TRANSITO"){
    $estado[r].parentElement.classList.add("bg-warning")
    $estado[r].parentElement.classList.add("text-dark")
  }
  if($estado[r].textContent == "STOCK"){
    $estado[r].parentElement.classList.add("bg-success")
    $estado[r].parentElement.classList.add("text-dark")
  }
} 

//post para recibir informacion de la orden temporal del cliente
fetch("/facturacion/ver-orden-temporal-cliente", {
  method: "POST",
})
  .then((response) => {
    return response.json();
  })
  .then((respuesta) => {
    if(!respuesta){
      $agregados.textContent = 0
    }else{
      for(i = 0 ; i < respuesta.Productos.length; i++){
        $agregados.textContent =  respuesta.CantidadTotal
      }
      validacionLista = respuesta.Productos
    }
  })

//Post para enviar datos de la compra al server
const envioOrdenTemporal = async (data) => {
  return await fetch("/realizar-orden/nueva", {
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
        location.href = '/lista-orden-cliente'
      }else{
        d.getElementById("message").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Ocurrio un problema inesperado al intentar registrar los productos. Por favor, comunicate con soporte. 
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
      }
    });
};

d.addEventListener("click", e => {
  if(e.target.textContent ==  "Agregar"){
    e.preventDefault()
    let fila = e.target.parentElement.parentElement
    if(validacionLista){
      let filtro = validacionLista.filter((data) => data.CodigoT == fila.children[0].firstElementChild.textContent)
      if(filtro.length > 0){ 
        console.log(filtro.length)
        d.getElementById("message").innerHTML = `
        <div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
        El producto ya se encuentra agregado a la lista. Para aumentar o disminuir la cantidad revise el codigo en "Ver lista de compra" 
        </div>
        `
        window.scrollTo(0,0)
      }else{
        if(fila.children[7].firstElementChild.value == 0){
          d.getElementById("message").innerHTML = `
          <div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
          La cantidad a agregar debe ser mayor a 0. 
          </div>
          `
          window.scrollTo(0,0)
        }else{
          d.getElementById("message").innerHTML = ``
          $agregados.textContent = +$agregados.textContent +  +fila.children[8].firstElementChild.value
          let producto = {
            CodigoT : (fila.children[0].firstElementChild.textContent),
            CodigoG : (fila.children[1].firstElementChild.textContent),
            TipoProducto :(fila.children[2].firstElementChild.textContent),
            Descripcion : (fila.children[3].firstElementChild.textContent),
            Posicion: (fila.children[4].firstElementChild.textContent),
            Modelo: (fila.children[5].firstElementChild.textContent),
            Cantidad : fila.children[8].firstElementChild.value,
            PrecioUnidad: (fila.children[7].firstElementChild.textContent).substr(1, fila.children[7].firstElementChild.textContent.length),
            PrecioTotal : (+fila.children[8].firstElementChild.value * +((fila.children[7].firstElementChild.textContent).substr(1, (fila.children[7].firstElementChild.textContent).length))).toFixed(2)
          }
          productos.push(producto)
        }
      }
    }else{
      if(fila.children[7].firstElementChild.value == 0){
        d.getElementById("message").innerHTML = `
        <div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
        La cantidad a agregar debe ser mayor a 0. 
        </div>
        `
        window.scrollTo(0,0)
      }else{
        d.getElementById("message").innerHTML = ``
        $agregados.textContent = +$agregados.textContent +  +fila.children[8].firstElementChild.value
        let producto = {
          CodigoT : (fila.children[0].firstElementChild.textContent),
          CodigoG : (fila.children[1].firstElementChild.textContent),
          TipoProducto :(fila.children[2].firstElementChild.textContent),
          Descripcion : (fila.children[3].firstElementChild.textContent),
          Posicion: (fila.children[4].firstElementChild.textContent),
          Modelo: (fila.children[5].firstElementChild.textContent),
          Cantidad : fila.children[8].firstElementChild.value,
          PrecioUnidad: (fila.children[7].firstElementChild.textContent).substr(1, fila.children[7].firstElementChild.textContent.length),
          PrecioTotal : (+fila.children[8].firstElementChild.value * +((fila.children[7].firstElementChild.textContent).substr(1, (fila.children[7].firstElementChild.textContent).length))).toFixed(2)
        }
        productos.push(producto)
      }

    }
  }if(e.target.textContent == "Ver lista de compra"){
    if(productos.length < 1){
      location.href = '/lista-orden-cliente'
    }else{
      let CantidadTotal = 0
      let PrecioTotal = 0
      for(i=0; i< productos.length ; i++){
        CantidadTotal += +productos[i].Cantidad
        PrecioTotal = (+PrecioTotal + +productos[i].PrecioTotal).toFixed(2)
      }
      let ordenTemporal = {
        CantidadTotal: CantidadTotal,
        PrecioTotal: PrecioTotal,
        Productos: productos,
      }
      envioOrdenTemporal(ordenTemporal)
    }
  }
})