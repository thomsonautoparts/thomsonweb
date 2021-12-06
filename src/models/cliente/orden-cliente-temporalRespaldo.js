const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ordenClienteTemporalRespaldpo = new Schema({
  email: { type: String, require: true },
  identificador:{ type: String, require: true },
  Productos: [{
    CodigoT : {type: String, require: true},
    CodigoG : {type: String, require: true},
    TipoProducto : {type: String, require: true},
    Descripcion : {type: String, require: true},
    Posicion : {type: String, require: true},
    Modelo : {type: String, require: true},
    Cantidad : {type: Number, require: true},
    PrecioUnidad : {type: Number, require: true},
    PrecioTotal : {type: Number, require: true},
  }],
  CantidadTotal :  {type: Number, require: true},
  PrecioTotal :  {type: Number, require: true},
});

module.exports = mongoose.model("ordenClienteTemporalRespaldpo", ordenClienteTemporalRespaldpo);
