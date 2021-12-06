const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const valorFacturadoGranMayor = new Schema({
  valor: {type: Number,  default: 0},
});

module.exports = mongoose.model("valor Facturado Gran Mayor", valorFacturadoGranMayor);