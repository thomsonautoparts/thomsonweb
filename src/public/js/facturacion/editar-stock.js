const d = document;
const ID = d.getElementById("ID");
const $bodyTabla = d.getElementById("bodyTabla");
const $TipoVehiculo = d.getElementById("TipoVehiculo");
const $Marca = d.getElementById("Marca");
const $Modelo = d.getElementById("Modelo");
const $Desde = d.getElementById("Desde");
const $Hasta = d.getElementById("Hasta");
const $Peso = d.getElementById("Peso");
const $Ancho = d.getElementById("Ancho");
const $Alto = d.getElementById("Alto");
const $Largo = d.getElementById("Largo");
const $Unidades = d.getElementById("Unidades");
const $Proveedor = d.getElementById("Proveedor");
const table = document.getElementById("tabla").tBodies[0];

//Select
$(document).ready(function () {
  $(".js-exam").select2();
});

fetch(`/facturacion/info-stock-edit/${ID.textContent}`, {
  method: "POST",
})
  .then((response) => {
    return response.json();
  })
  .then((respuesta) => {    
    for (i = 0; i < respuesta.Vehiculo.length; i++) {
      let fila = `<tr>
                    <td>${respuesta.Vehiculo[i].TipoVehiculo}</td>
                    <td>${respuesta.Vehiculo[i].Marca}</td>
                    <td>${respuesta.Vehiculo[i].Modelo}</td>
                    <td>${respuesta.Vehiculo[i].Desde}-${respuesta.Vehiculo[i].Hasta}</td>
                    <td> <button class="btn btn-danger">-</button></td>
                </tr>`;
      $bodyTabla.innerHTML += fila;
    }
    d.addEventListener("click", (e) => {
      if (e.target.textContent == "-") {
        $bodyTabla.removeChild(e.target.parentElement.parentElement);
      }
    });
  });

const envioStock = async (data) => {
  return await fetch(`/facturacion/stock-edited/${ID.textContent}`, {
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
    });
};

d.addEventListener("click", (e) => {
  if (e.target.textContent == "+") {
    let errors = 0;
    if ($TipoVehiculo.value == 0) {
      let errors = 0;
      d.getElementById("errors").innerHTML += `
                      
                  <div
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  Debe introducir un tipo de vehículo para poder agregar
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;

      errors++;
    }
    if ($Peso.value == 0) {
      d.getElementById("errors").innerHTML += `
                      
                <div class="alert alert-danger alert-dismissible fade show"  role="alert">
                  Debe introducir un peso
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if ($Alto.value == 0) {
      d.getElementById("errors").innerHTML += `
                      
                <div class="alert alert-danger alert-dismissible fade show"  role="alert">
                  Debe introducir la altura del producto
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if ($Ancho.value == 0) {
      d.getElementById("errors").innerHTML += `
                <div class="alert alert-danger alert-dismissible fade show"  role="alert">
                  Debe introducir la anchura del producto
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if ($Largo.value == 0) {
      d.getElementById("errors").innerHTML += `
                      
                <div class="alert alert-danger alert-dismissible fade show"  role="alert">
                  Debe introducir el largo del producto
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if ($Unidades.value == 0) {
      d.getElementById("errors").innerHTML += `
                      
                <div class="alert alert-danger alert-dismissible fade show"  role="alert">
                  Debe introducir la unidades.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if ($Marca.value == 0) {
      d.getElementById("errors").innerHTML += `
                      
                <div class="alert alert-danger alert-dismissible fade show"  role="alert">
                  Debe introducir una marca vehículo para poder agregar
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if ($Modelo.value == 0) {
      d.getElementById("errors").innerHTML += `
                      
                  <div
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  Debe introducir un modelo de vehiculo para poder agregar
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if (!$Desde.value) {
      d.getElementById("errors").innerHTML += `
                      
                  <div
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                Debe introducir un fecha "Desde" para poder agregar
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if (!$Hasta.value) {
      d.getElementById("errors").innerHTML += `
                      
                  <div
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  Debe introducir un fecha "Hasta" para poder agregar
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                  `;
      errors++;
    }
    if (errors == 0) {
        let fila = `<tr>
        <td>${$TipoVehiculo.value}</td>
        <td>${$Marca.value}</td>
        <td>${$Modelo.value}</td>
        <td>${$Desde.value}-${$Hasta.value}</td>
        <td><button class="btn btn-danger">-</button></td>
        </tr>`;
        $bodyTabla.innerHTML += fila;
       
      $(".js-exam").val(null).trigger("change");
    } else {
      return;
    }
  }
  if(e.target.textContent == "Actualizar producto"){ 
  let Vehiculos = []
  for(i =0; i< table.rows.length; i++){
          let vehiculo = {
              TipoVehiculo: table.rows[i].children[0].textContent,
              Marca: table.rows[i].children[1].textContent,
              Modelo: table.rows[i].children[2].textContent,
              Desde: (table.rows[i].children[3].textContent).substr(0,4),
              Hasta:(table.rows[i].children[3].textContent).substr(5,9),
            }
            Vehiculos.push(vehiculo)   
  }
      let Producto = {
          CodigoT : d.getElementById("CodigoT").value,
          CodigoG : d.getElementById("CodigoG").value,
          Posicion : d.getElementById("Posicion").value,
          costoFOB : d.getElementById("costoFOB").value,
          Peso : $Peso.value,
          Ancho : $Ancho.value,
          Proveedor: $Proveedor.value,
          Alto : $Alto.value,
          Largo : $Largo.value,
          Unidades : $Unidades.value,
          costo : d.getElementById("costo").value,
          costoGranMayor : d.getElementById("costoGranMayor").value,
          costoMayor : d.getElementById("costoMayor").value,
          costoDetal : d.getElementById("costoDetal").value,
          Vehiculo: Vehiculos
      }
      envioStock(Producto)
  }
});
