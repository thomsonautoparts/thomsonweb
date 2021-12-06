const d = document,
  formDetalle = d.getElementById("formDetalle"),
  precioUnidad = d.getElementById("precioUnidad"),
  precioTotal = d.getElementById("precioTotal"),
  precio = d.getElementById("Precio"),
  TipoPrecio = d.getElementById("TipoPrecio"),
  Cantidad = d.getElementById("Cantidad"),
  Homologo = d.getElementById("Homologo"),
  Codigo = d.getElementById("Codigo"),
  Cliente = d.getElementById("Cliente"),
  numeroFactura = d.getElementById("numeroFactura"),
  Documento = d.getElementById("Documento"),
  DocumentoTipo = d.getElementById("DocumentoTipo"),
  Direccion = d.getElementById("Direccion"),
  bodyTabla = d.getElementById("bodyTabla"),
  botonGuadar = d.getElementById("guardarFactura"),
  formFactura = d.getElementById("form-factura"),
  vencimiento = d.getElementById("Vencimiento"),
  Vendedor = d.getElementById("Vendedor"),
  CodigoVendedor = d.getElementById("CodigoVendedor"),
  DocumentoVendedor = d.getElementById("DocumentoVendedor"),
  ZonaVendedor = d.getElementById("ZonaVendedor"),
  formCantidad = d.getElementById("formCantidad"),
  celular = d.getElementById("Celular"),
  Modelo = d.getElementById("Modelo"),
  Posicion = d.getElementById("Posicion"),
  Nota = d.getElementById("Nota"),
  today = new Date();
let cantidadTotal = 0,
  PrecioTotal = 0;

let arregloDetalle = [];



//Btn que elimina de la tabla de productos agregados
const eliminarDetalle = (codigo) => {
  arregloDetalle = arregloDetalle.filter((detalle) => {
    if (codigo != detalle.Codigo) return detalle;
  });
};

const agregarTabla = () => {
  bodyTabla.innerHTML = ``;

  arregloDetalle.forEach((detalle) => {
    
    let fila = d.createElement("tr");

    fila.innerHTML = `<td>${detalle.Codigo}</td>
                     <td>${detalle.Producto}</td>
                     <td>${detalle.Modelo}</td>
                     <td class="cantidad">${detalle.Cantidad}</td>
                     <td>${detalle.precioUnidad}</td>
                     <td class="total">${detalle.precioTotal}</td>
    `;
    let tdEliminar = d.createElement("td");

    let botonEliminar = d.createElement("button");
    botonEliminar.classList.add("btn", "btn-danger");
    botonEliminar.innerText = "-";

    tdEliminar.appendChild(botonEliminar);
    fila.appendChild(tdEliminar);

    bodyTabla.appendChild(fila);

    botonEliminar.onclick = (e) => {
      e.preventDefault();

      eliminarDetalle(detalle.Codigo);
      if (e.target.textContent == "-") {
        // Eliminar del arreglo
        cantidadTotal -= parseInt(
          e.target.parentElement.parentElement.querySelector(".cantidad")
            .textContent
        );
        PrecioTotal -= parseInt(
          e.target.parentElement.parentElement.querySelector(".total")
            .textContent
        );
        bodyTabla.removeChild(e.target.parentElement.parentElement);
      }
    };
  });
};

// PostFect recibir datos de nodejs sobre los productos y los clientes

fetch("/facturacion/nueva-cotizacion/info", {
  method: "POST",
})
  .then((response) => {
    return response.json();
  })
  .then((respuesta) => {
    //Llenando datos de los inputs cliente
    Cliente.onchange =  () => {
      for (i = 0; i < respuesta[0].length; i++) {
        //console.log((respuesta[0][i].Empresa))
        if (respuesta[0][i].Empresa == Cliente.value) {
          DocumentoTipo.value = "RIF";

          Documento.value = respuesta[0][i].Rif;

          Direccion.value = respuesta[0][i].Direccion;

          celular.value = respuesta[0][i].Celular;
          if (respuesta[2][0]) {
            numeroFactura.value = respuesta[2][0].Factura + 1;
          }
        }
      }
    };

    //Llenando los datos de vendedor
    Vendedor.onchange = () => {
      for (x = 0; x < respuesta[3].length; x++) {
        console.log(respuesta[3][x])
        if (respuesta[3][x].Nombres == Vendedor.value) {
          CodigoVendedor.value = respuesta[3][x].Codigo;
          DocumentoVendedor.value =  respuesta[3][x].Cedula;
          ZonaVendedor.value = respuesta[3][x].Zona;
        }
      }
    };
    //Llenando datos de los inputs productos
    Codigo.onchange =  () => {
      console.log(Codigo.dataset.indexNumber)
      for (i = 0; i < respuesta[1].length; i++) {
        if (respuesta[1][i]._id == Codigo.value) {
          Homologo.value = respuesta[1][i].CodigoG;
          TipoPrecio.innerHTML = `
          <option value="0">--Seleccione un precio--</option>                                  
          <option value="GranMayor">Precio gran mayor</option>                                  
          <option value="Mayor">Precio Mayor</option>                                  
          <option value="Detal">Precio detal</option>                                  
          `
          Cantidad.value = respuesta[1][i].CantidadTotal;

          precioTotal.value = respuesta[1][i].Cantidad * respuesta[1][i].Precio;
        }
      }
    };

    //Llenar el precio dependiente del tipo 

    TipoPrecio.addEventListener("change", () => {
      for(x= 0; x < respuesta[1].length; x++){
        if(respuesta[1][x]._id == Codigo.value && TipoPrecio.value == "GranMayor" ){
          precioUnidad.value =  respuesta[1][x].CostoGranMayor
          console.log(precioUnidad.value)
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);
        }
        if(respuesta[1][x]._id == Codigo.value && TipoPrecio.value == "Mayor" ){
          precioUnidad.value =  respuesta[1][x].CostoMayor
          console.log(precioUnidad.value)
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);

        } 
        if(respuesta[1][x]._id == Codigo.value && TipoPrecio.value == "Detal" ){
          precioUnidad.value =  respuesta[1][x].CostoDetal
          console.log(precioUnidad.value)
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);
        }
      }
    })
  
    //Funcion que valida si hay un producto en la tabla y lo suma
    //O lo agrega si no existe
    const agregarDetalle = (objetoDetalle) => {
      const resultado = arregloDetalle.find((detalle) => {
        if (detalle.Codigo == objetoDetalle.Codigo) {
          return detalle;
        }
      });

      if (resultado) {
        arregloDetalle = arregloDetalle.map((detalle) => {
          if (detalle.Codigo == objetoDetalle.Codigo) {
            return {
              Codigo: detalle.Codigo,
              Producto: detalle.Producto,
              Cantidad: detalle.Cantidad + objetoDetalle.Cantidad,
              precioUnidad: detalle.precioUnidad,
              precioTotal:
                (detalle.Cantidad + objetoDetalle.Cantidad) *
                detalle.precioUnidad,
            };
          }
          return detalle;
        });
      } else {
        arregloDetalle.push(objetoDetalle);
      }
    };

    //Agregar detalles productos a la tabla
    formDetalle.onsubmit = (e) => {
      e.preventDefault();

      // Creando objeto detalle
      const valorProducto = function () {
        for (i = 0; i < respuesta[1].length; i++) {
          if (respuesta[1][i]._id == Codigo.value) {
            const valor = respuesta[1][i].TipoProducto;
            return valor;
          }
        }
      };
      const valorCodigo = function () {
        for (i = 0; i < respuesta[1].length; i++) {
          if (respuesta[1][i]._id == Codigo.value) {
            const valor = respuesta[1][i].CodigoT;
            return valor;
          }
        }
      }
      const valorModelo = function () {
        for (i = 0; i < respuesta[1].length; i++) {
          if (respuesta[1][i]._id == Codigo.value) {
            const valor = respuesta[1][i].Modelo;
            return valor;
          }
        }
      }

      if(!Codigo.value || TipoPrecio.value == 0){
        return
      }

      const objetoDetalle = {
        Codigo: valorCodigo(),
        Producto: valorProducto(),
        Modelo: valorModelo(),
        Cantidad: Cantidad.value,
        precioUnidad: precioUnidad.value,
        precioTotal: precioTotal.value,
      };

      cantidadTotal += +objetoDetalle.Cantidad;
      PrecioTotal += +objetoDetalle.precioTotal;


      agregarDetalle(objetoDetalle);
      agregarTabla();
      formDetalle.reset();
    };
  });

//Post para enviar datos de la factura al server
const envioFactura = async (data) => {
  return await fetch("/facturacion/nueva-cotizacion", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json[0].ok) {
        d.getElementById("message").innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
            ${json[0].ok}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
              `;
              bodyTabla.innerHTML = ``
              arregloDetalle = []
              window.scrollTo(0,0)
              window.open(`/cotizacion-print/${json[1].Factura}`, "Impresion", "width=612, heigh=792");
      } else {
        for (i = 0; i < json.length; i++) {
          d.getElementById("message").innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${json[i].text}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `;
        }
        window.scrollTo(0,0)
      }
      return json;
    });
};

//enviar informacion a node
botonGuadar.onclick = async (e) => {
  e.preventDefault();

  let errors =[]


  if(Cliente.value == 0 ){

    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Selecciona un cliente" no puede estar vacio
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }
  if(Vendedor.value == 0 ){
    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Vendedor" no puede estar vacio
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }

  if(!vencimiento.value){
    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Fecha de vencimiento" no puede estar vacio
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }
  if(errors.length > 0){
    window.scrollTo(0,0)
    return
  }else{
    
  
    
      e.preventDefault();
    
      const Factura = {
        Factura: numeroFactura.value,
        Cliente: Cliente.value,
        DocumentoTipo: DocumentoTipo.value,
        Documento: Documento.value,
        Direccion: Direccion.value,
        Productos: arregloDetalle,
        CantidadTotal: cantidadTotal,
        PrecioTotal: PrecioTotal,
        Vencimiento: vencimiento.value,
        Celular: celular.value,
        date: today,
        Vendedor: Vendedor.value,
        DocumentoVendedor: DocumentoVendedor.value,
        Codigo: CodigoVendedor.value,
        Zona: ZonaVendedor.value,
        PendienteAPagar: PrecioTotal,
        Nota : Nota.value
      };
    
      envioFactura(Factura);
      formFactura.reset();

  }
};


formDetalle.reset();
bodyTabla.innerHTML = ``;

botonGuadar.disable = true;


//Eventos que calculan el precio total

Cantidad.addEventListener("change", () => {
  let total = precioUnidad.value * Cantidad.value;
  precioTotal.value = total.toFixed(2);
});

Codigo.addEventListener("change", () => {
  let total = precioUnidad.value * Cantidad.value;
  precioTotal.value = total.toFixed(2);
});
