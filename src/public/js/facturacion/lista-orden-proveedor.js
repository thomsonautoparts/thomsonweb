const d = document;
const $tBody = d.getElementById("tBody");
const $agregados = d.getElementById("agregados");
const $agregadosPrecio = d.getElementById("agregadosPrecio");
const busqueda = document.getElementById("buscar");
const $AgregadosMcpherson = d.getElementById("AgregadosMcpherson");
const $AgregadosConvencional = d.getElementById("AgregadosConvencionales");
const $AgregadosBases = d.getElementById("AgregadosBases");
const $AgregadosGuardapolvo = d.getElementById("AgregadosGuardapolvo");
const $20Pies = d.getElementById("20Pies");
const $40Pies = d.getElementById("40Pies");
const $40PiesHC = d.getElementById("40PiesHC");
const $Peso = d.getElementById("Peso");
const table = document.getElementById("tabla").tBodies[0];

$AgregadosMcpherson.textContent = 0;
$AgregadosConvencional.textContent = 0;
$AgregadosBases.textContent = 0;
$AgregadosGuardapolvo.textContent = 0;

let buscaTabla = function () {
  texto = busqueda.value.toLowerCase();
  let r = 0;
  while ((row = table.rows[r++])) {
    if (row.innerText.toLowerCase().indexOf(texto) !== -1)
      row.style.display = null;
    else row.style.display = "none";
  }
};
busqueda.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    e.preventDefault();
  }
});
busqueda.addEventListener("keyup", buscaTabla);

const cambiarCantidad = async (data) => {
  return await fetch("/cambiar-cantidad-producto-lista-proveedor", {
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
      if (response) {
        d.getElementById("message").innerHTML = ``;
      } else {
        d.getElementById("message").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Ocurrio un problema inesperado al intentar registrar los productos. Por favor, comunicate con soporte. 
        </div>
        `;
        window.scrollTo(0, 0);
      }
    });
};

fetch("/facturacion/ver-orden-temporal", {
  method: "POST",
})
  .then((response) => {
    return response.json();
  })
  .then((respuesta) => {
    let tr;
    $20Pies.textContent = respuesta[0].VeintePies
    $40Pies.textContent = respuesta[0].CuarentaPies
    $40PiesHC.textContent = respuesta[0].CuarentaPiesHQ
    $Peso.textContent = respuesta[0].Peso
    $agregadosPrecio.textContent = respuesta[0].PrecioTotal;
    $agregados.textContent = respuesta[0].CantidadTotal;
    for (i = 0; i < respuesta[0].Productos.length; i++) {
      if (respuesta[0].Productos[i].Modelo == "Mcpherson") {
        $AgregadosMcpherson.textContent =
          +$AgregadosMcpherson.textContent +
          +respuesta[0].Productos[i].Cantidad;
      }
      if (
        respuesta[0].Productos[i].Modelo == "Convecional" ||
        respuesta[0].Productos[i].Modelo == "Conventional"
      ) {
        $AgregadosConvencional.textContent =
          +$AgregadosConvencional.textContent +
          +respuesta[0].Productos[i].Cantidad;
      }
      if (
        respuesta[0].Productos[i].Modelo == "Strut mount" ||
        respuesta[0].Productos[i].Modelo == "Strut"
      ) {
        $AgregadosBases.textContent =
          +$AgregadosBases.textContent + +respuesta[0].Productos[i].Cantidad;
      }
      if (
        respuesta[0].Productos[i].Modelo == "Guardapolvo" ||
        respuesta[0].Productos[i].Modelo == "Boot"
      ) {
        $AgregadosGuardapolvo.textContent =
          +$AgregadosGuardapolvo.textContent +
          +respuesta[0].Productos[i].Cantidad;
      }
      let MCB = (+respuesta[0].Productos[i].Alto * +respuesta[0].Productos[i].Ancho * +respuesta[0].Productos[i].Largo * +respuesta[0].Productos[i].Cantidad)
      MCB = +MCB/1000000
      tr = `
        <td>${respuesta[0].Proveedor}</td>
        <td><p>${respuesta[0].Productos[i].CodigoT}<p></td>
        <td>${respuesta[0].Productos[i].Descripcion}</td>
        <td><p>${respuesta[0].Productos[i].Posicion}</p></td>
        <td><p>${respuesta[0].Productos[i].Modelo}</p></td>
        <td> 
          <input type="number" min="1" class="cantidad form-control" 
          data-valorAnterior="${respuesta[0].Productos[i].Cantidad}" data-PrecioAnterior="${respuesta[0].Productos[i].PrecioTotal}"
          value="${respuesta[0].Productos[i].Cantidad}" style="background-color: white;" data-MCB="${MCB}" 
          data-Peso="${respuesta[0].Productos[i].Peso}">
        </td>
        <td id="PrecioTotal"><p>${respuesta[0].Productos[i].PrecioUnidad}</p></td>
        <td id="PrecioTotal"><p>${respuesta[0].Productos[i].PrecioTotal}<p></td>
        <td><button class="btn btn-danger">-</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].Costo}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].CostoGranMayor}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].CostoMayor}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].CostoDetal}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].TipoProducto}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].Posicion}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].Peso}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].Alto}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].Ancho}</button></td>
        <td style="display: none"><button class="btn btn-danger">${respuesta[0].Productos[i].Largo}</button></td>
      `;
      $tBody.innerHTML += tr;
    }
    d.addEventListener("change", (e) => {
      fila = e.target.parentElement.parentElement;
      let valorAnterior = e.target.getAttribute("data-valorAnterior");
      let precioAnterior = e.target.getAttribute("data-precioAnterior");
      let MCBAnterior = e.target.getAttribute("data-MCB")
      let PesoAnterior = e.target.getAttribute("data-Peso")
      if (fila.children[4].firstElementChild.textContent == "Mcpherson") {
        $AgregadosMcpherson.textContent = +$AgregadosMcpherson.textContent - +valorAnterior;
        $AgregadosMcpherson.textContent = +$AgregadosMcpherson.textContent + +e.target.value;
      }
      if (fila.children[4].firstElementChild.textContent == "Convecional" ||  fila.children[4].firstElementChild.textContent == "Conventional") {
        $AgregadosConvencional.textContent = +$AgregadosConvencional.textContent - +valorAnterior;
        $AgregadosConvencional.textContent = +$AgregadosConvencional.textContent + +e.target.value;
      }
      if (fila.children[4].firstElementChild.textContent == "Strut mount" ||  fila.children[4].firstElementChild.textContent == "Strut") {
        $AgregadosBases.textContent = +$AgregadosBases.textContent - - +valorAnterior;
        $AgregadosBases.textContent = +$AgregadosBases.textContent + +e.target.value;
      }
      if (fila.children[4].firstElementChild.textContent == "Guardapolvo" ||  fila.children[4].firstElementChild.textContent == "Boot") {
        $AgregadosGuardapolvo.textContent = +$AgregadosGuardapolvo.textContent - +valorAnterior;
        $AgregadosGuardapolvo.textContent = +$AgregadosGuardapolvo.textContent + +e.target.value;
      }
      if(+$40PiesHC.textContent <= 69 ){
        if(+$40PiesHC.textContent <=30 ){
          //restamos todo
          $20Pies.textContent = (+$20Pies.textContent - +MCBAnterior).toFixed(2)
          $40Pies.textContent = (+$40Pies.textContent - +MCBAnterior).toFixed(2)
          $40PiesHC.textContent = (+$40PiesHC.textContent - +MCBAnterior).toFixed(2)
          
        }else{
          //restamos 40' y 40'HC
          $40Pies.textContent = (+$40Pies.textContent - +MCBAnterior).toFixed(2)
          $40PiesHC.textContent = (+$40PiesHC.textContent - +MCBAnterior).toFixed(2)
        }
      }else{
        $40PiesHC.textContent = (+$40PiesHC.textContent - +MCBAnterior).toFixed(2)
      }
      $Peso.textContent = (+$Peso.textContent - +PesoAnterior).toFixed(2)
      let valor = e.target.value;
      let precio = ( +valor * +fila.children[6].firstElementChild.textContent).toFixed(2);
      fila.children[7].firstElementChild.textContent = `${precio}`;
      let nuevoMCB = (+fila.children[18].firstElementChild.textContent * +fila.children[17].firstElementChild.textContent * +fila.children[16].firstElementChild.textContent * +e.target.value)
      nuevoMCB = +nuevoMCB/1000000
      let nuevoPeso = (+fila.children[15].firstElementChild.textContent * e.target.value).toFixed(2)
      $agregados.textContent = +$agregados.textContent - +valorAnterior;
      $agregados.textContent = +$agregados.textContent + +valor;
      $agregadosPrecio.textContent = ( +$agregadosPrecio.textContent - +precioAnterior).toFixed(2);
      $agregadosPrecio.textContent = (+$agregadosPrecio.textContent + +precio).toFixed(2);
      $agregadosPrecio.textContent = `${$agregadosPrecio.textContent}`;
      e.target.setAttribute("data-valorAnterior", valor);
      e.target.setAttribute("data-precioAnterior", precio);
      e.target.setAttribute("data-MCB", nuevoMCB);
      e.target.setAttribute("data-Peso", nuevoPeso);
      $Peso.textContent = (+$Peso.textContent + +nuevoPeso).toFixed(2)

      if($20Pies.textContent != 30 && +$20Pies.textContent < 30){
        $20Pies.textContent = (+$20Pies.textContent + +nuevoMCB).toFixed(2) 
        if($20Pies.textContent > 30){
          $20Pies.textContent = 30
        }
      }
      if($40Pies.textContent != 69 && $40Pies.textContent < 69){
        $40Pies.textContent = (+$40Pies.textContent + +nuevoMCB).toFixed(2)
        if($40Pies.textContent > 69){
          $40Pies.textContent = 69
        }
      }
      $40PiesHC.textContent = (+$40PiesHC.textContent + +nuevoMCB).toFixed(2)
      let orden = {
        CodigoT: fila.children[1].firstElementChild.textContent,
        Cantidad: valor,
        VeintePies: $20Pies.textContent,
        CuarentaPies: $40Pies.textContent,
        CuarentaPiesHQ: $40PiesHC.textContent,
        Peso: $Peso.textContent,
        Precio: precio,
        CantidadTotal: $agregados.textContent,
        PrecioTotal: $agregadosPrecio.textContent,
      };
      cambiarCantidad(orden);
    });

    const eliminarDetalle = (CodigoT) => {
      respuesta[0].Productos = respuesta[0].Productos.filter((detalle) => {
        if (CodigoT != detalle.CodigoT) return detalle;
      });
    };
    d.addEventListener("click", (e) => {
      if (e.target.textContent == "-") {
        fila = e.target.parentElement.parentElement;
        let pesoEliminar = fila.children[5].firstElementChild.getAttribute("data-peso")
        console.log(pesoEliminar)
        let tamañoEliminar = fila.children[5].firstElementChild.getAttribute("data-mcb")
        if (fila.children[4].firstElementChild.textContent == "Mcpherson") {
          $AgregadosMcpherson.textContent = +$AgregadosMcpherson.textContent - +fila.children[5].firstElementChild.value;
        }
        if ( fila.children[4].firstElementChild.textContent == "Convecional" || fila.children[4].firstElementChild.textContent == "Conventional"){
          $AgregadosConvencional.textContent = +$AgregadosConvencional.textContent - +fila.children[5].firstElementChild.value;
        }
        if ( fila.children[4].firstElementChild.textContent == "Strut mount" ||  fila.children[4].firstElementChild.textContent == "Strut") {
          $AgregadosBases.textContent = +$AgregadosBases.textContent -+fila.children[5].firstElementChild.value;
        }
        if (fila.children[4].firstElementChild.textContent == "Guardapolvo" ||  fila.children[4].firstElementChild.textContent == "Boot") {
          $AgregadosGuardapolvo.textContent = +$AgregadosGuardapolvo.textContent - +fila.children[5].firstElementChild.value;
        }

        $agregados.textContent = +$agregados.textContent - +fila.children[5].firstElementChild.value;
        $agregadosPrecio.textContent = (+$agregadosPrecio.textContent - +fila.children[7].firstElementChild.textContent).toFixed(2);

        eliminarDetalle(fila.children[1].textContent);

        $tBody.removeChild(e.target.parentElement.parentElement);
        let producto = {
          CodigoT: fila.children[1].firstElementChild.textContent,
          Peso: pesoEliminar,
          mcb: tamañoEliminar
        };
        $Peso.textContent = (+$Peso.textContent - +pesoEliminar).toFixed(2)
        $40PiesHC.textContent = (+$40PiesHC.textContent - +tamañoEliminar).toFixed(2)
        if(+$40PiesHC.textContent <= 69){
          $40Pies.textContent = +$40PiesHC.textContent
          if(+$40PiesHC.textContent <= 30){
            $20Pies.textContent = +$40PiesHC.textContent
          }
        }
        eliminarProducto(producto);
      }
      if (e.target.textContent == "Generar compra") {
        const enviarOrden = async (data) => {
          return await fetch("/registrar-orden-proveedor", {
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
              if (response) {
                d.getElementById("message").innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Orden generada Correctamente. Haz click en "Descargar" para generar el archivo excel.
                    <form action="/generar-excel-compra/${response[0].text}" method="POST">
                      <input type="submit" class="btn btn-outline-primary" value="Descargar">
                    </form> 
                </div>
                `;
              }
              return;
            });
        };

        let Productos = [];
        let Proveedor = table.rows[0].children[0].textContent;
        let CantidadTotal = 0;
        let PrecioTotal = 0;
        let today = new Date();
        today = today.toLocaleDateString().substr(0, 10);

        for (i = 0; i < table.rows.length; i++) {
          let producto = {
            CodigoT: table.rows[i].children[1].textContent,
            Cantidad: table.rows[i].children[5].firstElementChild.value,
            PrecioUnidad: table.rows[i].children[6].textContent,
            PrecioTotal: table.rows[i].children[7].textContent,
            Descripcion: table.rows[i].children[2].textContent,
            Costo: table.rows[i].children[9].textContent,
            CostoGranMayor: table.rows[i].children[10].textContent,
            CostoMayor: table.rows[i].children[11].textContent,
            CostoDetal: table.rows[i].children[12].textContent,
            TipoProducto: table.rows[i].children[13].textContent,
            Posicion: table.rows[i].children[14].textContent,
            Peso:  table.rows[i].children[15].textContent,
            Alto:  table.rows[i].children[16].textContent,
            Ancho:  table.rows[i].children[17].textContent,
            Largo:  table.rows[i].children[18].textContent,
          };

          Productos.push(producto);
          CantidadTotal += +table.rows[i].children[5].firstElementChild.value;
          PrecioTotal = (
            +PrecioTotal + +table.rows[i].children[7].textContent
          ).toFixed(2);
        }
        let orden = {
          VeintePies: $20Pies.textContent,
          CuarentaPies: $40Pies.textContent,
          CuarentaPiesHQ: $40PiesHC.textContent,
          Peso: $Peso.textContent,
          Proveedor: Proveedor,
          Productos: Productos,
          CantidadTotal: CantidadTotal,
          PrecioTotal: PrecioTotal,
          date: today,
          _id: respuesta[0]._id,
        };
        enviarOrden(orden);
      }
    });
  });

//fetch para eliminar producto de la lista
const eliminarProducto = async (data) => {
  return await fetch("/eliminar-producto-lista-proveedor", {
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
      if (response) {
        d.getElementById("message").innerHTML = `
            <div class="mt-2 alert alert-success alert-dismissible fade show" role="alert">
              Producto eliminado de la lista correctamente. 
            </div>
            `;
        window.scrollTo(0, 0);
      } else {
        d.getElementById("message").innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Ocurrio un problema inesperado al intentar registrar los productos. Por favor, comunicate con soporte. 
          </div>
          `;
      }
    });
};
