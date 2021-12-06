const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const contadorRespaldo = new Schema({
  Nombre: {type: String, require: true},  
  Contador: {type: Number, require: true},
  identificador:{ type: String, require: true },
});

module.exports = mongoose.model("contadorRespaldo", contadorRespaldo);

