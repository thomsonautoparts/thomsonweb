const d = document,
  w = window,
  n = navigator;



function loadPage() {

    if(event.target.textContent == "Registrar inventario"){
        const $main = d.getElementById("main");
        
        $main.firstElementChild.firstElementChild.textContent = "Registrar Inventario";

        d.getElementById("contenido").textContent=``;
        d.getElementById("contenido").innerHTML=`
        <form action="">
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th class="text-light h5">Proveedor</th>
                <th class="text-light h5">Procedencia</th>
                <th class="text-light h5">Codigo</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td>
                  <input type="text" name="Porveedor" id="" class="form-facturacion w-100" placeholder="introduce el proveedor">
                </td>
                <td>
                  <input type="text" name="Provedencia" id="" class="form-facturacion w-100"  placeholder="Introduce la procedencia">
                </td>
                <td>
                  <input type="number" name="Codigo" id="" class="form-facturacion w-100" placeholder="introduce un codigo">
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th class="text-light h5">Descripcion</th>
                <th class="text-light h5">Referencias</th>
                <th class="text-light h5">Costos y precios</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td>
                  <input type="text" name="Descripcion" id="" class="form-facturacion w-100" placeholder="Introduce el proveedor">
                </td>
                <td>
                  <input type="text" name="Referencias" id="" class="form-facturacion w-100"  placeholder="Introduce las referencias">
                </td>
                <td>
                  <input type="number" name="Costos y precios" id="" class="form-facturacion w-100" placeholder="Introduce un precio">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr class="featurette-divider">
        <input type="button" value="Enviar registro" class="btn btn-secondary btn-center ">
      </form> 
      `;

    }
    
    if(event.target.textContent == "Registrar cliente"){
        const $main = d.getElementById("main");
        
        $main.firstElementChild.firstElementChild.textContent = "Registrar Cliente";
        d.getElementById("contenido").innerHTML=``;
        d.getElementById("contenido").innerHTML=  `
        <form action="">
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th class="text-light h5 text-center">Codigo</th>
                <th class="text-light h5 text-center">Descripcion</th>
                <th class="text-light h5 text-center" colspan="2">Documento</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td>
                  <input type="number" name="Codigo" id="" class="form-facturacion w-100" placeholder="introduce un codigo">
                </td>
                <td>
                  <input type="text" name="Descripcion" id="" class="form-facturacion w-100"  placeholder="Introduce una descripcion">
                </td>
                <td colspan="2">
                  <select name="documento" class="form-facturacion" id="">
                    <option value="" selected>RIF</option>
                    <option value="">C.I.</option>
                  </select>
                  <input type="number" name="Codigo" id="" class="form-facturacion w-75" placeholder="introduce un codigo">
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th class="text-light h5 text-center">Direccion</th>
                <th class="text-light h5 text-center">Zona</th>
                <th class="text-light h5 text-center">Ciudad</th>
                <th class="text-light h5 text-center">Codigo postal</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td>
                  <input type="text" name="Direccion" id="" class="form-facturacion w-100" placeholder="Introduce una direccion">
                </td>
                <td>
                  <input type="text" name="Zona" id="" class="form-facturacion w-100"  placeholder="Introduce una zona">
                </td>
                <td>
                  <input type="text" name="Ciudad" id="" class="form-facturacion w-100" placeholder="Introduce una ciudad">
                </td>
                <td>
                  <input type="number" name="Codigo postal" id="" class="form-facturacion w-100" placeholder="Introduce un codigo postal">
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th class="text-light h5 text-center" colspan="2">Email</th>
                <th class="text-light h5 text-center">telefono oficina</th>
                <th class="text-light h5 text-center">telefono celular</th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <th colspan="2">
                  <input type="email" name="Email" id="" class="form-facturacion w-100" placeholder="introduce un email">
                </th>
                <th >
                  <input type="number" name="telefono" id="" class="form-facturacion w-100" placeholder="Telefono oficina">
                </th>
                <th>
                <input type="number" name="Celular" id="" class="form-facturacion w-100" placeholder="Telefono celular">
                </th>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th class="text-light h5 text-center">Vendedor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <input type="number" name="Vendedor" id="" class="form-facturacion w-100"  placeholder="Introduce un codigo de vendedor">
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <hr class="featurette-divider">
        <input type="button" value="Enviar registro" class="btn btn-secondary btn-center ">
      </form>
        `

    }

    if(event.target.textContent == "Registrar vendedor"){
        const $main = d.getElementById("main");
        
        $main.firstElementChild.firstElementChild.textContent = "Registrar vendedor";
        d.getElementById("contenido").innerHTML=``
        d.getElementById("contenido").innerHTML=`
        <form action="">
          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th class="text-light h5">Nombre</th>
                  <th class="text-light h5">Codigo</th>
                  <th class="text-light h5">Direccion</th>
                  <th class="text-light h5">Telefono</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td>
                    <input type="text" name="Nombre" id="" class="form-facturacion w-100" placeholder="introduce el nombre">
                  </td>
                  <td>
                    <input type="number" name="Codigo" id="" class="form-facturacion w-100"  placeholder="Introduce el codigo">
                  </td>
                  <td>
                    <input type="text" name="direccion" id="" class="form-facturacion w-100" placeholder="introduce la direccion">
                  </td>
                  <td>
                    <input type="number" name="telefono" id="" class="form-facturacion w-100" placeholder="introduce un telefono">
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th class="text-light h5">Comision por cobro %</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td>
                    <input type="text" name="Comision" id="" class="form-facturacion w-100" placeholder="Introduce la comision en %">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr class="featurette-divider">
          <input type="button" value="Enviar registro" class="btn btn-secondary btn-center ">
        </form>
        `;

    }

    if(event.target.textContent == "Consultar facturas"){
        const $main = d.getElementById("main");
        
        $main.firstElementChild.firstElementChild.textContent = "Consulta";
        d.getElementById("contenido").innerHTML=``
        d.getElementById("contenido").innerHTML=`<div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th class="text-light">Numero factura</th>
              <th class="text-light">Fecha de emision</th>
              <th class="text-light">Cliente</th>
              <th class="text-light">Producto</th>
              <th class="text-light">Codigo thomson</th>
              <th class="text-light">Cantidad</th>
              <th class="text-light">Precio</th>
              <th class="text-light">Cantidad cancelada</th>
              <th class="text-light">Por pagar</th>
              <th class="text-light">Estado</th>
              <th class="text-light"> Actualizar</th>
              <th class="text-light">Detalles</th>
    
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-light">1,001</td>
              <td class="text-light">23/03/2021</td>
              <td class="text-light">random</td>
              <td class="text-light">data</td>
              <td class="text-light">placeholder</td>
              <td class="text-light">Number</td>
              <td class="text-light">100$</td>
              <td class="text-light">100$</td>
              <td class="text-light">0$</td>
              <td class="text-success">Cerrada</td>
              <td class="text-light"> <a href="" class="text-info">Actualizar</a></td>
              <td class="text-light"> <a href="" class="text-info">Ver</a></td>
            </tr>
            <tr>
                <td class="text-light">1,002</td>
                <td class="text-light">23/03/2021</td>
                <td class="text-light">random</td>
                <td class="text-light">data</td>
                <td class="text-light">placeholder</td>
                <td class="text-light">Number</td>
                <td class="text-light">100$</td>
                <td class="text-light">50$</td>
                <td class="text-light">50$</td>
                <td class="text-warning">Pendiente</td>
                <td class="text-light"> <a href="" class="text-info">Actualizar</a></td>
                <td class="text-light"> <a href="" class="text-info">Ver</a></td>
            </tr>
            <tr>
                <td class="text-light">1,003</td>
                <td class="text-light">23/03/2021</td>
                <td class="text-light">random</td>
                <td class="text-light">data</td>
                <td class="text-light">placeholder</td>
                <td class="text-light">Number</td>
                <td class="text-light">100$</td>
                <td class="text-light">0$</td>
                <td class="text-light">100$</td>
                <td class="text-danger">Cancelada</td>
                <td class="text-light"> <a href="" class="text-info">Actualizar</a></td>
                <td class="text-light"> <a href="" class="text-info">Ver</a></td>
            </tr>
          </tbody>
        </table>
      </div>`;
        

     
}
if(event.target.textContent == "Facturas pendientes"){
    const $main = d.getElementById("main");

    d.getElementById("contenido").innerHTML=``
    d.getElementById("contenido").innerHTML=`
    <div class="table-responsive">
    <table class="table table-striped table-sm">
    <thead>
        <tr>
          <th class="text-light">Numero factura</th>
          <th class="text-light">Fecha de emision</th>
          <th class="text-light">Cliente</th>
          <th class="text-light">Producto</th>
          <th class="text-light">Codigo thomson</th>
          <th class="text-light">Cantidad</th>
          <th class="text-light">Precio</th>
          <th class="text-light">Cantidad cancelada</th>
          <th class="text-light">Por pagar</th>
          <th class="text-light">Estado</th>
          <th class="text-light"> Actualizar</th>
          <th class="text-light">Detalles</th>
          <tbody>
          <tr>
            <td class="text-light">1,002</td>
            <td class="text-light">23/03/2021</td>
            <td class="text-light">random</td>
            <td class="text-light">data</td>
            <td class="text-light">placeholder</td>
            <td class="text-light">Number</td>
            <td class="text-light">100$</td>
            <td class="text-light">50$</td>
            <td class="text-light">50$</td>
            <td class="text-warning">Pendiente</td>
            <td class="text-light"> <a href="" class="text-info">Actualizar</a></td>
            <td class="text-light"> <a href="" class="text-info">Ver</a></td>
        </tr>
          </tbody>


        </tr>
      </thead>
      </table>
      </div>

      <hr class="featurette-divider">
      <input type="button" value="Descargar registro" class="btn btn-secondary btn-center ">

    `

    

}
}



d.addEventListener("click", loadPage)


console.log("Javascript 10/10")