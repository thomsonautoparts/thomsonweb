const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const vendedorCollection = new Schema({
  date: { type: String, require: true }, 
  FechaModificacion: { type: String}, 
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  Cedula: { type: Number, require: true },
  Celular: {type: String, require: true},
  Direccion: { type: String, require: true },
  Zona: {type: String, require: true},
  Estado: {type: String, require: true},
  Username: {type: String, require: true},
  email: {type: String, require: true},
  Porcentaje: {type: Number, require: true},
  Codigo: {type: String, require: true},
  User: { type: String, require: true },
  HistorialVendedor: [{
    Factura: {type: String, require: true},
    Estado: {type: String, require: true},
    Cliente: {type: String, require: true},
    FechaCreacion: {type: String, require: true},
    FechaVencimiento: {type: String, require: true},
    Timestamp : {type: Number, require: true},
    Productos: [{
        Codigo: {type: String, require : true },
        Producto : {type: String, require: true},
        Cantidad: {type: Number, require:true}, 
        precioUnidad: {type: Number, require: true },
        precioTotal: {type: Number, require: true },
    }]
  }]
});

module.exports = mongoose.model("vendedorCollection", vendedorCollection);
