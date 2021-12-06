const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const transacciones = new Schema({
  Modalidad: {type: String, require: true },
  Referencia: {type: String, require: true },
  NumeroNota: {type: String, require: true },
});

module.exports = mongoose.model("Transacciones", transacciones);
