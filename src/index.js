if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const flash = require("connect-flash");
const https = require("https");
const fs = require("fs");
const xl = require("excel4node");
const cron = require("node-cron");

///
const agendaDB = require("./models/agenda");
const catalogoDB = require("./models/Catalogo");
const clienteDB = require("./models/cliente");
const contadorDB = require("./models/contador");
const cotizacionDB = require("./models/cotizacion");
const CuentasPagarDB = require("./models/cuentas-por-pagar");
const facturaDB = require("./models/factura");
const garantiasDB = require("./models/garantias");
const mesesDB = require("./models/meses-administracion");
const MarcaVehiculoDB = require("./models/MarcaVehiculo");
const ModeloProductoDB = require("./models/ModeloProducto");
const ModeloVehiculoDB = require("./models/ModeloVehiculo");
const NombreProductoDB = require("./models/NombreProducto");
const ordenComprasProveedorDB = require("./models/orden-compras-proveedor");
const ordenProveedorTemporalDB = require("./models/orden-proveedor-temporal");
const pendientesDB = require("./models/pendientes");
const proveedorDB = require("./models/proveedor");
const stockDB = require("./models/stock");
const transporteDB = require("./models/transporte");
const usersDB = require("./models/users");
const vendedorDB = require("./models/vendedor");
const ordenesClientesDB = require("./models/cliente/ordenes-clientes");
const ordenesClientesTemporalDB = require("./models/cliente/orden-cliente-temporal");

const agendaRespaldoDB = require("./models/agendaRespaldo");
const catalogoRespaldoDB = require("./models/CatalogoRespaldo");
const clienteRespaldoDB = require("./models/clienteRespaldo");
const contadorRespaldoDB = require("./models/contadorRespaldo");
const cotizacionRespaldoDB = require("./models/cotizacionRespaldo");
const CuentasPagarRespaldoDB = require("./models/cuentas-por-pagarRespaldo");
const facturaRespaldoDB = require("./models/facturaRespaldo");
const garantiasRespaldoDB = require("./models/garantiasRespaldo");
const mesesRespaldoDB = require("./models/meses-administracionRespaldo");
const MarcaVehiculoRespaldoDB = require("./models/MarcaVehiculoRespaldo");
const ModeloProductoRespaldoDB = require("./models/ModeloProductoRespaldo");
const ModeloVehiculoRespaldoDB = require("./models/ModeloVehiculoRespaldo");
const NombreProductoRespaldoDB = require("./models/NombreProductoRespaldo");
const ordenComprasProveedorRespaldoDB = require("./models/orden-compras-proveedorRespaldo");
const ordenProveedorTemporalRespaldoDB = require("./models/orden-proveedor-temporalRespaldo");
const pendientesRespaldoDB = require("./models/pendientesRespaldo");
const proveedorRespaldoDB = require("./models/proveedorRespaldo");
const stockRespaldoDB = require("./models/stockRespaldo");
const transporteRespaldoDB = require("./models/transporteRespaldo");
const usersRespaldoDB = require("./models/usersRespaldo");
const vendedorRespaldoDB = require("./models/vendedorRespaldo");
const ordenesClientesRespaldoDB = require("./models/cliente/ordenes-clientesRespaldo");
const ordenesClientesTemporalRespaldoDB = require("./models/cliente/orden-cliente-temporalRespaldo");
const cuentasPorPagarRespaldoDB = require("./models/cuentas-por-pagarRespaldo");

//Inicializacion
const app = express();
require("./database");
require("./config/passport");

//Configuraciones

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layout"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Middlewears
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  expressSession({
    secret: process.env.MYALL,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(flash());
cron.schedule(
  "13 5 * * *",
  async () => {
    const agenda = await agendaDB.find();
    const catalogo = await catalogoDB.find();
    const cliente = await clienteDB.find();
    const contador = await contadorDB.find();
    const cotizacion = await cotizacionDB.find();
    const CuentasPagar = await CuentasPagarDB.find();
    const factura = await facturaDB.find();
    const garantias = await garantiasDB.find();
    const meses = await mesesDB.find();
    const MarcaVehiculo = await MarcaVehiculoDB.find();
    const ModeloProducto = await ModeloProductoDB.find();
    const ModeloVehiculo = await ModeloVehiculoDB.find();
    const NombreProducto = await NombreProductoDB.find();
    const ordenComprasProveedor = await ordenComprasProveedorDB.find();
    const ordenProveedorTemporal = await ordenProveedorTemporalDB.find();
    const pendientes = await pendientesDB.find();
    const proveedor = await proveedorDB.find();
    const stock = await stockDB.find();
    const transporte = await transporteDB.find();
    const users = await usersDB.find();
    const vendedor = await vendedorDB.find();
    const ordenesClientes = await ordenesClientesDB.find();
    const ordenesClientesTemporal = await ordenesClientesTemporalDB.find();

    const agendaRespaldo = await agendaRespaldoDB.find();
    const catalogoRespaldo = await catalogoRespaldoDB.find();
    const clienteRespaldo = await clienteRespaldoDB.find();
    const contadorRespaldo = await contadorRespaldoDB.find();
    const cotizacionRespaldo = await cotizacionRespaldoDB.find();
    const CuentasPagarRespaldo = await CuentasPagarRespaldoDB.find();
    const facturaRespaldo = await facturaRespaldoDB.find();
    const garantiasRespaldo = await garantiasRespaldoDB.find();
    const mesesRespaldo = await mesesRespaldoDB.find();
    const MarcaVehiculoRespaldo = await MarcaVehiculoRespaldoDB.find();
    const ModeloProductoRespaldo = await ModeloProductoRespaldoDB.find();
    const ModeloVehiculoRespaldo = await ModeloVehiculoRespaldoDB.find();
    const NombreProductoRespaldo = await NombreProductoRespaldoDB.find();
    const ordenComprasProveedorRespaldo =
      await ordenComprasProveedorRespaldoDB.find();
    const ordenProveedorTemporalRespaldo =
      await ordenProveedorTemporalRespaldoDB.find();
    const pendientesRespaldo = await pendientesRespaldoDB.find();
    const proveedorRespaldo = await proveedorRespaldoDB.find();
    const stockRespaldo = await stockRespaldoDB.find();
    const transporteRespaldo = await transporteRespaldoDB.find();
    const usersRespaldo = await usersRespaldoDB.find();
    const vendedorRespaldo = await vendedorRespaldoDB.find();
    const ordenesClientesRespaldo = await ordenesClientesRespaldoDB.find();
    const ordenesClientesTemporalRespaldo =
      await ordenesClientesTemporalRespaldoDB.find();

    console.log("COMENZANDO RESPALDO...");
    for (i = 0; i < agenda.length; i++) {
      let validacion = agendaRespaldo.find(
        (data) => data.identificador == agenda[i]._id
      );
      if (!validacion) {
        let newagenda = new agendaRespaldoDB({
          date: agenda[i].date,
          Nombre: agenda[i].Nombre,
          Empresa: agenda[i].Empresa,
          Numero: agenda[i].Numero,
          identificador: agenda[i]._id,
        });
        await newagenda.save();
      } else {
        await agendaRespaldoDB.findOneAndUpdate(
          { identificador: agenda[i]._id },
          {
            date: agenda[i].date,
            Nombre: agenda[i].Nombre,
            Empresa: agenda[i].Empresa,
            Numero: agenda[i].Numero,
          }
        );
      }
    }
    console.log("4%");
    for (i = 0; i < catalogo.length; i++) {
      let validacion = catalogoRespaldo.find(
        (data) => data.identificador == catalogo[i]._id
      );
      if (!validacion) {
        let newcatalogo = new catalogoRespaldoDB({
          date: catalogo[i].date,
          CodigoT: catalogo[i].CodigoT,
          CodigoG: catalogo[i].CodigoG,
          TipoVehiculo: catalogo[i].TipoVehiculo,
          Marca: catalogo[i].Marca,
          Modelo: catalogo[i].Modelo,
          Desde: catalogo[i].Desde,
          Hasta: catalogo[i].Hasta,
          Año: catalogo[i].Año,
          Familia: catalogo[i].Familia,
          Posicion: catalogo[i].Posicion,
          TipoProducto: catalogo[i].TipoProducto,
          Nombre: catalogo[i].Nombre,
          User: catalogo[i].User,
          identificador: catalogo[i]._id,
        });
        await newcatalogo.save();
      } else {
        await catalogoRespaldoDB.findOneAndUpdate(
          { identificador: catalogo[i]._id },
          {
            date: catalogo[i].date,
            CodigoT: catalogo[i].CodigoT,
            CodigoG: catalogo[i].CodigoG,
            TipoVehiculo: catalogo[i].TipoVehiculo,
            Marca: catalogo[i].Marca,
            Modelo: catalogo[i].Modelo,
            Desde: catalogo[i].Desde,
            Hasta: catalogo[i].Hasta,
            Año: catalogo[i].Año,
            Familia: catalogo[i].Familia,
            Posicion: catalogo[i].Posicion,
            TipoProducto: catalogo[i].TipoProducto,
            Nombre: catalogo[i].Nombre,
            User: catalogo[i].User,
          }
        );
      }
    }
    console.log("8%");
    for (i = 0; i < cliente.length; i++) {
      let validacion = clienteRespaldo.find(
        (data) => data.identificador == cliente[i]._id
      );
      if (!validacion) {
        let newcliente = new clienteRespaldoDB({
          date: cliente[i].date,
          Timestand: cliente[i].Timestand,
          FechaModificacion: cliente[i].FechaModificacion,
          Nombres: cliente[i].Nombres,
          Apellidos: cliente[i].Apellidos,
          Cedula: cliente[i].Cedula,
          Empresa: cliente[i].Empresa,
          Direccion: cliente[i].Direccion,
          Rif: cliente[i].Rif,
          Telefono: cliente[i].Telefono,
          Celular: cliente[i].Celular,
          Vendedor: cliente[i].Vendedor,
          TipoPrecio: cliente[i].TipoPrecio,
          Codigo: cliente[i].Codigo,
          email: cliente[i].email,
          User: cliente[i].User,
          HistorialCliente: cliente[i].HistorialCliente,
          identificador: cliente[i]._id,
        });
        await newcliente.save();
      } else {
        await clienteRespaldoDB.findOneAndUpdate(
          { identificador: cliente[i]._id },
          {
            date: cliente[i].date,
            Timestand: cliente[i].Timestand,
            FechaModificacion: cliente[i].FechaModificacion,
            Nombres: cliente[i].Nombres,
            Apellidos: cliente[i].Apellidos,
            Cedula: cliente[i].Cedula,
            Empresa: cliente[i].Empresa,
            Direccion: cliente[i].Direccion,
            Rif: cliente[i].Rif,
            Telefono: cliente[i].Telefono,
            Celular: cliente[i].Celular,
            Vendedor: cliente[i].Vendedor,
            TipoPrecio: cliente[i].TipoPrecio,
            Codigo: cliente[i].Codigo,
            email: cliente[i].email,
            User: cliente[i].User,
            HistorialCliente: cliente[i].HistorialCliente,
          }
        );
      }
    }
    console.log("12%");
    for (i = 0; i < contador.length; i++) {
      let validacion = contadorRespaldo.find(
        (data) => data.identificador == contador[i]._id
      );
      if (!validacion) {
        let newcontador = new contadorRespaldoDB({
          Nombre: contador[i].Nombre,
          Contador: contador[i].Contador,
          identificador: contador[i]._id,
        });
        await newcontador.save();
      } else {
        await contadorRespaldoDB.findOneAndUpdate(
          { identificador: contador[i]._id },
          {
            Nombre: contador[i].Nombre,
            Contador: contador[i].Contador,
          }
        );
      }
    }
    console.log("16%");
    for (i = 0; i < cotizacion.length; i++) {
      let validacion = cotizacionRespaldo.find(
        (data) => data.identificador == cotizacion[i]._id
      );
      if (!validacion) {
        let newcotizacion = new cotizacionRespaldoDB({
          Factura: cotizacion[i].Factura,
          Timestamp: cotizacion[i].Timestamp,
          Cliente: cotizacion[i].Cliente,
          DocumentoTipo: cotizacion[i].DocumentoTipo,
          Documento: cotizacion[i].Documento,
          Direccion: cotizacion[i].Direccion,
          Productos: cotizacion[i].Productos,
          CantidadTotal: cotizacion[i].CantidadTotal,
          PrecioTotal: cotizacion[i].PrecioTotal,
          date: cotizacion[i].date,
          Vencimiento: cotizacion[i].Vencimiento,
          Celular: cotizacion[i].Celular,
          Vendedor: cotizacion[i].Vendedor,
          Codigo: cotizacion[i].Codigo,
          DocumentoVendedor: cotizacion[i].DocumentoVendedor,
          Zona: cotizacion[i].Zona,
          Porcentaje: cotizacion[i].Porcentaje,
          FechaModificacion: cotizacion[i].FechaModificacion,
          UltimoPago: cotizacion[i].UltimoPago,
          PendienteAPagar: cotizacion[i].PendienteAPagar,
          GananciasVendedor: cotizacion[i].GananciasVendedor,
          Estado: cotizacion[i].Estado,
          User: cotizacion[i].User,
          Nota: cotizacion[i].Nota,
          identificador: cotizacion[i]._id,
        });
        await newcotizacion.save();
      } else {
        await cotizacionRespaldoDB.findOneAndUpdate(
          { identificador: cotizacion[i]._id },
          {
            Factura: cotizacion[i].Factura,
            Timestamp: cotizacion[i].Timestamp,
            Cliente: cotizacion[i].Cliente,
            DocumentoTipo: cotizacion[i].DocumentoTipo,
            Documento: cotizacion[i].Documento,
            Direccion: cotizacion[i].Direccion,
            Productos: cotizacion[i].Productos,
            CantidadTotal: cotizacion[i].CantidadTotal,
            PrecioTotal: cotizacion[i].PrecioTotal,
            date: cotizacion[i].date,
            Vencimiento: cotizacion[i].Vencimiento,
            Celular: cotizacion[i].Celular,
            Vendedor: cotizacion[i].Vendedor,
            Codigo: cotizacion[i].Codigo,
            DocumentoVendedor: cotizacion[i].DocumentoVendedor,
            Zona: cotizacion[i].Zona,
            Porcentaje: cotizacion[i].Porcentaje,
            FechaModificacion: cotizacion[i].FechaModificacion,
            UltimoPago: cotizacion[i].UltimoPago,
            PendienteAPagar: cotizacion[i].PendienteAPagar,
            GananciasVendedor: cotizacion[i].GananciasVendedor,
            Estado: cotizacion[i].Estado,
            User: cotizacion[i].User,
            Nota: cotizacion[i].Nota,
          }
        );
      }
    }
    console.log("20%");
    for (i = 0; i < CuentasPagar.length; i++) {
      let validacion = CuentasPagarRespaldo.find(
        (data) => data.identificador == CuentasPagar[i]._id
      );
      if (!validacion) {
        let newCuentasPagar = new cuentasPorPagarRespaldoDB({
          FechaEstimada: CuentasPagar[i].FechaEstimada,
          Estado: CuentasPagar[i].Estado,
          Comentario: CuentasPagar[i].Comentario,
          Timestamp: CuentasPagar[i].Timestamp,
          Total: CuentasPagar[i].Total,
          UltimoPago: CuentasPagar[i].UltimoPago,
          PendienteAPagar: CuentasPagar[i].PendienteAPagar,
          identificador: CuentasPagar[i]._id,
        });
        await newCuentasPagar.save();
      } else {
        await cuentasPorPagarRespaldoDB.findOneAndUpdate(
          { identificador: CuentasPagar[i]._id },
          {
            FechaEstimada: CuentasPagar[i].FechaEstimada,
            Estado: CuentasPagar[i].Estado,
            Comentario: CuentasPagar[i].Comentario,
            Timestamp: CuentasPagar[i].Timestamp,
            Total: CuentasPagar[i].Total,
            UltimoPago: CuentasPagar[i].UltimoPago,
            PendienteAPagar: CuentasPagar[i].PendienteAPagar,
          }
        );
      }
    }
    console.log("24%");
    for (i = 0; i < factura.length; i++) {
      let validacion = facturaRespaldo.find(
        (data) => data.identificador == factura[i]._id
      );
      if (!validacion) {
        let newfactura = new facturaRespaldoDB({
          Factura: factura[i].Factura,
          Timestamp: factura[i].Timestamp,
          Cliente: factura[i].Cliente,
          DocumentoTipo: factura[i].DocumentoTipo,
          Documento: factura[i].Documento,
          Direccion: factura[i].Direccion,
          OrdenNumero: factura[i].OrdenNumero,
          Productos: factura[i].Productos,
          CantidadTotal: factura[i].CantidadTotal,
          PrecioTotal: factura[i].PrecioTotal,
          date: factura[i].date,
          Vencimiento: factura[i].Vencimiento,
          Celular: factura[i].Celular,
          Vendedor: factura[i].Vendedor,
          Codigo: factura[i].Codigo,
          DocumentoVendedor: factura[i].DocumentoVendedor,
          Zona: factura[i].Zona,
          Porcentaje: factura[i].Porcentaje,
          FechaModificacion: factura[i].FechaModificacion,
          UltimoPago: factura[i].UltimoPago,
          FechaUltimoPago: factura[i].FechaUltimoPago,
          PendienteAPagar: factura[i].PendienteAPagar,
          PendienteAPagarComision: factura[i].PendienteAPagarComision,
          GananciasVendedor: factura[i].GananciasVendedor,
          FechaPagoComision: factura[i].FechaPagoComision,
          EstadoComision: factura[i].EstadoComision,
          Estado: factura[i].Estado,
          User: factura[i].User,
          Nota: factura[i].Nota,
          Chofer: factura[i].Chofer,
          EmpresaTransporte: factura[i].EmpresaTransporte,
          Nota: factura[i].Nota,
          HistorialPago: factura[i].HistorialPago,
          identificador: factura[i]._id,
        });
        await newfactura.save();
      } else {
        await facturaRespaldoDB.findOneAndUpdate(
          { identificador: factura[i]._id },
          {
            Factura: factura[i].Factura,
            Timestamp: factura[i].Timestamp,
            Cliente: factura[i].Cliente,
            DocumentoTipo: factura[i].DocumentoTipo,
            Documento: factura[i].Documento,
            Direccion: factura[i].Direccion,
            OrdenNumero: factura[i].OrdenNumero,
            Productos: factura[i].Productos,
            CantidadTotal: factura[i].CantidadTotal,
            PrecioTotal: factura[i].PrecioTotal,
            date: factura[i].date,
            Vencimiento: factura[i].Vencimiento,
            Celular: factura[i].Celular,
            Vendedor: factura[i].Vendedor,
            Codigo: factura[i].Codigo,
            DocumentoVendedor: factura[i].DocumentoVendedor,
            Zona: factura[i].Zona,
            Porcentaje: factura[i].Porcentaje,
            FechaModificacion: factura[i].FechaModificacion,
            UltimoPago: factura[i].UltimoPago,
            FechaUltimoPago: factura[i].FechaUltimoPago,
            PendienteAPagar: factura[i].PendienteAPagar,
            PendienteAPagarComision: factura[i].PendienteAPagarComision,
            GananciasVendedor: factura[i].GananciasVendedor,
            FechaPagoComision: factura[i].FechaPagoComision,
            EstadoComision: factura[i].EstadoComision,
            Estado: factura[i].Estado,
            User: factura[i].User,
            Nota: factura[i].Nota,
            Chofer: factura[i].Chofer,
            EmpresaTransporte: factura[i].EmpresaTransporte,
            Nota: factura[i].Nota,
            HistorialPago: factura[i].HistorialPago,
          }
        );
      }
    }
    console.log("28%");
    for (i = 0; i < garantias.length; i++) {
      let validacion = garantiasRespaldo.find(
        (data) => data.identificador == garantias[i]._id
      );
      if (!validacion) {
        let newgarantias = new garantiasRespaldoDB({
          date: garantias[i].date,
          CodigoT: garantias[i].CodigoT,
          Comentario: garantias[i].Comentario,
          Proveedor: garantias[i].Proveedor,
          identificador: garantias[i]._id,
        });
        await newgarantias.save();
      } else {
        await garantiasRespaldoDB.findOneAndUpdate(
          { identificador: garantias[i]._id },
          {
            date: garantias[i].date,
            CodigoT: garantias[i].CodigoT,
            Comentario: garantias[i].Comentario,
            Proveedor: garantias[i].Proveedor,
          }
        );
      }
    }
    console.log("32%");
    /*for(i = 0 ; i < meses.length; i++){
    let validacion = mesesRespaldo.find((data) => data.identificador == meses[i]._id)
    if(!validacion){
      let newmeses = new mesesRespaldoDB({
        Año: meses[i].Año,
        Estado: meses[i].Estado,
        TotalEntrada: meses[i].TotalEntrada,
        TotalSalida: meses[i].TotalSalida,
        Total: meses[i].Total,
        meses: meses[i].meses,
        identificador:  meses[i]._id
      })
      await newmeses.save()
    }else{
      await mesesRespaldoDB.findOneAndUpdate({identificador:  meses[i]._id},{
        Año: meses[i].Año,
        Estado: meses[i].Estado,
        TotalEntrada: meses[i].TotalEntrada,
        TotalSalida: meses[i].TotalSalida,
        Total: meses[i].Total,
        meses: meses[i].meses,
      })
    }
  }*/
    console.log("36%");
    for (i = 0; i < MarcaVehiculo.length; i++) {
      let validacion = MarcaVehiculoRespaldo.find(
        (data) => data.identificador == MarcaVehiculo[i]._id
      );
      if (!validacion) {
        let newMarcaVehiculo = new MarcaVehiculoRespaldoDB({
          Nombre: MarcaVehiculo[i].Nombre,
          identificador: MarcaVehiculo[i]._id,
        });
        await newMarcaVehiculo.save();
      } else {
        await MarcaVehiculoRespaldoDB.findOneAndUpdate(
          { identificador: MarcaVehiculo[i]._id },
          {
            Nombre: MarcaVehiculo[i].Nombre,
          }
        );
      }
    }
    console.log("40%");
    for (i = 0; i < ModeloProducto.length; i++) {
      let validacion = ModeloProductoRespaldo.find(
        (data) => data.identificador == ModeloProducto[i]._id
      );
      if (!validacion) {
        let newModeloProducto = new ModeloProductoRespaldoDB({
          Nombre: ModeloProducto[i].Nombre,
          identificador: ModeloProducto[i]._id,
        });
        await newModeloProducto.save();
      } else {
        await ModeloProductoRespaldoDB.findOneAndUpdate(
          { identificador: ModeloProducto[i]._id },
          {
            Nombre: ModeloProducto[i].Nombre,
          }
        );
      }
    }
    console.log("44%");
    for (i = 0; i < ModeloVehiculo.length; i++) {
      let validacion = ModeloVehiculoRespaldo.find(
        (data) => data.identificador == ModeloVehiculo[i]._id
      );
      if (!validacion) {
        let newModeloVehiculo = new ModeloVehiculoRespaldoDB({
          Nombre: ModeloVehiculo[i].Nombre,
          identificador: ModeloVehiculo[i]._id,
        });
        await newModeloVehiculo.save();
      } else {
        await ModeloVehiculoRespaldoDB.findOneAndUpdate(
          { identificador: ModeloVehiculo[i]._id },
          {
            Nombre: ModeloVehiculo[i].Nombre,
          }
        );
      }
    }
    console.log("48%");
    for (i = 0; i < NombreProducto.length; i++) {
      let validacion = NombreProductoRespaldo.find(
        (data) => data.identificador == NombreProducto[i]._id
      );
      if (!validacion) {
        let newNombreProducto = new NombreProductoRespaldoDB({
          Nombre: NombreProducto[i].Nombre,
          identificador: NombreProducto[i]._id,
        });
        await newNombreProducto.save();
      } else {
        await NombreProductoRespaldoDB.findOneAndUpdate(
          { identificador: NombreProducto[i]._id },
          {
            Nombre: NombreProducto[i].Nombre,
          }
        );
      }
    }
    console.log("52%");
    for (i = 0; i < ordenComprasProveedor.length; i++) {
      let validacion = ordenComprasProveedorRespaldo.find(
        (data) => data.identificador == ordenComprasProveedor[i]._id
      );
      if (!validacion) {
        let newordenComprasProveedor = new ordenComprasProveedorRespaldoDB({
          date: ordenComprasProveedor[i].date,
          Proveedor: ordenComprasProveedor[i].Proveedor,
          OrdenNumero: ordenComprasProveedor[i].OrdenNumero,
          Productos: ordenComprasProveedor[i].Productos,
          CantidadTotal: ordenComprasProveedor[i].CantidadTotal,
          PrecioTotal: ordenComprasProveedor[i].PrecioTotal,
          OrdenTemporal: ordenComprasProveedor[i].OrdenTemporal,
          Estado: ordenComprasProveedor[i].Estado,
          identificador: ordenComprasProveedor[i]._id,
        });
        await newordenComprasProveedor.save();
      } else {
        await ordenComprasProveedorRespaldoDB.findOneAndUpdate(
          { identificador: ordenComprasProveedor[i]._id },
          {
            date: ordenComprasProveedor[i].date,
            Proveedor: ordenComprasProveedor[i].Proveedor,
            OrdenNumero: ordenComprasProveedor[i].OrdenNumero,
            Productos: ordenComprasProveedor[i].Productos,
            CantidadTotal: ordenComprasProveedor[i].CantidadTotal,
            PrecioTotal: ordenComprasProveedor[i].PrecioTotal,
            OrdenTemporal: ordenComprasProveedor[i].OrdenTemporal,
            Estado: ordenComprasProveedor[i].Estado,
          }
        );
      }
    }
    console.log("56%");
    for (i = 0; i < ordenProveedorTemporal.length; i++) {
      let validacion = ordenProveedorTemporalRespaldo.find(
        (data) => data.identificador == ordenProveedorTemporal[i]._id
      );
      if (!validacion) {
        let newordenProveedorTemporal = new ordenProveedorTemporalRespaldoDB({
          date: ordenProveedorTemporal[i].date,
          Proveedor: ordenProveedorTemporal[i].Proveedor,
          Productos: ordenProveedorTemporal[i].Productos,
          CantidadTotal: ordenProveedorTemporal[i].CantidadTotal,
          PrecioTotal: ordenProveedorTemporal[i].PrecioTotal,
          identificador: ordenProveedorTemporal[i]._id,
        });
        await newordenProveedorTemporal.save();
      } else {
        await ordenProveedorTemporalRespaldoDB.findOneAndUpdate(
          { identificador: ordenProveedorTemporal[i]._id },
          {
            date: ordenProveedorTemporal[i].date,
            Proveedor: ordenProveedorTemporal[i].Proveedor,
            Productos: ordenProveedorTemporal[i].Productos,
            CantidadTotal: ordenProveedorTemporal[i].CantidadTotal,
            PrecioTotal: ordenProveedorTemporal[i].PrecioTotal,
          }
        );
      }
    }
    console.log("60%");
    for (i = 0; i < pendientes.length; i++) {
      let validacion = pendientesRespaldo.find(
        (data) => data.identificador == pendientes[i]._id
      );
      if (!validacion) {
        let newpendientes = new pendientesRespaldoDB({
          date: pendientes[i].date,
          Empresa: pendientes[i].Empresa,
          Rif: pendientes[i].Rif,
          Direccion: pendientes[i].Direccion,
          Nombres: pendientes[i].Nombres,
          Apellidos: pendientes[i].Apellidos,
          Telefono: pendientes[i].Telefono,
          Celular: pendientes[i].Celular,
          email: pendientes[i].email,
          identificador: pendientes[i]._id,
        });
        await newpendientes.save();
      } else {
        await pendientesRespaldoDB.findOneAndUpdate(
          { identificador: pendientes[i]._id },
          {
            date: pendientes[i].date,
            Empresa: pendientes[i].Empresa,
            Rif: pendientes[i].Rif,
            Direccion: pendientes[i].Direccion,
            Nombres: pendientes[i].Nombres,
            Apellidos: pendientes[i].Apellidos,
            Telefono: pendientes[i].Telefono,
            Celular: pendientes[i].Celular,
            email: pendientes[i].email,
          }
        );
      }
    }
    console.log("64%");
    for (i = 0; i < proveedor.length; i++) {
      let validacion = proveedorRespaldo.find(
        (data) => data.identificador == proveedor[i]._id
      );
      if (!validacion) {
        let newproveedor = new proveedorRespaldoDB({
          date: proveedor[i].date,
          FechaModificacion: proveedor[i].FechaModificacion,
          Nombre: proveedor[i].Nombre,
          Pais: proveedor[i].Pais,
          Direccion: proveedor[i].Direccion,
          Estado: proveedor[i].Estado,
          Postal: proveedor[i].Postal,
          Codigo: proveedor[i].Codigo,
          Costo: proveedor[i].Costo,
          GranMayor: proveedor[i].GranMayor,
          Mayor: proveedor[i].Mayor,
          Detal: proveedor[i].Detal,
          date2: proveedor[i].date2,
          identificador: proveedor[i]._id,
        });
        await newproveedor.save();
      } else {
        await proveedorRespaldoDB.findOneAndUpdate(
          { identificador: proveedor[i]._id },
          {
            date: proveedor[i].date,
            FechaModificacion: proveedor[i].FechaModificacion,
            Nombre: proveedor[i].Nombre,
            Pais: proveedor[i].Pais,
            Direccion: proveedor[i].Direccion,
            Estado: proveedor[i].Estado,
            Postal: proveedor[i].Postal,
            Codigo: proveedor[i].Codigo,
            Costo: proveedor[i].Costo,
            GranMayor: proveedor[i].GranMayor,
            Mayor: proveedor[i].Mayor,
            Detal: proveedor[i].Detal,
            date2: proveedor[i].date2,
          }
        );
      }
    }
    console.log("68%");
    for (i = 0; i < stock.length; i++) {
      let validacion = stockRespaldo.find(
        (data) => data.identificador == stock[i]._id
      );
      if (!validacion) {
        let newstock = new stockRespaldoDB({
          date: stock[i].date,
          Timestamp: stock[i].Timestamp,
          FechaUltimoIngreso: stock[i].FechaUltimoIngreso,
          Vehiculo: stock[i].Vehiculo,
          TipoProducto: stock[i].TipoProducto,
          Nombre: stock[i].Nombre,
          Proveedor: stock[i].Proveedor,
          CodigoT: stock[i].CodigoT,
          CodigoG: stock[i].CodigoG,
          CantidadTotal: stock[i].CantidadTotal,
          CantidadVendida: stock[i].CantidadVendida,
          CostoFOB: stock[i].CostoFOB,
          CostoTotalStock: stock[i].CostoTotalStock,
          Costo: stock[i].Costo,
          CostoTotal: stock[i].CostoTotal,
          CostoFOBTotal: stock[i].CostoFOBTotal,
          CostoGranMayor: stock[i].CostoGranMayor,
          CostoMayor: stock[i].CostoMayor,
          CostoDetal: stock[i].CostoDetal,
          CostoGranMayorTotal: stock[i].CostoGranMayorTotal,
          CostoMayorTotal: stock[i].CostoMayorTotal,
          CostoDetalTotal: stock[i].CostoDetalTotal,
          User: stock[i].User,
          TipoVehiculo: stock[i].TipoVehiculo,
          Modelo: stock[i].Modelo,
          Familia: stock[i].Familia,
          Posicion: stock[i].Posicion,
          Año: stock[i].Año,
          HistorialMovimiento: stock[i].HistorialMovimiento,
          identificador: stock[i]._id,
        });
        await newstock.save();
      } else {
        await stockRespaldoDB.findOneAndUpdate(
          { identificador: stock[i]._id },
          {
            date: stock[i].date,
            Timestamp: stock[i].Timestamp,
            FechaUltimoIngreso: stock[i].FechaUltimoIngreso,
            Vehiculo: stock[i].Vehiculo,
            TipoProducto: stock[i].TipoProducto,
            Nombre: stock[i].Nombre,
            Proveedor: stock[i].Proveedor,
            CodigoT: stock[i].CodigoT,
            CodigoG: stock[i].CodigoG,
            CantidadTotal: stock[i].CantidadTotal,
            CantidadVendida: stock[i].CantidadVendida,
            CostoFOB: stock[i].CostoFOB,
            CostoTotalStock: stock[i].CostoTotalStock,
            Costo: stock[i].Costo,
            CostoTotal: stock[i].CostoTotal,
            CostoFOBTotal: stock[i].CostoFOBTotal,
            CostoGranMayor: stock[i].CostoGranMayor,
            CostoMayor: stock[i].CostoMayor,
            CostoDetal: stock[i].CostoDetal,
            CostoGranMayorTotal: stock[i].CostoGranMayorTotal,
            CostoMayorTotal: stock[i].CostoMayorTotal,
            CostoDetalTotal: stock[i].CostoDetalTotal,
            User: stock[i].User,
            TipoVehiculo: stock[i].TipoVehiculo,
            Modelo: stock[i].Modelo,
            Familia: stock[i].Familia,
            Posicion: stock[i].Posicion,
            Año: stock[i].Año,
            HistorialMovimiento: stock[i].HistorialMovimiento,
          }
        );
      }
    }
    console.log("72%");
    for (i = 0; i < transporte.length; i++) {
      let validacion = transporteRespaldo.find(
        (data) => data.identificador == transporte[i]._id
      );
      if (!validacion) {
        let newtransporte = new transporteRespaldoDB({
          date: transporte[i].date,
          FechaModificacion: transporte[i].FechaModificacion,
          Empresa: transporte[i].Empresa,
          Rif: transporte[i].Rif,
          Direccion: transporte[i].Direccion,
          Vehiculo: transporte[i].Vehiculo,
          Placa: transporte[i].Placa,
          Username: transporte[i].Username,
          Chofer: transporte[i].Chofer,
          Estado: transporte[i].Estado,
          user: transporte[i].user,
          identificador: transporte[i]._id,
        });
        await newtransporte.save();
      } else {
        await transporteRespaldoDB.findOneAndUpdate(
          { identificador: transporte[i]._i },
          {
            date: transporte[i].date,
            FechaModificacion: transporte[i].FechaModificacion,
            Empresa: transporte[i].Empresa,
            Rif: transporte[i].Rif,
            Direccion: transporte[i].Direccion,
            Vehiculo: transporte[i].Vehiculo,
            Placa: transporte[i].Placa,
            Username: transporte[i].Username,
            Chofer: transporte[i].Chofer,
            Estado: transporte[i].Estado,
            user: transporte[i].user,
          }
        );
      }
    }
    console.log("76%");
    for (i = 0; i < users.length; i++) {
      let validacion = usersRespaldo.find(
        (data) => data.identificador == users[i]._id
      );
      if (!validacion) {
        let newusers = new usersRespaldoDB({
          date: users[i].date,
          FechaModificacion: users[i].FechaModificacion,
          email: users[i].email,
          password: users[i].password,
          Role: users[i].Role,
          Estado: users[i].Estado,
          Responsable: users[i].Responsable,
          Nombres: users[i].Nombres,
          Apellidos: users[i].Apellidos,
          Cedula: users[i].Cedula,
          User: users[i].User,
          TipoPrecio: users[i].TipoPrecio,
          identificador: users[i]._id,
        });
        await newusers.save();
      } else {
        await usersRespaldoDB.findOneAndUpdate(
          { identificador: users[i]._id },
          {
            date: users[i].date,
            FechaModificacion: users[i].FechaModificacion,
            email: users[i].email,
            password: users[i].password,
            Role: users[i].Role,
            Estado: users[i].Estado,
            Responsable: users[i].Responsable,
            Nombres: users[i].Nombres,
            Apellidos: users[i].Apellidos,
            Cedula: users[i].Cedula,
            User: users[i].User,
            TipoPrecio: users[i].TipoPrecio,
          }
        );
      }
    }
    console.log("80%");
    for (i = 0; i < vendedor.length; i++) {
      let validacion = vendedorRespaldo.find(
        (data) => data.identificador == vendedor[i]._id
      );
      if (!validacion) {
        let newvendedor = new vendedorRespaldoDB({
          date: vendedor[i].date,
          FechaModificacion: vendedor[i].FechaModificacion,
          Nombres: vendedor[i].Nombres,
          Apellidos: vendedor[i].Apellidos,
          Cedula: vendedor[i].Cedula,
          Celular: vendedor[i].Celular,
          Direccion: vendedor[i].Direccion,
          Zona: vendedor[i].Zona,
          Estado: vendedor[i].Estado,
          Username: vendedor[i].Username,
          email: vendedor[i].email,
          Porcentaje: vendedor[i].Porcentaje,
          Codigo: vendedor[i].Codigo,
          User: vendedor[i].User,
          HistorialVendedor: vendedor[i].HistorialVendedor,
          identificador: vendedor[i]._id,
        });
        await newvendedor.save();
      } else {
        await vendedorRespaldoDB.findOneAndUpdate(
          { identificador: vendedor[i]._id },
          {
            date: vendedor[i].date,
            FechaModificacion: vendedor[i].FechaModificacion,
            Nombres: vendedor[i].Nombres,
            Apellidos: vendedor[i].Apellidos,
            Cedula: vendedor[i].Cedula,
            Celular: vendedor[i].Celular,
            Direccion: vendedor[i].Direccion,
            Zona: vendedor[i].Zona,
            Estado: vendedor[i].Estado,
            Username: vendedor[i].Username,
            email: vendedor[i].email,
            Porcentaje: vendedor[i].Porcentaje,
            Codigo: vendedor[i].Codigo,
            User: vendedor[i].User,
            HistorialVendedor: vendedor[i].HistorialVendedor,
          }
        );
      }
    }
    console.log("90%");
    for (i = 0; i < ordenesClientes.length; i++) {
      let validacion = ordenesClientesRespaldo.find(
        (data) => data.identificador == ordenesClientes[i]._id
      );
      if (!validacion) {
        let newordenesClientes = new ordenesClientesRespaldoDB({
          Timestamp: ordenesClientes[i].Timestamp,
          date: ordenesClientes[i].date,
          email: ordenesClientes[i].email,
          OrdenNumero: ordenesClientes[i].OrdenNumero,
          NumeroFactura: ordenesClientes[i].NumeroFactura,
          TipoPrecio: ordenesClientes[i].TipoPrecio,
          Vendedor: ordenesClientes[i].Vendedor,
          Estado: ordenesClientes[i].Estado,
          Productos: ordenesClientes[i].Productos,
          CantidadTotal: ordenesClientes[i].CantidadTotal,
          PrecioTotal: ordenesClientes[i].PrecioTotal,
          ProductosAtendidos: ordenesClientes[i].ProductosAtendidos,
          CantidadTotalAtendida: ordenesClientes[i].CantidadTotalAtendida,
          PrecioTotalAtendido: ordenesClientes[i].PrecioTotalAtendido,
          identificador: ordenesClientes[i]._id,
        });
        await newordenesClientes.save();
      } else {
        await ordenesClientesRespaldoDB.findOneAndUpdate(
          { identificador: ordenesClientes[i]._id },
          {
            Timestamp: ordenesClientes[i].Timestamp,
            date: ordenesClientes[i].date,
            email: ordenesClientes[i].email,
            OrdenNumero: ordenesClientes[i].OrdenNumero,
            NumeroFactura: ordenesClientes[i].NumeroFactura,
            TipoPrecio: ordenesClientes[i].TipoPrecio,
            Vendedor: ordenesClientes[i].Vendedor,
            Estado: ordenesClientes[i].Estado,
            Productos: ordenesClientes[i].Productos,
            CantidadTotal: ordenesClientes[i].CantidadTotal,
            PrecioTotal: ordenesClientes[i].PrecioTotal,
            ProductosAtendidos: ordenesClientes[i].ProductosAtendidos,
            CantidadTotalAtendida: ordenesClientes[i].CantidadTotalAtendida,
            PrecioTotalAtendido: ordenesClientes[i].PrecioTotalAtendido,
          }
        );
      }
    }
    console.log("95%");
    for (i = 0; i < ordenesClientesTemporal.length; i++) {
      let validacion = ordenesClientesTemporalRespaldo.find(
        (data) => data.identificador == ordenesClientesTemporal[i]._id
      );
      if (!validacion) {
        let newordenesClientesTemporal = new ordenesClientesTemporalRespaldoDB({
          email: ordenesClientesTemporal[i].email,
          Productos: ordenesClientesTemporal[i].Productos,
          CantidadTotal: ordenesClientesTemporal[i].CantidadTotal,
          PrecioTotal: ordenesClientesTemporal[i].PrecioTotal,
          identificador: ordenesClientesTemporal[i]._id,
        });
        await newordenesClientesTemporal.save();
      } else {
        await ordenesClientesTemporalRespaldoDB.findOneAndUpdate(
          { identificador: ordenesClientesTemporal[i]._id },
          {
            email: ordenesClientesTemporal[i].email,
            Productos: ordenesClientesTemporal[i].Productos,
            CantidadTotal: ordenesClientesTemporal[i].CantidadTotal,
            PrecioTotal: ordenesClientesTemporal[i].PrecioTotal,
          }
        );
      }
    }
    console.log("COMPLETADO");
  },
  {
    programado: true,
    timezone: "America/Caracas",
  }
);

//Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});
//Rutas
app.use(require("./routes/index"));
app.use(require("./routes/content"));
app.use(require("./routes/facturacion"));
app.use(require("./routes/reportes"));
app.use(require("./routes/usuarios"));
app.use(require("./routes/client"));
app.use(require("./routes/seller"));

//Archivos estaticos

app.use(express.static(path.join(__dirname, "public")));

//Iniciar server

app.listen(app.get("port"), () => {
  console.log("Escuchando en " + app.get("port"));
});
