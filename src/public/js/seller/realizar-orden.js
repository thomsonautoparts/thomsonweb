const busqueda = document.getElementById("buscar");
const table = document.getElementById("tabla").tBodies[0];
const d = document;
const $agregados = d.getElementById("agregados")
let productos = []
let validacionLista
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
  return await fetch("/realizar-orden/vendedor", {
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
        location.href = '/lista-orden-vendedor'
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
    let fila = e.target.parentElement.parentElement
    if(validacionLista){
      let filtro = validacionLista.filter((data) => data.CodigoT == fila.children[0].firstElementChild.textContent)
      if(filtro.length > 0){ 
        d.getElementById("message").innerHTML = `
        <div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
        El producto ya se encuentra agregado a la lista. Para aumentar o disminuir la cantidad revise el codigo en "Ver lista de compra" 
        </div>
        `
      }
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
        console.log()
        d.getElementById("message").innerHTML = ``
        $agregados.textContent = +$agregados.textContent +  +fila.children[7].firstElementChild.value
        let producto = {
          CodigoT : (fila.children[0].firstElementChild.textContent),
          CodigoG : (fila.children[1].firstElementChild.textContent),
          TipoProducto :(fila.children[2].firstElementChild.textContent),
          Descripcion : (fila.children[3].firstElementChild.textContent),
          Posicion: (fila.children[4].firstElementChild.textContent),
          Modelo: (fila.children[5].firstElementChild.textContent),
          Cantidad : fila.children[7].firstElementChild.value,
          PrecioUnidad: (fila.children[6].firstElementChild.textContent).substr(1, fila.children[6].firstElementChild.textContent.length),
          PrecioTotal : (+fila.children[7].firstElementChild.value * +((fila.children[6].firstElementChild.textContent).substr(1, (fila.children[6].firstElementChild.textContent).length))).toFixed(2)
        }
        productos.push(producto)
        console.log(productos)
      }
    }
  }if(e.target.textContent == "Ver lista de compra"){
    if(productos.length < 1){
      location.href = '/lista-orden-vendedor'
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