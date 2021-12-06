const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const recibosDevolucionPorMonto = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    Recibo: {type: Number, require : true},
    EstadoGeneral: {type: String, default: "Procesada"},
    EstadoLibro: {type: String, default: "Sin incluir"},
    NotaEntrega: {type: Number, require : true},
    Cliente : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Direccion : {type: String, require:true}, 
    Celular : {type: Number, require:true},
    Titulo : {type: String, require: true},
    Comentario : {type: String, require: true},
    PrecioActualNota : {type: Number, require: true},
    Productos: [{
        NotaEntrega: {type: String, require: true},
        Precio : {type: Number, require: true},
    }],
}); 

module.exports = mongoose.model("recibosDevolucionPorMonto", recibosDevolucionPorMonto);
