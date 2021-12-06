const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const bootsGeneral = new Schema({
  Cantidad: {type: Number,  default: 0},
});

module.exports = mongoose.model("boots General", bootsGeneral);