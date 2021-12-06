const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const pendientesCollection = new Schema({
  date: { type: String, require: true },
  Empresa: { type: String, require: true },
  Rif: {type: String, require: true},
  Direccion: { type: String, require: true },
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  Telefono: {type: String, default: "No ingresado"},
  Celular: {type: String, require: true},
  email :{type: String, require: true}

});

module.exports = mongoose.model("pendientesCollection", pendientesCollection);
