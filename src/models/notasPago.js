const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const notasPago = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    EstadoGeneral: {type: String, default: "Procesada"},
    Referencia: {type: String, require : true},
    Recibo: {type: Number, require : true},
    Facturas: [{
        NotaEntrega: {type: Number, require : true},
        Monto: {type: Number, require : true},
        Modalidad: {type: String, require : true},
        Comentario: {type: String, require : true},
        
    }],
    NotaEntrega: {type: Number, require : true},
    Monto: {type: Number, require : true},
    Modalidad: {type: String, require : true},
    Comentario: {type: String, require : true},
    Comentario2: {type: String, require : true},
    Cliente : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Direccion : {type: String, require:true}, 
    Celular : {type: Number, require:true},
    PendienteAPagar : {type: Number, require: true}
}); 

module.exports = mongoose.model("notasPago", notasPago);
