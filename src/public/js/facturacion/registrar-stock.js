const d = document;
($costoM = d.getElementById("CostoM")),
  ($costo = d.getElementById("Costo")),
  ($precio = d.getElementById("Precio")),
  ($cantidad = d.getElementById("Cantidad"));
($costoMT = d.getElementById("CostoMT")),
  ($costoT = d.getElementById("CostoT")),
  ($precioT = d.getElementById("PrecioT")),
  ($date = d.getElementById("date")),
  ($TipoProducto = d.getElementById("TipoProducto")),
  ($Nombre = d.getElementById("Nombre")),
  ($Proveedor = d.getElementById("Proveedor")),
  ($CodigoT = d.getElementById("CodigoT")),
  ($CodigoG = d.getElementById("CodigoG")),
  ($TipoVehiculo = d.getElementById("TipoVehiculo")),
  ($Marca = d.getElementById("Marca")),
  ($Modelo = d.getElementById("Modelo")),
  ($Desde = d.getElementById("Desde")),
  ($Hasta = d.getElementById("Hasta")),
  ($Posicion = d.getElementById("Posicion")),
  ($Familia = d.getElementById("Familia")),
  (Agregarbtn = d.getElementById("Agregar"));

const $Alto = d.getElementById("Alto")
const $Largo = d.getElementById("Largo")
const $Ancho = d.getElementById("Ancho")
const $Unidades = d.getElementById("Unidades")
const $Peso = d.getElementById("Peso")

const $Contenedor = d.getElementById("Contenedor"),
  bodyTabla = d.getElementById("bodyTabla"),
  formDetalle = d.getElementById("Detalle"),
  formDetalle1 = d.getElementById("Detalle1"),
  btnGuardar = d.getElementById("GuardarStock");

let cantidadTotal = 0,
  PrecioTotal = 0,
  CostoFOBTotal = 0,
  CostoTotal = 0;
let NombreProducto,
    ModeloProducto,
    MarcaVehiculo,
    ModeloVehiculo

let arregloDetalle = [];

//Fetch para solicitar datos al server

fetch("/registrar-stock-info", {
  method: "POST",
})
  .then((response) => {
    return response.json();
  })
  .then((respuesta) => {
    ModeloProducto = respuesta[1]
    NombreProducto = respuesta[2]
    ModeloVehiculo = respuesta[3]
    MarcaVehiculo = respuesta[4]
    let options = `<option value="0">--Seleccione un proveedor--</option>`;
    for (i = 0; i < respuesta[0].length; i++) {
      opciones = `
      <option value="${respuesta[0][i].Nombre}">${respuesta[0][i].Nombre} </option>
      `;
      options += opciones;
    }
    $Proveedor.innerHTML = options;
  });

//Actualizando cantidad
$cantidad.addEventListener("change", () => {
  let totalMT = +$cantidad.value * +$costoM.value;

  $costoMT.value = totalMT.toFixed(2);
});

//Actualizando costoM
$costoM.addEventListener("change", () => {
  let totalMT = +$cantidad.value * +$costoM.value;

  $costoMT.value = totalMT.toFixed(2);
});

//Select
$(document).ready(function () {
  $(".js-exam").select2();
});
//Eliminar detalle

const eliminarDetalle = (Modelo) => {
  arregloDetalle = arregloDetalle.filter((detalle) => {
    if (Modelo != detalle.Modelo) return detalle;
  });
};

//Agregar arreglo detalle a la tabla
const agregarTabla = () => {
  bodyTabla.innerHTML = ``;

  arregloDetalle.forEach((detalle) => {
    let fila = d.createElement("tr");

    fila.innerHTML = `
    <td>${detalle.TipoVehiculo}</td>
    <td>${detalle.Marca}</td>
    <td>${detalle.Modelo}</td>
    <td>${detalle.Desde}-${detalle.Hasta}</td>
    <td>${detalle.Posicion}</td>
    <td>${detalle.Familia}</td>
    <td class="cantidad" >${detalle.Cantidad}</td>
    <td>${detalle.CostoM}</td>
    <td class="costoMT" >${detalle.CostoMT}</td>
    `;

    let tdEliminar = d.createElement("td");

    let botonEliminar = d.createElement("button");
    botonEliminar.classList.add("btn", "btn-danger", "btn", "text-light");
    botonEliminar.innerText = "-";

    tdEliminar.appendChild(botonEliminar);
    fila.appendChild(tdEliminar);

    bodyTabla.appendChild(fila);

    //Eliminando

    botonEliminar.onclick = (e) => {
      e.preventDefault();

      eliminarDetalle(detalle.Modelo);
      if (e.target.textContent == "-") {


        bodyTabla.removeChild(e.target.parentElement.parentElement);
      }
    };
  });
};

// Agregar el objeto detalle a el arreglo detalle y valida
//si ya existe, si existe lo suma, si no existe lo agrega
const agregarDetalle = (objetoDetalle) => {
  const resultado = arregloDetalle.find((detalle) => {
    if (detalle.Modelo == objetoDetalle.Modelo) {
      return detalle;
    }
  });

  if (resultado) {
    arregloDetalle = arregloDetalle.map((detalle) => {
      if (detalle.Modelo == objetoDetalle.Modelo) {
        return {
          TipoVehiculo: detalle.TipoVehiculo,
          Marca: detalle.Marca,
          Modelo: detalle.Modelo,
          Desde: detalle.Desde,
          Hasta: detalle.Hasta,
          Posicion: detalle.Posicion,
          Familia: detalle.Familia,
          Cantidad: +detalle.Cantidad + +objetoDetalle.Cantidad,
          CostoM: +detalle.CostoM + +objetoDetalle.CostoM,
          Costo: +detalle.Costo + +objetoDetalle.Costo,
          Precio: +detalle.Precio + +objetoDetalle.Precio,
          CostoMT: +detalle.CostoMT + +objetoDetalle.CostoMT,
          CostoT: +detalle.CostoT + +objetoDetalle.CostoT,
          PrecioT: +detalle.PrecioT + +objetoDetalle.PrecioT,
        };
      }
      return detalle;
    });
  } else {
    arregloDetalle.push(objetoDetalle);
  }
};

//Agregar valores a la lista inferior
d.addEventListener("click", (e) => {
  if (e.target == Agregarbtn) {
    let errors = 0;
    if ($TipoVehiculo.value == 0) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Tipo de vehiculo" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if ($Marca.value == 0) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Marca" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if ($Modelo.value == 0) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Modelo" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if (!$Desde.value) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Desde (Año)" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if (!$Hasta.value) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Hasta (Año)" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if ($Posicion.value == 0) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Posicion" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if ($Familia.value == 0) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Modelo producto" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if (!$cantidad.value) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Cantidad" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }
    if (!$costoM.value) {
      $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Costo FOB" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      errors += 1;
    }

    if (errors > 0) {
      return;
    }
    //Agregando a el arrelgo
    else {
      const objetoDetalle = {
        TipoVehiculo: $TipoVehiculo.value,
        Marca: $Marca.value,
        Modelo: $Modelo.value,
        Desde: $Desde.value,
        Hasta: $Hasta.value,
        Posicion: $Posicion.value,
        Familia: $Familia.value,
        Cantidad: $cantidad.value,
        CostoM: $costoM.value,
        CostoMT: $costoMT.value,
      };
      cantidadTotal = +objetoDetalle.Cantidad;
      CostoFOBTotal = +objetoDetalle.CostoMT;

      agregarDetalle(objetoDetalle);
      agregarTabla();
      formDetalle.reset();
      $('.js-exam2').val(null).trigger('change')
    }
  }
});

//Fetch para enviar datos del stock al server
const envioStock = async (data) => {
  return await fetch("/facturacion/registrar-stock", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
      $.fn.select2.defaults.reset()
    })
    .then((json) => {
      if(json == "ok"){

        $Contenedor.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
        <p>Stock registrado correctamente</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;
        $('.js-exam').val(null).trigger('change')
        arregloDetalle = []
        formDetalle.reset();
        formDetalle1.reset();
        bodyTabla.innerText = ``;
      }else{
        $Contenedor.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <p>El código ingresado ya se encuentra registrado</p>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;
        window.scrollTo(0, 0);
      }
    });
};

//Enviar datos al servidor
btnGuardar.onclick = (e) => {
  e.preventDefault();

  let errors = 0;

  if (!$date.value) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Fecha de ingreso" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if ($TipoProducto.value == 0) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Tipo de producto" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if ($Nombre.value == 0) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Nombre" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (!$Proveedor) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Proveedor" no puede estar vacio.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (!$CodigoG.value && !$CodigoT.value) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        Los campos "Codigo Thomson" y "Codigo Gabriel" no pueden estar vacios simultaneamente.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (!$Alto.value || +$Alto.value == 0 ) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Alto" no puede estar vacío o ser igual a 0.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (!$Largo.value || +$Largo.value == 0) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Largo" no puede estar vacío o ser igual a 0.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (!$Ancho.value || +$Ancho.value == 0) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
          El campo "Ancho" no puede estar vacío o ser igual a 0.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (!$Unidades.value || +$Unidades.value == 0) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
          El campo "Unidades por bulto" no puede estar vacío o ser igual a 0.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (!$Peso.value || +$Peso.value == 0) {
    $Contenedor.innerHTML += `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
          El campo "Peso" no puede estar vacío o ser igual a 0.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
    errors += 1;
  }
  if (errors > 0) {
    window.scrollTo(0, 0);
    return;
  } else {
    const stock = {
      date: $date.value,
      Vehiculo: arregloDetalle,
      TipoProducto: $TipoProducto.value,
      Nombre: $Nombre.value,
      CodigoT: $CodigoT.value,
      CodigoG: $CodigoG.value,
      CantidadTotal: cantidadTotal,
      PrecioTotal: PrecioTotal,
      CostoFOBTotal: CostoFOBTotal,
      CostoTotalStock: CostoTotal,
      Proveedor: $Proveedor.value,
      Alto : $Alto.value, 
      Largo : $Largo.value, 
      Ancho : $Ancho.value, 
      Unidades : $Unidades.value, 
      Peso : $Peso.value, 
    };

    window.scrollTo(0, 0);
    envioStock(stock);
    
  }
};


d.addEventListener("click", e=> {
    if(e.target.parentElement.firstElementChild.textContent && e.target.parentElement.firstElementChild.textContent ==  "Stock registrado correctamente"){
    location.reload()
  }
 
  if(e.target.textContent == "Close"){
    d.body.removeChild(d.body.lastElementChild)
  }
  if(e.target.textContent  ==  "Agregar"){

    
    
    if(e.target.parentElement.parentElement.firstElementChild.textContent == "Nombre:"){
      d.body.innerHTML +=  `
      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Registrar</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <<form action="/crear-nombre-producto" method="POST">
                <label for="" class="text-light">Nombre producto:</label>
                <input type="text" class="form-control" name="Nombre" placeholder="Introduce el nombre de un producto">
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Registrar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>


    `
  }
  if(e.target.parentElement.parentElement.firstElementChild.textContent == "Modelo del producto"){
      console.log(e.target.parentElement.parentElement.firstElementChild.textContent)
      
      d.body.innerHTML +=  `
      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Registrar</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          <form action="/crear-modelo-producto" method="POST">
                <label for="" class="text-light">Modelo producto:</label>
                <input type="text" class="form-control" name="Nombre" placeholder="Introduce el nombre de un modelo de producto">
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Registrar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>

        
    `
  }
  if(e.target.parentElement.parentElement.firstElementChild.textContent == "Marca:"){
      console.log(e.target.parentElement.parentElement.firstElementChild.textContent)
      d.body.innerHTML +=  `
      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Registrar</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
           <form action="/crear-marca-vehiculo" method="POST">
                <label for="" class="text-light">Marca vehiculo:</label>
                <input type="text" class="form-control" name="Nombre" placeholder="Introduce una marca de vehiculo">
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Registrar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>
        
      `

    }
    if(e.target.parentElement.parentElement.firstElementChild.textContent == "Modelo:"){
      console.log(e.target.parentElement.parentElement.firstElementChild.textContent)
      d.body.innerHTML +=  `

      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Registrar</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form action="/crear-modelo-vehiculo" method="POST">
                <label for="" class="text-light">Modelo vehiculo:</label>
                <input type="text" class="form-control" name="Nombre" placeholder="Introduce un modelo de vehiculo">
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Registrar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>


        
      `

    }


  }if(e.target.textContent == "Eliminar"){
    if(e.target.parentElement.parentElement.firstElementChild.textContent == "Nombre:"){
      let options = ``
    for (i=0; i < NombreProducto.length ; i++ ){
      let opt = `
        <option value="${NombreProducto[i].Nombre}">${NombreProducto[i].Nombre}</option> 
      `
      options += opt
    }      
      d.body.innerHTML +=  `
      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Eliminar nombre de producto</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form action="/eliminar-nombre-producto?_method=DELETE" method="POST">
            <input type="hidden" name="_method" value="DELETE">
                <label for="" class="text-light">Nombre producto:</label>
                <select name="Nombre" class="form-control js-example">
                <option value="0" >-----</option>
                ${options}
                </select>
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Eliminar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>


    `
    $(document).ready(function () {
      $(".js-example").select2();
    });
  }
  if(e.target.parentElement.parentElement.firstElementChild.textContent == "Modelo del producto"){

      let options = ``
      for (i=0; i < ModeloProducto.length ; i++ ){
        let opt = `
          <option value="${ModeloProducto[i].Nombre}">${ModeloProducto[i].Nombre}</option> 
        `
        options += opt
      }      
      
      d.body.innerHTML +=  `
      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Eliminar modelo de producto</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          <form action="/eliminar-modelo-producto?_method=DELETE" method="POST">
          <input type="hidden" name="_method" value="DELETE">
                <label for="" class="text-light">Modelo producto:</label>
                <select name="Nombre" class="form-control js-example">
                <option value="0" >-----</option>
                ${options}
                </select>
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Eliminar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>      
    `
    $(document).ready(function () {
      $(".js-example").select2();
    });
  }
  if(e.target.parentElement.parentElement.firstElementChild.textContent == "Marca:"){
      
    let options = ``
    for (i=0; i < MarcaVehiculo.length ; i++ ){
      let opt = `
        <option value="${MarcaVehiculo[i].Nombre}">${MarcaVehiculo[i].Nombre}</option> 
      `
      options += opt
    }     
      d.body.innerHTML +=  `
      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Eliminar marca de vehiculo</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
           <form action="/eliminar-marca-vehiculo?_method=DELETE" method="POST">
           <input type="hidden" name="_method" value="DELETE">
           <label for="" class="text-light">Marca vehiculo:</label>
           <select name="Nombre" class="form-control js-example">
           <option value="0" >-----</option>
                ${options}
                </select>
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Eliminar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>
        
      `
      $(document).ready(function () {
        $(".js-example").select2();
      });

    }
    if(e.target.parentElement.parentElement.firstElementChild.textContent == "Modelo:"){

    let options = ``
    for (i=0; i < ModeloVehiculo.length ; i++ ){
      let opt = `
        <option value="${ModeloVehiculo[i].Nombre}">${ModeloVehiculo[i].Nombre}</option> 
      `
      options += opt
    }      
      

      d.body.innerHTML +=  `

      <div class="modal" id="Modal" style="display: block; background-color: rgba(0,0,0,0.5)" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: rgba(0,0,0,0.9);">
          <div class="modal-header">
            <h5 class="modal-title text-warning" id="exampleModalLabel">Eliminar modelo de vehiculo</h5>
            <button type="button" class="btn-close btn-secondary text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form action="/eliminar-modelo-vehiculo?_method=DELETE" method="POST">
            <input type="hidden" name="_method" value="DELETE">
                <label for="" class="text-light">Modelo vehiculo:</label>
                <select name="Nombre" class="form-control js-example">
                <option value="0" >-----</option>
                     ${options}
                     </select>
                <hr class="text-light">
                <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
                <input type="submit" value="Eliminar" class="btn btn-warning mt-3">
             </form>
            </div>
        </div>
      </div>
    </div>


        
      `
      $(document).ready(function () {
        $(".js-example").select2();
      });

    }

  }
 })

