const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const contadorClientes = new Schema({
  Cantidad: {type: Number,  default: 0},
});

module.exports = mongoose.model("contador Clientes", contadorClientes);