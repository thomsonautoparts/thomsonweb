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
  if (e.target.textContent == "Espa??ol") {
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
            <a class="nav-link h5" href="catalogue">Cat??logo</a>
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
            <a class="nav-link h5" href="Guarentee">Garant??as</a>
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
            >Galer??a</a
          >
          <ul class="dropdown-menu dark2" aria-labelledby="navbarDropdown">
            <a class="download dropdown-item text-light" href="production">
              <p class="name_product">Producci??n</p>
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
              <p class="name_product">Espa??ol</p>
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
            <img src="/css/assets/carousel_1.jpg"  class="carousel_image zoom-efect" alt="">
            <div class="container">
              <div class="carousel-caption text-start text-light">
                <h1 id="title">ORIGINAL THOMSON</h1>
              </div>
            </div>
          </div>
        </div>
    </div>

  <!--Content-->

    <div class="container mt-4">
        <h2 class="text-center">Descripci??n del producto:</h2>

        <!-- Three columns of text below the carousel -->
    
              <div class="container mt-4">
                <div class="row">
                  <div class="col-lg-4 px-2">
                    <img src="/css/assets/guia.png" alt="" class="mx-auto d-block mt-4 mb-4">
                    <h2 class="text-center bg-warning text-dark mt-1">Estabilidad.</h2>
                    <p class="text-start lead">Los Original Thomson logran la estabilidad que se obtuvo al fabricar
                    el veh??culo, con las mejores v??lvulas de amortiguaci??n internas que ayudan a restablecer el manejo. 
                    Esto es muy importante para lograr el perfecto funcionamiento de las otras autopartes del autom??vil.</p>
                  </div><!-- /.col-lg-4 -->
                  <div class="col-lg-4 px-2">
                    <img src="/css/assets/guia_2.png" alt="" class="mx-auto d-block mt-4 mb-4">        
                    <h2 class="text-center bg-warning text-dark mt-1">Partes electr??nicas.</h2>
                    <p class="lead">Los amortiguadores gastados, viejos o econ??micos no tienen la amortiguaci??n necesaria
                    para que los sistemas electr??nicos de seguridad, estabilidad y frenado autom??tico funcionen
                    correctamente. Original Thomson asegura la mejor amortiguaci??n para lograr el perfecto
                    funcionamiento de todas las partes electr??nicas y mec??nicas. </p>
                  </div><!-- /.col-lg-4 -->
                  <div class="col-lg-4 px-2">
                    <img src="/css/assets/guia_3.png" alt="" class="mx-auto d-block mt-4 mb-4">         
                    <h2 class="text-center bg-warning text-dark mt-1">Control de nuem??ticos.</h2>
                      <p class="lead">Los Original Thomson garantizan el mejor rendimiento que pueden lograr los amortiguadores.
                       Los amortiguadores, viejos, gastados o baratos, no tienen la capacidad necesaria para controlar 
                       el neum??tico y mantener su rendimiento, generando mucho movimiento del mismo y reduciendo su vida ??til.</p>
                  </div><!-- /.col-lg-4 -->
                </div><!-- /.row -->
            </div>
    
              <div class="container mt-4">
                <div class="row">
                  <div class="col-lg-4 px-2">
                    <img src="/css/assets/guia_4.png" alt="" class="mx-auto d-block mt-4 mb-4">
                    <h2 class="text-center bg-warning text-dark mt-1">Perfecto balance.</h2>
                    <p class="lead">Los amortiguadores gastados, viejos y econ??micos no brindan 
                    suficiente amortiguaci??n para mantener el veh??culo en equilibrio.  
                     Los amortiguadores Original Thomson aseguran el perfecto equilibrio del veh??culo al
                    tener una de las mejores amortiguaciones del mercado.</p>
                  </div><!-- /.col-lg-4 -->
                  <div class="col-lg-4 px-2">
                    <img src="/css/assets/guia_5.png" alt="" class="mx-auto d-block mt-4 mb-4">        
                    <h2 class="text-center bg-warning text-dark mt-1">Correcta alineaci??n.</h2>
                    <p class="lead">La fuerza de los Original Thomson es fundamental para mantener la alineaci??n adecuada de los neum??ticos. 
                    Los amortiguadores tienen una excelente resistencia y soporte, lo que asegura una perfecta alineaci??n de los neum??ticos.</p>
                  </div><!-- /.col-lg-4 -->
                  <div class="col-lg-4 px-2">
                    <img src="/css/assets/guia_6.png" alt="" class="mx-auto d-block mt-4 mb-4">         
                    <h2 class="text-center bg-warning text-dark mt-1">Reemplazo OE.</h2>
                    <p class="lead">Nuestra marca cuenta con m??ltiples certificados incluyendo "OE Supplier", 
                    lo que garantiza que todos nuestros productos son originales y perfectos para
                     reemplazar el que contiene el auto de f??brica.</p>
                  </div><!-- /.col-lg-4 -->
                </div><!-- /.row -->      
            </div>
            
          <section id="image-product">
              <div class="d-flex flex-row mt-5">
                  <p class="text-left mr-4 lh-base lead">
                  Los Thomson originales ser??n los encargados de dar lo mejor en lo que a amortiguadores se refiere, 
                  permitiendo tener un control total del veh??culo, adem??s de permitir el correcto funcionamiento del
                  resto de las partes del mismo, ya que los amortiguadores antiguos, muy econ??micos o deteriorados,
                  ponen en riesgo al resto de los componentes como los neum??ticos, ya que al no tener un buen amortiguador
                  para soportar el peso del veh??culo se genera mucho movimiento desalineando los neum??ticos, provocando
                  que se desgasten r??pidamente, disminuyendo considerablemente su duraci??n. Adem??s de los neum??ticos,
                  son muchas las partes electr??nicas y mec??nicas del veh??culo que dependen del correcto funcionamiento
                  de los amortiguadores, sin un buen amortiguador ponemos en riesgo la vida ??til de las dem??s partes.
                  Con Thomson original estos problemas se dejar??n de lado ya que aseguran un perfecto funcionamiento,
                  tienen la fuerza suficiente para mantener el peso del veh??culo en cualquier situaci??n, as?? como tambi??n 
                  mantener las ruedas en perfecta alineaci??n y conseguir la perfecta estabilidad del coche. <br> <br>

                  Original Thomson cuenta con m??ltiples certificados. Certificado de calidad, certificados de mejora
                  continua de amortiguadores, as?? como el certificado de ???OE Supplier???, que establece que el producto
                  tiene suficiente calidad y credibilidad para ser un reemplazo de las piezas originales que vienen en 
                  el veh??culo de f??brica.  <br> <br>

                  Gracias al esfuerzo diario que damos a la mejora de los amortiguadores, podemos decir que los amortiguadores
                  Thomson se encuentran entre los mejores del mercado, dando a los clientes que obtienen nuestros productos
                  suficiente confianza, calidad y durabilidad.  <br> <br>
                    
                  </p>
                  <img src="/css/assets/originalthomson.png"  width="600px" height="600px" alt="">
              </div>
              
          </section>
    </div>

    `
  }
};


d.addEventListener("DOMContentLoaded", lenguajes())
w.addEventListener("load", changeMenu());