const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ModeloVehiculoRespaldo = new Schema({
    Nombre: { type: String, require: true },
    identificador:{ type: String, require: true },
});

module.exports = mongoose.model("ModeloVehiculoRespaldo", ModeloVehiculoRespaldo);