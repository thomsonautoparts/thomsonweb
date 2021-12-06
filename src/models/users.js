const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const usersCollection = new Schema({
  date: { type: String, default : Date.now },
  FechaModificacion: {type: String},
  email: { type: String, require: true },
  password: { type: String, require: true },
  Role: [{ type: String, require: true }],
  Estado: { type: String, require: true },
  Responsable: {type: String, require: true},
  Nombres: {type: String, require: true},
  Apellidos: {type: String, require: true},
  Cedula: {type: String, require: true},
  User: { type: String },
  TipoPrecio: { type: String, require: true },
});


//encriptando contraseña

usersCollection.methods.encryptPassword = async (password) =>{
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};


usersCollection.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password); 
} 


module.exports = mongoose.model("usersCollection", usersCollection);
