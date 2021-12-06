const router = require("express").Router();
const path = require("path");
const contadorDB = require("../models/contador");
const stockDB = require("../models/stock");

router.get("/", async (req, res) => {
  const contador = await contadorDB.find();

  const Contador = 1;
  const Nombre = "Contador"

  if (contador.length == 0) {
    const newContador = new contadorDB({
      Nombre,
      Contador
    });
    console.log(newContador)
    newContador.save()
  } else {
    const contador2 = await contadorDB.find();
    const incremento = contador2[0].Contador + 1
    await contadorDB.findOneAndUpdate({Nombre: Nombre, Contador: incremento })
  }

  res.render("thomson");
});
router.get("/thomson", (req, res) => {
  res.render("thomson");
});
module.exports = router;
