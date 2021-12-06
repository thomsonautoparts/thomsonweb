const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ModeloProducto = new Schema({
  Nombre: { type: String, require: true },
});

module.exports = mongoose.model("ModeloProducto", ModeloProducto);
