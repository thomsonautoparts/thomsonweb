const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const porPagarPersonal = new Schema({
  FechaEstimada :{type: String, require: true},
  Estado:{type: String, require: true},
  Comentario:{type: String, require: true},
  Timestamp:{type: Number, require: true},
  Total: {type: Number, require: true},
  UltimoPago: {type: Number, require: true},
  PendienteAPagar: {type: Number, require: true},
});

module.exports = mongoose.model("porPagarPersonal", porPagarPersonal);