const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const amoritiguadoresPorMes = new Schema({
  Cantidad: {type: Number, default: 0},
  Mes: {type: String, require: true},
  NumeroMes: {type: String, require: true},
  Anio: {type: String, require: true},
});

module.exports = mongoose.model("amoritiguadores Por Mes", amoritiguadoresPorMes);
