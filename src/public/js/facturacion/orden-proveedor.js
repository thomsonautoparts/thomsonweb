document.addEventListener("keydown", e => {
    if(e.keyCode == 120 ){
        window.open('/facturacion/acceso-directo-stock', 'Stock', "width=1400, heigh=100%")
    }
})
//codigo de realizar orden
const d = document
const $VeintePies = d.getElementById("20Pies")
const $CuarentaPies = d.getElementById("40Pies")
const $CuarentaPiesHQ = d.getElementById("40PiesHC")
const $Peso = d.getElementById("Peso")
const $AgregadosMcpherson = d.getElementById("AgregadosMcpherson")   
const $AgregadosConvencionales = d.getElementById("AgregadosConvencionales")   
const $AgregadosBases = d.getElementById("AgregadosBases")   
const $AgregadosGuardapolvo = d.getElementById("AgregadosGuardapolvo")   
const $agregados = d.getElementById("agregados")   
const $agregadosCosto = d.getElementById("agregadosCosto")   
const $Proveedor = d.getElementById("Proveedor")
const busqueda = d.getElementById("buscar")
const $spinner = d.getElementById("spinner")
const table = document.getElementById("tabla").tBodies[0];
let  validacionCodigo = true;
fetch("/facturacion/ver-orden-temporal-proveedor", {
method: "POST",
})
.then((response) => {
  return response.json();
})
.then((response	) => {
  $Peso.textContent = +response.Peso.toFixed(2)
  $AgregadosMcpherson.textContent = response.CantidadMcpherson
  $AgregadosConvencionales.textContent = response.CantidadConvencional
  $AgregadosBases.textContent = response.CantidadBase
  $AgregadosGuardapolvo.textContent = response.CantidadGuardapolvo
  $agregados.textContent = response.CantidadTotal
  $agregadosCosto.textContent = "$"+response.CostoFOB
  if(+response.veintePies == 26){
    $VeintePies.classList.add("bg-danger")
    $VeintePies.textContent = response.veintePies
    
  }else{
    $VeintePies.textContent = response.veintePies
  }
  if(+response.cuarentaPies == 56){
    $CuarentaPies.textContent = response.cuarentaPies
    $CuarentaPies.classList.add("bg-danger")
  }else{
    
    $CuarentaPies.textContent = response.cuarentaPies
  }
  $CuarentaPiesHQ.textContent = response.cuarentaPiesHC
})

//busqueda tabla y proveedor
let buscaTabla = function () {
texto = busqueda.value.toLowerCase();
let r = 0;
while ((row = table.rows[r++])) {
if (row.innerText.toLowerCase().indexOf(texto) !== -1)
  row.style.display = null;
else row.style.display = "none";
}
};
busqueda.addEventListener("keydown", e => {
if(e.keyCode == 13){
e.preventDefault()
}
})

busqueda.addEventListener("keyup", buscaTabla);


//Filro por proveedor
const solicitarInformacioProveedor = async (data) => {
return await fetch("/solicitar-informacion-proveedor-productos", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-type": "application/json; charset=utf-8",
  },
})
  .then((response) => {
    return response.json()
  }).then((response) => {
      let body = ""
  for(i=0; i< response.length; i++){
    let tr = `
      <tr>
            <td class="text-light text-center"><p>${response[i].Proveedor}</p></th>
            <td class="text-light text-center"><p>${response[i].CodigoT}</p></th>
            <td class="text-light text-center"><p>${response[i].CodigoG}</p></td>
            <td class="text-light text-center"><p>${response[i].Descripcion}</p></td>
            <td class="text-light text-center"><p>${response[i].Posicion}</p></td>
            <td class="text-light text-center"><p>${response[i].Familia}</p></td>
            <td class="text-light text-center" style="display: none;"><p>${response[i].Estado}</p></td>
            <td class="text-light text-center">${response[i].CantidadTotal}</td>
            <td class="text-light text-center">${response[i].CantidadProduccion}</td>
            <td class="text-light text-center">${response[i].CantidadTransito}</td>
            <td class="text-light text-center">${response[i].CantidadVendida}</td>
            <td class="text-light text-center">${response[i].Unidades}</td>
            <td class="text-light text-center">${response[i].Precio}</td>
            <td class="text-light text-center"><input type="number" data-input="cantidad"  min="0" value="0" class="w-100 form-control"/></td>
            <td class="text-light text-center"><button class="btn btn-warning">Agregar</button></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].Costo}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].CostoGranMayor}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].CostoMayor}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].CostoDetal}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].TipoProducto}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].Posicion}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].Alto}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].Ancho}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].Largo}</p></td>
            <td class="text-light text-center" style="display: none"><p>${response[i].Peso}</p></td>
      </tr>
    `
    body += tr
  }
    table.innerHTML = body
  $spinner.setAttribute('hidden',"")
  })
  }


$Proveedor.onchange = () => {
if($Proveedor.value != 0){
let data = {
  Proveedor : $Proveedor.value
}
  $spinner.removeAttribute('hidden')
solicitarInformacioProveedor(data)
}
}

//busqueda tabla y proveedor
const enviarProductoServidor = async (data) => {//steven
return await fetch("/enviar-producto-orden-temporal-proveedor", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-type": "application/json; charset=utf-8",
  },
})
  .then((response) => {
    return response.json()
  }).then((response) => {
    if(response.error == false){

    $Peso.textContent = response.Peso
    $agregados.textContent = +$agregados.textContent + +response.Cantidad
    $agregadosCosto.textContent = $agregadosCosto.textContent.replace("$", "")
    $agregadosCosto.textContent  = (+$agregadosCosto.textContent + +response.PrecioTotal).toFixed(2)
    $agregadosCosto.textContent = "$"+$agregadosCosto.textContent
    if(+$VeintePies.textContent < 30){
      $VeintePies.textContent = (+$VeintePies.textContent + +response.metrosCubicos).toFixed(2)
      if(+$VeintePies.textContent > 30 ){
        $VeintePies.textContent = 30
        $VeintePies.classList.add("bg-danger")
      }
    }
    if(+$CuarentaPies.textContent < 69){
      $CuarentaPies.textContent = (+$CuarentaPies.textContent + +response.metrosCubicos).toFixed(2)
      if(+$CuarentaPies.textContent > 69){
        $CuarentaPies.textContent = 69
        $CuarentaPies.classList.add("bg-danger")
      }
    }
    $CuarentaPiesHQ.textContent = (+$CuarentaPiesHQ.textContent + +response.metrosCubicos).toFixed(2)
    if(response.ModeloProducto == "Convecional" || response.ModeloProducto == "Conventional" ){
      $AgregadosConvencionales.textContent = +$AgregadosConvencionales.textContent + +response.Cantidad
    }
    if(response.ModeloProducto == "Mcpherson"){
      $AgregadosMcpherson.textContent = + $AgregadosMcpherson.textContent + +response.Cantidad
    }
    if(response.ModeloProducto == "Strut mount" || response.ModeloProducto == "Strut"  ){
      $AgregadosBases.textContent = +$AgregadosBases.textContent + +response.Cantidad
    }if(response.ModeloProducto == "Boot"){
      $AgregadosGuardapolvo.textContent = +$AgregadosGuardapolvo.textContent + +response.Cantidad
    }
    }else{
              d.getElementById("errors").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              ${response.error}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          `
    }


  })
};
const validarCodigoOrden = async (data) => {
return await fetch("/validar-codigo-orden-temporal-proveedor", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-type": "application/json; charset=utf-8",
  },
})
  .then((response) => {
    return response.json()
  }).then( (response) => {
    console.log(response.validacion)
     validacionCodigo =  response.validacion
  })
};

d.addEventListener("click", async  e=> {
if(e.target.textContent == "Agregar"){
let fila = e.target.parentElement.parentElement
if(fila.children[13].firstElementChild.value >0){
    let Proveedor = fila.children[0].firstElementChild.textContent
     let producto = {
        CodigoT: fila.children[1].firstElementChild.textContent,
        CodigoG: fila.children[2].firstElementChild.textContent,
        Descripcion: fila.children[3].firstElementChild.textContent,
        Modelo: fila.children[5].firstElementChild.textContent,
        TipoProducto: fila.children[19].firstElementChild.textContent,
        Costo: fila.children[15].firstElementChild.textContent,
        CostoGranMayor: fila.children[16].firstElementChild.textContent,
        CostoMayor: fila.children[17].firstElementChild.textContent,
        CostoDetal: fila.children[18].firstElementChild.textContent,
        Posicion: fila.children[20].firstElementChild.textContent,
        Cantidad: fila.children[13].firstElementChild.value,
        PrecioUnidad: fila.children[12].textContent.replace("$", ""),
        PrecioTotal: (+fila.children[13].firstElementChild.value * +fila.children[12].textContent.replace("$", "")  ).toFixed(2),
        Alto: fila.children[21].firstElementChild.textContent,
        Ancho: fila.children[22].firstElementChild.textContent,
        Largo: fila.children[23].firstElementChild.textContent,
        Peso: (+fila.children[24].firstElementChild.textContent * +fila.children[13].firstElementChild.value).toFixed(2),
      };
      let data = {
        CodigoT: fila.children[1].firstElementChild.textContent
      }
      await validarCodigoOrden(data)
      if(validacionCodigo){
        //codigo no existe y agregamos
        let data2 = {
          producto : producto,
          proveedor  : Proveedor
        }
        enviarProductoServidor(data2)
        fila.children[13].firstElementChild.value = 0

      }else{
          d.getElementById("errors").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              El código que intenta agregar ya se encuentra en la lista. Por favor, valide e intente de nuevo.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          `
      }

}else{
  //mandar error
}
}
})
