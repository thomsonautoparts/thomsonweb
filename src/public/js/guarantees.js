const d = document,
  w = window,
  $main = d.getElementById("main");

d.getElementById(
  "header"
).innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
<div class="container-fluid">
  <a href="thomson">
    <img src="/css/assets/logo.png" alt="LOGO" id="logo" width="350px" />
  </a>
  <button
    class="navbar-toggler collapsed"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="toggle navigation"
  >
    <span class="navbar-toggler-icon"> </span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mr-4">
      <li class="nav-item">
        <a class="nav-link" aria-current="page" href="thomson">Home</a>
      </li>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          >Products</a
        >
        <ul class="dropdown-menu dark2" id="productsul" aria-labelledby="navbarDropdown">
          <div class="d-flex flex-row">
            <li>
              <a class="dropdown-item" href="original-thomson">
                <img
                  src="/css/assets/shock_aborber_1.png"
                  alt="ORIGINAL THOMSON"
                  width="250px"
                  class="image-exist"
                />
                <p class="text-center name_product">ORIGINAL THOMSON</p>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="thomson-heavy-duty">
                <img
                  src="/css/assets/shock_aborber_2.png"
                  alt="THOMSON HEAVY DUTY"
                  width="250px"
                  class="image-exist"
                />
                <p class="text-center name_product">THOMSON HEAVY DUTY</p>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="pro-thomson">
                <img
                  src="/css/assets/shock_aborber_3.png"
                  alt="PRO-THOMSON"
                  width="250px"
                  class="image-exist"
                />
                <p class="text-center name_product">PRO-THOMSON</p>
              </a>
            </li>
          </div>
          <div class="d-flex flex-row">
            <li>
              <a class="dropdown-item" href="thomson-truck-plus">
                <img
                  src="/css/assets/shock_aborber_4.png"
                  alt="THOMSON TRUCK-PLUS"
                  width="250px"
                  class="image-exist"
                />
                <p class="text-center name_product">THOMSON TRUCK-PLUS</p>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="direction-shock-absorber">
                <img
                  src="/css/assets/directionshockabsorber.png"
                  alt="DIRECTION SHOCK ABSORBER"
                  width="250px"
                  class="image-exist"
                />
                <p class="text-center name_product">
                  DIRECTION SHOCK ABSORBER
                </p>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="strut-mount-boot">
                <img
                  src="/css/assets/Strut_mount_boots_1.png"
                  alt="STRUT MOUNT AND BOOT"
                  width="250px"
                  class="image-exist"
                />
                <br />
                <p class="text-center name_product">STRUT MOUNT AND BOOT</p>
              </a>
            </li>
          </div>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="catalogue">Catalogue</a>
      </li>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          >Download</a
        >
        <ul class="dropdown-menu dark2" aria-labelledby="navbarDropdown">
            <a class="download dropdown-item text-light" href="download-shock-absorber">
          <p class="name_product">Shock absorber PDF</p>
        </a>
        <a class="download dropdown-item text-light" href="download-strut-mount">
        <p class="name_product">Strut mount PDF</p>
      </a>

          <a class="download dropdown-item text-light" href="">
            <p class="name_product">Catalogue EXCEL</p>
          </a>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link active" href="Guarentee">Warranty</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="dealers">Distributors</a>
      </li>
      <li class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        >Gallery</a
      >
      <ul class="dropdown-menu dark2" aria-labelledby="navbarDropdown">
        <a class="download dropdown-item text-light" href="production">
          <p class="name_product">Production</p>
        </a>
        <a class="download dropdown-item text-light" href="marketing">
          <p class="name_product">Marketing</p>
        </a>
      </ul>
    </li>
      <li class="nav-item">
        <a class="nav-link" href="about-us">About us</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="contacts">Contacts</a>
      </li>
    </ul>
    <ul class="navbar-nav">
      <li class="nav-item">
      <li class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        ><img src="/css/assets/world.png" width="30px" heigh="30px"> Languages</a
      >
      <ul class="dropdown-menu dark2" aria-labelledby="navbarDropdown">
        <a class="download dropdown-item text-light" href="#">
          <p class="name_product">English</p>
        </a>
        <a class="download dropdown-item text-light" href="#">
          <p class="name_product">Spanish</p>
        </a>
      </ul>
    </li>
      </li>
    </ul>
    <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" href="./sign-in">
        <button class="btn btn-outline-success" type="button">
          Sign in
        </button>
      </a>
    </li>
  </ul>
  </div>
</div>
</nav>
`;

const productsul = d.getElementById("productsul");

// Viewport

function changeMenu() {
  if (screen.width < 758) {
    console.log(productsul);

    d.getElementById("productsul").innerHTML = `<div class="d-flex flex-column">
    <li>
      <a class="dropdown-item" href="original-thomson">
        <p class="text-left name_product">ORIGINAL THOMSON</p>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="thomson-heavy-duty">
        <p class="text-left name_product">THOMSON HEAVY DUTY</p>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="pro-thomson">
        <p class="text-left name_product">PRO-THOMSON</p>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="thomson-truck-plus">
        <p class="text-left name_product">THOMSON TRUCK-PLUS</p>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="direction-shock-absorber">
        <p class="text-left name_product">DIRECTION SHOCK ABSORBER</p>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="strut-mount-boot">
        <p class="text-left name_product">STRUT MOUNT AND BOOT</p>
      </a>
    </li>
  </div>`;
  }

  if (d.querySelectorAll("image-exist")) {
    if (screen.width < 1436) {
    }
  } else {
  }

  if (screen.width <= 1170 && d.getElementById("date")) {
    d.getElementById("type").classList.remove("w-25");
    d.getElementById("mark").classList.remove("w-25");
    d.getElementById("model").classList.remove("w-25");
    d.getElementById("date").classList.remove("w-25");

    d.getElementById("type").classList.add("w-100");
    d.getElementById("mark").classList.add("w-100");
    d.getElementById("model").classList.add("w-100");
    d.getElementById("date").classList.add("w-100");
  } else {
  }
  if (screen.width < 1170 && d.getElementById("image-product")) {
    $imageRemove = d.getElementById("image-product").firstElementChild
      .lastElementChild;

    d.getElementById("image-product").firstElementChild.removeChild(
      $imageRemove
    );

    let text = d.getElementById("title").textContent,
      route = text.replace(/ /g, ""),
      routeImage = `/css/assets/${route}.png`,
      $image = d.createElement("img");

    $image.setAttribute("src", routeImage);

    d.getElementById("image-product").appendChild($image);
  } else {
    return;
  }
}

//Cambio de idioma


d.addEventListener("click", (e) => {
  if (e.target.textContent == "Spanish") {
    if(localStorage.length > 0){
      localStorage.setItem("Lenguajes", "Spanish")
      location.reload()
    }else{
      localStorage.setItem("Lenguajes", "Spanish")
      location.reload()

    }
  }
  if (e.target.textContent == "English") {
    if(localStorage.length > 0){
      localStorage.setItem("Lenguajes", "English")
      location.reload()
    }else{
      localStorage.setItem("Lenguajes", "English")
      location.reload()
    }
  }
  if (e.target.textContent == "Español") {
    if(localStorage.length > 0){
      localStorage.setItem("Lenguajes", "Spanish")
      location.reload()
    }else{
      localStorage.setItem("Lenguajes", "Spanish")
      location.reload()

    }
  }
  if (e.target.textContent == "Ingles") {
    if(localStorage.length > 0){
      localStorage.setItem("Lenguajes", "English")
      location.reload()
    }else{
      localStorage.setItem("Lenguajes", "English")
      location.reload()
    }
  }
  //location.reload();
});

//Funcion que cambia el idioma
const lenguajes = () => {
  if(localStorage.getItem("Lenguajes") == "Spanish"){

    d.getElementById("HTML").setAttribute("lang", "es")
    //barra de navegacion
    d.getElementById(
      "header"
    ).innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a href="thomson">
        <img src="/css/assets/logo.png" alt="LOGO" id="logo" />
      </a>
      <button
        class="navbar-toggler collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="toggle navigation"
      >
        <span class="navbar-toggler-icon"> </span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mr-4">
          <li class="nav-item">
            <a class="nav-link h5" aria-current="page" href="thomson">Inicio</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link h5 dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >Productos</a
            >
            <ul class="dropdown-menu dark2" id="productsul" aria-labelledby="navbarDropdown">
              <div class="d-flex flex-row">
                <li>
                  <a class="dropdown-item" href="original-thomson">
                    <img
                      src="/css/assets/shock_aborber_1.png"
                      alt="ORIGINAL THOMSON"
                      width="250px"
                      class="image-exist"
                    />
                    <p class="text-center name_product">ORIGINAL THOMSON</p>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="thomson-heavy-duty">
                    <img
                      src="/css/assets/shock_aborber_2.png"
                      alt="THOMSON HEAVY DUTY"
                      width="250px"
                      class="image-exist"
                    />
                    <p class="text-center name_product">THOMSON HEAVY DUTY</p>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="pro-thomson">
                    <img
                      src="/css/assets/shock_aborber_3.png"
                      alt="PRO-THOMSON"
                      width="250px"
                      class="image-exist"
                    />
                    <p class="text-center name_product">PRO-THOMSON</p>
                  </a>
                </li>
              </div>
              <div class="d-flex flex-row">
                <li>
                  <a class="dropdown-item" href="thomson-truck-plus">
                    <img
                      src="/css/assets/shock_aborber_4.png"
                      alt="THOMSON TRUCK-PLUS"
                      width="250px"
                      class="image-exist"
                    />
                    <p class="text-center name_product">THOMSON TRUCK-PLUS</p>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="direction-shock-absorber">
                    <img
                      src="/css/assets/directionshockabsorber.png"
                      alt="DIRECTION SHOCK ABSORBER"
                      width="250px"
                      class="image-exist"
                    />
                    <p class="text-center name_product">
                      DIRECTION SHOCK ABSORBER
                    </p>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="strut-mount-boot">
                    <img
                      src="/css/assets/Strut_mount_boots_1.png"
                      alt="STRUT MOUNT AND BOOT"
                      width="250px"
                      class="image-exist"
                    />
                    <br />
                    <p class="text-center name_product">STRUT MOUNT AND BOOT</p>
                  </a>
                </li>
              </div>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link h5" href="catalogue">Catálogo</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link h5 dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >Descargas</a
            >
            <ul class="dropdown-menu dark2" aria-labelledby="navbarDropdown">
              <a class="download dropdown-item text-light" href="download-shock-absorber">
              <p class="name_product">Amortiguadores PDF</p>
            </a>
            <a class="download dropdown-item text-light" href="download-strut-mount">
            <p class="name_product">Bases de amortiguadores PDF</p>
          </a>
              <a class="download dropdown-item text-light" href="">
                <p class="name_product">Descargar catálogo EXCEL</p>
              </a>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link h5 active" href="Guarentee">Garantías</a>
          </li>
          <li class="nav-item">
          <a class="nav-link h5" href="dealers">Distribuidores</a>
          </li>
          <li class="nav-item dropdown">
          <a
            class="nav-link h5 dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            >Galería</a
          >
          <ul class="dropdown-menu dark2" aria-labelledby="navbarDropdown">
            <a class="download dropdown-item text-light" href="production">
              <p class="name_product">Producción</p>
            </a>
            <a class="download dropdown-item text-light" href="marketing">
              <p class="name_product">Marketing</p>
            </a>
          </ul>
        </li>
          <li class="nav-item">
            <a class="nav-link h5" href="about-us">Nosotros</a>
          </li>
          <li class="nav-item">
            <a class="nav-link h5" href="contacts">Contactos</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
          <li class="nav-item dropdown">
          <a
            class="nav-link h5 dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            ><img src="/css/assets/world.png" width="30px" heigh="30px"> Idiomas</a
          >
          <ul class="dropdown-menu dark2" aria-labelledby="navbarDropdown">
            <a class="download dropdown-item text-light" href="#">
              <p class="name_product">Ingles</p>
            </a>
            <a class="download dropdown-item text-light" href="#">
              <p class="name_product">Español</p>
            </a>
          </ul>
        </li>
          </li>
        </ul>
        <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="./sign-in">
            <button class="btn btn-outline-success" type="button">
              Iniciar sesion
            </button>
          </a>
        </li>
      </ul>
      </div>
    </div>
    </nav>



   
   
    `
    //Contenido

    $main.innerHTML = `
    <div id="myCarousel" class="carousel" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="/css/assets/warranty2.png" class="carousel_image" alt="">
          <div class="container">
            <div class="carousel-caption text-start text-light">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-5 mb-5">
      <div class="row">
        <div class="col-sm-12 text-center">
          <h1 class="text-dark bg-warning">Nuestras garantías.</h2>
            <p class="text-light">
            Para poder usar nuestra garantía, debe hacer el reclamo dentro de los 3 
            primeros meses desde el momento de la compra. <strong> No son cubiertos por la 
            garantía los amortiguadores que presenten algún tipo de daño como</strong>:
            </p>
        </div>
        <!--Garantia-->
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/leaks.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Fugas</h5>
              <p class="card-text text-light lead">
              Si el amortiguador presenta una fuga de aceite provocada por una perforación 
              en el tubo, causado por una mala instalación, abuso del mismo o un accidente. 
              </p>
            </div>
          </div>

        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/detachments.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Desprendimientos</h5>
              <p class="card-text text-light lead">
                Si el amortiguador presenta un desprendimiento total o parcial de los terminales superiores o inferiores.</p>
            </div>
          </div>


        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/bumps.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Golpes</h5>
              <p class="card-text text-light lead">
                Si el amortiguador presenta golpes o rayaduras causadas por un accidente, una mala instalación o aplicación del mismo.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/bolt.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Pernos doblados</h5>
              <p class="card-text text-light lead">
                Si el perno del amortiguador esta doblado, causado la mayoría de las veces por una compresión del vehículo sobre el mismo.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/bolt2.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Pernos rotos</h5>
              <p class="card-text text-light lead">
                Si los pernos inferiores o superiores del amortiguador estan rotos, la mayoría de las veces
                es causado por una mala instalación del mismo.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/horns.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Bocinas deformadas.</h5>
              <p class="card-text text-light lead">
                Si el amortiguador tene bocinas deformadas, la mayoría de las veces
                es causado por una mala instalación del mismo</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/loosepiston.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Ejes y pistones sueltos</h5>
              <p class="card-text text-light lead">
                Si el amortiguador tiene los ejes y/o pistones sueltos, la mayoría de las veces es causado por una mala instalación del mismo.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/stripedaxles.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Ejes rayados</h5>
              <p class="card-text text-light lead">Si el amortiguador tiene ejes rayados, 
              causado por el mal uso de herramientas en el momento de la instalación.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/css/assets/gallery/barpin.png" alt="Card image cap">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Barpin roto</h5>
              <p class="card-text text-light lead">
              Si el amortiguador tiene terminales de lazo o barpin rotos, la mayoría de las veces es causado por una mala instalación.
              </p>
            </div>
          </div>
        </div>
        <hr>
        <!--Recomendaciones-->
        <!--Signos de alerta-->
        <div class="col-sm-12 text-center mt-2">
          <h2 class="h1 text-dark bg-warning">Recomendaciones Thomson</h2>
          <h3 class="h2 text-danger text-start">Signos de alerta</h3>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/frenos.png" class="rounded" alt="" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Distancia de frenado.</h5>
              <p class="text-light lead">
              Los amortiguadores gastados o de mala calidad hacen que las llantas reboten, lo que hace que el
               vehículo no pueda detenerse de manera eficiente al aplicar los frenos.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/desbalance.png" class="rounded" alt="" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Estabilidad.</h5>
              <p class="text-light lead">
              Los amortiguadores gastados, viejos y económicos no brindan suficiente amortiguación para mantener el vehículo en equilibrio.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/perdidacontrol.png" class="rounded" alt="" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Perdida del control.</h5>
              <p class="text-light lead">
                Es posible que los amortiguadores usados, viejos y económicos no tengan la respuesta correcta cuando se trata de conducir el vehículo.
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/desgaste.png" alt="" class="rounded" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">
                Desgaste de los neumáticos</h5>
              <p class="text-light lead">Los amortiguadores gastados o de mala calidad provocan un desgaste excesivo de los neumáticos, 
              reduciendo su vida útil considerablemente.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/fugaaceite.png" class="rounded" alt="" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">Fugas de aceite</h5>
              <p class="text-light lead">
                La pérdida de aceite en el amortiguador, golpes o señales de avería, es una clara señal de que los amortiguadores deben ser reemplazados.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/km.png" alt="" class="rounded" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">
                Chequear los amortiguadores</h5>
              <p class="text-light lead">
                Los amortiguadores deben revisarse cada 20.000 kilómetros para asegurar su estado.
              </p>
            </div>
          </div>
        </div>
    <hr>
        <!--Instalacion-->
        <div class="col-sm-12 text-center mt-5">
          <h3 class="h2 text-light text-start">Instalación.</h3>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/purgar.png" alt="" class="rounded" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">
                Purgar los amortiguadores</h5>
              <p class="text-light lead">
              Para cambiar correctamente los amortiguadores, debe purgar el aire de los nuevos amortiguadores antes de montarlos.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/parts.png" class="rounded" alt="" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">
                Revisar las partes de montaje</h5>
              <p class="text-light lead">
              Antes de la instalación, debe verificar las partes de montaje como el soporte del puntal, las botas, los pernos, entre otros.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card" style="width: 18rem;">
            <img src="/css/assets/gallery/suspension.png" alt="" class="rounded" srcset="">
            <div class="card-body bg-dark">
              <h5 class="card-title text-dark text-center bg-warning">
                Estado de la suspensión</h5>
              <p class="text-light lead">
                Revise las partes de la suspensión y reemplace las partes deterioradas para obtener el mejor rendimiento de su amortiguador.
              </p>
            </div>
          </div>

        </div>
      </div>

    `
  }
}


d.addEventListener("DOMContentLoaded", lenguajes())
w.addEventListener("load", changeMenu());