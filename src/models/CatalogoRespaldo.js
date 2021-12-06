const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const catalogoRespaldo = new Schema({
  date: { type: String, default: Date.now() },
  CodigoT: { type: String, require: true },
  identificador:{ type: String, require: true },
  CodigoG: { type: String, require: true },
  TipoVehiculo: { type: String, require: true },
  Marca: { type: String, require: true },
  Modelo: { type: String, require: true },
  Desde: { type: Number, require: true },
  Hasta: { type: Number, require: true },
  Año: { type: String, require: true },
  Familia: { type: String, require: true },
  Posicion: { type: String, require: true },
  TipoProducto: { type: String, require: true },
  Nombre: { type: String, require: true },
  User: { type: String },
});

module.exports = mongoose.model("catalogoRespaldo", catalogoRespaldo);
