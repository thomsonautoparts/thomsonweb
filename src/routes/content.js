const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const catalogoDB = require("../models/Catalogo");

//Ruta de about us
router.get("/about-us", (req, res) => {
  res.render("about_us");
});
//Ruta de catalogue
router.get("/catalogue", (req, res) => {
  res.render("catalogue");
});
//Post de para rellenar vehiculo en el catalogo
router.post("/search", async (req, res) => {

  const {Code, Description}= req.body

  let Codigo
  let Descripcion
  if(!Code){
    Codigo = "Indefinido"
  }else{
    Codigo = Code
  }

  if(!Description){
    Descripcion = "Indefinido"
  }else{
    Descripcion = Description
  }

  const codigo2 = new RegExp(Codigo, "i")
  const description2 = new RegExp(Descripcion, "i")
  const VehicleType = await catalogoDB.find({
    $or: [
      {CodigoT: codigo2},
      {CodigoG: codigo2},
      {TipoProducto: description2},
      {TipoVehiculo: description2},
      {Modelo: description2},
      {Marca: description2},
      {Año: description2},
      {Posicion: description2}
    ]
  })


  console.log(VehicleType)  
  res.status(202).send(JSON.stringify(VehicleType));


});



//Post de para rellenar vehiculo en el catalogo
router.post("/facturacion/vehicle", async (req, res) => {
  const { TipoProducto } = req.body;

  const VehicleType = await catalogoDB.find({ TipoProducto: TipoProducto });

  let Tipos = [];

  for (i = 0; i < VehicleType.length; i++) {
    Tipos.push({ TipoVehiculo: VehicleType[i].TipoVehiculo });
  }

  res.status(202).send(JSON.stringify(Tipos));
});

//Post de para rellenar marca en el catalogo
router.post("/facturacion/mark", async (req, res) => {
  const { Type, TipoProducto } = req.body;

  const VehicleType = await catalogoDB.find({
    TipoVehiculo: Type,
    TipoProducto: TipoProducto,
  });

  let marks = [];

  for (i = 0; i < VehicleType.length; i++) {
    marks.push({ Mark: VehicleType[i].Marca });
  }

  res.status(202).send(JSON.stringify(marks));
});
//Post para rellenar modelo
router.post("/facturacion/model", async (req, res) => {
  const { Mark, Type, TipoProducto } = req.body;

  const Marca = await catalogoDB.find({
    Marca: Mark,
    TipoVehiculo: Type,
    TipoProducto: TipoProducto,
  });

  let models = [];

  for (i = 0; i < Marca.length; i++) {
    models.push({ Model: Marca[i].Modelo });
  }

  res.status(202).send(JSON.stringify(models));
});
//Post para rellenar año
router.post("/facturacion/year", async (req, res) => {
  const { Model, Mark, Type, TipoProducto } = req.body;

  const Modelo = await catalogoDB.find({
    Modelo: Model,
    Marca: Mark,
    TipoVehiculo: Type,
    TipoProducto: TipoProducto,
  });

  let year = [];
  let id = [];
  let general = [];

  for (i = 0; i < Modelo.length; i++) {
    year.push({ Year: `${Modelo[i].Desde}-${Modelo[i].Hasta}` });
    id.push({ Id: Modelo[i]._id });
  }

  general.push(year);
  general.push(id);
  res.status(202).send(JSON.stringify(general));
});

//Post para rellenar catalogo
router.post("/facturacion/catalogue", async (req, res) => {
  const { TipoProducto, TipoVehiculo, Marca, Modelo, Desde, Hasta } = req.body;

  const año = `${Desde}-${Hasta}`;

  const product = await catalogoDB.find({
    Modelo: Modelo,
    Marca: Marca,
    TipoVehiculo: TipoVehiculo,
    TipoProducto: TipoProducto,
    Año: año,
  });

  res.status(202).send(JSON.stringify(product));
});

//Ruta de contacts
router.get("/contacts", (req, res) => {
  res.render("contacts");
});
//Ruta de direcion shock abosrber
router.get("/direction-shock-absorber", (req, res) => {
  res.render("direction_shock_absorber");
});
//Ruta de original thomson
router.get("/original-thomson", (req, res) => {
  res.render("original_thomson");
});
//Ruta de pro-thomson
router.get("/pro-thomson", (req, res) => {
  res.render("pro_thomson");
});
//Ruta de shock-absorber
router.get("/shock-absorber", (req, res) => {
  res.render("shock_absorber");
});
//Ruta de strut-mount-boot
router.get("/strut-mount-boot", (req, res) => {
  res.render("strut_mount_boot");
});
//Ruta de thomson heavy duty
router.get("/thomson-heavy-duty", (req, res) => {
  res.render("thomson_heavy_duty");
});
//Ruta de thomson truck plus
router.get("/thomson-truck-plus", (req, res) => {
  res.render("thomson_truck_plus");
});
//Ruta de dealers
router.get("/dealers", (req, res) => {
  res.render("dealers");
});
//Ruta de dealers
router.get("/dealers", (req, res) => {
  res.render("dealers");
});
//Ruta Guarentee
router.get("/Guarentee", (req, res) => {
  res.render("guarantee");
});
//Ruta Production
router.get("/production", (req, res) => {
  res.render("production");
});
//Ruta Production
router.get("/marketing", (req, res) => {
  res.render("material");
});

//Descargar shock absorber
router.get("/download-strut-mount", (req, res) => {
  res.download('./src/pdf/Catalogo-bases-Thomson.pdf', 'Catalogo bases Thomson.pdf')
});
//Descargar bases
router.get("/download-shock-absorber", (req, res) => {
  res.download('./src/pdf/Catalogo-Amortiguadores-Thomson.pdf', 'Catalogo_Amortiguadores_Thomson.pdf')
});

module.exports = router;
