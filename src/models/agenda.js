const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const agendaCollection = new Schema({
  date: { type: Date, require: true }, 
  Nombre: { type: String, require: true },
  Empresa: { type: String, require: true },
  Numero: {type: String, require: true },
  Numero2: {type: String, require: true },
  email: {type: String, require: true },
});

module.exports = mongoose.model("agendaCollection", agendaCollection);
