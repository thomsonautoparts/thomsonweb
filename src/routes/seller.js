const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const clienteDB = require("../models/cliente");
const vendedorDB = require("../models/vendedor");
const stockDB = require("../models/stock");
const usersDB = require("../models/users");
const facturasDB = require("../models/factura");
const ordenTemporalDB = require("../models/cliente/orden-cliente-temporal")
const ordenesClienteDB = require('../models/cliente/ordenes-clientes')
const ordenesDB = require('../models/cliente/ordenes-clientes')
const stripe = require('stripe')('sk_test_51InQ04CuQ8FvLKlqZ4QtuWOao1i3yn0xAz4KacBIoRXaRpfrTqfo6GvsxQn9mdDO3WCgZw09ePMsVVSW9vHaTAsK0036pIu67H');
const {isAuthenticatedSeller} = require("../helpers/auth");
const { constants } = require("fs");

//ruta del home seller
router.get('/home-seller', isAuthenticatedSeller, async (req, res) => {
    let vendedor = req.user.email
    let usuario = await vendedorDB.findOne({email:vendedor})
    usuario =  usuario.Username
    res.render('seller/home',{
      usuario
    })

})
//ruta del realizar orden vendedor
router.get('/realizar-orden-vendedor' ,isAuthenticatedSeller, async (req, res) => {
  
    if(req.user.TipoPrecio == "GRANMAYOR"){
        await stockDB
      .find()
      .sort({ "Modelo": 1 })
      .then((document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              CodigoT: document.CodigoT,
              CodigoG: document.CodigoG,
              Modelo: document.Modelo,
              Año: document.Modelo,
              Familia: (document.Familia).toUpperCase(),
              TipoProducto: (document.TipoProducto).toUpperCase(),
              Vehiculo: document.Vehiculo,
              Posicion: (document.Posicion).toUpperCase(),
              Precio: document.CostoGranMayor,
            };
          }),
        };
        for (i = 0; i < contex.stock.length; i++) {
          let Descripcion = "";
          for (x = 0; x < contex.stock[i].Vehiculo.length; x++) {
            if (
              contex.stock[i].Vehiculo[x].Modelo ==
              contex.stock[i].Vehiculo[contex.stock[i].Vehiculo.length - 1].Modelo
            ) {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}`;
            } else {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}, `;
            }
          }
          contex.stock[i].Descripcion = Descripcion;
        }
        res.render("seller/realizar-orden", {
          stock: contex.stock,
        });
      });

    }if(req.user.TipoPrecio == "MAYOR"){
        await stockDB
        .find()
        .sort({ "Modelo": 1 })
        .then((document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
                CodigoG: document.CodigoG,
                Modelo: document.Modelo,
                Ano: document.Año,
                Familia: (document.Familia).toUpperCase(),
                TipoProducto: (document.TipoProducto).toUpperCase(),
                Vehiculo: document.Vehiculo,
              Posicion: (document.Posicion).toUpperCase(),
                Precio: document.CostoMayor,
              };
            }),
          };
          for (i = 0; i < contex.stock.length; i++) {
            let Descripcion = "";
            for (x = 0; x < contex.stock[i].Vehiculo.length; x++) {
              if (
                contex.stock[i].Vehiculo[x].Modelo ==
                contex.stock[i].Vehiculo[contex.stock[i].Vehiculo.length - 1].Modelo
              ) {
                Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}`;
              } else {
                Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}, `;
              }
            }
            contex.stock[i].Descripcion = Descripcion;
          }
          res.render("seller/realizar-orden", {
            stock: contex.stock,
          });
        });

    }if(req.user.TipoPrecio == "DETAL"){
        await stockDB
        .find()
        .sort({ "Modelo": 1 })
        .then((document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
                CodigoG: document.CodigoG,
                Modelo: document.Modelo,
                Ano: document.Año,
                Familia: (document.Familia).toUpperCase(),
                TipoProducto: (document.TipoProducto).toUpperCase(),
                Vehiculo: document.Vehiculo,
                Posicion: (document.Posicion).toUpperCase(),
                Precio: document.CostoDetalMayor,
              };
            }),
          };
          for (i = 0; i < contex.stock.length; i++) {
            let Descripcion = "";
            for (x = 0; x < contex.stock[i].Vehiculo.length; x++) {
              if (
                contex.stock[i].Vehiculo[x].Modelo ==
                contex.stock[i].Vehiculo[contex.stock[i].Vehiculo.length - 1].Modelo
              ) {
                Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}`;
              } else {
                Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}, `;
              }
            }
            contex.stock[i].Descripcion = Descripcion;
          }
          res.render("seller/realizar-orden", {
            stock: contex.stock,
          });
        });
    }
})

//ruta para guardar los datos de la orden del vendedor

router.post('/realizar-orden/vendedor' ,isAuthenticatedSeller , async  (req, res) => {
    let {CantidadTotal, PrecioTotal, Productos} = req.body
    let email = req.user.email
  
    const ordenTemporal = await ordenTemporalDB.findOne({email: email})
  
    if(ordenTemporal){
      CantidadTotal = +CantidadTotal + +ordenTemporal.CantidadTotal
      PrecioTotal = +PrecioTotal + +ordenTemporal.PrecioTotal
      for(r = 0 ; r < ordenTemporal.Productos.length; r++){
        Productos.push(ordenTemporal.Productos[r])
      }
      await ordenTemporalDB.findOneAndUpdate({email: email},{
        CantidadTotal,
        PrecioTotal,
        Productos
      })
      let registrado = [{ ok: "registrado correctamente" }];
      res.send(JSON.stringify(registrado));
    }else{
      const nuevaOrden = new ordenTemporalDB({
        email,
        CantidadTotal,
        PrecioTotal,
        Productos
      })
      nuevaOrden.save()
      let registrado = [{ ok: "registrado correctamente" }];
      res.send(JSON.stringify(registrado));
    }
  })

//ruta para cargar la vista del vendedor
router.get('/lista-orden-vendedor' ,isAuthenticatedSeller , async (req, res) => {
    let email = req.user.email
    let vendedor = await vendedorDB.findOne({email: email})
    let clientes = await clienteDB.find({Vendedor: vendedor.Username})

    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa
        }
    })

    res.render('seller/lista-compra',{
        clientes
    })
})
  
//ruta para registrar orden del vendedor

router.post('/registrar-orden-vendedor' ,isAuthenticatedSeller , async (req, res) => {
    let {Cliente} = req.body
    let cliente = await clienteDB.findOne({Empresa: Cliente})
    let email = req.user.email
    let TipoPrecio = req.user.TipoPrecio
    const orden = await ordenTemporalDB.findOne({email: email})
    let Productos = orden.Productos
    let PrecioTotal = orden.PrecioTotal
    let CantidadTotal = orden.CantidadTotal
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    let date = `${año}-${mes}-${dia}`;
    let OrdenNumero = (orden._id).toString()
    OrdenNumero = OrdenNumero.substr(OrdenNumero.length - 6, OrdenNumero.length)
    OrdenNumero = OrdenNumero.toUpperCase()
    let i = 1
    for(i; i != 0; i++){
      let validacion = await ordenesClienteDB.findOne({OrdenNumero: OrdenNumero})
      if(validacion){
        OrdenNumero = OrdenNumero.substr(0, +OrdenNumero.length - 1) + i
        OrdenNumero = OrdenNumero.toUpperCase()
        i++
      }else{
        await ordenTemporalDB.findOneAndDelete({email: email})
        let Vendedor = email
        email = cliente.email
        const newOrden = new ordenesClienteDB({
          OrdenNumero,
          email,
          Vendedor,
          TipoPrecio,
          Productos,
          PrecioTotal,
          CantidadTotal,
          date,
          Timestamp
        })
        newOrden.save()
        let registrado = [{ok: "Registrado"}]
        res.send(JSON.stringify(registrado))
        return i = 0
      }
    }
  
  })

//ruta de estado de cuenta del vendedor

router.get('/estado-cuenta-vendedor', isAuthenticatedSeller, async (req, res) => {
    let email = req.user.email
  let cliente = await clienteDB.findOne({email: email})
  let facturas = await facturasDB.find({Cliente: cliente.Empresa}).sort({"Timestamp" : -1})
  let fecha = new Date()
  let FacturasVencidas = 0
  let FacturasEmitidas = 0
  let PendienteAPagar = 0
  let ValorFacturas = 0
  for(i=0; i < facturas.length; i++){
    FacturasEmitidas += 1
    PendienteAPagar = (+PendienteAPagar + +facturas[i].PendienteAPagar).toFixed(2)
    ValorFacturas = (+ValorFacturas  + +facturas[i].PrecioTotal).toFixed(2)
    let vencimiento = new Date(facturas[i].Vencimiento)
    if(vencimiento < fecha){
      FacturasVencidas += 1
      facturas[i].EstadoVencimiento = "Vencida"
    }else{
      facturas[i].EstadoVencimiento = "Dentro de plazo"
    }
  }

  facturas = facturas.map((data) => {
    return{
      EstadoVencimiento : data.EstadoVencimiento,
      Vencimiento: data.Vencimiento,
      Factura: data.Factura,
      PrecioTotal: data.PrecioTotal,
      PendienteAPagar: data.PendienteAPagar,
      _id: data._id
    }
  })
    
    res.render('seller/estado-cuenta',{
      facturas,
      FacturasVencidas,
      FacturasEmitidas,
      PendienteAPagar,
      ValorFacturas
    })
    
})

//ruta para ver clientes asignados

router.get('/ver-clientes-asignados-vendedor', isAuthenticatedSeller,async (req, res) => {
  let email = req.user.email
  let vendedor= await vendedorDB.findOne({email: email})
  let username = vendedor.Username  
  let clientes = await clienteDB.find({Vendedor: username}).sort({Empresa: 1})
    clientes = clientes.map((data) => {
      return{
        Nombres: data.Nombres,
        Apellidos: data.Apellidos,
        Cedula: data.Cedula,
        Empresa: data.Empresa,
        Direccion: data.Direccion,
        Rif: data.Rif,
        Telefono: data.Telefono,
        Celular: data.Celular,
        Vendedor: data.Vendedor,
        TipoPrecio: data.TipoPrecio,
        Codigo: data.Codigo,
        email: data.email,
        User: data.User,
      }
    }) 

    res.render('seller/clientes-asignados',{
      clientes
    })
    
    
  })
  
  //ruta para ver las facturas emitidas
  
  router.get('/ver-facturas-emitidas-vendedor', isAuthenticatedSeller,async (req, res) => {
    let email = req.user.email
    let vendedor= await vendedorDB.findOne({email: email})
    let username = vendedor.Username  
    let facturas = await facturasDB.find({Vendedor: username}).sort({"Timestamp":-1})
    
    facturas = facturas.map((data) => {
      return{
      Factura: data.Factura,
      date: data.date,
      Vencimiento: data.Vencimiento,
      Cliente: data.Cliente,
      Documento: data.Documento,
      Direccion: data.Direccion,
      CantidadTotal: data.CantidadTotal,
      PrecioTotal:  new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.PrecioTotal),
      PendienteAPagar:  new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.PendienteAPagar),
      Timestamp: data.Timestamp,
      DocumentoTipo: data.DocumentoTipo,
      OrdenNumero: data.OrdenNumero,
      Celular: data.Celular,
      Vendedor: data.Vendedor,
      Codigo: data.Codigo,
      DocumentoVendedor: data.DocumentoVendedor,
      Zona: data.Zona,
      Porcentaje: data.Porcentaje,
      FechaModificacion: data.FechaModificacion,
      UltimoPago: data.UltimoPago,
      FechaUltimoPago: data.FechaUltimoPago,
      PendienteAPagarComision: data.PendienteAPagarComision,
      GananciasVendedor: data.GananciasVendedor,
      FechaPagoComision: data.FechaPagoComision,
      EstadoComision: data.EstadoComision,
      Estado: data.Estado,
      User: data.User,
      Nota: data.Nota,
      Chofer: data.Chofer,
      EmpresaTransporte: data.EmpresaTransporte,
      Nota: data.Nota,
      _id: data._id
    }
  })

  
      res.render('seller/facturas',{
        facturas
      })



})

//ruta para ver las facturas pendientes

router.get('/ver-facturas-pendientes-vendedor', isAuthenticatedSeller,async (req, res) => {
  let email = req.user.email
  let vendedor= await vendedorDB.findOne({email: email})
  let username = vendedor.Username  
  let facturas = await facturasDB.find({$and: [{Estado:"Por cobrar"} ,{Vendedor: username}]}).sort({"Timestamp":-1})
  
  facturas = facturas.map((data) => {
    return{
    Factura: data.Factura,
    Timestamp: data.Timestamp,
    Cliente: data.Cliente,
    DocumentoTipo: data.DocumentoTipo,
    Documento: data.Documento,
    Direccion: data.Direccion,
    OrdenNumero: data.OrdenNumero,
    CantidadTotal: data.CantidadTotal,
    PrecioTotal:  new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.PrecioTotal),
    date: data.date,
    Vencimiento: data.Vencimiento,
    Celular: data.Celular,
    Vendedor: data.Vendedor,
    Codigo: data.Codigo,
    DocumentoVendedor: data.DocumentoVendedor,
    Zona: data.Zona,
    Porcentaje: data.Porcentaje,
    FechaModificacion: data.FechaModificacion,
    UltimoPago: data.UltimoPago,
    FechaUltimoPago: data.FechaUltimoPago,
    PendienteAPagar:  new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.PendienteAPagar),
    PendienteAPagarComision: data.PendienteAPagarComision,
    GananciasVendedor: data.GananciasVendedor,
    FechaPagoComision: data.FechaPagoComision,
    EstadoComision: data.EstadoComision,
    Estado: data.Estado,
    User: data.User,
    Nota: data.Nota,
    Chofer: data.Chofer,
    EmpresaTransporte: data.EmpresaTransporte,
    Nota: data.Nota,
    _id: data._id,
  }
})


    res.render('seller/facturas-pendientes',{
      facturas
    })


})

//ruta para ver las facturas pendientes

router.get('/ver-ordenes-compras-vendedor', isAuthenticatedSeller,async (req, res) => {
  let email = req.user.email
  let vendedor= await vendedorDB.findOne({email: email})
  let username = vendedor.Username  
  let cliente = await clienteDB.find({Vendedor: username})
  let ordenes = []
  
  for(i=0; i< cliente.length; i++){
    let orden = await ordenesDB.find({$and:  [{Estado:"En proceso"},{email: cliente[i].email}]})
    for(r=0; r< orden.length; r++){
      orden[r].Cliente = cliente[i].Empresa
      ordenes.push(orden[r])
    }
  }

  if(ordenes.length > 0){
    ordenes = ordenes.map((data) => {
      return{
        Timestamp: data.Timestamp,
        date: data.date,
        OrdenNumero: data.OrdenNumero,
        Cliente: data.Cliente,
        CantidadTotal: data.CantidadTotal,
        PrecioTotal:  new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.PrecioTotal),
        email: data.email,
        TipoPrecio: data.TipoPrecio,
        Estado: data.Estado,
        ProductosAtendidos: data.ProductosAtendidos,
        CantidadTotalAtendida: data.CantidadTotalAtendida,
        PrecioTotalAtendido: data.PrecioTotalAtendido,
        NumeroFactura: data.NumeroFactura,
      }
    })
  }

  res.render('seller/ordenes-pendientes',{
    ordenes
  })

})

router.get('/ver-historia-facturas-pagos/:id', isAuthenticatedSeller, async (req, res) => {
  let factura = await facturasDB.findById(req.params.id);
  let Factura = factura.Factura;

  const HistorialPago = factura.HistorialPago;
  let historial = {
    pago: HistorialPago.map((data) => {
      if(data.Modalidad == "DEVOLUCIÓN"){
        return {
          FechaPago: data.FechaPago,
          Recibo: data.Recibo,
          Modalidad: data.Modalidad,
          Comentario: data.Comentario,
          Pago: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.Pago),
          user: data.user,
          Timestamp: data.Timestamp,
          href: `/ver-devolucion/${data.Recibo}`
        };

      }else{
        return {
          FechaPago: data.FechaPago,
          Recibo: data.Recibo,
          Modalidad: data.Modalidad,
          Comentario: data.Comentario,
          Pago: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.Pago),
          user: data.user,
          Timestamp: data.Timestamp,
          href: `/ver-recibo-pago/${data.Recibo}`
        };

      }
    }),
  };
  res.render("client/historial-pagos", {
    Factura,
    Historial: historial.pago,
  });

})



module.exports = router;