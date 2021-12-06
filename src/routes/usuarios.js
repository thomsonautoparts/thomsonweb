const router = require("express").Router();
const userDB = require("../models/users");
const solicitudesContrasenaDB = require("../models/solicitudes-recuperacion-contrasena");
const pendientesDB = require("../models/pendientes");
const passport = require('passport');
const { isAuthenticatedThomson } = require("../helpers/auth");



//Ruta de sign-in
router.get("/sign-in", (req, res) => {
  res.render("usuarios/sign-in");
});
//Post de sign-in
router.post("/sign-in", passport.authenticate('local',{
  successRedirect: '/facturacion',
  failureRedirect: '/sign-in',
  failureFlash: true
}));

//Ruta de register
router.get("/register", (req, res) => {
  res.render("usuarios/register");
});
//Post de register
router.post("/register", async (req, res) => {
  const {
    Nombres,
    Apellidos,
    Empresa,
    Direccion,
    Rif,
    Celular,
    Telefono,
    email,
    emailConfirm,
    password,
    passwordConfirm,
  } = req.body;

  const today = new Date()
  const date = today.toLocaleDateString()
  let Responsable = Empresa

  let errors = [];

  if (!Nombres) {
    errors.push({ text: 'El campo "Nombres" no puede estar vacio' });
  }
  if (!Apellidos) {
    errors.push({ text: 'El campo "Apellidos" no puede estar vacio' });
  }
  if (!Empresa) {
    errors.push({ text: 'El campo "Empresa" no puede estar vacio' });
  }
  if (!Rif) {
    errors.push({ text: 'El campo "Rif" no puede estar vacio' });
  }
  if (!Direccion) {
    errors.push({ text: 'El campo "Direccion" no puede estar vacio' });
  }
  if (!Celular) {
    errors.push({ text: 'El campo "Celular" no puede estar vacio' });
  }
  if (!email) {
    errors.push({ text: 'El campo "Correo electronico" no puede estar vacio' });
  }
  if (!password) {
    errors.push({ text: 'El campo "Nombres" no puede estar vacio' });
  }
  if (email != emailConfirm) {
    errors.push({ text: "Los correos ingresados no coinciden" });
  }
  if (password != passwordConfirm) {
    errors.push({ text: "Los contraseñas ingresadas no coinciden" });
  }
  if (errors.length > 0) {
    res.render("usuarios/register", {
      errors,
      Nombres,
      Apellidos,
      Empresa,
      Rif,
      Celular,
      Direccion,
      Telefono,
      email,
      emailConfirm,
      password,
      passwordConfirm,
    });
  } else {
    const UsuarioValidacion = await pendientesDB.findOne({ email: email });
    if (UsuarioValidacion) {
      errors.push({ text: "El correo ingresado ya se encuentra registrado" });
      res.render("usuarios/register", {
        errors,
        Nombres,
        Apellidos,
        Empresa,
        Rif,
        Celular,
        Direccion,
        Telefono,
        email,
        emailConfirm,
        password,
        passwordConfirm,
      });
    } else {
      const newPendiente = new pendientesDB({
        date,
        Nombres,
        Apellidos,
        Empresa,
        Rif,
        Celular,
        Direccion,
        Telefono,
        email
      });
      newPendiente.save();
      const Role = "Pendiente";
      const newUsuario = new userDB({
        date,
        email,
        password,
        Role,
        Responsable,
      });
      newUsuario.password = await newUsuario.encryptPassword(password);
      newUsuario.save();
      res.render("usuarios/registro-correcto");
    }
  }
});

//cerrar sesion 
router.get('/usuarios/cerrar-sesion', isAuthenticatedThomson, (req, res) =>{
  req.logOut();
  res.redirect('/sign-in')
} )

//ruta para solicitud de recuperacion de contraseña

router.get('/solicitud-recuperacion-contrasena', (req, res) => {


  res.render('usuarios/solicitud-recuperacion-contrasena')
})



//ruta post para solicitudes de recuperacion de contraseña

router.post('/solicitud-recuperacion-contrasena', async (req, res) => {
  let {email} = req.body 
  let existe = await userDB.findOne({email: email})

  if(!existe){
    let error ="No se consiguio el correo registrado en nuestra base de usuarios. Por favor, valide e intente de nuevo"
    res.render('usuarios/solicitud-recuperacion-contrasena',{
      error
    })

  }else{
    let nuevaSolicitud = new solicitudesContrasenaDB({
      email: email
    })

    nuevaSolicitud.save()

    res.render('usuarios/solicitud-procesada')

  }
})


module.exports = router;
