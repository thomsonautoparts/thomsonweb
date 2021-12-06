const d = document;
const $estado = d.getElementById("Estado");
const $estadoNuevo = d.getElementById("EstadoNuevo");
const $ordenNumero = d.getElementById("ordenNumero");
const busqueda = document.getElementById("buscar");
const $tbody = document.getElementById("tbody");
const table = document.getElementById("tabla").tBodies[0];
const $Contenedor = d.getElementById("message");

const envioOrden = async (data) => {
  return await fetch("/facturacion/cambio-estado-inventario", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
      $.fn.select2.defaults.reset();
    })
    .then((json) => {
        location.reload()
    });
};

fetch(`/facturacion/info-ordenes/`, {
  method: "POST",
})
  .then((response) => {
    return response.json();
  })
  .then((respuesta) => {
    let opciones = "";
    for (i = 0; i < respuesta.length; i++) {
      opciones += `
        <option value="${respuesta[i].OrdenNumero}">${respuesta[i].OrdenNumero}</option>
        `;
    }
    $ordenNumero.innerHTML += opciones;

    $ordenNumero.onchange = () => {
      for (i = 0; i < respuesta.length; i++) {
        if (respuesta[i].OrdenNumero == ordenNumero.value) {
          console.log(respuesta[i].Estado)
          $tbody.innerHTML = "";
          let lineas = "";
          for (x = 0; x < respuesta[i].Productos.length; x++) {
            let lines = `
                        <tr>
                            <th class="text-center">${respuesta[i].Proveedor}</th>
                            <th class="text-center">${respuesta[i].Productos[x].CodigoT}</th>
                            <th class="text-center">${respuesta[i].Productos[x].Descripcion}</th>
                            <th class="text-center">${respuesta[i].Productos[x].Cantidad}</th>
                            <th class="text-center">${respuesta[i].Productos[x].PrecioTotal}</th>
                            <th class="text-center"><input type="number" class="cantidad" value="${respuesta[i].Productos[x].Cantidad}"></th>
                            <th class="text-center">$${respuesta[i].Productos[x].PrecioTotal}</th>
                            <th>
                                <button class="btn btn-danger">Eliminar</button>
                            </th>
                        </tr>
                        `;
            lineas += lines;
          }
          $tbody.innerHTML += lineas;
          lineas = "";

          $estado.innerHTML = `
                    <option value="${respuesta[i].Estado}">${respuesta[i].Estado}</option>
                    `;
          if (respuesta[i].Estado == "Produccion") {
            $estadoNuevo.innerHTML = `
                        <option value="Producción" seletec>Producción</option>
                        <option value="Transito">Transito</option>
                        `;
          }
          if (respuesta[i].Estado == "Transito") {
            $estadoNuevo.innerHTML = `
                        <option value="Transito" seletec>Transito</option>
                        <option value="Stock">Stock</option>
                        `;
          }
        }
      }
    };
    d.addEventListener("change", (e) => {
      if (e.target.classList == "cantidad") {
        let fila = e.target.parentElement.parentElement;
        let nuevoPrecio = +(
          e.target.value *
          (+fila.children[4].textContent / +fila.children[3].textContent)
        ).toFixed(2);
        fila.children[6].textContent = `$${nuevoPrecio}`;
      }
    });

    d.addEventListener("click", (e) => {
      if (e.target.textContent == "Eliminar") {
        fila = e.target.parentElement.parentElement;
        $tbody.removeChild(e.target.parentElement.parentElement);
      }
      if (e.target.textContent == "Guardar cambios") {
        if ($ordenNumero.value == 0) {
          $Contenedor.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                      <p>No se ha seleccinado ninguna orden de compra. Por favor, seleccione una para poder procesar los cambios.</p>
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      </div>
                      `;

        } else {
          let Productos = [];
          let Proveedor;
          let CantidadTotal = 0;
          let PrecioTotal = 0;
          for (z = 0; z < $tbody.children.length; z++) {
            CantidadTotal +=
              +$tbody.children[z].children[5].firstElementChild.value;
            let precioSin$ = $tbody.children[z].children[6].textContent.replace(
              "$",
              ""
            );
            PrecioTotal += +precioSin$;
            let producto = {
              CodigoT: $tbody.children[z].children[1].textContent,
              Descripcion: $tbody.children[z].children[2].textContent,
              Cantidad: +$tbody.children[z].children[5].firstElementChild.value,
              PrecioUnidad: +(+$tbody.children[z].children[4].textContent / +$tbody.children[z].children[3].textContent).toFixed(2),
              PrecioTotal: +(($tbody.children[z].children[6].textContent).replace("$", "")),
            };
            Productos.push(producto);
          }

          let orden = {
            OrdenNumero: $ordenNumero.value,
            Estado: $estadoNuevo.value,
            productos: Productos,
            CantidadTotal: CantidadTotal,
            PrecioTotal: PrecioTotal,
          };
          envioOrden(orden);
        }
      }
    });
  });

let buscaTabla = function () {
  texto = busqueda.value.toLowerCase();
  let r = 0;
  while ((row = table.rows[r++])) {
    if (row.innerText.toLowerCase().indexOf(texto) !== -1)
      row.style.display = null;
    else row.style.display = "none";
  }
};
