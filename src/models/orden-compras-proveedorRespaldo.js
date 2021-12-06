const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ordenComprasRespaldo = new Schema({
  date: { type: String, require: true }, 
  Proveedor: { type: String, require: true },
  OrdenNumero: {type: Number, require: true},
  Productos: [{
    Descripcion: {type: String, require: true},
    Posicion: {type: String, require: true},
    Modelo: {type: String, require: true},
    CodigoT: {type: String, require: true},
    CodigoG: {type: String, require: true},
    TipoProducto: {type: String, require: true},
    Cantidad: {type: Number, require: true},
    Costo: {type: Number, require: true},
    CostoGranMayor: {type: Number, require: true},
    CostoMayor: {type: Number, require: true},
    CostoDetal: {type: Number, require: true},
    CostoFOB: {type: Number, require: true},
    PrecioUnidad: {type: Number, require: true},
    PrecioTotal: {type: Number, require: true},
  }],
  CantidadTotal :  {type: Number, require: true},
  PrecioTotal :  {type: Number, require: true},
  OrdenTemporal :  {type: String, require: true},
  Estado: {type: String, require: true, default : "Produccion"},
  identificador:{ type: String, require: true },
});

module.exports = mongoose.model("ordenComprasRespaldo", ordenComprasRespaldo);
