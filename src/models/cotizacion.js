const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const cotizacionCollection = new Schema({
    Factura : { type: Number, require : true },
    Timestamp: {type: Number, require : true},
    Cliente : { type: String, require: true },
    DocumentoTipo : { type: String, require: true},
    Documento : { type: String, require: true},
    Direccion : { type: String, require: true},
    Productos: [{
        Codigo: {type: String, require : true },
        Producto : {type: String, require: true},
        Modelo : {type: String, require: true},
        Cantidad: {type: String, require:true}, 
        precioUnidad: {type: String, require: true },
        precioTotal: {type: String, require: true },
    }],
    CantidadTotal:{type: String, require: true },
    PrecioTotal: {type: Number, require: true},
    date: { type: String, require: true },
    Vencimiento : {type: String, require: true },
    Celular : {type: String, require: true},
    Vendedor : {type: String, require: true},
    Codigo : {type: String, require: true},
    DocumentoVendedor : {type: String, require: true},
    Zona : {type: String, require: true},
    Porcentaje : {type: Number, require: true},
    FechaModificacion: {type: String, require: true},
    UltimoPago : {type: Number, require: true, default: 0},
    PendienteAPagar :{ type:Number, require: true },
    GananciasVendedor: {type: Number, require : true },
    Estado: {type: String, require: true},
    User: {type: String},
    Nota: {type: String}
    

});

module.exports = mongoose.model("cotizacionCollection", cotizacionCollection);
