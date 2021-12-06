const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ordenProveedorTemporalCollection = new Schema({
  date: { type: String, require: true },
  Proveedor: { type: String, require: true },
  VeintePies: { type: Number, require: true },
  CuarentaPies: { type: Number, require: true },
  CuarentaPiesHQ: { type: Number, require: true },
  Peso: { type: Number, require: true },
  Productos: [
    {
      Modelo: { type: String, require: true },
      Posicion: { type: String, require: true },
      Descripcion: { type: String, require: true },
      Posicion: { type: String, require: true },
      CodigoT: { type: String, require: true },
      CodigoG: { type: String, require: true },
      TipoProducto: { type: String, require: true },
      Cantidad: { type: Number, require: true },
      Costo: { type: Number, require: true },
      CostoGranMayor: { type: Number, require: true },
      CostoMayor: { type: Number, require: true },
      CostoDetal: { type: Number, require: true },
      PrecioUnidad: { type: Number, require: true },
      PrecioTotal: { type: Number, require: true },
      Peso: { type: Number, require: true },
      Alto: { type: Number, require: true },
      Ancho: { type: Number, require: true },
      Largo: { type: Number, require: true },
    },
  ],
  CantidadTotal: { type: Number, require: true },
  PrecioTotal: { type: Number, require: true },
});

module.exports = mongoose.model(
  "ordenProveedorTemporalCollection",
  ordenProveedorTemporalCollection
);
