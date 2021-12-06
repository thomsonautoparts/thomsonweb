const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const solicitudesRecuperacionContrasena = new Schema({
  email: {type: String, require: true },
});

module.exports = mongoose.model("solicitudes Recuperacion Contraseña", solicitudesRecuperacionContrasena);
