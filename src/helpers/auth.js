const helpers = {};

//ingresa al inicio de facturacion
helpers.isAuthenticatedThomson = (req, res, next) => {
  
  if (req.isAuthenticated()) {
    let Facturacion = req.user.Role.find((element) => element == "Facturación");
    let Cobranza = req.user.Role.find((element) => element == "Cobranza");
    let Inventario = req.user.Role.find((element) => element == "Inventario");
    let Proveedor = req.user.Role.find((element) => element == "Proveedor");
    let Cliente = req.user.Role.find((element) => element == "Cliente");
    let Vendedor = req.user.Role.find((element) => element == "Vendedor");
    let Transporte = req.user.Role.find((element) => element == "Transporte");
    let Perfiles = req.user.Role.find((element) => element == "Perfiles");
    let Comision = req.user.Role.find((element) => element == "Comisión");
    let Agenda = req.user.Role.find((element) => element == "Agenda");
    let Dashboard = req.user.Role.find((element) => element == "Dashboard");
    let Client = req.user.Role.find((element) => element == "Client");
    let Seller = req.user.Role.find((element) => element == "Seller");
    let Master = req.user.Role.find((element) => element == "Master");
    let Administracion = req.user.Role.find((element) => element == "Administracion");
    
    if (
      req.isAuthenticated() &&
      (Facturacion ||
        Cobranza ||
        Inventario ||
        Proveedor ||
        Cliente ||
        Vendedor ||
        Transporte ||
        Perfiles ||
        Comision ||
        Agenda ||
        Dashboard ||
        Master ||
        Client ||
        Administracion ||
        Seller )
    ) {
      return next();
    }
  }
  req.flash("error", "Usuario pendiente de aprobacion");
  res.redirect("/sign-in");
};

//Ingreso a facturacion
helpers.isAuthenticatedFacturacion = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Facturacion = req.user.Role.find((element) => element == "Facturación");
    let Master = req.user.Role.find((element) => element == "Master");

    if (req.isAuthenticated() && (Facturacion || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario pendiente de aprobacion");
  res.redirect("/Facturacion");
};
//Ingreso en cobranza
helpers.isAuthenticatedCobranza = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Cobranza = req.user.Role.find((element) => element == "Cobranza");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Cobranza || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/Facturacion");
};

//Ingreso en inventario
helpers.isAuthenticatedInventario = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Inventario = req.user.Role.find((element) => element == "Inventario");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Inventario || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/Facturacion");
};

//Ingreso en proveedor
helpers.isAuthenticatedProveedor = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Proveedor = req.user.Role.find((element) => element == "Proveedor");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Proveedor || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};

//Ingreso en cliente
helpers.isAuthenticatedCliente = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Cliente = req.user.Role.find((element) => element == "Cliente");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Cliente || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};
//Ingreso en vendedor
helpers.isAuthenticatedVendedor = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Vendedor = req.user.Role.find((element) => element == "Vendedor");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Vendedor || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};

//Ingreso en transporte
helpers.isAuthenticatedTransporte = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Transporte = req.user.Role.find((element) => element == "Transporte");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Transporte || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};
//Ingreso en perfil
helpers.isAuthenticatedPerfil = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Perfiles = req.user.Role.find((element) => element == "Perfiles");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Perfiles || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};
//Ingreso en comision
helpers.isAuthenticatedComision = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Comision = req.user.Role.find((element) => element == "Comisión");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Comision || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};
//Ingreso en agenda
helpers.isAuthenticatedAgenda = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Agenda = req.user.Role.find((element) => element == "Agenda");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Agenda || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};
//Ingreso en dashboard
helpers.isAuthenticatedDashboard = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Dashboard = req.user.Role.find((element) => element == "Dashboard");
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && (Dashboard || Master)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};

helpers.isAuthenticatedMaster = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Master = req.user.Role.find((element) => element == "Master");
    if (req.isAuthenticated() && Master) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};


helpers.isAuthenticatedClient = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Client = req.user.Role.find((element) => element == "Client");

    if (req.isAuthenticated() && (Client)) {
      return next();
    }
  }
  req.flash("error", "Usuario pendiente de aprobacion");
  res.redirect("/sign-in");
};


helpers.isAuthenticatedSeller = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Seller = req.user.Role.find((element) => element == "Seller");

    if (req.isAuthenticated() && (Seller)) {
      return next();
    }
  }
  req.flash("error", "Usuario pendiente de aprobacion");
  res.redirect("/sign-in");
};

helpers.isAuthenticatedSellerClient = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Seller = req.user.Role.find((element) => element == "Seller");
    let Client = req.user.Role.find((element) => element == "Client");

    if (req.isAuthenticated() && (Seller || Client)) {
      return next();
    }
  }
  req.flash("error", "Usuario pendiente de aprobacion");
  res.redirect("/sign-in");
};
helpers.isAuthenticatedAdministracion = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Seller = req.user.Role.find((element) => element == "Administracion");
    let Client = req.user.Role.find((element) => element == "Master");

    if (req.isAuthenticated() && (Seller || Client)) {
      return next();
    }
  }
  req.flash("error", "No autorizado");
  res.redirect("/Facturacion");
};



module.exports = helpers;
