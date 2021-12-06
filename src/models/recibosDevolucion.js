const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const recibosDevolucio = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    EstadoGeneral: {type: String, default: "Procesada"},
    EstadoLibro: {type: String, default: "Sin incluir"},
    Recibo: {type: Number, require : true},
    NotaEntrega: {type: Number, require : true},
    Cliente : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Direccion : {type: String, require:true}, 
    Celular : {type: Number, require:true},
    Titulo : {type: String, require: true},
    Codigo: {type: String, require: true},
    Cantidad : {type: Number, require: true},
    Precio : {type: Number, require: true},
    PrecioActualNota : {type: Number, require: true},
    Productos: [{
        CodigoT: {type: String, require: true},
        Cantidad : {type: Number, require: true},
        Precio : {type: Number, require: true},
    }],

}); 

module.exports = mongoose.model("recibosDevolucio", recibosDevolucio);
