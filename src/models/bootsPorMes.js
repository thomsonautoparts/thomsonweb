const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const bootsPorMes = new Schema({
  Cantidad: {type: Number,  default: 0},
  Mes: {type: String, require: true},
  NumeroMes: {type: String, require: true},
  Anio: {type: String, require: true},
});

module.exports = mongoose.model("boots Por Mes", bootsPorMes);
