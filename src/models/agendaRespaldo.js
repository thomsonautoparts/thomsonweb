const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const agendaRespaldo = new Schema({
  date: { type: Date, require: true }, 
  Nombre: { type: String, require: true },
  Empresa: { type: String, require: true },
  identificador:{ type: String, require: true },
  Numero: {type: String, require: true },
});

module.exports = mongoose.model("agendaRespaldo", agendaRespaldo);
