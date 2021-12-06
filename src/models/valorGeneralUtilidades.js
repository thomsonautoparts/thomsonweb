const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const valorGeneralUtilidades = new Schema({
  valor: {type: Number,  default: 0},
});

module.exports = mongoose.model("valor general  utlidades", valorGeneralUtilidades);