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
          class="nav-link active dropdown-toggle"
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
              class="nav-link h5 active dropdown-toggle"
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

    $main.innerHTML = `

   
    <div id="myCarousel" class="carousel" data-bs-ride="carousel">
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="/css/assets/carousel_2.jpg" class="carousel_image zoom-efect" alt="">
            <div class="container">
                <div class="carousel-caption text-start text-light">
                    <h1 id="title">PRO-THOMSON</h1>
                </div>
            </div>
        </div>
    </div>
</div>
 <!--Content-->

 <div class="container mt-4">
  <h2 class="text-center">Descripción del producto</h2>

  <!-- Three columns of text below the carousel -->
  <div class="container mt-4">
    <div class="row">
    <div class="col-lg-4 px-2">
      <img class="rounded mx-auto d-block" src="/css/assets/guia.png" alt="">
      <h2 class="text-center bg-warning text-dark mt-1">Establidad</h2>
      <p class="lead" >Los Pro-thomson logran la estabilidad que se logró al fabricar el vehículo, con las mejores válvulas de amortiguación internas que ayudan a restablecer el manejo. Esto es muy importante para lograr el perfecto funcionamiento de las otras partes del automóvil.</p>
    </div><!-- /.col-lg-4 px-4 -->
    <div class="col-lg-4 px-2">
      <img class="rounded mx-auto d-block" src="/css/assets/guia_8.png" alt="">        
      <h2 class="text-center bg-warning text-dark mt-1">Mejores características</h2>
      <p class="lead">Los amortiguadores Pro-thomson obtienen mejores estadísticas de amortiguación que los diseños convencionales. Proporciona hasta un 35% de amortiguación que otros diseños convencionales. Lo hace uno de los mejores del mercado.</p>
    </div><!-- /.col-lg-4 px-4 -->
    <div class="col-lg-4 px-2">
      <img class="rounded mx-auto d-block" src="/css/assets/guia_7.png" alt="">        
      <h2 class="text-center bg-warning text-dark mt-1">Dirección</h2>
      <p class="lead">Es posible que los amortiguadores usados, viejos y económicos no tengan la respuesta correcta cuando se trata de conducir el vehículo. Los amortiguadores Pro-thomson afirman ser los mejores amortiguadores de su tipo, con las mejores respuestas de dirección para un mejor control</p>
    </div><!-- /.col-lg-4 px-4 -->
  </div><!-- /.row -->
</div>

  <div class="container mt-4">
    <div class="row">
      <div class="col-lg-4 px-2">
        <img class="rounded mx-auto d-block" src="/css/assets/guia_9.png" alt="">
        <h2 class="text-center bg-warning text-dark mt-1">Todo en uno</h2>
        <p class="lead">Los amortiguadores Pro-thomson están diseñados para tener todo en un solo tubo, separando el gas del aceite para un mejor rendimiento y un mayor nivel de respuesta.</p>
      </div><!-- /.col-lg-4 px-4 -->
      <div class="col-lg-4 px-2">
        <img class="rounded mx-auto d-block" src="/css/assets/guia_10.png" alt="">        
        <h2 class="text-center bg-warning text-dark mt-1">Para los más grandes</h2>
        <p class="lead">Los amortiguadores Pro-thomson están diseñados para vehículos con llantas grandes y brindan una capacidad de amortiguación adicional en cada esquina; convirtiendolo en uno de los mejores amortiguadores del mercado para los más pesados. </p>
      </div><!-- /.col-lg-4 px-4 -->
      <div class="col-lg-4 px-2">
        <img class="rounded mx-auto d-block" src="/css/assets/guia_6.png" alt="">        
        <h2 class="text-center bg-warning text-dark mt-1">Reemplazo OE</h2>
        <p class="lead">Nuestra marca cuenta con múltiples certificados incluyendo "OE Supplier", 
        lo que garantiza que todos nuestros productos son originales y perfectos para
         reemplazar el que contiene el auto de fábrica.</p>
      </div><!-- /.col-lg-4 px-4 -->
    </div>
    </div><!-- /.row --> 


    <section id="image-product">
      <div class="d-flex flex-row mt-5">
          <p class="text-justify mx-auto lh-base lead">
          Los amortiguadores Pro-Thomson están diseñados para trabajos pesados ​​y duros, para condiciones que exigen más peso y golpes fuertes. El amortiguador Pro-Thomson es un amortiguador muy fuerte, diseñado especialmente para grandes camiones  o camionetas todo terreno, que van a estar en condiciones difíciles en la carretera. Con estos amortiguadores no hay camino que lo afecte, incluso si los caminos no son los convencionales <br> <br>

          El diseño de los Pro-thomson es un diseño ultra resistente, cuenta con una goma gruesa que protege el eje de los escombros o suciedad, descartando cualquier problema o falla que se pueda generar cuando se encuentran en condiciones duras. <br> <br>

          El amortiguador Pro-thomson está diseñado en un solo tubo, siendo superior a los amortiguadores convencionales de dos tubos. Es un amortiguador de gas de alta presión que incluye un solo cilindro que se divide en dos cámaras, una llena de gas presurizado y la otra superior con fluido hidráulico. El gas y el aceite están separados por un pistón flotante que evita cualquier tipo de aireación o cavitación, y un conjunto de válvulas de pistón que se conecta al vástago que se encuentra en la parte fluida del tubo. Esta tecnología convierte a los amortiguadores Pro-thomson en uno de los mejores de su tipo, evitando muchas fallas y problemas que suelen tener los amortiguadores convencionales de dos tubos.
          </p>
          <img src="/css/assets/pro-thomson.png" width="500px" height="500px" alt="">  
        </div>
  </section>
</div>
    `
  }
};


d.addEventListener("DOMContentLoaded", lenguajes())
w.addEventListener("load", changeMenu());