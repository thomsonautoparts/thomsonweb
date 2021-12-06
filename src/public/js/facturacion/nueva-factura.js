const d = document,
  formDetalle = d.getElementById("formDetalle"),
  precioUnidad = d.getElementById("precioUnidad"),
  precioTotal = d.getElementById("precioTotal"),
  precio = d.getElementById("Precio"),
  TipoPrecio = d.getElementById("TipoPrecio"),
  Cantidad = d.getElementById("Cantidad"),
  Cantidad2 = d.getElementById("Cantidad2"),
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
  Vencimiento2 = d.getElementById("Vencimiento2"),
  Vendedor = d.getElementById("Vendedor"),
  CodigoVendedor = d.getElementById("CodigoVendedor"),
  DocumentoVendedor = d.getElementById("DocumentoVendedor"),
  ZonaVendedor = d.getElementById("ZonaVendedor"),
  formCantidad = d.getElementById("formCantidad"),
  Porcentaje = d.getElementById("Porcentaje"),
  celular = d.getElementById("Celular"),
  Modelo = d.getElementById("Modelo"),
  Posicion = d.getElementById("Posicion"),
  $Transporte = d.getElementById("Transporte"),
  $TransporteEmpresa = d.getElementById("EmpresaTransporte"),
  $VehiculoTransporte = d.getElementById("VehiculoTransporte"),
  $TipoPrecio = d.getElementById("TipoPrecioGeneral");
  const $spinner = d.getElementById("spinner")
  $PlacaTransporte = d.getElementById("PlacaTransporte"),
  Nota = d.getElementById("Nota");
  let date = d.getElementById("date").value
  let cantidadTotal = 0,
  PrecioTotal = 0;

let arregloDetalle = [];

//Select
$(document).ready(function () {
  $(".js-exam").select2();
})


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
$spinner.removeAttribute("hidden")
fetch("/facturacion/nueva-factura", {
  method: "POST",
})
  .then((response) => {
    return response.json();
  })
  .then((respuesta) => {
    //Llenando datos de los inputs cliente
    $spinner.setAttribute("hidden","")
    Cliente.onchange =  () => {

      for (i = 0; i < respuesta[0].length; i++) {
        if (respuesta[0][i].Empresa == Cliente.value) {
          DocumentoTipo.value = "RIF";

          Documento.value = respuesta[0][i].Rif;

          Direccion.value = respuesta[0][i].Direccion;

          Vendedor.value = respuesta[0][i].Vendedor

          $TipoPrecio.value = respuesta[0][i].TipoPrecio
          Vendedor.innerHTML = `
            <option value="${Vendedor.value}" selected>${Vendedor.value}<option>

          `
          for(x = 0; x < respuesta[3].length; x++){
            if (respuesta[3][x].Username == Vendedor.value) {
              if(respuesta[3][x].Estado == "Inactivo"){
                d.getElementById("message").innerHTML += `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  El vendedor seleccionado se encuentra inactivo. Se necesita activar para poder usarlo.
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`
                window.scrollTo(0,0)
                CodigoVendedor.value = ""
                DocumentoVendedor.value = ""
                ZonaVendedor.value = ""
              }else{
                Porcentaje.value = respuesta[3][x].Porcentaje;
                CodigoVendedor.value = respuesta[3][x].Codigo;
                DocumentoVendedor.value =  respuesta[3][x].Cedula;
                ZonaVendedor.value = respuesta[3][x].Zona;
              }
            }else{
              let options = `
              <option value="${respuesta[3][x].Username}">${respuesta[3][x].Username}</option>
            `
            Vendedor.innerHTML += options
            }
          }
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
        if (respuesta[3][x].Username == Vendedor.value) {
          if(respuesta[3][x].Estado == "Inactivo"){
            d.getElementById("message").innerHTML += `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              El vendedor seleccionado se encuentra inactivo. Se necesita activar para poder usarlo.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
            window.scrollTo(0,0)
            CodigoVendedor.value = ""
            DocumentoVendedor.value = ""
            ZonaVendedor.value = ""
          }else{
            Porcentaje.value = respuesta[3][x].Porcentaje;
            CodigoVendedor.value = respuesta[3][x].Codigo;
            DocumentoVendedor.value =  respuesta[3][x].Cedula;
            ZonaVendedor.value = respuesta[3][x].Zona;
          }
        }
      }
    };
    //llenando datos de transporte
    $Transporte.onchange = () =>{
      for (i = 0; i< respuesta[4].length; i++){
        if(respuesta[4][i].Username == $Transporte.value){
          if(respuesta[4][i].Estado == "Inactivo"){
            d.getElementById("message").innerHTML += `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              El transportista seleccionado se encuentra inactivo. Se necesita activar para poder usarlo.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
            window.scrollTo(0,0)
            $TransporteEmpresa.value = ""
            $VehiculoTransporte.value = ""
            $PlacaTransporte.value = ""


          }else{
            $TransporteEmpresa.value = respuesta[4][i].Empresa 
            $VehiculoTransporte.value = respuesta[4][i].Vehiculo
            $PlacaTransporte.value = respuesta[4][i].Placa
          }
        }
      }
    } 

    //Llenando datos de los inputs productos
    Codigo.onchange =  () => {
      for (i = 0; i < respuesta[1].length; i++) {
        if (respuesta[1][i]._id == Codigo.value) {
          Homologo.value = respuesta[1][i].CodigoG;
          let options 
          let validacion
          for(x = 0; x < respuesta[0].length; x++){
            if(respuesta[0][x].Empresa == Cliente.value){
              validacion = respuesta[0][x].TipoPrecio
            }
          }
          if(validacion == "GRANMAYOR"){
            TipoPrecio.innerHTML = `
            <option value="${validacion}" selected>PRECIO GRAN MAYOR</option>        
            <option value="MAYOR" class="precios">PRECIO MAYOR</option>                                  
            <option value="DETAL" class="precios">PRECIO DETAL</option>                                  
            `
          }
          if(validacion == "MAYOR"){
            TipoPrecio.innerHTML = `
            <option value="${validacion}" selected>PRECIO MAYOR</option>        
            <option value="GRANMAYOR" class="precios">PRECIO GRAN MAYOR</option>                                  
            <option value="DETAL" class="precios">PRECIO DETAL</option>                                  
            `
          }
          if(validacion == "DETAL"){
            TipoPrecio.innerHTML = `
            <option value="${validacion}" selected>PRECIO DETAL</option>        
            <option value="GRANMAYOR" class="precios">PRECIO GRAN MAYORr</option>                                  
            <option value="MAYOR" class="precios">PRECIO MAYOR</option>                                  
            `
          }
          Cantidad.value = 0;
          Cantidad2.value = respuesta[1][i].CantidadTotal

          Cantidad.setAttribute("max", respuesta[1][i].CantidadTotal)

          precioTotal.value = respuesta[1][i].Cantidad * respuesta[1][i].Precio;
        }
      }
      for(z= 0; z < respuesta[1].length; z++){
        if(respuesta[1][z]._id == Codigo.value && TipoPrecio.value == "GRANMAYOR" ){
          precioUnidad.value =  respuesta[1][z].CostoGranMayor
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);
        }
        if(respuesta[1][z]._id == Codigo.value && TipoPrecio.value == "MAYOR" ){
          precioUnidad.value =  respuesta[1][z].CostoMayor
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);

        } 
        if(respuesta[1][z]._id == Codigo.value && TipoPrecio.value == "DETAL" ){
          precioUnidad.value =  respuesta[1][z].CostoDetal
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);
        }
      }
    };

    //Llenar el precio dependiente del tipo 

    TipoPrecio.addEventListener("change", () => {
      for(x= 0; x < respuesta[1].length; x++){
        if(respuesta[1][x]._id == Codigo.value && TipoPrecio.value == "GRANMAYOR" ){
          precioUnidad.value =  respuesta[1][x].CostoGranMayor
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);
        }
        if(respuesta[1][x]._id == Codigo.value && TipoPrecio.value == "MAYOR" ){
          precioUnidad.value =  respuesta[1][x].CostoMayor
          let total = precioUnidad.value * Cantidad.value;
          precioTotal.value = total.toFixed(2);

        } 
        if(respuesta[1][x]._id == Codigo.value && TipoPrecio.value == "DETAL" ){
          precioUnidad.value =  respuesta[1][x].CostoDetal
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
              precioTotal: (detalle.Cantidad + objetoDetalle.Cantidad) * detalle.precioUnidad,
              precioTotal2:(detalle.Cantidad + objetoDetalle.Cantidad) * detalle.precioUnidad,
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
      //anie
      e.preventDefault();
      let validacion = 0
      if(precioTotal.value == 0 || !precioTotal.value || precioTotal.value == ""){
        validacion++
        return
      }
      if(!Cantidad || Cantidad.value == 0 || Cantidad.value == "" ){
        validacion++
        return
      }
      if(!Cantidad2 || Cantidad2.value == 0 || Cantidad2.value == "" ){
        validacion++
        return
      }
      if(!precioUnidad || precioUnidad.value == 0 || precioUnidad.value == ""){
        validacion++
        return
      }
      if(!TipoPrecio || TipoPrecio.value == 0 || TipoPrecio.value == ""){
        validacion++
        return
      }
      if(!Codigo || Codigo.value == 0 || Codigo.value == ""){
        validacion++
        return
      }
      if(validacion == 0){
        console.log("entro")
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
                let valor = "";
                for (x = 0; x < respuesta[1][i].Vehiculo.length; x++) {
                  if (respuesta[1][i].Vehiculo[x].Modelo == respuesta[1][i].Vehiculo[respuesta[1][i].Vehiculo.length - 1].Modelo) {
                    valor += `${respuesta[1][i].Vehiculo[x].Marca} ${respuesta[1][i].Vehiculo[x].Modelo} ${respuesta[1][i].Vehiculo[x].Desde}-${respuesta[1][i].Vehiculo[x].Hasta}`;
                  } else {
                    valor += `${respuesta[1][i].Vehiculo[x].Marca} ${respuesta[1][i].Vehiculo[x].Modelo} ${respuesta[1][i].Vehiculo[x].Desde}-${respuesta[1][i].Vehiculo[x].Hasta}, `;
                  }
                }
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
      }
    };
  });

//Post para enviar datos de la factura al server
const envioFactura = async (data) => {
  return await fetch("/facturacion/nueva-factura/new", {
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
              $('.js-exam').val(null).trigger('change')
              arregloDetalle = []
              window.scrollTo(0,0)
              window.open(`/model-print/${json[1].Factura}`, "Impresion", "width=612, heigh=792");
              location.reload()
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
        $spinner.setAttribute('hidden',"")
      }
      return json;
    });
};

//enviar informacion a node
botonGuadar.onclick = async (e) => {//aqui
  e.preventDefault();

  let errors =[]

  if($TipoPrecio.value == 0 || !$TipoPrecio || $TipoPrecio.value == "" ){
    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Tipo de precio" no puede estar vacio
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }
  if(numeroFactura.value == 0 || !numeroFactura || numeroFactura.value == "" ){
    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Factura" no puede estar vacio
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }
  if($Transporte.value == 0){
    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Transporte" no puede estar vacio
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }

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
  if(!Porcentaje.value){

    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      El campo "Porcentaje" no puede estar vacio
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }
  if(arregloDetalle.length == 0){

    d.getElementById("message").innerHTML += `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      No ha agregado ningun producto. Por favor, agregue alguno y valide de nuevo.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    errors.push(1)
  }
  if(!vencimiento.value && !Vencimiento2.value){
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
    
      const GananciasVendedor = ((+Porcentaje.value / 100) * +PrecioTotal).toFixed(2);
    
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
        Chofer: $Transporte.value,
        EmpresaTransporte: $TransporteEmpresa.value,
        date: date,
        Vendedor: Vendedor.value,
        DocumentoVendedor: DocumentoVendedor.value,
        Codigo: CodigoVendedor.value,
        Zona: ZonaVendedor.value,
        Porcentaje: Porcentaje.value,
        PendienteAPagar: PrecioTotal,
        GananciasVendedor: GananciasVendedor,
        Nota: Nota.value,
        Vencimiento2: Vencimiento2.value,
        TipoPrecio : $TipoPrecio.value
      };
      
      envioFactura(Factura);
      $spinner.removeAttribute('hidden')
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


