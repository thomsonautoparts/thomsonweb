const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const stockRespaldo = new Schema({
  date: { type: String, require: true },
  Timestamp: { type: Number, require: true },
  FechaUltimoIngreso: { type: String, require: true, default: "-" },
  identificador:{ type: String, require: true },
  Vehiculo : [{
    TipoVehiculo: { type: String, require: true },
    Marca: { type: String, require: true },
    Modelo: { type: String, require: true },
    Desde: { type: Number, require: true },
    Hasta: { type: Number, require: true },
    Familia: {type: String, require: true},
    Posicion: {type: String, require: true},
    Cantidad : {type: Number, require: true},
    CostoM: {type: Number, require: true},
    Costo: {type: Number, require: true},
    Precio: {type: Number, require: true},
    CostoMT: {type: Number, require: true},
    CostoT: {type: Number, require: true},
    PrecioT: {type: Number, require: true},
  }],
  TipoProducto: {type: String, require: true},
  Nombre : {type: String, require: true},
  Proveedor : {type: String, require: true},
  CodigoT: {type: String, require: true},
  CodigoG: {type: String, require: true},
  CantidadTotal: {type: Number, require: true},
  CantidadVendida: {type: Number, require: true},
  CostoFOB: {type: Number, require: true},
  CostoTotalStock: {type: Number, require: true},
  Costo: {type: Number, require: true},
  CostoTotal: {type: Number, require: true},
  CostoFOBTotal: {type: Number, require: true},
  CostoGranMayor: {type: Number, require: true},
  CostoMayor: {type: Number, require: true},
  CostoDetal: {type: Number, require: true},
  CostoGranMayorTotal: {type: Number, require: true},
  CostoMayorTotal: {type: Number, require: true},
  CostoDetalTotal: {type: Number, require: true},
  User: { type: String },
  TipoVehiculo: {type: String, require: true},
  Modelo: {type: String, require: true},
  Familia: {type: String, require: true},
  Posicion: {type: String, require: true},
  Año: {type: String, require: true},
  HistorialMovimiento: [{
      FechaMovimiento :{type: String, require : true }, 
      CantidadAnterior: {type: Number, require: true},
      CantidadMovida: {type: Number, require: true},
      CantidadNueva: {type: Number, require: true},
      Comentario: {type: String, require:true}, 
      Timestamp : {type: Number, require: true},
      CodigoMovimiento : {type: String, require: true},
      TipoMovimiento : {type: String, require: true}
  }]

});

module.exports = mongoose.model("stockRespaldo", stockRespaldo);
