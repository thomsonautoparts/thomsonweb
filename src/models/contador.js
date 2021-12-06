const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const contadorCollection = new Schema({
  Nombre: {type: String, require: true},  
  Contador: {type: Number, require: true},
});

module.exports = mongoose.model("contadorCollection", contadorCollection);

