const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const notasCredito = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    NotaCredito: {type: Number, require : true},
    NotaEntrega: {type: Number, require : true},
    Monto: {type: Number, require : true},
    Descripcion: {type: String, require : true},
    PrecioUnitario: {type: String, require : true},
    PrecioTotal: {type: String, require : true},
    Cantidad: {type: String, require : true},
    Cliente : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Direccion : {type: String, require:true}, 
    VendedorCodigo : {type: String, require:true}, 
    Celular : {type: Number, require:true},
}); 

module.exports = mongoose.model("notasCredito", notasCredito);
