const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const noticiasCollection = new Schema({
  Timestamp: { type: Number, require: true },
  Fecha :  {type: String, require: true},
  Codigo :  {type: String, require: true},
  Titulo :  {type: String, require: true},
  Mensaje :  {type: String, require: true},
  Clase :  {type: String, require: true},
});

module.exports = mongoose.model("noticiasCollection", noticiasCollection);