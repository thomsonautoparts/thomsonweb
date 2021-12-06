const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const MarcaRespaldo = new Schema({
    Nombre: { type: String, require: true },
    identificador:{ type: String, require: true },
});

module.exports = mongoose.model("MarcaRespaldo", MarcaRespaldo);