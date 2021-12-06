const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const clienteDB = require("../models/cliente");
const stockDB = require("../models/stock");
const usersDB = require("../models/users");
const facturasDB = require("../models/factura");
const ordenesComprasProveedorDB = require("../models/orden-compras-proveedor");
const ordenTemporalDB = require("../models/cliente/orden-cliente-temporal")
const ordenesClienteDB = require('../models/cliente/ordenes-clientes')
const noticiasDB = require('../models/cliente/noticias')
const stripe = require('stripe')(process.env.KEYPAYMENT);
const {isAuthenticatedClient} = require("../helpers/auth");
const {isAuthenticatedSellerClient} = require("../helpers/auth");
const { constants } = require("fs");

//ruta de inicio
router.get('/home-client' ,isAuthenticatedClient , async (req, res) => {

    res.render('client/home')
})
//ruta de realizar orden
router.get('/realizar-orden' ,isAuthenticatedClient, async (req, res) => {
    console.log(req.user.TipoPrecio)
  
    if(req.user.TipoPrecio == "GRANMAYOR"){
        await stockDB
      .find()
      .sort({ "Modelo": 1 })
      .then(async (document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              CodigoT: document.CodigoT,
              CodigoG: document.CodigoG,
              Modelo: document.Modelo,
              Año: document.Modelo,
              CantidadTotal: document.CantidadTotal,
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
        contex.stock =  contex.stock.map((data) => {
          if(data.CantidadTotal == 0){
            return{
              CodigoT : data.CodigoT,
              CodigoG : data.CodigoG,
              Modelo : data.Modelo,
              Año : data.Año,
              CantidadTotal : data.CantidadTotal,
              Familia : data.Familia,
              TipoProducto : data.TipoProducto,
              Vehiculo : data.Vehiculo,
              Posicion : data.Posicion,
              Precio : data.Precio,
              Descripcion: data.Descripcion,
              Estado : "SIN STOCK"
            }
          }else{
            return{
              CodigoT : data.CodigoT,
              CodigoG : data.CodigoG,
              Modelo : data.Modelo,
              Año : data.Año,
              CantidadTotal : data.CantidadTotal,
              Familia : data.Familia,
              TipoProducto : data.TipoProducto,
              Vehiculo : data.Vehiculo,
              Posicion : data.Posicion,
              Precio : data.Precio,
              Descripcion: data.Descripcion,
              Estado: "STOCK"
            }
          }
        })
        let orden = await ordenesComprasProveedorDB.find()

        if(orden.length > 0){
          for(t=0; t< contex.stock.length; t++){
            for(r=0; r < orden.length; r++){
              for(i=0; i < orden[r].Productos.length; i++){
                if(contex.stock[t].CodigoT == orden[r].Productos[i].CodigoT){
                  if(orden[r].Estado == "Produccion"){
                    if(contex.stock[t].CantidadTotal == 0){
                      contex.stock[t].Estado = "PRODUCCIÓN"
                    }
                  }else{
                    if(contex.stock[t].CantidadTotal == 0){
                      contex.stock[t].Estado = "TRANSITO"
                    }
                  }
                }
              }
            }
          }
        }

        res.render("client/realizar-orden", {
          stock: contex.stock,
        });
      });

    }if(req.user.TipoPrecio == "MAYOR"){
        await stockDB
        .find()
        .sort({ "Modelo": 1 })
        .then(async (document) => {
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
                CantidadTotal: document.CantidadTotal,
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
          contex.stock =  contex.stock.map((data) => {
            if(data.CantidadTotal == 0){
              return{
                CodigoT : data.CodigoT,
                CodigoG : data.CodigoG,
                Modelo : data.Modelo,
                Año : data.Año,
                CantidadTotal : data.CantidadTotal,
                Familia : data.Familia,
                TipoProducto : data.TipoProducto,
                Vehiculo : data.Vehiculo,
                Posicion : data.Posicion,
                Precio : data.Precio,
                Descripcion: data.Descripcion,
                Estado : "SIN STOCK"
              }
            }else{
              return{
                CodigoT : data.CodigoT,
                CodigoG : data.CodigoG,
                Modelo : data.Modelo,
                Año : data.Año,
                CantidadTotal : data.CantidadTotal,
                Familia : data.Familia,
                TipoProducto : data.TipoProducto,
                Vehiculo : data.Vehiculo,
                Posicion : data.Posicion,
                Precio : data.Precio,
                Descripcion: data.Descripcion,
                Estado: "STOCK"
              }
            }
          })
          let orden = await ordenesComprasProveedorDB.find()
  
          if(orden.length > 0){
            for(t=0; t< contex.stock.length; t++){
              for(r=0; r < orden.length; r++){
                for(i=0; i < orden[r].Productos.length; i++){
                  if(contex.stock[t].CodigoT == orden[r].Productos[i].CodigoT){
                    if(orden[r].Estado == "Produccion"){
                      if(contex.stock[t].CantidadTotal == 0){
                        contex.stock[t].Estado = "PRODUCCIÓN"
                      }
                    }else{
                      if(contex.stock[t].CantidadTotal == 0){
                        contex.stock[t].Estado = "TRANSITO"
                      }
                    }
                  }
                }
              }
            }
          }
  
          res.render("client/realizar-orden", {
            stock: contex.stock,
          });
        });

    }if(req.user.TipoPrecio == "DETAL"){
        await stockDB
        .find()
        .sort({ "Modelo": 1 })
        .then( async (document) => {
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
                Precio: document.CostoDetal,
                CantidadTotal: document.CantidadTotal,
              };
            }),
          };
          console.log("for 1")
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

            contex.stock =  contex.stock.map((data) => {
              if(data.CantidadTotal == 0){
                return{
                  CodigoT : data.CodigoT,
                  CodigoG : data.CodigoG,
                  Modelo : data.Modelo,
                  Año : data.Año,
                  CantidadTotal : data.CantidadTotal,
                  Familia : data.Familia,
                  TipoProducto : data.TipoProducto,
                  Descripcion: data.Descripcion,
                  Vehiculo : data.Vehiculo,
                  Posicion : data.Posicion,
                  Precio : data.Precio,
                  Estado : "SIN STOCK"
                }
              }else{
                return{
                  CodigoT : data.CodigoT,
                  CodigoG : data.CodigoG,
                  Modelo : data.Modelo,
                  Año : data.Año,
                  CantidadTotal : data.CantidadTotal,
                  Familia : data.Familia,
                  TipoProducto : data.TipoProducto,
                  Descripcion: data.Descripcion,
                  Vehiculo : data.Vehiculo,
                  Posicion : data.Posicion,
                  Precio : data.Precio,
                  Estado: "STOCK"
                }
              }
            })
            let orden = await ordenesComprasProveedorDB.find()
          console.log("if 2")
            
            if(orden.length > 0){
              for(t=0; t< contex.stock.length; t++){
                for(r=0; r < orden.length; r++){
                  for(i=0; i < orden[r].Productos.length; i++){
                    if(contex.stock[t].CodigoT == orden[r].Productos[i].CodigoT){
                      if(orden[r].Estado == "Produccion"){
                        if(contex.stock[t].CantidadTotal == 0){
                          contex.stock[t].Estado = "PRODUCCIÓN"
                        }
                      }else{
                        if(contex.stock[t].CantidadTotal == 0){
                          contex.stock[t].Estado = "TRANSITO"
                        }
                      }
                    }
                  }
                }
              }
            }
          console.log("descripcion")
          
        console.log("envio")
          res.render("client/realizar-orden", {
            stock: contex.stock,
          });
        });

    }

})
//ruta para ver la orden temporal del cliente
router.post('/facturacion/ver-orden-temporal-cliente' ,isAuthenticatedSellerClient , async (req, res) => {

  const ordenTemporal = await ordenTemporalDB.findOne({email: req.user.email})

  res.send(JSON.stringify(ordenTemporal))
})
//ruta para recibir orden de compra del cliente
router.post('/realizar-orden/nueva' ,isAuthenticatedClient , async  (req, res) => {
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

//ruta para ver lista del cliente

router.get('/lista-orden-cliente' ,isAuthenticatedClient , async (req, res) => {
  res.render('client/lista-compra')
})

router.post('/ver-lista-compra' ,isAuthenticatedSellerClient , async (req, res) => {

  const listaCompra = await ordenTemporalDB.findOne({email: req.user.email})
 
    res.send(JSON.stringify(listaCompra))

})
//ruta para eliminar produto de la lista 
router.post('/eliminar-producto-lista' ,isAuthenticatedSellerClient , async (req, res) => {
  const {CodigoT} = req.body
  let CantidadTotal = 0
  let PrecioTotal = 0
  let email = req.user.email
  const ordenTemporal = await ordenTemporalDB.findOne({email: email})

  let Productos = ordenTemporal.Productos.filter((data) => data.CodigoT != CodigoT)
  for(i = 0; i < Productos.length; i++){
    CantidadTotal += +Productos[i].Cantidad
    PrecioTotal = (+PrecioTotal + +Productos[i].PrecioTotal).toFixed(2) 
  }

  await ordenTemporalDB.findOneAndUpdate({email: email}, {
    Productos,
    CantidadTotal,
    PrecioTotal
  })
  if(Productos.length == 0){
    await ordenTemporalDB.findOneAndDelete({email: email})
  }

  let registrado = [{ok: "Producto eliminado correctamente"}]

  res.send(JSON.stringify(registrado))
})
//ruta para cambiar la cantidad de un codigo de la lista de precio

router.post('/cambiar-cantidad-producto-lista' ,isAuthenticatedSellerClient , async (req, res) => {
  const {CodigoT, Cantidad, Precio, CantidadTotal, PrecioTotal} = req.body
  const email = req.user.email

  const orden = await ordenTemporalDB.findOne({email: email})
  let Productos = orden.Productos  

  for(i=0; i< Productos.length; i++ ){
    if(Productos[i].CodigoT == CodigoT){
      Productos[i].Cantidad = Cantidad
      Productos[i].PrecioTotal = Precio
    }
  }
  await ordenTemporalDB.findOneAndUpdate({email: email}, {
    Productos,
    CantidadTotal,
    PrecioTotal
  })


  let registrado= [{ok: "Cambio de cantidad procesado correctamente"}]
})
//ruta para registrar orden

router.post('/registrar-orden' ,isAuthenticatedClient , async (req, res) => {
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
      const newOrden = new ordenesClienteDB({
        OrdenNumero,
        email,
        TipoPrecio,
        Productos,
        PrecioTotal,
        CantidadTotal,
        date,
        Timestamp
      })
      newOrden.save()
      await ordenTemporalDB.findOneAndDelete({email: email})
      let registrado = [{ok: "Registrado"}]
      res.send(JSON.stringify(registrado))
      return i = 0
    }
  }

})

//ruta de anular orden
router.get('/anular-orden' ,isAuthenticatedSellerClient, async (req, res) => {
  await ordenesClienteDB
  .find({$and: [{Estado: "En proceso"}, {email: req.user.email}]})
  .sort({ "Timestamp": 1 })
  .then((document) => {
    const contex = {
      ordenes: document.map((document) => {
        return {
          OrdenNumero: document.OrdenNumero,
          _id: document._id,
          CantidadTotal: document.CantidadTotal,
          PrecioTotal: document.PrecioTotal,
          date: document.date,
        };
      }),
    };
    res.render('client/anular-orden',{
      ordenes: contex.ordenes
    })
  })
})
//ruta para recibir la orden a anular

router.get('/anular-orden/:id' ,isAuthenticatedSellerClient , async (req, res) => {

  await ordenesClienteDB.findByIdAndDelete(req.params.id)

  await ordenesClienteDB
  .find({Estado: "En proceso"})
  .sort({ "Timestamp": 1 })
  .then((document) => {
    const contex = {
      ordenes: document.map((document) => {
        return {
          OrdenNumero: document.OrdenNumero,
          _id: document._id,
          CantidadTotal: document.CantidadTotal,
          PrecioTotal: document.PrecioTotal,
          date: document.date,
        };
      }),
    };
    let ok= [{text: "Orden anulada correctamente"}]
    res.render('client/anular-orden',{
      ordenes: contex.ordenes,
      ok
    })
  })

})

//ruta de consultar productos
router.get('/consultar-productos' ,isAuthenticatedSellerClient , async (req, res) => {

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
              Vehiculo: document.Vehiculo,
              Posicion: (document.Posicion).toUpperCase(),
              Familia: (document.Familia).toUpperCase(),
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
        res.render("client/consulta-productos", {
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
                Vehiculo: document.Vehiculo,
              Posicion: (document.Posicion).toUpperCase(),
                Familia: (document.Familia).toUpperCase(),
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
          res.render("client/consulta-productos", {
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
          res.render("client/consulta-productos", {
            stock: contex.stock,
          });
        });
      }
})
//ruta para ver el estado de cuenta
router.get('/estado-cuenta' ,isAuthenticatedClient , async (req, res) => {
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
    
    res.render('client/estado-cuenta',{
      facturas,
      FacturasVencidas,
      FacturasEmitidas,
      PendienteAPagar,
      ValorFacturas
    })
})
//ruta para ver la información de las garantías
router.get('/informacion-garantias' ,isAuthenticatedSellerClient, async (req, res) => {

    res.render('client/informacion-garantias')
})
//ruta para consultar ordenes
router.get('/consultar-ordenes' ,isAuthenticatedSellerClient, async (req, res) => {
  await ordenesClienteDB
  .find({email: req.user.email})
  .sort({ "Timestamp": -1 })
  .then((document) => {
    const contex = {
      ordenes: document.map((document) => {
        return {
          OrdenNumero: document.OrdenNumero,
          Estado: document.Estado,
          _id: document._id,
          CantidadTotal: document.CantidadTotal,
          PrecioTotal: document.PrecioTotal,
          date: document.date,
          CantidadTotalAtendida: document.CantidadTotalAtendida,
          PrecioTotalAtendido: document.PrecioTotalAtendido,
          NumeroFactura: document.NumeroFactura,
        };
      }),
    };
    res.render('client/consulta-ordenes',{
      ordenes: contex.ordenes
    })
  })
    
})
//ruta para descargar excel de orden

router.get('/descargar-excel/:id' ,isAuthenticatedSellerClient , async (req, res) => {

  const orden = await ordenesClienteDB.findById(req.params.id)

  const xl = require("excel4node");

  const wb = new xl.Workbook();

  const options = {
    'printOptions': {
      'printGridLines': false,

    }
  };

  const ws = wb.addWorksheet("Stock Thomson", options);

  const style = wb.createStyle({
    font: {
      color: "#000000",
      size: 11,
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#c6cbc9",
      fgColor: "#c6cbc9",
    },
  });

  const title = wb.createStyle({
    font: {
      color: "#ffc81f",
      size: 26,
    },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#000000",
      fgColor: "#000000",
    },
  });

  const header = wb.createStyle({
    font: {
      color: "#000000",
      size: 11,
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#ffc81f",
      fgColor: "#ffc81f",
    },
  })


    ws.cell(2, 2, 2, 10, true).string("THOMSON").style(title);
    ws.cell(4, 2).string("Fecha de registro:").style(style);
    ws.cell(4, 3).string(orden.date);
    ws.cell(5, 2).string("Código de orden:").style(style);
    ws.cell(5, 3).string(orden.OrdenNumero);
    ws.cell(6, 2).string("Estado:").style(style);
    ws.cell(6, 3).string(orden.Estado);
    ws.cell(7, 2).string("Cantidad total:").style(style);
    ws.cell(7, 3).number(orden.CantidadTotal);
    ws.cell(8, 2).string("Precio total:").style(style);
    ws.cell(8, 3).string(`$${orden.PrecioTotal}`);

    ws.cell(10, 2).string("Código").style(header)
    ws.cell(10, 3).string("Homólogo").style(header)
    ws.cell(10, 4).string("Tipo producto").style(header)
    ws.cell(10, 5).string("Descripción").style(header)
    ws.cell(10, 6).string("Posición").style(header)
    ws.cell(10, 7).string("Modelo").style(header)
    ws.cell(10, 8).string("Cantidad").style(header)
    ws.cell(10, 9).string("Precio unitario").style(header)
    ws.cell(10, 10).string("Precio total").style(header)

    let fila = 11;
    for (i = 0; i < orden.Productos.length; i++) {
      let columna = 2

      ws.cell(fila, columna++).string(orden.Productos[i].CodigoT);
      ws.cell(fila, columna++).string(orden.Productos[i].CodigoG);
      ws.cell(fila, columna++).string(orden.Productos[i].TipoProducto);
      ws.cell(fila, columna++).string(orden.Productos[i].Descripcion);
      ws.cell(fila, columna++).string(orden.Productos[i].Posicion);
      ws.cell(fila, columna++).string(orden.Productos[i].Modelo);
      ws.cell(fila, columna++).number(orden.Productos[i].Cantidad);
      ws.cell(fila, columna++).string(`$${orden.Productos[i].PrecioUnidad}`);
      ws.cell(fila, columna++).string(`$${orden.Productos[i].PrecioTotal}`);

      fila++;
    }

    wb.write(`Orden ${orden.OrdenNumero}.xlsx`, res);


})
//descargar excel de antendidos
router.get('/descargar-excel-atendidos/:id', isAuthenticatedSellerClient, async (req, res) => {

  
  const orden = await ordenesClienteDB.findById(req.params.id)
  if(!orden.NumeroFactura){
   let errors = [{text: 'Para descargar el documento excel de los productos atendidos la orden debe encontrarse con el estado "Facturado"'}]
   await ordenesClienteDB
  .find({})
  .sort({ "Timestamp": -1 })
  .then((document) => {
    const contex = {
      ordenes: document.map((document) => {
        return {
          OrdenNumero: document.OrdenNumero,
          Estado: document.Estado,
          _id: document._id,
          CantidadTotal: document.CantidadTotal,
          PrecioTotal: document.PrecioTotal,
          date: document.date,
          CantidadTotalAtendida: document.CantidadTotalAtendida,
          PrecioTotalAtendido: document.PrecioTotalAtendido,
          NumeroFactura: document.NumeroFactura,
        };
      }),
    };
    res.render('client/consulta-ordenes',{
      ordenes: contex.ordenes,
      errors: errors 
    })
  })
  }else{

  const xl = require("excel4node");

  const wb = new xl.Workbook();

  const options = {
    'printOptions': {
      'printGridLines': false,

    }
  };

  const ws = wb.addWorksheet("Stock Thomson", options);

  const style = wb.createStyle({
    font: {
      color: "#000000",
      size: 11,
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#c6cbc9",
      fgColor: "#c6cbc9",
    },
  });

  const title = wb.createStyle({
    font: {
      color: "#ffc81f",
      size: 26,
    },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#000000",
      fgColor: "#000000",
    },
  });

  const header = wb.createStyle({
    font: {
      color: "#000000",
      size: 11,
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#ffc81f",
      fgColor: "#ffc81f",
    },
  })


    ws.cell(2, 2, 2, 10, true).string("THOMSON").style(title);
    ws.cell(4, 2).string("Fecha de registro:").style(style);
    ws.cell(4, 3).string(orden.date);
    ws.cell(5, 2).string("Código de orden:").style(style);
    ws.cell(5, 3).string(orden.OrdenNumero);
    ws.cell(6, 2).string("Número de factura:").style(style);
    ws.cell(6, 3).string(orden.NumeroFactura);
    ws.cell(7, 2).string("Estado:").style(style);
    ws.cell(7, 3).string(orden.Estado);
    ws.cell(8, 2).string("Cantidad total:").style(style);
    ws.cell(8, 3).number(orden.CantidadTotalAtendida);
    ws.cell(9, 2).string("Precio total:").style(style);
    ws.cell(9, 3).string(`$${orden.PrecioTotalAtendido}`);

    ws.cell(11, 2).string("Código").style(header)
    ws.cell(11, 3).string("Homólogo").style(header)
    ws.cell(11, 4).string("Tipo producto").style(header)
    ws.cell(11, 5).string("Descripción").style(header)
    ws.cell(11, 6).string("Posición").style(header)
    ws.cell(11, 7).string("Modelo").style(header)
    ws.cell(11, 8).string("Cantidad").style(header)
    ws.cell(11, 9).string("Precio unitario").style(header)
    ws.cell(11, 10).string("Precio total").style(header)

    let fila = 12;
    for (i = 0; i < orden.ProductosAtendidos.length; i++) {
      let columna = 2

      ws.cell(fila, columna++).string(orden.ProductosAtendidos[i].CodigoT);
      ws.cell(fila, columna++).string(orden.ProductosAtendidos[i].CodigoG);
      ws.cell(fila, columna++).string(orden.ProductosAtendidos[i].TipoProducto);
      ws.cell(fila, columna++).string(orden.ProductosAtendidos[i].Descripcion);
      ws.cell(fila, columna++).string(orden.ProductosAtendidos[i].Posicion);
      ws.cell(fila, columna++).string(orden.ProductosAtendidos[i].Modelo);
      ws.cell(fila, columna++).number(orden.ProductosAtendidos[i].Cantidad);
      ws.cell(fila, columna++).string(`$${orden.ProductosAtendidos[i].PrecioUnidad}`);
      ws.cell(fila, columna++).string(`$${orden.ProductosAtendidos[i].PrecioTotal}`);

      fila++;
    }

    wb.write(`Orden atendida ${orden.OrdenNumero}.xlsx`, res);
  }
})

//ruta para descargar lista
router.get('/descargar-lista' ,isAuthenticatedSellerClient , async (req, res) => {
  let email = req.user.email
  const usuario = await usersDB
  .findOne({email: email})
  .then((document) => {
        return {
          TipoPrecio: document.TipoPrecio
        };
      });
  
  if(usuario.TipoPrecio == "GRANMAYOR"){
      usuario.TipoPrecio = 1
    }
    if(usuario.TipoPrecio == "MAYOR"){
    usuario.TipoPrecio = 2
  }
  if(usuario.TipoPrecio == "DETAL"){
    usuario.TipoPrecio = 3
  }
    res.render('client/descargar-lista',{
      usuario
    })
})
//ruta para ir al perfil
router.get('/perfil' ,isAuthenticatedSellerClient , async (req, res) => {
  let email= req.user.email
  const cliente = await clienteDB
  .findOne({email: email})
  .then((document) => {
        return {
          Nombres: document.Nombres,
          Apellidos: document.Apellidos,
          Cedula: document.Cedula,
          Empresa: document.Empresa,
          Direccion: document.Direccion,
          Rif: document.Rif,
          Telefono: document.Telefono,
          Celular: document.Celular,
          _id: document._id
        };
      });
  const usuario = await usersDB
  .findOne({email: email})
  .then((document) => {
        return {
          _id: document._id,
          email: document.email,
          password: document.password
        };
      });
  res.render("client/perfil", {
      usuario,
      cliente
  });
})

//ruta para actualizar datos de cliente
router.post('/update-profile-info/:id' ,isAuthenticatedSellerClient, async (req, res) => {
  let {
    Empresa,
    Rif,
    Direccion,
    Nombres,
    Apellidos,
    Cedula,
    Telefono,
    Celular
  } = req.body
  let errors = []

  if(!Empresa){errors.push({text: 'El campo "Empresa" no puede estar vacio'})}
  if(!Rif){errors.push({text: 'El campo "RIF" no puede estar vacio'})}
  if(!Direccion){errors.push({text: 'El campo "Dirección fiscal" no puede estar vacio'})}
  if(!Nombres){errors.push({text: 'El campo "Nombres de contacto" no puede estar vacio'})}
  if(!Apellidos){errors.push({text: 'El campo "Apellidos de contacto" no puede estar vacio'})}
  if(!Cedula){errors.push({text: 'El campo "Cédula de contacto" no puede estar vacio'})}
  if(!Celular){errors.push({text: 'El campo "Número celular" no puede estar vacio'})}
  if(errors.length > 0){
    let email= req.user.email
    const cliente = await clienteDB
    .findOne({email: email})
    .then((document) => {
          return {
          Nombres: document.Nombres,
          Apellidos: document.Apellidos,
          Cedula: document.Cedula,
          Empresa: document.Empresa,
          Direccion: document.Direccion,
          Rif: document.Rif,
          Telefono: document.Telefono,
          Celular: document.Celular,
        };
      });
    const usuario = await usersDB
    .findOne({email: email})
    .then((document) => {
          return {
          _id: document._id,
          email: document.email,
          password: document.password
        };
      });
  res.render("client/perfil", {
      usuario,
      cliente,
      errors
  });

  }else{
    await clienteDB.findByIdAndUpdate(req.params.id,{
      Empresa,
      Rif,
      Direccion,
      Nombres,
      Apellidos,
      Cedula,
      Telefono,
      Celular
    })
    let ok = [{text: "Datos guardados correctamente"}]
    let email= req.user.email
    const cliente = await clienteDB
    .findOne({email: email})
    .then((document) => {
          return {
          Nombres: document.Nombres,
          Apellidos: document.Apellidos,
          Cedula: document.Cedula,
          Empresa: document.Empresa,
          Direccion: document.Direccion,
          Rif: document.Rif,
          Telefono: document.Telefono,
          Celular: document.Celular,
        };
      });
    const usuario = await usersDB
    .findOne({email: email})
    .then((document) => {
          return {
          _id: document._id,
          email: document.email,
          password: document.password
        };
      });
    res.render("client/perfil", {
        usuario,
        cliente,
        ok
      });
  }
})

//ruta para actualizar datos de usuario

router.post('/update-profile-user/:id' ,isAuthenticatedSellerClient , async (req, res) => {
  let {email, emailconfirm, password, passwordconfirm} = req.body
  let errors = []
  if(!email){errors.push({text: 'El campo "Correo electronico" no puede estar vacio'})}
  if(!emailconfirm){errors.push({text: 'El campo "Confirmar correo electronico" no puede estar vacio'})}
  if(!password){errors.push({text: 'El campo "Contraseña" no puede estar vacio'})}
  if(!passwordconfirm){errors.push({text: 'El campo "Confirmar contraseña" no puede estar vacio'})}
  if(email != emailconfirm){errors.push({text :'Los correos electronicos ingresados no coinciden. Valide y vuelva a intentarlo'})}
  if(password != passwordconfirm){errors.push({ text: 'Las contraseñas ingresados no coinciden. Valide y vuelva a intentarlo'})}
  if(errors.length > 0){
    let email2= req.user.email
    const cliente = await clienteDB
    .findOne({email: email2})
    .then((document) => {
          return {
          Nombres: document.Nombres,
          Apellidos: document.Apellidos,
          Cedula: document.Cedula,
          Empresa: document.Empresa,
          Direccion: document.Direccion,
          Rif: document.Rif,
          Telefono: document.Telefono,
          Celular: document.Celular,
        };
      });
    const usuario = await usersDB
    .findOne({email: email2})
    .then((document) => {
          return {
          _id: document._id,
          email: document.email,
          password: document.password
        };
      });
  res.render("client/perfil", {
      usuario,
      cliente,
      errors
  });
  }else{
    let ok = [{text: "Datos de usuario guardados correctamente."}]
    let user = await usersDB.findById(req.params.id)
    if(password == user.password){
      await clienteDB.findOneAndUpdate({email: user.email},{
        email
      })
      await usersDB.findByIdAndUpdate(req.params.id,{
        email
      })
    }else{
      let newUser = new usersDB({ password });
      newUser.password = await newUser.encryptPassword(password);
      password = newUser.password;
      await clienteDB.findOneAndUpdate({email: user.email},{
        email
      })
      await usersDB.findByIdAndUpdate(req.params.id,{
        email,
        password
      })
    }
    const cliente = await clienteDB
    .findOne({email: email})
    .then((document) => {
          return {
          Nombres: document.Nombres,
          Apellidos: document.Apellidos,
          Cedula: document.Cedula,
          Empresa: document.Empresa,
          Direccion: document.Direccion,
          Rif: document.Rif,
          Telefono: document.Telefono,
          Celular: document.Celular,
        };
      });
    const usuario = await usersDB
    .findOne({email: email})
    .then((document) => {
          return {
          _id: document._id,
          email: document.email,
          password: document.password
        };
      });
      res.render("client/perfil", {
        usuario,
        cliente,
        ok
  });
  }
})


//ruta para ir a como comprar
router.get('/como-comprar' ,isAuthenticatedSellerClient , async (req, res) => {

    res.render('client/como-comprar')
})
//ruta para descargar excel 

router.get('/lista-excel/:id',isAuthenticatedSellerClient , async (req, res) => {

  const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Stock Thomson");
  
    const title = wb.createStyle({
      font: {
        color: "#ffc81f",
        size: 26,
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#000000",
        fgColor: "#000000",
      },
    });
  
    const header = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffc81f",
        fgColor: "#ffc81f",
      },
    })
  
    
    
    if(req.params.id == 1){
      let stock = await stockDB.find({CantidadTotal :{$gt: 0}}).sort({TipoProducto: 1,  Modelo: 1 });
      
      ws.cell(2, 2, 2, 7, true).string("THOMSON").style(title);
      ws.cell(5, 2).string("Codigo Thomson").style(header);
      ws.cell(5, 3).string("Codigo homólogo").style(header);
      ws.cell(5, 4).string("Producto").style(header);
      ws.cell(5, 5).string("Descripción").style(header);
      ws.cell(5, 6).string("Posición").style(header);
      ws.cell(5, 7).string("Precio").style(header);

      let fila = 6;
      for (i = 0; i < stock.length; i++) {
        columna = 2;
        let cantidad = 0;
        if (stock[i].CantidadTotal == 0) {
          cantidad += +stock[i].CantidadTotal;
        } else {
          cantidad += +stock[i].CantidadTotal;
        }
        let Descripcion = "";
        for (x = 0; x < stock[i].Vehiculo.length; x++) {
          if (
            stock[i].Vehiculo[x].Modelo ==
            stock[i].Vehiculo[stock[i].Vehiculo.length - 1].Modelo
          ) {
            Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}`;
          } else {
            Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}, `;
          }
        }
        ws.cell(fila, columna++).string(stock[i].CodigoT);
        ws.cell(fila, columna++).string(stock[i].CodigoG);
        ws.cell(fila, columna++).string(stock[i].TipoProducto);
        ws.cell(fila, columna++).string(Descripcion);
        ws.cell(fila, columna++).string(stock[i].Posicion);
        ws.cell(fila, columna++).number(stock[i].CostoGranMayor);

        fila++;
      }

      wb.write("Lista_precios.xlsx", res);

  }
  if(req.params.id == 2){
    let stock = await stockDB.find({CantidadTotal :{$gt: 0}}).sort({TipoProducto: 1,  Modelo: 1 });
      ws.cell(2, 2, 2, 7, true).string("THOMSON").style(title);
      ws.cell(1, 1).string("Codigo Thomson").style(style);
      ws.cell(1, 2).string("Codigo homólogo").style(style);
      ws.cell(1, 3).string("Producto").style(style);
      ws.cell(1, 4).string("Descripción").style(style);
      ws.cell(1, 5).string("Posición").style(style);
      ws.cell(1, 6).string("Precio").style(style);

      let fila = 6;
      for (i = 0; i < stock.length; i++) {
        columna = 2;
        let cantidad = 0;
        if (stock[i].CantidadTotal == 0) {
          cantidad += +stock[i].CantidadTotal;
        } else {
          cantidad += +stock[i].CantidadTotal;
        }
        let Descripcion = "";
        for (x = 0; x < stock[i].Vehiculo.length; x++) {
          if (
            stock[i].Vehiculo[x].Modelo ==
            stock[i].Vehiculo[stock[i].Vehiculo.length - 1].Modelo
          ) {
            Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}`;
          } else {
            Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}, `;
          }
        }
        ws.cell(fila, columna++).string(stock[i].CodigoT);
        ws.cell(fila, columna++).string(stock[i].CodigoG);
        ws.cell(fila, columna++).string(stock[i].TipoProducto);
        ws.cell(fila, columna++).string(Descripcion);
        ws.cell(fila, columna++).string(stock[i].Posicion);
        ws.cell(fila, columna++).number(stock[i].CostoMayor);

        fila++;
      }

      wb.write("Lista_precios.xlsx", res);

  }
  if(req.params.id == 3){
    let stock = await stockDB.find({CantidadTotal :{$gt: 0}}).sort({TipoProducto: 1,  Modelo: 1 });
      ws.cell(2, 2, 2, 7, true).string("THOMSON").style(title);
      ws.cell(1, 1).string("Codigo Thomson").style(style);
      ws.cell(1, 2).string("Codigo homólogo").style(style);
      ws.cell(1, 3).string("Producto").style(style);
      ws.cell(1, 4).string("Descripción").style(style);
      ws.cell(1, 5).string("Posición").style(style);
      ws.cell(1, 6).string("Precio").style(style);

      let fila = 6;
      for (i = 0; i < stock.length; i++) {
        columna = 2;
        let cantidad = 0;
        if (stock[i].CantidadTotal == 0) {
          cantidad += +stock[i].CantidadTotal;
        } else {
          cantidad += +stock[i].CantidadTotal;
        }
        let Descripcion = "";
        for (x = 0; x < stock[i].Vehiculo.length; x++) {
          if (
            stock[i].Vehiculo[x].Modelo ==
            stock[i].Vehiculo[stock[i].Vehiculo.length - 1].Modelo
          ) {
            Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}`;
          } else {
            Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}, `;
          }
        }
        ws.cell(fila, columna++).string(stock[i].CodigoT);
        ws.cell(fila, columna++).string(stock[i].CodigoG);
        ws.cell(fila, columna++).string(stock[i].TipoProducto);
        ws.cell(fila, columna++).string(Descripcion);
        ws.cell(fila, columna++).string(stock[i].Posicion);
        ws.cell(fila, columna++).number(stock[i].CostoDetal);

        fila++;
      }

      wb.write("Lista_precios.xlsx", res);

  }
  
})


//ruta para descargar excel

router.get('/lista-pdf/:id' ,isAuthenticatedSellerClient , async (req, res) => {
  let stock = await stockDB.find({CantidadTotal :{$gt: 0}}).sort({TipoProducto: 1,  Modelo: 1 });

  if(req.params.id == 1){
    for(i =0; i < stock.length ; i++){
      let Descripcion = "";
      stock[i].Precio = stock[i].CostoGranMayor
    for (x = 0; x < stock[i].Vehiculo.length; x++) {
      if (
        stock[i].Vehiculo[x].Modelo ==
        stock[i].Vehiculo[stock[i].Vehiculo.length - 1].Modelo
      ) {
        Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}`;
      } else {
        Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}, `;
      }
    }
    stock[i].Descripcion =  Descripcion
    }

    stock = stock.map((data) => {
      return{
        CodigoT: data.CodigoT,
        CodigoG: data.CodigoG,
        TipoProducto: data.TipoProducto,
        Descripcion: data.Descripcion,
        Precio: data.Precio,
        Posicion: data.Posicion,

      }
    })

    res.render('client/reporte_precios',{
      stock
    })
  }
  if(req.params.id == 2){
    for(i =0; i < stock.length ; i++){
      let Descripcion = "";
      stock[i].Precio = stock[i].CostoMayor
    for (x = 0; x < stock[i].Vehiculo.length; x++) {
      if (
        stock[i].Vehiculo[x].Modelo ==
        stock[i].Vehiculo[stock[i].Vehiculo.length - 1].Modelo
      ) {
        Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}`;
      } else {
        Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}, `;
      }
    }
    stock[i].Descripcion =  Descripcion
    }
    stock = stock.map((data) => {
      return{
        CodigoT: data.CodigoT,
        CodigoG: data.CodigoG,
        TipoProducto: data.TipoProducto,
        Descripcion: data.Descripcion,
        Precio: data.Precio,
        Posicion: data.Posicion,

      }
    })


    res.render('client/reporte_precios',{
      stock
    })

    
  }
  if(req.params.id == 3){
    for(i =0; i < stock.length ; i++){
      let Descripcion = "";
      stock[i].Precio = stock[i].CostoDetal
    for (x = 0; x < stock[i].Vehiculo.length; x++) {
      if (
        stock[i].Vehiculo[x].Modelo ==
        stock[i].Vehiculo[stock[i].Vehiculo.length - 1].Modelo
      ) {
        Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}`;
      } else {
        Descripcion += `${stock[i].Vehiculo[x].Marca} ${stock[i].Vehiculo[x].Modelo} ${stock[i].Vehiculo[x].Desde}-${stock[i].Vehiculo[x].Hasta}, `;
      }
    }
    stock[i].Descripcion =  Descripcion
    }
    stock = stock.map((data) => {
      return{
        CodigoT: data.CodigoT,
        CodigoG: data.CodigoG,
        TipoProducto: data.TipoProducto,
        Descripcion: data.Descripcion,
        Precio: data.Precio,
        Posicion: data.Posicion,
  
      }
    })
  
    res.render('client/reporte_precios',{
      stock
    })
  }

})

router.get('/descargar-estado-cuenta', isAuthenticatedClient, async (req, res) => {
  const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Stock Thomson");
  
    const title = wb.createStyle({
      font: {
        color: "#ffc81f",
        size: 26,
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#000000",
        fgColor: "#000000",
      },
    });
  
    const header = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffc81f",
        fgColor: "#ffc81f",
      },
    })


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
    
    
      ws.cell(2, 2, 2, 6, true).string("ESTADO DE CUENTA").style(title);
      ws.cell(4, 2).string("VALOR FACTURAS").style(header);
      ws.cell(4, 3).string("$"+ValorFacturas)
      ws.cell(4, 5).string("PENDIENTE A PAGAR").style(header);
      ws.cell(4, 6).string("$"+PendienteAPagar);
      ws.cell(6, 2).string("FACTURAS EMITIDAS").style(header);
      ws.cell(6, 3).number(FacturasEmitidas);
      ws.cell(6, 5).string("FACTURAS VENCIDAS").style(header);
      ws.cell(6, 6).number(FacturasVencidas)

      ws.cell(8, 2).string("FACTURA").style(header)
      ws.cell(8, 3).string("FECHA VENCIMIENTO").style(header)
      ws.cell(8, 4).string("ESTADO VENCIMIENTO").style(header)
      ws.cell(8, 5).string("VALOR TOTAL").style(header)
      ws.cell(8, 6).string("SALDO PENDIENTE").style(header)

      let fila = 9;
      for (i = 0; i < facturas.length; i++) {
        columna = 2;
        ws.cell(fila, columna++).number(facturas[i].Factura);
        ws.cell(fila, columna++).string(facturas[i].Vencimiento);
        ws.cell(fila, columna++).string(facturas[i].EstadoVencimiento);
        ws.cell(fila, columna++).string("$"+facturas[i].PrecioTotal);
        ws.cell(fila, columna++).string("$"+facturas[i].PendienteAPagar);

        fila++;
      }

      wb.write("Estado de cuenta.xlsx", res);

})


//---------------Zona de pago -------------

//ruta para cargar el checkout

router.get('/checkout/:id', isAuthenticatedClient, async (req, res) => {
  let factura = await facturasDB.findById(req.params.id)
  let NumeroFactura = factura.Factura
  let PendienteAPagar = factura.PendienteAPagar
  let _id = factura._id

  res.render('client/checkout',{
    NumeroFactura,
    PendienteAPagar,
    _id
  })

})


//ruta para cargar el success
router.get('/procesado', isAuthenticatedClient ,async (req, res) =>{
  res.render('client/success')
  
})

//ruta para cargar el cancelado
router.get('/cancelado', isAuthenticatedClient, async (req, res) => {
  
  res.render('client/cancel')

})


//ruta post del checkoyt stripe
router.post('/create-checkout-session', isAuthenticatedClient , async (req, res) => {
  let {value, Factura} = req.body
  let porcentaje = +value * 0.03
  value = +value + porcentaje
  value = +value * 100 
  const session = await stripe.checkout.sessions.create(
    {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `PAGO FACTURA ${Factura}`,
            description :`${Factura}`,
            metadata: {custom_product_id: `${Factura}`}
          },
          unit_amount: value,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://www.thomsonparts.com/procesado`,
    cancel_url: `http://www.thomsonparts.com/estado-cuenta`,
  });

  res.json({ id: session.id });
});



//ruta de noticias 
router.get('/noticias', isAuthenticatedClient, async (req, res) => {

  let stock = await stockDB.find({$and: [{CantidadTotal:{$gte : 1}}, {CantidadTotal: {$lte: 10}}]}).sort({"Codigo":-1})
  let noticia = await noticiasDB.find()
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
  Fecha = `${año}-${mes}-${dia}`;
  for(t=0; t< noticia.length; t++){
    let sieteDias = +Timestamp - +noticia[t].Timestamp
    if(sieteDias >= 604800){
      console.log("borrar 1")
      await noticiasDB.findByIdAndDelete(noticia._id)
    }
  }
  noticia = await noticiasDB.find()
 
  if(noticia.length == 0){
    //no existe ninguna noticia
    if(stock.length == 0){
      //no existe stock mayor a 1 y menor a 10
      res.render('client/noticias')
    }else{
      //existe stock mayor a 1 y menor a 10
      for(i=0; i< stock.length; i++){
        let nuevaNoticia = new noticiasDB({
          Timestamp,
          Fecha,
          Codigo: stock[i].CodigoT,
          Titulo:  `El código ${stock[i].CodigoT} se esta quedando sin stock.`,
          Mensaje: `El código ${stock[i].CodigoT}, perteneciente a un ${stock[i].TipoProducto} se esta agotando de nuestro stock. Por favor, verifique las listas antes de realizar alguna compra.`,
          Clase: "alert-warning"
        })
        let validacionExistente = noticia.find((data) => data.Codigo == stock[i].CodigoT)
        if(!validacionExistente){
          await nuevaNoticia.save()
        }
      }
      let noticias = await noticiasDB.find()
      noticias = noticias.map((data) => {
        return{
          Timestamp: data.Timestamp,
          Fecha: data.Fecha,
          Codigo: data.Codigo,
          Titulo: data.Titulo,
          Mensaje: data.Mensaje,
          Clase: data.Clase,
        }
      })
      res.render('client/noticias',{
        noticias
      })
    }
  }else{
    //existe una noticia
    if(stock.length  == 0){
      //no existe stock mayor a 1 y menor a 10, evaluamos que la noticias que existe siga siendo mayor a cero,
      //si es igual, eliminamos y creamos otra noticia
      for(r=0; r< noticia.length; r++){
        let cantidadStock = await stockDB.findOne({CodigoT: noticia[r].Codigo})
        let CantidadActual = cantidadStock.CantidadTotal
        if(CantidadActual == 0 && noticia[r].Clase != "alert-danger"){
          console.log("borrar 2")
          
          await noticiasDB.findByIdAndDelete(noticia[r]._id)
          let nuevaNoticia = new noticiasDB({
            Timestamp,
            Fecha,
            Codigo: cantidadStock.CodigoT,
            Titulo:  `El código ${cantidadStock.CodigoT} se ha quedado sin stock.`,
            Mensaje: `El código ${cantidadStock.CodigoT}, perteneciente a un ${cantidadStock.TipoProducto} se ha agotado de nuestro stock. Por favor, verifique las listas antes de realizar alguna compra.`,
            Clase: "alert-danger"
          })
          noticia = await noticiasDB.find()
          let validacionExistente = noticia.find((data) => data.Codigo == cantidadStock.CodigoT)
          if(!validacionExistente){
            await nuevaNoticia.save()
          }
        }
      }
      let noticias = await noticiasDB.find()
      noticias = noticias.map((data) => {
        return{
          Timestamp: data.Timestamp,
          Fecha: data.Fecha,
          Codigo: data.Codigo,
          Titulo: data.Titulo,
          Mensaje: data.Mensaje,
          Clase: data.Clase,
        }
      })
      res.render('client/noticias',{
        noticias
      })

    }else{
      for(r=0; r< noticia.length; r++){
        let cantidadStock = await stockDB.findOne({CodigoT: noticia[r].Codigo})
        let CantidadActual = cantidadStock.CantidadTotal
        if(CantidadActual == 0){
             console.log("borrar 3")
          await noticiasDB.findByIdAndDelete(noticia[r]._id)
          let nuevaNoticia = new noticiasDB({
            Timestamp,
            Fecha,
            Codigo: CantidadActual.CodigoT,
            Titulo:  `El código ${CantidadActual.CodigoT} se ha quedado sin stock.`,
            Mensaje: `El código ${CantidadActual.CodigoT}, perteneciente a un ${CantidadActual.TipoProducto} se ha agotado de nuestro stock. Por favor, verifique las listas antes de realizar alguna compra.`,
            Clase: "alert-danger"
          })
          noticia = await noticiasDB.find()
          let validacionExistente = noticia.find((data) => data.Codigo == cantidadStock.CodigoT)
          if(!validacionExistente){
            await nuevaNoticia.save()
          }
        }
      }
      for(i=0; i< stock.length; i++){
        let nuevaNoticia = new noticiasDB({
          Timestamp,
          Fecha,
          Codigo: stock[i].CodigoT,
          Titulo:  `El código ${stock[i].CodigoT} se esta quedando sin stock.`,
          Mensaje: `El código ${stock[i].CodigoT}, perteneciente a un ${stock[i].TipoProducto} se esta agotando de nuestro stock. Por favor, verifique las listas antes de realizar alguna compra.`,
          Clase: "alert-warning"
        })
        let validacionExistente = noticia.find((data) => data.Codigo == stock[i].CodigoT)
        if(!validacionExistente){
          await nuevaNoticia.save()
        }
      }
      let noticias = await noticiasDB.find()
      noticias = noticias.map((data) => {
        return{
          Timestamp: data.Timestamp,
          Fecha: data.Fecha,
          Codigo: data.Codigo,
          Titulo: data.Titulo,
          Mensaje: data.Mensaje,
          Clase: data.Clase,
        }
      })
      res.render('client/noticias',{
        noticias
      })

      
    }
  }

    
})


//ruta para historial de facutra

router.get('/historia-factura/:id', isAuthenticatedClient, async (req, res) => {
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

      }
      if(data.Modalidad == "DEVOLUCIÓN MONTO"){
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
          href: `/ver-devolucion-por-cobro/${data.Recibo}`
        };
      }
      if(data.Modalidad != "DEVOLUCIÓN MONTO" && data.Modalidad != "DEVOLUCIÓN"){
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
