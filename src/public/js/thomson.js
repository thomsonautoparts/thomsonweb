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
        <a class="nav-link active" aria-current="page" href="thomson">Home</a>
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
    if (localStorage.length > 0) {
      localStorage.setItem("Lenguajes", "Spanish");
      location.reload();
    } else {
      localStorage.setItem("Lenguajes", "Spanish");
      location.reload();
    }
  }
  if (e.target.textContent == "English") {
    if (localStorage.length > 0) {
      localStorage.setItem("Lenguajes", "English");
      location.reload();
    } else {
      localStorage.setItem("Lenguajes", "English");
      location.reload();
    }
  }
  if (e.target.textContent == "Español") {
    if (localStorage.length > 0) {
      localStorage.setItem("Lenguajes", "Spanish");
      location.reload();
    } else {
      localStorage.setItem("Lenguajes", "Spanish");
      location.reload();
    }
  }
  if (e.target.textContent == "Ingles") {
    if (localStorage.length > 0) {
      localStorage.setItem("Lenguajes", "English");
      location.reload();
    } else {
      localStorage.setItem("Lenguajes", "English");
      location.reload();
    }
  }
  //location.reload();
});

//Funcion que cambia el idioma
const lenguajes = () => {
  if (localStorage.getItem("Lenguajes") == "Spanish") {
    d.getElementById("HTML").setAttribute("lang", "es");
    //barra de navegacion
    d.getElementById(
      "header"
    ).innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a href="thomson">
        <img src="/css/assets/logo.png" alt="LOGO" id="logo" class="img-fluid" />
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
            <a class="nav-link active h5" aria-current="page" href="thomson">Inicio</a>
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



    `;
    //Contenido

    $main.innerHTML = `<div id="myCarousel" class="carousel" data-bs-ride="carousel">
    <ol class="carousel-indicators">
      <li data-bs-target="#myCarousel" data-bs-slide-to="0" class="active"></li>
      <li data-bs-target="#myCarousel" data-bs-slide-to="1"></li>
      <li data-bs-target="#myCarousel" data-bs-slide-to="2"></li>
      <li data-bs-target="#myCarousel" data-bs-slide-to="2"></li>

    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="/css/assets/carousel_1.jpg" class="carousel_image" alt="">
        <div class="container">
          <div class="carousel-caption text-start text-light dark3">
            <h1 class="title">ORIGINAL THOMSON</h1>
            <p class="carousel-text content">Los Original Thomson serán los encargados de dar lo mejor
            en lo que a amortiguadores se refiere, permitiendoles tener un control total del vehículo.</p>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <img src="/css/assets/carousel_2.jpg" class="carousel_image" alt="">

        <div class="container">
          <div class="carousel-caption text-light dark3">
            <h1 class="title">PRO-THOMSON</h1>
            <p class="carousel-text content">Los amortiguadores Pro-Thomson están diseñados para trabajos pesados, duros y para condiciones que
            exigen más peso y golpes fuertes. </p>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <img src="/css/assets/carousel_4.jpg" class="carousel_image" alt="">

        <div class="container">
          <div class="carousel-caption text-light dark3">
            <h1 class="title">THOMSON HEAVY DUTY</h1>
            <p class="carousel-text content">Amortiguadores monotubo con la mejor tecnología, lo que le confiere una gran fuerza
             y resistencia.</p>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <img src="/css/assets/carousel_3.jpg" class="carousel_image" alt="">

        <div class="container">
          <div class="carousel-caption text-end text-light dark3 w-75">
            <h1 class="title">THOMSON TRUCK-PLUS</h1>
            <p class="carousel-text content">
            Diseñado para camionetas que no tienen como destino un camino llano, para todos aquellos que salen de los caminos 
            convencionales y entran en unos más complicados donde solo una camioneta podría estar.</p>
          </div>
        </div>
      </div>
    </div>
    <a class="carousel-control-prev" href="#myCarousel" role="button" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </a>
    <a class="carousel-control-next" href="#myCarousel" role="button" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </a>
  </div>
  <!--Content-->
  <div class="container mt-4">
    <h1 class="text-center bg-warning text-dark">Nuestros certificados de calidad.</h1>

    <!-- Three columns of text below the carousel -->
    <div class="row">
      <div class="col-lg-4 px-2">
        <img src="/css/assets/certicado_1.png" alt="" class="mx-auto d-block mt-4 mb-4">
        <h2 class="text-center">Certificado ISO 9001</h2>
        <p class="text-center ml-2 mr-2 lead">ISO 9001 establece los criterios para un sistema de gestión de la calidad. 
        Este estándar se basa en una serie de principios de gestión de la calidad que incluyen un fuerte enfoque en el cliente, 
        la motivación y la implicación de la alta dirección, el enfoque de procesos y la mejora continua.</p>

      </div><!-- /.col-lg-4 -->
      <div class="col-lg-4 px-2">
        <img src="/css/assets/certicado_2.png" alt="" class="mx-auto d-block mt-4 mb-4">
        <h2 class="h3 text-center">Certificado OE SUPPLIER.</h2>
        <p class="text-center ml-2 mr-2 lead">Una pieza de automóvil OE se refiere a cualquier pieza de automóvil instalada en un vehículo de producción/fábrica.
         Se refiere a cualquier pieza que se instaló originalmente en el vehículo. Nuestros productos Thomson estan certificados
         para ser el reemplazo de las piezas originales de fabirca. </p><br>

      </div><!-- /.col-lg-4 -->
      <div class="col-lg-4 px-2">
        <img src="/css/assets/certicado_3.png" alt="" class="mx-auto d-block mt-4 mb-4">
        <h2 class="text-center ">Certificado TS 16949.</h2>
        <p class="text-center ml-2 mr-2 lead">TS 16949 es una especificación técnica ISO dirigida al desarrollo de un sistema 
        de gestión de calidad que proporciona una mejora continua, enfatizando la prevención de defectos y
        la reducción de variaciones y desperdicios en la cadena de suministro y producción de la industria automotriz.</p>

      </div><!-- /.col-lg-4 -->
    </div><!-- /.row -->


    <!-- START THE FEATURETTES -->

  </div><!-- /.container -->
  <div class="container">
    <hr class="featurette-divider">
    <section class="flex-container">
      <article class="flex-item">
        <h3 class="text-center">Alta calidad.</h3>
        <p class="lead text-left">
        Nuestra marca cuenta con múltiples certificaciones que la convierten en una de las mejores del mercado. 
        Nuestros productos son piezas originales, que sustituyen a las piezas de fábrica de los coches.
        </p>
      </article>
      <article class="flex-item">
        <img src="/css/assets/example_2.jpg" alt="imagen" class="image-index mx-auto d-block mt-4 mb-4">
      </article>

    </section>
    <hr class="featurette-divider">
    <section class="flex-container flex-row-reverse">
      <article class="flex-item">
        <h3 class="text-center">Variedad de amoritguadores.</h3>
        <p class="lead text-right">
        Disponemos de múltiples variedades de amortiguadores, para todo tipo de vehículos.
         Desde Amortiguadores para el camión más pesado, con Thomson Truck-plus, hasta para automóviles más 
         convencionales con el Original Thomson y muchos más.
        </p>
      </article>
      <article class="flex-item">
        <img src="/css/assets/example_3.jpg" alt="imagen" class="image-index mx-auto d-block mt-4 mb-4">
      </article>

    </section>
    <hr class="featurette-divider">

    <section class="flex-container">
      <article class="flex-item">
        <h3 class="text-center">Nuestras bases y boots.</h3>
        <p class="lead text-left">Contamos con las bases y los boots específicos para cada modelo de amortiguador y auto, 
        por lo cual no te tendrás que preocupar por eso a la hora de elegir el mejor amortiguador Thomson.  
        </p>
        <a href="catalogue.html" class="text-decoration-none"><button class="btn btn-secondary btn-center">IR AL CATALOGO</button></a>
      </article>
      <article class="flex-item">
        <img src="/css/assets/example_4.jpg" alt="imagen" class="image-index mx-auto d-block mt-4 mb-4">
      </article>

    </section>


  </div>

    `;
  }
};

d.addEventListener("DOMContentLoaded", lenguajes());
w.addEventListener("load", changeMenu());
