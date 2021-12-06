const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const proveedorRespaldo = new Schema({
  date: { type: Date, require: true }, 
  FechaModificacion: { type: String}, 
  Nombre: { type: String, require: true },
  Pais: { type: String, require: true },
  Direccion: {type: String, require: true },
  Estado: {type: String, require: true},
  Postal: {type: Number, require: true},
  Codigo: {type: String, require: true},
  Costo: {type: Number, require: true},
  GranMayor: {type: Number, require: true},
  Mayor: {type: Number, require: true},
  Detal: {type: Number, require: true},
  date2: {type: String, require: true},
  identificador:{ type: String, require: true },
});

module.exports = mongoose.model("proveedorRespaldo", proveedorRespaldo);
