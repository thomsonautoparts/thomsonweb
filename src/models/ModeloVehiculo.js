const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ModeloVehiculo = new Schema({
    Nombre: { type: String, require: true },
});

module.exports = mongoose.model("ModeloVehiculo", ModeloVehiculo);