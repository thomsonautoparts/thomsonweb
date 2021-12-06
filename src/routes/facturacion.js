const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const agendaDB = require("../models/agenda");
const catalogoDB = require("../models/Catalogo");
const clienteDB = require("../models/cliente");
const contadorDB = require("../models/contador");
const cotizacionDB = require("../models/cotizacion");
const CuentasPagarDB = require("../models/cuentas-por-pagar");
const CuentasPagarPersonalDB = require("../models/cuentas-por-pagar-personal");
const facturaDB = require("../models/factura");
const garantiasDB = require("../models/garantias");
const mesesDB = require("../models/meses-administracion");
const MarcaVehiculoDB = require("../models/MarcaVehiculo");
const ModeloProductoDB = require("../models/ModeloProducto");
const ModeloVehiculoDB = require("../models/ModeloVehiculo");
const NombreProductoDB = require("../models/NombreProducto");
const ordenComprasProveedorDB = require("../models/orden-compras-proveedor");
const ordenProveedorTemporalDB = require("../models/orden-proveedor-temporal");
const pendientesDB = require("../models/pendientes");
const proveedorDB = require("../models/proveedor");
const stockDB = require("../models/stock");
const transporteDB = require("../models/transporte");
const usersDB = require("../models/users");
const vendedorDB = require("../models/vendedor");
const ordenesClientesDB = require("../models/cliente/ordenes-clientes");
const solicitudesRecuperacionContrasenaDB = require("../models/solicitudes-recuperacion-contrasena");
const notasPagoDB = require("../models/notasPago");
const cantidadOrdenesDB = require("../models/cantidad-ordenes");
const libroContableDB = require("../models/libroContable");
const transaccionesDB = require("../models/transacciones");
const { isAuthenticatedAdministracion } = require("../helpers/auth");
const { isAuthenticatedThomson } = require("../helpers/auth");
const { isAuthenticatedFacturacion } = require("../helpers/auth");
const { isAuthenticatedCobranza } = require("../helpers/auth");
const { isAuthenticatedInventario } = require("../helpers/auth");
const { isAuthenticatedProveedor } = require("../helpers/auth");
const { isAuthenticatedCliente } = require("../helpers/auth");
const { isAuthenticatedVendedor } = require("../helpers/auth");
const { isAuthenticatedTransporte } = require("../helpers/auth");
const { isAuthenticatedPerfil } = require("../helpers/auth");
const { isAuthenticatedComision } = require("../helpers/auth");
const { isAuthenticatedAgenda } = require("../helpers/auth");
const { isAuthenticatedDashboard } = require("../helpers/auth");
const { isAuthenticatedMaster } = require("../helpers/auth");
const recibosDevolucioDB = require("../models/recibosDevolucion")
const MarcaVehiculo = require("../models/MarcaVehiculo");
const noticiasDB = require("../models/cliente/noticias")
const recibosComisionesDB = require("../models/recibos-comisiones")
const amortiguadoresGeneralDB = require("../models/amortiguadoresGeneral")
const amortiguadoresPorMesDB = require("../models/amortiguadoresPorMes")
const basesGeneralDB = require("../models/basesGeneral")
const basesPorMesDB = require("../models/basesPorMes")
const bootsGeneralDB = require("../models/bootsGeneral")
const bootsPorMesDB = require("../models/bootsPorMes") 
const contadorClientesDB = require("../models/contadorClientes")
const contadorFacturasDB = require("../models/contadorFacturas")
const contadorOrdenesDB = require("../models/contadorOrdenes")
const facturadoPorMesDB = require("../models/facturadoPorMes")
const utilidadesPorMesDB = require("../models/utilidadesPorMes")
const valorFacturasGranMayorDB = require("../models/valorFacturasGranMayor")
const valorFacturasMayorDB = require("../models/valorFacturasMayor")
const valorFacturasDetalDB = require("../models/valorFacutrasDetal")
const valorGeneralFacturadoDB = require("../models/valorGeneralFacturado")
const valorGeneralUtilidadesDB = require("../models/valorGeneralUtilidades")
const mesesPersonalDB = require("../models/meses-personal")
const reciboPorMontoDB = require("../models/recibo-devolucion-monto")
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'src/public/css/assets/catalogo' })
const storage = multer.diskStorage({
  destination: path.join(__dirname, "controles"),
  filename: function(req, file,cb){
      cb("","control.xlsx")
  }
})
  
const upload2 = multer({
  storage: storage
})
const XLSX = require("xlsx");


router.get('/cantidad-ordenes', async(req, res) => {
  let Ordenes = await ordenesClientesDB.find({ Estado: "En proceso" }).sort({"Timestamp":-1});
  let ordenes = 0;
  for (i = 0; i < Ordenes.length; i++) {
    ordenes = ordenes + 1;
  }

  let nuevaCantidad = new cantidadOrdenesDB({
    Cantidad: ordenes
  })

  await nuevaCantidad.save()

  res.send("ok")
})

router.post('/nueva-notificacion-orden-compra',  isAuthenticatedMaster,async(req, res) => {
  let cantidad = await cantidadOrdenesDB.find()
  let _id = cantidad[0]._id
  cantidad = cantidad[0].Cantidad
  let Ordenes = await ordenesClientesDB.find({ Estado: "En proceso" }).sort({"Timestamp":-1});
  let ordenes = 0;
  for (i = 0; i < Ordenes.length; i++) {
    ordenes = ordenes + 1;
  }
  if(+cantidad == +ordenes){
      let data = {
        message: "No"
      }
      res.send(JSON.stringify(data))

  }if(+cantidad < +ordenes){
      let cliente = await clienteDB.findOne({email: Ordenes[0].email})
      let data = {
        message: `Nueva orden de ${cliente.Empresa}`
      }
      let Cantidad = ordenes
      await cantidadOrdenesDB.findByIdAndUpdate(_id,{
        Cantidad
      })
      res.send(JSON.stringify(data))
    }
})

//Ruta de catalogo
router.get("/Catalogo", isAuthenticatedMaster, (req, res) => {
  res.render("facturacion/catalogo");
});

//ruta para enviar las ordenes de compra a el main

router.post("/solicitar-ordenes-de-compra-cantidad", async (req, res) => {
  let Solicitudes = await solicitudesRecuperacionContrasenaDB.find();
  let Pendientes = await pendientesDB.find()
  let Ordenes = await ordenesClientesDB.find({ Estado: "En proceso" });
  let Noticias = await noticiasDB.find()
  let solicitudes = 0;
  let ordenes = 0;
  let clientes = 0 
  let pendientes = 0
  let noticias = Noticias.length
  for (i = 0; i < Solicitudes.length; i++) {
    clientes = clientes + 1
    solicitudes = solicitudes + 1;
  }
  for (i = 0; i < Pendientes.length; i++) {
    clientes = clientes + 1
    pendientes = pendientes + 1
  }
  for (i = 0; i < Ordenes.length; i++) {
    ordenes = ordenes + 1;
  }
  
  let data = {
    solicitudes: solicitudes,
    clientes: clientes,
    pendientes : pendientes,
    ordenes: ordenes,
    noticias: noticias
  };

  res.send(JSON.stringify(data));
});

//Ruta de catalogo
router.post("/Catalogo", isAuthenticatedMaster, async (req, res) => {
  let {
    CodigoT,
    CodigoG,
    TipoProducto,
    Nombre,
    TipoVehiculo,
    Marca,
    Modelo,
    Desde,
    Hasta,
    Posicion,
    Familia,
  } = req.body;

  CodigoT = CodigoT.toUpperCase();
  CodigoG = CodigoG.toUpperCase();
  TipoProducto = TipoProducto.toUpperCase();
  Nombre = Nombre.toUpperCase();
  TipoVehiculo = TipoVehiculo.toUpperCase();
  Marca = Marca.toUpperCase();
  Modelo = Modelo.toUpperCase();
  Posicion = Posicion.toUpperCase();
  Familia = Familia.toUpperCase();

  const Año = `${Desde}-${Hasta}`;
  let errors = [];

  if (TipoProducto == 0) {
    errors.push({ text: 'El campo "Tipo de producto" no puede estar vacio' });
  }
  if (Nombre == 0) {
    errors.push({ text: 'El campo "Nombre" no puede estar vacio' });
  }
  if (TipoVehiculo == 0) {
    errors.push({ text: 'El campo "Tipo de vehiculo" no puede estar vacio' });
  }
  if (Marca == 0) {
    errors.push({ text: 'El campo "Marca" no puede estar vacio' });
  }
  if (Modelo == 0) {
    errors.push({ text: 'El campo "Modelo" no puede estar vacio' });
  }
  if (Familia == 0) {
    errors.push({ text: 'El campo "Familia" no puede estar vacio' });
  }
  if (!Desde) {
    errors.push({ text: 'El campo "Desde" no puede estar vacio' });
  }
  if (!Hasta) {
    errors.push({ text: 'El campop "Hasta" no puede estar vacio' });
  }
  if (Posicion == 0) {
    errors.push({ text: 'El campo "Posicion" no puede estar vacio' });
  }
  if (!CodigoG && !CodigoT) {
    errors.push({
      text: "Ambos campos de codigos no pueden estar vacios simultaneamente",
    });
  }
  if (errors.length > 0) {
    res.render("facturacion/catalogo", {
      errors,
      CodigoT,
      CodigoG,
      TipoProducto,
      Nombre,
      TipoVehiculo,
      Marca,
      Modelo,
      Desde,
      Hasta,
      Posicion,
      Familia,
    });
  } else {
    const catalogo = new catalogoDB({
      CodigoT,
      CodigoG,
      TipoProducto,
      Nombre,
      TipoVehiculo,
      Marca,
      Modelo,
      Desde,
      Hasta,
      Posicion,
      Familia,
      Año,
    });

    await catalogo.save();
    let ok = [{ text: "Producto registrado correctamente." }];

    res.render("facturacion/catalogo", {
      ok,
    });
  }
});

//Ruta de facturacion
router.get("/Facturacion", isAuthenticatedThomson, (req, res) => {
  let Cliente = req.user.Role.find((element) => element == "Client");
  let Seller = req.user.Role.find((element) => element == "Seller");
  let Nombre = req.user.Responsable;
  if (Seller) {
    res.redirect("/home-seller");
  }
  if (Cliente) {
    res.redirect("/home-client");
  }
  if (!Cliente && !Seller) {
    res.render("facturacion/facturacion", {
      Nombre,
    });
  }
});

//Ruta de registrar stock
router.get(
  "/facturacion/registrar-stock",
  isAuthenticatedInventario,
  async (req, res) => {
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

    await MarcaVehiculo.find()
      .sort({ Nombre: 1 })
      .then(async (data) => {
        const Marca = {
          marca: data.map((datas) => {
            return {
              Nombre: datas.Nombre,
            };
          }),
        };
        await ModeloVehiculoDB.find()
          .sort({ Nombre: 1 })
          .then(async (documentos) => {
            const ModeloV = {
              modelov: documentos.map((documento) => {
                return {
                  Nombre: documento.Nombre,
                };
              }),
            };
            await ModeloProductoDB.find()
              .sort({ Nombre: 1 })
              .then(async (documents) => {
                const ModeloP = {
                  modelop: documents.map((documents) => {
                    return {
                      Nombre: documents.Nombre,
                    };
                  }),
                };
                await NombreProductoDB.find()
                  .sort({ Nombre: 1 })
                  .then((document) => {
                    const NombreP = {
                      nombrep: document.map((document) => {
                        return {
                          Nombre: document.Nombre,
                        };
                      }),
                    };
                    res.render("facturacion/inventario/registrar-stock", {
                      Marca: Marca.marca,
                      ModeloV: ModeloV.modelov,
                      ModeloP: ModeloP.modelop,
                      NombreP: NombreP.nombrep,
                      date,
                    });
                  });
              });
          });
      });
  }
);
//ruta para inviar informacion a registrar stock
router.post(
  "/registrar-stock-info",
  isAuthenticatedInventario,
  async (req, res) => {
    const ModeloP = await ModeloProductoDB.find();
    const Nombre = await NombreProductoDB.find();
    const ModeloV = await ModeloVehiculoDB.find();
    const MarcaV = await MarcaVehiculoDB.find();

    await proveedorDB.find().then((data) => {
      const contexto = {
        proveedor: data.map((data) => {
          return {
            Nombre: data.Nombre,
            GranMayor: data.GranMayor,
            Mayor: data.Mayor,
            Detal: data.Detal,
          };
        }),
      };
      const datos = [contexto.proveedor, ModeloP, Nombre, ModeloV, MarcaV];
      res.status(200).send(JSON.stringify(datos));
    });
  }
);

//Ruta de registrar cliente
router.get(
  "/facturacion/registrar-cliente",
  isAuthenticatedCliente,
  async (req, res) => {
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
    let date2 = `${año}-${mes}-${dia}`;

    await vendedorDB
      .find()
      .sort({ Nombre: 1 })
      .then((document) => {
        const context = {
          vendedor: document.map((document) => {
            return {
              Username: document.Username,
            };
          }),
        };
        res.render("facturacion/cliente/registrar-cliente", {
          Vendedor: context.vendedor,
          date2,
        });
      });
  }
);

//Post de registro de cliente
router.post(
  "/facturacion/registrar-cliente",
  isAuthenticatedCliente,
  async (req, res) => {
    let {
      date,
      Nombres,
      Apellidos,
      Cedula,
      Empresa,
      Direccion,
      Rif,
      Telefono,
      Celular,
      email,
      emailconfirm,
      password,
      passwordconfirm,
      TipoPrecio,
      Vendedor,
    } = req.body;
    let errors = [];
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
    let date2 = `${año}-${mes}-${dia}`;

    Nombres = Nombres.toUpperCase();
    Apellidos = Apellidos.toUpperCase();
    Empresa = Empresa.toUpperCase();
    Direccion = Direccion.toUpperCase();
    TipoPrecio = TipoPrecio.toUpperCase();
    let Codigo = Rif;

    if (TipoPrecio == 0) {
      errors.push({
        text: 'El campo "Tipo de precio" no puede estar vacio',
      });
    }
    if (Vendedor == 0) {
      errors.push({
        text: 'El campo "Vendedor" no puede estar vacio',
      });
    }
    if (!email) {
      errors.push({
        text: 'El campo "Correo electronico" no puede estar vacio" ',
      });
    }
    if (!emailconfirm) {
      errors.push({
        text: 'El campo "Confirmar correo electronico" no puede estar vacio"',
      });
    }
    if (email != emailconfirm) {
      errors.push({
        text: "Los correos ingresados no coinciden",
      });
    }
    if (!password) {
      errors.push({
        text: 'El campo "Contraseña" no puede estar vacio',
      });
    }
    if (!passwordconfirm) {
      errors.push({
        text: 'El campo "Confirmar ontraseña" no puede estar vacio',
      });
    }
    if (passwordconfirm != password) {
      errors.push({
        text: "Las contraseña ingresadas no coinciden",
      });
    }
    if (!date) {
      errors.push({
        text: 'El campo "Fecha de registro" no puede estar vacio',
      });
    }
    if (!Nombres) {
      errors.push({ text: 'El campo "Nombres" no puede estar vacio' });
    }
    if (!Apellidos) {
      errors.push({ text: 'El campo "Apellidos" no puede estar vacio' });
    }
    if (!Empresa) {
      errors.push({
        text: 'El campo "Empresa o negocio" no puede estar vacio',
      });
    }
    if (!Direccion) {
      errors.push({ text: 'El campo "Direccion fisca" no puede estar vacio' });
    }
    if (!Rif) {
      errors.push({ text: 'El campo "Rif" no puede estar vacio' });
    }
    if (!Celular) {
      errors.push({ text: 'El campo "Celular" no puede estar vacio' });
    }
    if (errors.length > 0) {
      res.render("facturacion/cliente/registrar-cliente", {
        errors,
        date2,
        Nombres,
        Apellidos,
        Cedula,
        Empresa,
        Direccion,
        Rif,
        Celular,
        Telefono,
        Codigo,
        email,
        emailconfirm,
        password,
        passwordconfirm,
      });
    } else {
      const validarCliente = await clienteDB.findOne({ Rif: Rif });

      if (validarCliente) {
        errors.push({ text: "El cliente ya se encuentra registrado" });
        res.render("facturacion/cliente/registrar-cliente", {
          errors,
          date2,
          Nombres,
          Apellidos,
          Cedula,
          Empresa,
          Direccion,
          Rif,
          Celular,
          Telefono,
          Codigo,
          email,
          emailconfirm,
          password,
          passwordconfirm,
        });
      } else {
        let User = req.user.email;
        const newCliente = new clienteDB({
          date,
          Nombres,
          Apellidos,
          Cedula,
          Empresa,
          Direccion,
          Rif,
          Telefono,
          Celular,
          Codigo,
          email,
          Vendedor,
          TipoPrecio,
          User,
        });
        let Responsable = Empresa;
        let Role = "Client";
        let Estado = "Activo";
        Cedula = Rif;
        const newUserAdmin = new usersDB({
          date,
          Responsable,
          Role,
          Nombres,
          Apellidos,
          Cedula,
          email,
          TipoPrecio,
          Estado,
        });
        newUserAdmin.password = await newUserAdmin.encryptPassword(password);
        await newUserAdmin.save();
        await newCliente.save();
        let ok = [{ text: "Cliente registrado correctamente" }];
        res.render("facturacion/cliente/registrar-cliente", {
          ok,
          date2,
        });
      }
    }
  }
);
//Ruta de registrar vendedor
router.get(
  "/facturacion/registrar-vendedor",
  isAuthenticatedVendedor,
  (req, res) => {
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
    let date2 = `${año}-${mes}-${dia}`;
    res.render("facturacion/vendedor/registrar-vendedor", {
      date2,
    });
  }
);
//POST de registrar vendedor
router.post(
  "/facturacion/registrar-vendedor",
  isAuthenticatedVendedor,
  async (req, res) => {
    let {
      date,
      Nombres,
      Apellidos,
      Cedula,
      Direccion,
      Celular,
      Zona,
      Username,
      Porcentaje,
      password,
      passwordconfirm,
      email,
      emailconfirm,
    } = req.body;

    Username = Username.toUpperCase();
    Nombres = Nombres.toUpperCase();
    Apellidos = Apellidos.toUpperCase();
    Direccion = Direccion.toUpperCase();
    Zona = Zona.toUpperCase();
    let Codigo = Cedula;
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
    let date2 = `${año}-${mes}-${dia}`;

    let errors = [];

    if (!Porcentaje) {
      errors.push({
        text: 'El campo "Porcentaje de ganancia" no puede estar vacio',
      });
    }
    if (!Username) {
      errors.push({
        text: 'El campo "Nombre de usuario" no puede estar vacio',
      });
    }
    if (!email) {
      errors.push({
        text: 'El campo "Correo electronico" no puede estar vacio',
      });
    }
    if (!emailconfirm) {
      errors.push({
        text: 'El campo "Confirmar correo electronico" no puede estar vacio',
      });
    }
    if (email != emailconfirm) {
      errors.push({
        text: "Los correos ingresados no coinciden",
      });
    }
    if (!password) {
      errors.push({
        text: 'El campo "Contraseña" no puede estar vacio',
      });
    }
    if (!passwordconfirm) {
      errors.push({
        text: 'El campo "Confirmar ontraseña" no puede estar vacio',
      });
    }
    if (passwordconfirm != password) {
      errors.push({
        text: "Las contraseña ingresadas no coinciden",
      });
    }
    if (!date) {
      errors.push({
        text: 'El campo "Fecha de registro" no puede estar vacio',
      });
    }
    if (!Nombres) {
      errors.push({ text: 'El campo "Nombres" no puede estar vacio' });
    }
    if (!Apellidos) {
      errors.push({ text: 'El campo "Apellidos" no puede estar vacio' });
    }
    if (!Cedula) {
      errors.push({ text: 'El campo "Cedula" no puede estar vacion' });
    }
    if (!Direccion) {
      errors.push({ text: 'El campo "Direccion" no puede estar vacio' });
    }
    if (!Celular) {
      errors.push({ text: 'El campo "Celular" no puede estar vacio' });
    }
    if (!Zona) {
      errors.push({ text: 'El campo "Zona de venta" no puede estar vacio' });
    }
    if (!Codigo) {
      errors.push({ text: 'El campo "Codigo" no puede estar vacio' });
    }
    if (errors.length > 0) {
      res.render("facturacion/vendedor/registrar-vendedor", {
        errors,
        date,
        Nombres,
        Apellidos,
        Cedula,
        Direccion,
        Celular,
        Zona,
        Codigo,
        Username,
        password,
        passwordconfirm,
        email,
        Porcentaje,
        emailconfirm,
      });
    } else {
      const validarVendedor = await vendedorDB.findOne({ Cedula: Cedula });
      if (validarVendedor) {
        errors.push({
          text: "El vendedor ingresado ya se encuentra registrado",
        });
        res.render("facturacion/vendedor/registrar-vendedor", {
          errors,
          date2,
          Nombres,
          Apellidos,
          Cedula,
          Porcentaje,
          Direccion,
          Celular,
          Zona,
          Codigo,
          password,
          passwordconfirm,
          email,
          Porcentaje,
          emailconfirm,
        });
      } else {
        let Estado = "Pendiente";
        let User = req.user.email;
        const newVendedor = new vendedorDB({
          date,
          Nombres,
          Apellidos,
          Cedula,
          Direccion,
          Celular,
          Zona,
          Codigo,
          Estado,
          email,
          Porcentaje,
          User,
          Username,
        });
        let Responsable = Username;
        let Role = "Seller";

        const newUserAdmin = new usersDB({
          date,
          Responsable,
          Role,
          Nombres,
          Apellidos,
          Cedula,
          email,
          password,
          Estado,
        });
        newUserAdmin.password = await newUserAdmin.encryptPassword(password);
        await newUserAdmin.save();
        await newVendedor.save();
        let ok = [{ text: "Vendedor registrado correctamente" }];
        res.render("facturacion/vendedor/registrar-vendedor", {
          ok,
          date2,
        });
      }
    }
  }
);
//Ruta de registrar usuario
router.get(
  "/facturacion/registrar-usuario",
  /*isAuthenticatedPerfil,*/
  (req, res) => {
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
    res.render("facturacion/perfiles/registrar-usuario", {
      date,
    });
  }
);
//Post de registrar usuario
router.post(
  "/facturacion/registrar-usuario",
  /*isAuthenticatedPerfil,*/
  async (req, res) => {
    let {
      date,
      Nombres,
      Apellidos,
      Cedula,
      Role,
      email,
      password,
      PasswordConfirm,
    } = req.body;

    let errors = [];
    Nombres = Nombres.toUpperCase();
    Apellidos = Apellidos.toUpperCase();

    let Responsable = Nombres + " " + Apellidos;

    if (!date) {
      errors.push({
        text: 'El campo "Fecha de registro" no puede estar vacio',
      });
    }
    if (!Nombres) {
      errors.push({ text: 'El campo "Nombres" no puede estar vacio' });
    }
    if (!Apellidos) {
      errors.push({ text: 'El campo "Apellidos" no puede estar vacio' });
    }
    if (!Cedula) {
      errors.push({ text: 'El campo "Cedula" no puede estar vacio' });
    }
    if (Role == 0) {
      errors.push({ text: 'El campo "Nivel de usuario" no puede estar vacio' });
    }
    if (!email) {
      errors.push({ text: 'El campo "Emauk" no puede estar vacio' });
    }
    if (!password) {
      errors.push({ text: 'El campo "Contraseña" no puede estar vacio' });
    }
    if (!PasswordConfirm) {
      errors.push({
        text: 'El campo "Confirmar contraseña" no puede estar vacio',
      });
    }
    if (password != PasswordConfirm) {
      errors.push({ text: "Las contraseñas introducidas no coinciden" });
    }
    if (errors.length > 0) {
      res.render("facturacion/perfiles/registrar-usuario", {
        errors,
        date,
        Nombres,
        Apellidos,
        Cedula,
        Role,
        email,
        password,
        PasswordConfirm,
      });
    } else {
      const validarUsuario = await usersDB.findOne({ email: email });
      if (validarUsuario) {
        errors.push({ text: "El correo ingresado ya se encuentra registrado" });
        res.render("facturacion/perfiles/registrar-usuario", {
          errors,
          date,
          Nombres,
          Apellidos,
          Cedula,
          Role,
          email,
          password,
          PasswordConfirm,
        });
      } else {
        const newUserAdmin = new usersDB({
          date,
          Responsable,
          Role,
          Nombres,
          Apellidos,
          Cedula,
          email,
          password,
        });
        newUserAdmin.password = await newUserAdmin.encryptPassword(password);
        await newUserAdmin.save();
        let ok = [{ text: "Usuario registrado correctamente" }];
        res.render("facturacion/perfiles/registrar-usuario", {
          ok,
        });
      }
    }
  }
);

//Ruta de nueva factura
router.get(
  "/facturacion/nueva-factura",isAuthenticatedFacturacion,async (req, res) => {
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

    await transporteDB
      .find()
      .sort({ date: "desc" })
      .then(async (data) => {
        const transportista = {
          transporte: data.map((datas) => {
            return {
              Chofer: datas.Chofer,
              Username: datas.Username,
            };
          }),
        };
        await clienteDB
          .find()
          .sort({ date: -1 })
          .then(async (documentos) => {
            const contexto = {
              clientes: documentos.map((documento) => {
                return {
                  date: documento.date,
                  FechaModificacion: documento.FechaModificacion,
                  Nombres: documento.Nombres,
                  Apellidos: documento.Apellidos,
                  Cedula: documento.Cedula,
                  Empresa: documento.Empresa,
                  Direccion: documento.Direccion,
                  Rif: documento.Rif,
                  Telefono: documento.Telefono,
                  Celular: documento.Celular,
                  Codigo: documento.Codigo,
                  email: documento.email,
                  Empresa: documento.Empresa,
                  TipoPrecio: documento.TipoPrecio,
                  _id: documento._id,
                };
              }),
            };
            await stockDB
              .find()
              .sort({ date: -1 })
              .then(async (documents) => {
                const context = {
                  stock: documents.map((documents) => {
                    return {
                      date: documents.date,
                      FechaModificacion: documents.FechaModificacion,
                      Vehiculo: documents.Vehiculo,
                      TipoProducto: documents.TipoProducto,
                      Nombre: documents.Nombre,
                      Proveedor: documents.Proveedor,
                      CodigoT: documents.CodigoT,
                      CodigoG: documents.CodigoG,
                      CantidadTotal: documents.CantidadTotal,
                      CostoFOB: documents.CostoFOB,
                      CostoFOBTotal: documents.CostoFOBTotal,
                      CostoGranMayor: documents.CostoGranMayor,
                      CostoMayor: documents.CostoMayor,
                      CostoDetal: documents.CostoDetal,
                      CostoGranMayorTotal: documents.CostoGranMayorTotal,
                      CostoMayorTotal: documents.CostoMayorTotal,
                      CostoDetalTotal: documents.CostoDetalTotal,
                      User: documents.User,
                      TipoVehiculo: documents.TipoVehiculo,
                      Modelo: documents.Modelo,
                      Familia: documents.Familia,
                      Posicion: documents.Posicion,
                      Año: documents.Año,
                      _id: documents._id,
                    };
                  }),
                };
                await vendedorDB
                  .find()
                  .sort({ date: -1 })
                  .then((document) => {
                    const contex = {
                      vendedor: document.map((document) => {
                        return {
                          date: document.date,
                          FechaModificacion: document.FechaModificacion,
                          Nombres: document.Nombres,
                          Apellidos: document.Apellidos,
                          Cedula: document.Cedula,
                          Celular: document.Celular,
                          Direccion: document.Direccion,
                          Zona: document.Zona,
                          Codigo: document.Codigo,
                          User: document.User,
                          Username: document.Username,
                          Porcentaje: document.Porcentaje,
                          _id: document._id,
                        };
                      }),
                    };
                    res.render("facturacion/facturacion/nueva-factura", {
                      cliente: contexto.clientes,
                      stock: context.stock,
                      vendedor: contex.vendedor,
                      transporte: transportista.transporte,
                      date,
                    });
                  });
              });
          });
      });
  }
);
//POST de nueva factura
router.post("/facturacion/nueva-factura",isAuthenticatedFacturacion,async (req, res) => {
    await clienteDB
      .find()
      .sort({ date: -1 })
      .then(async (documentos) => {
        const contexto = {
          clientes: documentos.map((documento) => {
            return {
              date: documento.date,
              FechaModificacion: documento.FechaModificacion,
              Nombres: documento.Nombres,
              Apellidos: documento.Apellidos,
              Cedula: documento.Cedula,
              Empresa: documento.Empresa,
              Direccion: documento.Direccion,
              Rif: documento.Rif,
              Vendedor: documento.Vendedor,
              Telefono: documento.Telefono,
              Celular: documento.Celular,
              Codigo: documento.Codigo,
              email: documento.email,
              Empresa: documento.Empresa,
              TipoPrecio: documento.TipoPrecio,
              _id: documento._id,
            };
          }),
        };
        await stockDB
          .find()
          .sort({ date: -1 })
          .then(async (documents) => {
            const context = {
              stock: documents.map((documents) => {
                return {
                  date: documents.date,
                  FechaModificacion: documents.FechaModificacion,
                  Vehiculo: documents.Vehiculo,
                  TipoProducto: documents.TipoProducto,
                  Nombre: documents.Nombre,
                  Proveedor: documents.Proveedor,
                  CodigoT: documents.CodigoT,
                  CodigoG: documents.CodigoG,
                  CantidadTotal: documents.CantidadTotal,
                  CostoFOB: documents.CostoFOB,
                  CostoFOBTotal: documents.CostoFOBTotal,
                  CostoGranMayor: documents.CostoGranMayor,
                  CostoMayor: documents.CostoMayor,
                  CostoDetal: documents.CostoDetal,
                  CostoGranMayorTotal: documents.CostoGranMayorTotal,
                  CostoMayorTotal: documents.CostoMayorTotal,
                  CostoDetalTotal: documents.CostoDetalTotal,
                  User: documents.User,
                  TipoVehiculo: documents.TipoVehiculo,
                  Modelo: documents.Modelo,
                  Familia: documents.Familia,
                  Posicion: documents.Posicion,
                  Año: documents.Año,
                  _id: documents._id,
                };
              }),
            };
            await facturaDB
              .find()
              .sort({ Factura: -1 })
              .then(async (document) => {
                const contex = {
                  factura: document.map((document) => {
                    return {
                      Factura: document.Factura,
                      Vehiculo: document.Vehiculo,
                      _id: document._id,
                    };
                  }),
                };
                await vendedorDB
                  .find()
                  .sort({ date: -1 })
                  .then(async (document) => {
                    const contextoVendedor = {
                      vendedor: document.map((documentos) => {
                        return {
                          date: documentos.date,
                          FechaModificacion: documentos.FechaModificacion,
                          Nombres: documentos.Nombres,
                          Apellidos: documentos.Apellidos,
                          Cedula: documentos.Cedula,
                          Celular: documentos.Celular,
                          Direccion: documentos.Direccion,
                          Zona: documentos.Zona,
                          Codigo: documentos.Codigo,
                          User: documentos.User,
                          Username: documentos.Username,
                          Porcentaje: documentos.Porcentaje,
                          _id: documentos._id,
                          Estado: documentos.Estado,
                        };
                      }),
                    };
                    await transporteDB
                      .find()
                      .sort({ date: -1 })
                      .then(async (document) => {
                        const contextoChofer = {
                          chofer: document.map((documentos) => {
                            return {
                              Empresa: documentos.Empresa,
                              Chofer: documentos.Chofer,
                              Vehiculo: documentos.Vehiculo,
                              Placa: documentos.Placa,
                              Username: documentos.Username,
                              Estado: documentos.Estado,
                            };
                          }),
                        };
                        const datos = [
                          contexto.clientes,
                          context.stock,
                          contex.factura,
                          contextoVendedor.vendedor,
                          contextoChofer.chofer,
                        ];
                        res.status(202).send(JSON.stringify(datos));
                      });
                  });
              });
          });
      });
  }
);
//Ruta de stock
router.get("/facturacion/stock",isAuthenticatedInventario,async (req, res) => {
    res.render("facturacion/inventario/stock")
});



router.post('/solicitar-info-stock', isAuthenticatedThomson, async (req, res) => {
  let stock = await stockDB.find()
  for(i=0; i < stock.length; i++){
    let CantidadTotal = stock[i].CantidadTotal
    let CostoFOBTotal = (+CantidadTotal * +stock[i].CostoFOB).toFixed(2)
    let CostoTotal = (+CantidadTotal * +stock[i].Costo).toFixed(2)
    let CostoGranMayorTotal = (+CantidadTotal * +stock[i].CostoGranMayor).toFixed(2)
    let CostoMayorTotal = (+CantidadTotal * +stock[i].CostoMayor).toFixed(2)
    let CostoDetalTotal = (+CantidadTotal * +stock[i].CostoDetal).toFixed(2)
    await stockDB.findByIdAndUpdate(stock[i]._id,{
      CostoFOBTotal,
      CostoTotal,
      CostoGranMayorTotal,
      CostoMayorTotal,
      CostoDetalTotal,
    })
  }
    await stockDB
      .find()
      .sort({ TipoProducto: 1, Modelo: 1 })
      .then(async (document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              date: document.date,
              FechaUltimoIngreso: document.FechaUltimoIngreso,
              TipoVehiculo: document.TipoVehiculo,
              Marca: document.Marca,
              Modelo: document.Modelo,
              Desde: document.Desde,
              Hasta: document.Hasta,
              TipoProducto: document.TipoProducto.toUpperCase(),
              Nombre: document.Nombre,
              Proveedor: document.Proveedor,
              Familia: document.Familia.toUpperCase(),
              CodigoT: document.CodigoT,
              CodigoG: document.CodigoG,
              Posicion: document.Posicion,
              Vehiculo: document.Vehiculo,
              CantidadTransito: document.CantidadTransito,
              CantidadProduccion: document.CantidadProduccion,
              Cantidad: document.Cantidad,
              CostoM: document.CostoM,
              Costo: document.Costo,
              CostoTotal: document.CostoTotal,
              Precio: document.Precio,
              CostoMT: document.CostoMT,
              CostoT: document.CostoT,
              PrecioT: document.PrecioT,
              User: document.User,
              _id: document._id,
              Posicion: document.Posicion.toUpperCase(),
              TipoVehiculo: document.TipoVehiculo,
              Modelo: document.Modelo,
              Año: document.Modelo,
              CantidadTotal: document.CantidadTotal,
              CostoFOB: document.CostoFOB,
              CostoGranMayor: document.CostoGranMayor,
              CostoMayor: document.CostoMayor,
              CostoDetal: document.CostoDetal,
              User: document.User,
            };
          }),
        };
        for (i = 0; i < contex.stock.length; i++) {
          let Descripcion = "";
          let PorcentajeCosto;
          let PorcentajeCostoGranMayor;
          let PorcentajeCostoMayor;
          let PorcentajeCostoDetal;
          for (x = 0; x < contex.stock[i].Vehiculo.length; x++) {
            if (
              contex.stock[i].Vehiculo[x].Modelo ==
              contex.stock[i].Vehiculo[contex.stock[i].Vehiculo.length - 1]
                .Modelo
            ) {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}`;
            } else {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}, `;
            }
          }
          contex.stock[i].Descripcion = Descripcion;

          PorcentajeCosto = (
            (contex.stock[i].Costo * 100) / contex.stock[i].CostoFOB - 100 ).toFixed(2);
            PorcentajeCostoGranMayor = (
              (contex.stock[i].CostoGranMayor * 100) / contex.stock[i].Costo -
              100
            ).toFixed(2);
            PorcentajeCostoMayor = (
              (contex.stock[i].CostoMayor * 100) / contex.stock[i].Costo -
              100
            ).toFixed(2);
            PorcentajeCostoDetal = (
              (contex.stock[i].CostoDetal * 100) / contex.stock[i].Costo -
              100
            ).toFixed(2);

          contex.stock[
            i
          ].Costo = `${contex.stock[i].Costo} (${PorcentajeCosto}%)`;
          contex.stock[
            i
          ].CostoGranMayor = `${contex.stock[i].CostoGranMayor} (${PorcentajeCostoGranMayor}%)`;
          contex.stock[
            i
          ].CostoMayor = `${contex.stock[i].CostoMayor} (${PorcentajeCostoMayor}%)`;
          contex.stock[
            i
          ].CostoDetal = `${contex.stock[i].CostoDetal} (${PorcentajeCostoDetal}%)`;
        }
        res.send(JSON.stringify(contex.stock))
      });
    });



router.post('/solicitar-info-por-codigo', isAuthenticatedThomson, async (req, res) =>{
  let {CodigoT} = req.body
  let stock = await stockDB.find({CodigoT:CodigoT})

  for(i=0; i < stock.length; i++){
    let CantidadTotal = stock[i].CantidadTotal
    let CostoFOBTotal = (+CantidadTotal * +stock[i].CostoFOB).toFixed(2)
    let CostoTotal = (+CantidadTotal * +stock[i].Costo).toFixed(2)
    let CostoGranMayorTotal = (+CantidadTotal * +stock[i].CostoGranMayor).toFixed(2)
    let CostoMayorTotal = (+CantidadTotal * +stock[i].CostoMayor).toFixed(2)
    let CostoDetalTotal = (+CantidadTotal * +stock[i].CostoDetal).toFixed(2)
    await stockDB.findByIdAndUpdate(stock[i]._id,{
      CostoFOBTotal,
      CostoTotal,
      CostoGranMayorTotal,
      CostoMayorTotal,
      CostoDetalTotal,
    })
  }
    await stockDB
      .find({CodigoT:CodigoT})
      .sort({ TipoProducto: 1, Modelo: 1 })
      .then(async (document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              date: document.date,
              FechaUltimoIngreso: document.FechaUltimoIngreso,
              TipoVehiculo: document.TipoVehiculo,
              Marca: document.Marca,
              Modelo: document.Modelo,
              Desde: document.Desde,
              Hasta: document.Hasta,
              TipoProducto: document.TipoProducto.toUpperCase(),
              Nombre: document.Nombre,
              Proveedor: document.Proveedor,
              Familia: document.Familia.toUpperCase(),
              CodigoT: document.CodigoT,
              CodigoG: document.CodigoG,
              Posicion: document.Posicion,
              Vehiculo: document.Vehiculo,
              CantidadTransito: document.CantidadTransito,
              CantidadProduccion: document.CantidadProduccion,
              Cantidad: document.Cantidad,
              CostoM: document.CostoM,
              Costo: document.Costo,
              CostoTotal: document.CostoTotal,
              Precio: document.Precio,
              CostoMT: document.CostoMT,
              CostoT: document.CostoT,
              PrecioT: document.PrecioT,
              User: document.User,
              _id: document._id,
              Posicion: document.Posicion.toUpperCase(),
              TipoVehiculo: document.TipoVehiculo,
              Modelo: document.Modelo,
              Año: document.Modelo,
              CantidadTotal: document.CantidadTotal,
              CostoFOB: document.CostoFOB,
              CostoGranMayor: document.CostoGranMayor,
              CostoMayor: document.CostoMayor,
              CostoDetal: document.CostoDetal,
              User: document.User,
            };
          }),
        };
        for (i = 0; i < contex.stock.length; i++) {
          let Descripcion = "";
          let PorcentajeCosto;
          let PorcentajeCostoGranMayor;
          let PorcentajeCostoMayor;
          let PorcentajeCostoDetal;
          for (x = 0; x < contex.stock[i].Vehiculo.length; x++) {
            if (
              contex.stock[i].Vehiculo[x].Modelo ==
              contex.stock[i].Vehiculo[contex.stock[i].Vehiculo.length - 1]
                .Modelo
            ) {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}`;
            } else {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}, `;
            }
          }
          contex.stock[i].Descripcion = Descripcion;

          PorcentajeCosto = (
            (contex.stock[i].Costo * 100) / contex.stock[i].CostoFOB - 100 ).toFixed(2);
            PorcentajeCostoGranMayor = (
              (contex.stock[i].CostoGranMayor * 100) / contex.stock[i].Costo -
              100
            ).toFixed(2);
            PorcentajeCostoMayor = (
              (contex.stock[i].CostoMayor * 100) / contex.stock[i].Costo -
              100
            ).toFixed(2);
            PorcentajeCostoDetal = (
              (contex.stock[i].CostoDetal * 100) / contex.stock[i].Costo -
              100
            ).toFixed(2);

          contex.stock[
            i
          ].Costo = `${contex.stock[i].Costo} (${PorcentajeCosto}%)`;
          contex.stock[
            i
          ].CostoGranMayor = `${contex.stock[i].CostoGranMayor} (${PorcentajeCostoGranMayor}%)`;
          contex.stock[
            i
          ].CostoMayor = `${contex.stock[i].CostoMayor} (${PorcentajeCostoMayor}%)`;
          contex.stock[
            i
          ].CostoDetal = `${contex.stock[i].CostoDetal} (${PorcentajeCostoDetal}%)`;
        }
        res.send(JSON.stringify(contex.stock))
      });

})

//ruta para cargar vista de pausar - activar vendedores

router.get(
  "/facturacion/pausar-activar-vendedor",
  isAuthenticatedVendedor,
  async (req, res) => {
    await vendedorDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          vendedor: document.map((document) => {
            return {
              date: document.date,
              FechaModificacion: document.FechaModificacion,
              Nombres: document.Nombres,
              Apellidos: document.Apellidos,
              Cedula: document.Cedula,
              Celular: document.Celular,
              Direccion: document.Direccion,
              Zona: document.Zona,
              Estado: document.Estado,
              Codigo: document.Codigo,
              User: document.User,
              HistorialVendedor: document.HistorialVendedor,
              _id: document._id,
            };
          }),
        };
        res.render("facturacion/vendedor/pausar-activar", {
          vendedor: contex.vendedor,
        });
      });
  }
);
//ruta para activar vendedor

router.get(
  "/facturacion/activar-vendedor/:id",
  isAuthenticatedVendedor,
  async (req, res) => {
    let Estado = "Activo";

    await vendedorDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/pausar-activar-vendedor");
  }
);

//ruta para inactivar vendedor

router.get(
  "/facturacion/inactivar-vendedor/:id",
  isAuthenticatedVendedor,
  async (req, res) => {
    let Estado = "Inactivo";

    await vendedorDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/pausar-activar-vendedor");
  }
);

//ruta para editar stock
router.get(
  "/facturacion/stock-edit/:id",
  isAuthenticatedInventario,
  async (req, res) => {
    let Modelo;
    let Marca;

    await ModeloVehiculoDB.find()
      .sort({ date: -1 })
      .then((document) => {
        const contexto = {
          Modelo: document.map((document) => {
            return {
              Nombre: document.Nombre,
            };
          }),
        };
        Modelo = contexto.Modelo;
      });

    await MarcaVehiculoDB.find()
      .sort({ date: -1 })
      .then((document) => {
        const contexto = {
          Marca: document.map((document) => {
            return {
              Nombre: document.Nombre,
            };
          }),
        };
        Marca = contexto.Marca;
      });
      let proveedores = await proveedorDB.find().sort({"Empresa": 1})
      proveedores = proveedores.map((data) => {
        return{
          Empresa: data.Nombre,
        }
      })

    const stock = await stockDB.findOne({ _id: req.params.id }).then((data) => {
      return {
        date: data.date,
        FechaModificacion: data.FechaModificacion,
        TipoProducto: data.TipoProducto,
        Nombre: data.Nombre,
        Proveedor: data.Proveedor,
        CodigoT: data.CodigoT,
        CodigoG: data.CodigoG,
        CantidadTotal: data.CantidadTotal,
        CostoFOB: data.CostoFOB,
        Costo: data.Costo,
        CostoFOBTotal: data.CostoFOBTotal,
        CostoGranMayor: data.CostoGranMayor,
        CostoMayor: data.CostoMayor,
        CostoDetal: data.CostoDetal,
        CostoGranMayorTotal: data.CostoGranMayorTotal,
        CostoMayorTotal: data.CostoMayorTotal,
        CostoDetalTotal: data.CostoDetalTotal,
        User: data.User,
        Modelo: data.Modelo,
        Vehiculo: data.Vehiculo,
        Familia: data.Familia,
        Posicion: data.Posicion,
        Alto: data.Alto,
        Largo: data.Largo,
        Ancho: data.Ancho,
        Peso: data.Peso,
        Unidades: data.Unidades,
        Año: data.Año,
        Vehiculo: data.Vehiculo,
        _id: data._id,
      };
    });
    res.render("facturacion/inventario/stock-edit", {
      stock,
      Modelo,
      proveedores,
      Marca,
    });
  }
);

//ruta para actualizar datos de los productos

router.post( "/facturacion/stock-edited/:id", isAuthenticatedInventario, async (req, res) => {
    let {
      costoFOB,
      costo,
      costoGranMayor,
      costoMayor,
      costoDetal,
      CodigoG,
      CodigoT,
      Posicion,
      Vehiculo,
      Peso,
      Ancho,
      Proveedor,
      Alto,
      Largo,
      Unidades,
    } = req.body;

    CodigoG = CodigoG.toUpperCase();
    CodigoT = CodigoT.toUpperCase();
    Posicion = Posicion.toUpperCase();

    const stock = await stockDB.findById(req.params.id);
    const proveedor = await proveedorDB.findOne({ Nombre: stock.Proveedor });
    let Costo,
    CostoFOB = costoFOB;
    let CostoGranMayor;
    let CostoMayor;
    let CostoDetal;
    let CostoGranMayorTotal;
    let CostoMayorTotal;
    let CostoDetalTotal;
    let CostoFOBTotal;
    let CostoTotal;

    if (stock.CostoFOB != costoFOB ||stock.Costo != costo ||stock.CostoGranMayor != costoGranMayor ||stock.CostoMayor != costoMayor) {
      if (stock.CostoFOB != costoFOB) {
        Costo = (costoFOB / (1 - proveedor.Costo / 100)).toFixed(2);
        CostoGranMayor = (Costo / (1 - proveedor.GranMayor / 100)).toFixed(2);
        CostoMayor = (CostoGranMayor / (1 - +proveedor.Mayor / 100)).toFixed(2);
        CostoDetal = (CostoMayor / (1 - +proveedor.Detal / 100)).toFixed(2);

        CostoTotal = (Costo * stock.CantidadTotal).toFixed(2);
        CostoGranMayorTotal = (CostoGranMayor * stock.CantidadTotal).toFixed(2);
        CostoMayorTotal = (CostoMayor * stock.CantidadTotal).toFixed(2);
        CostoDetalTotal = (CostoDetal * stock.CantidadTotal).toFixed(2);
        CostoFOBTotal = (CostoFOB * stock.CantidadTotal).toFixed(2);

        await stockDB.findByIdAndUpdate(req.params.id, {
          Costo,
          CostoFOB,
          CostoGranMayor,
          CostoMayor,
          CostoDetal,
          CodigoG,
          CodigoT,
          Posicion, 
          Peso,
          Ancho,
          Proveedor,
          Alto,
          Largo,
          Unidades,
          CostoTotal,
          CostoGranMayorTotal,
          CostoMayorTotal,
          CostoDetalTotal,
          CostoFOBTotal,
          Vehiculo,
        });
      }
      if (stock.Costo != costo) {
        CostoGranMayor = (costo / (1 - proveedor.GranMayor / 100)).toFixed(2);
        CostoMayor = (CostoGranMayor / (1 - +proveedor.Mayor / 100)).toFixed(2);
        CostoDetal = (CostoMayor / (1 - +proveedor.Detal / 100)).toFixed(2);
        Costo = costo;

        CostoTotal = (Costo * stock.CantidadTotal).toFixed(2);
        CostoGranMayorTotal = (CostoGranMayor * stock.CantidadTotal).toFixed(2);
        CostoMayorTotal = (CostoMayor * stock.CantidadTotal).toFixed(2);
        CostoDetalTotal = (CostoDetal * stock.CantidadTotal).toFixed(2);
        CostoFOBTotal = (CostoFOB * stock.CantidadTotal).toFixed(2);

        await stockDB.findByIdAndUpdate(req.params.id, {
          Costo,
          CostoFOB,
          CostoGranMayor,
          CostoMayor,
          CostoDetal,
          CodigoG,
          CodigoT,
          Posicion,
          Peso,
          Ancho,
          Proveedor,
          Alto,
          Largo,
          Unidades,
          CostoTotal,
          CostoGranMayorTotal,
          CostoMayorTotal,
          CostoDetalTotal,
          CostoFOBTotal,
          Vehiculo,
        });
      }
      if (stock.CostoGranMayor != costoGranMayor) {
        Costo = costo;
        CostoGranMayor = costoGranMayor;
        CostoMayor = (costoGranMayor / (1 - +proveedor.Mayor / 100)).toFixed(2);
        CostoDetal = (CostoMayor / (1 - +proveedor.Detal / 100)).toFixed(2);

        CostoTotal = (Costo * stock.CantidadTotal).toFixed(2);
        CostoGranMayorTotal = (CostoGranMayor * stock.CantidadTotal).toFixed(2);
        CostoMayorTotal = (CostoMayor * stock.CantidadTotal).toFixed(2);
        CostoDetalTotal = (CostoDetal * stock.CantidadTotal).toFixed(2);
        CostoFOBTotal = (CostoFOB * stock.CantidadTotal).toFixed(2);

        await stockDB.findByIdAndUpdate(req.params.id, {
          Costo,
          CostoFOB,
          CostoGranMayor,
          CostoMayor,
          CostoDetal,
          CodigoG,
          CodigoT,
          Peso,
          Ancho,
          Proveedor,
          Alto,
          Largo,
          Unidades,
          Posicion,
          CostoTotal,
          CostoGranMayorTotal,
          CostoMayorTotal,
          CostoDetalTotal,
          CostoFOBTotal,
          Vehiculo,
        });
      }
      if (stock.CostoMayor != costoMayor) {
        Costo = costo;
        CostoGranMayor = costoGranMayor;
        CostoMayor = costoMayor;
        CostoDetal = (costoMayor / (1 - +proveedor.Detal / 100)).toFixed(2);

        CostoTotal = (Costo * stock.CantidadTotal).toFixed(2);
        CostoGranMayorTotal = (CostoGranMayor * stock.CantidadTotal).toFixed(2);
        CostoMayorTotal = (CostoMayor * stock.CantidadTotal).toFixed(2);
        CostoDetalTotal = (CostoDetal * stock.CantidadTotal).toFixed(2);
        CostoFOBTotal = (CostoFOB * stock.CantidadTotal).toFixed(2);

        await stockDB.findByIdAndUpdate(req.params.id, {
          CostoFOB,
          Costo,
          CostoGranMayor,
          CostoMayor,
          CostoDetal,
          CodigoG,
          Peso,
          Ancho,
          Proveedor,
          Alto,
          Largo,
          Unidades,
          CodigoT,
          Posicion,
          CostoTotal,
          CostoGranMayorTotal,
          CostoMayorTotal,
          CostoDetalTotal,
          CostoFOBTotal,
          Vehiculo,
        });
      }
    } else {
      Costo = costo;
      CostoFOB = costoFOB;
      CostoGranMayor = costoGranMayor;
      CostoMayor = costoMayor;
      CostoDetal = costoDetal;

      CostoTotal = (Costo * stock.CantidadTotal).toFixed(2);
      CostoGranMayorTotal = (CostoGranMayor * stock.CantidadTotal).toFixed(2);
      CostoMayorTotal = (CostoMayor * stock.CantidadTotal).toFixed(2);
      CostoDetalTotal = (CostoDetal * stock.CantidadTotal).toFixed(2);
      CostoFOBTotal = (CostoFOB * stock.CantidadTotal).toFixed(2);

      await stockDB.findByIdAndUpdate(req.params.id, {
        CostoFOB,
        Costo,
        CostoGranMayor,
        CostoMayor,
        CostoDetal,
        CodigoG,
        CodigoT,
        Posicion,
        Peso,
        Ancho,
        Proveedor,
        Alto,
        Largo,
        Unidades,
        CostoTotal,
        CostoGranMayorTotal,
        CostoMayorTotal,
        CostoDetalTotal,
        CostoFOBTotal,
        Vehiculo,
      });
    }
    const registrado = [{ _id: req.params.id }];
    res.send(JSON.stringify(registrado));
  }
);
//ruta para eliminar producto

router.delete(
  "/facturacion/stock-delete/:id",
  isAuthenticatedInventario,
  async (req, res) => {
    await stockDB.findByIdAndDelete(req.params.id);

    res.redirect("/facturacion/stock");
  }
);

//ruta para mostrar la descarga de los productos

router.get(
  "/facturacion/descargar-stock",
  isAuthenticatedInventario,
  async (req, res) => {
    await stockDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              CodigoT: document.CodigoT,
            };
          }),
        };
        res.render("facturacion/inventario/descargar-stock", {
          stock: contex.stock,
        });
      });
  }
);

//ruta para mostrar la descarga de los productos

router.get(
  "/facturacion/cargar-stock",
  isAuthenticatedInventario,
  async (req, res) => {
    await stockDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              CodigoT: document.CodigoT,
            };
          }),
        };
        res.render("facturacion/inventario/cargar-stock", {
          stock: contex.stock,
        });
      });
  }
);

//ruta para mostrar la carga de los productos

router.post(
  "/facturacion/descargar-stock",
  isAuthenticatedInventario,
  async (req, res) => {
    let { CodigoT, Cantidad, Comentario } = req.body;
    CodigoT = CodigoT.toUpperCase();
    let errors = [];
    let Timestamp = Date.now();
    Timestamp = Timestamp;
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

    const cantidadEnStock = await stockDB.findOne({ CodigoT: CodigoT });

    if (CodigoT == 0) {
      errors.push({ text: 'El campo "Codigo" no puede estar vacio' });
    }
    if (!Cantidad) {
      errors.push({ text: 'El campo "Cantidad" no puede estar vacio' });
    }
    if (!Comentario) {
      errors.push({ text: 'El campo "Comentario" no puede estar vacio' });
    }
    if (cantidadEnStock.CantidadTotal < Cantidad) {
      errors.push({
        text: `La cantidad a descargar no puede ser mayor
  al stock registrado ${cantidadEnStock.CantidadTotal}`,
      });
    }
    if (errors.length > 0) {
      await stockDB
        .find()
        .sort({ date: -1 })
        .then((document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
                HistorialMovimiento: document.HistorialMovimiento,
              };
            }),
          };
          let ok = [{ text: "Productos cargados correctamente" }];
          res.render("facturacion/inventario/descargar-stock", {
            stock: contex.stock,
            errors,
          });
        });
    } else {
      const cantidadStock = await stockDB
        .findOne({ CodigoT: CodigoT })
        .sort({ date: -1 });
      let cantidadAnterior = cantidadStock.CantidadTotal;
      let CantidadNueva = +cantidadStock.CantidadTotal - +Cantidad;
      let GranMayorTotal = (
        +cantidadStock.CostoGranMayor * +CantidadNueva
      ).toFixed(2);
      let MayorTotal = (+cantidadStock.CostoMayor * +CantidadNueva).toFixed(2);
      let DetalTotal = (+cantidadStock.CostoDetal * +CantidadNueva).toFixed(2);
      let CostoFOBTotal = (+cantidadStock.CostoFOB * +CantidadNueva).toFixed(2);
      let CostoTotal = (+cantidadStock.Costo * +CantidadNueva).toFixed(2);
      let CodigoMovimiento = 0;
      let TipoMovimiento = "DESCARGA";
      if (cantidadStock.HistorialMovimiento.length > 0) {
        if (
          cantidadStock.HistorialMovimiento[
            cantidadStock.HistorialMovimiento.length - 1
          ].CodigoMovimiento
        ) {
          CodigoMovimiento =
            +cantidadStock.HistorialMovimiento[
              cantidadStock.HistorialMovimiento.length - 1
            ].CodigoMovimiento + 1;
        } else {
          CodigoMovimiento += 2101;
        }
      } else {
        CodigoMovimiento += 2101;
      }

      const HistorialMovimiento = {
        FechaMovimiento: date,
        CantidadAnterior: cantidadAnterior,
        CantidadMovida: Cantidad,
        CantidadNueva: CantidadNueva,
        Comentario: Comentario,
        Timestamp: Timestamp,
        CodigoMovimiento: CodigoMovimiento,
        TipoMovimiento: TipoMovimiento,
      };

      await stockDB.findOneAndUpdate(
        { CodigoT: CodigoT },
        {
          FechaUltimoIngreso: date,
          CostoGranMayorTotal: GranMayorTotal,
          CostoMayorTotal: MayorTotal,
          CostoDetalTotal: DetalTotal,
          CostoFOBTotal: CostoFOBTotal,
          CostoTotal: CostoTotal,
          CantidadTotal: CantidadNueva,
          $push: { HistorialMovimiento: HistorialMovimiento },
        }
      );

      await stockDB
        .find()
        .sort({ date: -1 })
        .then((document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
              };
            }),
          };
          let ok = [{ text: "Productos descargados correctamente" }];
          res.render("facturacion/inventario/descargar-stock", {
            stock: contex.stock,
            ok,
          });
        });
    }
  }
);
//ruta para recibir datos de la carga
router.post(
  "/facturacion/cargar-stock",
  isAuthenticatedInventario,
  async (req, res) => {
    let { CodigoT, Cantidad, Comentario } = req.body;
    let errors = [];
    CodigoT = CodigoT.toUpperCase();
    let Timestamp = Date.now();
    Timestamp = Timestamp;

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

    if (CodigoT == 0) {
      errors.push({ text: 'El campo "Codigo" no puede estar vacio' });
    }
    if (!Cantidad) {
      errors.push({ text: 'El campo "Cantidad" no puede estar vacio' });
    }
    if (!Comentario) {
      errors.push({ text: 'El campo "Comentario" no puede estar vacio' });
    }
    if (errors.length > 0) {
      await stockDB
        .find()
        .sort({ date: -1 })
        .then((document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
              };
            }),
          };
          let ok = [{ text: "Productos cargados correctamente" }];
          res.render("facturacion/inventario/cargar-stock", {
            stock: contex.stock,
            errors,
          });
        });
    } else {
      const cantidadStock = await stockDB.findOne({ CodigoT: CodigoT });

      let cantidadAnterior = cantidadStock.CantidadTotal;
      let CantidadNueva = +cantidadStock.CantidadTotal + +Cantidad;
      let GranMayorTotal = (
        +cantidadStock.CostoGranMayor * +CantidadNueva
      ).toFixed(2);
      let MayorTotal = (+cantidadStock.CostoMayor * +CantidadNueva).toFixed(2);
      let DetalTotal = (+cantidadStock.CostoDetal * +CantidadNueva).toFixed(2);
      let CostoFOBTotal = (+cantidadStock.CostoFOB * +CantidadNueva).toFixed(2);
      let CostoTotal = (+cantidadStock.Costo * +CantidadNueva).toFixed(2);

      let CodigoMovimiento = 0;
      let TipoMovimiento = "CARGA";
      if (cantidadStock.HistorialMovimiento.length > 0) {
        if (
          cantidadStock.HistorialMovimiento[
            cantidadStock.HistorialMovimiento.length - 1
          ].CodigoMovimiento
        ) {
          CodigoMovimiento =
            +cantidadStock.HistorialMovimiento[
              cantidadStock.HistorialMovimiento.length - 1
            ].CodigoMovimiento + 1;
        } else {
          CodigoMovimiento += 2101;
        }
      } else {
        CodigoMovimiento += 2101;
      }

      const HistorialMovimiento = {
        FechaMovimiento: date,
        CantidadAnterior: cantidadAnterior,
        CantidadMovida: Cantidad,
        CantidadNueva: CantidadNueva,
        Comentario: Comentario,
        Timestamp: Timestamp,
        CodigoMovimiento: CodigoMovimiento,
        TipoMovimiento: TipoMovimiento,
      };

      await stockDB.findOneAndUpdate(
        { CodigoT: CodigoT },
        {
          FechaUltimoIngreso: date,
          CostoGranMayorTotal: GranMayorTotal,
          CostoMayorTotal: MayorTotal,
          CostoDetalTotal: DetalTotal,
          CostoFOBTotal: CostoFOBTotal,
          CostoTotal: CostoTotal,
          CantidadTotal: CantidadNueva,
          CantidadTotal: CantidadNueva,
          $push: { HistorialMovimiento: HistorialMovimiento },
        }
      );

      await stockDB
        .find()
        .sort({ date: -1 })
        .then((document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
              };
            }),
          };
          let ok = [{ text: "Productos cargados correctamente" }];
          res.render("facturacion/inventario/cargar-stock", {
            stock: contex.stock,
            ok,
          });
        });
    }
  }
);

//Post de registro de stock
router.post("/facturacion/registrar-stock",isAuthenticatedInventario,async (req, res) => {
    let {
      date,
      Vehiculo,
      TipoProducto,
      Nombre,
      CodigoT,
      CodigoG,
      CantidadTotal,
      PrecioTotal,
      CostoFOBTotal,
      Proveedor,
      Alto,
      Largo,
      Ancho,
      Unidades,
      Peso,
    } = req.body;
    let stock = await stockDB.findOne({CodigoT: CodigoT})

    if(stock){
      let error = "error";
      res.status(202).send(JSON.stringify(error));

    }else{
      TipoProducto = TipoProducto.toUpperCase();
      Nombre = Nombre.toUpperCase();
      CodigoT = CodigoT.toUpperCase();
      CodigoG = CodigoG.toUpperCase();
      
      const CostoFob = +Vehiculo[0].CostoM;
      const CostoFOB = CostoFob;
      const proveedor = await proveedorDB
      .findOne({ Nombre: Proveedor })
      .then((data) => {
        return {
          GranMayor: data.GranMayor,
          Mayor: data.Mayor,
          Detal: data.Detal,
          Costo: data.Costo,
        };
      });

      let Modelo = "";
    let TipoVehiculo;
    let Familia;
    let Posicion;
    let Año = "";
    let Timestamp = Date.now();
    Timestamp = Timestamp;
    if (Vehiculo.length > 1) {
      for (i = 0; i < Vehiculo.length; i++) {
        Modelo += Vehiculo[i].Modelo + " ";
        Año += Vehiculo[i].Desde + "-" + Vehiculo[i].Hasta + "  ";
      }
      TipoVehiculo = Vehiculo[0].TipoVehiculo;
      Familia = Vehiculo[0].Familia;
      Posicion = Vehiculo[0].Posicion;
    } else {
      Modelo = Vehiculo[0].Modelo;
      TipoVehiculo = Vehiculo[0].TipoVehiculo;
      Familia = Vehiculo[0].Familia;
      Posicion = Vehiculo[0].Posicion;
      Año = Vehiculo[0].Desde + "-" + Vehiculo[0].Hasta;
    }
    
    const Costo = (CostoFob / (1 - proveedor.Costo / 100)).toFixed(2);
    const CostoGranMayor = (Costo / (1 - proveedor.GranMayor / 100)).toFixed(2);
    const CostoMayor = (CostoGranMayor / (1 - +proveedor.Mayor / 100)).toFixed(
      2
      );
      const CostoDetal = (CostoMayor / (1 - +proveedor.Detal / 100)).toFixed(2);
      
      const CostoTotal = (
        (CostoFob / (1 - proveedor.Costo / 100)) *
        CantidadTotal
        ).toFixed(2);
        const CostoGranMayorTotal = (CostoGranMayor * CantidadTotal).toFixed(2);
        const CostoMayorTotal = (CostoMayor * CantidadTotal).toFixed(2);
        const CostoDetalTotal = (CostoDetal * CantidadTotal).toFixed(2);
        let User = req.user.email;
        
        const newStock = new stockDB({
          date,
          Vehiculo,
          TipoProducto,
          Nombre,
          CodigoT,
          CodigoG,
          CantidadTotal,
          PrecioTotal,
          CostoFOBTotal,
          CostoTotal,
          Costo,
          Proveedor,
          CostoFOB,
          CostoGranMayor,
          CostoMayor,
          CostoDetal,
          CostoGranMayorTotal,
          CostoMayorTotal,
          CostoDetalTotal,
          Modelo,
          TipoVehiculo,
          Familia,
          Posicion,
          Año,
          Timestamp,
          User,
          Alto,
          Largo,
          Ancho,
          Peso,
          Unidades,
    });
    
    await newStock.save();
    
    let ok = "ok";
    res.status(202).send(JSON.stringify(ok));
  }
  }
);
//ruta para editar datos del usuario vendedor
router.get(
  "/facturacion/cliente-edit-user/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    let cliente = await clienteDB.findById(req.params.id);
    const usuario = await usersDB
      .findOne({ email: cliente.email })
      .then((document) => {
        return {
          email: document.email,
          _id: document._id,
          password: document.password,
        };
      });
    usuario._id = req.params.id;
    res.render("facturacion/cliente/cliente-edit-user", {
      usuario,
    });
  }
);

//ruta para editar datos del usuario cliente
router.get(
  "/facturacion/vendedor-edit-user/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    let vendedor = await vendedorDB.findById(req.params.id);
    const usuario = await usersDB
      .findOne({ email: vendedor.email })
      .then((document) => {
        return {
          email: document.email,
          _id: document._id,
          password: document.password,
          _idVendedor: req.params.id
        };
      });
    res.render("facturacion/vendedor/vendedor-edit-user", {
      usuario,
    });
  }
);
//ruta para guardar datos del usuario cliente al editar
router.post(
  "/cliente-edited-user/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    let { email, emailconfirm, password, passwordconfirm } = req.body;
    let clienteEmail = await clienteDB.findById(req.params.id)
    clienteEmail = clienteEmail.email
    let emailEliminar = await usersDB.findOne({email:clienteEmail});
    emailEliminar = emailEliminar.email;
    let errors = [];
    if (!email) {
      errors.push({
        text: 'El campo "Correo electronico no puede estar vacio" no puede estar vacio',
      });
    }
    if (!emailconfirm) {
      errors.push({
        text: 'El campo "Cofirmar correo electronico" no puede estar vacio',
      });
    }
    if (!password) {
      errors.push({ text: 'El campo "Contraseña nueva" no puede estar vacio' });
    }
    if (!passwordconfirm) {
      errors.push({
        text: 'El campo "Confirmar contraseña nueva" no puede estar vacio',
      });
    }
    if (email != emailconfirm) {
      errors.push({ text: "Los correos electronicos ingresados no coinciden" });
    }
    if (password != passwordconfirm) {
      errors.push({ text: "Las contraseñas ingresadas no coinciden" });
    }

    if (errors.length > 0) {
      res.render("facturacion/cliente/cliente-edit-user", {
        email,
        emailconfirm,
        password,
        passwordconfirm,
      });
    } else {
      let cliente = await clienteDB.findById(req.params.id);
      let email2 = cliente.email.toString();
      const userconfirm = await usersDB.find({ email: email2 });
      if (userconfirm[0].email == email) {
        if (userconfirm[0].password == password) {
          let usuario = {
            email: userconfirm[0].email,
            password: userconfirm[0].password,
            _id: req.params.id,
          };
          let ok = [{ text: "No se registraron modificaciones" }];
          res.render("facturacion/cliente/cliente-edit-user", { ok, usuario });
          return;
        } else {
          let newUser = new usersDB({ password });
          newUser.password = await newUser.encryptPassword(password);
          password = newUser.password;
          await usersDB.findOneAndUpdate(
            { email: email },
            {
              password,
            }
          );
          let ok = [{ text: "Usuario cliente actualizado correctamente" }];
          let usuario = {
            email: email,
            password: password,
            _id: req.params.id,
          };
          await solicitudesRecuperacionContrasenaDB.findOneAndDelete({
            email: emailEliminar,
          });
          res.render("facturacion/cliente/cliente-edit-user", { usuario, ok });
          return;
        }
      } else {
        if (userconfirm[0].password == password) {
          await usersDB.findOneAndUpdate(
            { email: cliente.email },
            {
              email,
            }
          );
          await clienteDB.findByIdAndUpdate(req.params.id, {
            email,
          });
          await solicitudesRecuperacionContrasenaDB.findOneAndDelete({
            email: emailEliminar,
          });

          let ok = [{ text: "Usuario cliente actualizado correctamente" }];
          let usuario = {
            email: email,
            password: userconfirm[0].password,
            _id: req.params.id,
          };
          res.render("facturacion/cliente/cliente-edit-user", { usuario, ok });
          return;
        } else {
          let newUser = new usersDB({ password });
          newUser.password = await newUser.encryptPassword(password);
          password = newUser.password;
          await usersDB.findOneAndUpdate(
            { email: cliente.email },
            {
              email,
              password,
            }
          );
          await clienteDB.findByIdAndUpdate(req.params.id, {
            email,
          });
          await solicitudesRecuperacionContrasenaDB.findOneAndDelete({
            email: emailEliminar,
          });

          let ok = [{ text: "Usuario cliente actualizado correctamente" }];
          let usuario = {
            email: email,
            password: password,
            _id: req.params.id,
          };
          res.render("facturacion/cliente/cliente-edit-user", { usuario, ok });
          return;
        }
      }
    }
  }
);

//ruta para guardar datos del usuario vendedor al editar
router.post(
  "/vendedor-edited-user/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    let { email, emailconfirm, password, passwordconfirm } = req.body;
    let errors = [];
    if (!email) {
      errors.push({
        text: 'El campo "Correo electronico no puede estar vacio" no puede estar vacio',
      });
    }
    if (!emailconfirm) {
      errors.push({
        text: 'El campo "Cofirmar correo electronico" no puede estar vacio',
      });
    }
    if (!password) {
      errors.push({ text: 'El campo "Contraseña nueva" no puede estar vacio' });
    }
    if (!passwordconfirm) {
      errors.push({
        text: 'El campo "Confirmar contraseña nueva" no puede estar vacio',
      });
    }
    if (email != emailconfirm) {
      errors.push({ text: "Los correos electronicos ingresados no coinciden" });
    }
    if (password != passwordconfirm) {
      errors.push({ text: "Las contraseñas ingresadas no coinciden" });
    }

    if (errors.length > 0) {
      res.render("facturacion/vendedor/vendedor-edit-user", {
        email,
        emailconfirm,
        password,
        passwordconfirm,
      });
    } else {
      let vendedor = await vendedorDB.findById(req.params.id);
      let email2 = vendedor.email.toString();
      const userconfirm = await usersDB.find({ email: email2 });
      if (userconfirm[0].email == email) {
        if (userconfirm.password == password) {
          let usuario = {
            email: userconfirm[0].email,
            password: userconfirm[0].password,
            _id: req.params.id,
          };
          let ok = [{ text: "No se registraron modificaciones" }];
          res.render("facturacion/vendedor/vendedor-edit-user", {
            ok,
            usuario,
          });
          return;
        } else {
          let newUser = new usersDB({ password });
          newUser.password = await newUser.encryptPassword(password);
          password = newUser.password;
          await usersDB.findOneAndUpdate(
            { email: email },
            {
              password,
            }
          );
          let ok = [{ text: "Usuario vendedor actualizado correctamente" }];
          let usuario = {
            email: email,
            password: password,
            _id: req.params.id,
          };
          res.render("facturacion/vendedor/vendedor-edit-user", {
            usuario,
            ok,
          });
          return;
        }
      } else {
        if (userconfirm[0].password == password) {
          await usersDB.findOneAndUpdate(
            { email: vendedor.email },
            {
              email,
            }
          );
          await vendedorDB.findByIdAndUpdate(req.params.id, {
            email,
          });
          let ok = [{ text: "Usuario vendedor actualizado correctamente" }];
          let usuario = {
            email: email,
            password: userconfirm[0].password,
            _id: req.params.id,
          };
          res.render("facturacion/vendedor/vendedor-edit-user", {
            usuario,
            ok,
          });
          return;
        } else {
          let newUser = new usersDB({ password });
          newUser.password = await newUser.encryptPassword(password);
          password = newUser.password;
          await usersDB.findOneAndUpdate(
            { email: vendedor.email },
            {
              email,
              password,
            }
          );
          await vendedorDB.findByIdAndUpdate(req.params.id, {
            email,
          });
          let ok = [{ text: "Usuario vendedor actualizado correctamente" }];
          let usuario = {
            email: email,
            password: password,
            _id: req.params.id,
          };
          res.render("facturacion/vendedor/vendedor-edit-user", {
            usuario,
            ok,
          });
          return;
        }
      }
    }
  }
);

//Ruta de clientes
router.get(
  "/facturacion/clientes",
  isAuthenticatedCliente,
  async (req, res) => {
    await clienteDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          cliente: document.map((document) => {
            return {
              date: document.date,
              FechaModificacion: document.FechaModificacion,
              Nombres: document.Nombres,
              Apellidos: document.Apellidos,
              Cedula: document.Cedula,
              Empresa: document.Empresa,
              Direccion: document.Direccion,
              Rif: document.rif,
              Telefono: document.Telefono,
              Celular: document.Celular,
              Codigo: document.Codigo,
              User: document.User,
              _id: document._id,
            };
          }),
        };
        res.render("facturacion/cliente/clientes", {
          cliente: contex.cliente,
        });
      });
  }
);
//ruta para editar clientes
router.get(
  "/facturacion/cliente-edit/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    let vendedor;
    await vendedorDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contexto = {
          vendedor: document.map((document) => {
            return {
              Username: document.Username,
            };
          }),
        };
        vendedor = contexto.vendedor;
      });

    const cliente = await clienteDB
      .findOne({ _id: req.params.id })
      .then((data) => {
        return {
          date: data.date,
          FechaModificacion: data.FechaModificacion,
          Nombres: data.Nombres,
          Apellidos: data.Apellidos,
          Cedula: data.Cedula,
          Empresa: data.Empresa,
          Direccion: data.Direccion,
          Rif: data.Rif,
          Telefono: data.Telefono,
          Celular: data.Celular,
          Codigo: data.Codigo,
          email: data.email,
          _id: data._id,
          TipoPrecio: data.TipoPrecio,
          Vendedor: data.Vendedor,
        };
      });
    res.render("facturacion/cliente/cliente-edit", {
      cliente,
      vendedor,
    });
  }
);
//ruta para guardar la edicion del cliente
router.put(
  "/facturacion/cliente-edited/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    const {
      Nombres,
      Apellidos,
      Cedula,
      Empresa,
      Direccion,
      Rif,
      Telefono,
      Celular,
      Vendedor,
      TipoPrecio,
    } = req.body;

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
    let FechaModificacion = `${año}-${mes}-${dia}`;

    await clienteDB.findByIdAndUpdate(req.params.id, {
      Nombres,
      FechaModificacion,
      Apellidos,
      Cedula,
      Empresa,
      Direccion,
      Rif,
      Telefono,
      Celular,
      Vendedor,
      TipoPrecio,
    });

    res.redirect("/facturacion/clientes");
  }
);
//ruta para eliminar cliente

router.delete(
  "/facturacion/cliente-delete/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    await clienteDB.findByIdAndDelete(req.params.id);
    res.redirect("/facturacion/clientes");
  }
);
//Ruta de vendedores
router.get(
  "/facturacion/vendedores",
  isAuthenticatedVendedor,
  async (req, res) => {
    await vendedorDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          vendedor: document.map((document) => {
            return {
              date: document.date,
              FechaModificacion: document.FechaModificacion,
              Nombres: document.Nombres,
              Apellidos: document.Apellidos,
              Cedula: document.Cedula,
              Celular: document.Celular,
              Direccion: document.Direccion,
              Zona: document.Zona,
              Codigo: document.Codigo,
              User: document.User,
              Porcentaje: document.Porcentaje,
              _id: document._id,
              Username: document.Username,
            };
          }),
        };
        res.render("facturacion/vendedor/vendedores", {
          vendedor: contex.vendedor,
        });
      });
  }
);

//Ruta de reporte vendedores
router.get("/facturacion/reporte-vendedores",isAuthenticatedVendedor,async (req, res) => {
    let Vendedores = await vendedorDB.find().sort({"Username": 1})
    Vendedores = Vendedores.map((data) => {
      return{
        Vendedor: data.Username
      }
    })
    res.render("facturacion/vendedor/reporte", {
      Vendedores
    });
});

//Ruta de crear proveedor
router.get(
  "/facturacion/crear-proveedor",
  isAuthenticatedProveedor,
  (req, res) => {
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
    res.render("facturacion/proveedor/crear", {
      date,
    });
  }
);

//ruta para ver ordenes de clientes

router.get("/facturacion/ordenes-compra",isAuthenticatedFacturacion,async (req, res) => {
    let ordenes = await ordenesClientesDB.find({Estado: "En proceso"}) 
    let cantidadTotal = 0
    let precioTotal = 0
    for(i=0; i< ordenes.length; i++){
      let cliente = await clienteDB.findOne({email: ordenes[i].email})
      ordenes[i].email = cliente.Empresa
      cantidadTotal += +ordenes[i].CantidadTotal
      precioTotal += +ordenes[i].PrecioTotal
    }
    ordenes = ordenes.map((data) => {
      return{
        Timestamp: data.Timestamp,
        date: data.date,
        email: data.email,
        OrdenNumero: data.OrdenNumero,
        NumeroFactura: data.NumeroFactura,
        TipoPrecio: data.TipoPrecio,
        Estado: data.Estado,
        Productos: data.Productos,
        CantidadTotal: data.CantidadTotal,
        PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
        ProductosAtendidos: data.ProductosAtendidos,
        CantidadTotalAtendida: data.CantidadTotalAtendida,
        PrecioTotalAtendido: data.PrecioTotalAtendido,
        Vendedor: data.Vendedor,
        _id: data._id,
      }
    })
    precioTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(precioTotal)
    res.render("facturacion/facturacion/ordenes-compra",{
      ordenes,
      cantidadTotal,
      precioTotal
    });
});
//cambiar estado de orden cliente

router.post("/cambiar-estado-orden",isAuthenticatedFacturacion,async (req, res) => {
    let {_idOrden} = req.body 
    let Estado = "Procesado";
    let cantidad = await cantidadOrdenesDB.find()
    let _id = cantidad[0]._id
    cantidad = cantidad[0].Cantidad 
    cantidad = +cantidad - 1
    await cantidadOrdenesDB.findByIdAndUpdate(_id,{
      Cantidad:cantidad,
    })

    await ordenesClientesDB.findByIdAndUpdate(_idOrden, {
      Estado,
    });

    res.send(JSON.stringify("ok"))
  }
);

//ruta para ver detalles de compra

router.get(
  "/ver-orden-cliente/:id",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let ordenes = await ordenesClientesDB.findById(req.params.id);
    let cliente = await clienteDB.findOne({ email: ordenes.email });

    ordenes.Cliente = cliente.Empresa;
    let date = ordenes.date,
      Cliente = ordenes.Cliente,
      CantidadTotal = ordenes.CantidadTotal,
      OrdenNumero = ordenes.OrdenNumero,
      Estado = ordenes.Estado,
      PrecioTotal = ordenes.PrecioTotal;

    let productos = ordenes.Productos.map((data) => {
      return {
        CodigoT: data.CodigoT,
        CodigoG: data.CodigoG,
        TipoProducto: data.TipoProducto,
        Descripcion: data.Descripcion,
        Posicion: data.Posicion,
        Modelo: data.Modelo,
        Cantidad: data.Cantidad,
        PrecioUnidad: data.PrecioUnidad,
        PrecioTotal: data.PrecioTotal,
      };
    });

    res.render("facturacion/reporte_pdf/ver-ordenes", {
      productos,
      date,
      Cliente,
      CantidadTotal,
      OrdenNumero,
      Estado,
      PrecioTotal,
    });
  }
);

//ruta para generar factura de orden

router.get(
  "/generar-factura-orden/:id",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let orden = await ordenesClientesDB.findById(req.params.id);
    let cliente = await clienteDB.findOne({ email: orden.email });

    if (orden.Estado != "Procesado") {
      let errors = [
        {
          text: `Para generar la factura de la orden ${orden.OrdenNumero} debe cambiar el estado de la misma a "Procesado"`,
        },
      ];
      let ordenes = await ordenesClientesDB.find();

      for (i = 0; i < ordenes.length; i++) {
        let cliente = await clienteDB.findOne({ email: ordenes[i].email });
        ordenes[i].Cliente = cliente.Empresa;
      }

      ordenes = ordenes.map((data) => {
        return {
          Timestamp: data.Timestamp,
          date: data.date,
          email: data.email,
          OrdenNumero: data.OrdenNumero,
          TipoPrecio: data.TipoPrecio,
          Estado: data.Estado,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal: data.PrecioTotal,
          _id: data._id,
          Cliente: data.Cliente,
        };
      });
      res.render("facturacion/facturacion/ordenes-compra", {
        ordenes,
        errors,
      });
    } else {
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
      let transporte = await transporteDB.find();
      transporte = transporte.map((data) => {
        return {
          Username: data.Username,
        };
      });
      let date = `${año}-${mes}-${dia}`;
      let ordenNumero = orden.OrdenNumero;
      let Cliente = cliente.Empresa;
      let Vendedor = cliente.Vendedor;
      res.render("facturacion/facturacion/factura-rapida", {
        ordenNumero,
        date,
        Cliente,
        Vendedor,
        transporte,
      });
    }
  }
);

//ruta para enviar info de la orden a facturar

router.post(
  "/info-orden-facturar/:id",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let orden = await ordenesClientesDB.findOne({ OrdenNumero: req.params.id });
    let CantidadTotalSolicitada = 0;
    let CantidadSolicitadaFueraStock = 0;
    let CantidadAtender = 0;
    let PrecioTotal = orden.PrecioTotal;
    let PrecioTotalAtendible = 0;
    let Orden = [];
    for (x = 0; x < orden.Productos.length; x++) {
      let stock = await stockDB.findOne({
        CodigoT: orden.Productos[x].CodigoT,
      });
      if (stock.CantidadTotal < orden.Productos[x].Cantidad) {
        //la cantidad solicitada es mayor a la del stock
        if (stock.CantidadTotal == 0) {
          //no hay stock
          CantidadTotalSolicitada =
            +CantidadTotalSolicitada + +orden.Productos[x].Cantidad;
          CantidadSolicitadaFueraStock =
            +CantidadSolicitadaFueraStock + +orden.Productos[x].Cantidad;
          let producto = {
            CodigoT: orden.Productos[x].CodigoT,
            CodigoG: orden.Productos[x].CodigoG,
            TipoProducto: orden.Productos[x].TipoProducto,
            Descripcion: orden.Productos[x].Descripcion,
            Posicion: orden.Productos[x].Posicion,
            Modelo: orden.Productos[x].Modelo,
            CantidadSolicitada: orden.Productos[x].Cantidad,
            PrecioUnidad: orden.Productos[x].PrecioUnidad,
            PrecioTotal: (+orden.Productos[x].PrecioUnidad * 0).toFixed(2),
            CantidadAtendible: 0,
            CantidadStock: 0,
            Clase: "text-danger",
          };
          Orden.push(producto);
        } else {
          //Hay stock
          CantidadTotalSolicitada =
            +CantidadTotalSolicitada + +orden.Productos[x].Cantidad;
          let cantidadIterar =
            +orden.Productos[x].Cantidad - +stock.CantidadTotal;
          CantidadSolicitadaFueraStock =
            +CantidadSolicitadaFueraStock + +cantidadIterar;
          CantidadAtender = +CantidadAtender + +stock.CantidadTotal;

          let producto = {
            CodigoT: orden.Productos[x].CodigoT,
            CodigoG: orden.Productos[x].CodigoG,
            TipoProducto: orden.Productos[x].TipoProducto,
            Descripcion: orden.Productos[x].Descripcion,
            Posicion: orden.Productos[x].Posicion,
            Modelo: orden.Productos[x].Modelo,
            CantidadSolicitada: orden.Productos[x].Cantidad,
            PrecioUnidad: orden.Productos[x].PrecioUnidad,
            PrecioTotal: (
              +orden.Productos[x].PrecioUnidad * +stock.CantidadTotal
            ).toFixed(2),
            CantidadAtendible: stock.CantidadTotal,
            CantidadStock: stock.CantidadTotal,
            Clase: "text-danger",
          };
          Orden.push(producto);
        }
      }
      if (stock.CantidadTotal == orden.Productos[x].Cantidad) {
        //la cantidad de stock es igual a la solicitada
        CantidadTotalSolicitada =
          +CantidadTotalSolicitada + +orden.Productos[x].Cantidad;
        CantidadAtender = +CantidadAtender + +stock.CantidadTotal;
        let producto = {
          CodigoT: orden.Productos[x].CodigoT,
          CodigoG: orden.Productos[x].CodigoG,
          TipoProducto: orden.Productos[x].TipoProducto,
          Descripcion: orden.Productos[x].Descripcion,
          Posicion: orden.Productos[x].Posicion,
          Modelo: orden.Productos[x].Modelo,
          CantidadSolicitada: orden.Productos[x].Cantidad,
          PrecioUnidad: orden.Productos[x].PrecioUnidad,
          PrecioTotal: (
            +orden.Productos[x].PrecioUnidad * +stock.CantidadTotal
          ).toFixed(2),
          CantidadAtendible: stock.CantidadTotal,
          CantidadStock: stock.CantidadTotal,
          Clase: "text-warning",
        };
        Orden.push(producto);
      }
      if (stock.CantidadTotal > orden.Productos[x].Cantidad) {
        //la cantidad en stock supera a la solicitada
        CantidadTotalSolicitada =
          +CantidadTotalSolicitada + +orden.Productos[x].Cantidad;
        CantidadAtender = +CantidadAtender + +orden.Productos[x].Cantidad;
        let producto = {
          CodigoT: orden.Productos[x].CodigoT,
          CodigoG: orden.Productos[x].CodigoG,
          TipoProducto: orden.Productos[x].TipoProducto,
          Descripcion: orden.Productos[x].Descripcion,
          Posicion: orden.Productos[x].Posicion,
          Modelo: orden.Productos[x].Modelo,
          CantidadSolicitada: orden.Productos[x].Cantidad,
          PrecioUnidad: orden.Productos[x].PrecioUnidad,
          PrecioTotal: (
            +orden.Productos[x].PrecioUnidad * +orden.Productos[x].Cantidad
          ).toFixed(2),
          CantidadAtendible: orden.Productos[x].Cantidad,
          CantidadStock: stock.CantidadTotal,
          Clase: "text-success",
        };
        Orden.push(producto);
      }
    }

    let data = {
      orden: Orden,
      CantidadTotalSolicitada: CantidadTotalSolicitada,
      CantidadSolicitadaFueraStock: CantidadSolicitadaFueraStock,
      CantidadAtender: CantidadAtender,
      PrecioTotal: PrecioTotal,
    };
    res.send(JSON.stringify(data));
  }
);

//Ruta de crear proveedor
router.post(
  "/facturacion/registrar-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    let {
      date,
      Nombre,
      Pais,
      Estado,
      Direccion,
      Postal,
      Costo,
      GranMayor,
      Mayor,
      Detal,
      Telefono,
      email,
      PaginaWeb,
      Nota
    } = req.body;

    Nombre = Nombre.toUpperCase();
    Pais = Pais.toUpperCase();
    Estado = Estado.toUpperCase();
    Direccion = Direccion.toUpperCase();

    const date2 = date;

    const Codigo = Pais.substr(0, 2) + "-" + Postal + "-" + Estado.substr(0, 2);
    let errors = [];
    let ok = [];

    if (!date) {
      errors.push({
        text: 'El campo "Fecha de registro" no puede estar vacío',
      });
    }
    if (!Nombre) {
      errors.push({ text: 'El campo "Nombre" no puede estar vacío' });
    }
    if (Pais == 0) {
      errors.push({ text: 'El campo "País" no puede estar vacío' });
    }
    if (!Estado) {
      errors.push({
        text: 'El campo "Estado o provincia" no puede estar vacío',
      });
    }
    if (!Direccion) {
      errors.push({ text: 'El campo "Dirección" no puede estar vacío' });
    }
    if (!Postal) {
      errors.push({
        text: 'El campo "Fecha de registro" no puede estar vacío',
      });
    }
    if (!Costo) {
      errors.push({
        text: 'El campo "Costo" no puede estar vacío',
      });
    }
    if (!GranMayor) {
      errors.push({
        text: 'El campo "Gran mayor" no puede estar vacío',
      });
    }
    if (!Mayor) {
      errors.push({
        text: 'El campo "Mayor" no puede estar vacío',
      });
    }
    if (!Detal) {
      errors.push({
        text: 'El campo "Detal" no puede estar vacío',
      });
    }
    const validacion = await proveedorDB.findOne({ Nombre: Nombre });

    if (validacion) {
      errors.push({
        text: "Ya se encuentra registrado un proveedor con ese nombre",
      });
    }
    if (errors.length > 0) {
      res.render("facturacion/proveedor/crear", {
        errors,
        date,
        Nombre,
        Pais,
        Estado,
        Direccion,
        Postal,
      });
    } else {
      const newProveedor = new proveedorDB({
        date,
        Nombre,
        Pais,
        Estado,
        Direccion,
        Postal,
        Codigo,
        GranMayor,
        Costo,
        Mayor,
        Detal,
        date2,
        Telefono,
        email,
        PaginaWeb,
        Nota

      });
      await newProveedor.save();
      ok.push({ text: "Proveedor registrado correctamente" });
      res.render("facturacion/proveedor/crear", {
        ok,
      });
    }
  }
);

//Ruta de ver y editar proveedors
router.get("/facturacion/editar-proveedor",isAuthenticatedProveedor,async (req, res) => {
    await proveedorDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          proveedor: document.map((document) => {
            return {
              date: document.date,
              FechaModificacion: document.FechaModificacion,
              Nombre: document.Nombre,
              Pais: document.Pais,
              Estado: document.Estado,
              Direccion: document.Direccion,
              Postal: document.Postal,
              Codigo: document.Codigo,
              GranMayor: document.GranMayor,
              Costo: document.Costo,
              Mayor: document.Mayor,
              Detal: document.Detal,
              date2: document.date2,
              _id: document._id,
              email: document.email,
              telefono: document.telefono,
              paginaWeb: document.paginaWeb,
              Nota: document.Nota,
            };
          }),
        };
        res.render("facturacion/proveedor/editar", {
          proveedor: contex.proveedor,
        });
      });
  }
);

//ruta para cargar edit
router.get(
  "/facturacion/proveedor-edit/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    const proveedor = await proveedorDB
      .findOne({ _id: req.params.id })
      .then((data) => {
        return {
          Nombre: data.Nombre,
          Direccion: data.Direccion,
          Pais: data.Pais,
          Estado: data.Estado,
          Postal: data.Postal,
          Costo: data.Costo,
          GranMayor: data.GranMayor,
          Mayor: data.Mayor,
          Detal: data.Detal,
          _id: data._id,
          email: data.email,
          Telefono: data.Telefono,
          PaginaWeb: data.PaginaWeb,
          Nota: data.Nota,
        };
      });
    res.render("facturacion/proveedor/edit-proveedor", {
      proveedor,
    });
  }
);
//ruta para editar proveedor
router.put(
  "/facturacion/proveedor-edited/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    const {
      Nombre,
      Pais,
      Estado,
      Direccion,
      Postal,
      GranMayor,
      Costo,
      Mayor,
      Detal,
      email,
      Telefono,
      PaginaWeb,
      Nota,
    } = req.body;

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
    let FechaModificacion = `${año}-${mes}-${dia}`;

    await proveedorDB.findByIdAndUpdate(req.params.id, {
      Nombre,
      Pais,
      Estado,
      Direccion,
      Postal,
      GranMayor,
      Mayor,
      Costo,
      Detal,
      FechaModificacion,
      email,
      Telefono,
      PaginaWeb,
      Nota,
    });

    res.redirect("/facturacion/editar-proveedor");
  }
);

//ruta para delete proveedor
router.delete(
  "/facturacion/proveedor-delete/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    await proveedorDB.findByIdAndDelete(req.params.id);

    res.redirect("/facturacion/editar-proveedor");
  }
);
//ruta para delete proveedor
router.delete(
  "/facturacion/usuario-cliente-delete/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    await pendientesDB.findByIdAndDelete(req.params.id);

    res.redirect("/facturacion/aprobar-usuarios");
  }
);

//Ruta de facturas
router.get("/facturacion/facturas", isAuthenticatedFacturacion, (req, res) => {
  res.render("facturacion/facturacion/facturas");
});
//Ruta de aprobar usuarios
router.get(
  "/facturacion/aprobar-usuarios",
  isAuthenticatedCliente,
  async (req, res) => {
    await pendientesDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          pendientes: document.map((document) => {
            return {
              date: document.date,
              Empresa: document.Empresa,
              Rif: document.Rif,
              Direccion: document.Direccion,
              Nombres: document.Nombres,
              Apellidos: document.Apellidos,
              Telefono: document.Telefono,
              Celular: document.Celular,
              email: document.email,
              _id: document._id,
            };
          }),
        };
        res.render("facturacion/cliente/aprobar-usuarios", {
          pendientes: contex.pendientes,
        });
      });
  }
);

//vista de aprobar o rechazar usuario
router.get(
  "/facturacion/pausar-activar-cliente",
  isAuthenticatedCliente,
  async (req, res) => {
    await usersDB
      .find({ Role: "Cliente" })
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          usuarios: document.map((document) => {
            return {
              date: document.date,
              Responsable: document.Responsable,
              Email: document.email,
              Estado: document.Estado,
              _id: document._id,
            };
          }),
        };
        res.render("facturacion/cliente/pausar-activar", {
          usuarios: contex.usuarios,
        });
      });
  }
);
//ruta para activar estado de usuario cliente
router.get(
  "/facturacion/activar-cliente/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    const Estado = "Activo";

    await usersDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/pausar-activar-cliente");
  }
);
//ruta para pausar estado de usuario cliente
router.get(
  "/facturacion/inactivar-cliente/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    const Estado = "Inactivo";

    await usersDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/pausar-activar-cliente");
  }
);

//vista de aprobacion de usuario
router.get(
  "/facturacion/pendiente-edit/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    const id = req.params.id;
    let vendedores = await vendedorDB.find().sort({"Username":1})
    vendedores = vendedores.map((data) => {
      return{
        Username: data.Username
      }
    })

    const pendientes = await pendientesDB.findOne({ _id: id }).then((data) => {
      return {
        date: data.date,
        Empresa: data.Empresa,
        Rif: data.Rif,
        Direccion: data.Direccion,
        Nombres: data.Nombres,
        Apellidos: data.Apellidos,
        Telefono: data.Telefono,
        Celular: data.Celular,
        email: data.email,
        _id: data._id,
      };
    });

    res.render("facturacion/cliente/pendiente-edit", {
      pendientes,
      vendedores
    });
  }
);

//Recibiendo informacion de aprobacion de usuario

router.put(
  "/facturacion/pendiente-edited/:id",
  isAuthenticatedCliente,
  async (req, res) => {
    const {
        Empresa,
        Rif,
        Direccion,
        Nombres,
        Apellidos,
        Telefono,
        Celular,
        email,
        TipoPrecio,
        Vendedor
      } = req.body,
      id = req.params.id,
      Role = "Client",
      Estado = "Activo";
    Responsable = Empresa;
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
    if(!Vendedor || Vendedor == 0){
      req.flash("error","Debe seleccionar un vendedor")
      res.redirect(`/facturacion/pendiente-edit/${req.params.id}`)
      return
    }
    if(TipoPrecio == 0){
      req.flash("error","Debe elegir un tipo de precio")
      res.redirect(`/facturacion/pendiente-edit/${req.params.id}`)
    }else{

      
      //Guardando en la base de clientes
      const newCliente = new clienteDB({
        date,
        Empresa,
        Rif,
        Direccion,
        Nombres,
        Apellidos,
        Telefono,
        Celular,
        email,
        TipoPrecio,
        Vendedor,
      });

      await newCliente.save();
      
    //Cambiando el role del usario cliente
    await usersDB.findOneAndUpdate(
      { email: email },
      {
        Role,
        Estado,
        Responsable,
        Nombres,
        Apellidos,
        TipoPrecio,
      }
      );
      
      // Eliminando de la base de mendientes
      await pendientesDB.findByIdAndDelete(id);
      
      res.redirect("/facturacion/aprobar-usuarios");
    }
  }
);

//Ruta del dashboard
router.get("/facturacion/dashboard",isAuthenticatedDashboard,async (req, res) => {
    res.render("facturacion/dashboard");
  });

//datos de estadisticas
router.post('/estadisticas-datos', async (req, res) => {
  let contador = await contadorDB.find()
  let contadorClientes = await clienteDB.find()
  contadorClientes = contadorClientes.length
  let contadorFacturas = await facturaDB.find()
  contadorFacturas = contadorFacturas.length
  let contadorOrden = await ordenesClientesDB.find()
  contadorOrden = contadorOrden.length
  let amortiguadoresGeneral = await amortiguadoresGeneralDB.find()
  let basesGeneral = await basesGeneralDB.find()
  let bootsGeneral = await bootsGeneralDB.find()
  let valorGeneralUtilidades = await valorGeneralUtilidadesDB.find()
  let valorFacturadoGranMayor = await valorFacturasGranMayorDB.find()
  let valorFacturadoMayor = await valorFacturasMayorDB.find()
  let valorFacturadoDetal = await valorFacturasDetalDB.find()
  let libroContables = await libroContableDB.find()
  let valorGeneralFacturado = []
  let valor = 0
  for(i=0; i< libroContables.length; i++){
    valor += +libroContables[i].TotalGeneral
  }
  let total = {
      valor
  }
  valorGeneralFacturado.push(total)
  let data = {
    contador,
    contadorClientes,
    contadorFacturas,
    contadorOrden,
    amortiguadoresGeneral,
    basesGeneral,
    bootsGeneral,
    valorGeneralFacturado,
    valorGeneralUtilidades,
    valorFacturadoGranMayor,
    valorFacturadoMayor,
    valorFacturadoDetal,

  }

  res.send(JSON.stringify(data))


})

//enviar info a las graficas del dashnoard

router.post("/estadisticas-empresa", isAuthenticatedDashboard, async (req, res) => {
  let facturadoPorMes = await facturadoPorMesDB.find().sort({NumeroMes: 1})
  let utilidadesPorMes = await utilidadesPorMesDB.find().sort({NumeroMes: 1})
  let amortiguadoresPorMes = await amortiguadoresPorMesDB.find().sort({NumeroMes: 1})
  let basesPorMes = await basesPorMesDB.find().sort({NumeroMes: 1})
  let bootsPorMes = await bootsPorMesDB.find().sort({NumeroMes: 1})
  let libroContable = await libroContableDB.find().sort({Anio: -1, NumeroMes: 1})


  let mesFacturas = []
  let valorFacturas = []
  let mesUtilidades = []
  let valorUtilidades = []
  let mesAmortiguador = []
  let cantidadAmortiguador = []
  let mesBases = []
  let cantidadBases = []
  let mesBoots = []
  let cantidadBoots = []

  for(i=0; i < libroContable.length; i++){
    let validacion = mesFacturas.find((data) => data == libroContable.Mes)
     if(!validacion){
      mesFacturas.push(libroContable[i].Mes)
      valorFacturas.push(libroContable[i].TotalGeneral)
     }
  }

  for(i=0; i< utilidadesPorMes.length; i++){
    mesUtilidades.push(utilidadesPorMes[i].Mes)
    valorUtilidades.push(utilidadesPorMes[i].valor.toFixed(2))

  } 
  for(i=0; i< amortiguadoresPorMes.length; i++){
    mesAmortiguador.push(amortiguadoresPorMes[i].Mes)
    cantidadAmortiguador.push(amortiguadoresPorMes[i].Cantidad)


  } 
  for(i=0; i< basesPorMes.length; i++){
    mesBases.push(basesPorMes[i].Mes)
    cantidadBases.push(basesPorMes[i].Cantidad)
  } 
  for(i=0; i< bootsPorMes.length; i++){
    mesBoots.push(bootsPorMes[i].Mes)
    cantidadBoots.push(bootsPorMes[i].Cantidad)
  } 


 let data = {
  mesFacturas,
  valorFacturas,
  mesUtilidades,
  valorUtilidades,
  mesAmortiguador,
  cantidadAmortiguador,
  mesBases,
  cantidadBases,
  mesBoots,
  cantidadBoots,
 }
 res.send(JSON.stringify(data))

});

//rutar para cargar vista para editar vendedores

router.get(
  "/facturacion/vendedor-edit/:id",
  isAuthenticatedVendedor,
  async (req, res) => {
    const vendedor = await vendedorDB
      .findOne({ _id: req.params.id })
      .then((data) => {
        return {
          date: data.date,
          FechaModificacion: data.FechaModificacion,
          Nombres: data.Nombres,
          Apellidos: data.Apellidos,
          Cedula: data.Cedula,
          Celular: data.Celular,
          Direccion: data.Direccion,
          Zona: data.Zona,
          Codigo: data.Codigo,
          User: data.User,
          Username: data.Username,
          Porcentaje: data.Porcentaje,
          _id: data.id,
        };
      });

    res.render("facturacion/vendedor/editar-vendedor", {
      vendedor,
    });
  }
);

//ruta para actualizar vendedor

router.put(
  "/facturacion/vendedor-edited/:id",
  isAuthenticatedVendedor,
  async (req, res) => {
    const {
      Nombres,
      Apellidos,
      Cedula,
      Celular,
      Direccion,
      Zona,
      Codigo,
      Username,
      Porcentaje,
    } = req.body;

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
    let FechaModificacion = `${año}-${mes}-${dia}`;

    await vendedorDB.findByIdAndUpdate(req.params.id, {
      FechaModificacion,
      Nombres,
      Apellidos,
      Cedula,
      Celular,
      Direccion,
      Zona,
      Codigo,
      Porcentaje,
      Username,
    });

    res.redirect("/facturacion/vendedores");
  }
);
//rutar para eliminar vendedor
router.delete(
  "/facturacion/vendedor-delete/:id",
  isAuthenticatedVendedor,
  async (req, res) => {
    await vendedorDB.findByIdAndDelete(req.params.id);

    res.redirect("/facturacion/vendedores");
  }
);

//ruta para registrar transporte
router.get(
  "/facturacion/registrar-transporte",
  isAuthenticatedTransporte,
  (req, res) => {
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
    let date2 = `${año}-${mes}-${dia}`;
    res.render("facturacion/transporte/registrar", {
      date2,
    });
  }
);
//ruta para recibir los datos del transporte
router.post(
  "/registrar-transporte",
  isAuthenticatedTransporte,
  async (req, res) => {
    let { date, Empresa, Rif, Direccion, Vehiculo, Placa, Chofer, Username } =
      req.body;

    Empresa = Empresa.toUpperCase();
    Vehiculo = Vehiculo.toUpperCase();
    Chofer = Chofer.toUpperCase();
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
    let date2 = `${año}-${mes}-${dia}`;

    let errors = [],
      ok = [];
    const Estado = "Activo";

    if (!date) {
      errors.push({
        text: 'El campo "Fecha de registro" no puede estar vacio',
      });
    }
    if (!Empresa) {
      errors.push({ text: 'El campo "Empresa" no puede estar vacio' });
    }
    if (!Rif) {
      errors.push({ text: 'El campo "Rif" no puede estar vacio' });
    }
    if (!Direccion) {
      errors.push({ text: 'El campo "Dirección" no puede estar vacio' });
    }
    if (!Vehiculo) {
      errors.push({ text: 'El campo "Vehículo" no puede estar vacio' });
    }
    if (!Placa) {
      errors.push({ text: 'El campo "Placa" no puede estar vacio' });
    }
    if (!Chofer) {
      errors.push({ text: 'El campo "Chofer" no puede estar vacio' });
    }

    if (errors.length > 0) {
      res.render("facturacion/transporte/registrar", {
        date,
        date2,
        Empresa,
        Rif,
        Direccion,
        Vehiculo,
        Placa,
        Chofer,
        errors,
        Username,
      });
    } else {
      const transporte = new transporteDB({
        date,
        Empresa,
        Rif,
        Direccion,
        Vehiculo,
        Placa,
        Chofer,
        Estado,
        Username,
      });

      await transporte.save();

      ok.push({ text: "Transportista registrado correctamente" });
      res.render("facturacion/transporte/registrar", {
        ok,
        date2,
      });
    }
  }
);
//ruta activar o inactivar transporte
router.get(
  "/facturacion/activar-inactivar-transporte",
  isAuthenticatedTransporte,
  async (req, res) => {
    await transporteDB.find().then((data) => {
      const contexto = {
        transporte: data.map((data) => {
          return {
            date: data.date,
            FechaModificacion: data.FechaModificacion,
            Empresa: data.Empresa,
            Rif: data.Rif,
            Direccion: data.Direccion,
            Vehiculo: data.Vehiculo,
            Placa: data.Placa,
            Chofer: data.Chofer,
            Estado: data.Estado,
            _id: data._id,
          };
        }),
      };

      res.render("facturacion/transporte/pausar-activar", {
        transporte: contexto.transporte,
      });
    });
  }
);

//Rutar para activar transportista
router.get(
  "/facturacion/activar-transportista/:id",
  isAuthenticatedTransporte,
  async (req, res) => {
    let Estado = "Activo";

    await transporteDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/activar-inactivar-transporte");
  }
);
//Rutar para inactivar transportista
router.get(
  "/facturacion/inactivar-transportista/:id",
  isAuthenticatedTransporte,
  async (req, res) => {
    let Estado = "Inactivo";

    await transporteDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/activar-inactivar-transporte");
  }
);

//rutar para cargar vista de editar transportista
router.get(
  "/facturacion/transporte-edit/:id",
  isAuthenticatedTransporte,
  async (req, res) => {
    const transportista = await transporteDB
      .findOne({ _id: req.params.id })
      .then((data) => {
        return {
          date: data.date,
          FechaModificacion: data.FechaModificacion,
          Empresa: data.Empresa,
          Rif: data.Rif,
          Direccion: data.Direccion,
          Vehiculo: data.Vehiculo,
          Placa: data.Placa,
          Chofer: data.Chofer,
          Estado: data.Estado,
          Username: data.Username,
          _id: data.id,
        };
      });
    res.render("facturacion/transporte/edit-transporte", {
      transportista,
    });
  }
);

//vista de transportista editado
router.put(
  "/facturacion/transportista-edited/:id",
  isAuthenticatedTransporte,
  async (req, res) => {
    const { Empresa, Rif, Direccion, Vehiculo, Placa, Chofer, Username } =
      req.body;

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
    let FechaModificacion = `${año}-${mes}-${dia}`;

    await transporteDB.findByIdAndUpdate(req.params.id, {
      Empresa,
      FechaModificacion,
      Rif,
      Direccion,
      Vehiculo,
      Placa,
      Chofer,
      Username,
    });

    res.redirect("/facturacion/transportes");
  }
);

//Vista para elimar transportista

router.delete(
  "/facturacion/transportista-delete/:id",
  isAuthenticatedTransporte,
  async (req, res) => {
    await transporteDB.findByIdAndDelete(req.params.id);

    res.redirect("/facturacion/transportes");
  }
);

//ruta para ver los transportes registrados
router.get(
  "/facturacion/transportes",
  isAuthenticatedTransporte,
  async (req, res) => {
    await transporteDB.find().then((data) => {
      const contexto = {
        transporte: data.map((data) => {
          return {
            date: data.date,
            FechaModificacion: data.FechaModificacion,
            Empresa: data.Empresa,
            Rif: data.Rif,
            Direccion: data.Direccion,
            Vehiculo: data.Vehiculo,
            Placa: data.Placa,
            Chofer: data.Chofer,
            Estado: data.Estado,
            _id: data._id,
            Username: data.Username,
          };
        }),
      };

      res.render("facturacion/transporte/transportes", {
        transporte: contexto.transporte,
      });
    });
  }
);

//ruta para cargar vista de usuarios

router.get("/facturacion/usuarios", isAuthenticatedPerfil, async (req, res) => {
  await usersDB.find({ Role: { $ne: "Client" } }).then((data) => {
    const contexto = {
      usuarios: data.map((data) => {
        return {
          date: data.date,
          FechaModificacion: data.FechaModificacion,
          email: data.email,
          Role: data.Role,
          Estado: data.Estado,
          Responsable: data.Responsable,
          User: data.User,
          _id: data._id,
        };
      }),
    };
    res.render("facturacion/perfiles/usuarios", {
      usuarios: contexto.usuarios,
    });
  });
});

//ruta para editar clientes

router.get(
  "/facturacion/usuario-edit/:id",
  isAuthenticatedPerfil,
  async (req, res) => {
    const usuario = await usersDB
      .findOne({ _id: req.params.id })
      .then((data) => {
        return {
          date: data.date,
          FechaModificacion: data.FechaModificacion,
          email: data.email,
          Role: data.Role,
          Estado: data.Estado,
          Nombres: data.Nombres,
          Apellidos: data.Apellidos,
          password: data.password,
          Cedula: data.Cedula,
          Responsable: data.Responsable,
          User: data.User,
          _id: data._id,
        };
      });
    res.render("facturacion/perfiles/edit-usuario", {
      usuario,
    });
  }
);

//ruta de actualizacion de usuario

router.put(
  "/facturacion/usuario-edited/:id",
  isAuthenticatedPerfil,
  async (req, res) => {
    let {
      Nombres,
      Apellidos,
      Cedula,
      Role,
      email,
      emailconfirm,
      password,
      passwordconfirm,
    } = req.body;
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
    let FechaModificacion = `${año}-${mes}-${dia}`;
    let errors = [];
    if (!Nombres) {
      errors.push({ text: 'El campo "Nombres" no puede estar vacio.' });
    }
    if (!Apellidos) {
      errors.push({ text: 'El campo "Apellidos" no puede estar vacio.' });
    }
    if (!Cedula) {
      errors.push({ text: 'El campo "Cedula" no puede estar vacio.' });
    }
    if (!Role) {
      errors.push({
        text: 'El campo "Nivel de usuario" no puede estar vacio.',
      });
    }
    if (!email) {
      errors.push({
        text: 'El campo "Correo electronico" no puede estar vacio.',
      });
    }
    if (!emailconfirm) {
      errors.push({
        text: 'El campo "Confirmar correo electronico" no puede estar vacio.',
      });
    }
    if (!password) {
      errors.push({ text: 'El campo "Contraseña" no puede estar vacio.' });
    }
    if (!passwordconfirm) {
      errors.push({
        text: 'El campo "Confirmar contraseña" no puede estar vacio.',
      });
    }
    if (emailconfirm != email) {
      errors.push({ text: "Los correos electornicos ingresados no coinciden" });
    }
    if (password != passwordconfirm) {
      errors.push({ text: "Las contraseñas ingresadas no coinciden" });
    }
    if (errors.length > 0) {
      let usuario = await usersDB
        .findOne({ _id: req.params.id })
        .then((data) => {
          return {
            date: data.date,
            FechaModificacion: data.FechaModificacion,
            email: data.email,
            Role: data.Role,
            Estado: data.Estado,
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            password: data.password,
            Cedula: data.Cedula,
            Responsable: data.Responsable,
            User: data.User,
            _id: data._id,
          };
        });
      res.render("facturacion/perfiles/edit-usuario", {
        usuario,
        errors,
      });
    } else {
      let Responsable = Nombres + " " + Apellidos;
      let usuario = await usersDB.findById(req.params.id);
      if (password == usuario.password) {
        await usersDB.findByIdAndUpdate(req.params.id, {
          Nombres,
          Apellidos,
          Responsable,
          Cedula,
          Role,
          email,
          FechaModificacion,
        });
        res.redirect("/facturacion/usuarios");
      } else {
        let newUser = new usersDB({ password });
        newUser.password = await newUser.encryptPassword(password);
        password = newUser.password;
        await usersDB.findByIdAndUpdate(req.params.id, {
          Nombres,
          Apellidos,
          Responsable,
          Cedula,
          Role,
          email,
          password,
          FechaModificacion,
        });
        res.redirect("/facturacion/usuarios");
      }
    }
  }
);

//ruta de eliminacion de usuarios

router.delete(
  "/facturacion/usuario-delete/:id",
  isAuthenticatedPerfil,
  async (req, res) => {
    await usersDB.findByIdAndDelete(req.params.id);

    res.redirect("/facturacion/usuarios");
  }
);
//Post de nueva factura

router.post(
  "/facturacion/nueva-factura/new",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let {
      Factura,
      Cliente,
      DocumentoTipo,
      Documento,
      Direccion,
      Productos,
      CantidadTotal,
      PrecioTotal,
      Vencimiento,
      Celular,
      date,
      Vendedor,
      DocumentoVendedor,
      Codigo,
      Zona,
      Porcentaje,
      PendienteAPagar,
      GananciasVendedor,
      Nota,
      Chofer,
      EmpresaTransporte,
      Vencimiento2,
      TipoPrecio
    } = req.body;
    let factura = await facturaDB.findOne({ Factura: Factura });
    if (factura) {
      let facturas = await facturaDB.find().sort({ Timestamp: -1 });
      Factura = +facturas[0].Factura + 1;
    } else {
      Factura = Factura;
    }
    if (Vencimiento && Vencimiento2) {
      Vencimiento = Vencimiento;
    }
    if (Vencimiento && !Vencimiento2) {
      Vencimiento = Vencimiento;
    }
    if (!Vencimiento && Vencimiento2) {
      let hoy = new Date();
      hoy = hoy.getTime();

      if (Vencimiento2 == 5) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 5).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 10) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 10).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 15) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 15).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 30) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 30).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 60) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 60).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
    }

    let PendienteAPagarComision = GananciasVendedor;

    let Timestamp = Date.now();
    Timestamp = Timestamp;
    const Estado = "Por cobrar";

    //Historial de cliente
    const HistorialCliente = {
      Vendedor: Vendedor,
      Factura: Factura,
      Estado: Estado,
      FechaCreacion: date,
      FechaVencimiento: Vencimiento,
      Timestamp: Timestamp,
      Productos: Productos,
    };

    await clienteDB.findOneAndUpdate(
      { Rif: Documento },
      {
        $push: { HistorialCliente: HistorialCliente },
      }
    );

    //Historial de vendedor
    const HistorialVendedor = {
      Cliente: Cliente,
      Factura: Factura,
      Estado: Estado,
      FechaCreacion: date,
      FechaVencimiento: Vencimiento,
      Timestamp: Timestamp,
      Productos: Productos,
    };

    await vendedorDB.findOneAndUpdate(
      { Nombres: Vendedor },
      {
        $push: { HistorialVendedor: HistorialVendedor },
      }
    );

    //Historial de movimientos de stock

    for (i = 0; i < Productos.length; i++) {
      const cantidadTotal = await stockDB
        .findOne({ CodigoT: Productos[i].Codigo })
        .then((data) => {
          return {
            CantidadTotal: data.CantidadTotal,
            CantidadVendida: data.CantidadVendida,
            HistorialMovimiento: data.HistorialMovimiento,
          };
        });
      let CantidadAnterior = cantidadTotal.CantidadTotal;
      let CantidadMovida = Productos[i].Cantidad;
      let CantidadNueva = +cantidadTotal.CantidadTotal - +Productos[i].Cantidad;
      let comentario = `DESCARGA POR GENERACIÓN DE FACTURA #${Factura}`;
      let CantidadVendida = 0;
      if (!cantidadTotal.CantidadVendida) {
        CantidadVendida = CantidadMovida;
      } else {
        CantidadVendida = +CantidadMovida + +cantidadTotal.CantidadVendida;
      }

      let CodigoMovimiento = 0;
      let TipoMovimiento = "DESCARGA";
      if (cantidadTotal.HistorialMovimiento.length > 0) {
        if (
          cantidadTotal.HistorialMovimiento[
            cantidadTotal.HistorialMovimiento.length - 1
          ].CodigoMovimiento
        ) {
          CodigoMovimiento =
            +cantidadTotal.HistorialMovimiento[
              cantidadTotal.HistorialMovimiento.length - 1
            ].CodigoMovimiento + 1;
        } else {
          CodigoMovimiento += 2001;
        }
      } else {
        CodigoMovimiento += 2001;
      }

      let HistorialMovimiento = {
        FechaMovimiento: date,
        CantidadAnterior: CantidadAnterior,
        CantidadMovida: CantidadMovida,
        CantidadNueva: CantidadNueva,
        Comentario: comentario,
        Timestamp: Timestamp,
        CodigoMovimiento: CodigoMovimiento,
        TipoMovimiento: TipoMovimiento,
      };

      await stockDB.findOneAndUpdate(
        { CodigoT: Productos[i].Codigo },
        {
          CantidadVendida: CantidadVendida,
          CantidadTotal: CantidadNueva,
          $push: { HistorialMovimiento: HistorialMovimiento },
        }
      );
    }
    PrecioTotal = 0
    PendienteAPagar = 0
    GananciasVendedor = 0
    for(i=0; i< Productos.length; i++){
      PrecioTotal = (+PrecioTotal + +Productos[i].precioTotal).toFixed(2)

    } 
    PendienteAPagar = PrecioTotal
    let factorMultiplicar = 0
    if(Porcentaje < 10){
      factorMultiplicar = `0.0${Porcentaje}`
    }else{
      factorMultiplicar = `0.${Porcentaje}`
    }
    GananciasVendedor = (+PrecioTotal *  +factorMultiplicar).toFixed(2)
    
    //actualizar BD dashboard
    let valorGeneralFacturado  = await valorGeneralFacturadoDB.find()
    let valorGeneralUtilidades = await valorGeneralUtilidadesDB.find()
    let GeneralAmortiguadores = await amortiguadoresGeneralDB.find()
    let GeneralBases = await basesGeneralDB.find()
    let GeneralBoots = await bootsGeneralDB.find() 

    let valorFacturado = (+valorGeneralFacturado[0].valor + +PrecioTotal).toFixed(2)
    let valorUtilidades = valorGeneralUtilidades[0].valor
    let cantidadGeneralAmortiguadores = 0
    let cantidadGeneralBases = 0
    let cantidadGeneralBoots = 0

    for(i=0; i<Productos.length; i++){
      let stock = await stockDB.findOne({CodigoT: Productos[i].Codigo})
      let valorRestar = +Productos[i].Cantidad * stock.Costo
      let valor = +Productos[i].precioTotal - +valorRestar
      valorUtilidades += +valor
      if(Productos[i].Producto == "AMORTIGUADOR"){
        cantidadGeneralAmortiguadores += +Productos[i].Cantidad
        
      }
      if(Productos[i].Producto == "BASE DE AMORTIGUADOR"){
        cantidadGeneralBases += +Productos[i].Cantidad
        
      }
      if(Productos[i].Producto == "GUARDAPOLVO"){
        cantidadGeneralBoots += +Productos[i].Cantidad

      }
    }
    
      cantidadGeneralAmortiguadores += +GeneralAmortiguadores[0].Cantidad
      cantidadGeneralBases += +GeneralBases[0].Cantidad
      cantidadGeneralBoots += +GeneralBoots[0].Cantidad


      await amortiguadoresGeneralDB.findByIdAndUpdate(GeneralAmortiguadores[0]._id,{
        Cantidad: cantidadGeneralAmortiguadores
      })
      await basesGeneralDB.findByIdAndUpdate(GeneralBases[0]._id,{
        Cantidad: cantidadGeneralBases
      })
      await bootsGeneralDB.findByIdAndUpdate(GeneralBoots[0]._id,{
        Cantidad: cantidadGeneralBoots
      })
      
    await valorGeneralFacturadoDB.findByIdAndUpdate(valorGeneralFacturado[0]._id,{
      valor: valorFacturado
    })
    await valorGeneralUtilidadesDB.findByIdAndUpdate(valorGeneralUtilidades[0]._id,{
      valor: valorUtilidades
    })

    //calcular todo por mes

      let NumeroMes = date.substr(5,2)
      let Anio = date.substr(0,4)
      let Mes
      if(NumeroMes == "01"){Mes = "ENERO"}
      if(NumeroMes == "02"){Mes = "FEBRERO"}
      if(NumeroMes == "03"){Mes = "MARZO"}
      if(NumeroMes == "04"){Mes = "ABRIL"}
      if(NumeroMes == "05"){Mes = "MAYO"}
      if(NumeroMes == "06"){Mes = "JUNIO"}
      if(NumeroMes == "07"){Mes = "JULIO"}
      if(NumeroMes == "08"){Mes = "AGOSTO"}
      if(NumeroMes == "09"){Mes = "SEPTIEMBRE"}
      if(NumeroMes == "10"){Mes = "OCTUBRE"}
      if(NumeroMes == "11"){Mes = "NOVIEMBRE"}
      if(NumeroMes == "12"){Mes = "DICIEMBRE"}
  
      let validacionFacturacionPorMes = await facturadoPorMesDB.find()
  
      if(validacionFacturacionPorMes.length == 0){
        let nuevaValidacionFacturaPorMes = new facturadoPorMesDB({
          valor: PrecioTotal,
          Mes: Mes, 
          NumeroMes: NumeroMes, 
          Anio: Anio
        })
        await nuevaValidacionFacturaPorMes.save()
      }else{
        let existeFacturadoPorMes =  validacionFacturacionPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
        if(existeFacturadoPorMes){
          let valor = +PrecioTotal + +existeFacturadoPorMes.valor
          await facturadoPorMesDB.findByIdAndUpdate(existeFacturadoPorMes._id,{
            valor: valor
          })
        }else{
          let nuevaValidacionFacturaPorMes = new facturadoPorMesDB({
            valor: PrecioTotal,
            Mes: Mes, 
            NumeroMes: NumeroMes, 
            Anio: Anio
          })
          await nuevaValidacionFacturaPorMes.save()
        }
      }
      //calcular utilidades por mes
        for(x=0; x< Productos.length; x++){
            utilidadesGeneral = 0
            let stock = await stockDB.findOne({CodigoT: Productos[x].Codigo})
              let resta = +stock.Costo * +Productos[x].Cantidad
              let valor = +Productos[x].precioTotal - +resta
              utilidadesGeneral += +valor
              let validacionUtilidadPorMes = await utilidadesPorMesDB.find()
              if(validacionUtilidadPorMes.length == 0){
                  let nuevaUtilidadPorMes = new utilidadesPorMesDB({
                    valor: utilidadesGeneral,
                    Mes: Mes, 
                    NumeroMes: NumeroMes, 
                    Anio: Anio
                  })
                  await nuevaUtilidadPorMes.save()
              }else{
                 let existeUtilidadPorMes =  validacionUtilidadPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
                 if(existeUtilidadPorMes){
                   let valorUtilidadesGeneral = +existeUtilidadPorMes.valor + +utilidadesGeneral
                  await utilidadesPorMesDB.findByIdAndUpdate(existeUtilidadPorMes._id,{
                    valor: valorUtilidadesGeneral,
  
                  })
                 }else{
                  let nuevaUtilidadPorMes = new utilidadesPorMesDB({
                    valor: utilidadesGeneral,
                    Mes: Mes, 
                    NumeroMes: NumeroMes, 
                    Anio: Anio
                  })
                  await nuevaUtilidadPorMes.save()
                 }
              }
        }
  
      for(x=0; x< Productos.length; x++){
        if(Productos[x].Producto == "AMORTIGUADOR"){
          let validarAmortiguadorPorMes = await amortiguadoresPorMesDB.find()
          if(validarAmortiguadorPorMes.length == 0){
            let nuevoAmortiguadorPorMes = new amortiguadoresPorMesDB({
              NumeroMes: NumeroMes,
              Anio: Anio,
              Mes: Mes,
              Cantidad: Productos[x].Cantidad,
            })
            await nuevoAmortiguadorPorMes.save()
          }else{
            let existeMes = validarAmortiguadorPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
            if(existeMes){
                let Cantidad = +existeMes.Cantidad + +Productos[x].Cantidad
                await amortiguadoresPorMesDB.findByIdAndUpdate(existeMes._id,{
                  Cantidad: Cantidad
                })
            }else{
              let nuevoAmortiguadorPorMes = new amortiguadoresPorMesDB({
                NumeroMes: NumeroMes,
                Anio: Anio,
                Mes: Mes,
                Cantidad: Productos[x].Cantidad,
              })
              await nuevoAmortiguadorPorMes.save()
            }
          }
        }
        if(Productos[x].Producto == "BASE DE AMORTIGUADOR"){
          let validarBasesPorMes = await basesPorMesDB.find()
          if(validarBasesPorMes.length == 0){
            let nuevaBasesPorMes = new basesPorMesDB({
              NumeroMes: NumeroMes,
              Anio: Anio,
              Mes: Mes,
              Cantidad: Productos[x].Cantidad,
            })
            await nuevaBasesPorMes.save()
          }else{
            let existeMes = validarBasesPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
            if(existeMes){
                let Cantidad = +existeMes.Cantidad + +Productos[x].Cantidad
                await basesPorMesDB.findByIdAndUpdate(existeMes._id,{
                  Cantidad: Cantidad
                })
            }else{
              let nuevaBasesPorMes = new basesPorMesDB({
                NumeroMes: NumeroMes,
                Anio: Anio,
                Mes: Mes,
                Cantidad: Productos[x].Cantidad,
              })
              await nuevaBasesPorMes.save()
            }
          }
        }
        if(Productos[x].Producto == "GUARDAPOLVO"){
          let validarBootsPorMes = await bootsPorMesDB.find()
          if(validarBootsPorMes.length == 0){
            let nuevoBootsPorMes = new bootsPorMesDB({
              NumeroMes: NumeroMes,
              Anio: Anio,
              Mes: Mes,
              Cantidad: Productos[x].Cantidad,
            })
            await nuevoBootsPorMes.save()
          }else{
            let existeMes = validarBootsPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
            if(existeMes){
                let Cantidad = +existeMes.Cantidad + +Productos[x].Cantidad
                await bootsPorMesDB.findByIdAndUpdate(existeMes._id,{
                  Cantidad: Cantidad
                })
            }else{
              let nuevoBootsPorMes = new bootsPorMesDB({
                NumeroMes: NumeroMes,
                Anio: Anio,
                Mes: Mes,
                Cantidad: Productos[x].Cantidad,
              })
              await nuevoBootsPorMes.save()
            }
          }
        }
      }

    //cierre de calculo de todo por mes
    let facturacionPorMes = await facturadoPorMesDB.find()
    let valorFacturasGranMayor = await valorFacturasGranMayorDB.find()
    let _idvalorFacturasGranMayor = valorFacturasGranMayor[0]._id
    let valorFacturasMayor = await valorFacturasMayorDB.find()
    let _idvalorFacturasMayor = valorFacturasMayor[0]._id
    let valorFacturasDetal = await valorFacturasDetalDB.find()
    let _idvalorFacturasDetal = valorFacturasDetal[0]._id
    if(TipoPrecio == "GRANMAYOR"){
      valorFacturasGranMayor = (+valorFacturasGranMayor[0].valor + +PrecioTotal).toFixed(2)
      await valorFacturasGranMayorDB.findByIdAndUpdate(_idvalorFacturasGranMayor,{
        valor: valorFacturasGranMayor
      })
    }
    if(TipoPrecio == "MAYOR"){
      valorFacturasMayor = +valorFacturasMayor[0].valor + +PrecioTotal
      await valorFacturasMayorDB.findByIdAndUpdate(_idvalorFacturasMayor,{
        valor :valorFacturasMayor
      })
    }
    if(TipoPrecio == "DETAL"){
      valorFacturasDetal = +valorFacturasDetal[0].valor + +PrecioTotal
      await valorFacturasDetalDB.findByIdAndUpdate(_idvalorFacturasDetal,{
        valor: valorFacturasDetal
      })
    }
    let mesABuscar = facturacionPorMes.find((data) => data.NumeroMes == NumeroMes && data.Anio == Anio)
    let valorPorMes = (+mesABuscar.valor + +PrecioTotal).toFixed(2)
    await facturadoPorMesDB.findByIdAndUpdate(mesABuscar._id,{
      valor: valorPorMes
    })

    //cierre de actualizacion de BD dashboard


    
    const newFactura = new facturaDB({
      Timestamp,
      Factura,
      Cliente,
      DocumentoTipo,
      Documento,
      Direccion,
      Productos,
      PrecioTotal2:PrecioTotal, 
      CantidadTotal,
      PrecioTotal,
      Vencimiento,
      Celular,
      date,
      Vendedor,
      DocumentoVendedor,
      Codigo,
      Zona,
      Porcentaje,
      PendienteAPagar,
      GananciasVendedor,
      Nota,
      Estado,
      PendienteAPagarComision: GananciasVendedor,
      Chofer,
      EmpresaTransporte,
      TipoPrecio
    });

    await newFactura.save();

    let registrado = [
      { ok: "Factura registrada correctamente" },
      { Factura: Factura },
    ];
    res.send(JSON.stringify(registrado));
  }
);

//posta para nueva factura de una orden

router.post(
  "/facturacion/nueva-factura-orden/:id",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let {
      Cliente,
      DocumentoTipo,
      Documento,
      Direccion,
      Productos,
      CantidadTotal,
      PrecioTotal,
      Vencimiento,
      Celular,
      date,
      Vendedor,
      DocumentoVendedor,
      Codigo,
      Zona,
      Porcentaje,
      PendienteAPagar,
      GananciasVendedor,
      Nota,
      Chofer,
      EmpresaTransporte,
      Vencimiento2,
      TipoPrecio,
    } = req.body;
    let OrdenNumero = req.params.id;

    if (Vencimiento && Vencimiento2) {
      Vencimiento = Vencimiento;
    }
    if (Vencimiento && !Vencimiento2) {
      Vencimiento = Vencimiento;
    }
    if (!Vencimiento && Vencimiento2) {
      let hoy = new Date();
      hoy = hoy.getTime();

      if (Vencimiento2 == 5) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 5).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 10) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 10).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 15) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 15).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 30) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 30).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
      if (Vencimiento2 == 60) {
        let Timestamp = Date.now();
        Timestamp = Timestamp / 1000;
        Timestamp = (Timestamp + 86400 * 60).toFixed(0);
        Timestamp = Timestamp + "000";
        fechaVencimiento = +Timestamp;
        Vencimiento = new Date(fechaVencimiento);

        let año = Vencimiento.getFullYear();
        if (Vencimiento.getDate() < 10) {
          dia = `0${Vencimiento.getDate()}`;
        } else {
          dia = Vencimiento.getDate();
        }
        if (Vencimiento.getMonth() + 1 < 10) {
          mes = `0${Vencimiento.getMonth() + 1}`;
        } else {
          mes = Vencimiento.getMonth() + 1;
        }
        Vencimiento = `${año}-${mes}-${dia}`;
      }
    }
    let Factura;

    let facturas = await facturaDB.find().sort({ Timestamp: -1 });
    if (facturas.length > 0) {
      Factura = +facturas[0].Factura + 1;
    } else {
      Factura = "20210001";
    }

    let PendienteAPagarComision = GananciasVendedor;

    let Timestamp = Date.now();
    Timestamp = Timestamp;
    const Estado = "Por cobrar";

    //Historial de cliente
    const HistorialCliente = {
      Vendedor: Vendedor,
      Factura: Factura,
      Estado: Estado,
      FechaCreacion: date,
      FechaVencimiento: Vencimiento,
      Timestamp: Timestamp,
      Productos: Productos,
    };

    await clienteDB.findOneAndUpdate(
      { Rif: Documento },
      {
        $push: { HistorialCliente: HistorialCliente },
      }
    );

    //Historial de vendedor
    const HistorialVendedor = {
      Cliente: Cliente,
      Factura: Factura,
      Estado: Estado,
      FechaCreacion: date,
      FechaVencimiento: Vencimiento,
      Timestamp: Timestamp,
      Productos: Productos,
    };

    await vendedorDB.findOneAndUpdate(
      { Username: Vendedor },
      {
        $push: { HistorialVendedor: HistorialVendedor },
      }
    );

    //Historial de movimientos de stock

    for (i = 0; i < Productos.length; i++) {

      const cantidadTotal = await stockDB
        .findOne({ CodigoT: Productos[i].Codigo })
        .then((data) => {
          return {
            CantidadTotal: data.CantidadTotal,
            CantidadVendida: data.CantidadVendida,
            HistorialMovimiento: data.HistorialMovimiento,
          };
        });

      let CantidadAnterior = cantidadTotal.CantidadTotal;
      let CantidadMovida = Productos[i].Cantidad;
      let CantidadNueva = +cantidadTotal.CantidadTotal - +Productos[i].Cantidad;
      let comentario = `DESCARGA POR GENERACIÓN DE FACTURA #${Factura}`;
      let CantidadVendida = 0;
      if (!cantidadTotal.CantidadVendida) {
        CantidadVendida = CantidadMovida;
      } else {
        CantidadVendida = +CantidadMovida + +cantidadTotal.CantidadVendida;
      }

      let CodigoMovimiento = 0;
      let TipoMovimiento = "DESCARGA";
      if (cantidadTotal.HistorialMovimiento.length > 0) {
        if (
          cantidadTotal.HistorialMovimiento[
            cantidadTotal.HistorialMovimiento.length - 1
          ].CodigoMovimiento
        ) {
          CodigoMovimiento =
            +cantidadTotal.HistorialMovimiento[
              cantidadTotal.HistorialMovimiento.length - 1
            ].CodigoMovimiento + 1;
        } else {
          CodigoMovimiento += 2001;
        }
      } else {
        CodigoMovimiento += 2001;
      }

      let HistorialMovimiento = {
        FechaMovimiento: date,
        CantidadAnterior: CantidadAnterior,
        CantidadMovida: CantidadMovida,
        CantidadNueva: CantidadNueva,
        Comentario: comentario,
        Timestamp: Timestamp,
        CodigoMovimiento: CodigoMovimiento,
        TipoMovimiento: TipoMovimiento,
      };

      await stockDB.findOneAndUpdate(
        { CodigoT: Productos[i].Codigo },
        {
          CantidadVendida: CantidadVendida,
          CantidadTotal: CantidadNueva,
          $push: { HistorialMovimiento: HistorialMovimiento },
        }
      );
    }

     //actualizar BD dashboard
let valorGeneralFacturado  = await valorGeneralFacturadoDB.find()
let valorGeneralUtilidades = await valorGeneralUtilidadesDB.find()
let GeneralAmortiguadores = await amortiguadoresGeneralDB.find()
let GeneralBases = await basesGeneralDB.find()
let GeneralBoots = await bootsGeneralDB.find() 

let valorFacturado = (+valorGeneralFacturado[0].valor + +PrecioTotal).toFixed(2)
let valorUtilidades = valorGeneralUtilidades[0].valor
let cantidadGeneralAmortiguadores = 0
let cantidadGeneralBases = 0
let cantidadGeneralBoots = 0

for(i=0; i<Productos.length; i++){
  let stock = await stockDB.findOne({CodigoT: Productos[i].Codigo})
  let valorRestar = +Productos[i].Cantidad * stock.Costo
  let valor = +Productos[i].precioTotal - +valorRestar
  valorUtilidades += +valor
  if(Productos[i].Producto == "AMORTIGUADOR"){
    cantidadGeneralAmortiguadores += +Productos[i].Cantidad
    
  }
  if(Productos[i].Producto == "BASE DE AMORTIGUADOR"){
    cantidadGeneralBases += +Productos[i].Cantidad
    
  }
  if(Productos[i].Producto == "GUARDAPOLVO"){
    cantidadGeneralBoots += +Productos[i].Cantidad

  }
}

  cantidadGeneralAmortiguadores += +GeneralAmortiguadores[0].Cantidad
  cantidadGeneralBases += +GeneralBases[0].Cantidad
  cantidadGeneralBoots += +GeneralBoots[0].Cantidad


  await amortiguadoresGeneralDB.findByIdAndUpdate(GeneralAmortiguadores[0]._id,{
    Cantidad: cantidadGeneralAmortiguadores
  })
  await basesGeneralDB.findByIdAndUpdate(GeneralBases[0]._id,{
    Cantidad: cantidadGeneralBases
  })
  await bootsGeneralDB.findByIdAndUpdate(GeneralBoots[0]._id,{
    Cantidad: cantidadGeneralBoots
  })
  
await valorGeneralFacturadoDB.findByIdAndUpdate(valorGeneralFacturado[0]._id,{
  valor: valorFacturado
})
await valorGeneralUtilidadesDB.findByIdAndUpdate(valorGeneralUtilidades[0]._id,{
  valor: valorUtilidades
})

//calcular todo por mes

  let NumeroMes = date.substr(5,2)
  let Anio = date.substr(0,4)
  let Mes
  if(NumeroMes == "01"){Mes = "ENERO"}
  if(NumeroMes == "02"){Mes = "FEBRERO"}
  if(NumeroMes == "03"){Mes = "MARZO"}
  if(NumeroMes == "04"){Mes = "ABRIL"}
  if(NumeroMes == "05"){Mes = "MAYO"}
  if(NumeroMes == "06"){Mes = "JUNIO"}
  if(NumeroMes == "07"){Mes = "JULIO"}
  if(NumeroMes == "08"){Mes = "AGOSTO"}
  if(NumeroMes == "09"){Mes = "SEPTIEMBRE"}
  if(NumeroMes == "10"){Mes = "OCTUBRE"}
  if(NumeroMes == "11"){Mes = "NOVIEMBRE"}
  if(NumeroMes == "12"){Mes = "DICIEMBRE"}

  let validacionFacturacionPorMes = await facturadoPorMesDB.find()

  if(validacionFacturacionPorMes.length == 0){
    let nuevaValidacionFacturaPorMes = new facturadoPorMesDB({
      valor: PrecioTotal,
      Mes: Mes, 
      NumeroMes: NumeroMes, 
      Anio: Anio
    })
    await nuevaValidacionFacturaPorMes.save()
  }else{
    let existeFacturadoPorMes =  validacionFacturacionPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
    if(existeFacturadoPorMes){
      let valor = +PrecioTotal + +existeFacturadoPorMes.valor
      await facturadoPorMesDB.findByIdAndUpdate(existeFacturadoPorMes._id,{
        valor: valor
      })
    }else{
      let nuevaValidacionFacturaPorMes = new facturadoPorMesDB({
        valor: PrecioTotal,
        Mes: Mes, 
        NumeroMes: NumeroMes, 
        Anio: Anio
      })
      await nuevaValidacionFacturaPorMes.save()
    }
  }
  //calcular utilidades por mes
    for(x=0; x< Productos.length; x++){
        utilidadesGeneral = 0
        let stock = await stockDB.findOne({CodigoT: Productos[x].Codigo})
          let resta = +stock.Costo * +Productos[x].Cantidad
          let valor = +Productos[x].precioTotal - +resta
          utilidadesGeneral += +valor
          let validacionUtilidadPorMes = await utilidadesPorMesDB.find()
          if(validacionUtilidadPorMes.length == 0){
              let nuevaUtilidadPorMes = new utilidadesPorMesDB({
                valor: utilidadesGeneral,
                Mes: Mes, 
                NumeroMes: NumeroMes, 
                Anio: Anio
              })
              await nuevaUtilidadPorMes.save()
          }else{
             let existeUtilidadPorMes =  validacionUtilidadPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
             if(existeUtilidadPorMes){
               let valorUtilidadesGeneral = +existeUtilidadPorMes.valor + +utilidadesGeneral
              await utilidadesPorMesDB.findByIdAndUpdate(existeUtilidadPorMes._id,{
                valor: valorUtilidadesGeneral,

              })
             }else{
              let nuevaUtilidadPorMes = new utilidadesPorMesDB({
                valor: utilidadesGeneral,
                Mes: Mes, 
                NumeroMes: NumeroMes, 
                Anio: Anio
              })
              await nuevaUtilidadPorMes.save()
             }
          }
    }

  for(x=0; x< Productos.length; x++){
    if(Productos[x].Producto == "AMORTIGUADOR"){
      let validarAmortiguadorPorMes = await amortiguadoresPorMesDB.find()
      if(validarAmortiguadorPorMes.length == 0){
        let nuevoAmortiguadorPorMes = new amortiguadoresPorMesDB({
          NumeroMes: NumeroMes,
          Anio: Anio,
          Mes: Mes,
          Cantidad: Productos[x].Cantidad,
        })
        await nuevoAmortiguadorPorMes.save()
      }else{
        let existeMes = validarAmortiguadorPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
        if(existeMes){
            let Cantidad = +existeMes.Cantidad + +Productos[x].Cantidad
            await amortiguadoresPorMesDB.findByIdAndUpdate(existeMes._id,{
              Cantidad: Cantidad
            })
        }else{
          let nuevoAmortiguadorPorMes = new amortiguadoresPorMesDB({
            NumeroMes: NumeroMes,
            Anio: Anio,
            Mes: Mes,
            Cantidad: Productos[x].Cantidad,
          })
          await nuevoAmortiguadorPorMes.save()
        }
      }
    }
    if(Productos[x].Producto == "BASE DE AMORTIGUADOR"){
      let validarBasesPorMes = await basesPorMesDB.find()
      if(validarBasesPorMes.length == 0){
        let nuevaBasesPorMes = new basesPorMesDB({
          NumeroMes: NumeroMes,
          Anio: Anio,
          Mes: Mes,
          Cantidad: Productos[x].Cantidad,
        })
        await nuevaBasesPorMes.save()
      }else{
        let existeMes = validarBasesPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
        if(existeMes){
            let Cantidad = +existeMes.Cantidad + +Productos[x].Cantidad
            await basesPorMesDB.findByIdAndUpdate(existeMes._id,{
              Cantidad: Cantidad
            })
        }else{
          let nuevaBasesPorMes = new basesPorMesDB({
            NumeroMes: NumeroMes,
            Anio: Anio,
            Mes: Mes,
            Cantidad: Productos[x].Cantidad,
          })
          await nuevaBasesPorMes.save()
        }
      }
    }
    if(Productos[x].Producto == "GUARDAPOLVO"){
      let validarBootsPorMes = await bootsPorMesDB.find()
      if(validarBootsPorMes.length == 0){
        let nuevoBootsPorMes = new bootsPorMesDB({
          NumeroMes: NumeroMes,
          Anio: Anio,
          Mes: Mes,
          Cantidad: Productos[x].Cantidad,
        })
        await nuevoBootsPorMes.save()
      }else{
        let existeMes = validarBootsPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
        if(existeMes){
            let Cantidad = +existeMes.Cantidad + +Productos[x].Cantidad
            await bootsPorMesDB.findByIdAndUpdate(existeMes._id,{
              Cantidad: Cantidad
            })
        }else{
          let nuevoBootsPorMes = new bootsPorMesDB({
            NumeroMes: NumeroMes,
            Anio: Anio,
            Mes: Mes,
            Cantidad: Productos[x].Cantidad,
          })
          await nuevoBootsPorMes.save()
        }
      }
    }
  }

//cierre de calculo de todo por mes
  let facturacionPorMes = await facturadoPorMesDB.find()
    let valorFacturasGranMayor = await valorFacturasGranMayorDB.find()
    let _idvalorFacturasGranMayor = valorFacturasGranMayor[0]._id
    let valorFacturasMayor = await valorFacturasMayorDB.find()
    let _idvalorFacturasMayor = valorFacturasMayor[0]._id
    let valorFacturasDetal = await valorFacturasDetalDB.find()
    let _idvalorFacturasDetal = valorFacturasDetal[0]._id
    if(TipoPrecio == "GRANMAYOR"){
      valorFacturasGranMayor = (+valorFacturasGranMayor[0].valor + +PrecioTotal).toFixed(2)
      await valorFacturasGranMayorDB.findByIdAndUpdate(_idvalorFacturasGranMayor,{
        valor: valorFacturasGranMayor
      })
    }
    if(TipoPrecio == "MAYOR"){
      valorFacturasMayor = +valorFacturasMayor[0].valor + +PrecioTotal
      await valorFacturasMayorDB.findByIdAndUpdate(_idvalorFacturasMayor,{
        valor :valorFacturasMayor
      })
    }
    if(TipoPrecio == "DETAL"){
      valorFacturasDetal = +valorFacturasDetal[0].valor + +PrecioTotal
      await valorFacturasDetalDB.findByIdAndUpdate(_idvalorFacturasDetal,{
        valor: valorFacturasDetal
      })
    }
    let mesABuscar = facturacionPorMes.find((data) => data.NumeroMes == NumeroMes && data.Anio == Anio)
    let valorPorMes = (+mesABuscar.valor + +PrecioTotal).toFixed(2)
    await facturadoPorMesDB.findByIdAndUpdate(mesABuscar._id,{
      valor: valorPorMes
    })

//cierre de actualizacion de BD dashboard




    const newFactura = new facturaDB({
      Timestamp,
      OrdenNumero,
      Factura,
      Cliente,
      DocumentoTipo,
      Documento,
      Direccion,
      Productos,
      CantidadTotal,
      PrecioTotal,
      PrecioTotal2:PrecioTotal, 
      Vencimiento,
      Celular,
      date,
      Vendedor,
      DocumentoVendedor,
      Codigo,
      Zona,
      Porcentaje,
      PendienteAPagar,
      GananciasVendedor,
      Nota,
      Estado,
      PendienteAPagarComision,
      Chofer,
      EmpresaTransporte,
      TipoPrecio
    });
    let CantidadTotalAtendida = CantidadTotal;
    let PrecioTotalAtendido = PrecioTotal;

    let ProductosAtendidos = Productos.map((data) => {
      return {
        CodigoT: data.Codigo,
        TipoProducto: data.Producto,
        Modelo: data.Modelo,
        Cantidad: +data.Cantidad,
        PrecioUnidad: +data.precioUnidad,
        PrecioTotal: +data.precioTotal,
      };
    });
    let orden = await ordenesClientesDB.findOne({ OrdenNumero: req.params.id });
    for (r = 0; r < ProductosAtendidos.length; r++) {
      for (t = 0; t < orden.Productos.length; t++) {
        if (ProductosAtendidos[r].CodigoT == orden.Productos[t].CodigoT) {
          ProductosAtendidos[r].Descripcion = orden.Productos[t].Descripcion;
          ProductosAtendidos[r].CodigoG = orden.Productos[t].CodigoG;
          ProductosAtendidos[r].Posicion = orden.Productos[t].Posicion;
        }
      }
    }
    await newFactura.save();

    await ordenesClientesDB.findOneAndUpdate(
      { OrdenNumero: req.params.id },
      {
        Estado: "Facturado",
        CantidadTotalAtendida: CantidadTotalAtendida,
        PrecioTotalAtendido: PrecioTotalAtendido,
        ProductosAtendidos: ProductosAtendidos,
        NumeroFactura: Factura,
      }
    );

    let registrado = [
      { ok: "Factura registrada correctamente" },
      { Factura: Factura },
    ];
    res.send(JSON.stringify(registrado));
  }
);

//vista de model-print

router.get("/model-print/:id", isAuthenticatedThomson, async (req, res) => {
  const factura = await facturaDB
    .findOne({ Factura: req.params.id })
    .then((data) => {
      if(data.Estado == "Anulada"){
        return {
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Anulada: "Si",
          Direccion: data.Direccion,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.PrecioTotal),
          date: data.date,
          Estado: data.Estado,
          Vencimiento: data.Vencimiento,
          Celular: data.Celular,
          Vendedor: data.Vendedor,
          Codigo: data.Codigo,
          DocumentoVendedor: data.DocumentoVendedor,
          Zona: data.Zona,
          Nota: data.Nota,
          Porcentaje: data.Porcentaje,
          FechaModificacion: data.FechaModificacion,
          UltimoPago: data.UltimoPago,
          PendienteAPagar: data.PendienteAPagar,
          GananciasVendedor: data.GananciasVendedor,
          User: data.User,
          _id: data._id,
        };
      }else{
        return {
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Direccion: data.Direccion,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.PrecioTotal),
          date: data.date,
          Estado: data.Estado,
          Vencimiento: data.Vencimiento,
          Celular: data.Celular,
          Vendedor: data.Vendedor,
          Codigo: data.Codigo,
          DocumentoVendedor: data.DocumentoVendedor,
          Zona: data.Zona,
          Nota: data.Nota,
          Porcentaje: data.Porcentaje,
          FechaModificacion: data.FechaModificacion,
          UltimoPago: data.UltimoPago,
          PendienteAPagar: data.PendienteAPagar,
          GananciasVendedor: data.GananciasVendedor,
          User: data.User,
          _id: data._id,
        };
      }
    });
  const Productos = factura.Productos;
  let productos = {
    info: Productos.map((data) => {
      return {
        Codigo: data.Codigo,
        Producto: data.Producto,
        Cantidad: data.Cantidad,
        Modelo: data.Modelo,
        precioUnidad: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.precioUnidad),
        precioTotal: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.precioTotal),
      };
    }),
  };
  res.render("facturacion/print/model-print", {
    factura,
    Productos: productos.info,
  });
});

//vista de historial de movimientos de stock

router.get("/facturacion/stock-historial/:id",isAuthenticatedInventario,async (req, res) => {
    const stock = await stockDB
      .findOne({ _id: req.params.id })
      .sort({ date: -1 })
      .then((data) => {
        return {
          CodigoT: data.CodigoT,
          HistorialMovimiento: data.HistorialMovimiento,
          _id: data._id,
        };
      });

    const HistorialMovimiento = stock.HistorialMovimiento;
    let historial = {
      movimiento: HistorialMovimiento.map((data) => {
        return {
          FechaMovimiento: data.FechaMovimiento,
          CantidadAnterior: data.CantidadAnterior,
          CantidadMovida: data.CantidadMovida,
          CantidadNueva: data.CantidadNueva,
          Comentario: data.Comentario,
          CodigoMovimiento: data.CodigoMovimiento,
          TipoMovimiento: data.TipoMovimiento,
          Timestamp: data.Timestamp,
        };
      }),
    };

    historial.movimiento.sort(function (a, b) {
      if (a.Timestamp > b.Timestamp) {
        return -1;
      }
      if (a.Timestamp < b.Timestamp) {
        return 1;
      }
      return 0;
    });

    res.render("facturacion/inventario/historial-movimientos", {
      stock,
      Historial: historial.movimiento,
    });
  }
);
//Vista de facturas por cobrar

router.get(
  "/facturacion/por-cobrar",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let Estado = "Por cobrar";
    let facturas = await facturaDB.find({ Estado: Estado }).sort({ Factura: -1 });
    let PendienteAPagarGeneral = 0;
    let PrecioTotalGeneral = 0;

    for (i = 0; i < facturas.length; i++) {
      PendienteAPagarGeneral = (
        +PendienteAPagarGeneral + +facturas[i].PendienteAPagar
      ).toFixed(2);
      PrecioTotalGeneral = (
        +PrecioTotalGeneral + +facturas[i].PrecioTotal
      ).toFixed(2);
    }
    PendienteAPagarGeneral = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(PendienteAPagarGeneral);
    PrecioTotalGeneral = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(PrecioTotalGeneral);

    facturas = facturas.map((data) => {
      return {
        Factura: data.Factura,
        Timestamp: data.Timestamp,
        Cliente: data.Cliente,
        DocumentoTipo: data.DocumentoTipo,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Productos: data.Productos,
        CantidadTotal: data.CantidadTotal,
        PrecioTotal: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.PrecioTotal),
        date: data.date,
        Vencimiento: data.Vencimiento,
        Celular: data.Celular,
        Vendedor: data.Vendedor,
        Codigo: data.Codigo,
        DocumentoVendedor: data.DocumentoVendedor,
        Zona: data.Zona,
        Porcentaje: data.Porcentaje,
        FechaModificacion: data.FechaModificacion,
        UltimoPago: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.UltimoPago),
        PendienteAPagar: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.PendienteAPagar),
        GananciasVendedor: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.GananciasVendedor),
        Estado: data.Estado,
        User: data.User,
        _id: data._id,
        Nota: data.Nota,
      };
    });

    res.render("facturacion/facturacion/por-cobrar", {
      facturas,
      PendienteAPagarGeneral,
      PrecioTotalGeneral,
    });
  }
);

//Vista de facturas Cobrado

router.get(
  "/facturacion/cobradas",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let Estado = "Cobrado";
    let facturas = await facturaDB.find({ Estado: Estado }).sort({ Factura: -1 });
    let PendienteAPagarGeneral = 0;
    let PrecioTotalGeneral = 0;

    for (i = 0; i < facturas.length; i++) {
      PendienteAPagarGeneral = (
        +PendienteAPagarGeneral + +facturas[i].PendienteAPagar
      ).toFixed(2);
      PrecioTotalGeneral = (
        +PrecioTotalGeneral + +facturas[i].PrecioTotal
      ).toFixed(2);
    }
    PendienteAPagarGeneral = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(PendienteAPagarGeneral);
    PrecioTotalGeneral = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(PrecioTotalGeneral);

    facturas = facturas.map((data) => {
      return {
        Factura: data.Factura,
        Timestamp: data.Timestamp,
        Cliente: data.Cliente,
        DocumentoTipo: data.DocumentoTipo,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Productos: data.Productos,
        CantidadTotal: data.CantidadTotal,
        PrecioTotal: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.PrecioTotal),
        date: data.date,
        Vencimiento: data.Vencimiento,
        Celular: data.Celular,
        Vendedor: data.Vendedor,
        Codigo: data.Codigo,
        DocumentoVendedor: data.DocumentoVendedor,
        Zona: data.Zona,
        Porcentaje: data.Porcentaje,
        FechaModificacion: data.FechaModificacion,
        UltimoPago: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.UltimoPago),
        PendienteAPagar: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.PendienteAPagar),
        GananciasVendedor: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.GananciasVendedor),
        Estado: data.Estado,
        User: data.User,
        _id: data._id,
        Nota: data.Nota,
      };
    });
    res.render("facturacion/facturacion/cobradas", {
      facturas,
      PendienteAPagarGeneral,
      PrecioTotalGeneral,
    });
  }
);

//Vista de todas las facturas

router.get("/facturacion/ventas",isAuthenticatedFacturacion,async (req, res) => {
    let Clientes = await clienteDB.find().sort({Nombre: 1})
    Clientes = Clientes.map((data) => {
      return{
        Cliente: data.Empresa
      }
    })
    res.render("facturacion/facturacion/facturas", {
      Clientes
    });
  }
);

//ruta para mostrar la anulacion de facturas

router.get("/facturacion/anular-factura",isAuthenticatedFacturacion,async (req, res) => {
    res.render("facturacion/facturacion/anular")
});



//ruta para vista de cotizacion

router.get(
  "/facturacion/nueva-cotizacion",
  isAuthenticatedFacturacion,
  async (req, res) => {
    await clienteDB
      .find()
      .sort({ date: -1 })
      .then(async (documentos) => {
        const contexto = {
          clientes: documentos.map((documento) => {
            return {
              date: documento.date,
              FechaModificacion: documento.FechaModificacion,
              Nombres: documento.Nombres,
              Apellidos: documento.Apellidos,
              Cedula: documento.Cedula,
              Empresa: documento.Empresa,
              Direccion: documento.Direccion,
              Rif: documento.Rif,
              Telefono: documento.Telefono,
              Celular: documento.Celular,
              Codigo: documento.Codigo,
              email: documento.email,
              Empresa: documento.Empresa,
              _id: documento._id,
            };
          }),
        };
        await stockDB
          .find()
          .sort({ date: -1 })
          .then(async (documents) => {
            const context = {
              stock: documents.map((documents) => {
                return {
                  date: documents.date,
                  FechaModificacion: documents.FechaModificacion,
                  Vehiculo: documents.Vehiculo,
                  TipoProducto: documents.TipoProducto,
                  Nombre: documents.Nombre,
                  Proveedor: documents.Proveedor,
                  CodigoT: documents.CodigoT,
                  CodigoG: documents.CodigoG,
                  CantidadTotal: documents.CantidadTotal,
                  CostoFOB: documents.CostoFOB,
                  CostoFOBTotal: documents.CostoFOBTotal,
                  CostoGranMayor: documents.CostoGranMayor,
                  CostoMayor: documents.CostoMayor,
                  CostoDetal: documents.CostoDetal,
                  CostoGranMayorTotal: documents.CostoGranMayorTotal,
                  CostoMayorTotal: documents.CostoMayorTotal,
                  CostoDetalTotal: documents.CostoDetalTotal,
                  User: documents.User,
                  TipoVehiculo: documents.TipoVehiculo,
                  Modelo: documents.Modelo,
                  Familia: documents.Familia,
                  Posicion: documents.Posicion,
                  Año: documents.Año,
                  _id: documents._id,
                };
              }),
            };
            await vendedorDB
              .find()
              .sort({ date: -1 })
              .then((document) => {
                const contex = {
                  vendedor: document.map((document) => {
                    return {
                      date: document.date,
                      FechaModificacion: document.FechaModificacion,
                      Nombres: document.Nombres,
                      Apellidos: document.Apellidos,
                      Cedula: document.Cedula,
                      Celular: document.Celular,
                      Direccion: document.Direccion,
                      Zona: document.Zona,
                      Codigo: document.Codigo,
                      User: document.User,
                      _id: document._id,
                    };
                  }),
                };
                res.render("facturacion/facturacion/cotizacion", {
                  cliente: contexto.clientes,
                  stock: context.stock,
                  vendedor: contex.vendedor,
                });
              });
          });
      });
  }
);

//Cotizacion post
router.post(
  "/facturacion/nueva-cotizacion",
  isAuthenticatedFacturacion,
  async (req, res) => {
    const {
      Factura,
      Cliente,
      DocumentoTipo,
      Documento,
      Direccion,
      Productos,
      CantidadTotal,
      PrecioTotal,
      Vencimiento,
      Celular,
      date,
      Vendedor,
      DocumentoVendedor,
      Codigo,
      Zona,
      PendienteAPagar,
      Nota,
    } = req.body;

    let Timestamp = Date.now();
    Timestamp = Timestamp;
    const Estado = "Cotizacion";
    let today = new Date();

    const newCotizacion = new cotizacionDB({
      Timestamp,
      Factura,
      Cliente,
      DocumentoTipo,
      Documento,
      Direccion,
      Productos,
      CantidadTotal,
      PrecioTotal,
      Vencimiento,
      Celular,
      date,
      Vendedor,
      DocumentoVendedor,
      Codigo,
      Zona,
      PendienteAPagar,
      Nota,
      Estado,
    });

    await newCotizacion.save();

    let registrado = [
      { ok: "Cotización registrada correctamente" },
      { Factura: Factura },
    ];
    res.send(JSON.stringify(registrado));
  }
);

//vista de cotizacion-print

router.get(
  "/cotizacion-print/:id",
  isAuthenticatedFacturacion,
  async (req, res) => {
    const factura = await cotizacionDB
      .findOne({ Factura: req.params.id })
      .then((data) => {
        return {
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Direccion: data.Direccion,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal: data.PrecioTotal,
          date: data.date,
          Estado: data.Estado,
          Vencimiento: data.Vencimiento,
          Celular: data.Celular,
          Vendedor: data.Vendedor,
          Codigo: data.Codigo,
          DocumentoVendedor: data.DocumentoVendedor,
          Zona: data.Zona,
          Porcentaje: data.Porcentaje,
          FechaModificacion: data.FechaModificacion,
          UltimoPago: data.UltimoPago,
          PendienteAPagar: data.PendienteAPagar,
          GananciasVendedor: data.GananciasVendedor,
          User: data.User,
          _id: data._id,
        };
      });

    const Productos = factura.Productos;
    let productos = {
      info: Productos.map((data) => {
        return {
          Codigo: data.Codigo,
          Producto: data.Producto,
          Cantidad: data.Cantidad,
          Modelo: data.Modelo,
          precioUnidad: data.precioUnidad,
          precioTotal: data.precioTotal,
        };
      }),
    };
    res.render("facturacion/print/cotizacion-print", {
      factura,
      Productos: productos.info,
    });
  }
);

//POST de nueva cotizacion
router.post(
  "/facturacion/nueva-cotizacion/info",
  isAuthenticatedFacturacion,
  async (req, res) => {
    await clienteDB
      .find()
      .sort({ date: -1 })
      .then(async (documentos) => {
        const contexto = {
          clientes: documentos.map((documento) => {
            return {
              date: documento.date,
              FechaModificacion: documento.FechaModificacion,
              Nombres: documento.Nombres,
              Apellidos: documento.Apellidos,
              Cedula: documento.Cedula,
              Empresa: documento.Empresa,
              Direccion: documento.Direccion,
              Rif: documento.Rif,
              Telefono: documento.Telefono,
              Celular: documento.Celular,
              Codigo: documento.Codigo,
              email: documento.email,
              Empresa: documento.Empresa,
              _id: documento._id,
            };
          }),
        };
        await stockDB
          .find()
          .sort({ date: -1 })
          .then(async (documents) => {
            const context = {
              stock: documents.map((documents) => {
                return {
                  date: documents.date,
                  FechaModificacion: documents.FechaModificacion,
                  Vehiculo: documents.Vehiculo,
                  TipoProducto: documents.TipoProducto,
                  Nombre: documents.Nombre,
                  Proveedor: documents.Proveedor,
                  CodigoT: documents.CodigoT,
                  CodigoG: documents.CodigoG,
                  CantidadTotal: documents.CantidadTotal,
                  CostoFOB: documents.CostoFOB,
                  CostoFOBTotal: documents.CostoFOBTotal,
                  CostoGranMayor: documents.CostoGranMayor,
                  CostoMayor: documents.CostoMayor,
                  CostoDetal: documents.CostoDetal,
                  CostoGranMayorTotal: documents.CostoGranMayorTotal,
                  CostoMayorTotal: documents.CostoMayorTotal,
                  CostoDetalTotal: documents.CostoDetalTotal,
                  User: documents.User,
                  TipoVehiculo: documents.TipoVehiculo,
                  Modelo: documents.Modelo,
                  Familia: documents.Familia,
                  Posicion: documents.Posicion,
                  Año: documents.Año,
                  _id: documents._id,
                };
              }),
            };
            await cotizacionDB
              .find()
              .sort({ date: -1 })
              .then(async (document) => {
                const contex = {
                  factura: document.map((document) => {
                    return {
                      Factura: document.Factura,
                      _id: document._id,
                    };
                  }),
                };
                await vendedorDB
                  .find()
                  .sort({ date: -1 })
                  .then((document) => {
                    const contextoVendedor = {
                      vendedor: document.map((documentos) => {
                        return {
                          date: documentos.date,
                          FechaModificacion: documentos.FechaModificacion,
                          Nombres: documentos.Nombres,
                          Apellidos: documentos.Apellidos,
                          Cedula: documentos.Cedula,
                          Celular: documentos.Celular,
                          Direccion: documentos.Direccion,
                          Zona: documentos.Zona,
                          Codigo: documentos.Codigo,
                          User: documentos.User,
                          _id: documentos._id,
                        };
                      }),
                    };
                    const datos = [
                      contexto.clientes,
                      context.stock,
                      contex.factura,
                      contextoVendedor.vendedor,
                    ];
                    res.status(202).send(JSON.stringify(datos));
                  });
              });
          });
      });
  }
);

//cargar vista de cobranza

router.get("/facturacion/cobranza",isAuthenticatedCobranza,async (req, res) => {
    let facturas = await facturaDB.find({Estado:"Por cobrar"}).sort({Cliente: 1})
    let Clientes = []
    for(i=0; i< facturas.length;i++){
      let validacion = Clientes.find((data) => data.Cliente == facturas[i].Cliente)
      if(!validacion){
        let data = {
          Cliente: facturas[i].Cliente
        }
        Clientes.push(data)
      }
    }  
    res.render("facturacion/cobranza/cobranza", {
      Clientes
    });
  }
);
//enviar info a cobranza


router.post('/solicitar-info-factura-registrar-pago' , isAuthenticatedCobranza,async (req, res) => {
  let {Numero} = req.body
  
  let factura = await facturaDB.findOne({Factura: Numero})
  let pendienteAPagar = factura.PendienteAPagar
  res.send(JSON.stringify(pendienteAPagar))

})
//ruta para info del cliente
router.post('/solicitar-info-cliente-registrar-pago' , isAuthenticatedCobranza,async (req, res) => {
  let {Cliente} = req.body
  
  let factura = await facturaDB.find({$and: [{Cliente: Cliente},{Estado:"Por cobrar"}]})
  factura = factura.map((data) => {
    return{
      Numero: data.Factura
    }
  })
  res.send(JSON.stringify(factura))

})

//enviar datos de valor de factura a cobranza

router.post(
  "/facturacion/info-precio",
  isAuthenticatedCobranza,
  async (req, res) => {
    const { factura } = req.body;

    await facturaDB
      .find({ Factura: factura })
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          facturas: document.map((document) => {
            return {
              PendienteAPagar: document.PendienteAPagar,
              _id: document._id,
            };
          }),
        };
        const data = contex.facturas;
        res.send(JSON.stringify(data));
      });
  }
);

//actualizar pago de la factura

router.post( "/registrar-pago-factura", isAuthenticatedCobranza, async (req, res) => {
    let { Cliente, Comentario, Facturas, Referencia } = req.body;
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
    let recibosPago = await notasPagoDB.find().sort({"Timestamp":-1})
    let Recibo = 0
    let validacion = await transaccionesDB.findOne({$and: [{ Referencia:Referencia}, {Modalidad: Facturas[0].Modalidad}]})

    if(validacion){
      let data= {
        Status: "Error",
        Recibo: validacion.NumeroNota,
      }
      res.send(JSON.stringify(data))
    }else{

      if(recibosPago.lenght == 0){
        Recibo= 10000000001
      }else{
        Recibo = +recibosPago[0].Recibo + 1
      }
      let FacturasDelCliemte= []
      for(i=0; i< Facturas.length; i++){
        let factura = await facturaDB.findOne({Factura: Facturas[i].Factura})
        let HistorialPago = {
          Pago: Facturas[i].Monto,
          Comentario: Facturas[i].Nota,
          Modalidad: Facturas[i].Modalidad,
          Recibo:Recibo,
          FechaPago:Fecha,
          user: req.user.email,
          Timestamp:Timestamp,
        }
        if(+Facturas[i].Restante == 0){
  
          await facturaDB.findByIdAndUpdate(factura._id,{
            Estado: "Cobrado",
            PendienteAPagar: Facturas[i].Restante,
            $push: { HistorialPago: HistorialPago },
          })
        }else{
          await facturaDB.findByIdAndUpdate(factura._id,{
            PendienteAPagar: Facturas[i].Restante,
            $push: { HistorialPago: HistorialPago },
          })
        }
        let facturasCliente = {
          NotaEntrega: Facturas[i].Factura,
          Monto: Facturas[i].Monto,
          Modalidad: Facturas[i].Modalidad,
          Comentario: Facturas[i].Nota,
        }
        FacturasDelCliemte.push(facturasCliente)
      }
      let cliente = await clienteDB.findOne({Empresa: Cliente})
  
      let facturas = await facturaDB.find({$and: [{Estado:"Por cobrar"},{Cliente: Cliente}]})
      let PendienteGeneralDelCliente = 0
      for(i=0; i < facturas.length; i++){
        PendienteGeneralDelCliente += +facturas[i].PendienteAPagar 
      }
      PendienteGeneralDelCliente = PendienteGeneralDelCliente.toFixed(2)
      let nuevoReciboDePago = new notasPagoDB({
        Fecha: Fecha,
        Referencia:Referencia,
        Timestamp:Timestamp,
        Recibo: Recibo,
        Facturas: FacturasDelCliemte,
        Comentario2: Comentario,
        Cliente: Cliente,
        Documento: cliente.Rif,
        Direccion: cliente.Direccion,
        Celular: cliente.Celular,
        PendienteAPagar: PendienteGeneralDelCliente,
      })
      await nuevoReciboDePago.save()
      let data = {
        Status: "Ok",
        Recibo:Recibo
      }
      if(Facturas[0].Modalidad != "EFECTIVO"){

        let nuevaTransaccion = new transaccionesDB({
          Referencia: Referencia, 
          NumeroNota: Recibo, 
          Modalidad: Facturas[0].Modalidad, 
        })
        await nuevaTransaccion.save()
      }
      res.send(JSON.stringify(data))
    }
  });

//ver recibo de pago
router.get( "/ver-recibo-pago/:id", isAuthenticatedThomson, async (req, res) => {
    let nota = await notasPagoDB.findOne({ Recibo: req.params.id });
    let totalPagado = 0
      for(r=0; r<nota.Facturas.length; r++){
        totalPagado += +nota.Facturas[r].Monto
      }
    totalPagado = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(totalPagado.toFixed(2))
    if(nota.EstadoGeneral == "Anulada"){
      let factura = {
        Fecha: nota.Fecha,
        Recibo: nota.Recibo,
        Cliente: nota.Cliente,
        Anulada: "Si",
        Documento: nota.Documento,
        Direccion: nota.Direccion,
        VendedorCodigo: nota.VendedorCodigo,
        Celular: nota.Celular,
        Facturas: nota.Facturas.map((data) => {
          return{
            NotaEntrega: data.NotaEntrega,
            Comentario: data.Comentario,
            Monto: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.Monto),
            Modalidad: data.Modalidad,
          }
        }),
        Comentario2: nota.Comentario2,
        PendienteAPagar: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(nota.PendienteAPagar),
      };
      res.render("facturacion/reporte_pdf/recibo-pago", {
        factura,
        totalPagado,
      });
    }else{
      let factura = {
        Fecha: nota.Fecha,
        Recibo: nota.Recibo,
        Cliente: nota.Cliente,
        Documento: nota.Documento,
        Direccion: nota.Direccion,
        VendedorCodigo: nota.VendedorCodigo,
        Celular: nota.Celular,
        Facturas: nota.Facturas.map((data) => {
          return{
            NotaEntrega: data.NotaEntrega,
            Comentario: data.Comentario,
            Monto: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.Monto),
            Modalidad: data.Modalidad,
          }
        }),
        Comentario2: nota.Comentario2,
        PendienteAPagar: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(nota.PendienteAPagar),
      };
      res.render("facturacion/reporte_pdf/recibo-pago", {
        factura,
        totalPagado,
      });
    }

  }
);

//ver recibo de devolución

router.get('/ver-devolucion/:id',isAuthenticatedThomson,  async (req, res) => {
  let devolucion = await recibosDevolucioDB.findOne({Recibo: req.params.id})
  if(devolucion.EstadoGeneral == "Anulada"){
    let factura = {
      Fecha: devolucion.Fecha,
      Timestamp: devolucion.Timestamp,
      Recibo: devolucion.Recibo,
      Anulada: "Si",
      NotaEntrega: devolucion.NotaEntrega,
      Cliente: devolucion.Cliente,
      Documento: devolucion.Documento,
      Direccion: devolucion.Direccion,
      Celular: devolucion.Celular,
      Titulo: devolucion.Titulo,
      Productos: devolucion.Productos.map((data) => {
        return{
          CodigoT: data.CodigoT,
          Cantidad: data.Cantidad,
          Precio: new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.Precio),
  
        }
      }),
      PrecioActualNota: new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(devolucion.PrecioActualNota),
    }
    res.render("facturacion/reporte_pdf/recibo-devolucion", {
      factura,
    });
  }else{
    let factura = {
      Fecha: devolucion.Fecha,
      Timestamp: devolucion.Timestamp,
      Recibo: devolucion.Recibo,
      NotaEntrega: devolucion.NotaEntrega,
      Cliente: devolucion.Cliente,
      Documento: devolucion.Documento,
      Direccion: devolucion.Direccion,
      Celular: devolucion.Celular,
      Titulo: devolucion.Titulo,
      Productos: devolucion.Productos.map((data) => {
        return{
          CodigoT: data.CodigoT,
          Cantidad: data.Cantidad,
          Precio: new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.Precio),
  
        }
      }),
      PrecioActualNota: new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(devolucion.PrecioActualNota),
    }
    res.render("facturacion/reporte_pdf/recibo-devolucion", {
      factura,
    });
  }

})

//vista de devolucion

router.get(
"/facturacion/devolucion",
isAuthenticatedCobranza,
async (req, res) => {
    let Estado = "Por cobrar";
    let clientes = await clienteDB.find().sort({"Empresa": 1})
    clientes = clientes.map((data) => {
      return{
        Empresa: data.Empresa,
        _id: data._id
      }
    })

    await facturaDB
      .find({ Estado: Estado })
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          facturas: document.map((document) => {
            return {
              Factura: document.Factura,
              _id: document._id,
            };
          }),
        };
        res.render("facturacion/cobranza/devolucion", {
          facturas: contex.facturas,
          clientes: clientes
        });
      });
  }
);


router.post('/solicitar-facturas-clientes-devolucion', async (req, res) => {
  let {Cliente} = req.body
  let facturas = await facturaDB.find({$and : [{Estado:"Por cobrar"}, {Cliente: Cliente}]})
  facturas = facturas.map((data) => {
    return{
      Factura: data.Factura,
      _id: data._id,
    }
  })
  res.send(JSON.stringify(facturas))
}) 

//post para enviar info de productos a vista de devolucion

router.post(
  "/facturacion/info-productos",
  isAuthenticatedCobranza,
  async (req, res) => {
    const { factura } = req.body;

    await facturaDB
      .find({ Factura: factura })
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          facturas: document.map((document) => {
            return {
              Productos: document.Productos,
              _id: document._id,
            };
          }),
        };
        const data = contex.facturas;
        res.send(JSON.stringify(data));
      });
  }
);

//recibir datos de las devoluciones

router.post("/realizar-devolucion",isAuthenticatedCobranza,async (req, res) => {
  let {Codigos, Factura} = req.body   
  let reciboDevolucion = await recibosDevolucioDB.find().sort({Timestamp: -1})
  let GeneralAmortiguadores = await amortiguadoresGeneralDB.find()
  let basesGeneral = await basesGeneralDB.find()
  let bootsGeneral = await bootsGeneralDB.find()
  let factura = await facturaDB.findOne({Factura: Factura})
  let NumeroMes = factura.date.substr(5,2)
  let Anio = factura.date.substr(0,4)
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
  //junto con el historial en el stock
  let cantidadAmortiguadorRestar= 0
  let cantidadBaseRestar= 0
  let cantidadBootsRestar= 0
  for(i=0; i< Codigos.length;i++){
    let codigo = await stockDB.findOne({CodigoT: Codigos[i].CodigoT})
    if(codigo.TipoProducto == "AMORTIGUADOR"){
      cantidadAmortiguadorRestar += +Codigos[i].Cantidad
    }
    if(codigo.TipoProducto == "BASE DE AMORTIGUADOR"){
      cantidadBaseRestar += +Codigos[i].Cantidad
    }
    if(codigo.TipoProducto == "GUARDAPOLVO"){
      cantidadBootsRestar += +Codigos[i].Cantidad
    }
  
    let CantidadVendida = +codigo.CantidadVendida - +Codigos[i].Cantidad
    let longitud = +codigo.HistorialMovimiento.length - 1
    let CodigoMovimiento = codigo.HistorialMovimiento[+longitud]
    CodigoMovimiento = +CodigoMovimiento.CodigoMovimiento + 1
    let CantidadNueva = +codigo.CantidadTotal + +Codigos[i].Cantidad
    let HistorialMovimiento = {
      FechaMovimiento: date,
      CantidadAnterior: codigo.CantidadTotal,
      CantidadMovida: Codigos[i].Cantidad,
      CantidadNueva: CantidadNueva,
      Comentario: `DEVOLUCIÓN EN FACTURA ${Factura}`,
      Timestamp: Timestamp,
      CodigoMovimiento: CodigoMovimiento,
      TipoMovimiento: "CARGA",
    }

    await stockDB.findByIdAndUpdate(codigo._id,{
      CantidadTotal: CantidadNueva,
      CantidadVendida:CantidadVendida,
      $push: {HistorialMovimiento: HistorialMovimiento}
    })
  }
  
  let validarAmortiguadorPorMes = await amortiguadoresPorMesDB.find()
  let validarBasesPorMes = await basesPorMesDB.find()
  let validarBootsPorMes = await bootsPorMesDB.find()

  let existeMes = validarAmortiguadorPorMes.find((data) => data.NumeroMes == NumeroMes && data.Anio == Anio)
  if(existeMes){
    let Cantidad = +existeMes.Cantidad - +cantidadAmortiguadorRestar
    await amortiguadoresPorMesDB.findByIdAndUpdate(existeMes._id,{
      Cantidad: Cantidad
    })
  }
  existeMes = validarBasesPorMes.find((data) => data.NumeroMes == NumeroMes && data.Anio == Anio)
  if(existeMes){
    let Cantidad = +existeMes.Cantidad - +cantidadBaseRestar
    await basesPorMesDB.findByIdAndUpdate(existeMes._id,{
      Cantidad: Cantidad
    })
  }
  existeMes = validarBootsPorMes.find((data) => data.NumeroMes == NumeroMes && data.Anio == Anio)
  if(existeMes){
    let Cantidad = +existeMes.Cantidad - +cantidadBootsRestar
    await bootsPorMesDB.findByIdAndUpdate(existeMes._id,{
      Cantidad: Cantidad
    })
  }

  if(GeneralAmortiguadores.length > 0){
    let Cantidad = +GeneralAmortiguadores[0].Cantidad - +cantidadAmortiguadorRestar
    await amortiguadoresGeneralDB.findByIdAndUpdate(GeneralAmortiguadores[0]._id,{
      Cantidad: Cantidad,
    })
  }
  if(basesGeneral.length > 0){
    let Cantidad = +basesGeneral[0].Cantidad - +cantidadBaseRestar
    await basesGeneralDB.findByIdAndUpdate(basesGeneral[0]._id,{
      Cantidad: Cantidad,
    })
  }
  if(bootsGeneral.length > 0){
    let Cantidad = +bootsGeneral[0].Cantidad - +cantidadBootsRestar
    await bootsGeneralDB.findByIdAndUpdate(bootsGeneral[0]._id,{
      Cantidad: Cantidad,
    })
  }
  let codigosDiferentes = []
  let codigosIguales = []
  for(i=0; i< factura.Productos.length; i++){
    let validacion = Codigos.find((data) => data.CodigoT == factura.Productos[i].Codigo)
    if(validacion){
      codigosIguales.push(factura.Productos[i])
    }else{
      codigosDiferentes.push(factura.Productos[i])
    }
  }
  let Productos = []
  let ProductosReciboDevolucion = []
  let valorDevuelto = 0
  //el valor devuelto se le restara al PendienteAPagar y al PrecioTotal2
  for(i=0; i< codigosIguales.length; i++){
    let cantidadADevolver = Codigos.find((data) => data.CodigoT == codigosIguales[i].Codigo)
    let valorADevolver = +cantidadADevolver.Cantidad * +codigosIguales[i].precioUnidad 
    cantidadADevolver.Precio = valorADevolver
    ProductosReciboDevolucion.push(cantidadADevolver)
    valorDevuelto += +valorADevolver
    codigosIguales[i].precioTotal2 = (+codigosIguales[i].precioTotal2 - +valorADevolver).toFixed(2)
    codigosIguales[i].precioTotal2 = +codigosIguales[i].precioTotal2
    Productos.push(codigosIguales[i])
  }
  for(i=0; i< codigosDiferentes.length; i++){
    Productos.push(codigosDiferentes[i])
  }
  let PendienteAPagar = (+factura.PendienteAPagar - +valorDevuelto).toFixed(2)
  let PrecioTotal2 = (+factura.PrecioTotal2 - +valorDevuelto).toFixed(2)
  //Creamos recibo
  let reciboPorMonto = await reciboPorMontoDB.find().sort({"Timestamp":-1})
  let Recibo = 0
  if(reciboPorMonto.length > 0){
    if(+reciboDevolucion[0].Recibo > +reciboPorMonto[0].Recibo){
      Recibo = +reciboDevolucion[0].Recibo + 1
    }else{
      Recibo = +reciboPorMonto[0].Recibo + 1
    }
  }else{
    Recibo = +reciboDevolucion[0].Recibo + 1
  }
  let nuevoReciboDevolucion = new recibosDevolucioDB({
    Fecha: date,
    Timestamp: Timestamp,
    Recibo: Recibo,
    NotaEntrega: Factura ,
    Cliente: factura.Cliente,
    Documento: factura.Documento ,
    Direccion:  factura.Direccion,
    Celular: factura.Celular ,
    Titulo: "DEVOLUCIÓN" ,
    Productos: ProductosReciboDevolucion,
    PrecioActualNota: PendienteAPagar,
  })
  let HistorialPago = {
    Pago: valorDevuelto,
    Comentario: "DEVOLUCIÓN PRODUCTO" ,
    Recibo: Recibo ,
    Modalidad: "DEVOLUCIÓN",
    FechaPago: date,
    user: req.user.email,
    Timestamp: Timestamp,
  }
  let factorMultiplicar = 0
  if(factura.Porcentaje < 10){
    factorMultiplicar = `0.0${factura.Porcentaje}`
  }else{
    factorMultiplicar = `0.${factura.Porcentaje}`
  }
  let GananciasVendedor = (+PrecioTotal2 * +factorMultiplicar).toFixed(2)
  if(PendienteAPagar <= 0 ){
    await facturaDB.findByIdAndUpdate(factura._id,{
      Estado: "Cobrado",
      PendienteAPagar: PendienteAPagar,
      PrecioTotal2: PrecioTotal2,
      GananciasVendedor: GananciasVendedor,
      $push: {HistorialPago: HistorialPago}
    })
  }else{
    await facturaDB.findByIdAndUpdate(factura._id,{
      PendienteAPagar: PendienteAPagar,
      PrecioTotal2: PrecioTotal2,
      GananciasVendedor: GananciasVendedor,
      $push: {HistorialPago: HistorialPago}
    })
  }

  await nuevoReciboDevolucion.save()
  
  let data = {
    Recibo: Recibo
  }

  res.send(JSON.stringify(data))


});

//Vista de comisiones por cancelar
router.get('/facturacion/comision/por-cancelar', isAuthenticatedComision ,async (req, res) => {
  let vendedores = await vendedorDB.find()

  vendedores = vendedores.map((data) => {
    return{
      date: data.date,
      FechaModificacion: data.FechaModificacion,
      Nombres: data.Nombres,
      Apellidos: data.Apellidos,
      Cedula: data.Cedula,
      Celular: data.Celular,
      Direccion: data.Direccion,
      Zona: data.Zona,
      Estado: data.Estado,
      Username: data.Username,
      email: data.email,
      Porcentaje: data.Porcentaje,
      Codigo: data.Codigo,
      User: data.User,
      HistorialVendedor: data.HistorialVendedor,
    }
  })

  res.render("facturacion/comision/por-cancelar", {
    vendedores
  });

})


//Vista de comisiones canceladas

router.get("/facturacion/comision/canceladas",isAuthenticatedComision,async (req, res) => {
    let recibosComisiones = await recibosComisionesDB.find().sort({"Recibo": -1})
    let TotalGeneral = 0
    for(i=0; i< recibosComisiones.length; i++){
      TotalGeneral += +recibosComisiones[i].Total
    }
    TotalGeneral = new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(TotalGeneral)
    recibosComisiones = recibosComisiones.map((data) => {
      return{
        Fecha: data.Fecha,
        Recibo: data.Recibo,
        Vendedor: data.Vendedor,
        Documento: data.Documento,
        Total: new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",}).format(data.Total),
      }
    })
      res.render("facturacion/comision/canceladas", {
        recibosComisiones,
        TotalGeneral
      });
});

//enviar informacion de comisiones por cancelar

router.post("/facturacion/por-cancelar-info", isAuthenticatedComision, async (req, res) => {
  let {Vendedor} = req.body
  let Estado = "Cobrado";
  
  let facturas = await facturaDB.find({ $and:[{Estado: Estado}, {Vendedor: Vendedor},  {EstadoComision: "Por cobrar"}]})
  facturas = facturas.map((data) => {
    return{
      Factura: data.Factura,
      GananciasVendedor: data.GananciasVendedor,
    }
  })

  res.send(JSON.stringify(facturas))
  

});


//ruta para activar o desactivar usuarios

router.get(
  "/facturacion/pausar-activar-usuario",
  isAuthenticatedPerfil,
  async (req, res) => {
    await usersDB.find().then((data) => {
      const contexto = {
        usuarios: data.map((data) => {
          return {
            date: data.date,
            FechaModificacion: data.FechaModificacion,
            email: data.email,
            Role: data.Role,
            Estado: data.Estado,
            Responsable: data.Responsable,
            User: data.User,
            _id: data._id,
          };
        }),
      };
      res.render("facturacion/perfiles/pausar-activar", {
        usuarios: contexto.usuarios,
      });
    });
  }
);
// ruta para activar usuarios

router.get(
  "/facturacion/activar-usuario/:id",
  isAuthenticatedPerfil,
  async (req, res) => {
    let Estado = "Activo";

    await usersDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/pausar-activar-usuario");
  }
);

// ruta para desactivar usuarios

router.get(
  "/facturacion/inactivar-usuario/:id",
  isAuthenticatedPerfil,
  async (req, res) => {
    let Estado = "Inactivo";

    await usersDB.findByIdAndUpdate(req.params.id, {
      Estado,
    });

    res.redirect("/facturacion/pausar-activar-usuario");
  }
);

//ruta de agenda

router.get("/facturacion/agenda", isAuthenticatedAgenda, async (req, res) => {
  await agendaDB.find().sort({"Nombre": 1}).then((data) => {
    const contexto = {
      telefonos: data.map((data) => {
        return {
          date: data.date,
          Nombre: data.Nombre,
          Empresa: data.Empresa,
          Numero: data.Numero,
          _id: data._id,
          Numero2: data.Numero2,
          email: data.email,
        };
      }),
    };
    res.render("facturacion/agenda", {
      agenda: contexto.telefonos,
    });
  });
});

//ruta para editar y eliminar contactos

router.get(
  "/editar-contacto-agenda/:id",
  isAuthenticatedAgenda,
  async (req, res) => {
    const agenda = await agendaDB
      .findOne({ _id: req.params.id })
      .then((data) => {
        return {
          Nombre: data.Nombre,
          Empresa: data.Empresa,
          Numero: data.Numero,
          _id: data._id,
          Numero2: data.Numero2,
          email: data.email,
        };
      });
    res.render("facturacion/editar-contactos", {
      agenda,
    });
  }
);
//ruta para actualizar contacto

router.put(
  "/actualizar-contacto/:id",
  isAuthenticatedAgenda,
  async (req, res) => {
    let { Nombre, Empresa, Numero, Numero2, email } = req.body;
    if(email){
      email = email.toUpperCase()
    }
    await agendaDB.findByIdAndUpdate(req.params.id, {
      Nombre,
      Empresa,
      Numero,
      Numero2, 
      email
    });
    res.redirect("/facturacion/agenda");
  }
);

//ruta para eliminar contacto

router.delete(
  "/facturacion/eliminar-contacto/:id",
  isAuthenticatedAgenda,
  async (req, res) => {
    await agendaDB.findByIdAndDelete(req.params.id);

    res.redirect("/facturacion/agenda");
  }
);

//ruta para agregar contactos

router.get(
  "/facturacion/agregar-contacto",
  isAuthenticatedAgenda,
  async (req, res) => {
    res.render("facturacion/agregar-contacto");
  }
);

//ruta para registrar el contacto

router.post("/facturacion/agregar-contacto",isAuthenticatedAgenda,async (req, res) => {
    let { Nombre, Empresa, Numero, Numero2,email } = req.body;
    let errors = [];
    let Fecha = new Date();
    let dia;
    let mes;
    if(email){
      email = email.toUpperCase()
    }
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

    Nombre = Nombre.toUpperCase();
    Empresa = Empresa.toUpperCase();

    if (!Nombre) {
      errors.push({ text: 'El campo "Nombre" no puede estar vacio' });
    }
    if (!Numero) {
      errors.push({ text: 'El campo "Numero" no puede estar vacio' });
    }
    if (errors.length > 0) {
      res.render("facturacion/agregar-contacto", {
        errors,
        Nombre,
        Emoresa,
        Numero,
        Numero2,
        email
      });
    } else {
      const agenda = new agendaDB({
        Nombre,
        Empresa,
        Numero,
        date,
        Numero2,
        email
      });

      await agenda.save();

      let ok = [{ text: "Contacto agregado correctamente" }];
      res.render("facturacion/agregar-contacto", {
        ok,
      });
    }
  }
);

//ruta para cargar vista de historial de pago

router.get(
  "/facturacion/historial-pagos/:id",
  isAuthenticatedFacturacion,
  async (req, res) => {
    let factura = await facturaDB.findById(req.params.id);
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
    res.render("facturacion/facturacion/historial-pagos", {
      Factura,
      Historial: historial.pago,
    });
  }
);

//-------------------reportes-------------------

//descarga reporte excel inventario

router.get(
  "/facturacion/reporte-excel-transporte",
  isAuthenticatedTransporte,
  async (req, res) => {
    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Transporte Thomson");

    const style = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#FFFF00",
        fgColor: "#FFFF00",
      },
    });

    const transporte = await transporteDB.find();

    ws.cell(1, 1).string("Fecha de registro").style(style);
    ws.cell(1, 2).string("Fecha ultima modificacion").style(style);
    ws.cell(1, 3).string("Empresa").style(style);
    ws.cell(1, 4).string("Rif").style(style);
    ws.cell(1, 5).string("Direccón").style(style);
    ws.cell(1, 6).string("Vehiculo").style(style);
    ws.cell(1, 7).string("Placa").style(style);
    ws.cell(1, 8).string("Chofer").style(style);
    ws.cell(1, 9).string("Estado").style(style);

    let fila = 2;

    for (i = 0; i < transporte.length; i++) {
      columna = 1;

      let registro = transporte[i].date;
      registro = registro.toString().substr(0, 10);

      ws.cell(fila, columna++).string(registro);
      ws.cell(fila, columna++).string(transporte[i].FechaModificacion);
      ws.cell(fila, columna++).string(transporte[i].Empresa);
      ws.cell(fila, columna++).string(transporte[i].Rif);
      ws.cell(fila, columna++).string(transporte[i].Direccion);
      ws.cell(fila, columna++).string(transporte[i].Vehiculo);
      ws.cell(fila, columna++).string(transporte[i].Placa);
      ws.cell(fila, columna++).string(transporte[i].Chofer);
      ws.cell(fila, columna++).string(transporte[i].Estado);

      fila++;
    }

    wb.write("Transporte.xlsx", res);
  }
);
//Cargar vista para descargar reportes de movimientos

router.get(
  "/facturacion/reporte-ajustes",
  isAuthenticatedInventario,
  async (req, res) => {
    await stockDB
      .find({})
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              CodigoT: document.CodigoT,
            };
          }),
        };
        res.render("facturacion/inventario/reportes_movimientos", {
          stock: contex.stock,
        });
      });
  }
);

//vista de reportes de clientes

router.get(
  "/facturacion/reporte-cliente",
  isAuthenticatedCliente,
  async (req, res) => {
    await clienteDB
      .find()
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          cliente: document.map((document) => {
            return {
              Empresa: document.Empresa,
            };
          }),
        };
        res.render("facturacion/cliente/reportes", {
          cliente: contex.cliente,
        });
      });
  }
);

//vista de reportes de stock
router.get("/facturacion/reporte-stock",isAuthenticatedInventario, async (req, res) => {
  let stock = await stockDB.find()

  for(i=0; i < stock.length; i++){
    let CantidadTotal = stock[i].CantidadTotal
    let CostoFOBTotal = (+CantidadTotal * +stock[i].CostoFOB).toFixed(2)
    let CostoTotal = (+CantidadTotal * +stock[i].Costo).toFixed(2)
    let CostoGranMayorTotal = (+CantidadTotal * +stock[i].CostoGranMayor).toFixed(2)
    let CostoMayorTotal = (+CantidadTotal * +stock[i].CostoMayor).toFixed(2)
    let CostoDetalTotal = (+CantidadTotal * +stock[i].CostoDetal).toFixed(2)
  
  
    await stockDB.findByIdAndUpdate(stock[i]._id,{
      CostoFOBTotal,
      CostoTotal,
      CostoGranMayorTotal,
      CostoMayorTotal,
      CostoDetalTotal,
    })
  }
    res.render("facturacion/inventario/reportes_stock");
  }
);
//vista de reportes de cuentas por cobrar

router.get(
  "/facturacion/reporte-cxc",
  isAuthenticatedCobranza,
  async (req, res) => {
    await facturaDB
      .find({ Estado: "Por cobrar" })
      .sort({ date: -1 })
      .then((document) => {
        const contex = {
          factura: document.map((document) => {
            return {
              Cliente: document.Cliente,
            };
          }),
        };
        res.render("facturacion/cobranza/reporte-cuentas-por-cobrar", {
          factura: contex.factura,
        });
      });
  }
);

//ruta para realizar orden al proveedor
router.get("/facturacion/realizar-ordenes", isAuthenticatedProveedor, async (req, res) => {
  let ordenesProveedor = await ordenComprasProveedorDB.find().sort({OrdenNumero: -1})
  for(r=0; r< ordenesProveedor.length; r++){
    for(x=0; x < ordenesProveedor[r].Productos.length; x++){
      let producto = await stockDB.findOne({CodigoT: ordenesProveedor[r].Productos[x].CodigoT})
      await stockDB.findByIdAndUpdate(producto._id,{
        CantidadProduccion: 0,
        CantidadTransito: 0
      })
    }
  }
  for(i=0; i< ordenesProveedor.length; i++){
    if(ordenesProveedor[i].Estado == "Producción" || ordenesProveedor[i].Estado == "Produccion"){
      for(x=0; x < ordenesProveedor[i].Productos.length; x++){
        let producto = await stockDB.findOne({CodigoT: ordenesProveedor[i].Productos[x].CodigoT})
        let CantidadProduccion = +producto.CantidadProduccion + +ordenesProveedor[i].Productos[x].Cantidad
        await stockDB.findByIdAndUpdate(producto._id,{
          CantidadProduccion:CantidadProduccion
        })
      }
    }if(ordenesProveedor[i].Estado == "Transito"){
      for(x=0; x < ordenesProveedor[i].Productos.length; x++){
        let producto = await stockDB.findOne({CodigoT: ordenesProveedor[i].Productos[x].CodigoT})
        let CantidadTransito = +producto.CantidadTransito + +ordenesProveedor[i].Productos[x].Cantidad
        await stockDB.findByIdAndUpdate(producto._id,{
          CantidadTransito:CantidadTransito
        })
      }
    }
  }
  await proveedorDB.find().then(async (documento) => {
    const contexto = {
      proveedor: documento.map((documento) => {
        return {
          Nombre: documento.Nombre,
        };
      }),
    };

    res.render("facturacion/proveedor/realizar-orden", {
      proveedor: contexto.proveedor,
    });
  });
  }
);

//ruta para enviar stock a realizar orden

router.post("/solicitar-info-todos-productos",isAuthenticatedProveedor,async (req, res) => {
  const stock = await stockDB.find().sort({ TipoProducto: 1, Modelo: 1 });
    const contex = {
      stock: stock.map((document) => {
        return {
          CodigoT: document.CodigoT,
          CodigoG: document.CodigoG,
          Modelo: document.Modelo,
          Posicion: document.Posicion,
          Ano: document.Año,
          TipoProducto: document.TipoProducto,
          Vehiculo: document.Vehiculo,
          CantidadTotal: document.CantidadTotal,
          Familia: document.Familia,
          Precio: document.CostoFOB,
          Costo: document.Costo,
          CostoGranMayor: document.CostoGranMayor,
          CostoMayor: document.CostoMayor,
          CostoDetal: document.CostoDetal,
          Precio: document.CostoFOB,
          Proveedor: document.Proveedor,
          CantidadVendida: document.CantidadVendida,
        };
      }),
    };

    for(i=0; i< contex.stock.length;i++){ 
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

      let ordenProveedor = await ordenComprasProveedorDB.find();

      for (y = 0; y < ordenProveedor.length; y++) {
        for (z = 0; z < ordenProveedor[y].Productos.length; z++) {
          if (
            ordenProveedor[y].Productos[z].CodigoT == contex.stock[i].CodigoT
          ) {
            contex.stock[i].EstadoMovimiento = ordenProveedor[y].Estado;
          }
        }
      }
    }
    
    let ordenes = await ordenComprasProveedorDB.find();
    for (p = 0; p < contex.stock.length; p++) {
      if (contex.stock[p].CantidadTotal == 0) {
        contex.stock[p].Estado = "Sin stock";
      } else {
        contex.stock[p].Estado = "Stock";
      }
      for (n = 0; n < ordenes.length; n++) {
        contex.stock[p].CantidadProduccion = 0;
        contex.stock[p].CantidadTransito = 0;
        for (m = 0; m < ordenes[n].Productos.length; m++) {
          if (ordenes[n].Productos[m].CodigoT == contex.stock[p].CodigoT) {
            if (ordenes[n].Estado == "Produccion") {
              contex.stock[p].CantidadProduccion +=
                ordenes[n].Productos[m].Cantidad;
              contex.stock[p].Estado = `${contex.stock[p].Estado} Producción`;
            } else {
              contex.stock[p].CantidadTransito +=
                ordenes[n].Productos[m].Cantidad;
              contex.stock[p].Estado = `${contex.stock[p].Estado} Transito`;
            }
          }
        }
      }
    }
    res.send(JSON.stringify(contex.stock));
  }
);

//info proveedor
router.post("/solicitar-informacion-proveedor-productos",isAuthenticatedProveedor,async (req, res) => {
    let {Proveedor} = req.body
    const stock = await stockDB.find({Proveedor:Proveedor}).sort({ TipoProducto: 1, Modelo: 1 });
    const contex = {
      stock: stock.map((document) => {
        return {
          CodigoT: document.CodigoT,
          CodigoG: document.CodigoG,
          Modelo: document.Modelo,
          Posicion: document.Posicion,
          Ano: document.Año,
          TipoProducto: document.TipoProducto,
          Vehiculo: document.Vehiculo,
          CantidadTotal: document.CantidadTotal,
          Familia: document.Familia,
          Precio: document.CostoFOB,
          Costo: document.Costo,
          CantidadTransito: document.CantidadTransito,
          CantidadProduccion: document.CantidadProduccion,
          CostoGranMayor: document.CostoGranMayor,
          CostoMayor: document.CostoMayor,
          CostoDetal: document.CostoDetal,
          Precio: document.CostoFOB,
          Proveedor: document.Proveedor,
          CantidadVendida: document.CantidadVendida,
          Unidades: document.Unidades,
          Alto: document.Alto,
          Peso: document.Peso,
          Largo: document.Largo,
          Ancho: document.Ancho,
        };
      }),
    };

    for(i=0; i< contex.stock.length;i++){ 
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

      let ordenProveedor = await ordenComprasProveedorDB.find();

      for (y = 0; y < ordenProveedor.length; y++) {
        for (z = 0; z < ordenProveedor[y].Productos.length; z++) {
          if (
            ordenProveedor[y].Productos[z].CodigoT == contex.stock[i].CodigoT
          ) {
            contex.stock[i].EstadoMovimiento = ordenProveedor[y].Estado;
          }
        }
      }
    }
    let ordenes = await ordenComprasProveedorDB.find();
    
   
    res.send(JSON.stringify(contex.stock));
  }
);





router.post(
  "/solicitar-info-todos-productos-agregar",
  isAuthenticatedProveedor,
  async (req, res) => {
    const stock = await stockDB.find().sort({ TipoProducto: 1, Modelo: 1 });
    for (i = 0; i < stock.length; i++) {
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
      stock[i].Descripcion = Descripcion;
    }
    const contex = {
      stock: stock.map((document) => {
        return {
          CodigoT: document.CodigoT,
          CodigoG: document.CodigoG,
          Modelo: document.Modelo,
          Posicion: document.Posicion,
          Ano: document.Año,
          TipoProducto: document.TipoProducto,
          Vehiculo: document.Vehiculo,
          CantidadTotal: document.CantidadTotal,
          Familia: document.Familia,
          Precio: document.CostoFOB,
          Costo: document.Costo,
          CostoGranMayor: document.CostoGranMayor,
          CostoMayor: document.CostoMayor,
          CostoDetal: document.CostoDetal,
          Precio: document.CostoFOB,
          Proveedor: document.Proveedor,
          CantidadVendida: document.CantidadVendida,
          Descripcion: document.Descripcion,
        };
      }),
    };
 
    res.send(JSON.stringify(contex.stock));
  }
);

router.post(
  "/validar-codigo-orden-temporal-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    const { CodigoT } = req.body;
    let validacion = await ordenProveedorTemporalDB.find();
    let validacion2;

    if (validacion.length > 0) {
      for (i = 0; i < validacion[0].Productos.length; i++) {
        if (validacion[0].Productos[i].CodigoT == CodigoT) {
          validacion2 = true;
        }
      }
    }
    if (validacion2) {
      let data = {
        validacion: false,
      };
      res.send(JSON.stringify(data));
    } else {
      let data = {
        validacion: true,
      };
      res.send(JSON.stringify(data));
    }
  }
);


router.post(
  "/validar-codigo-orden-existente-proveedor/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    const { CodigoT } = req.body;
    let validacion = await ordenComprasProveedorDB.find({OrdenNumero: req.params.id});
    let validacion2;

    if (validacion.length > 0) {
      for (i = 0; i < validacion[0].Productos.length; i++) {
        if (validacion[0].Productos[i].CodigoT == CodigoT) {
          validacion2 = true;
        }
      }
    }
    if (validacion2) {
      let data = {
        validacion: false,
      };
      res.send(JSON.stringify(data));
    } else {
      let data = {
        validacion: true,
      };
      res.send(JSON.stringify(data));
    }
  }
);

//crear orden temporal

router.post("/enviar-producto-orden-temporal-proveedor",isAuthenticatedProveedor,async (req, res) => {
    let { producto, proveedor } = req.body;
    let ordenTemporal = await ordenProveedorTemporalDB.find();
    if (ordenTemporal.length > 0) {
      //existe una orden temporal
      let validacion = ordenTemporal.find((data) => data.Proveedor == proveedor);
      if (validacion) {
        let metrosCubicos = (+producto.Alto * +producto.Largo * +producto.Ancho * +producto.Cantidad)
        metrosCubicos = +metrosCubicos / 1000000
        metrosCubicos = metrosCubicos.toFixed(2)
        let Peso = (+producto.Peso + +ordenTemporal[0].Peso).toFixed(2)
        let CantidadTotal = +ordenTemporal[0].CantidadTotal + +producto.Cantidad;
        let PrecioTotal = (+ordenTemporal[0].PrecioTotal + +producto.PrecioTotal).toFixed(2);
        let VeintePies = +ordenTemporal[0].VeintePies 
        if(+ordenTemporal[0].VeintePies < 30){
          VeintePies = +ordenTemporal[0].VeintePies + +metrosCubicos
        }
        if(+VeintePies > 30){
          VeintePies = 30
        }
        let CuarentaPies = ordenTemporal[0].CuarentaPies
        if(+ordenTemporal[0].CuarentaPies < 69){
          CuarentaPies = +ordenTemporal[0].CuarentaPies + +metrosCubicos
        }
        if(CuarentaPies > 69){
          CuarentaPies = 69
        }
        CuarentaPies = CuarentaPies.toFixed(2)
        VeintePies = VeintePies.toFixed(2)
        let CuarentaPiesHQ = +ordenTemporal[0].CuarentaPiesHQ + +metrosCubicos
        CuarentaPiesHQ = CuarentaPiesHQ.toFixed(2)
        await ordenProveedorTemporalDB.findByIdAndUpdate(ordenTemporal[0]._id, {
          CantidadTotal: CantidadTotal,
          VeintePies: VeintePies,
          CuarentaPies: CuarentaPies,
          CuarentaPiesHQ: CuarentaPiesHQ,
          PrecioTotal: PrecioTotal,
          Peso: Peso,
          $push: { Productos: producto },
        });

        let data = {
          error: false,
          ModeloProducto: producto.Modelo,
          Cantidad: producto.Cantidad,
          PrecioTotal: producto.PrecioTotal,
          metrosCubicos: metrosCubicos,
          Peso: Peso,
        };
        res.send(JSON.stringify(data));
      } else {
        let data = {
          error:
            "El proveedor que intenta agregar es diferente al que se encuentra en la lista. Por favor, valide e intente de nuevo.",
        };
        res.send(JSON.stringify(data));
      }
    } else {
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
      let metrosCubicos = (+producto.Alto * +producto.Largo * +producto.Ancho * +producto.Cantidad)
      metrosCubicos = +metrosCubicos / 1000000
      metrosCubicos = metrosCubicos.toFixed(2)
      let nuevaOrden = new ordenProveedorTemporalDB({
        date: date,
        Proveedor: proveedor,
        Productos: producto,
        CantidadTotal: producto.Cantidad,
        PrecioTotal: producto.PrecioTotal,
        VeintePies: metrosCubicos,
        CuarentaPies: metrosCubicos,
        CuarentaPiesHQ: metrosCubicos,
        Peso: producto.Peso,

      });
      await nuevaOrden.save();
      let data = {
        error: false,
        ModeloProducto: nuevaOrden.Productos[0].Modelo,
        Cantidad: nuevaOrden.CantidadTotal,
        PrecioTotal: nuevaOrden.PrecioTotal,
        metrosCubicos: metrosCubicos,
        Peso: producto.Peso,
      };

      res.send(JSON.stringify(data));
    }
  }
);
router.post(
  "/enviar-producto-orden-existente-proveedor/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    let { producto } = req.body;
    let orden = await ordenComprasProveedorDB.findOne({OrdenNumero: req.params.id});
        let CantidadTotal =
          +orden.CantidadTotal + +producto.Cantidad;
        let PrecioTotal = (
          +orden.PrecioTotal + +producto.PrecioTotal
        ).toFixed(2);
        await ordenComprasProveedorDB.findByIdAndUpdate(orden._id, {
          CantidadTotal: CantidadTotal,
          PrecioTotal: PrecioTotal,
          $push: { Productos: producto },
        });

        let data = {
          error: false,
          ModeloProducto: producto.Modelo,
          Cantidad: producto.Cantidad,
          PrecioTotal: producto.PrecioTotal,
        };
        res.send(JSON.stringify(data));
  }
);

//ruta para recibir nueva orden
router.post(
  "/realizar-orden-proveedor/nueva",
  isAuthenticatedProveedor,
  async (req, res) => {
    let { Proveedor, date, Productos, CantidadTotal, PrecioTotal } = req.body;

    const ordenTemporal = await ordenProveedorTemporalDB.find();

    PrecioTotal = PrecioTotal.toFixed(2);

    if (ordenTemporal.length >= 1) {
      if (Proveedor != ordenTemporal[0].Proveedor) {
        error = [
          { text: "No se pueden agregar productos de diferentes proveedores" },
        ];
        res.send(JSON.stringify(error));
        return;
      }
    }
    if (ordenTemporal.length >= 1) {
      let CantidadTotalNueva = +ordenTemporal[0].CantidadTotal + +CantidadTotal;
      let PrecioTotalNuevo = (
        +ordenTemporal[0].PrecioTotal + +PrecioTotal
      ).toFixed(2);
      await ordenProveedorTemporalDB.findByIdAndUpdate(ordenTemporal[0]._id, {
        CantidadTotal: CantidadTotalNueva,
        PrecioTotal: PrecioTotalNuevo,
        $push: { Productos: Productos },
      });
      registrado = [{ text: "ok" }];
      res.send(JSON.stringify(registrado));
      return;
    } else {
      const ordenProveedorTemporal = new ordenProveedorTemporalDB({
        date,
        Proveedor,
        Productos,
        CantidadTotal,
        PrecioTotal,
      });

      await ordenProveedorTemporal.save();
      registrado = [{ text: "ok" }];
      res.send(JSON.stringify(registrado));
    }
  }
);

//ruta para cargar vista de lista de compra de proveedor
router.get(
  "/facturacion/lista-compra-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    res.render("facturacion/proveedor/lista-compra-proveedor");
  }
);

//ruta para enviar datos de orden temporal proveedor

router.post(
  "/facturacion/ver-orden-temporal",
  isAuthenticatedProveedor,
  async (req, res) => {
    const ordenTemporal = await ordenProveedorTemporalDB.find();

    res.send(JSON.stringify(ordenTemporal));
  }
);

//recibiendo datos para generar orden de compra al proveedor
router.post(
  "/registrar-orden-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    let { Proveedor, Productos, CantidadTotal, _id, date, PrecioTotal, VeintePies, CuarentaPies, CuarentaPiesHQ, Peso } = req.body;

    let OrdenTemporal = _id;

    const ordenes = await ordenComprasProveedorDB.find().sort({"OrdenNumero": -1 });

    let OrdenNumero = 0;
    if (ordenes.length > 0) {
      OrdenNumero = +ordenes[0].OrdenNumero + 1
    } else {
      OrdenNumero = 20210001;
    }

    for (i = 0; i < Productos.length; i++) {
      let producto = await stockDB.findOne({ CodigoT: Productos[i].CodigoT });
      Productos[i].Posicion = producto.Posicion;
      Productos[i].CodigoG = producto.CodigoG;
      Productos[i].TipoProducto = producto.TipoProducto;
      Productos[i].CostoFOB = producto.CostoFOB;
      Productos[i].Costo = producto.Costo;
      Productos[i].CostoGranMayor = producto.CostoGranMayor;
      Productos[i].CostoMayor = producto.CostoMayor;
      Productos[i].CostoDetal = producto.CostoDetal;
      let CantidadProduccion = +producto.CantidadProduccion + +Productos[i].Cantidad

      await stockDB.findByIdAndUpdate(producto._id,{
        CantidadProduccion:CantidadProduccion
      })
    }
    const nuevaOrden = new ordenComprasProveedorDB({
      VeintePies,
      CuarentaPies, 
      CuarentaPiesHQ, 
      Peso,
      Proveedor,
      Productos,
      CantidadTotal,
      PrecioTotal,
      date,
      OrdenTemporal,
      OrdenNumero,
    });
    await nuevaOrden.save();
    let ordenTemporal = await ordenProveedorTemporalDB.find();
    await ordenProveedorTemporalDB.findByIdAndDelete(ordenTemporal[0]._id);
    //await ordenProveedorTemporalDB.findByIdAndDelete(_id);
    let respuesta = [{ text: OrdenTemporal }];
    res.send(JSON.stringify(respuesta));
  }
);

//ruta para decargar excel desde lista de todas las ordenes

router.get(
  "/generar-excel-compra/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    const compra = await ordenComprasProveedorDB.findOne({
      OrdenTemporal: req.params.id,
    });

    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet(`Thomson`);

    const style = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#FFFF00",
        fgColor: "#FFFF00",
      },
    });

    ws.cell(1, 1).string("Codigo").style(style);
    ws.cell(1, 2).string("Codigo gabriel").style(style);
    ws.cell(1, 3).string("Descripcion").style(style);
    ws.cell(1, 4).string("Posicion").style(style);
    ws.cell(1, 5).string("Modelo").style(style);
    ws.cell(1, 6).string("Cantidad").style(style);
    ws.cell(1, 7).string("Alto").style(style);
    ws.cell(1, 8).string("Largo").style(style);
    ws.cell(1, 9).string("Ancho").style(style);
    ws.cell(1, 10).string("cbm").style(style);
    ws.cell(1, 11).string("Precio unidad").style(style);
    ws.cell(1, 12).string("Total").style(style);

    for (i = 0; i < compra.Productos.length; i++) {
      let stock = await stockDB.findOne({
        CodigoT: compra.Productos[i].CodigoT,
      });
      compra.Productos[i].Modelo = stock.Familia;
    }

    let fila = 2;
    let total = 0;
    let totalGeneral = 0;
    let cbmTotal = 0
    for (i = 0; i < compra.Productos.length; i++) {
      columna = 1; 
      total = (   +compra.Productos[i].Cantidad * compra.Productos[i].PrecioUnidad ).toFixed(2);
      cbm = 0
      alto = 0
      largo = 0
      ancho = 0
      if(compra.Productos[i].Alto){
        cbm = (+compra.Productos[i].Alto * +compra.Productos[i].Ancho * +compra.Productos[i].Largo * +compra.Productos[i].Cantidad)/1000000
        alto = +compra.Productos[i].Alto
        largo = +compra.Productos[i].Ancho
        ancho = +compra.Productos[i].Largo
        cbm = cbm.toFixed(2)
        cbmTotal += +cbm
      }
      ws.cell(fila, columna++).string(compra.Productos[i].CodigoT);
      ws.cell(fila, columna++).string(compra.Productos[i].CodigoG);
      ws.cell(fila, columna++).string(compra.Productos[i].Descripcion);
      ws.cell(fila, columna++).string(compra.Productos[i].Posicion);
      ws.cell(fila, columna++).string(compra.Productos[i].Modelo);
      ws.cell(fila, columna++).number(compra.Productos[i].Cantidad);
      ws.cell(fila, columna++).number(alto);
      ws.cell(fila, columna++).number(largo);
      ws.cell(fila, columna++).number(ancho);
      ws.cell(fila, columna++).number(+cbm);
      ws.cell(fila, columna++).number(compra.Productos[i].PrecioUnidad);
      ws.cell(fila, columna++).string(total);
      fila++;
      totalGeneral += +total;
    }

    ws.cell(fila, 9).string("Total");
    ws.cell(fila, 10).number(cbmTotal);
    ws.cell(fila, 12).number(totalGeneral);

    wb.write("Orden compra Thomson.xlsx", res);
  }
);
//ruta para decargar excel de la ultima compra

router.post(
  "/generar-excel-compra/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    const compra = await ordenComprasProveedorDB.findOne({
      OrdenTemporal: req.params.id,
    });

    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet(`Thomson`);

    const style = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#FFFF00",
        fgColor: "#FFFF00",
      },
    });

    ws.cell(1, 1).string("Codigo").style(style);
    ws.cell(1, 2).string("Cantidad").style(style);
    ws.cell(1, 3).string("Precio unidad").style(style);
    ws.cell(1, 4).string("Precio total").style(style);

    let fila = 2;
    let total = 0;
    for (i = 0; i < compra.Productos.length; i++) {
      columna = 1;
      total = (
        +compra.Productos[i].Cantidad * compra.Productos[i].PrecioUnidad
      ).toFixed(2);
      ws.cell(fila, columna++).string(compra.Productos[i].CodigoT);
      ws.cell(fila, columna++).number(compra.Productos[i].Cantidad);
      ws.cell(fila, columna++).number(compra.Productos[i].PrecioUnidad);
      ws.cell(fila, columna++).string(total);
      fila++;
    }

    wb.write("Orden compra Thomson.xlsx", res);
  }
);

//ruta para generar pdf de orden

router.get(
  "/generar-pdf-compra/:id",
  isAuthenticatedProveedor,
  async (req, res) => {
    const compra = await ordenComprasProveedorDB.findOne({
      OrdenTemporal: req.params.id,
    });
    let compras = compra.Productos;
    for (i = 0; i < compras.length; i++) {
      let stock = await stockDB.findOne({ CodigoT: compras[i].CodigoT });
      compras[i].Modelo = stock.Familia;
    }
    let productos = compras.map((data) => {
      return {
        Proveedor: compra.Proveedor,
        CodigoT: data.CodigoT,
        CodigoG: data.CodigoG,
        Descripcion: data.Descripcion,
        Modelo: data.Modelo,
        Posicion: data.Posicion,
        Cantidad: data.Cantidad,
        PrecioUnidad: data.PrecioUnidad,
        PrecioTotal: data.PrecioTotal,
      };
    });
    let Titulo = "Orden " + compra.OrdenNumero + " " + productos[0].Proveedor;

    if(compra.CuarentaPiesHQ){
        let MCB = compra.CuarentaPiesHQ
        let peso = compra.Peso
          res.render("facturacion/reporte_pdf/orden-proveedor-pdf", {
            productos,
            Titulo,
            MCB,
            peso
          });

    }else{
          res.render("facturacion/reporte_pdf/orden-proveedor-pdf", {
            productos,
            Titulo,
          });

    }
  }
);

//ruta para ver ordenes generadas

router.get(
  "/facturacion/ordenes-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    await ordenComprasProveedorDB
      .find()
      .sort({ OrdenNumero: -1 })
      .then((document) => {
        const contex = {
          ordenes: document.map((document) => {
            return {
              MCB: document.CuarentaPiesHQ,
              Peso:document.Peso,
              date: document.date,
              Proveedor: document.Proveedor,
              OrdenNumero: document.OrdenNumero,
              Productos: document.Productos,
              CantidadTotal: document.CantidadTotal,
              PrecioTotal: document.PrecioTotal,
              Estado: document.Estado,
              OrdenTemporal: document.OrdenTemporal,
            };
          }),
        };
        res.render("facturacion/proveedor/ordenes-compras", {
          orden: contex.ordenes,
        });
      });
  }
);

//ruta para registrar garantías
router.get(
  "/facturacion/registrar-garantias",
  isAuthenticatedInventario,
  async (req, res) => {
    await stockDB
      .find()
      .sort({ date: -1 })
      .then(async (document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              CodigoT: document.CodigoT,
              _id: document._id,
            };
          }),
        };
        await proveedorDB
          .find()
          .sort({ date: -1 })
          .then((document) => {
            const contexto = {
              proveedor: document.map((document) => {
                return {
                  Nombre: document.Nombre,
                  _id: document._id,
                };
              }),
            };
            res.render("facturacion/inventario/registrar-garantias", {
              stock: contex.stock,
              Proveedor: contexto.proveedor,
            });
          });
      });
  }
);

//post para guardar las garantias

router.post(
  "/facturacion/registrar-garantias",
  isAuthenticatedInventario,
  async (req, res) => {
    let { CodigoT, Comentario, Proveedor, Cantidad } = req.body;
    Comentario = Comentario.toUpperCase();
    Proveedor = Proveedor.toUpperCase();

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
    let errors = [];
    if (Proveedor == 0) {
      errors.push({ text: 'El campo "Proveedor" no puede estar vacio' });
    }
    if (Cantidad == 0 || !Cantidad) {
      errors.push({ text: 'El campo "Cantidad" no puede estar vacio' });
    }
    if (!Comentario) {
      errors.push({ text: 'El campo "Comentario" no puede estar vacio' });
    }
    if (CodigoT == 0) {
      errors.push({ text: 'El campo "Codigo" no puede estar vacio' });
    }
    if (errors.length > 0) {
      await stockDB
        .find()
        .sort({ date: -1 })
        .then(async (document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
                _id: document._id,
              };
            }),
          };
          await proveedorDB
            .find()
            .sort({ date: -1 })
            .then((document) => {
              const contexto = {
                proveedor: document.map((document) => {
                  return {
                    Nombre: document.Nombre,
                    _id: document._id,
                  };
                }),
              };
              res.render("facturacion/inventario/registrar-garantias", {
                stock: contex.stock,
                Proveedor: contexto.proveedor,
                errors,
              });
            });
        });
    } else {
      const garantia = new garantiasDB({
        CodigoT,
        Comentario,
        date,
        Proveedor,
        Cantidad
      });

      await garantia.save();
      let ok = [{ text: "Garantía registrada correctamente" }];

      await stockDB
        .find()
        .sort({ date: -1 })
        .then(async (document) => {
          const contex = {
            stock: document.map((document) => {
              return {
                CodigoT: document.CodigoT,
                _id: document._id,
              };
            }),
          };
          await proveedorDB
            .find()
            .sort({ date: -1 })
            .then((document) => {
              const contexto = {
                proveedor: document.map((document) => {
                  return {
                    Nombre: document.Nombre,
                    _id: document._id,
                  };
                }),
              };
              res.render("facturacion/inventario/registrar-garantias", {
                stock: contex.stock,
                Proveedor: contexto.proveedor,
                ok,
              });
            });
        });
    }
  }
);

//ruta para ver las garantía

router.get("/facturacion/ver-garantias",  isAuthenticatedInventario,  async (req, res) => {
    let proveedores = await proveedorDB.find().sort({"Nombre": -1})
    let garantias = await garantiasDB.find()
    let cantidadTotal = 0 
    for(i=0; i< garantias.length; i++){
      cantidadTotal += +garantias[i].Cantidad
    }
    proveedores = proveedores.map((data) => {
      return{
        Empresa: data.Nombre,
        _id: data._id
      }
    })
    garantias = garantias.map((data) => {
      return{
        CodigoT: data.CodigoT,
        Comentario: data.Comentario,
        Fecha: data.date,
        Proveedor: data.Proveedor,
        Cantidad: data.Cantidad,
        Estado: data.Estado,
        _id: data._id,
      }
    })
    res.render("facturacion/inventario/ver-garantias",{
      garantias,
      proveedores,
      cantidadTotal
    })

  }
);

router.post('/solicitar-garantias-por-filtro', isAuthenticatedInventario,async (req, res) => {
  let {Proveedor, Estado} = req.body

  if(Proveedor == 0){
    let garantias = await garantiasDB.find({Estado: Estado}).sort({"Timestamp": -1})
    let CantidadTotal = 0
    for(i=0; i< garantias.length; i++){
      CantidadTotal += garantias[i].Cantidad
    }
    let data = {
      garantias,
      CantidadTotal
    }
    res.send(JSON.stringify(data))
  }else{
    if(Estado == 0){
      let garantias = await garantiasDB.find({Proveedor: Proveedor}).sort({"Timestamp": -1})
      let CantidadTotal = 0
      for(i=0; i< garantias.length; i++){
        CantidadTotal += garantias[i].Cantidad
      }
      let data = {
        garantias,
        CantidadTotal
      }
      res.send(JSON.stringify(data))
    }else{
      let garantias = await garantiasDB.find({$and:  [{Proveedor: Proveedor},{Estado:Estado}]}).sort({"Timestamp": -1})
      let CantidadTotal = 0
      for(i=0; i< garantias.length; i++){
        CantidadTotal += garantias[i].Cantidad
      }
      let data = {
        garantias,
        CantidadTotal
      }
      res.send(JSON.stringify(data))
    }
  }
})

router.get('/cambiar-estado-garantia/:id', isAuthenticatedInventario, async (req, res) => {
  await garantiasDB.findByIdAndUpdate(req.params.id,{
    Estado: "Procesado"
  })
  res.redirect('/facturacion/ver-garantias')
})

//ruta para eliminar garantía

router.get('/editar-garantia/:id', isAuthenticatedInventario ,async (req, res) => {
  let garantia = await garantiasDB.findById(req.params.id)
  let proveedores = await proveedorDB.find()
  proveedores = proveedores.map((data) => {
    return{
      Nombre: data.Nombre,
    }
  })
  garantia = {
    date: garantia.date,
    CodigoT: garantia.CodigoT,
    Comentario: garantia.Comentario,
    Proveedor: garantia.Proveedor,
    Estado: garantia.Estado,
    Cantidad: garantia.Cantidad,
    _id: garantia._id,
  }

  res.render('facturacion/inventario/editar-garantia',{
    garantia,
    proveedores
  })

})


router.post('/actializar-garantia/:id', isAuthenticatedInventario, async (req, res) => {
  let _id = req.params.id
  let {CodigoT, Cantidad, Comentario, Proveedor} = req.body
  if(!CodigoT || CodigoT == 0){
    req.flash("error", 'El campo "Código" no puede estar vacío')
    res.redirect(`/editar-garantia/${_id}`)
    return
  }
  if(!Cantidad || Cantidad == 0){
    req.flash("error", 'El campo "Cantidad" no puede estar vacío')
    res.redirect(`/editar-garantia/${_id}`)
    return
  }
  if(!Comentario || Comentario == 0){
    req.flash("error", 'El campo "Garantía" no puede estar vacío')
    res.redirect(`/editar-garantia/${_id}`)
    return
  }
  if(!Proveedor || Proveedor == 0){
    req.flash("error", 'El campo "Proveedor" no puede estar vacío')
    res.redirect(`/editar-garantia/${_id}`)
    return
  }
  await garantiasDB.findByIdAndUpdate(_id,{
    CodigoT,
    Cantidad,
    Comentario,
    Proveedor
  })

  req.flash("success", "Garantía actualizada correctamente")
  res.redirect(`/editar-garantia/${_id}`)

})

router.post('/eliminar-garantia/:id',isAuthenticatedInventario, async (req, res) => {
  await garantiasDB.findByIdAndDelete(req.params.id)
  res.redirect('/facturacion/ver-garantias')
})



//ruta de acceso directo de a stock

router.get(
  "/facturacion/acceso-directo-stock",
  isAuthenticatedThomson,
  async (req, res) => {
    await stockDB
      .find()
      .sort({ TipoProducto: 1, Modelo: 1 })
      .then(async (document) => {
        const contex = {
          stock: document.map((document) => {
            return {
              date: document.date,
              FechaUltimoIngreso: document.FechaUltimoIngreso,
              TipoVehiculo: document.TipoVehiculo,
              Marca: document.Marca,
              Modelo: document.Modelo,
              Desde: document.Desde,
              Hasta: document.Hasta,
              TipoProducto: document.TipoProducto.toUpperCase(),
              Nombre: document.Nombre,
              Proveedor: document.Proveedor,
              Familia: document.Familia.toUpperCase(),
              CodigoT: document.CodigoT,
              CodigoG: document.CodigoG,
              Posicion: document.Posicion.toUpperCase(),
              Vehiculo: document.Vehiculo,
              Cantidad: document.Cantidad,
              CostoM: document.CostoM,
              Costo: document.Costo,
              CostoTotal: document.CostoTotal,
              Precio: document.Precio,
              CostoMT: document.CostoMT,
              CostoT: document.CostoT,
              PrecioT: document.PrecioT,
              User: document.User,
              _id: document._id,
              TipoVehiculo: document.TipoVehiculo,
              Modelo: document.Modelo,
              Año: document.Modelo,
              CantidadTotal: document.CantidadTotal,
              CostoFOB: document.CostoFOB,
              CostoGranMayor: document.CostoGranMayor,
              CostoMayor: document.CostoMayor,
              CostoDetal: document.CostoDetal,
              User: document.User,
            };
          }),
        };

        for (i = 0; i < contex.stock.length; i++) {
          let Descripcion = "";
          for (x = 0; x < contex.stock[i].Vehiculo.length; x++) {
            if (
              contex.stock[i].Vehiculo[x].Modelo ==
              contex.stock[i].Vehiculo[contex.stock[i].Vehiculo.length - 1]
                .Modelo
            ) {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}`;
            } else {
              Descripcion += `${contex.stock[i].Vehiculo[x].Marca} ${contex.stock[i].Vehiculo[x].Modelo} ${contex.stock[i].Vehiculo[x].Desde}-${contex.stock[i].Vehiculo[x].Hasta}, `;
            }
          }
          contex.stock[i].Descripcion = Descripcion;
          PorcentajeCosto = (
            (contex.stock[i].Costo * 100) / contex.stock[i].CostoFOB -
            100
          ).toFixed(2);
          PorcentajeCostoGranMayor = (
            (contex.stock[i].CostoGranMayor * 100) / contex.stock[i].Costo -
            100
          ).toFixed(2);
          PorcentajeCostoMayor = (
            (contex.stock[i].CostoMayor * 100) / contex.stock[i].Costo -
            100
          ).toFixed(2);
          PorcentajeCostoDetal = (
            (contex.stock[i].CostoDetal * 100) / contex.stock[i].Costo -
            100
          ).toFixed(2);

          contex.stock[
            i
          ].Costo = `${contex.stock[i].Costo} (${PorcentajeCosto}%)`;
          contex.stock[
            i
          ].CostoGranMayor = `${contex.stock[i].CostoGranMayor} (${PorcentajeCostoGranMayor}%)`;
          contex.stock[
            i
          ].CostoMayor = `${contex.stock[i].CostoMayor} (${PorcentajeCostoMayor}%)`;
          contex.stock[
            i
          ].CostoDetal = `${contex.stock[i].CostoDetal} (${PorcentajeCostoDetal}%)`;
        }
        let ordenes = await ordenComprasProveedorDB.find();
        for (p = 0; p < contex.stock.length; p++) {
          if (contex.stock[p].CantidadTotal == 0) {
            contex.stock[p].Estado = "Sin stock";
          } else {
            contex.stock[p].Estado = "Stock";
          }
          for (n = 0; n < ordenes.length; n++) {
            for (m = 0; m < ordenes[n].Productos.length; m++) {
              if (ordenes[n].Productos[m].CodigoT == contex.stock[p].CodigoT) {
                if (ordenes[n].Estado == "Produccion") {
                  contex.stock[p].CantidadProduccion =
                    ordenes[n].Productos[m].Cantidad;
                  contex.stock[
                    p
                  ].Estado = `${contex.stock[p].Estado} Producción`;
                } else {
                  contex.stock[p].CantidadTransito =
                    ordenes[n].Productos[m].Cantidad;
                  contex.stock[p].Estado = `${contex.stock[p].Estado} Transito`;
                }
              }
            }
          }
        }
        res.render("facturacion/inventario/acceso-directo-stock", {
          stock: contex.stock,
        });
      });
  }
);

//post para enviar datos del producto a edit
router.post(
  "/facturacion/info-stock-edit/:id",
  isAuthenticatedInventario,
  async (req, res) => {
    const stock = await stockDB.findById(req.params.id);
    res.send(JSON.stringify(stock));
  }
);

//--------------Post para agregar info nueva a la vista de crear stock---------------

router.post(
  "/crear-nombre-producto",
  isAuthenticatedInventario,
  async (req, res) => {
    let { Nombre } = req.body;
    Nombre = Nombre.toUpperCase();
    if (!Nombre) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      const NombreProducto = new NombreProductoDB({
        Nombre,
      });

      await NombreProducto.save();

      res.redirect("/facturacion/registrar-stock");
    }
  }
);

router.post(
  "/crear-modelo-producto",
  isAuthenticatedInventario,
  async (req, res) => {
    let { Nombre } = req.body;
    Nombre = Nombre.toUpperCase();

    if (!Nombre) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      const Modelo = new ModeloProductoDB({
        Nombre,
      });

      await Modelo.save();

      res.redirect("/facturacion/registrar-stock");
    }
  }
);

router.post(
  "/crear-marca-vehiculo",
  isAuthenticatedInventario,
  async (req, res) => {
    let { Nombre } = req.body;
    Nombre = Nombre.toUpperCase();
    if (!Nombre) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      const Marca = new MarcaVehiculoDB({
        Nombre,
      });

      await Marca.save();

      res.redirect("/facturacion/registrar-stock");
    }
  }
);

router.post(
  "/crear-modelo-vehiculo",
  isAuthenticatedInventario,
  async (req, res) => {
    let { Nombre } = req.body;
    Nombre = Nombre.toUpperCase();
    if (!Nombre) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      const Modelo = new ModeloVehiculoDB({
        Nombre,
      });

      await Modelo.save();

      res.redirect("/facturacion/registrar-stock");
    }
  }
);

//-----------------Post para eliminar de la vista de creacion de stock-------------------

router.delete(
  "/eliminar-nombre-producto",
  isAuthenticatedInventario,
  async (req, res) => {
    const { Nombre } = req.body;

    if (Nombre == 0) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      await NombreProductoDB.findOneAndDelete({ Nombre: Nombre });
      res.redirect("/facturacion/registrar-stock");
    }
  }
);

router.delete(
  "/eliminar-modelo-producto",
  isAuthenticatedInventario,
  async (req, res) => {
    const { Nombre } = req.body;

    if (Nombre == 0) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      await ModeloProductoDB.findOneAndDelete({ Nombre: Nombre });
      res.redirect("/facturacion/registrar-stock");
    }
  }
);

router.delete(
  "/eliminar-marca-vehiculo",
  isAuthenticatedInventario,
  async (req, res) => {
    const { Nombre } = req.body;
    if (Nombre == 0) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      await MarcaVehiculo.findOneAndDelete({ Nombre: Nombre });
      res.redirect("/facturacion/registrar-stock");
    }
  }
);

router.delete(
  "/eliminar-modelo-vehiculo",
  isAuthenticatedInventario,
  async (req, res) => {
    const { Nombre } = req.body;

    if (Nombre == 0) {
      res.redirect("/facturacion/registrar-stock");
    } else {
      await ModeloVehiculoDB.findOneAndDelete({ Nombre: Nombre });
      res.redirect("/facturacion/registrar-stock");
    }
  }
);

//ruta para cargar estado de inventario

router.get(
  "/facturacion/estado-inventario",
  isAuthenticatedInventario,
  async (req, res) => {
    res.render("facturacion/inventario/estado-inventario");
  }
);

router.post(
  "/facturacion/info-ordenes/",
  isAuthenticatedInventario,
  async (req, res) => {
    const ordenes = await ordenComprasProveedorDB.find({
      Estado: { $ne: "Stock" },
    });
    res.send(JSON.stringify(ordenes));
  }
);

//ruta para recibir informacion de estado de inventario

router.post( "/facturacion/cambio-estado-inventario", isAuthenticatedInventario, async (req, res) => {
    const { productos, OrdenNumero, Estado, CantidadTotal, PrecioTotal } = req.body;
    let validacionOrden = await ordenComprasProveedorDB.findOne({OrdenNumero: OrdenNumero})
    let Timestamp = Date.now();
    Timestamp = Timestamp;
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

    let Productos = [];
    if(validacionOrden.Estado == "Produccion" &&  Estado == "Transito"){
      for(i=0; i< productos.length; i++){
        let stock = await stockDB.findOne({CodigoT: productos[i].CodigoT})
        let CantidadProduccion = +stock.CantidadProduccion - +productos[i].Cantidad
        let CantidadTransito = +stock.CantidadTransito + +productos[i].Cantidad

        await stockDB.findByIdAndUpdate(stock._id,{
          CantidadProduccion,
          CantidadTransito
        })

      }
    }
    if (Estado != "Stock") {
      let CuarentaPiesHQ = 0
      let PesoOrden = 0
      for (i = 0; i < validacionOrden.Productos.length; i++) {
        let productoConseguido = productos.find((data) =>  data.CodigoT == validacionOrden.Productos[i].CodigoT)
        let stock = await stockDB.findOne({CodigoT:  validacionOrden.Productos[i].CodigoT})
        validacionOrden.Productos[i].Cantidad = productoConseguido.Cantidad
        validacionOrden.Productos[i].PrecioTotal = productoConseguido.PrecioTotal
        validacionOrden.Productos[i].Peso = (+stock.Peso * +productoConseguido.Cantidad).toFixed(2)
        let metrosCubicos = (+validacionOrden.Productos[i].Alto * +validacionOrden.Productos[i].Ancho * +validacionOrden.Productos[i].Largo * +productoConseguido.Cantidad)/1000000
        PesoOrden += +validacionOrden.Productos[i].Peso
        CuarentaPiesHQ += +metrosCubicos
      }
      CuarentaPiesHQ = CuarentaPiesHQ.toFixed(2)
      PesoOrden = PesoOrden.toFixed(2)
      await ordenComprasProveedorDB.findOneAndUpdate(
        { OrdenNumero: OrdenNumero },
        {
          Productos: validacionOrden.Productos,
          CuarentaPiesHQ,
          Peso : PesoOrden,
          Estado,
          CantidadTotal,
          PrecioTotal,
        }
      );
    } else {
      for (i = 0; i < productos.length; i++) {
        let CodigoMovimiento = 0;
        let stock = await stockDB.findOne({ CodigoT: productos[i].CodigoT });

        if (stock.HistorialMovimiento.length > 0) {
          if (
            stock.HistorialMovimiento[stock.HistorialMovimiento.length - 1]
              .CodigoMovimiento
          ) {
            CodigoMovimiento =
              +stock.HistorialMovimiento[stock.HistorialMovimiento.length - 1]
                .CodigoMovimiento + 1;
          } else {
            CodigoMovimiento += 2101;
          }
        } else {
          CodigoMovimiento += 2101;
        }
        let CantidadTransito = +stock.CantidadTransito - +productos[i].Cantidad



        let HistorialMovimiento = {
          FechaMovimiento: date,
          CantidadAnterior: stock.CantidadTotal,
          CantidadMovida: productos[i].Cantidad,
          CantidadNueva: +stock.CantidadTotal + +productos[i].Cantidad,
          Comentario: "CARGA POR INGRESO DE STOCK",
          Timestamp: Timestamp,
          CodigoMovimiento: CodigoMovimiento,
          TipoMovimiento: "CARGA",
        };
        let CantidadTotal = +stock.CantidadTotal + +productos[i].Cantidad;
        let CostoFOBTotal = (+stock.CostoFOB * +CantidadTotal).toFixed(2);
        let CostoTotal = (+stock.Costo * +CantidadTotal).toFixed(2);
        let CostoGranMayorTotal = (
          +stock.CostoGranMayor * +CantidadTotal
        ).toFixed(2);
        let CostoMayorTotal = (+stock.CostoMayor * +CantidadTotal).toFixed(2);
        let CostoDetalTotal = (+stock.CostoDetal * +CantidadTotal).toFixed(2);

        await stockDB.findByIdAndUpdate(stock._id,{
            CantidadTotal: CantidadTotal,
            CostoFOBTotal: CostoFOBTotal,
            CostoTotal: CostoTotal,
            CostoGranMayorTotal: CostoGranMayorTotal,
            CostoMayorTotal: CostoMayorTotal,
            CostoDetalTotal: CostoDetalTotal,
            CantidadTransito: CantidadTransito,
            $push: { HistorialMovimiento: HistorialMovimiento },
          }
        );
        let CuarentaPiesHQ = 0
        let PesoOrden = 0
        for (i = 0; i < validacionOrden.Productos.length; i++) {
          let productoConseguido = productos.find((data) =>  data.CodigoT == validacionOrden.Productos[i].CodigoT)
          let stock = await stockDB.findOne({CodigoT:  validacionOrden.Productos[i].CodigoT})
          validacionOrden.Productos[i].Cantidad = productoConseguido.Cantidad
          validacionOrden.Productos[i].PrecioTotal = productoConseguido.PrecioTotal
          validacionOrden.Productos[i].Peso = (+stock.Peso * +productoConseguido.Cantidad).toFixed(2)
          let metrosCubicos = (+validacionOrden.Productos[i].Alto * +validacionOrden.Productos[i].Ancho * +validacionOrden.Productos[i].Largo * +productoConseguido.Cantidad)/1000000
          PesoOrden += +validacionOrden.Productos[i].Peso
          CuarentaPiesHQ += +metrosCubicos
        }
        CuarentaPiesHQ = CuarentaPiesHQ.toFixed(2)
        PesoOrden = PesoOrden.toFixed(2)
        await ordenComprasProveedorDB.findOneAndUpdate(
          { OrdenNumero: OrdenNumero },
          {
            Productos: validacionOrden.Productos,
            CuarentaPiesHQ,
            Peso : PesoOrden,
            Estado,
            CantidadTotal,
            PrecioTotal,
          }
        );
      }
    }

    let ok = "ok";
    res.status(202).send(JSON.stringify(ok));
  }
);

router.get("/pasar-mayuscula", async (req, res) => {
  const amortiguador = await stockDB.find({ TipoProducto: "Amortiguador" });

  for (i = 0; i < amortiguador.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: amortiguador[i].CodigoT },
      {
        TipoProducto: "AMORTIGUADOR",
      }
    );
  }

  const base = await stockDB.find({ TipoProducto: "Base de amortiguador" });

  for (i = 0; i < base.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: base[i].CodigoT },
      {
        TipoProducto: "BASE DE AMORTIGUADOR",
      }
    );
  }

  const Delanteros = await stockDB.find({ Posicion: "Delanteros" });

  for (i = 0; i < Delanteros.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: Delanteros[i].CodigoT },
      {
        Posicion: "DELANTEROS",
      }
    );
  }

  const traseros = await stockDB.find({ Posicion: "Traseros" });

  for (i = 0; i < traseros.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: traseros[i].CodigoT },
      {
        Posicion: "TRASEROS",
      }
    );
  }

  const delanteroDerecho = await stockDB.find({
    Posicion: "Delantero derecho",
  });

  for (i = 0; i < delanteroDerecho.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: delanteroDerecho[i].CodigoT },
      {
        Posicion: "DELANTERO DERECHO",
      }
    );
  }

  const delanteroIzquierdo = await stockDB.find({
    Posicion: "Delantero izquierdo",
  });

  for (i = 0; i < delanteroIzquierdo.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: delanteroIzquierdo[i].CodigoT },
      {
        Posicion: "DELANTERO IZQUIERDO",
      }
    );
  }

  const traseroDerecho = await stockDB.find({ Posicion: "Traseros derecho" });

  for (i = 0; i < traseroDerecho.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: traseroDerecho[i].CodigoT },
      {
        Posicion: "TRASERO DERECHO",
      }
    );
  }

  const traseroIzquierdo = await stockDB.find({
    Posicion: "Traseros izquierdo",
  });

  for (i = 0; i < traseroIzquierdo.length; i++) {
    await stockDB.findOneAndUpdate(
      { CodigoT: traseroIzquierdo[i].CodigoT },
      {
        Posicion: "TRASERO IZQUIERDO",
      }
    );
  }

  res.send("ok");
});

//solicitar info por codigo

router.post(
  "/solicitar-info-codigo",
  isAuthenticatedInventario,
  async (req, res) => {
    const { CodigoT } = req.body;
    let codigo = await stockDB.find({ CodigoT: CodigoT });
    let Descripcion = "";
    for (x = 0; x < codigo[0].Vehiculo.length; x++) {
      if (
        codigo[0].Vehiculo[x].Modelo ==
        codigo[0].Vehiculo[codigo[0].Vehiculo.length - 1].Modelo
      ) {
        Descripcion += `${codigo[0].Vehiculo[x].Marca} ${codigo[0].Vehiculo[x].Modelo} ${codigo[0].Vehiculo[x].Desde}-${codigo[0].Vehiculo[x].Hasta}`;
      } else {
        Descripcion += `${codigo[0].Vehiculo[x].Marca} ${codigo[0].Vehiculo[x].Modelo} ${codigo[0].Vehiculo[x].Desde}-${codigo[0].Vehiculo[x].Hasta}, `;
      }
      codigo[0].Descripcion = Descripcion;
    }

    let respuesta = {
      Descripcion: codigo[0].Descripcion,
      Stock: codigo[0].CantidadTotal,
    };

    res.send(JSON.stringify(respuesta));
  }
);

//enviar info de lista temporal a realizar orden

router.post(
  "/facturacion/ver-orden-temporal-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    let orden = await ordenProveedorTemporalDB.find();
    if (orden.length > 0) {
      let CantidadTotal = orden[0].CantidadTotal;
      let PrecioTotal = orden[0].PrecioTotal;
      let CantidadMcpherson = 0;
      let CantidadConvencional = 0;
      let CantidadBase = 0;
      let CantidadGuardapolvo = 0;
      for (i = 0; i < orden[0].Productos.length; i++) {
        if (
          orden[0].Productos[i].Modelo == "Convecional" ||
          orden[0].Productos[i].Modelo == "Conventional"
        ) {
          CantidadConvencional =
            +CantidadConvencional + orden[0].Productos[i].Cantidad;
        }
        if (orden[0].Productos[i].Modelo == "Mcpherson") {
          CantidadMcpherson =
            +CantidadMcpherson + orden[0].Productos[i].Cantidad;
        }
        if (
          orden[0].Productos[i].Modelo == "Strut mount" ||
          orden[0].Productos[i].Modelo == "Strut"
        ) {
          CantidadBase = +CantidadBase + orden[0].Productos[i].Cantidad;
        }
        if (orden[0].Productos[i].Modelo == "Boot") {
          CantidadGuardapolvo = +CantidadBase + orden[0].Productos[i].Cantidad;
        }
      }
      let data = {
        CantidadTotal: CantidadTotal,
        CostoFOB: PrecioTotal,
        CantidadMcpherson: CantidadMcpherson,
        CantidadConvencional: CantidadConvencional,
        CantidadBase: CantidadBase,
        CantidadGuardapolvo: CantidadGuardapolvo,
        veintePies:orden[0].VeintePies,
        cuarentaPies:orden[0].CuarentaPies,
        cuarentaPiesHC:orden[0].CuarentaPiesHQ,
        Peso: orden[0].Peso,
      };

      res.send(JSON.stringify(data));
    } else {
      let data = {
        CantidadMcpherson: 0,
        CantidadConvencional: 0,
        CantidadBase: 0,
        CantidadGuardapolvo: 0,
        CantidadTotal: 0,
        CostoFOB: 0,
        veintePies : 0,
        cuarentaPies : 0,
        cuarentaPiesHC : 0,
        Peso: 0, 
      };
      res.send(JSON.stringify(data));
    }
  }
);

router.post(
  "/eliminar-producto-lista-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    let { CodigoT, Peso, mcb } = req.body;
    let CantidadTotal = 0;
    let PrecioTotal = 0;
    const ordenTemporal = await ordenProveedorTemporalDB.find();

    let Productos = ordenTemporal[0].Productos.filter((data) => data.CodigoT != CodigoT);
    for (i = 0; i < Productos.length; i++) {
      CantidadTotal += +Productos[i].Cantidad;
      PrecioTotal = (+PrecioTotal + +Productos[i].PrecioTotal).toFixed(2);
    } 
    let PesoActualizar = (+ordenTemporal[0].Peso - +Peso).toFixed(2)
    let CuarentaPiesHQ = (+ordenTemporal[0].CuarentaPiesHQ - +mcb).toFixed(2)
    let VeintePies = +ordenTemporal[0].VeintePies
    let CuarentaPies = +ordenTemporal[0].CuarentaPies
    if(CuarentaPiesHQ <= 69){
      CuarentaPies = CuarentaPiesHQ
      if(CuarentaPiesHQ <= 30){
        VeintePies = CuarentaPiesHQ
      }
    }
    Peso = PesoActualizar
    if(Productos.length == 0) {
      await ordenProveedorTemporalDB.findByIdAndDelete(ordenTemporal[0]._id);
    }else{
      await ordenProveedorTemporalDB.findByIdAndUpdate(ordenTemporal[0]._id, {
        Productos,
        CantidadTotal,
        PrecioTotal,
        Peso,
        CuarentaPiesHQ,
        VeintePies,
        CuarentaPies
      });
    }

    let registrado = [{ ok: "Producto eliminado correctamente" }];

    res.send(JSON.stringify(registrado));
  }
);

router.post(
  "/cambiar-cantidad-producto-lista-proveedor",
  isAuthenticatedProveedor,
  async (req, res) => {
    const { CodigoT, Cantidad, Precio, CantidadTotal, PrecioTotal, VeintePies, CuarentaPies, CuarentaPiesHQ, Peso } = req.body;
    const orden = await ordenProveedorTemporalDB.find();
    let Productos = orden[0].Productos;
    for (i = 0; i < Productos.length; i++) {
      if (Productos[i].CodigoT == CodigoT) {
        Productos[i].Cantidad = Cantidad;
        Productos[i].PrecioTotal = Precio;
      }
    }
    await ordenProveedorTemporalDB.findByIdAndUpdate(orden[0]._id, {
      Productos,
      CantidadTotal,
      PrecioTotal,
      Peso,
      VeintePies,
      CuarentaPies,
      CuarentaPiesHQ,
    });

    let registrado = [{ ok: "Cambio de cantidad procesado correctamente" }];
  }
);

//ruta para descargar orden temporal excel
router.get(
  "/ver-excel-orden-temporal",
  isAuthenticatedProveedor,
  async (req, res) => {
    let orden = await ordenProveedorTemporalDB.find();

    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Transporte Thomson");

    const style = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#FFFF00",
        fgColor: "#FFFF00",
      },
    });
    let cantidadMcpherson = 0;
    let cantidadConvencional = 0;
    let cantidadBase = 0;
    let cantidadGuardapolvo = 0;

    for (x = 0; x < orden[0].Productos.length; x++) {
      if (
        orden[0].Productos[x].Modelo == "Convecional" ||
        orden[0].Productos[i].Modelo == "Conventional"
      ) {
        cantidadConvencional += +orden[0].Productos[x].Cantidad;
      }
      if (orden[0].Productos[x].Modelo == "Mcpherson") {
        cantidadMcpherson += +orden[0].Productos[x].Cantidad;
      }
      if (
        orden[0].Productos[x].Modelo == "Strut mount" ||
        orden[0].Modelo == "Strut mount"
      ) {
        cantidadBase += +orden[0].Productos[x].Cantidad;
      }
      if (
        orden[0].Productos[x].Modelo == "boot" ||
        orden[0].Modelo == "Guardapolvo"
      ) {
        cantidadGuardapolvo += +orden[0].Productos[x].Cantidad;
      }
    }

    ws.cell(1, 1).string("Cantidad Mcpherson").style(style);
    ws.cell(1, 2).number(cantidadMcpherson);
    ws.cell(1, 4).string("Cantidad convencional").style(style);
    ws.cell(1, 5).number(cantidadConvencional);
    ws.cell(3, 1).string("Cantidad base").style(style);
    ws.cell(3, 2).number(cantidadBase);
    ws.cell(3, 4).string("Cantidad guardapolvo").style(style);
    ws.cell(3, 5).number(cantidadGuardapolvo);
    ws.cell(5, 1).string("Cantidad total").style(style);
    ws.cell(5, 2).number(orden[0].CantidadTotal);
    ws.cell(5, 4).string("Precio total").style(style);
    ws.cell(5, 5).number(orden[0].PrecioTotal);

    ws.cell(7, 1).string("Proveedor").style(style);
    ws.cell(7, 2).string("Codigo").style(style);
    ws.cell(7, 3).string("Descripcion").style(style);
    ws.cell(7, 4).string("Modelo").style(style);
    ws.cell(7, 5).string("Posicion").style(style);
    ws.cell(7, 6).string("Cantidad").style(style);
    ws.cell(7, 7).string("Precio").style(style);
    ws.cell(7, 8).string("Precio total").style(style);

    let fila = 8;

    for (i = 0; i < orden[0].Productos.length; i++) {
      columna = 1;

      ws.cell(fila, columna++).string(orden[0].Proveedor);
      ws.cell(fila, columna++).string(orden[0].Productos[i].CodigoT);
      ws.cell(fila, columna++).string(orden[0].Productos[i].Descripcion);
      ws.cell(fila, columna++).string(orden[0].Productos[i].Modelo);
      ws.cell(fila, columna++).string(orden[0].Productos[i].Posicion);
      ws.cell(fila, columna++).number(orden[0].Productos[i].Cantidad);
      ws.cell(fila, columna++).number(orden[0].Productos[i].PrecioUnidad);
      ws.cell(fila, columna++).number(orden[0].Productos[i].PrecioTotal);

      fila++;
    }

    ws.cell(fila, 7).string("Total");
    ws.cell(fila, 8).number(orden[0].PrecioTotal);

    wb.write(`Orden ${orden[0].Proveedor}.xlsx`, res);
  }
);

//ruta para descargar orden temporal pdf

router.get(
  "/ver-pdf-orden-temporal",
  isAuthenticatedProveedor,
  async (req, res) => {
    let orden = await ordenProveedorTemporalDB.find();

    let cantidadMcpherson = 0;
    let cantidadConvencional = 0;
    let cantidadBase = 0;
    let cantidadGuardapolvo = 0;
    let metrosCubicos =orden[0]. CuarentaPiesHQ
    let Peso = orden[0].Peso

    for (x = 0; x < orden[0].Productos.length; x++) {
      if (
        orden[0].Productos[x].Modelo == "Convecional" ||
        orden[0].Productos[x].Modelo == "Conventional"
      ) {
        cantidadConvencional += +orden[0].Productos[x].Cantidad;
      }
      if (orden[0].Productos[x].Modelo == "Mcpherson") {
        cantidadMcpherson += +orden[0].Productos[x].Cantidad;
      }
      if (
        orden[0].Productos[x].Modelo == "Strut mount" ||
        orden[0].Productos[x].Modelo == "Strut mount"
      ) {
        cantidadBase += +orden[0].Productos[x].Cantidad;
      }
      if (
        orden[0].Productos[x].Modelo == "boot" ||
        orden[0].Productos[x].Modelo == "Guardapolvo"
      ) {
        cantidadGuardapolvo += +orden[0].Productos[x].Cantidad;
      }
    }
    orden[0].cantidadMcpherson = cantidadMcpherson;
    orden[0].cantidadConvencional = cantidadConvencional;
    orden[0].cantidadBase = cantidadBase;
    orden[0].cantidadGuardapolvo = cantidadGuardapolvo;

    let productos = orden[0].Productos;
    let Productos = productos.map((data) => {
      return {
        Modelo: data.Modelo,
        Posicion: data.Posicion,
        Descripcion: data.Descripcion,
        Posicion: data.Posicion,
        CodigoT: data.CodigoT,
        CodigoG: data.CodigoG,
        TipoProducto: data.TipoProducto,
        Cantidad: data.Cantidad,
        Costo: data.Costo,
        CostoGranMayor: data.CostoGranMayor,
        CostoMayor: data.CostoMayor,
        CostoDetal: data.CostoDetal,
        PrecioUnidad: data.PrecioUnidad,
        PrecioTotal: data.PrecioTotal,
      };
    });
    let Orden = orden.map((data) => {
      return {
        cantidadMcpherson: data.cantidadMcpherson,
        cantidadConvencional: data.cantidadConvencional,
        cantidadBase: data.cantidadBase,
        cantidadGuardapolvo: data.cantidadGuardapolvo,
        CantidadTotal: data.CantidadTotal,
        PrecioTotal: data.PrecioTotal,
        Proveedor: data.Proveedor,
      };
    });

    Orden = Orden[0];

    res.render("facturacion/reporte_pdf/orden-temporal-proveedor", {
      Productos,
      Orden,
      metrosCubicos,
      Peso,
    });
  }
);

//ruta de administracion

router.get("/facturacion/administracion",isAuthenticatedAdministracion,async (req, res) => {
    let meses = await mesesDB.find().sort({ NumeroMes: -1 });
    let Monto = 0;
    meses = meses.map((data) => {
      return {
        Anio: data.Año,
        Mes: data.Mes,
        NumeroMes: data.NumeroMes,
        Estado: data.Estado,
        TotalEntrada: data.TotalEntrada,
        TotalSalida: data.TotalSalida,
        Total: data.Total,
        _id: data._id,
        dia: data.dia.map((data2) => {
          return {
            Timestamp: data2.Timestamp,
            Fecha: data2.Fecha,
            Monto: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data2.Monto),
            Monto2: data2.Monto,
            Entrada: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data2.Entrada),
            Entrada2: data2.Entrada,
            Total: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data2.Total),
            Total2: data2.Total,
            Salida: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data2.Salida),
            Salida2: data2.Salida,
            Comentario: data2.Comentario,
            _id: data2._id,
          };
        }),
      };
    });

    if (meses.length != 0) {
      Monto = +meses[0].Total;
    }
    Monto = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Monto);
    res.render("facturacion/administracion", {
      Monto,
      meses,
    });
  }
);

//ruta post para registrar una fecha de pago

router.post("/enviar-mes-administrativo",isAuthenticatedAdministracion,async (req, res) => {
    let { Año, Mes, NumeroMes, dia } = req.body;
    let meses = await mesesDB.find().sort({ NumeroMes: -1 });
    let validacion = meses.find((data) => data.Mes == Mes);
    if (validacion && validacion.Estado == "CERRADO") {
      //existe el mes pero esta cerrado
      let data = {
        error: `El mes ${Mes} del año ${Año} se encuentra cerrado`,
        ok: "",
      };
      res.send(JSON.stringify(data));
    } else {
      if (validacion) {
        //Existe el mes entonces actualizamos
        let mes = await mesesDB.findOne({
          $and: [{ NumeroMes: NumeroMes }, { Mes: Mes }, { Año: Año }],
        });
        let TotalEntrada = (+mes.TotalEntrada + +dia.Entrada).toFixed(2);
        let TotalSalida = (+mes.TotalSalida + +dia.Salida).toFixed(2);
        let Total = dia.Total;
        await mesesDB.findByIdAndUpdate(mes._id, {
          TotalEntrada: TotalEntrada,
          TotalSalida: TotalSalida,
          Total: Total,
          $push: { dia: dia },
        });
        let data = {
          ok: `Fecha agregada correctamente`,
          error: "",
        };
        res.send(JSON.stringify(data));
      } else {
        //no existe el mes creamos uno nuevo
        let mesAnterior;
        let AñoAnterior;
        if (NumeroMes == 01) {
          mesAnterior = "12";
          AñoAnterior = +Año - 1;
        }
        if (NumeroMes == 02) {
          mesAnterior = "01";
          AñoAnterior = Año;
        }
        if (NumeroMes == 03) {
          mesAnterior = "02";
          AñoAnterior = Año;
        }
        if (NumeroMes == 04) {
          mesAnterior = "03";
          AñoAnterior = Año;
        }
        if (NumeroMes == 05) {
          mesAnterior = "04";
          AñoAnterior = Año;
        }
        if (NumeroMes == 06) {
          mesAnterior = "05";
          AñoAnterior = Año;
        }
        if (NumeroMes == 07) {
          mesAnterior = "06";
          AñoAnterior = Año;
        }
        if (NumeroMes == 08) {
          mesAnterior = "07";
          AñoAnterior = Año;
        }
        if (NumeroMes == 09) {
          mesAnterior = "08";
          AñoAnterior = Año;
        }
        if (NumeroMes == 10) {
          mesAnterior = "09";
          AñoAnterior = Año;
        }
        if (NumeroMes == 11) {
          mesAnterior = "10";
          AñoAnterior = Año;
        }
        if (NumeroMes == 12) {
          mesAnterior = "11";
          AñoAnterior = Año;
        }

        let validacionEstadoMes = await mesesDB.findOne({
          $and: [{ NumeroMes: mesAnterior }, { Año: AñoAnterior }],
        });
        if (validacionEstadoMes && validacionEstadoMes.Estado == "ABIERTO") {
          //el mes anterior se encuentra abierto por lo tanto no se puede crear uno nuevo
          let data = {
            error: "Para agregar un nuevo mes debe cerrar el anterior",
            ok: "",
          };
          res.send(JSON.stringify(data));
        } else {
          //el mes anterior esta cerrado o no existe por lo tanto creamos uno nuevo
          let nuevoMes = new mesesDB({
            Año: Año,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalEntrada: dia.Entrada,
            TotalSalida: dia.Salida,
            Total: dia.Total,
            dia: dia,
            Estado: "ABIERTO",
          });
          await nuevoMes.save();
          let data = {
            ok: "ok",
            error: "",
          };
          res.send(JSON.stringify(data));
        }
      }
    }
  }
);

//enviar mes administrativo personal
router.post("/enviar-mes-administrativo-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { Año, Mes, NumeroMes, dia } = req.body;
    let meses = await mesesPersonalDB.find().sort({ NumeroMes: -1 });
    let validacion = meses.find((data) => data.Mes == Mes);
    if (validacion && validacion.Estado == "CERRADO") {
      //existe el mes pero esta cerrado
      let data = {
        error: `El mes ${Mes} del año ${Año} se encuentra cerrado`,
        ok: "",
      };
      res.send(JSON.stringify(data));
    } else {
      if (validacion) {
        //Existe el mes entonces actualizamos
        let mes = await mesesPersonalDB.findOne({
          $and: [{ NumeroMes: NumeroMes }, { Mes: Mes }, { Año: Año }],
        });
        let TotalEntrada = (+mes.TotalEntrada + +dia.Entrada).toFixed(2);
        let TotalSalida = (+mes.TotalSalida + +dia.Salida).toFixed(2);
        let Total = dia.Total;
        await mesesPersonalDB.findByIdAndUpdate(mes._id, {
          TotalEntrada: TotalEntrada,
          TotalSalida: TotalSalida,
          Total: Total,
          $push: { dia: dia },
        });
        let data = {
          ok: `Fecha agregada correctamente`,
          error: "",
        };
        res.send(JSON.stringify(data));
      } else {
        //no existe el mes creamos uno nuevo
        let mesAnterior;
        let AñoAnterior;
        if (NumeroMes == 01) {
          mesAnterior = "12";
          AñoAnterior = +Año - 1;
        }
        if (NumeroMes == 02) {
          mesAnterior = "01";
          AñoAnterior = Año;
        }
        if (NumeroMes == 03) {
          mesAnterior = "02";
          AñoAnterior = Año;
        }
        if (NumeroMes == 04) {
          mesAnterior = "03";
          AñoAnterior = Año;
        }
        if (NumeroMes == 05) {
          mesAnterior = "04";
          AñoAnterior = Año;
        }
        if (NumeroMes == 06) {
          mesAnterior = "05";
          AñoAnterior = Año;
        }
        if (NumeroMes == 07) {
          mesAnterior = "06";
          AñoAnterior = Año;
        }
        if (NumeroMes == 08) {
          mesAnterior = "07";
          AñoAnterior = Año;
        }
        if (NumeroMes == 09) {
          mesAnterior = "08";
          AñoAnterior = Año;
        }
        if (NumeroMes == 10) {
          mesAnterior = "09";
          AñoAnterior = Año;
        }
        if (NumeroMes == 11) {
          mesAnterior = "10";
          AñoAnterior = Año;
        }
        if (NumeroMes == 12) {
          mesAnterior = "11";
          AñoAnterior = Año;
        }

        let validacionEstadoMes = await mesesPersonalDB.findOne({
          $and: [{ NumeroMes: mesAnterior }, { Año: AñoAnterior }],
        });
        if (validacionEstadoMes && validacionEstadoMes.Estado == "ABIERTO") {
          //el mes anterior se encuentra abierto por lo tanto no se puede crear uno nuevo
          let data = {
            error: "Para agregar un nuevo mes debe cerrar el anterior",
            ok: "",
          };
          res.send(JSON.stringify(data));
        } else {
          //el mes anterior esta cerrado o no existe por lo tanto creamos uno nuevo
          let nuevoMes = new mesesPersonalDB({
            Año: Año,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalEntrada: dia.Entrada,
            TotalSalida: dia.Salida,
            Total: dia.Total,
            dia: dia,
            Estado: "ABIERTO",
          });
          await nuevoMes.save();
          let data = {
            ok: "ok",
            error: "",
          };
          res.send(JSON.stringify(data));
        }
      }
    }
  }
);

//solicitar info mes

router.post(
  "/solicitar-info-mes",
  isAuthenticatedAdministracion,
  async (req, res) => {
    let mesesAdministrativos = await mesesDB.find();

    mesesAdministrativos[0].meses.sort(function (a, b) {
      if (a.NumeroMes < b.NumeroMes) {
        return 1;
      }
      if (a.NumeroMes > b.NumeroMes) {
        return -1;
      }
      return 0;
    });

    res.send(JSON.stringify(mesesAdministrativos));
  }
);
//cerrar mes

router.post("/cerrar-Mes", isAuthenticatedAdministracion, async (req, res) => {
  let { _id } = req.body;

  await mesesDB.findByIdAndUpdate(_id, {
    Estado: "CERRADO",
  });
  res.send(JSON.stringify("ok"));
});
//cerrar mes personal

router.post("/cerrar-Mes-personal", isAuthenticatedAdministracion, async (req, res) => {
  let { _id } = req.body;

  await mesesPersonalDB.findByIdAndUpdate(_id, {
    Estado: "CERRADO",
  });
  res.send(JSON.stringify("ok"));
});

//descargar excel del mes

router.get("/descargar-excel-mes/:id",isAuthenticatedAdministracion,async (req, res) => {
    let mes = await mesesDB.findById(req.params.id);

    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("MES");

    const title = wb.createStyle({
      font: {
        color: "#ffc107",
        size: 15,
      },
      alignment: {
        wrapText: true,
        horizontal: "center",
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#000000",
        fgColor: "#000000",
      },
    });
    const headers2 = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffc107",
        fgColor: "#ffc107",
      },
    });
    const lineas = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });

    ws.cell(2, 2, 2, 7, true).string(`MES ${mes.Mes}-${mes.Año}`).style(title);
    ws.cell(4, 2).string("FECHA").style(headers2);
    ws.cell(4, 3).string("MONTO").style(headers2);
    ws.cell(4, 4).string("ENTRADA").style(headers2);
    ws.cell(4, 5).string("SALIDA").style(headers2);
    ws.cell(4, 6).string("TOTAL").style(headers2);
    ws.cell(4, 7).string("COMENTARIO").style(headers2);
    let fila = 5;
    for (i = 0; i < mes.dia.length; i++) {
      let columna = 2;
      ws.cell(fila, columna++)
        .string(mes.dia[i].Fecha)
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Monto)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Entrada)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Salida)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Total)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(mes.dia[i].Comentario)
        .style(lineas);

      fila++;
    }
    wb.write(`MES ${mes.Mes}-${mes.Año}.xlsx`, res);
  }
);
//descargar excel del mes personal

router.get("/descargar-excel-mes-personal/:id",isAuthenticatedAdministracion,async (req, res) => {
    let mes = await mesesPersonalDB.findById(req.params.id);

    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("MES");

    const title = wb.createStyle({
      font: {
        color: "#ffc107",
        size: 15,
      },
      alignment: {
        wrapText: true,
        horizontal: "center",
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#000000",
        fgColor: "#000000",
      },
    });
    const headers2 = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffc107",
        fgColor: "#ffc107",
      },
    });
    const lineas = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });

    ws.cell(2, 2, 2, 7, true).string(`MES ${mes.Mes}-${mes.Año}`).style(title);
    ws.cell(4, 2).string("FECHA").style(headers2);
    ws.cell(4, 3).string("MONTO").style(headers2);
    ws.cell(4, 4).string("ENTRADA").style(headers2);
    ws.cell(4, 5).string("SALIDA").style(headers2);
    ws.cell(4, 6).string("TOTAL").style(headers2);
    ws.cell(4, 7).string("COMENTARIO").style(headers2);
    let fila = 5;
    for (i = 0; i < mes.dia.length; i++) {
      let columna = 2;
      ws.cell(fila, columna++)
        .string(mes.dia[i].Fecha)
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Monto)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Entrada)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Salida)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(mes.dia[i].Total)
        )
        .style(lineas);
      ws.cell(fila, columna++)
        .string(mes.dia[i].Comentario)
        .style(lineas);

      fila++;
    }
    wb.write(`MES ${mes.Mes}-${mes.Año}.xlsx`, res);
  }
);

//descargar pdf del mes

router.get("/descargar-pdf-mes/:id",isAuthenticatedAdministracion,async (req, res) => {
    let mes = await mesesDB.findById(req.params.id);
    let Mes = mes.Mes;
    let Anio = mes.Año;
    dias = mes.dia.map((data2) => {
      return {
        Timestamp: data2.Timestamp,
        Fecha: data2.Fecha,
        Monto: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Monto),
        Monto2: data2.Monto,
        Entrada: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Entrada),
        Entrada2: data2.Entrada,
        Total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Total),
        Total2: data2.Total,
        Salida: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Salida),
        Salida2: data2.Salida,
        Comentario: data2.Comentario,
        _id: data2._id,
      };
    });

    res.render("facturacion/reporte_pdf/reporte-mes", {
      dias,
      Mes,
      Anio,
    });
  }
);
//descargar pdf del mes personal

router.get("/descargar-pdf-mes-personal/:id",isAuthenticatedAdministracion,async (req, res) => {
    let mes = await mesesPersonalDB.findById(req.params.id);
    let Mes = mes.Mes;
    let Anio = mes.Año;
    dias = mes.dia.map((data2) => {
      return {
        Timestamp: data2.Timestamp,
        Fecha: data2.Fecha,
        Monto: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Monto),
        Monto2: data2.Monto,
        Entrada: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Entrada),
        Entrada2: data2.Entrada,
        Total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Total),
        Total2: data2.Total,
        Salida: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data2.Salida),
        Salida2: data2.Salida,
        Comentario: data2.Comentario,
        _id: data2._id,
      };
    });

    res.render("facturacion/reporte_pdf/reporte-mes", {
      dias,
      Mes,
      Anio,
    });
  }
);

//descargar pdf o excel del año completo

router.post("/descargar-anio-completo",isAuthenticatedAdministracion,async (req, res) => {
    let { Anio, Formato } = req.body;
    let meses = await mesesDB.find({ Año: Anio }).sort({ NumeroMes: -1 });
    let TodasFechas = [];
    for (i = 0; i < meses.length; i++) {
      for (x = 0; x < meses[i].dia.length; x++) {
        TodasFechas.push(meses[i].dia[x]);
      }
    }
    TodasFechas.sort(function (a, b) {
      if (a.Timestamp > b.Timestamp) {
        return -1;
      }
      if (a.Timestamp < b.Timestamp) {
        return 1;
      }
      return 0;
    });

    TodasFechas = TodasFechas.map((data) => {
      return {
        Timestamp: data.Timestamp,
        Fecha: data.Fecha,
        Monto: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Monto),
        Entrada: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Entrada),
        Total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Total),
        Salida: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Salida),
        Comentario: data.Comentario,
      };
    });
    if (Formato == "PDF") {
      res.render("facturacion/reporte_pdf/reporte-anio", {
        Anio,
        TodasFechas,
      });
    } else {
      const xl = require("excel4node");

      const wb = new xl.Workbook();

      const ws = wb.addWorksheet("AÑO");

      const title = wb.createStyle({
        font: {
          color: "#ffc107",
          size: 15,
        },
        alignment: {
          wrapText: true,
          horizontal: "center",
        },
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#000000",
          fgColor: "#000000",
        },
      });
      const headers2 = wb.createStyle({
        font: {
          color: "#000000",
          size: 11,
        },
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#ffc107",
          fgColor: "#ffc107",
        },
      });
      const lineas = wb.createStyle({
        font: {
          color: "#000000",
          size: 11,
        },
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#ffffff",
          fgColor: "#ffffff",
        },
      });

      ws.cell(2, 2, 2, 7, true).string(`${Anio}`).style(title);
      ws.cell(4, 2).string("FECHA").style(headers2);
      ws.cell(4, 3).string("MONTO").style(headers2);
      ws.cell(4, 4).string("ENTRADA").style(headers2);
      ws.cell(4, 5).string("SALIDA").style(headers2);
      ws.cell(4, 6).string("TOTAL").style(headers2);
      ws.cell(4, 7).string("COMENTARIO").style(headers2);
      let fila = 5;
      for (i = 0; i < TodasFechas.length; i++) {
        let columna = 2;
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Fecha)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Monto)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Entrada)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Salida)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Total)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Comentario)
          .style(lineas);

        fila++;
      }
      wb.write(`${Anio}.xlsx`, res);
    }
  }
);

//Descarhar anio completo personal
router.post("/descargar-anio-completo-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { Anio, Formato } = req.body;
    let meses = await mesesPersonalDB.find({ Año: Anio }).sort({ NumeroMes: -1 });
    let TodasFechas = [];
    for (i = 0; i < meses.length; i++) {
      for (x = 0; x < meses[i].dia.length; x++) {
        TodasFechas.push(meses[i].dia[x]);
      }
    }
    TodasFechas.sort(function (a, b) {
      if (a.Timestamp > b.Timestamp) {
        return -1;
      }
      if (a.Timestamp < b.Timestamp) {
        return 1;
      }
      return 0;
    });

    TodasFechas = TodasFechas.map((data) => {
      return {
        Timestamp: data.Timestamp,
        Fecha: data.Fecha,
        Monto: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Monto),
        Entrada: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Entrada),
        Total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Total),
        Salida: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Salida),
        Comentario: data.Comentario,
      };
    });
    if (Formato == "PDF") {
      res.render("facturacion/reporte_pdf/reporte-anio", {
        Anio,
        TodasFechas,
      });
    } else {
      const xl = require("excel4node");

      const wb = new xl.Workbook();

      const ws = wb.addWorksheet("AÑO");

      const title = wb.createStyle({
        font: {
          color: "#ffc107",
          size: 15,
        },
        alignment: {
          wrapText: true,
          horizontal: "center",
        },
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#000000",
          fgColor: "#000000",
        },
      });
      const headers2 = wb.createStyle({
        font: {
          color: "#000000",
          size: 11,
        },
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#ffc107",
          fgColor: "#ffc107",
        },
      });
      const lineas = wb.createStyle({
        font: {
          color: "#000000",
          size: 11,
        },
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#ffffff",
          fgColor: "#ffffff",
        },
      });

      ws.cell(2, 2, 2, 7, true).string(`${Anio}`).style(title);
      ws.cell(4, 2).string("FECHA").style(headers2);
      ws.cell(4, 3).string("MONTO").style(headers2);
      ws.cell(4, 4).string("ENTRADA").style(headers2);
      ws.cell(4, 5).string("SALIDA").style(headers2);
      ws.cell(4, 6).string("TOTAL").style(headers2);
      ws.cell(4, 7).string("COMENTARIO").style(headers2);
      let fila = 5;
      for (i = 0; i < TodasFechas.length; i++) {
        let columna = 2;
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Fecha)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Monto)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Entrada)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Salida)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Total)
          .style(lineas);
        ws.cell(fila, columna++)
          .string(TodasFechas[i].Comentario)
          .style(lineas);

        fila++;
      }
      wb.write(`${Anio}.xlsx`, res);
    }
  }
);

//ruta para editar fecha

router.post("/editar-fecha-mes",isAuthenticatedAdministracion,async (req, res) => {
    let { fecha, _id, Monto, Entrada, Salida, Comentario } = req.body;
    let NumeroMes = fecha.substr(5, 2);
    let Año = fecha.substr(0, 4);
    let mes = await mesesDB.findOne({
      $and: [{ NumeroMes: NumeroMes }, { Año: Año }],
    });
    let dia = mes.dia;
    let index = 0;
    for (i = 0; i < dia.length; i++) {
      if (dia[i]._id == _id) {
        index = i;
      }
    }
    let Total = (+Monto + +Entrada - +Salida).toFixed(2);
    dia[index].Entrada = Entrada;
    dia[index].Salida = Salida;
    dia[index].Total = Total;
    dia[index].Comentario = Comentario;
    let dias = [];
    for (i = 0; i < index; i++) {
      if (i != index) {
        dias.push(dia[i]);
      }
    }
    dias.push(dia[index]);
    for (i = index; i < dia.length; i++) {
      if (i != index) {
        dia[i].Monto = Total;
        dia[i].Total = (
          +dia[i].Monto +
          +dia[i].Entrada -
          +dia[i].Salida
        ).toFixed(2);
        dias.push(dia[i]);
        Total = dia[i].Total;
      }
    }

    await mesesDB.findByIdAndUpdate(mes._id, {
      Total: Total,
      dia: dias,
    });

    res.send(JSON.stringify("ok"));
  }
);

//ruta para editar fecha mes personal
router.post("/editar-fecha-mes-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { fecha, _id, Monto, Entrada, Salida, Comentario } = req.body;
    let NumeroMes = fecha.substr(5, 2);
    let Año = fecha.substr(0, 4);
    let mes = await mesesPersonalDB.findOne({
      $and: [{ NumeroMes: NumeroMes }, { Año: Año }],
    });
    let dia = mes.dia;
    let index = 0;
    for (i = 0; i < dia.length; i++) {
      if (dia[i]._id == _id) {
        index = i;
      }
    }
    let Total = (+Monto + +Entrada - +Salida).toFixed(2);
    dia[index].Entrada = Entrada;
    dia[index].Salida = Salida;
    dia[index].Total = Total;
    dia[index].Comentario = Comentario;
    let dias = [];
    for (i = 0; i < index; i++) {
      if (i != index) {
        dias.push(dia[i]);
      }
    }
    dias.push(dia[index]);
    for (i = index; i < dia.length; i++) {
      if (i != index) {
        dia[i].Monto = Total;
        dia[i].Total = (
          +dia[i].Monto +
          +dia[i].Entrada -
          +dia[i].Salida
        ).toFixed(2);
        dias.push(dia[i]);
        Total = dia[i].Total;
      }
    }

    await mesesPersonalDB.findByIdAndUpdate(mes._id, {
      Total: Total,
      dia: dias,
    });

    res.send(JSON.stringify("ok"));
  }
);

//ruta para eliminar mes

router.post("/eliminar-fecha-mes",isAuthenticatedAdministracion,async (req, res) => {
    let { fecha, _id } = req.body;
    let NumeroMes = fecha.substr(5, 2);
    let Año = fecha.substr(0, 4);
    let mes = await mesesDB.findOne({
      $and: [{ NumeroMes: NumeroMes }, { Año: Año }],
    });
    let dia = mes.dia;
    let index = 0;
    for (i = 0; i < dia.length; i++) {
      if (dia[i]._id == _id) {
        index = i;
      }
    }
    if (index == 0) {
      //si el index a eliminar es el primero entonces sacamos el monto del mes anterior
      if (NumeroMes == 01) {
        NumeroMes = "12";
        Año = +Año - 1;
      }
      if (NumeroMes == 02) {
        NumeroMes = "01";
      }
      if (NumeroMes == 03) {
        NumeroMes = "02";
      }
      if (NumeroMes == 04) {
        NumeroMes = "03";
      }
      if (NumeroMes == 05) {
        NumeroMes = "04";
      }
      if (NumeroMes == 06) {
        NumeroMes = "05";
      }
      if (NumeroMes == 07) {
        NumeroMes = "06";
      }
      if (NumeroMes == 08) {
        NumeroMes = "07";
      }
      if (NumeroMes == 09) {
        NumeroMes = "08";
      }
      if (NumeroMes == 10) {
        NumeroMes = "09";
      }
      if (NumeroMes == 11) {
        NumeroMes = "10";
      }
      if (NumeroMes == 12) {
        NumeroMes = "11";
      }

      let mesAnterior = await mesesDB.findOne({
        $and: [{ NumeroMes: NumeroMes }, { Año: Año }],
      });
      if (mesAnterior) {
        //si existe el mes anterior agarramos el monto de ahi
        let diaBase = mesAnterior.dia[mesAnterior.dia.length - 1];
        let Total = diaBase.Total;
        if (dia.length > 1) {
          //si existen mas dias actualizamos los dias posteriores
          let dias = [];
          for (i = 1; i < dia.length; i++) {
            dia[i].Monto = Total;
            dia[i].Total = (
              +dia[i].Monto +
              +dia[i].Entrada -
              +dia[i].Salida
            ).toFixed(2);
            dias.push(dia[i]);
            Total = dia[i].Total;
          }
          await mesesDB.findByIdAndUpdate(mes._id, {
            Total: Total,
            dia: dias,
          });
          res.send(JSON.stringify("ok"));
        } else {
          //No existen mas días elimnamos el mes completo
          await mesesDB.findByIdAndDelete(mes._id);
          res.send(JSON.stringify("ok"));
        }
      } else {
        //no existe el mes anterior entonces validamos si hay fecha siguiente
        if (dia.length > 1) {
          //existen dias posteriores, pero no existe mes anterior, entonces eliminamos el dia y el monto pasaria a cero
          Total = 0;
          let dias = [];
          for (i = 1; i < dia.length; i++) {
            dia[i].Monto = Total;
            dia[i].Total = (
              +dia[i].Monto +
              +dia[i].Entrada -
              +dia[i].Salida
            ).toFixed(2);
            dias.push(dia[i]);
            Total = dia[i].Total;
          }
          await mesesDB.findByIdAndUpdate(mes._id, {
            Total: Total,
            dia: dias,
          });
          res.send(JSON.stringify("ok"));
        } else {
          //no existen dias posteriores ni mes anterior entonces eliminamos el mes completo
          await mesesDB.findByIdAndDelete(mes._id);
          res.send(JSON.stringify("ok"));
        }
      }
    } else {
      //si el index no es el primero sacamos el monto del dia anterior
      let index2 = +index - 1;
      let dias = [];
      Total = dia[index2].Total;
      for (i = 0; i < dia.length; i++) {
        if (i != index) {
          if (i == index2) {
            dias.push(dia[index2]);
          } else {
            dia[i].Monto = Total;
            dia[i].Total = (
              +dia[i].Monto +
              +dia[i].Entrada -
              +dia[i].Salida
            ).toFixed(2);
            dias.push(dia[i]);
            Total = dia[i].Total;
          }
        }
      }
      await mesesDB.findByIdAndUpdate(mes._id, {
        Total: Total,
        dia: dias,
      });
      res.send(JSON.stringify("ok"));
    }
  }
);
//eliminar fecha mes personal
router.post("/eliminar-fecha-mes-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { fecha, _id } = req.body;
    let NumeroMes = fecha.substr(5, 2);
    let Año = fecha.substr(0, 4);
    let mes = await mesesPersonalDB.findOne({
      $and: [{ NumeroMes: NumeroMes }, { Año: Año }],
    });
    let dia = mes.dia;
    let index = 0;
    for (i = 0; i < dia.length; i++) {
      if (dia[i]._id == _id) {
        index = i;
      }
    }
    if (index == 0) {
      //si el index a eliminar es el primero entonces sacamos el monto del mes anterior
      if (NumeroMes == 01) {
        NumeroMes = "12";
        Año = +Año - 1;
      }
      if (NumeroMes == 02) {
        NumeroMes = "01";
      }
      if (NumeroMes == 03) {
        NumeroMes = "02";
      }
      if (NumeroMes == 04) {
        NumeroMes = "03";
      }
      if (NumeroMes == 05) {
        NumeroMes = "04";
      }
      if (NumeroMes == 06) {
        NumeroMes = "05";
      }
      if (NumeroMes == 07) {
        NumeroMes = "06";
      }
      if (NumeroMes == 08) {
        NumeroMes = "07";
      }
      if (NumeroMes == 09) {
        NumeroMes = "08";
      }
      if (NumeroMes == 10) {
        NumeroMes = "09";
      }
      if (NumeroMes == 11) {
        NumeroMes = "10";
      }
      if (NumeroMes == 12) {
        NumeroMes = "11";
      }

      let mesAnterior = await mesesPersonalDB.findOne({
        $and: [{ NumeroMes: NumeroMes }, { Año: Año }],
      });
      if (mesAnterior) {
        //si existe el mes anterior agarramos el monto de ahi
        let diaBase = mesAnterior.dia[mesAnterior.dia.length - 1];
        let Total = diaBase.Total;
        if (dia.length > 1) {
          //si existen mas dias actualizamos los dias posteriores
          let dias = [];
          for (i = 1; i < dia.length; i++) {
            dia[i].Monto = Total;
            dia[i].Total = (
              +dia[i].Monto +
              +dia[i].Entrada -
              +dia[i].Salida
            ).toFixed(2);
            dias.push(dia[i]);
            Total = dia[i].Total;
          }
          await mesesPersonalDB.findByIdAndUpdate(mes._id, {
            Total: Total,
            dia: dias,
          });
          res.send(JSON.stringify("ok"));
        } else {
          //No existen mas días elimnamos el mes completo
          await mesesPersonalDB.findByIdAndDelete(mes._id);
          res.send(JSON.stringify("ok"));
        }
      } else {
        //no existe el mes anterior entonces validamos si hay fecha siguiente
        if (dia.length > 1) {
          //existen dias posteriores, pero no existe mes anterior, entonces eliminamos el dia y el monto pasaria a cero
          Total = 0;
          let dias = [];
          for (i = 1; i < dia.length; i++) {
            dia[i].Monto = Total;
            dia[i].Total = (
              +dia[i].Monto +
              +dia[i].Entrada -
              +dia[i].Salida
            ).toFixed(2);
            dias.push(dia[i]);
            Total = dia[i].Total;
          }
          await mesesPersonalDB.findByIdAndUpdate(mes._id, {
            Total: Total,
            dia: dias,
          });
          res.send(JSON.stringify("ok"));
        } else {
          //no existen dias posteriores ni mes anterior entonces eliminamos el mes completo
          await mesesPersonalDB.findByIdAndDelete(mes._id);
          res.send(JSON.stringify("ok"));
        }
      }
    } else {
      //si el index no es el primero sacamos el monto del dia anterior
      let index2 = +index - 1;
      let dias = [];
      Total = dia[index2].Total;
      for (i = 0; i < dia.length; i++) {
        if (i != index) {
          if (i == index2) {
            dias.push(dia[index2]);
          } else {
            dia[i].Monto = Total;
            dia[i].Total = (
              +dia[i].Monto +
              +dia[i].Entrada -
              +dia[i].Salida
            ).toFixed(2);
            dias.push(dia[i]);
            Total = dia[i].Total;
          }
        }
      }
      await mesesPersonalDB.findByIdAndUpdate(mes._id, {
        Total: Total,
        dia: dias,
      });
      res.send(JSON.stringify("ok"));
    }
  }
);

router.get("/facturacion/cuentas-por-pagar",isAuthenticatedAdministracion,async (req, res) => {
    let Cuentas = await CuentasPagarDB.find().sort({ Timestamp: -1 });

    Cuentas = Cuentas.map((data) => {
      return {
        FechaEstimada: data.FechaEstimada,
        Comentario: data.Comentario,
        Timestamp: data.Timestamp,
        UltimoPago: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.UltimoPago),
        PendienteAPagar: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.PendienteAPagar),
        Total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Total),
        Estado: data.Estado,
        _id: data._id,
      };
    });

    Cuentas.sort(function (a, b) {
      if (a.FechaEstimada > b.FechaEstimada) {
        return 1;
      }
      if (a.FechaEstimada < b.FechaEstimada) {
        return -1;
      }
      return 0;
    });

    res.render("facturacion/cuentas-por-pagar", {
      Cuentas,
    });
  }
);

router.post("/agregar-cuenta-pagar",isAuthenticatedAdministracion,async (req, res) => {
    let { FechaEstimada, Comentario, Total } = req.body;
    Total = Total;
    let UltimoPago = 0;
    let PendienteAPagar = Total;
    let Timestamp = Date.now();

    let newCuenta = new CuentasPagarDB({
      FechaEstimada,
      Comentario,
      Total,
      UltimoPago,
      PendienteAPagar,
      Timestamp,
    });

    await newCuenta.save();

    res.send(JSON.stringify("ok"));
  }
);

router.post("/agregar-cuenta-pagar-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { FechaEstimada, Comentario, Total } = req.body;
    Total = Total;
    let UltimoPago = 0;
    let PendienteAPagar = Total;
    let Timestamp = Date.now();

    let newCuenta = new CuentasPagarPersonalDB({
      FechaEstimada,
      Comentario,
      Total,
      UltimoPago,
      PendienteAPagar,
      Timestamp,
    });

    await newCuenta.save();

    res.send(JSON.stringify("ok"));
  }
);

router.post(
  "/eliminar-cuenta-pagar",
  isAuthenticatedAdministracion,
  async (req, res) => {
    let { Timestamp } = req.body;

    await CuentasPagarDB.findOneAndDelete({ Timestamp: Timestamp });

    res.send(JSON.stringify("ok"));
  }
);
router.post("/eliminar-cuenta-pagar-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { Timestamp } = req.body;

    await CuentasPagarPersonalDB.findOneAndDelete({ Timestamp: Timestamp });

    res.send(JSON.stringify("ok"));
  }
);

router.post("/editar-cuenta-pagar",isAuthenticatedAdministracion,async (req, res) => {
    let { Timestamp, Comentario, Total, UltimoPago, FechaEstimada } = req.body;

    let cuenta = await CuentasPagarDB.findOne({ Timestamp: Timestamp });

    if (cuenta.UltimoPago == UltimoPago) {
      await CuentasPagarDB.findOneAndUpdate(
        { Timestamp: Timestamp },
        {
          Comentario,
          Total,
          UltimoPago,
          FechaEstimada,
        }
      );

      res.send(JSON.stringify("ok"));
    } else {
      Total = (+Total + +cuenta.UltimoPago).toFixed(2);
      Total = (+Total - +UltimoPago).toFixed(2);

      await CuentasPagarDB.findOneAndUpdate(
        { Timestamp: Timestamp },
        {
          Comentario,
          Total,
          UltimoPago,
          FechaEstimada,
        }
      );

      res.send(JSON.stringify("ok"));
    }
  }
);

router.post("/editar-cuenta-pagar-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { Timestamp, Comentario, Total, UltimoPago, FechaEstimada } = req.body;

    let cuenta = await CuentasPagarPersonalDB.findOne({ Timestamp: Timestamp });

    if (cuenta.UltimoPago == UltimoPago) {
      await CuentasPagarPersonalDB.findOneAndUpdate(
        { Timestamp: Timestamp },
        {
          Comentario,
          Total,
          UltimoPago,
          FechaEstimada,
        }
      );

      res.send(JSON.stringify("ok"));
    } else {
      Total = (+Total + +cuenta.UltimoPago).toFixed(2);
      Total = (+Total - +UltimoPago).toFixed(2);

      await CuentasPagarPersonalDB.findOneAndUpdate(
        { Timestamp: Timestamp },
        {
          Comentario,
          Total,
          UltimoPago,
          FechaEstimada,
        }
      );

      res.send(JSON.stringify("ok"));
    }
  }
);

router.post("/registrar-pago-pendiente",isAuthenticatedAdministracion,async (req, res) => {
    let { Año, Mes, NumeroMes, dia } = req.body;
    let mesAIterar = await mesesDB.findOne({
      $and: [{ NumeroMes: NumeroMes }, { Año: Año }],
    });
    dia.Monto = mesAIterar.dia[mesAIterar.dia.length - 1].Total;
    dia.Total = (+dia.Monto - +dia.Salida).toFixed(2);
    let meses = await mesesDB.find().sort({ NumeroMes: -1 });
    let validacion = meses.find((data) => data.Mes == Mes);
    if (validacion && validacion.Estado == "CERRADO") {
      //existe el mes pero esta cerrado
      let data = {
        error: `El mes ${Mes} del año ${Año} se encuentra cerrado`,
        ok: "",
      };
      res.send(JSON.stringify(data));
    } else {
      if (validacion) {
        //Existe el mes entonces actualizamos
        let mes = await mesesDB.findOne({
          $and: [{ NumeroMes: NumeroMes }, { Mes: Mes }, { Año: Año }],
        });
        let TotalEntrada = (+mes.TotalEntrada + +dia.Entrada).toFixed(2);
        let TotalSalida = (+mes.TotalSalida + +dia.Salida).toFixed(2);
        let Total = dia.Total;
        await mesesDB.findByIdAndUpdate(mes._id, {
          TotalEntrada: TotalEntrada,
          TotalSalida: TotalSalida,
          Total: Total,
          $push: { dia: dia },
        });
        let data = {
          ok: `Fecha agregada correctamente`,
          error: "",
        };
        res.send(JSON.stringify(data));
      } else {
        //no existe el mes creamos uno nuevo
        let mesAnterior;
        let AñoAnterior;
        if (NumeroMes == 01) {
          mesAnterior = "12";
          AñoAnterior = +Año - 1;
        }
        if (NumeroMes == 02) {
          mesAnterior = "01";
          AñoAnterior = Año;
        }
        if (NumeroMes == 03) {
          mesAnterior = "02";
          AñoAnterior = Año;
        }
        if (NumeroMes == 04) {
          mesAnterior = "03";
          AñoAnterior = Año;
        }
        if (NumeroMes == 05) {
          mesAnterior = "04";
          AñoAnterior = Año;
        }
        if (NumeroMes == 06) {
          mesAnterior = "05";
          AñoAnterior = Año;
        }
        if (NumeroMes == 07) {
          mesAnterior = "06";
          AñoAnterior = Año;
        }
        if (NumeroMes == 08) {
          mesAnterior = "07";
          AñoAnterior = Año;
        }
        if (NumeroMes == 09) {
          mesAnterior = "08";
          AñoAnterior = Año;
        }
        if (NumeroMes == 10) {
          mesAnterior = "09";
          AñoAnterior = Año;
        }
        if (NumeroMes == 11) {
          mesAnterior = "10";
          AñoAnterior = Año;
        }
        if (NumeroMes == 12) {
          mesAnterior = "11";
          AñoAnterior = Año;
        }

        let validacionEstadoMes = await mesesDB.findOne({
          $and: [{ NumeroMes: mesAnterior }, { Año: AñoAnterior }],
        });
        if (validacionEstadoMes && validacionEstadoMes.Estado == "ABIERTO") {
          //el mes anterior se encuentra abierto por lo tanto no se puede crear uno nuevo
          let data = {
            error: "Para agregar un nuevo mes debe cerrar el anterior",
            ok: "",
          };
          res.send(JSON.stringify(data));
        } else {
          //el mes anterior esta cerrado o no existe por lo tanto creamos uno nuevo
          let nuevoMes = new mesesDB({
            Año: Año,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalEntrada: dia.Entrada,
            TotalSalida: dia.Salida,
            Total: dia.Total,
            dia: dia,
            Estado: "ABIERTO",
          });
          await nuevoMes.save();
          let data = {
            ok: "ok",
            error: "",
          };
          res.send(JSON.stringify(data));
        }
      }
    }
  }
);


router.post("/registrar-pago-pendiente-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { Año, Mes, NumeroMes, dia } = req.body;
    let mesAIterar = await mesesPersonalDB.findOne({  $and: [{ NumeroMes: NumeroMes }, { Año: Año }],});
    dia.Monto = mesAIterar.dia[mesAIterar.dia.length - 1].Total;
    dia.Total = (+dia.Monto - +dia.Salida).toFixed(2);
    let meses = await mesesPersonalDB.find().sort({ NumeroMes: -1 });
    let validacion = meses.find((data) => data.Mes == Mes);
    if (validacion && validacion.Estado == "CERRADO") {
      //existe el mes pero esta cerrado
      let data = {
        error: `El mes ${Mes} del año ${Año} se encuentra cerrado`,
        ok: "",
      };
      res.send(JSON.stringify(data));
    } else {
      if (validacion) {
        //Existe el mes entonces actualizamos
        let mes = await mesesPersonalDB.findOne({
          $and: [{ NumeroMes: NumeroMes }, { Mes: Mes }, { Año: Año }],
        });
        let TotalEntrada = (+mes.TotalEntrada + +dia.Entrada).toFixed(2);
        let TotalSalida = (+mes.TotalSalida + +dia.Salida).toFixed(2);
        let Total = dia.Total;
        await mesesPersonalDB.findByIdAndUpdate(mes._id, {
          TotalEntrada: TotalEntrada,
          TotalSalida: TotalSalida,
          Total: Total,
          $push: { dia: dia },
        });
        let data = {
          ok: `Fecha agregada correctamente`,
          error: "",
        };
        res.send(JSON.stringify(data));
      } else {
        //no existe el mes creamos uno nuevo
        let mesAnterior;
        let AñoAnterior;
        if (NumeroMes == 01) {
          mesAnterior = "12";
          AñoAnterior = +Año - 1;
        }
        if (NumeroMes == 02) {
          mesAnterior = "01";
          AñoAnterior = Año;
        }
        if (NumeroMes == 03) {
          mesAnterior = "02";
          AñoAnterior = Año;
        }
        if (NumeroMes == 04) {
          mesAnterior = "03";
          AñoAnterior = Año;
        }
        if (NumeroMes == 05) {
          mesAnterior = "04";
          AñoAnterior = Año;
        }
        if (NumeroMes == 06) {
          mesAnterior = "05";
          AñoAnterior = Año;
        }
        if (NumeroMes == 07) {
          mesAnterior = "06";
          AñoAnterior = Año;
        }
        if (NumeroMes == 08) {
          mesAnterior = "07";
          AñoAnterior = Año;
        }
        if (NumeroMes == 09) {
          mesAnterior = "08";
          AñoAnterior = Año;
        }
        if (NumeroMes == 10) {
          mesAnterior = "09";
          AñoAnterior = Año;
        }
        if (NumeroMes == 11) {
          mesAnterior = "10";
          AñoAnterior = Año;
        }
        if (NumeroMes == 12) {
          mesAnterior = "11";
          AñoAnterior = Año;
        }

        let validacionEstadoMes = await mesesPersonalDB.findOne({
          $and: [{ NumeroMes: mesAnterior }, { Año: AñoAnterior }],
        });
        if (validacionEstadoMes && validacionEstadoMes.Estado == "ABIERTO") {
          //el mes anterior se encuentra abierto por lo tanto no se puede crear uno nuevo
          let data = {
            error: "Para agregar un nuevo mes debe cerrar el anterior",
            ok: "",
          };
          res.send(JSON.stringify(data));
        } else {
          //el mes anterior esta cerrado o no existe por lo tanto creamos uno nuevo
          let nuevoMes = new mesesPersonalDB({
            Año: Año,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalEntrada: dia.Entrada,
            TotalSalida: dia.Salida,
            Total: dia.Total,
            dia: dia,
            Estado: "ABIERTO",
          });
          await nuevoMes.save();
          let data = {
            ok: "ok",
            error: "",
          };
          res.send(JSON.stringify(data));
        }
      }
    }
  }
);

//actualizar pago de las cuentas

router.post(
  "/actualizar-pago-de-cuentas-por-pagar",
  isAuthenticatedAdministracion,
  async (req, res) => {
    let { _id, MontoPagado } = req.body;
    let cuentaPorPagar = await CuentasPagarDB.findById(_id);
    let UltimoPago = MontoPagado;
    let Total = (+cuentaPorPagar.Total - +UltimoPago).toFixed(2);
    if (Total == 0) {
      //eliminamos la cuenta
      await CuentasPagarDB.findByIdAndDelete(_id);
      res.send(JSON.stringify("ok"));
    } else {
      //actualizamos la cuenta
      await CuentasPagarDB.findByIdAndUpdate(_id, {
        UltimoPago: UltimoPago,
        Total: Total,
      });
      res.send(JSON.stringify("ok"));
    }
  }
);

router.post("/actualizar-pago-de-cuentas-por-pagar-personal",isAuthenticatedAdministracion,async (req, res) => {
    let { _id, MontoPagado } = req.body;
    let cuentaPorPagar = await CuentasPagarPersonalDB.findById(_id);
    let UltimoPago = MontoPagado;
    let Total = (+cuentaPorPagar.Total - +UltimoPago).toFixed(2);
    if (+Total == 0) {
      //eliminamos la cuenta
      await CuentasPagarPersonalDB.findByIdAndDelete(_id);
      res.send(JSON.stringify("ok"));
    } else {
      //actualizamos la cuenta
      await CuentasPagarPersonalDB.findByIdAndUpdate(_id, {
        UltimoPago: UltimoPago,
        Total: Total,
      });
      res.send(JSON.stringify("ok"));
    }
  }
);

router.post(
  "/ver-anio-administrativo",
  isAuthenticatedAdministracion,
  async (req, res) => {
    let Fecha = new Date();
    let año = Fecha.getFullYear();

    let Año = await mesesDB.findOne({ Año: año });

    res.send(JSON.stringify(Año.Total));
  }
);

router.post(
  "/ver-anio-administrativo-personal",
  isAuthenticatedAdministracion,
  async (req, res) => {
    let Fecha = new Date();
    let año = Fecha.getFullYear();

    let Año = await mesesPersonalDB.findOne({ Año: año });

    res.send(JSON.stringify(Año.Total));
  }
);

//ruta para descargar excel de cuentas por pagar

router.get("/descargar-excel-cuentas-pagar",isAuthenticatedAdministracion,async (req, res) => {
    let cuentas = await CuentasPagarDB.find();

    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Cuentas por pagar");

    const titulo = wb.createStyle({
      font: {
        color: "#ffc107",
        size: 11,
      },
      alignment: {
        wrapText: true,
        horizontal: "center",
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#000000",
        fgColor: "#000000",
      },
    });

    const headers = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffc107",
        fgColor: "#ffc107",
      },
    });

    const entrada = wb.createStyle({
      font: {
        color: "#198754",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });
    const salida = wb.createStyle({
      font: {
        color: "#dc3545",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });

    const neutro = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });

    ws.cell(2, 2, 2, 5, true).string("CUENTAS POR PAGAR").style(titulo);

    ws.cell(4, 2).string("FECHA ESTIMADA").style(headers);
    ws.cell(4, 3).string("COMENTARIO").style(headers);
    ws.cell(4, 4).string("ULTIMO PAGO").style(headers);
    ws.cell(4, 5).string("TOTAL").style(headers);

    let fila = 5;
    for (i = 0; i < cuentas.length; i++) {
      columna = 2;

      let Total = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cuentas[i].Total);
      let UltimoPago = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cuentas[i].UltimoPago);

      ws.cell(fila, columna++)
        .string(cuentas[i].FechaEstimada)
        .style(neutro);
      ws.cell(fila, columna++)
        .string(cuentas[i].Comentario)
        .style(neutro);
      ws.cell(fila, columna++)
        .string(UltimoPago)
        .style(salida);
      ws.cell(fila, columna++)
        .string(Total)
        .style(entrada);

      fila++;
    }

    wb.write(`Cuentas por pagar.xlsx`, res);
  }
);

router.get("/descargar-excel-cuentas-pagar-personal",isAuthenticatedAdministracion,async (req, res) => {
    let cuentas = await CuentasPagarPersonalDB.find();

    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Cuentas por pagar");

    const titulo = wb.createStyle({
      font: {
        color: "#ffc107",
        size: 11,
      },
      alignment: {
        wrapText: true,
        horizontal: "center",
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#000000",
        fgColor: "#000000",
      },
    });

    const headers = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffc107",
        fgColor: "#ffc107",
      },
    });

    const entrada = wb.createStyle({
      font: {
        color: "#198754",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });
    const salida = wb.createStyle({
      font: {
        color: "#dc3545",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });

    const neutro = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
      },
    });

    ws.cell(2, 2, 2, 5, true).string("CUENTAS POR PAGAR").style(titulo);

    ws.cell(4, 2).string("FECHA ESTIMADA").style(headers);
    ws.cell(4, 3).string("COMENTARIO").style(headers);
    ws.cell(4, 4).string("ULTIMO PAGO").style(headers);
    ws.cell(4, 5).string("TOTAL").style(headers);

    let fila = 5;
    for (i = 0; i < cuentas.length; i++) {
      columna = 2;

      let Total = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cuentas[i].Total);
      let UltimoPago = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cuentas[i].UltimoPago);

      ws.cell(fila, columna++)
        .string(cuentas[i].FechaEstimada)
        .style(neutro);
      ws.cell(fila, columna++)
        .string(cuentas[i].Comentario)
        .style(neutro);
      ws.cell(fila, columna++)
        .string(UltimoPago)
        .style(salida);
      ws.cell(fila, columna++)
        .string(Total)
        .style(entrada);

      fila++;
    }

    wb.write(`Cuentas por pagar.xlsx`, res);
  }
);

//ruta para descargar pdf de cuentas por pagar

router.get("/descargar-pdf-cuentas-pagar",isAuthenticatedAdministracion,async (req, res) => {
    let cuentas = await CuentasPagarDB.find().sort({"FechaEstimada": 1});

    cuentas = cuentas.map((data) => {
      return {
        FechaEstimada: data.FechaEstimada,
        Comentario: data.Comentario,
        UltimoPago: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.UltimoPago),
        Total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Total),
      };
    });

    res.render("facturacion/reporte_pdf/cuentas-por-pagar-pdf", {
      cuentas,
    });
  }
);


router.get("/descargar-pdf-cuentas-pagar-personal",isAuthenticatedAdministracion,async (req, res) => {
    let cuentas = await CuentasPagarPersonalDB.find().sort({"FechaEstimada": 1});

    cuentas = cuentas.map((data) => {
      return {
        FechaEstimada: data.FechaEstimada,
        Comentario: data.Comentario,
        UltimoPago: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.UltimoPago),
        Total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.Total),
      };
    });

    res.render("facturacion/reporte_pdf/cuentas-por-pagar-pdf", {
      cuentas,
    });
  }
);

//ruta para ver solicitudes de cambio de contraseña

router.get(
  "/facturacion/solicitudes-recuperacion-contrasena", isAuthenticatedCliente,
  async (req, res) => {
    let Solicitudes = await solicitudesRecuperacionContrasenaDB
      .find()
      .sort({ email: 1 });
    let solicitudes = [];

    for (i = 0; i < Solicitudes.length; i++) {
      let cliente = await clienteDB.findOne({email: Solicitudes[i].email})
      let data = {
        _id: cliente._id,
        email: Solicitudes[i].email,
      };
      solicitudes.push(data);
    }

    res.render("facturacion/cliente/solicitudes-recuperacion", {
      solicitudes,
    });
  }
);

//ruta para definir todas las cantidades vendidas en cero

router.get("/cantidades-vendidas-cero", async (req, res) => {
  let stock = await stockDB.find();

  for (i = 0; i < stock.length; i++) {
    await stockDB.findByIdAndUpdate(stock[i]._id, {
      CantidadVendida: 0,
    });
  }

  res.send("Cantidades actualizadas");
});

//ruta para reporte de articulos

router.get('/facturacion/reporte-de-articulos', isAuthenticatedInventario, async (req, res) => {
  let stock = await stockDB.find()

  for(i=0; i < stock.length; i++){
    let CantidadTotal = stock[i].CantidadTotal
    let CostoFOBTotal = (+CantidadTotal * +stock[i].CostoFOB).toFixed(2)
    let CostoTotal = (+CantidadTotal * +stock[i].Costo).toFixed(2)
    let CostoGranMayorTotal = (+CantidadTotal * +stock[i].CostoGranMayor).toFixed(2)
    let CostoMayorTotal = (+CantidadTotal * +stock[i].CostoMayor).toFixed(2)
    let CostoDetalTotal = (+CantidadTotal * +stock[i].CostoDetal).toFixed(2)


    await stockDB.findByIdAndUpdate(stock[i]._id,{
      CostoFOBTotal,
      CostoTotal,
      CostoGranMayorTotal,
      CostoMayorTotal,
      CostoDetalTotal,
    })
  }

 stock = await stockDB.find({CantidadVendida : {$gt: 0}}).sort({"CodigoT": 1 })
  stock = stock.map((data) => {
    return{
      CodigoT: data.CodigoT,
      TipoProducto: data.TipoProducto,
      CantidadVendida : data.CantidadVendida,
    }
  })


  res.render('facturacion/inventario/reporte-articulos',{
    stock
  })

})

//ruta para agregar mas productos 

router.get('/agregar-mas-productos/:id', async (req, res) => {

  const compra = await ordenComprasProveedorDB.findOne({
    OrdenTemporal: req.params.id,
  });
  let _id = compra._id 
  let orden = compra.OrdenNumero

    res.render('facturacion/proveedor/agregar-productos',{
      _id,
      orden
    })


})

//ruta para actualizar valores del stock

router.get('/actualizar-stock-datos-precios', async (req, res) => {

    let stock = await stockDB.find()

    for(i=0; i < stock.length; i++){
      let CantidadTotal = stock[i].CantidadTotal
      let CostoFOBTotal = (+CantidadTotal * +stock[i].CostoFOB).toFixed(2)
      let CostoTotal = (+CantidadTotal * +stock[i].Costo).toFixed(2)
      let CostoGranMayorTotal = (+CantidadTotal * +stock[i].CostoGranMayor).toFixed(2)
      let CostoMayorTotal = (+CantidadTotal * +stock[i].CostoMayor).toFixed(2)
      let CostoDetalTotal = (+CantidadTotal * +stock[i].CostoDetal).toFixed(2)


      await stockDB.findByIdAndUpdate(stock[i]._id,{
        CostoFOBTotal,
        CostoTotal,
        CostoGranMayorTotal,
        CostoMayorTotal,
        CostoDetalTotal,
      })


    }

    res.send("Stock actualizado correctamente")


})



//ver cantidad vendida
router.get('/contar-cantidad-vendida', async (req, res) => {
  let facturas = await facturaDB.find()
  let productos = []
  let stock = await stockDB.find()
  for(r=0; r< stock.length;r++){
  let cantidad = 0
  for(i=0; i< facturas.length; i++){
    for(x=0; x< facturas[i].Productos.length; x++){
      if(facturas[i].Productos[x].Codigo == stock[r].CodigoT){
        cantidad += +facturas[i].Productos[x].Cantidad
      }
    }
  }
  let data = {
    Codigo: stock[r].CodigoT,
    CantidadVendida: cantidad
  }
  productos.push(data)
  
}

  
const xl = require("excel4node");

const wb = new xl.Workbook();

const ws = wb.addWorksheet("Stock Thomson");

ws.cell(1, 1).string("Codigo Thomson");
ws.cell(1, 2).string("Cantidad vendida");

let fila = 2
for(m=0; m< productos.length; m++){
  let columna = 1

  ws.cell(fila, columna++).string(productos[m].Codigo)
  ws.cell(fila, columna++).number(productos[m].CantidadVendida)

  fila++
}

wb.write("Cantidades vendidas.xlsx", res);


})


//tipo precio facturas

router.get('/cambiar-tipo-precio-facturas', async (req, res) => {

  let facturas = await facturaDB.find()

  for(i=0; i< facturas.length; i++){
    await facturaDB.findByIdAndUpdate(facturas[i]._id,{
      TipoPrecio: "GRANMAYOR"
    })
  }

  res.send("Facturas actualizadas")

})


router.get("/solucionar-orden-compra", async (req, res) => {

  let orden = await ordenComprasProveedorDB.findOne({OrdenNumero: 20210001})
  let productos = []

    for(x=0; x< orden.Productos.length; x++){
      let stock = await stockDB.findOne({CodigoT: orden.Productos[x].CodigoT})
      let producto = {
        CodigoT: orden.Productos[x].CodigoT,
        CodigoG: stock.CodigoG,
        Descripcion: orden.Productos[x].Descripcion,
        Posicion: stock.Posicion,
        Modelo: stock.Familia,
        TipoProducto: stock.TipoProducto,
        Costo: stock.Costo,
        CostoGranMayor: stock.CostoGranMayor,
        CostoMayor: stock.CostoMayor,
        CostoDetal: stock.CostoDetal,
        Cantidad: orden.Productos[x].Cantidad,
        PrecioUnidad: orden.Productos[x].PrecioUnidad,
        PrecioTotal: orden.Productos[x].PrecioTotal
      }
      productos.push(producto)
    }

    await ordenComprasProveedorDB.findOneAndUpdate({OrdenNumero: 20210001},{
      Productos : productos
    })


  res.send("ok")

})

//ruta para ver todas las devoluciones

router.get('/facturacion/todas-devoluciones', isAuthenticatedCobranza, async (req, res) => {
  let devoluciones = await recibosDevolucioDB.find().sort({"Recibo": -1})
  let devolucionesPorMonto = await reciboPorMontoDB.find().sort({"Recibo": -1}) 
  let clientes = await clienteDB.find().sort({Empresa: -1})
  let totalCantidad = 0
  let totalPrecio = 0
  clientes = clientes.map((data) => {
    return{
      Empresa: data.Empresa,
      _id: data._id
    }
  })
  devoluciones = devoluciones.map((data) => {
    return{
      Fecha: data.Fecha,
      Timestamp: data.Timestamp,
      Recibo: data.Recibo,
      NotaEntrega: data.NotaEntrega,
      Cliente: data.Cliente,
      Documento: data.Documento,
      Direccion: data.Direccion,
      Celular: data.Celular,
      link:`/ver-devolucion/${data.Recibo}`,
      Productos: data.Productos.map((data2) => {
        return{
          Codigo: data2.Codigo,
          Cantidad: data2.Cantidad,
          Precio: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Precio),
        }
      }),     
      Titulo: data.Titulo,
      PrecioActualNota: data.PrecioActualNota,
      _id: data._id,
    }
  })
  devolucionesPorMonto = devolucionesPorMonto.map((data) => {
    return{
      Fecha: data.Fecha,
      Timestamp: data.Timestamp,
      Recibo: data.Recibo,
      NotaEntrega: data.NotaEntrega,
      Cliente: data.Cliente,
      Documento: data.Documento,
      Direccion: data.Direccion,
      Celular: data.Celular,
      Titulo: data.Titulo,
      Cantidad: "-",
      Comentario: data.Comentario,
      PrecioActualNota: data.PrecioActualNota,
      link:`/ver-devolucion-por-cobro/${data.Recibo}`,
      Productos: data.Productos.map((data2) => {
        return{
          NotaEntrega: data2.NotaEntrega,
          Precio: data2.Precio,
        }
      })
    }
  })
  let Devoluciones = []

  for(i=0; i<devolucionesPorMonto.length; i++){
    let precioGeneralDevolucion = 0
    let precio = devolucionesPorMonto[i].Productos[0].Precio
    totalPrecio = (+totalPrecio + +precio).toFixed(2) 
    devolucionesPorMonto[i].Precio = devolucionesPorMonto[i].Productos[0].Precio
    devolucionesPorMonto[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devolucionesPorMonto[i].Precio)
    Devoluciones.push(devolucionesPorMonto[i])
  }
  
  for(i= 0; i< devoluciones.length; i++){
    let precioGeneralDevolucion = 0
    let cantidadGeneralDevolucion = 0
    for(r=0; r< devoluciones[i].Productos.length; r++ ){
      totalCantidad = +totalCantidad + +devoluciones[i].Productos[r].Cantidad 
      cantidadGeneralDevolucion += +devoluciones[i].Productos[r].Cantidad 
      let precio = devoluciones[i].Productos[r].Precio.replace("$","")
      precio = precio.replace(",","")
      precio = precio.replace(",","")
      totalPrecio = (+totalPrecio + +precio).toFixed(2) 
      precioGeneralDevolucion += +precio
    }

    devoluciones[i].Cantidad = cantidadGeneralDevolucion
    devoluciones[i].Precio = precioGeneralDevolucion.toFixed(2)
    devoluciones[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devoluciones[i].Precio)
    Devoluciones.push(devoluciones[i])
    
  }
  totalPrecio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(totalPrecio)

  Devoluciones.sort(function (a, b) {
    if (a.Recibo > b.Recibo) {
      return -1;
    }
    if (a.Recibo < b.Recibo) {
      return 1;
    }
    return 0;
  });


  res.render('facturacion/cobranza/todas-devoluciones',{
    Devoluciones,
    clientes,
    totalCantidad,
    totalPrecio
  })
  

})

router.post('/solicitar-recibo-de-devolucion-clientes', async (req, res) => {
  let {Cliente, Hasta, Desde} = req.body
  
  if(Hasta == 0){
    let devoluciones = await recibosDevolucioDB.find({Cliente:Cliente}).sort({"Recibo": -1})
    let devolucionesPorMonto = await reciboPorMontoDB.find({Cliente:Cliente}).sort({"Recibo": -1}) 
    let totalCantidad = 0
    let totalPrecio = 0
    devoluciones = devoluciones.map((data) => {
      return{
        Fecha: data.Fecha,
        Timestamp: data.Timestamp,
        Recibo: data.Recibo,
        NotaEntrega: data.NotaEntrega,
        Cliente: data.Cliente,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Celular: data.Celular,
        link:`/ver-devolucion/${data.Recibo}`,
        Productos: data.Productos.map((data2) => {
          return{
            Codigo: data2.Codigo,
            Cantidad: data2.Cantidad,
            Precio: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Precio),
          }
        }),     
        Titulo: data.Titulo,
        PrecioActualNota: data.PrecioActualNota,
        _id: data._id,
      }
    })
    devolucionesPorMonto = devolucionesPorMonto.map((data) => {
      return{
        Fecha: data.Fecha,
        Timestamp: data.Timestamp,
        Recibo: data.Recibo,
        NotaEntrega: data.NotaEntrega,
        Cliente: data.Cliente,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Celular: data.Celular,
        Titulo: data.Titulo,
        Cantidad: "-",
        Comentario: data.Comentario,
        PrecioActualNota: data.PrecioActualNota,
        link:`/ver-devolucion-por-cobro/${data.Recibo}`,
        Productos: data.Productos.map((data2) => {
          return{
            NotaEntrega: data2.NotaEntrega,
            Precio: data2.Precio,
          }
        })
      }
    })
    let Devoluciones = []

    for(i=0; i<devolucionesPorMonto.length; i++){
      let precioGeneralDevolucion = 0
      let precio = devolucionesPorMonto[i].Productos[0].Precio
      totalPrecio = (+totalPrecio + +precio).toFixed(2) 
      devolucionesPorMonto[i].Precio = devolucionesPorMonto[i].Productos[0].Precio
      devolucionesPorMonto[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devolucionesPorMonto[i].Precio)
      Devoluciones.push(devolucionesPorMonto[i])
    }
    
    for(i= 0; i< devoluciones.length; i++){
      let precioGeneralDevolucion = 0
      let cantidadGeneralDevolucion = 0
      for(r=0; r< devoluciones[i].Productos.length; r++ ){
        totalCantidad = +totalCantidad + +devoluciones[i].Productos[r].Cantidad 
        cantidadGeneralDevolucion += +devoluciones[i].Productos[r].Cantidad 
        let precio = devoluciones[i].Productos[r].Precio.replace("$","")
        precio = precio.replace(",","")
        precio = precio.replace(",","")
        totalPrecio = (+totalPrecio + +precio).toFixed(2) 
        precioGeneralDevolucion += +precio
      }

      devoluciones[i].Cantidad = cantidadGeneralDevolucion
      devoluciones[i].Precio = precioGeneralDevolucion.toFixed(2)
      devoluciones[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devoluciones[i].Precio)
      Devoluciones.push(devoluciones[i])
      
    }
    totalPrecio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(totalPrecio)

    Devoluciones.sort(function (a, b) {
      if (a.Recibo > b.Recibo) {
        return -1;
      }
      if (a.Recibo < b.Recibo) {
        return 1;
      }
      return 0;
    });

    let data = {
      Devoluciones,
      totalCantidad,
      totalPrecio
    } 
    res.send(JSON.stringify(data))

  }else{
    let fechaDesde = new Date(Desde).getTime();
    let fechaHasta = new Date(Hasta).getTime();
    let devoluciones = await recibosDevolucioDB.find({$and : [{Cliente:Cliente},{Timestamp: {$gte : fechaDesde}}, {Timestamp: {$lte:fechaHasta}}]}).sort({"Recibo": -1})
    let devolucionesPorMonto = await reciboPorMontoDB.find({$and : [{Cliente:Cliente},{Timestamp: {$gte : fechaDesde}}, {Timestamp: {$lte:fechaHasta}}]}).sort({"Recibo": -1}) 
    let totalCantidad = 0
    let totalPrecio = 0
    devoluciones = devoluciones.map((data) => {
      return{
        Fecha: data.Fecha,
        Timestamp: data.Timestamp,
        Recibo: data.Recibo,
        NotaEntrega: data.NotaEntrega,
        Cliente: data.Cliente,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Celular: data.Celular,
        link:`/ver-devolucion/${data.Recibo}`,
        Productos: data.Productos.map((data2) => {
          return{
            Codigo: data2.Codigo,
            Cantidad: data2.Cantidad,
            Precio: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Precio),
          }
        }),     
        Titulo: data.Titulo,
        PrecioActualNota: data.PrecioActualNota,
        _id: data._id,
      }
    })
    devolucionesPorMonto = devolucionesPorMonto.map((data) => {
      return{
        Fecha: data.Fecha,
        Timestamp: data.Timestamp,
        Recibo: data.Recibo,
        NotaEntrega: data.NotaEntrega,
        Cliente: data.Cliente,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Celular: data.Celular,
        Titulo: data.Titulo,
        Cantidad: "-",
        Comentario: data.Comentario,
        PrecioActualNota: data.PrecioActualNota,
        link:`/ver-devolucion-por-cobro/${data.Recibo}`,
        Productos: data.Productos.map((data2) => {
          return{
            NotaEntrega: data2.NotaEntrega,
            Precio: data2.Precio,
          }
        })
      }
    })
    let Devoluciones = []

    for(i=0; i<devolucionesPorMonto.length; i++){
      let precioGeneralDevolucion = 0
      let precio = devolucionesPorMonto[i].Productos[0].Precio
      totalPrecio = (+totalPrecio + +precio).toFixed(2) 
      devolucionesPorMonto[i].Precio = devolucionesPorMonto[i].Productos[0].Precio
      devolucionesPorMonto[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devolucionesPorMonto[i].Precio)
      Devoluciones.push(devolucionesPorMonto[i])
    }
    
    for(i= 0; i< devoluciones.length; i++){
      let precioGeneralDevolucion = 0
      let cantidadGeneralDevolucion = 0
      for(r=0; r< devoluciones[i].Productos.length; r++ ){
        totalCantidad = +totalCantidad + +devoluciones[i].Productos[r].Cantidad 
        cantidadGeneralDevolucion += +devoluciones[i].Productos[r].Cantidad 
        let precio = devoluciones[i].Productos[r].Precio.replace("$","")
        precio = precio.replace(",","")
        precio = precio.replace(",","")
        totalPrecio = (+totalPrecio + +precio).toFixed(2) 
        precioGeneralDevolucion += +precio
      }

      devoluciones[i].Cantidad = cantidadGeneralDevolucion
      devoluciones[i].Precio = precioGeneralDevolucion.toFixed(2)
      devoluciones[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devoluciones[i].Precio)
      Devoluciones.push(devoluciones[i])
      
    }
    totalPrecio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(totalPrecio)

    Devoluciones.sort(function (a, b) {
      if (a.Recibo > b.Recibo) {
        return -1;
      }
      if (a.Recibo < b.Recibo) {
        return 1;
      }
      return 0;
    });
    let data = {
      Devoluciones,
      totalCantidad,
      totalPrecio
    } 
    res.send(JSON.stringify(data))
  }
})

//ruta para recibos de pago 

router.get('/facturacion/todos-recibos', isAuthenticatedCobranza, async (req, res) => {
  let recibos = await notasPagoDB.find().sort({"Recibo":-1})
  let clientes = await clienteDB.find().sort({"Empresa": -1})
  clientes = clientes.map((data) => {
    return{
      _id : data._id,
      Empresa: data.Empresa
    }
  })
  let totalPrecio = 0
  recibos = recibos.map((data) => {
    return{
      Fecha: data.Fecha,
      Timestamp: data.Timestamp,
      Recibo: data.Recibo,
      Facturas: data.Facturas.map((data2) =>{ 
        return{
          NotaEntrega: data2.NotaEntrega,
          Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Monto),
          Modalidad: data2.Modalidad,
          Comentario: data2.Comentario,
        }
      }),
      Cliente: data.Cliente,
      Documento: data.Documento,
      Direccion: data.Direccion,
      Celular: data.Celular,
      PendienteAPagar: data.PendienteAPagar,
    }
  })
  
  for(i=0; i< recibos.length; i++){
    let montoGeneralRecibo = 0
    for(r=0; r< recibos[i].Facturas.length; r++){
      let suma = recibos[i].Facturas[r].Monto.replace("$","")
      suma = suma.replace(",","")
      suma = suma.replace(",","")
      montoGeneralRecibo += +suma
    }

    totalPrecio = (+totalPrecio + +montoGeneralRecibo).toFixed(2)
    montoGeneralRecibo = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoGeneralRecibo.toFixed(2))
    recibos[i].Monto = montoGeneralRecibo
  }
  totalPrecio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(totalPrecio)


  res.render('facturacion/cobranza/todos-recibos',{
    recibos,
    clientes,
    totalPrecio
  })

})

router.post('/solicitar-recibo-pago-clientes', async (req, res) => {
  let {Desde, Hasta, Cliente} = req.body

  if(Desde == 0){
    let recibos = await notasPagoDB.find({Cliente:Cliente}).sort({"Recibo":-1})
    let totalPrecio = 0
    recibos = recibos.map((data) => {
      return{
        Fecha: data.Fecha,
        Timestamp: data.Timestamp,
        Recibo: data.Recibo,
        Facturas: data.Facturas.map((data2) =>{ 
          return{
            NotaEntrega: data2.NotaEntrega,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Monto),
            Modalidad: data2.Modalidad,
            Comentario: data2.Comentario,
          }
        }),
        Cliente: data.Cliente,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Celular: data.Celular,
        PendienteAPagar: data.PendienteAPagar,
      }
    })
    
    for(i=0; i< recibos.length; i++){
      let montoGeneralRecibo = 0
      for(r=0; r< recibos[i].Facturas.length; r++){
        let suma = recibos[i].Facturas[r].Monto.replace("$","")
        suma = suma.replace(",","")
        suma = suma.replace(",","")
        montoGeneralRecibo += +suma
      }
  
      totalPrecio = (+totalPrecio + +montoGeneralRecibo).toFixed(2)
      montoGeneralRecibo = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoGeneralRecibo.toFixed(2))
      recibos[i].Monto = montoGeneralRecibo
    }
    totalPrecio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(totalPrecio)

    let data = {
      recibos,
      totalPrecio
    }
    res.send(JSON.stringify(data))
  }else{
    let fechaDesde = new Date(Desde).getTime();
    let fechaHasta = new Date(Hasta).getTime();
    let recibos = await notasPagoDB.find({$and : [{Cliente:Cliente},{Timestamp: {$gte : fechaDesde}}, {Timestamp: {$lte:fechaHasta}}]}).sort({"Recibo":-1})
    let totalPrecio = 0
    recibos = recibos.map((data) => {
      return{
        Fecha: data.Fecha,
        Timestamp: data.Timestamp,
        Recibo: data.Recibo,
        Facturas: data.Facturas.map((data2) =>{ 
          return{
            NotaEntrega: data2.NotaEntrega,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Monto),
            Modalidad: data2.Modalidad,
            Comentario: data2.Comentario,
          }
        }),
        Cliente: data.Cliente,
        Documento: data.Documento,
        Direccion: data.Direccion,
        Celular: data.Celular,
        PendienteAPagar: data.PendienteAPagar,
      }
    })
    
    for(i=0; i< recibos.length; i++){
      let montoGeneralRecibo = 0
      for(r=0; r< recibos[i].Facturas.length; r++){
        let suma = recibos[i].Facturas[r].Monto.replace("$","")
        suma = suma.replace(",","")
        suma = suma.replace(",","")
        montoGeneralRecibo += +suma
      }
  
      totalPrecio = (+totalPrecio + +montoGeneralRecibo).toFixed(2)
      montoGeneralRecibo = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoGeneralRecibo.toFixed(2))
      recibos[i].Monto = montoGeneralRecibo
    }
    totalPrecio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(totalPrecio)

    let data = {
      recibos,
      totalPrecio
    }
    res.send(JSON.stringify(data))
  }
})


//ruta para facturacion

router.post('/solicitar-facturas-filtro', isAuthenticatedFacturacion, async (req, res) => {
  let { Desde, Hasta} = req.body
  let fechaDesde = new Date(Desde).getTime();
  let fechaHasta = new Date(Hasta).getTime();
  let facturas = await facturaDB.find({$and: [{ "Timestamp": { $gte: fechaDesde }},{ "Timestamp": { $lte: fechaHasta }}]})
  let TotalNeto = 0
  let TotalSaldo = 0
  for(i=0; i< facturas.length; i++){
    TotalSaldo = (+TotalSaldo + +facturas[i].PendienteAPagar).toFixed(2)
    TotalNeto = (+TotalNeto + +facturas[i].PrecioTotal).toFixed(2)
  }
  facturas = facturas.map((data) => {
    return{
      Factura: data.Factura,
      Timestamp: data.Timestamp,
      Cliente: data.Cliente,
      DocumentoTipo: data.DocumentoTipo,
      Documento: data.Documento,
      Direccion: data.Direccion,
      OrdenNumero: data.OrdenNumero,
      Productos: data.Productos,
      CantidadTotal: data.CantidadTotal,
      PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
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
      PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
      PendienteAPagarComision: data.PendienteAPagarComision,
      GananciasVendedor: data.GananciasVendedor,
      FechaPagoComision: data.FechaPagoComision,
      EstadoComision: data.EstadoComision,
      TipoPrecio: data.TipoPrecio,
      Estado: data.Estado,
      User: data.User,
      Nota: data.Nota,
      Chofer: data.Chofer,
      EmpresaTransporte: data.EmpresaTransporte,
      Nota: data.Nota,
      HistorialPago: data.HistorialPago,
    }
  })
  let data = {
    facturas: facturas,
    TotalSaldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalSaldo),
    TotalNeto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalNeto),
  }
  res.send(JSON.stringify(data))

})

//ruta para cliente 

router.post('/solicitar-facturas-cliente', isAuthenticatedFacturacion, async (req, res) => {
  let {Cliente, Desde, Hasta} = req.body
  if(!Cliente){
    if(!Desde){
      res.send(JSON("error"))
    }else{
      let fechaDesde = new Date(Desde).getTime();
      let fechaHasta = new Date(Hasta).getTime();
      let facturas = await facturaDB.find({$and: [{ "Timestamp": { $gte: fechaDesde }},{ "Timestamp": { $lte: fechaHasta }}]})
      let TotalNeto = 0
      let TotalSaldo = 0
      let CantidadTotalGeneral = 0
      for(i=0; i< facturas.length; i++){
        TotalSaldo = (+TotalSaldo + +facturas[i].PendienteAPagar).toFixed(2)
        TotalNeto = (+TotalNeto + +facturas[i].PrecioTotal).toFixed(2)
        CantidadTotalGeneral += +facturas[i].CantidadTotal

      }

      facturas = facturas.map((data) => {
        return{
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Direccion: data.Direccion,
          OrdenNumero: data.OrdenNumero,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
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
          PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
          PendienteAPagarComision: data.PendienteAPagarComision,
          GananciasVendedor: data.GananciasVendedor,
          FechaPagoComision: data.FechaPagoComision,
          EstadoComision: data.EstadoComision,
          TipoPrecio: data.TipoPrecio,
          Estado: data.Estado,
          User: data.User,
          Nota: data.Nota,
          Chofer: data.Chofer,
          EmpresaTransporte: data.EmpresaTransporte,
          Nota: data.Nota,
          HistorialPago: data.HistorialPago,
        }
      })
      let data = {
        facturas: facturas,
        TotalSaldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalSaldo),
        TotalNeto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalNeto),
        CantidadTotalGeneral: CantidadTotalGeneral

      }
      res.send(JSON.stringify(data))

    }
  }else{
    if(Desde){
      let fechaDesde = new Date(Desde).getTime();
      let fechaHasta = new Date(Hasta).getTime();
      let facturas = await facturaDB.find({$and: [{Cliente:Cliente},{ "Timestamp": { $gte: fechaDesde }},{ "Timestamp": { $lte: fechaHasta }}]})
      let TotalNeto = 0
      let TotalSaldo = 0
      let CantidadTotalGeneral = 0
      for(i=0; i< facturas.length; i++){
        TotalSaldo = (+TotalSaldo + +facturas[i].PendienteAPagar).toFixed(2)
        TotalNeto = (+TotalNeto + +facturas[i].PrecioTotal).toFixed(2)
        CantidadTotalGeneral += +facturas[i].CantidadTotal


      }

      facturas = facturas.map((data) => {
      return{
        Factura: data.Factura,
        Timestamp: data.Timestamp,
        Cliente: data.Cliente,
        DocumentoTipo: data.DocumentoTipo,
        Documento: data.Documento,
        Direccion: data.Direccion,
        OrdenNumero: data.OrdenNumero,
        Productos: data.Productos,
        CantidadTotal: data.CantidadTotal,
        PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
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
        PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
        PendienteAPagarComision: data.PendienteAPagarComision,
        GananciasVendedor: data.GananciasVendedor,
        FechaPagoComision: data.FechaPagoComision,
        EstadoComision: data.EstadoComision,
        TipoPrecio: data.TipoPrecio,
        Estado: data.Estado,
        User: data.User,
        Nota: data.Nota,
        Chofer: data.Chofer,
        EmpresaTransporte: data.EmpresaTransporte,
        Nota: data.Nota,
        HistorialPago: data.HistorialPago,
      }
    })
    let data = {
      facturas: facturas,
      TotalSaldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalSaldo),
      TotalNeto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalNeto),
      CantidadTotalGeneral: CantidadTotalGeneral
    }
    res.send(JSON.stringify(data))

    }else{
      let facturas = await facturaDB.find({Cliente:Cliente}).sort({Timestamp: -1})
      let TotalNeto = 0
      let TotalSaldo = 0
      let CantidadTotalGeneral = 0
      for(i=0; i< facturas.length; i++){
        TotalSaldo = (+TotalSaldo + +facturas[i].PendienteAPagar).toFixed(2)
        TotalNeto = (+TotalNeto + +facturas[i].PrecioTotal).toFixed(2)
        CantidadTotalGeneral += +facturas[i].CantidadTotal

      }
    facturas = facturas.map((data) => {
      return{
        Factura: data.Factura,
        Timestamp: data.Timestamp,
        Cliente: data.Cliente,
        DocumentoTipo: data.DocumentoTipo,
        Documento: data.Documento,
        Direccion: data.Direccion,
        OrdenNumero: data.OrdenNumero,
        Productos: data.Productos,
        CantidadTotal: data.CantidadTotal,
        PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
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
        PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
        PendienteAPagarComision: data.PendienteAPagarComision,
        GananciasVendedor: data.GananciasVendedor,
        FechaPagoComision: data.FechaPagoComision,
        EstadoComision: data.EstadoComision,
        TipoPrecio: data.TipoPrecio,
        Estado: data.Estado,
        User: data.User,
        Nota: data.Nota,
        Chofer: data.Chofer,
        EmpresaTransporte: data.EmpresaTransporte,
        Nota: data.Nota,
        HistorialPago: data.HistorialPago,
      }
    })
    let data = {
      facturas: facturas,
      TotalSaldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalSaldo),
      TotalNeto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(TotalNeto),
      CantidadTotalGeneral: CantidadTotalGeneral

    }
    res.send(JSON.stringify(data))
    }
  }
})

//ruta para cambiar las comisiones 

router.get('/cambiar-comisiones', async (req, res) =>{
  let facturas = await facturaDB.find({EstadoComision:"Cancelado"})
   for(i=0; i< facturas.length; i++){
     await facturaDB.findByIdAndUpdate(facturas[i],{
       EstadoComision: "Por cobrar"
     })
   }
   res.send("Ok")

})

//ruta para ver recibo

router.get('/ver-recibo-pago-comision/:id', isAuthenticatedComision, async (req, res) => {
  let recibo = await recibosComisionesDB.findOne({Recibo: req.params.id})
  let totalPagado = 0
  for(i=0; i< recibo.Facturas.length; i++){
    totalPagado += +recibo.Facturas[i].Comision
  }
  totalPagado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(totalPagado)
  let Recibo = {
    Fecha: recibo.Fecha,
    Timestamp: recibo.Timestamp,
    Recibo: recibo.Recibo,
    Vendedor: recibo.Vendedor,
    Documento: recibo.Documento,
    Nombres: recibo.Nombres,
    Apellidos: recibo.Apellidos,
    Direccion: recibo.Direccion,
    Comentario: recibo.Comentario,
    Celular: recibo.Celular,
    Total: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(recibo.Total),
    Facturas: recibo.Facturas.map((data2) => {
      return{
        Factura: data2.Factura,
        Comision: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Comision),
        Cliente: data2.Cliente,
      }
    }),

  }
  res.render('facturacion/reporte_pdf/recibo-pago-comisiones',{
    Recibo,
    totalPagado
  })

})
//ruta para editar fecha de vencimiento

router.get('/factura-ajustar-vencimiento/:id', isAuthenticatedFacturacion, async (req, res) => {
  let _id = req.params.id
  res.render('facturacion/facturacion/editar-vencimiento',{
    _id
  })

})

//ruta para ajustar fecha de vencimiento

router.post('/ajustar-vencimiento/:id', isAuthenticatedFacturacion, async (req, res) => {
  let {Vencimiento} = req.body
  if(!Vencimiento){
    req.flash("error",'El campo "Nueva fecha de vencimiento" no puede estar vacío')
    res.redirect(`/factura-ajustar-vencimiento/${_id}`)
  }else{
    await facturaDB.findByIdAndUpdate(req.params.id,{
      Vencimiento: Vencimiento
    })
    res.redirect(`/facturacion/ventas`)
  }
})

//ruta para ajustar todas las facturas

router.get('/ajuste-de-facturas',async (req, res) => {
  let facturas = await facturaDB.find()
  for(i=0; i< facturas.length; i++){
    await facturaDB.findByIdAndUpdate(facturas[i]._id,{
      PrecioTotal2: facturas[i].PrecioTotal
    })
  }
  res.send("ok")

})
//ruta para ajustar precio2

router.get('/ajustar-precio2', async (req, res) => {
  let facturas = await facturaDB.find()
  for(i=0; i<facturas.length; i++){
    let totalRestar = 0
    for(r=0; r <facturas[i].HistorialPago.length; r++){
      if(facturas[i].HistorialPago[r].Modalidad == "DEVOLUCIÓN"){
        totalRestar = (+totalRestar + +facturas[i].HistorialPago[r].Pago).toFixed(2)
      }
    }
    let PrecioTotal2 = (+facturas[i].PrecioTotal2 - +totalRestar).toFixed(2)
    await facturaDB.findByIdAndUpdate(facturas[i]._id,{
      PrecioTotal2: PrecioTotal2
    })
  }
  res.send("ok")
})
//ruta para incluir productos2

router.get('/incluir-productos-2', async (req,res) => {
  let facturas = await facturaDB.find()
  for(i=0; i<facturas.length; i++){
    let productos = []
    for(r=0; r <facturas[i].Productos.length; r++){
       facturas[i].Productos[r].precioTotal2 = facturas[i].Productos[r].precioTotal 
      productos.push(facturas[i].Productos[r])
    }
    await facturaDB.findByIdAndUpdate(facturas[i]._id,{
      Productos: productos
    })
  }
  res.send("ok")
})


//ruta para reporte de proveedores

router.get('/facturacion/reporte-de-proveedores', isAuthenticatedProveedor, async (req, res) => {
  let proveedores = await proveedorDB.find().sort({Nombre:1})
  proveedores = proveedores.map((data) => {
    return{
      Nombre: data.Nombre,
    }
  })
  res.render('facturacion/proveedor/reporte-proveedores',{
    proveedores
  })

})


//ruta para actualizar campos de cantidad en transito y cantidad en produccion

router.get('/actualizar-datos-stock',async (req, res) => {
  let stock = await stockDB.find()

    for(i=0; i< stock.length; i++){
      await stockDB.findByIdAndUpdate(stock[i]._id,{
        CantidadTransito: 0,
        CantidadProduccion: 0,
      })
    }

    res.send("Cantidad Transito y produccion actualizado a cero")

})

router.get('/actualizar-datos-produccion',async (req, res) => {
  let ordenes = await ordenComprasProveedorDB.find()
  for(i=0; i< ordenes.length; i++){
    if(ordenes[i].Estado == "Transito"){
      for(r=0; r< ordenes[i].Productos.length; r++){
        let stock = await stockDB.findOne({CodigoT: ordenes[i].Productos[r].CodigoT})
        CantidadTransito = +stock.CantidadTransito + +ordenes[i].Productos[r].Cantidad
        await stockDB.findByIdAndUpdate(stock._id,{
          CantidadTransito: CantidadTransito
        })
      }
    }else{
      for(r=0; r< ordenes[i].Productos.length; r++){
        let stock = await stockDB.findOne({CodigoT: ordenes[i].Productos[r].CodigoT})
        CantidadProduccion = +stock.CantidadProduccion + +ordenes[i].Productos[r].Cantidad
        await stockDB.findByIdAndUpdate(stock._id,{
          CantidadProduccion: CantidadProduccion
        })
      }

    }
  }
  res.send("Cantidades actualizadas correctamente")
})
//ruta para actualizar contadores

//ejecutar 5
router.get('/actualizar-contadores', async (req, res) => {
  let contadorClientes = await contadorClientesDB.find()
  let contadorFacturas = await contadorFacturasDB.find()
  let contadorOrdenes = await contadorOrdenesDB.find()
  let facturas = await facturaDB.find()
  let ordenes = await ordenesClientesDB.find()
  let clientes = await clienteDB.find()
  if(contadorClientes.length == 0){
  
    let nuevocontadorClientes = new contadorClientesDB({
      Cantidad: clientes.length
    })
    let nuevocontadorFacturas = new contadorFacturasDB({
      Cantidad: facturas.length
    })
    let nuevocontadorOrdenes = new contadorOrdenesDB({
      Cantidad: ordenes.length
    })
    
    await nuevocontadorClientes.save()
    await nuevocontadorFacturas.save()
    await nuevocontadorOrdenes.save()
  
  }else{
  
    await contadorFacturasDB.findByIdAndUpdate(contadorFacturas[0]._id,{
      Cantidad: facturas.length
    })
    await contadorClientesDB.findByIdAndUpdate(contadorClientes[0]._id,{
      Cantidad: ordenes.length
    })
    await contadorOrdenesDB.findByIdAndUpdate(contadorOrdenes[0]._id,{
      Cantidad: clientes.length
    })
    
  }
  res.send("ok")
})


//ruta para llenar base de datos de dashboard

//ejecutar 4
router.get('/actualizar-db-dashboard', async (req, res) => {
  let amortiguadoresGeneral = await amortiguadoresGeneralDB.find()
  let basesGeneral = await basesGeneralDB.find()
  let bootsGeneral = await bootsGeneralDB.find()
  let facturas = await facturaDB.find()
  let valorFacutrasDetal = await valorFacturasDetalDB.find()
  let valorFacturasMayor = await valorFacturasMayorDB.find()
  let valorFacturasGranMayor = await valorFacturasGranMayorDB.find()
  let valorGeneralUtilidades = await valorGeneralUtilidadesDB.find()
  let valorGeneralFacturado = await valorGeneralFacturadoDB.find()


  //Cierre de actualizacion de contadores
  //actualizar venta de amortiguadores, bases, y boots, por mes y general
  let cantidadAmortiguadoresGeneral = 0
  let cantidadBasesGeneral = 0
  let cantidadBootsGeneral = 0
  //for para sumar tipo de productos vendidos
  for(i=0; i< facturas.length; i++){
    for(x=0; x< facturas[i].Productos.length; x++){
      if(facturas[i].Productos[x].Producto == "AMORTIGUADOR"){
        cantidadAmortiguadoresGeneral += +facturas[i].Productos[x].Cantidad
      }
      if(facturas[i].Productos[x].Producto == "BASE DE AMORTIGUADOR"){
        cantidadBasesGeneral += +facturas[i].Productos[x].Cantidad
      }
      if(facturas[i].Productos[x].Producto == "GUARDAPOLVO"){
        cantidadBootsGeneral += +facturas[i].Productos[x].Cantidad
      }
    }
  }
  let FacturasGranMayor = 0
  let FacturasMayor = 0
  let FacturasDetal = 0
  let FacturasGeneral = 0
  //for para sumar tipo de facturas y factura general
  for(i=0; i< facturas.length; i++){
    FacturasGeneral += +facturas[i].PrecioTotal2
    if(facturas[i].TipoPrecio == "GRANMAYOR"){
      FacturasGranMayor += +facturas[i].PrecioTotal2
    }
    if(facturas[i].TipoPrecio == "MAYOR"){
      FacturasMayor += +facturas[i].PrecioTotal2
    }
    if(facturas[i].TipoPrecio == "DETAL"){
      FacturasDetal += +facturas[i].PrecioTotal2
    }
  }
  
  //for para calcular utilidades
  let utilidadesGenerales = 0
  for(i=0; i< facturas.length;i++){
    for(x=0; x< facturas[i].Productos.length; x++){
        let stock = await stockDB.findOne({CodigoT: facturas[i].Productos[x].Codigo})
        if(facturas[i].Productos[x].precioTotal2 != "0.00" || facturas[i].Productos[x].precioTotal2 != "0" || facturas[i].Productos[x].precioTotal2 > 0){
          let resta = +stock.Costo * +facturas[i].Productos[x].Cantidad
          let valor = +facturas[i].Productos[x].precioTotal2 - +resta
          utilidadesGenerales += +valor
        }
    }
  }
  utilidadesGenerales = utilidadesGenerales.toFixed(2)


  if(amortiguadoresGeneral.length == 0){
    let nuevoamortiguadoresGeneral = new amortiguadoresGeneralDB({
      Cantidad : cantidadAmortiguadoresGeneral
    }) 
    let nuevobasesGeneral = new basesGeneralDB({
      Cantidad : cantidadBasesGeneral
    }) 
    let nuevobootsGeneral = new bootsGeneralDB({
      Cantidad : cantidadBootsGeneral
    }) 
    let nuevoFacturasGeneral = new valorGeneralFacturadoDB({
      valor: FacturasGeneral
    })
    let nuevoUtilidadGeneral = new valorGeneralUtilidadesDB({
      valor:  utilidadesGenerales
    })
    let nuevovalorFacturasGranMayor = new valorFacturasGranMayorDB({
      valor: FacturasGranMayor
    })
    let nuevovalorFacturasMayor = new valorFacturasMayorDB({
      valor: FacturasMayor
    })
    let nuevovalorFacutrasDetal = new valorFacturasDetalDB({
      valor: FacturasDetal
    })


    await nuevoamortiguadoresGeneral.save()
    await nuevobasesGeneral.save()
    await nuevobootsGeneral.save()
    await nuevoFacturasGeneral.save()
    await nuevoUtilidadGeneral.save()
    await nuevovalorFacturasGranMayor.save()
    await nuevovalorFacturasMayor.save()
    await nuevovalorFacutrasDetal.save()

  }else{

    await amortiguadoresGeneralDB.findByIdAndUpdate(amortiguadoresGeneral[0]._id,{
      Cantidad: cantidadAmortiguadoresGeneral
    })
    await basesGeneralDB.findByIdAndUpdate(basesGeneral[0]._id,{
      Cantidad: cantidadBasesGeneral
    })
    await bootsGeneralDB.findByIdAndUpdate(bootsGeneral[0]._id,{
      Cantidad: cantidadBootsGeneral
    })
    await valorGeneralFacturadoDB.findByIdAndUpdate(valorGeneralFacturado[0]._id,{
      valor:FacturasGeneral
    })
    await valorGeneralUtilidadesDB.findByIdAndUpdate(valorGeneralUtilidades[0]._id,{
      valor: utilidadesGenerales
    })
    await valorFacturasGranMayorDB.findByIdAndUpdate(valorFacturasGranMayor[0]._id,{
      valor:FacturasGranMayor
    })
    await valorFacturasMayorDB.findByIdAndUpdate(valorFacturasMayor[0]._id,{
      valor: FacturasMayor
    })
    await valorFacturasDetalDB.findByIdAndUpdate(valorFacutrasDetal[0]._id,{
      valor: FacturasDetal
    })
  }
  res.send("ok")
  
})

//ruta para actualizar todo por mes
//ejecutar 3 (error)
router.get('/actualizar-todo-por-mes', async (req, res) => {
  let facturas = await facturaDB.find()
  for(i=0; i< facturas.length; i++){
      let NumeroMes = facturas[i].date.substr(5,2)
      let Anio = facturas[i].date.substr(0,4)
      let Mes
      if(NumeroMes == "01"){Mes = "ENERO"}
      if(NumeroMes == "02"){Mes = "FEBRERO"}
      if(NumeroMes == "03"){Mes = "MARZO"}
      if(NumeroMes == "04"){Mes = "ABRIL"}
      if(NumeroMes == "05"){Mes = "MAYO"}
      if(NumeroMes == "06"){Mes = "JUNIO"}
      if(NumeroMes == "07"){Mes = "JULIO"}
      if(NumeroMes == "08"){Mes = "AGOSTO"}
      if(NumeroMes == "09"){Mes = "SEPTIEMBRE"}
      if(NumeroMes == "10"){Mes = "OCTUBRE"}
      if(NumeroMes == "11"){Mes = "NOVIEMBRE"}
      if(NumeroMes == "12"){Mes = "DICIEMBRE"}
  
      let validacionFacturacionPorMes = await facturadoPorMesDB.find()
  
      if(validacionFacturacionPorMes.length == 0){
        let nuevaValidacionFacturaPorMes = new facturadoPorMesDB({
          valor: facturas[i].PrecioTotal2,
          Mes: Mes, 
          NumeroMes: NumeroMes, 
          Anio: Anio
        })
        await nuevaValidacionFacturaPorMes.save()
      }else{
        let existeFacturadoPorMes =  validacionFacturacionPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
        if(existeFacturadoPorMes){
          let valor = +facturas[i].PrecioTotal2 + +existeFacturadoPorMes.valor
          await facturadoPorMesDB.findByIdAndUpdate(existeFacturadoPorMes._id,{
            valor: valor
          })
        }else{
          let nuevaValidacionFacturaPorMes = new facturadoPorMesDB({
            valor: facturas[i].PrecioTotal2,
            Mes: Mes, 
            NumeroMes: NumeroMes, 
            Anio: Anio
          })
          await nuevaValidacionFacturaPorMes.save()
        }
      }
      //calcular utilidades por mes
        for(x=0; x< facturas[i].Productos.length; x++){
            utilidadesGeneral = 0
            let stock = await stockDB.findOne({CodigoT: facturas[i].Productos[x].Codigo})
            if(facturas[i].Productos[x].precioTotal2 != "0.00" || facturas[i].Productos[x].precioTotal2 != "0" || facturas[i].Productos[x].precioTotal2 > 0){
              let resta = +stock.Costo * +facturas[i].Productos[x].Cantidad
              let valor = +facturas[i].Productos[x].precioTotal2 - +resta
              utilidadesGeneral += +valor
              let validacionUtilidadPorMes = await utilidadesPorMesDB.find()
              if(validacionUtilidadPorMes.length == 0){
                  let nuevaUtilidadPorMes = new utilidadesPorMesDB({
                    valor: utilidadesGeneral,
                    Mes: Mes, 
                    NumeroMes: NumeroMes, 
                    Anio: Anio
                  })
                  await nuevaUtilidadPorMes.save()
              }else{
                 let existeUtilidadPorMes =  validacionUtilidadPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
                 if(existeUtilidadPorMes){
                   let valorUtilidadesGeneral = +existeUtilidadPorMes.valor + +utilidadesGeneral
                  await utilidadesPorMesDB.findByIdAndUpdate(existeUtilidadPorMes._id,{
                    valor: valorUtilidadesGeneral,
  
                  })
                 }else{
                  let nuevaUtilidadPorMes = new utilidadesPorMesDB({
                    valor: utilidadesGeneral,
                    Mes: Mes, 
                    NumeroMes: NumeroMes, 
                    Anio: Anio
                  })
                  await nuevaUtilidadPorMes.save()
                 }
              }
            }
        }
  
      for(x=0; x< facturas[i].Productos.length; x++){
        if(facturas[i].Productos[x].Producto == "AMORTIGUADOR"){
          let validarAmortiguadorPorMes = await amortiguadoresPorMesDB.find()
          if(validarAmortiguadorPorMes.length == 0){
            let nuevoAmortiguadorPorMes = new amortiguadoresPorMesDB({
              NumeroMes: NumeroMes,
              Anio: Anio,
              Mes: Mes,
              Cantidad: facturas[i].Productos[x].Cantidad,
            })
            await nuevoAmortiguadorPorMes.save()
          }else{
            let existeMes = validarAmortiguadorPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
            if(existeMes){
              if(facturas[i].Productos[x].precioTotal2 != "0.00" || facturas[i].Productos[x].precioTotal2 != "0" || 
              facturas[i].Productos[x].precioTotal2 > 0){
                let Cantidad = +existeMes.Cantidad + +facturas[i].Productos[x].Cantidad
                await amortiguadoresPorMesDB.findByIdAndUpdate(existeMes._id,{
                  Cantidad: Cantidad
                })
              }
            }else{
              let nuevoAmortiguadorPorMes = new amortiguadoresPorMesDB({
                NumeroMes: NumeroMes,
                Anio: Anio,
                Mes: Mes,
                Cantidad: facturas[i].Productos[x].Cantidad,
              })
              await nuevoAmortiguadorPorMes.save()
            }
          }
        }
        if(facturas[i].Productos[x].Producto == "BASE DE AMORTIGUADOR"){
          let validarBasesPorMes = await basesPorMesDB.find()
          if(validarBasesPorMes.length == 0){
            let nuevaBasesPorMes = new basesPorMesDB({
              NumeroMes: NumeroMes,
              Anio: Anio,
              Mes: Mes,
              Cantidad: facturas[i].Productos[x].Cantidad,
            })
            await nuevaBasesPorMes.save()
          }else{
            let existeMes = validarBasesPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
            if(existeMes){
              if(facturas[i].Productos[x].precioTotal2 != "0.00" || facturas[i].Productos[x].precioTotal2 != "0" || 
              facturas[i].Productos[x].precioTotal2 > 0){
                let Cantidad = +existeMes.Cantidad + +facturas[i].Productos[x].Cantidad
  
                await basesPorMesDB.findByIdAndUpdate(existeMes._id,{
                  Cantidad: Cantidad
                })
              }
            }else{
              let nuevaBasesPorMes = new basesPorMesDB({
                NumeroMes: NumeroMes,
                Anio: Anio,
                Mes: Mes,
                Cantidad: facturas[i].Productos[x].Cantidad,
              })
              await nuevaBasesPorMes.save()
            }
          }
        }
        if(facturas[i].Productos[x].Producto == "GUARDAPOLVO"){
          let validarBootsPorMes = await bootsPorMesDB.find()
          if(validarBootsPorMes.length == 0){
            let nuevoBootsPorMes = new bootsPorMesDB({
              NumeroMes: NumeroMes,
              Anio: Anio,
              Mes: Mes,
              Cantidad: facturas[i].Productos[x].Cantidad,
            })
            await nuevoBootsPorMes.save()
          }else{
            let existeMes = validarBootsPorMes.find((data) => data.NumeroMes == NumeroMes || data.Mes == Mes)
            if(existeMes){
              if(facturas[i].Productos[x].precioTotal2 != "0.00" || facturas[i].Productos[x].precioTotal2 != "0" || 
              facturas[i].Productos[x].precioTotal2 > 0){
                let Cantidad = +existeMes.Cantidad + +facturas[i].Productos[x].Cantidad
                await bootsPorMesDB.findByIdAndUpdate(existeMes._id,{
                  Cantidad: Cantidad
                })
              }
            }else{
              let nuevoBootsPorMes = new bootsPorMesDB({
                NumeroMes: NumeroMes,
                Anio: Anio,
                Mes: Mes,
                Cantidad: facturas[i].Productos[x].Cantidad,
              })
              await nuevoBootsPorMes.save()
            }
          }
        }
      }
    }
  res.send("ok")
    
})



//actualizar productos con precio 2
//ejecutar 2
router.get('/actualizar-productos-factura', async (req, res) => {
  let facturas = await facturaDB.find()
  let Facturas = []
  for(i=0; i<facturas.length; i++){
    for(x=0; x< facturas[i].Productos.length; x++){
      if(!facturas[i].Productos[x].precioTotal2){
        Facturas.push(facturas[i].Factura)
      }
    }
  }
  for(i=0; i< Facturas.length; i++){
    let factura = await facturaDB.findOne({Factura: Facturas[i]})
    let Productos = []
    for(r=0; r< factura.Productos.length; r++){
      let producto = {
        Codigo: factura.Productos[r].Codigo,
        Producto: factura.Productos[r].Producto,
        Modelo: factura.Productos[r].Modelo,
        Cantidad: factura.Productos[r].Cantidad,
        precioUnidad: factura.Productos[r].precioUnidad,
        precioTotal: factura.Productos[r].precioTotal,
        precioTotal2: factura.Productos[r].precioTotal,
      }
      Productos.push(producto)
    } 
    await facturaDB.findByIdAndUpdate(factura._id,{
      Productos: Productos
    })
  }
  res.send("ok")
})


//ruta para generarle numero random a todos los productos

router.get('/generar-longitud-stock', async (req, res) => {
  let stock = await stockDB.find()

  for(i=0; i< stock.length; i++){
    let Alto = (Math.random() * 50).toFixed(2)
    let Largo = (Math.random() * 50).toFixed(2)
    let Ancho = (Math.random() * 50).toFixed(2)
    let Unidades = (Math.random() * 50).toFixed(0)
    let Peso = (Math.random() * 5).toFixed(2)

    await stockDB.findByIdAndUpdate(stock[i]._id,{
      Alto,
      Largo,
      Ancho,
      Unidades,
      Peso
    })
  }

  res.send("ok")
})

//ejecutar 1
router.get('/actualizar-cantidad-vendida', async (req, res) => {
  let facturas = await facturaDB.find()
  let devoluciones = await recibosDevolucioDB.find()
  let stock = await stockDB.find()
  for(r=0; r< stock.length;r++){
  let cantidad = 0
  for(i=0; i< facturas.length; i++){
    for(x=0; x< facturas[i].Productos.length; x++){
      if(facturas[i].Productos[x].Codigo == stock[r].CodigoT){
        cantidad += +facturas[i].Productos[x].Cantidad
      }
    }
  }
  await stockDB.findByIdAndUpdate(stock[r]._id,{
    CantidadVendida: cantidad
  })
} 
for(r=0; r< stock.length; r++){
  let cantidadRestar= 0
  let CantidadVendida = stock[r].CantidadVendida
  for(i=0; i< devoluciones.length; i++){
    for(t=0; t< devoluciones[i].Productos.length; t++){
      if(stock[r].CodigoT ==  devoluciones[i].Productos[t].CodigoT){
        cantidadRestar += +devoluciones[i].Productos[t].Cantidad
      }
    }
  }
  if(cantidadRestar >0){
    CantidadVendida -= +cantidadRestar
    await stockDB.findByIdAndUpdate(stock[r]._id,{
      CantidadVendida:CantidadVendida,
    })
  }
}

  res.send("ok")

})

router.get('/actualizar-imagenes-catalogo', isAuthenticatedThomson,async (req, res) => {
  let catalogo = await catalogoDB.find({"NombreImagen":"thomsonimg"})
  catalogo = catalogo.map((data) => {
    return{
      CodigoT:data.CodigoT,
    }
  })
  res.render('facturacion/inventario/actualizacion-masiva',{
    catalogo
  })
})


router.post('/cargar-imagenes-amortiguadores', isAuthenticatedThomson, upload.single('imagen'), async (req, res) => {
  let {CodigoT} = req.body
  fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1]);
  let NombreImagen = req.file.path.substr(31,1000)
  let Timestamp = Date.now();
  await catalogoDB.findOneAndUpdate({CodigoT:CodigoT},{
    NombreImagen,
    Timestamp
  })
  req.flash("success","Imagen cargada correctamente")
  res.redirect('/actualizar-imagenes-catalogo')
})


router.get('/devolucion-por-monto', isAuthenticatedCobranza, async (req, res) => {
  let clientes = await clienteDB.find().sort({"Empresa":1})
  clientes = clientes.map((data) => {
    return{
      Empresa: data.Empresa
    }
  })

  res.render('facturacion/cobranza/devolucion-por-dinero',{
    clientes
  })


})


//ruta para generar devolucion por precio

router.post('/registrar-devolucion-por-dinero', isAuthenticatedCobranza, async (req, res) => {
  let {Cliente, Factura, Precio, Comentario} = req.body
  let facturacionPorMes = await facturadoPorMesDB.find()
  let factura = await facturaDB.findOne({Factura: Factura})
  let fechaFactura = factura.date 
  let valorFacturasGranMayor = await valorFacturasGranMayorDB.find()
  let _idvalorFacturasGranMayor = valorFacturasGranMayor[0]._id
  let valorFacturasMayor = await valorFacturasMayorDB.find()
  let _idvalorFacturasMayor = valorFacturasMayor[0]._id
  let valorFacturasDetal = await valorFacturasDetalDB.find()
  let _idvalorFacturasDetal = valorFacturasDetal[0]._id
  let valorGeneralFacturado = await valorGeneralFacturadoDB.find()
  let _idvalorGeneralFacturado = valorGeneralFacturado[0]._id
  if(factura.TipoPrecio == "GRANMAYOR"){
    valorFacturasGranMayor = (+valorFacturasGranMayor[0].valor - +Precio).toFixed(2)
    await valorFacturasGranMayorDB.findByIdAndUpdate(_idvalorFacturasGranMayor,{
      valor: valorFacturasGranMayor
    })
  }
  if(factura.TipoPrecio == "MAYOR"){
    valorFacturasMayor = +valorFacturasMayor[0].valor - +Precio
    await valorFacturasMayorDB.findByIdAndUpdate(_idvalorFacturasMayor,{
      valor :valorFacturasMayor
    })
  }
  if(factura.TipoPrecio == "DETAL"){
    valorFacturasDetal = +valorFacturasDetal[0].valor - +Precio
    await valorFacturasDetalDB.findByIdAndUpdate(_idvalorFacturasDetal,{
      valor: valorFacturasDetal
    })
  }

  valorGeneralFacturado = (+valorGeneralFacturado[0].valor - +Precio).toFixed(2)
  await valorGeneralFacturadoDB.findByIdAndUpdate(_idvalorGeneralFacturado,{
    valor : valorGeneralFacturado,
  })  
  let NumeroMes = fechaFactura.substr(5,2)
  let Anio = fechaFactura.substr(0,4)
  let mesABuscar = facturacionPorMes.find((data) => data.NumeroMes == NumeroMes && data.Anio == Anio)
  let valorPorMes = (+mesABuscar.valor - +Precio).toFixed(2)
  await facturadoPorMesDB.findByIdAndUpdate(mesABuscar._id,{
    valor: valorPorMes
  })
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
  let Recibo = 0
  let reciboDevolucion = await recibosDevolucioDB.find().sort({"Timestamp": -1})
  let reciboPorMonto = await reciboPorMontoDB.find().sort({"Timestamp":-1})

  if(reciboPorMonto.length > 0){
    if(+reciboDevolucion[0].Recibo > +reciboPorMonto[0].Recibo){
      Recibo = +reciboDevolucion[0].Recibo + 1
    }else{
      Recibo = +reciboPorMonto[0].Recibo + 1
    }
  }else{
    Recibo = +reciboDevolucion[0].Recibo + 1
  }

  let HistorialPago = {
    Pago: Precio,
    Comentario: "DEVOLUCIÓN MONTO" ,
    Recibo: Recibo ,
    Modalidad: "DEVOLUCIÓN MONTO",
    FechaPago: date,
    user: req.user.email,
    Timestamp: Timestamp,
  }
  //actualizar comision
  let PendienteAPagar = (+factura.PendienteAPagar - +Precio).toFixed(2)
  let porcentajeMenos = 0
  if(factura.Porcentaje < 10){
    porcentajeMenos = `0.0${factura.Porcentaje}`
  }else{
    porcentajeMenos = `0.${factura.Porcentaje}`
  }
  let comisionMenos = (+porcentajeMenos * +factura.PrecioTotal2).toFixed(2)
  let GananciasVendedor = (+factura.GananciasVendedor - +comisionMenos).toFixed(2)


  if(PendienteAPagar == 0){
    await facturaDB.findByIdAndUpdate(factura._id,{
      Estado: "Cobrado",
      PendienteAPagar: PendienteAPagar,
      GananciasVendedor: GananciasVendedor,
      $push: {HistorialPago:HistorialPago}
    })
  }else{
    await facturaDB.findByIdAndUpdate(factura._id,{
      PendienteAPagar: PendienteAPagar,
      GananciasVendedor: GananciasVendedor,
      $push: {HistorialPago:HistorialPago}
    })
  }

  let Productos = [ {
    NotaEntrega: Factura,
    Precio: Precio,
  }]
  let nuevoReciboMonto = new reciboPorMontoDB({
    Fecha:date,
    Timestamp: Timestamp,
    Recibo: Recibo,
    NotaEntrega: Factura,
    Cliente: Cliente,
    Documento: factura.Documento,
    Direccion: factura.Direccion,
    Comentario: Comentario,
    Celular: factura.Celular,
    Titulo: "RECIBO DE DEVOLUCIÓN POR MONTO",
    PrecioActualNota: PendienteAPagar, 
    Productos: Productos
  })
  await nuevoReciboMonto.save()

  factura = {
    Fecha :nuevoReciboMonto.Fecha, 
    Timestamp :nuevoReciboMonto.Timestamp, 
    Recibo :nuevoReciboMonto.Recibo, 
    NotaEntrega :nuevoReciboMonto.NotaEntrega, 
    Cliente :nuevoReciboMonto.Cliente, 
    Documento :nuevoReciboMonto.Documento, 
    Direccion :nuevoReciboMonto.Direccion, 
    Celular :nuevoReciboMonto.Celular, 
    Titulo :nuevoReciboMonto.Titulo, 
    PrecioActualNota :nuevoReciboMonto.PrecioActualNota, 
    Precio :Productos[0].Precio, 
    Comentario: nuevoReciboMonto.Comentario
  }


  res.render('facturacion/reporte_pdf/ver-recibo-devolucion-cobros',{
    factura
  })
}) 

router.get('/ver-devolucion-por-cobro/:id', isAuthenticatedThomson, async (req, res) => {
    let reciboDevolucion = await reciboPorMontoDB.findOne({Recibo: req.params.id})
    if(reciboDevolucion.EstadoGeneral == "Anulada"){
      factura = {
        Fecha :reciboDevolucion.Fecha, 
        Timestamp :reciboDevolucion.Timestamp, 
        Recibo :reciboDevolucion.Recibo, 
        Anulada: "Si",
        NotaEntrega :reciboDevolucion.NotaEntrega, 
        Cliente :reciboDevolucion.Cliente, 
        Documento :reciboDevolucion.Documento, 
        Direccion :reciboDevolucion.Direccion, 
        Celular :reciboDevolucion.Celular, 
        Titulo :reciboDevolucion.Titulo, 
        PrecioActualNota :reciboDevolucion.PrecioActualNota, 
        Precio :reciboDevolucion.Productos[0].Precio, 
        Comentario: reciboDevolucion.Comentario
      }
      res.render('facturacion/reporte_pdf/ver-recibo-devolucion-cobros',{
        factura
      }) 
    }else{
      factura = {
        Fecha :reciboDevolucion.Fecha, 
        Timestamp :reciboDevolucion.Timestamp, 
        Recibo :reciboDevolucion.Recibo, 
        NotaEntrega :reciboDevolucion.NotaEntrega, 
        Cliente :reciboDevolucion.Cliente, 
        Documento :reciboDevolucion.Documento, 
        Direccion :reciboDevolucion.Direccion, 
        Celular :reciboDevolucion.Celular, 
        Titulo :reciboDevolucion.Titulo, 
        PrecioActualNota :reciboDevolucion.PrecioActualNota, 
        Precio :reciboDevolucion.Productos[0].Precio, 
        Comentario: reciboDevolucion.Comentario
      }
      res.render('facturacion/reporte_pdf/ver-recibo-devolucion-cobros',{
        factura
      }) 
    }



})


router.get('/libro-personal', isAuthenticatedAdministracion, async (req, res) => {
  let meses = await mesesPersonalDB.find().sort({ NumeroMes: -1 });
  let Monto = 0;
  meses = meses.map((data) => {
    return {
      Anio: data.Año,
      Mes: data.Mes,
      NumeroMes: data.NumeroMes,
      Estado: data.Estado,
      TotalEntrada: data.TotalEntrada,
      TotalSalida: data.TotalSalida,
      Total: data.Total,
      _id: data._id,
      dia: data.dia.map((data2) => {
        return {
          Timestamp: data2.Timestamp,
          Fecha: data2.Fecha,
          Monto: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data2.Monto),
          Monto2: data2.Monto,
          Entrada: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data2.Entrada),
          Entrada2: data2.Entrada,
          Total: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data2.Total),
          Total2: data2.Total,
          Salida: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data2.Salida),
          Salida2: data2.Salida,
          Comentario: data2.Comentario,
          _id: data2._id,
        };
      }),
    };
  });

  if (meses.length != 0) {
    Monto = +meses[0].Total;
  }
  Monto = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Monto);
  res.render("facturacion/administracion-personal", {
    Monto,
    meses,
  });
})

router.get('/facturacion/ver-cotizaciones', isAuthenticatedFacturacion, async (req, res)=>{
  let cotizaciones = await cotizacionDB.find()
  cotizaciones = cotizaciones.map((data) => {
    return{
      Factura: data.Factura,
      Timestamp: data.Timestamp,
      Cliente: data.Cliente,
      DocumentoTipo: data.DocumentoTipo,
      Documento: data.Documento,
      Direccion: data.Direccion,
      CantidadTotal: data.CantidadTotal,
      PrecioTotal: data.PrecioTotal,
      date: data.date.substr(0,10),
      Vencimiento: data.Vencimiento,
      Celular: data.Celular,
      Vendedor: data.Vendedor,
      Codigo: data.Codigo,
      DocumentoVendedor: data.DocumentoVendedor,
      Zona: data.Zona,
      Porcentaje: data.Porcentaje,
      FechaModificacion: data.FechaModificacion,
      UltimoPago: data.UltimoPago,
      PendienteAPagar: data.PendienteAPagar,
      GananciasVendedor: data.GananciasVendedor,
      Estado: data.Estado,
      User: data.User,
      Nota: data.Nota,
    }
  })
  res.render('facturacion/facturacion/ver-cotizaciones',{
    cotizaciones
  })
})

router.get('/facturacion/libro-contable', isAuthenticatedFacturacion, async (req, res) => {
  let facturas = await facturaDB.find({EstadoLibro: "Sin incluir"}).sort({"Timestamp" : 1})
  let devoluciones = await recibosDevolucioDB.find({EstadoLibro: "Sin incluir"}).sort({"Timestamp" : 1})
  let devolucionesMonto = await reciboPorMontoDB.find({EstadoLibro: "Sin incluir"}).sort({"Timestamp" : 1})
  let Documentos = []
  for(i=0; i< facturas.length; i++){
    if(!facturas[i].Factura){
      console.log(facturas[i].Factura)
    }
    let data = {
      PrecioTotal: facturas[i].PrecioTotal, 
      Cliente: facturas[i].Cliente, 
      Fecha: facturas[i].date, 
      Numero: facturas[i].Factura, 
      Tipo: "Factura", 
      EstadoGeneral: facturas[i].EstadoGeneral,
      _id: facturas[i]._id,
      Monto: facturas[i].PrecioTotal, 
      Timestamp: facturas[i].Timestamp, 
    }
    Documentos.push(data)
  }
  for(i=0; i< devoluciones.length; i++){
    if(!devoluciones[i].Recibo){
      console.log(devoluciones[i].Recibo)
    }
    let PrecioTotal = 0
    for(r=0; r < devoluciones[i].Productos.length; r++){
      PrecioTotal += devoluciones[i].Productos[r].Precio
    }
    let data = {
      PrecioTotal: PrecioTotal, 
      Cliente: devoluciones[i].Cliente, 
      Fecha: devoluciones[i].Fecha, 
      Numero: devoluciones[i].Recibo, 
      Tipo: "Devolución", 
      EstadoGeneral: devoluciones[i].EstadoGeneral,
      _id: devoluciones[i]._id,
      Monto: PrecioTotal, 
      Timestamp: devoluciones[i].Timestamp, 
    }
    Documentos.push(data)
  }
  for(i=0; i< devolucionesMonto.length; i++){
    if(!devolucionesMonto[i].Recibo){
      console.log(devolucionesMonto[i].Recibo)
    }
    let PrecioTotal = 0
    for(r=0; r < devolucionesMonto[i].Productos.length; r++){
      PrecioTotal += devolucionesMonto[i].Productos[r].Precio
    }
    let data = {
      PrecioTotal: PrecioTotal, 
      Cliente: devolucionesMonto[i].Cliente, 
      Fecha: devolucionesMonto[i].Fecha, 
      Tipo: "Devolución por monto", 
      Numero: devolucionesMonto[i].Recibo, 
      EstadoGeneral: devolucionesMonto[i].EstadoGeneral,
      Monto: PrecioTotal, 
      _id: devolucionesMonto[i]._id,
      Timestamp: devolucionesMonto[i].Timestamp, 
    }
    Documentos.push(data)
  }
  Documentos.sort(function (a, b) {
    if (a.Timestamp > b.Timestamp) {
      return 1;
    }
    if (a.Timestamp < b.Timestamp) {
      return -1;
    }
    return 0;
  });

  for(i=0; i< Documentos.length; i++){
    let NumeroMes = Documentos[i].Fecha.substr(5,2)
    let Anio = Documentos[i].Fecha.substr(0,4)
    let Mes
    if(NumeroMes == "01"){Mes = "ENERO"}
    if(NumeroMes == "02"){Mes = "FEBRERO"}
    if(NumeroMes == "03"){Mes = "MARZO"}
    if(NumeroMes == "04"){Mes = "ABRIL"}
    if(NumeroMes == "05"){Mes = "MAYO"}
    if(NumeroMes == "06"){Mes = "JUNIO"}
    if(NumeroMes == "07"){Mes = "JULIO"}
    if(NumeroMes == "08"){Mes = "AGOSTO"}
    if(NumeroMes == "09"){Mes = "SEPTIEMBRE"}
    if(NumeroMes == "10"){Mes = "OCTUBRE"}
    if(NumeroMes == "11"){Mes = "NOVIEMBRE"}
    if(NumeroMes == "12"){Mes = "DICIEMBRE"}
    if(Documentos[i].Tipo == "Factura"){
      if(Documentos[i].EstadoGeneral != "Anulada"){
        let libroContable = await libroContableDB.findOne({$and : [{Mes: Mes}, {Anio: Anio}]})
        if(libroContable){
          let TotalIngreso = +libroContable.TotalIngreso + +Documentos[i].Monto
          let TotalGeneral = +libroContable.TotalGeneral + +Documentos[i].Monto
          let saldo = libroContable.dia[+libroContable.dia.length - 1].Saldo + +Documentos[i].Monto
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Numero: Documentos[i].Numero,
            Cliente: Documentos[i].Cliente,
            Tipo: Documentos[i].Tipo,
            Ingreso: Documentos[i].Monto,
            Egreso: 0,  
            Saldo: saldo,
           }
          await libroContableDB.findByIdAndUpdate(libroContable._id,{
            TotalIngreso : TotalIngreso,
            TotalGeneral : TotalGeneral,
            $push : {dia: dia}
          })
        }else{
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Cliente: Documentos[i].Cliente,
            Numero: Documentos[i].Numero,
            Tipo: Documentos[i].Tipo,
            Ingreso: Documentos[i].Monto,
            Egreso: 0,  
            Saldo: Documentos[i].Monto,
          }
          let nuevoLibro = new libroContableDB({
            Anio: Anio,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalIngreso: Documentos[i].Monto,
            TotalEgreso: 0,
            TotalGeneral: Documentos[i].Monto,
            dia: dia
          })
          await nuevoLibro.save()
        }
        await facturaDB.findByIdAndUpdate(Documentos[i]._id,{
          EstadoLibro : "Inlcuido"
        })
      }else{
        let libroContable = await libroContableDB.findOne({$and : [{Mes: Mes}, {Anio: Anio}]})
        if(libroContable){
          let TotalEgreso = +libroContable.TotalEgreso + +Documentos[i].Monto
          let TotalGeneral = +libroContable.TotalGeneral - +Documentos[i].Monto
          let saldo = libroContable.dia[+libroContable.dia.length - 1].Saldo - +Documentos[i].Monto
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Numero: Documentos[i].Numero,
            Cliente: Documentos[i].Cliente,
            Tipo: "Anulación de factura",
            Ingreso: 0,
            Egreso: Documentos[i].Monto,  
            Saldo: saldo,
           }
          await libroContableDB.findByIdAndUpdate(libroContable._id,{
            TotalEgreso : TotalEgreso,
            TotalGeneral : TotalGeneral,
            $push : {dia: dia}
          })
        }else{
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Cliente: Documentos[i].Cliente,
            Numero: Documentos[i].Numero,
            Tipo: Documentos[i].Tipo,
            Ingreso: 0,
            Egreso: Documentos[i].Monto,  
            Saldo: -Documentos[i].Monto,
          }
          let nuevoLibro = new libroContableDB({
            Anio: Anio,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalIngreso: 0,
            TotalEgreso: Documentos[i].Monto,
            TotalGeneral: -Documentos[i].Monto,
            dia: dia
          })
          await nuevoLibro.save()
        }
        await facturaDB.findByIdAndUpdate(Documentos[i]._id,{
          EstadoLibro : "Inlcuido"
        })
      }
    }else{
      if(Documentos[i].EstadoGeneral != "Anulada"){
        //resta
        let libroContable = await libroContableDB.findOne({$and : [{Mes: Mes}, {Anio: Anio}]})
        if(libroContable){
          let TotalEgreso = +libroContable.TotalEgreso + +Documentos[i].Monto
          let TotalGeneral = +libroContable.TotalGeneral - +Documentos[i].Monto
          let saldo = libroContable.dia[+libroContable.dia.length - 1].Saldo - +Documentos[i].Monto
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Cliente: Documentos[i].Cliente,
            Numero: Documentos[i].Numero,
            Tipo: "Devolución",
            Ingreso: 0,
            Egreso: Documentos[i].Monto,  
            Saldo: saldo,
           }
          await libroContableDB.findByIdAndUpdate(libroContable._id,{
            TotalEgreso : TotalEgreso,
            TotalGeneral : TotalGeneral,
            $push : {dia: dia}
          })
        }else{
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Cliente: Documentos[i].Cliente,
            Numero: Documentos[i].Numero,
            Tipo: Documentos[i].Tipo,
            Ingreso: 0,
            Egreso: Documentos[i].Monto,  
            Saldo: -Documentos[i].Monto,
          }
          let nuevoLibro = new libroContableDB({
            Anio: Anio,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalIngreso: 0,
            TotalEgreso: Documentos[i].Monto,
            TotalGeneral: -Documentos[i].Monto,
            dia: dia
          })
          await nuevoLibro.save()
        }
        await facturaDB.findByIdAndUpdate(Documentos[i]._id,{
          EstadoLibro : "Inlcuido"
        })

      }else{
        //Suma
        let libroContable = await libroContableDB.findOne({$and : [{Mes: Mes}, {Anio: Anio}]})
        if(libroContable){
          let TotalIngreso = +libroContable.TotalIngreso + +Documentos[i].Monto
          let TotalGeneral = +libroContable.TotalGeneral + +Documentos[i].Monto
          let saldo = libroContable.dia[+libroContable.dia.length - 1].Saldo + +Documentos[i].Monto
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Numero: Documentos[i].Numero,
            Cliente: Documentos[i].Cliente,
            Tipo: "Anulación de devolución",
            Ingreso: Documentos[i].Monto,
            Egreso: 0,  
            Saldo: saldo,
           }
          await libroContableDB.findByIdAndUpdate(libroContable._id,{
            TotalIngreso : TotalIngreso,
            TotalGeneral : TotalGeneral,
            $push : {dia: dia}
          })
        }else{
          let dia = { 
            Timestamp: Documentos[i].Timestamp,
            Fecha: Documentos[i].Fecha,
            Cliente: Documentos[i].Cliente,
            Numero: Documentos[i].Numero,
            Tipo: Documentos[i].Tipo,
            Ingreso: Documentos[i].Monto,
            Egreso: 0,  
            Saldo: Documentos[i].Monto,
          }
          let nuevoLibro = new libroContableDB({
            Anio: Anio,
            Mes: Mes,
            NumeroMes: NumeroMes,
            TotalIngreso: Documentos[i].Monto,
            TotalEgreso: 0,
            TotalGeneral: Documentos[i].Monto,
            dia: dia
          })
          await nuevoLibro.save()
        }
      }
      if(Documentos[i].Tipo == "Devolución"){
        await recibosDevolucioDB.findByIdAndUpdate(Documentos[i]._id,{
          EstadoLibro : "Inlcuido"
        })
      }else{
        await reciboPorMontoDB.findByIdAndUpdate(Documentos[i]._id,{
          EstadoLibro : "Inlcuido"
        })
      }
    }
  }
  let libros = await libroContableDB.find().sort({Anio: -1, NumeroMes: -1})
  libros = libros.map((data) => {
    return{
      Anio: data.Anio,
      Mes: data.Mes,
      _id: data._id,
      NumeroMes: data.NumeroMes,
      TotalIngreso: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.TotalIngreso.toFixed(2)),
      TotalEgreso: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.TotalEgreso.toFixed(2)),
      TotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.TotalGeneral.toFixed(2)),
      dia: data.dia.map((data2) => {
        return{
          Timestamp: data2.Timestamp,
          Fecha: data2.Fecha,
          Numero: data2.Numero,
          Cliente: data2.Cliente,
          Tipo: data2.Tipo,
          Ingreso: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Ingreso.toFixed(2)),
          Egreso: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Egreso.toFixed(2)),
          Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Saldo.toFixed(2)),
        }
      }),
    }
  })
  res.render('facturacion/facturacion/libro-contable',{
    libros
  })
})

router.post('/generar-libro-contable', isAuthenticatedFacturacion, async (req, res) => {
  let {Formato} = req.body
  let facturas = await facturaDB.find()
  facturas = facturas.map((data) => {
    return{
      Recibo: data.Factura,
      Tipo: "Factura",
      Timestamp: data.Timestamp,
      Cliente: data.Cliente,
      DocumentoTipo: data.DocumentoTipo,
      Documento: data.Documento,
      Direccion: data.Direccion,
      OrdenNumero: data.OrdenNumero,
      CantidadTotal: data.CantidadTotal,
      Precio: data.PrecioTotal,
      PrecioTotal2: data.PrecioTotal2,
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
      PendienteAPagar: data.PendienteAPagar,
      PendienteAPagarComision: data.PendienteAPagarComision,
      GananciasVendedor: data.GananciasVendedor,
      FechaPagoComision: data.FechaPagoComision,
      EstadoComision: data.EstadoComision,
      TipoPrecio: data.TipoPrecio,
      Estado: data.Estado,
      User: data.User,
      Nota: data.Nota,
      Chofer: data.Chofer,
      EmpresaTransporte: data.EmpresaTransporte,
      Nota: data.Nota,
      _id: data._id
    }
  })
  let devoluciones = await recibosDevolucioDB.find().sort({"Recibo": -1})
  let devolucionesPorMonto = await reciboPorMontoDB.find().sort({"Recibo": -1}) 
  devoluciones = devoluciones.map((data) => {
    return{
      Tipo: "Devolución",
      date: data.Fecha,
      Timestamp: data.Timestamp,
      Recibo: data.Recibo,
      NotaEntrega: data.NotaEntrega,
      Cliente: data.Cliente,
      Documento: data.Documento,
      Direccion: data.Direccion,
      Celular: data.Celular,
      class:"text-danger",
      link:`/ver-devolucion/${data.Recibo}`,
      Productos: data.Productos.map((data2) => {
        return{
          Codigo: data2.Codigo,
          Cantidad: data2.Cantidad,
          Precio: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Precio),
        }
      }),     
      Titulo: data.Titulo,
      PrecioActualNota: data.PrecioActualNota,
      _id: data._id,
    }
  })
  devolucionesPorMonto = devolucionesPorMonto.map((data) => {
    return{
      date: data.Fecha,
      Tipo: "Devolución",
      Timestamp: data.Timestamp,
      Recibo: data.Recibo,
      NotaEntrega: data.NotaEntrega,
      Cliente: data.Cliente,
      Documento: data.Documento,
      Direccion: data.Direccion,
      Celular: data.Celular,
      Titulo: data.Titulo,
      CantidadTotal: 0,
      class:"text-danger",
      Comentario: data.Comentario,
      PrecioActualNota: data.PrecioActualNota,
      link:`/ver-devolucion-por-cobro/${data.Recibo}`,
      Productos: data.Productos.map((data2) => {
        return{
          NotaEntrega: data2.NotaEntrega,
          Precio: data2.Precio,
        }
      })
    }
  })
  let Devoluciones = []

  for(i=0; i<devolucionesPorMonto.length; i++){
    devolucionesPorMonto[i].Precio = devolucionesPorMonto[i].Productos[0].Precio
    devolucionesPorMonto[i].Precio2 = devolucionesPorMonto[i].Productos[0].Precio
    devolucionesPorMonto[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devolucionesPorMonto[i].Precio)
    Devoluciones.push(devolucionesPorMonto[i])
  }
  
  for(i= 0; i< devoluciones.length; i++){
    let precioGeneralDevolucion = 0
    let cantidadGeneralDevolucion = 0
    for(r=0; r< devoluciones[i].Productos.length; r++ ){
      cantidadGeneralDevolucion += +devoluciones[i].Productos[r].Cantidad 
      let precio = devoluciones[i].Productos[r].Precio.replace("$","")
      precio = precio.replace(",","")
      precio = precio.replace(",","")
      precioGeneralDevolucion += +precio
    }

    devoluciones[i].CantidadTotal = cantidadGeneralDevolucion
    devoluciones[i].Precio2 = precioGeneralDevolucion.toFixed(2)
    devoluciones[i].Precio = precioGeneralDevolucion.toFixed(2)
    devoluciones[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(devoluciones[i].Precio)
    Devoluciones.push(devoluciones[i])
    
  }
  Devoluciones.sort(function (a, b) {
    if (a.Recibo > b.Recibo) {
      return -1;
    }
    if (a.Recibo < b.Recibo) {
      return 1;
    }
    return 0;
  });
  let CantidadTotal = 0
  let PrecioTotal = 0
  let lineasGeneral = []
  for(i=0; i< facturas.length; i++){
    PrecioTotal += +facturas[i].Precio
    CantidadTotal += +facturas[i].CantidadTotal
    facturas[i].class= "text-dark"
    lineasGeneral.push(facturas[i])
    facturas[i].Precio = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(facturas[i].Precio)
  }
  
  for(i=0; i< Devoluciones.length; i++){
    CantidadTotal = +CantidadTotal - +Devoluciones[i].CantidadTotal
    PrecioTotal = +PrecioTotal - +Devoluciones[i].Precio2
    lineasGeneral.push(Devoluciones[i])
  } 
  PrecioTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(PrecioTotal.toFixed(2))
  lineasGeneral.sort(function (a, b) {
    if (a.Timestamp > b.Timestamp) {
      return -1;
    }
    if (a.Timestamp < b.Timestamp) {
      return 1;
    }
    return 0;
  });
  if(Formato == "PDF"){
    res.render('facturacion/reporte_pdf/libro-contable',{
      lineasGeneral,
      PrecioTotal,
      CantidadTotal

    })
  }else{
    const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Libro contable");

    const style = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#FFFF00",
        fgColor: "#FFFF00",
      },
    });

    ws.cell(1, 1).string("Fecha").style(style);
    ws.cell(1, 2).string("Tipo").style(style);
    ws.cell(1, 3).string("Factura/Recibo").style(style);
    ws.cell(1, 4).string("Cantidad total").style(style);
    ws.cell(1, 5).string("Precio").style(style);
    let fila = 2;
    for (i = 0; i < lineasGeneral.length; i++) {
      let columna = 1
      ws.cell(fila, columna++).string(lineasGeneral[i].date);
      ws.cell(fila, columna++).string(lineasGeneral[i].Tipo);
      ws.cell(fila, columna++).number(lineasGeneral[i].Recibo);
      ws.cell(fila, columna++).number(+lineasGeneral[i].CantidadTotal);
      ws.cell(fila, columna++).string(lineasGeneral[i].Precio);

      fila++;
    }
    ws.cell(fila, 3).string("Totales")
    ws.cell(fila, 4).number(CantidadTotal)
    ws.cell(fila, 5).string(PrecioTotal)

    wb.write("Libro contable.xlsx", res);
  }

})

router.get('/ver-ficha-producto/:id', isAuthenticatedInventario, async (req, res) => {
  let stock = await stockDB.findByIdAndUpdate(req.params.id)
    let PorcentajeCosto;
    let PorcentajeCostoGranMayor;
    let PorcentajeCostoMayor;
    let PorcentajeCostoDetal;

    PorcentajeCosto = ((stock.Costo * 100) / stock.CostoFOB - 100 ).toFixed(2);
    PorcentajeCostoGranMayor = ((stock.CostoGranMayor * 100) / stock.Costo -  100).toFixed(2);
    PorcentajeCostoMayor = (  (stock.CostoMayor * 100) / stock.Costo -  100).toFixed(2);
    PorcentajeCostoDetal = (  (stock.CostoDetal * 100) / stock.Costo -  100).toFixed(2);

  stock = {
    date: stock.date,
    Timestamp: stock.Timestamp,
    FechaUltimoIngreso: stock.FechaUltimoIngreso,
    TipoProducto: stock.TipoProducto,
    Alto: stock.Alto,
    Largo: stock.Largo,
    Vehiculo : stock.Vehiculo.map((data2) => {
      return{
        TipoVehiculo: data2.TipoVehiculo,
        Marca: data2.Marca,
        Modelo: data2.Modelo,
        Desde: data2.Desde,
        Hasta: data2.Hasta,
      }
    }),
    Ancho: stock.Ancho,
    Peso: stock.Peso,
    Unidades: stock.Unidades,
    Nombre: stock.Nombre,
    Proveedor: stock.Proveedor,
    CodigoT: stock.CodigoT,
    CodigoG: stock.CodigoG,
    CantidadTotal: stock.CantidadTotal,
    CantidadVendida: stock.CantidadVendida,
    CantidadTransito: stock.CantidadTransito,
    CantidadProduccion: stock.CantidadProduccion,
    CostoFOB: stock.CostoFOB,
    CostoTotalStock: stock.CostoTotalStock,
    Costo: stock.Costo,
    CostoFOBTotal: stock.CostoFOBTotal,
    CostoTotal: stock.CostoTotal,
    CostoGranMayorTotal: stock.CostoGranMayorTotal,
    CostoMayorTotal: stock.CostoMayorTotal,
    CostoDetalTotal: stock.CostoDetalTotal,
    CostoGranMayor: stock.CostoGranMayor,
    CostoMayor: stock.CostoMayor,
    CostoDetal: stock.CostoDetal,
    User: stock.User,
    TipoVehiculo: stock.TipoVehiculo,
    Modelo: stock.Modelo,
    Familia: stock.Familia,
    Posicion: stock.Posicion,
    Año: stock.Año,
    HistorialMovimiento: stock.HistorialMovimiento,
  }

  res.render('facturacion/inventario/ficha-stock',{
    stock,
    PorcentajeCosto,
    PorcentajeCostoGranMayor,
    PorcentajeCostoMayor,
    PorcentajeCostoDetal,
  })

})


//ruta para solicitar ordenes


router.post('/solicitar-info-por-ordenes', isAuthenticatedCobranza, async (req, res) => {
  let {Estado} = req.body
  let Ordenes = await ordenesClientesDB.find({Estado:Estado})
  let CantidadTotal = 0
  let PrecioTotal = 0
  
  for(i=0; i< Ordenes.length; i++){
    CantidadTotal += Ordenes[i].CantidadTotal
    PrecioTotal += Ordenes[i].PrecioTotal
    let cliente = await clienteDB.findOne({ email: Ordenes[i].email });
    Ordenes[i].email = cliente.Empresa;
  }
  PrecioTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(PrecioTotal.toFixed(2))

  let data = {
    Ordenes,
    CantidadTotal,
    PrecioTotal
  }
  res.send(JSON.stringify(data))

})

router.get('/cancelar-orden/:id', isAuthenticatedCobranza, async (req, res) => {
  let _id = req.params.id
  let orden = await ordenesClientesDB.findById(_id)
  if(orden.Estado == "En proceso" || orden.Estado == "Procesado"){
    await ordenesClientesDB.findByIdAndUpdate(orden._id,{
      Estado: "Cancelado"
    })
    req.flash("success","La orden fue cancelada correctamente")
    res.redirect("/facturacion/ordenes-compra")
  }else{
    req.flash("error",`La orden no puede ser cancelada ya que se encuentra en estado "${orden.Estado}""`)
    res.redirect("/facturacion/ordenes-compra")
  }
})



router.get('/descargar-pdf-ventas', isAuthenticatedFacturacion, async (req, res) => {
  let facturas = await facturaDB.find().sort({ Factura: -1 });
  let PendienteAPagarGeneral = 0;
  let PrecioTotalGeneral = 0;
  let CantidadTotalGeneral = 0
  for (i = 0; i < facturas.length; i++) {
    PendienteAPagarGeneral = (
      +PendienteAPagarGeneral + +facturas[i].PendienteAPagar
    ).toFixed(2);
    PrecioTotalGeneral = (
      +PrecioTotalGeneral + +facturas[i].PrecioTotal
    ).toFixed(2);
    CantidadTotalGeneral += + facturas[i].CantidadTotal
  }
  PendienteAPagarGeneral = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(PendienteAPagarGeneral);
  PrecioTotalGeneral = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(PrecioTotalGeneral);

  facturas = facturas.map((data) => {
    return {
      Factura: data.Factura,
      Timestamp: data.Timestamp,
      Cliente: data.Cliente,
      DocumentoTipo: data.DocumentoTipo,
      Documento: data.Documento,
      Direccion: data.Direccion,
      Productos: data.Productos,
      CantidadTotal: data.CantidadTotal,
      PrecioTotal: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.PrecioTotal),
      date: data.date,
      Vencimiento: data.Vencimiento,
      Celular: data.Celular,
      Vendedor: data.Vendedor,
      Codigo: data.Codigo,
      DocumentoVendedor: data.DocumentoVendedor,
      Zona: data.Zona,
      Porcentaje: data.Porcentaje,
      FechaModificacion: data.FechaModificacion,
      UltimoPago: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.UltimoPago),
      PendienteAPagar: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.PendienteAPagar),
      GananciasVendedor: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.GananciasVendedor),
      Estado: data.Estado,
      User: data.User,
      _id: data._id,
      Nota: data.Nota,
    };
  });

  res.render("facturacion/reporte_pdf/reporte-de-ventas", {
    facturas,
    PendienteAPagarGeneral,
    PrecioTotalGeneral,
    CantidadTotalGeneral
  });
})


router.get('/cuentas-por-pagar-personal', isAuthenticatedAdministracion, async (req, res) => {
  let Cuentas = await CuentasPagarPersonalDB.find().sort({ Timestamp: -1 });

  Cuentas = Cuentas.map((data) => {
    return {
      FechaEstimada: data.FechaEstimada,
      Comentario: data.Comentario,
      Timestamp: data.Timestamp,
      UltimoPago: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.UltimoPago),
      PendienteAPagar: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.PendienteAPagar),
      Total: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.Total),
      Estado: data.Estado,
      _id: data._id,
    };
  });

  Cuentas.sort(function (a, b) {
    if (a.FechaEstimada > b.FechaEstimada) {
      return 1;
    }
    if (a.FechaEstimada < b.FechaEstimada) {
      return -1;
    }
    return 0;
  });

  res.render("facturacion/cuentas-por-pagar-personal", {
    Cuentas,
  });
})

router.get('/actualizar-catalogo', async (req, res)=>{
  let catalogo = await catalogoDB.find()

  for(i=0; i< catalogo.length; i++){
    await catalogoDB.findByIdAndUpdate(catalogo[i]._id,{
      NombreImagen: "thomsonimg"
    })
  }
  res.send("ok")
})


router.get('/actualizar-datos', async (req, res) => {
  let facturas = await facturaDB.find()
  let valorGranMayor = 0
  let valorMayor = 0
  let valorDetal = 0
  for(i=0; i< facturas.length; i++){
    if(facturas[i].TipoPrecio == "GRANMAYOR"){
      valorGranMayor += +facturas[i].PrecioTotal2
    }
    if(facturas[i].TipoPrecio == "MAYOR"){
      valorMayor += facturas[i].PrecioTotal2
    }
    if(facturas[i].TipoPrecio == "DETAL"){
      valorDetal += facturas[i].PrecioTotal2
    }
  }

  let facturasGM = await valorFacturasGranMayorDB.find()
  let facturasM = await valorFacturasMayorDB.find()
  let facturasD = await valorFacturasDetalDB.find()
  await valorFacturasGranMayorDB.findByIdAndUpdate(facturasGM[0]._id,{
    valor : valorGranMayor.toFixed(2)
  })
  await valorFacturasMayorDB.findByIdAndUpdate(facturasM[0]._id,{
    valor : valorMayor.toFixed(2)
  })
  await valorFacturasDetalDB.findByIdAndUpdate(facturasD[0]._id,{
    valor : valorDetal.toFixed(2)
  })
  
  res.send("ok")

})

router.post('/registrar-pago-comisiones', async (req, res) => {
  let {Vendedor, Facturas, Total, Comentario} = req.body
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
  Vendedor = await vendedorDB.findOne({Username:Vendedor})
  
  for(i=0; i< Facturas.length; i++){
    let factura = await facturaDB.findOne({Factura: Facturas[i].Factura})
    Facturas[i].Cliente = factura.Cliente
    await facturaDB.findByIdAndUpdate(factura._id,{
      EstadoComision: "Cancelado"
    })
  }
  let recibosComisiones = await recibosComisionesDB.find().sort({"Timestamp":-1})
  let Recibo = 0
  if(recibosComisiones.length == 0){
    Recibo = 1000000001	
  }else{
    Recibo = +recibosComisiones[0].Recibo + 1
  }

  let nuevoReciboComision = new recibosComisionesDB({
    Fecha: date, 
    Timestamp: Timestamp, 
    Recibo: Recibo, 
    Vendedor: Vendedor.Username, 
    Documento: Vendedor.Cedula,
    Nombres: Vendedor.Nombres, 
    Apellidos: Vendedor.Apellidos, 
    Direccion: Vendedor.Direccion, 
    Celular: Vendedor.Celular, 
    Total: Total, 
    Comentario: Comentario,
    Facturas: Facturas
  })
  await nuevoReciboComision.save()

  res.send(JSON.stringify(Recibo))


})

router.post('/solicitar-info-facturas', isAuthenticatedFacturacion, async (req, res) =>{
  
  let {Cliente, Desde, Hasta} = req.body
  if(!Desde){
    if(Cliente == 0){

      let facturas = await facturaDB.find().sort({"Factura":-1})
      facturas = facturas.map((data) => {
        return{
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Direccion: data.Direccion,
          OrdenNumero: data.OrdenNumero,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal3: data.PrecioTotal,
          PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
          PrecioTotal2: data.PrecioTotal2,
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
          PendienteAPagar2: data.PendienteAPagar,
          PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
          PendienteAPagarComision: data.PendienteAPagarComision,
          GananciasVendedor: data.GananciasVendedor,
          FechaPagoComision: data.FechaPagoComision,
          EstadoComision: data.EstadoComision,
          TipoPrecio: data.TipoPrecio,
          Estado: data.Estado,
          User: data.User,
          Nota: data.Nota,
          Chofer: data.Chofer,
          EmpresaTransporte: data.EmpresaTransporte,
          Nota: data.Nota,
          HistorialPago: data.HistorialPago,
          _id : data._id
        }
      })
      res.send(JSON.stringify(facturas))
    }else{
      let facturas = await facturaDB.find({Cliente: Cliente}).sort({"Factura":-1})
      facturas = facturas.map((data) => {
        return{
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Direccion: data.Direccion,
          OrdenNumero: data.OrdenNumero,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal3: data.PrecioTotal,
          PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
          PrecioTotal2: data.PrecioTotal2,
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
          PendienteAPagar2: data.PendienteAPagar,
          PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
          PendienteAPagarComision: data.PendienteAPagarComision,
          GananciasVendedor: data.GananciasVendedor,
          FechaPagoComision: data.FechaPagoComision,
          EstadoComision: data.EstadoComision,
          TipoPrecio: data.TipoPrecio,
          Estado: data.Estado,
          User: data.User,
          Nota: data.Nota,
          Chofer: data.Chofer,
          EmpresaTransporte: data.EmpresaTransporte,
          Nota: data.Nota,
          HistorialPago: data.HistorialPago,
          _id : data._id

        }
      })
      res.send(JSON.stringify(facturas))
    }
  }else{
    let fechaDesde = new Date(Desde).getTime();
    let fechaHasta = new Date(Hasta).getTime();
    if(Cliente !=0){
      let facturas = await facturaDB.find({$and: [{Cliente:Cliente},  { Timestamp: { $gte: fechaDesde } },  { Timestamp: { $lte: fechaHasta } }]})
      .sort({ "Factura": -1 });

      facturas = facturas.map((data) => {
        return{
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Direccion: data.Direccion,
          OrdenNumero: data.OrdenNumero,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal3: data.PrecioTotal,
          PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
          PrecioTotal2: data.PrecioTotal2,
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
          PendienteAPagar2: data.PendienteAPagar,
          PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
          PendienteAPagarComision: data.PendienteAPagarComision,
          GananciasVendedor: data.GananciasVendedor,
          FechaPagoComision: data.FechaPagoComision,
          EstadoComision: data.EstadoComision,
          TipoPrecio: data.TipoPrecio,
          Estado: data.Estado,
          User: data.User,
          Nota: data.Nota,
          Chofer: data.Chofer,
          EmpresaTransporte: data.EmpresaTransporte,
          Nota: data.Nota,
          HistorialPago: data.HistorialPago,
          _id : data._id

        }
      })
      res.send(JSON.stringify(facturas))
      
    }else{
      let facturas = await facturaDB.find({$and: [{ Timestamp: { $gte: fechaDesde } },  { Timestamp: { $lte: fechaHasta } }]})
      .sort({ "Factura": -1 });

      facturas = facturas.map((data) => {
        return{
          Factura: data.Factura,
          Timestamp: data.Timestamp,
          Cliente: data.Cliente,
          DocumentoTipo: data.DocumentoTipo,
          Documento: data.Documento,
          Direccion: data.Direccion,
          OrdenNumero: data.OrdenNumero,
          Productos: data.Productos,
          CantidadTotal: data.CantidadTotal,
          PrecioTotal3: data.PrecioTotal,
          PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
          PrecioTotal2: data.PrecioTotal2,
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
          PendienteAPagar2: data.PendienteAPagar,
          PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
          PendienteAPagarComision: data.PendienteAPagarComision,
          GananciasVendedor: data.GananciasVendedor,
          FechaPagoComision: data.FechaPagoComision,
          EstadoComision: data.EstadoComision,
          TipoPrecio: data.TipoPrecio,
          Estado: data.Estado,
          User: data.User,
          Nota: data.Nota,
          Chofer: data.Chofer,
          EmpresaTransporte: data.EmpresaTransporte,
          Nota: data.Nota,
          HistorialPago: data.HistorialPago,
          _id : data._id

        }
      })
      res.send(JSON.stringify(facturas))
    }
  }
})

router.get('/arreglar-orden-proveedor', isAuthenticatedAgenda,async (req, res) => {
  let orden = await ordenComprasProveedorDB.findOne({OrdenNumero: 20210003})
  for(i=0; i< orden.Productos.length; i++){
    let stock = await stockDB.findOne({CodigoT: orden.Productos[i].CodigoT})
    orden.Productos[i].Alto = stock.Alto
    orden.Productos[i].Ancho = stock.Ancho
    orden.Productos[i].Largo = stock.Largo
    orden.Productos[i].Peso = (+stock.Peso * orden.Productos[i].Cantidad).toFixed(2)
  }
  await ordenComprasProveedorDB.findByIdAndUpdate(orden._id,{
    Productos: orden.Productos
  })
  res.send("ok")

})

router.get('/ver-imagenes-cargadas', isAuthenticatedAgenda, async (req, res) => {
  let catalogo = await catalogoDB.find({NombreImagen : {$ne: "thomsonimg"}}).sort({"Timestamp": -1})
  catalogo = catalogo.map((data) => {
    return{
      CodigoT: data.CodigoT,
      NombreImagen: data.NombreImagen,
      Verificado: data.Verificado,
      _id: data._id,
    }
  })
  let contadorImagenes = 0
  for(i=0; i< catalogo.length; i++){
    contadorImagenes += +i
  }
  res.render('facturacion/ver-imagenes-cargadas',{
    catalogo,
    contadorImagenes
  })
})

router.get('/verificar-imagen/:id', isAuthenticatedMaster ,async (req, res) => {
  await catalogoDB.findByIdAndUpdate(req.params.id,{
    Verificado: "Si"
  })
  req.flash("success", "Imagen verificada correctamente")
  res.redirect("/ver-imagenes-cargadas")
})


router.get('/eliminar-imagen/:id', isAuthenticatedMaster ,async (req, res) => {
  await catalogoDB.findByIdAndUpdate(req.params.id,{
    NombreImagen: "thomsonimg"
  })
  req.flash("success", "Imagen eliminada correctamente")
  res.redirect("/ver-imagenes-cargadas")
})


router.get('/generar-reporte-pdf-proveedores', async (req, res) => {
  let proveedores = await proveedorDB.find().sort({"Nombre": 1})
  proveedores = proveedores.map((data) => {
    return{
      date: data.date,
      FechaModificacion: data.FechaModificacion,
      Nombre: data.Nombre,
      Pais: data.Pais,
      Direccion: data.Direccion,
      Estado: data.Estado,
      Postal: data.Postal,
      Codigo: data.Codigo,
      Costo: data.Costo,
      GranMayor: data.GranMayor,
      Mayor: data.Mayor,
      Detal: data.Detal,
      date2: data.date2,
      email: data.email,
      Telefono: data.Telefono,
      PaginaWeb: data.PaginaWeb,
      Nota: data.Nota,
    }
  })
  res.render('facturacion/reporte_pdf/reporte-de-proveedores',{
    proveedores
  })
  
})


router.post('/reporte-pdf-cuentas-por-cobrar-thomson', async (req, res) => {
  let {Desde, Hasta} = req.body
  let cuentas = await CuentasPagarDB.find({$and : [{FechaEstimada : {$gte: Desde}}, {FechaEstimada:{$lte: Hasta}}]}).sort({"Timestamp":-1})
  let total = 0
  for(i=0; i< cuentas.length; i++){
     total += cuentas[i].Total
  }
  total = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(total.toFixed(2))
  cuentas = cuentas.map((data) => {
    return{
      FechaEstimada: data.FechaEstimada,
      Estado: data.Estado,
      Comentario: data.Comentario,
      Timestamp: data.Timestamp,
      Total: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Total),
      UltimoPago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.UltimoPago),
      PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
    }
  })
  let titulo= "Reporte cuentas por pagar - Thomson"

  res.render('facturacion/reporte_pdf/reporte-cuentas-por-pagar',{
    titulo,
    total,
    cuentas
  })

})


router.post('/reporte-pdf-cuentas-por-cobrar-personal', async (req, res) => {
  let {Desde, Hasta} = req.body
  let cuentas = await CuentasPagarPersonalDB.find({$and : [{FechaEstimada : {$gte: Desde}}, {FechaEstimada:{$lte: Hasta}}]}).sort({"Timestamp":-1})
  let total = 0
  for(i=0; i< cuentas.length; i++){
     total += cuentas[i].Total
  }
  total = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(total.toFixed(2))
  cuentas = cuentas.map((data) => {
    return{
      FechaEstimada: data.FechaEstimada,
      Estado: data.Estado,
      Comentario: data.Comentario,
      Timestamp: data.Timestamp,
      Total: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Total),
      UltimoPago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.UltimoPago),
      PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PendienteAPagar),
    }
  })
  let titulo= "Reporte cuentas por pagar - Raffaele"

  res.render('facturacion/reporte_pdf/reporte-cuentas-por-pagar',{
    titulo,
    total,
    cuentas
  })

})

router.get('/actualizar-costo-producto', async (req, res) =>{
  let productos = await stockDB.find({Proveedor:"ZHEJIANG GOLD INTELLIGENT SUSPENSION CORP"})
  for(i=0; i< productos.lenght; i++){
    const Costo = (productos[i].CostoFob / (1 - 30 / 100)).toFixed(2);
    await stockDB.findByIdAndUpdate(productos[i]._id,{
      Costo:Costo
    })
  }
  res.send("Costos actualizados correctamente")
})


router.get('/actualizar-cantidad-transito-produccion', async (req, res) => {
  let ordenesProveedor = await ordenComprasProveedorDB.find()
  for(i=0; i< ordenesProveedor.length; i++){
    if(ordenesProveedor[i].Estado == "Produccion"){
      for(x=0; x < ordenesProveedor[i].Productos.length; x++){
        let producto = await stockDB.findOne({CodigoT: ordenesProveedor[i].Productos[x].CodigoT})
        let CantidadProduccion = +producto.CantidadProduccion + +ordenesProveedor[i].Productos[x].Cantidad
        await stockDB.findByIdAndUpdate(producto._id,{
          CantidadProduccion:CantidadProduccion
        })

      }

    }if(ordenesProveedor[i].Estado == "Transito"){
      for(x=0; x < ordenesProveedor[i].Productos.length; x++){
        let producto = await stockDB.findOne({CodigoT: ordenesProveedor[i].Productos[x].CodigoT})
        let CantidadTransito = +producto.CantidadTransito + +ordenesProveedor[i].Productos[x].Cantidad
        await stockDB.findByIdAndUpdate(producto._id,{
          CantidadTransito:CantidadTransito
        })
      }
    }
  }
  res.send("Cantidades actualizadas correctamente")
})


router.get('/actualizar-facturas-y-notas', async (req, res) => {
  let reciboDevolucion = await recibosDevolucioDB.find()
  let facturas = await facturaDB.find()
  let devolucionesMonto = await reciboPorMontoDB.find().sort()
  for(i=0; i< facturas.length; i++){
    await facturaDB.findByIdAndUpdate(facturas[i]._id,{
      EstadoLibro: "Sin incluir",
      EstadoGeneral: "Procesada"

    })
  } 
  for(i=0; i< reciboDevolucion.length; i++){
    await recibosDevolucioDB.findByIdAndUpdate(reciboDevolucion[i]._id,{
      EstadoLibro: "Sin incluir",
      EstadoGeneral: "Procesada"
    })
  }
  for(i=0; i< devolucionesMonto.length; i++){
    await reciboPorMontoDB.findById(devolucionesMonto._id,{
      EstadoLibro: "Sin incluir",
      EstadoGeneral: "Procesada"
    })
  }
  res.send("OK")
})




router.get('/descargar-libro-contable-pdf/:id', isAuthenticatedFacturacion, async (req, res) => {
  let libros = await libroContableDB.findById(req.params.id).sort({Anio: -1, NumeroMes: -1})
  libros = {
    Anio : libros.Anio,
    Mes : libros.Mes,
    NumeroMes : libros.NumeroMes,
    TotalIngreso : new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(libros.TotalIngreso),
    TotalEgreso : new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(libros.TotalEgreso),
    TotalGeneral : new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(libros.TotalGeneral),
    dia : libros.dia.map((data) => {
      return{
        Timestamp: data.Timestamp,
        Fecha: data.Fecha,
        Numero: data.Numero,
        Cliente: data.Cliente,
        Tipo: data.Tipo,
        Ingreso: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Ingreso),
        Egreso: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Egreso),
        Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
      }
    }),
  }
  res.render('facturacion/reporte_pdf/reporte_libro_pdf',{
    libros
  })
})


router.post('/solicitar-tipo-de-documento-anulacion', async (req, res) => {
  let {TipoDocumento} = req.body
  let documento = []
  if(TipoDocumento == "NotaEntrega"){
    documento = await facturaDB.find({Estado: "Por cobrar"}).sort({"Timestamp": -1})
    documento = documento.map((data) => {
      return{
        Recibo: data.Factura
      }
    })
  }
  if(TipoDocumento == "NotaDevolucion"){
    let devolucionesMonto = await reciboPorMontoDB.find({EstadoGeneral: {$ne: "Anulada"}}).sort({"Timestamp": -1})
    let devolucionesProductos = await recibosDevolucioDB.find({EstadoGeneral: {$ne: "Anulada"}}).sort({"Timestamp": -1})
    devolucionesMonto = devolucionesMonto.map((data) => {
      return{
        Recibo: data.Recibo
      }
    })
    devolucionesProductos = devolucionesProductos.map((data) => {
      return{
        Recibo: data.Recibo
      }
    })
    for(i=0; i< devolucionesMonto.length; i++){
      let data = {
        Recibo : devolucionesMonto[i].Recibo
      }
      documento.push((data))
    }
    for(i=0; i< devolucionesProductos.length; i++){
      let data = {
        Recibo : devolucionesProductos[i].Recibo
      }
      documento.push((data))
    }
  }
  if(TipoDocumento == "NotaPago"){
    documento = await notasPagoDB.find({EstadoGeneral: {$ne: "Anulada"}}).sort({"Timestamp": -1})
  }
  res.send(JSON.stringify(documento))
})


router.post('/facturacion/anular-factura', async (req, res) => {
  let {TipoDocumento, NumeroDocumento} = req.body
  if(TipoDocumento == 0){
    req.flash("error","No se ha seleccionado un tipo de documento. Por favor, valide e intente de nuevo")
    res.redirect('/facturacion/anular-factura')
    return
  }
  if(NumeroDocumento == 0){
    req.flash("error","No se ha seleccionado un número de documento. Por favor, valide e intente de nuevo")
    res.redirect('/facturacion/anular-factura')
    return
  }
  let Fecha = new Date();
  let Timestamp = Date.now();
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
  if(TipoDocumento ==  "NotaEntrega"){
    //anulamos nota, pasamos a Anulada la nota, pasamos saldo a 0 y gananciasVendedor a 0
    //Ingresamos a stock los codigos
    let nota = await facturaDB.findOne({Factura: NumeroDocumento})
    for(i=0; i < nota.Productos.length; i++){
        let producto = await stockDB.findOne({CodigoT: nota.Productos[i].Codigo})
        let CantidadNueva = +producto.CantidadTotal + +nota.Productos[i].Cantidad
        let CodigoMovimiento = producto.HistorialMovimiento
        CodigoMovimiento.sort(function (a, b) {
          if (a.Timestamp > b.Timestamp) {
            return -1;
          }
          if (a.Timestamp < b.Timestamp) {
            return 1;
          }
          return 0;
        });
        CodigoMovimiento = +CodigoMovimiento[0].CodigoMovimiento + 1
        let HistorialMovimiento = {
            FechaMovimiento : Fecha,
            CantidadAnterior : producto.CantidadTotal,
            CantidadMovida : nota.Productos[i].Cantidad,
            CantidadNueva : CantidadNueva,
            Comentario : `Carga por anulación de nota de entrega #${NumeroDocumento}`,
            Timestamp : Timestamp,
            CodigoMovimiento: CodigoMovimiento,
            TipoMovimiento : "Carga",
        }

        await stockDB.findByIdAndUpdate(producto._id,{
            Cantidad: CantidadNueva,
            $push: {HistorialMovimiento:HistorialMovimiento}
        })
    }
    await facturaDB.findByIdAndUpdate(nota._id,{
        Estado: "Anulada",
        EstadoGeneral: "Anulada",
        EstadoLibro: "Sin incluir",
        GananciasVendedor: 0,
        Saldo: 0,
    })
}
if(TipoDocumento == "NotaDevolucion"){
    //anulamos nota de devolucion manual y no por solicitud. 
    //Retornamos el valor de la devolucion a saldo y abrimos la nota de entrega de estar cerrada 
    //Descargamos de stock
    //Recalculamos ganancia vendedor
    let nota = await recibosDevolucioDB.findOne({Recibo: NumeroDocumento})
    if(nota){
      let notaEntrega = await facturaDB.findOne({Factura: nota.NotaEntrega})
      let PrecioTotal = 0
      for(i=0; i< nota.Productos.length; i++){
        PrecioTotal += nota.Productos[i].Precio
          let producto = await stockDB.findOne({CodigoT: nota.Productos[i].CodigoT})
          let CantidadNueva = +producto.CantidadTotal - +nota.Productos[i].Cantidad
          let CodigoMovimiento = producto.HistorialMovimiento
          CodigoMovimiento.sort(function (a, b) {
            if (a.Timestamp > b.Timestamp) {
              return -1;
            }
            if (a.Timestamp < b.Timestamp) {
              return 1;
            }
            return 0;
          });
          CodigoMovimiento = +CodigoMovimiento.CodigoMovimiento + 1
          let HistorialMovimiento = {
              FechaMovimiento : Fecha,
              CantidadAnterior : producto.CantidadTotal,
              CantidadMovida : nota.Productos[i].Cantidad,
              CantidadNueva : CantidadNueva,
              Comentario : `Descarga por anulación de nota de devolución #${NumeroDocumento}`,
              Timestamp : Timestamp,
              CodigoMovimiento: CodigoMovimiento,
              TipoMovimiento : "Descarga",
          }
          await stockDB.findByIdAndUpdate(producto._id,{
              Cantidad: CantidadNueva,
              $push: {HistorialMovimiento:HistorialMovimiento}
          })
      }
      let Porcentaje = notaEntrega.Porcentaje
      if(Porcentaje.length == 2){
          Porcentaje = `0.${Porcentaje}`
      }else{
          Porcentaje = `0.0${Porcentaje}`
      }
      let PendienteAPagar = (+notaEntrega.PendienteAPagar + +PrecioTotal).toFixed(2)
      let GananciasVendedor = (+notaEntrega.PrecioTotal * +Porcentaje).toFixed(2)
      await facturaDB.findByIdAndUpdate(notaEntrega._id,{
          Estado: "Por pagar",
          EstadoComision: "Por pagar",
          GananciasVendedor:GananciasVendedor,
          PendienteAPagar: PendienteAPagar
      })
      await recibosDevolucioDB.findByIdAndUpdate(nota._id,{
          EstadoGeneral: "Anulada",
          EstadoLibro: "Sin incluir",
      })
    }else{
      //realizar devolucion por monto. Anulamos el recibo de devolucion, y sumamos el saldo a las facturas abriendolas
      nota = await reciboPorMontoDB.findOne({Recibo: NumeroDocumento})
      for(i=0; i<  nota.Productos.length; i++){
        let factura = await facturaDB.findOne({Factura: nota.Productos[i].NotaEntrega})
        let PendienteAPagar = (+factura.PendienteAPagar + +nota.Productos[i].Precio).toFixed(2)
        let Porcentaje = factura.Porcentaje
        if(Porcentaje.length == 2){
            Porcentaje = `0.${Porcentaje}`
        }else{
            Porcentaje = `0.0${Porcentaje}`
        }
        let GananciasVendedor = (+factura.PrecioTotal * +Porcentaje).toFixed(2)
        await facturaDB.findByIdAndUpdate(factura._id,{
          Estado: "Por cobrar",
          GananciasVendedor: GananciasVendedor,
          PendienteAPagar: PendienteAPagar,
        })
      }
      await reciboPorMontoDB.findByIdAndUpdate(nota._id,{
        EstadoGeneral: "Anulada",
        EstadoLibro: "Sin incluir",
      })
    }
}
if(TipoDocumento == "NotaPago"){
    //anulamos la nota de pago y retornamos el valor pagado a todas las notas, abriendo las que estan cerradas
    let notaPago = await notasPagoDB.findOne({Recibo: NumeroDocumento})
    for(i=0; i< notaPago.Facturas.length; i++){
        let notaEntrega = await facturaDB.findOne({Factura: notaPago.Facturas[i].NotaEntrega})
        let PendienteAPagar = (+notaEntrega.PendienteAPagar + +notaPago.Facturas[i].Monto).toFixed(2) 
        await facturaDB.findByIdAndUpdate(notaEntrega._id,{
            PendienteAPagar: PendienteAPagar,
            Estado: "Por pagar"
        })
    }
    await notasPagoDB.findByIdAndUpdate(notaPago._id,{
        EstadoGeneral: "Anulada",
        EstadoLibro: "Sin incluir",
    })
  }
  req.flash("success","Documento anulado correctamente")
  res.redirect('/facturacion/anular-factura')
})

router.get('/facturacion/cambio-masivo-costo',  isAuthenticatedInventario ,async (req, res) => {
  res.render('facturacion/inventario/cambio-masivo-productos')
})

router.get('/importar-format-excel-estrcutura-costos', isAuthenticatedInventario, async (req, res) => {
  let stock = await stockDB.find().sort({TipoProducto: 1, Codigo: 1})
  const xl = require("excel4node");

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Stock Thomson");

    const style = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#FFFF00",
        fgColor: "#FFFF00",
      },
    });

    const styleTotal = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#EE0A1F",
        fgColor: "#EE0A1F",
      },
    });
    

    ws.cell(1, 1).string("Codigo").style(style);
    ws.cell(1, 2).string("Tipoproducto").style(style);
    ws.cell(1, 3).string("Descripción").style(style);
    ws.cell(1, 4).string("Posicion").style(style);
    ws.cell(1, 5).string("CostoFOB").style(styleTotal);
    ws.cell(1, 6).string("Costo").style(styleTotal);
    ws.cell(1, 7).string("CostoGranMayor").style(styleTotal);
    ws.cell(1, 8).string("CostoMayor").style(styleTotal);
    ws.cell(1, 9).string("CostoDetal").style(styleTotal);

    let fila = 2;
    for(i=0; i< stock.length; i++){
      let columna = 1
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
    ws.cell(fila, columna++).string(stock[i].TipoProducto);
    ws.cell(fila, columna++).string(Descripcion);
    ws.cell(fila, columna++).string(stock[i].Posicion);
    ws.cell(fila, columna++).number(stock[i].CostoFOB);
    ws.cell(fila, columna++).number(stock[i].Costo);
    ws.cell(fila, columna++).number(stock[i].CostoGranMayor);
    ws.cell(fila, columna++).number(stock[i].CostoMayor);
    ws.cell(fila, columna++).number(stock[i].CostoDetal);

    fila++;
  }

  wb.write("Formato de carga - Costos.xlsx", res);
})

router.post('/cambiar-archivo-costos',  isAuthenticatedInventario,upload2.single('Control'), async (req, res) => {
  console.log("entro")
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
  let Productos 
  function leerExcel(ruta){
    const workbook = XLSX.readFile(ruta)
    const workbookSheets = workbook.SheetNames
    Sucursal = workbookSheets[0]
    const sheet = workbookSheets[0]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    Productos = dataExcel
  }
  leerExcel(path.join(__dirname, "controles", "control.xlsx"))
  for(r=0; r< Productos.length; r++){
      await stockDB.findOneAndUpdate({CodigoT: Productos[r].Codigo},{
          CostoFOB : Productos[r].CostoFOB,
          Costo : Productos[r].Costo,
          CostoGranMayor : Productos[r].CostoGranMayor,
          CostoMayor : Productos[r].CostoMayor,
          CostoDetal : Productos[r].CostoDetal,
      })
  }
  req.flash("success","Precios guardados y actulizados correctamente")
  res.redirect("/facturacion/cambio-masivo-costo")
})


router.get('/facturacion/editar-componentes-inicio', isAuthenticatedMaster,async (req, res) => {
  res.render('facturacion/editar-componetes-incio')
})

router.get('/facturacion/editar-catalogo', isAuthenticatedMaster ,async (req, res) => {
  let catalogo = await catalogoDB.find().sort({TipoVehiculo: 1, Marca: 1, Modelo: 1})
  catalogo = catalogo.map((data) => {
    return{
      Timestamp: data.Timestamp,
      date: data.date,
      CodigoT: data.CodigoT,
      CodigoG: data.CodigoG,
      TipoVehiculo: data.TipoVehiculo,
      Marca: data.Marca,
      Modelo: data.Modelo,
      Desde: data.Desde,
      Hasta: data.Hasta,
      Año: data.Año,
      Familia: data.Familia,
      Posicion: data.Posicion,
      TipoProducto: data.TipoProducto,
      Verificado: data.Verificado,
      CorrelativoCarga: data.CorrelativoCarga,
      NombreImagen: data.NombreImagen,
      Nombre: data.Nombre,
      User: data.User,
      _id: data._id,
    }
  })

  res.render('facturacion/editar-catalogo',{
    catalogo
  })
})

router.get('/editar-codigo-catalogo/:id', isAuthenticatedMaster ,async (req, res) => {
  let modelos = await ModeloVehiculoDB.find().sort({Nombre: 1})
  let marcas = await MarcaVehiculoDB.find().sort({Nombre: 1})
  modelos = modelos.map((data) => {
    return{
      Nombre: data.Nombre,
    }
  })
  marcas = marcas.map((data) => {
    return{
      Nombre: data.Nombre,
    }
  })

  let productoCatalogo = await catalogoDB.findById(req.params.id)
  productoCatalogo = {
    Timestamp: productoCatalogo.Timestamp,
    date: productoCatalogo.date,
    CodigoT: productoCatalogo.CodigoT,
    CodigoG: productoCatalogo.CodigoG,
    TipoVehiculo: productoCatalogo.TipoVehiculo,
    Marca: productoCatalogo.Marca,
    Modelo: productoCatalogo.Modelo,
    Desde: productoCatalogo.Desde,
    Hasta: productoCatalogo.Hasta,
    Año: productoCatalogo.Año,
    Familia: productoCatalogo.Familia,
    Posicion: productoCatalogo.Posicion,
    TipoProducto: productoCatalogo.TipoProducto,
    Verificado: productoCatalogo.Verificado,
    CorrelativoCarga: productoCatalogo.CorrelativoCarga,
    NombreImagen: productoCatalogo.NombreImagen,
    Nombre: productoCatalogo.Nombre,
    User: productoCatalogo.User,
    _id: productoCatalogo._id,
  }

  res.render('facturacion/editar-producto-catalogo',{
    modelos,
    marcas,
    productoCatalogo
  })
})

router.post('/editar-producto-catalogo/:id', isAuthenticatedMaster, async (req, res) => {
  let { CodigoT,CodigoG,Posicion, Familia, Nombre, TipoVehiculo, Marca, Modelo, Desde, Hasta} = req.body

  await catalogoDB.findByIdAndUpdate(req.params.id,{
    CodigoT,
    CodigoG,
    Posicion, 
    Familia, 
    Nombre, 
    TipoVehiculo, 
    Marca, 
    Modelo, 
    Desde, 
    Hasta
  })

  req.flash('success', "Producto actualizado correctamente")
  res.redirect(`/editar-codigo-catalogo/${req.params.id}`)
})


router.post('/eliminar-codigo-catalogo/:id', isAuthenticatedMaster, async (req, res) => {
  await catalogoDB.findByIdAndDelete(req.params.id)
  req.flash('success', "Producto eliminado correctamente")
  res.redirect('/facturacion/editar-catalogo')

})

router.get('/registrar-nuevo-producto-catalogo', isAuthenticatedMaster, async (req, res) => {
  let modelos = await ModeloVehiculoDB.find().sort({Nombre: 1})
  let marcas = await MarcaVehiculoDB.find().sort({Nombre: 1})
  modelos = modelos.map((data) => {
    return{
      Nombre: data.Nombre,
    }
  })
  marcas = marcas.map((data) => {
    return{
      Nombre: data.Nombre,
    }
  })

  res.render('facturacion/registrar-nuevo-producto-catalogo',{
    modelos,
    marcas,
  })
})


router.post('/crear-nuevo-producto-catalogo', isAuthenticatedMaster ,async (req, res) => {
  let { CodigoT,CodigoG,Posicion, Familia, Nombre, TipoVehiculo, Marca, Modelo, Desde, Hasta} = req.body
  let nuevoProductoCatalogo = new catalogoDB({
      CodigoT,
      CodigoG,
      Posicion,
      Familia,
      Nombre,
      TipoVehiculo,
      Marca,
      Modelo,
      Desde,
      Hasta
  })
  await nuevoProductoCatalogo.save()
  req.flash('success', "Producto registrado correctamente")
  res.redirect('/registrar-nuevo-producto-catalogo')

})

module.exports = router;
