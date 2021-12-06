const d = document,
    $factura = d.getElementById("Factura"),
    $Codigo = d.getElementById("Codigo"),
    $Cantidad = d.getElementById("Cantidad"),
    $bodyTabla = d.getElementById("bodyTabla"),
    $btnGuardar = d.getElementById("btnGuardar")
let arregloCodigos = []
let factura

// fetch para traer informacion 
const envioFactura = async (data) => {
    return await fetch("/facturacion/info-productos", {
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
          let options = `<option>--Seleccione un codigo--</option>`  
          for(i=0; i < response[0].Productos.length; i++){
            options += `<option value="${response[0].Productos[i].Codigo}">${response[0].Productos[i].Codigo}</option>`
          }
        $Codigo.innerHTML = options

        $Codigo.onchange = () => {
            for(x=0 ; x < response[0].Productos.length; x++){
                if(response[0].Productos[x].Codigo == $Codigo.value){
                    $Cantidad.value = response[0].Productos[x].Cantidad
                    $Cantidad.setAttribute("max", response[0].Productos[x].Cantidad)
                }
            }
        }
    });
};

const envioDevolucion = async (data) => {
  return await fetch("/realizar-devolucion", {
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
       location.hre = `/ver-devolucion/${response.Devolucion}`
  });
};

$factura.onchange = () => {
    let datos = {
        factura : $factura.value
    }
    envioFactura(datos)
}


$(document).ready(function () {
  $(".js-exam").select2();
});

d.addEventListener("click", e=> {
  if(e.target == $btnGuardar){
    if($factura.value != 0 && $Codigo.value != 0 && $Cantidad.value != 0){
      let validacion = arregloCodigos.find((data) => data == $Codigo.value)
      factura = $factura.value
      if(!validacion){
        arregloCodigos.push($Codigo.value)
        $factura.setAttribute("disabled","")
        let tr = `
        <tr>
          <td class="text-center">${$Codigo.value}</td>
          <td class="text-center">${$Cantidad.value}</td>
          <td class="text-center"><button class="btn btn-danger">-</button></td>
        </tr>
        `
        bodyTabla.innerHTML += tr
      }else{
        alert("Codigo ya registrado")
      }
    }
  }
  if(e.target.textContent == "-"){
    let linea = e.target.parentElement.parentElement
    bodyTabla.removeChild(linea)
  }
  if(e.target.textContent == "Registrar"){
    let lineas = bodyTabla.children
    let codigos = []
    for(i=0; i< lineas.length; i++){
      let codigo = {
        CodigoT: lineas[i].children[0].textContent,
        Cantidad:lineas[i].children[1].textContent
      }
      codigos.push(codigo)
    } 
    let data = {
      Codigos: codigos,
      Factura: factura,
    }
    envioDevolucion(data)
  }
})