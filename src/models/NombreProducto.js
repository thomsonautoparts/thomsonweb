const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const NombreProducto = new Schema({
  Nombre: { type: String, require: true },
});

module.exports = mongoose.model("NombreProducto", NombreProducto);
