const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const recibosComisiones = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    Recibo: {type: Number, require : true},
    Vendedor : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Comentario : {type: String, require:true}, 
    Nombres: {type: String, require:true},
    Apellidos: {type: String, require:true},
    Direccion : {type: String, require:true}, 
    Celular : {type: Number, require:true},
    Total : {type: Number, require:true},
    Facturas: [ {
        Factura : {type: Number, require:true},
        Comision: {type: Number, require:true},
        Cliente: {type: String, require:true}
    }]
}); 

module.exports = mongoose.model("recibosComisiones", recibosComisiones);
