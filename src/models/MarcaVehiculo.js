const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const MarcaVehiculo = new Schema({
    Nombre: { type: String, require: true },
});

module.exports = mongoose.model("MarcaVehiculo", MarcaVehiculo);