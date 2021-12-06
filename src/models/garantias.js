const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const garantiasCollections = new Schema({
  date: { type: String, require: true }, 
  CodigoT: { type: String, require: true },
  Comentario :  {type: String, require: true},
  Proveedor :  {type: String, require: true},
  Estado :  {type: String, default: "Por procesar"},
  Cantidad :  {type: Number, require: true},
});

module.exports = mongoose.model("garantiasCollections", garantiasCollections);
