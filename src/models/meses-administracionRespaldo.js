const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const mesesRespaldo = new Schema({
  Año :{type: String, require: true},
  Estado:{type: String, default: "ABIERTO"},
  TotalEntrada:{type: Number, require: true},
  TotalSalida:{type: Number, require: true},
  identificador:{ type: String, require: true },
  Total: {type: Number, require: true},
  meses:[{
    EstadoMes:{type: String, default: "ABIERTO"},
    NumeroMes:{type: Number, require: true},
    Total: {type: Number, require: true},
    Mes:{type: String, require: true},
    TotalEntrada: {type: Number, require: true},
    Monto: {type: Number, require: true},
    TotalSalida: {type: Number, require: true},
    dia:[{
      Timestamp: {type: Number, require: true},
      Fecha: {type: String, require: true},
      Monto: {type: Number, require: true},
      Entrada: {type: Number},
      Total: {type: Number, require: true},
      Salida: {type: Number},
      Comentario: {type: String, require: true}
      }]
  }]
});

module.exports = mongoose.model("mesesRespaldo", mesesRespaldo);
