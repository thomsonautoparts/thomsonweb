const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const transporteCollection = new Schema({
    date : {type: String, require: true},
    FechaModificacion : {type: String, require: true},
    Empresa : {type: String, require: true},
    Rif : {type: String, require: true},
    Direccion : {type: String, require: true},
    Vehiculo : {type: String, require: true},
    Placa : {type: String, require: true},
    Username : {type: String, require: true},
    Chofer : {type: String, require: true},
    Estado : {type: String, require: true},
    user : {type: String}
});

module.exports = mongoose.model("transporteCollection", transporteCollection);
