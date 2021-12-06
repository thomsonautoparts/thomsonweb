const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const clienteCollection = new Schema({
  date: { type: String, require: true },
  Timestand: {type: Number, require: true},
  FechaModificacion: {type: String},
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  Cedula: { type: Number},
  Empresa: { type: String, require: true },
  Direccion: { type: String, require: true },
  Rif: {type: String, require: true},
  Telefono: {type: String},
  Celular: {type: String, require: true},
  Vendedor: {type: String, require: true},
  TipoPrecio: {type: String, require: true},
  Codigo: {type: String, require: true},
  email: {type: String, require: true},
  User: { type: String, require: true},
  HistorialCliente: [{
    Factura: {type: String, require: true},
    Estado: {type: String, require: true},
    Vendedor: {type: String, require: true},
    FechaCreacion: {type: String, require: true},
    FechaVencimiento: {type: String, require: true},
    Timestamp: {type: Number, require: true},
    Productos: [{
        Codigo: {type: String, require : true },
        Producto : {type: String, require: true},
        Cantidad: {type: Number, require:true}, 
        precioUnidad: {type: Number, require: true },
        precioTotal: {type: Number, require: true },
    }]
  }]
});

module.exports = mongoose.model("clienteCollection", clienteCollection);
