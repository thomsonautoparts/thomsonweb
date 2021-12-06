const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const garantiasRespaldo = new Schema({
  date: { type: String, require: true }, 
  CodigoT: { type: String, require: true },
  Comentario :  {type: String, require: true},
  Proveedor :  {type: String, require: true},
  identificador:{ type: String, require: true },
});

module.exports = mongoose.model("garantiasRespaldo", garantiasRespaldo);
