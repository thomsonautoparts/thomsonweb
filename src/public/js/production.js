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

        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="Guarentee">Warranty</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="dealers">Distributors</a>
      </li>
      <li class="nav-item dropdown">
      <a
        class="nav-link active dropdown-toggle"
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
         
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link h5" href="Guarentee">Garantías</a>
          </li>
          <li class="nav-item">
          <a class="nav-link h5" href="dealers">Distribuidores</a>
          </li>
          <li class="nav-item dropdown">
          <a
            class="nav-link h5 active dropdown-toggle"
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
          <video src="/css/assets/videos/thomson.mp4" class="carousel_image bg-transparent" width="100%" height="100%" controls autoplay loop></video>
        </div>
      </div>
    </div>
    <div class="container mt-4">
      <div class="row">
        <dov class="col-sm-12">
          <h1 class="text-center bg-warning text-dark">La producción de Thomson</h1>
        </dov>
        <div class="col-sm-6 mt-5">
          <div class="card bg-transparent">
            <video src="/css/assets/videos/video_1.mp4" height="320px" muted controls></video>
          </div>
        </div>
        <div class="col-sm-6 mt-4">
          <div class="card bg-transparent">
            <h3 class="px-4 text-center text-light">Los productos Thomson se elaboran bajo las mejores especificaciones
              técnicas.</h3>
            <p class="mt-2 lead">Nuestros trabajadores cuentan con los conocimientos necesarios y las habilidades necesarias 
            para crear uno de los mejores amortiguadores del mercado actual. <br> <br>
 
            Contamos con la mejor maquinaria para la creación de todos nuestros productos, 
            donde se le aplican todos los conocimientos y características de la tecnología Japonesa. 
            </p>
          </div>
        </div>
        <div class="col-sm-6 mt-4">
          <div class="card bg-transparent">
            <h3 class="text-light px-4 text-center">Capaces de producir miles de productos Thomson</h3>
            <p class="mt-2 lead">Nuestras fábricas cuentan con el suficiente personal, materia prima y maquinarias
              para producir cantidades masivas de productos Thomson.
            </p>
          </div>
        </div>
        <div class="col-sm-6 mt-4">
          <div class="card bg-transparent">
            <video src="/css/assets/videos/shocks.mp4" height="320px" controls></video>
          </div>
        </div>
        <div class="col-sm-4 mt-5">
          <div class="card bg-transparent">
            <video src="/css/assets/videos/boxes.mp4" height="320px" muted controls></video>
          </div>
        </div>
        <div class="col-sm-4 mt-4">
          <div class="card bg-transparent">
            <h3 class="px-4 text-center text-light">Calidad.</h3>
            <p class="mt-2 lead">Todos nuestros productos cuentan con una excelente calidad, 
            desde el producto principal hasta las cajas que lo contienen, ya
            nuestras cajas están preparadas para proteger el producto. Además fueron creadas con un diseño muy
            atractivo a la vista en el mercado de autopartes a nivel Internacional. 
            </p>
          </div>
        </div>
        <div class="col-sm-4 mt-5">
          <div class="card bg-transparent">
            <video src="/css/assets/videos/quality2.mp4" height="320px" muted controls></video>
          </div>
        </div>
        <hr>
        <div class="col-sm-12">
          <h3 class="h1 text-center bg-warning text-dark">Galería</h3>
        </div>
        <div class="row">
        <div class="col-sm-6 col-md-4 mb-3">
        <a href="/css/assets/gallery/1.jpeg" data-lightbox="photos">
          <img src="/css/assets/gallery/1.jpeg" alt="" class="fluid img-thumbnail">
        </a>
      </div>
      <div class="col-sm-6 col-md-4 mb-3">
        <a href="/css/assets/gallery/2.jpeg" data-lightbox="photos">
          <img src="/css/assets/gallery/2.jpeg" alt="" class="fluid img-thumbnail">
        </a>
      </div>
      <div class="col-sm-6 col-md-4 mb-3">
        <a href="/css/assets/gallery/3.jpeg" data-lightbox="photos">
          <img src="/css/assets/gallery/3.jpeg" alt="" class="fluid img-thumbnail">
        </a>
      </div>
      <div class="col-sm-6 col-md-6 mb-3 d-flex justify-content-around">
        <a href="/css/assets/gallery/14.jpg" data-lightbox="photos">
          <img src="/css/assets/gallery/14.jpg" alt="" class="fluid img-thumbnail" width="300px">
        </a>
      </div>
      <div class="col-sm-6 col-md-6 mb-3 ml-5 d-flex justify-content-around">
        <a href="/css/assets/gallery/15.jpeg" data-lightbox="photos">
          <img src="/css/assets/gallery/15.jpeg" alt="" class="fluid img-thumbnail" width="300px">
        </a>
      </div>
      <div class="col-sm-6 col-md-4 mb-3">
        <a href="/css/assets/gallery/10.jpeg" data-lightbox="photos">
          <img src="/css/assets/gallery/10.jpeg" alt="" class="fluid img-thumbnail">
        </a>
      </div>
      <div class="col-sm-6 col-md-4 mb-3">
        <a href="/css/assets/gallery/11.jpeg" data-lightbox="photos">
          <img src="/css/assets/gallery/11.jpeg" alt="" class="fluid img-thumbnail">
        </a>
      </div>
      <div class="col-sm-6 col-md-4 mb-3">
        <a href="/css/assets/gallery/12.jpeg" data-lightbox="photos">
          <img src="/css/assets/gallery/12.jpeg" alt="" class="fluid img-thumbnail">
        </a>
      </div>
        </div>
      </div>
    </div>
    </div>
    `
  }
}


d.addEventListener("DOMContentLoaded", lenguajes())
w.addEventListener("load", changeMenu());