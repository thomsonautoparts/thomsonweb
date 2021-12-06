const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const mesesAdministracion = new Schema({
  Año :{type: Number, require: true},
  Mes:{type: String, require: true},
  NumeroMes:{type: String, require: true},
  Estado:{type: String, require: true},
  Total: {type: Number, require: true},
  dia:[{
    Timestamp: {type: Number, require: true},
    Fecha: {type: String, require: true},
    Monto: {type: Number, require: true},
    Entrada: {type: Number},
    Total: {type: Number, require: true},
    Salida: {type: Number},
    Comentario: {type: String, require: true}
    }]
});

module.exports = mongoose.model("mesesAdministracion", mesesAdministracion);
