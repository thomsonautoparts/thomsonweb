const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const proveedorCollection = new Schema({
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
  email:  {type: String},
  Telefono:  {type: String},
  PaginaWeb:  {type: String},
  Nota:  {type: String},
});

module.exports = mongoose.model("proveedorCollection", proveedorCollection);
