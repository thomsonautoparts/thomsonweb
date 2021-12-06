const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const facturaCollection = new Schema({
    Factura : { type: Number, require : true },
    Timestamp: {type: Number, require : true},
    EstadoGeneral: {type: String, default: "Procesada"},
    EstadoLibro: {type: String, default: "Sin incluir"},
    Cliente : { type: String, require: true },
    DocumentoTipo : { type: String, require: true},
    Documento : { type: String, require: true},
    Direccion : { type: String, require: true},
    OrdenNumero : { type: String},
    Productos: [{
        Codigo: {type: String, require : true },
        Producto : {type: String, require: true},
        Modelo : {type: String, require: true},
        Cantidad: {type: String, require:true}, 
        precioUnidad: {type: String, require: true },
        precioTotal: {type: String, require: true },
        precioTotal2: {type: String, require: true },
    }],
    CantidadTotal:{type: String, require: true },
    PrecioTotal: {type: Number, require: true},
    PrecioTotal2: {type: Number, require: true},
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
    FechaUltimoPago : {type: String, require: true, default: "-"},
    PendienteAPagar :{ type:Number, require: true },
    PendienteAPagarComision :{ type:Number, require: true },
    GananciasVendedor: {type: Number, require : true },
    FechaPagoComision: {type: String, require: true},
    EstadoComision: {type: String, require: true, default: "Por cobrar"},
    TipoPrecio : {type: String, require: true},
    Estado: {type: String, require: true},
    User: {type: String},
    Nota: {type: String},
    Chofer: {type: String, require: true},
    EmpresaTransporte: {type: String, require: true},
    Nota: {type: String},
    HistorialPago: [{
        Pago: {type: String, require: true },
        Comentario: {type: String, require: true },
        Recibo: {type: Number, require: true },
        Modalidad: {type: String, require: true },
        FechaPago: {type: String, require: true },
        user: {type: String, require: true}, 
        Timestamp:{type: Number, require: true}
    }],
    

});

module.exports = mongoose.model("facturaCollection", facturaCollection);
