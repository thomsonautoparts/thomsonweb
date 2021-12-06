const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ordenClienteCollection = new Schema({
  Timestamp: { type: Number, require: true },
  date: {type: String, require: true},
  email: { type: String, require: true },
  OrdenNumero: {type: String, require: true},
  NumeroFactura: {type: String},
  TipoPrecio : {type: String, require: true},
  Estado: {type: String, default: "En proceso"},
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
  CantidadTotal : {type: Number, require: true},
  PrecioTotal :  {type: Number, require: true},
  ProductosAtendidos: [{
    CodigoT : {type: String},
    CodigoG : {type: String,},
    TipoProducto : {type: String},
    Descripcion : {type: String},
    Posicion : {type: String},
    Modelo : {type: String},
    Cantidad : {type: Number},
    PrecioUnidad : {type: Number},
    PrecioTotal : {type: Number}
  }],
  CantidadTotalAtendida : {type: Number},
  PrecioTotalAtendido: {type: Number},
  Vendedor: {type: String},
});

module.exports = mongoose.model("ordenClienteCollection", ordenClienteCollection);
