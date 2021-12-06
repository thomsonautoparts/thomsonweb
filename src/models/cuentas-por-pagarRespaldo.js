const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const porPagarRespaldo = new Schema({
  FechaEstimada :{type: String, require: true},
  Estado:{type: String, require: true},
  Comentario:{type: String, require: true},
  Timestamp:{type: Number, require: true},
  Total: {type: Number, require: true},
  UltimoPago: {type: Number, require: true},
  PendienteAPagar: {type: Number, require: true},
  identificador:{ type: String, require: true },
});

module.exports = mongoose.model("porPagarRespaldo", porPagarRespaldo);