const d = document,
  $Vendedor = d.getElementById("Vendedor"),
  $GananciasVendedor = d.getElementById("GananciasVendedor"),
  $btnRegistrarPago = d.getElementById("btnRegistrarPago"),
  $btnAgregar = d.getElementById("btnAgregar"),
  $bodyTabla = d.getElementById("bodyTabla"),
  $Facturas = d.getElementById("Facturas"),
  $Comisiones = d.getElementById("Comisiones"),
  $Comentario = d.getElementById("Comentario"),
  $insertarErrores = d.getElementById("insertarErrores"),
  $total = d.getElementById("total")
  let datos
  let total = 0
    
$(document).ready(function () {
    $(".js-exam").select2();
})
    
    
// fetch para traer informacion 
const envioComisiones = async (data) => {
    return await fetch("/registrar-pago-comisiones", {
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
        window.open(`/ver-recibo-pago-comision/${response}`, `Recibo ${response}`, "width=750,height=500");
        location.reload()
      });
};
const envioFactura = async (data) => {
    return await fetch("/facturacion/por-cancelar-info", {
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
        datos = response
        let options = '<option value="0">--Seleccione una factura--</option>'
        for(i=0; i< response.length; i++){
          let opt = `<option value="${response[i].Factura}">${response[i].Factura}</option>`
          options += opt
        }
        $Facturas.innerHTML = options

        });
};

$Vendedor.onchange = () => {
    let datos = {
        Vendedor : $Vendedor.value
    }
    envioFactura(datos)
}

$Facturas.onchange = () => {
     let Ganacias = datos.filter((data) => data.Factura == $Facturas.value)
      if(Ganacias.length > 0){
        $Comisiones.value = Ganacias[0].GananciasVendedor 
      }else{
        $Comisiones.value = "" 

      }
}
d.addEventListener("click", e=> {
  if(e.target == $btnAgregar){
    if($Comisiones.value){
      total += +$Comisiones.value
      $Vendedor.setAttribute("disabled","")
      $total.textContent = total
      let tr = `
        <tr>
          <td class="text-center">${$Facturas.value}</td>
          <td class="text-center">${$Comisiones.value}</td>
          <td class="text-center"><button class="btn btn-danger">-</button></td>
        </tr>
      `
      $bodyTabla.innerHTML += tr
    }
  }
  if(e.target.textContent == "-"){
    let fila = e.target.parentElement.parentElement
    total -= +fila.children[1].textContent
    $total.textContent = total
    $bodyTabla.removeChild(fila)
  }
  if(e.target == $btnRegistrarPago){
    if(!$Comentario.value || $Comentario.value == "" || $Comentario.value == 0){
      $insertarErrores.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        El campo "Comentario" no puede estar vacío. Por favor, valide e intente de nuevo
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>

      `

    }else{
      let facturas = []
      for(i=0; i< $bodyTabla.children.length; i++){
        let datos = {
          Factura: $bodyTabla.children[i].children[0].textContent,
          Comision:$bodyTabla.children[i].children[1].textContent,
        }
        facturas.push(datos)
      }
      let data = {
        Vendedor: $Vendedor.value,
        Facturas: facturas,
        Total : +$total.textContent,
        Comentario: $Comentario.value,
      }
      envioComisiones(data)
    }
  }
})
