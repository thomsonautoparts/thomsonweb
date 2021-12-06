const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const CantidadOrdenes = new Schema({
    Cantidad: {type:Number, require: true}
});

module.exports = mongoose.model("Cantidad ordenes", CantidadOrdenes);
