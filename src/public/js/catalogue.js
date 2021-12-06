const d = document,
$ProductType = d.getElementById("ProductType"),
  $VehicleType = d.getElementById("VehicleType"),
  $Mark = d.getElementById("Mark"),
  $Model = d.getElementById("Model"),
  $Year = d.getElementById("Year"),
  $Table = d.getElementById("table"),
  $Code = d.getElementById("Code"),
  $Description = d.getElementById("Description"),
  $Submit = d.getElementById("submit");
  const spinner = document.getElementById("spinner");
  let idResultado




/*----Idioma---*/
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
        <a class="nav-link active" href="catalogue">Catalogue</a>
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
            <a class="nav-link h5 active" href="catalogue">Catálogo</a>
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
            >Galeria</a
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
            ><img src="/css/assets/world.png" width="35px" heigh="35px">Idiomas</a
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

  }
}


d.addEventListener("DOMContentLoaded", lenguajes())
w.addEventListener("load", changeMenu());





//fetch para rellenar Tipo de vehiculo


const type = async (data) => {
  return await fetch("/facturacion/vehicle", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => { 
      let vehicle = []      

      for(i=0 ; i< response.length; i++) {
        vehicle.push(response[i].TipoVehiculo)
      }

      let result = vehicle.filter((item, index) => {
        return vehicle.indexOf(item)  === index
      })

      let options = `<option value="0">--Select a vehicle--</option>`
        for(i=0 ; i < result.length; i++){
          
          options += `<option value="${result[i]}" style="color:white !important;">${result[i]}</option>`
        }
        $VehicleType.innerHTML = options
    })
    .catch(error => console.dir(error));
};


$ProductType.onchange = () => {


    const Producto = {
      TipoProducto : $ProductType.value
    } 

    $VehicleType.innerHTML = `<option value="0">--Select a vehicle--</option>`
    $Model.innerHTML = `<option value="0">--Select a model--</option>`
    $Year.innerHTML = `<option value="0">--Select a year--</option>`
    $Mark.innerHTML = `<option value="0">--Select a Mark--</option>`
    type(Producto)
    
}

//fetch para rellenar marca
const mark = async (data) => {
  return await fetch("/facturacion/mark", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {

      let mark = []      

      for(i=0 ; i< response.length; i++) {
        mark.push(response[i].Mark)
      }
      let result = mark.filter((item, index) => {
        return mark.indexOf(item)  === index
      })

      let options = `<option value="0">--Select a mark--</option>`
        for(i=0 ; i < result.length; i++){ 
          
          options += `<option value="${result[i]}" style="color:white !important;">${result[i]}</option>`
        }
        $Mark.innerHTML = options
    })
    .catch(error => console.dir(error));
};

$VehicleType.onchange = () => {

    const VehicleType = {
      Type : $VehicleType.value,
      TipoProducto : $ProductType.value
    } 

    $Model.innerHTML = `<option value="0">--Select a model--</option>`
    $Year.innerHTML = `<option value="0">--Select a year--</option>`
    $Mark.innerHTML = `<option value="0">--Select a Mark--</option>`
    mark(VehicleType)
    
}
//fetch para rellenar modelo 
const model = async (data) => {
  return await fetch("/facturacion/model", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      let model = []      

      for(i=0 ; i< response.length; i++) {
        model.push(response[i].Model)
      }

      let result = model.filter((item, index) => {
        return model.indexOf(item)  === index
      })


      let options = `<option value="0">--Select a model--</option>`

      for(i=0 ; i < result.length; i++){
          
        options += `<option value="${result[i]}"style="color:white !important;">${result[i]}</option>`
      }
      $Model.innerHTML = options
    })
    .catch(error => console.dir(error));
};


$Mark.onchange = () => {
  
  const Mark = {
    Type : $VehicleType.value,
    TipoProducto : $ProductType.value,
    Mark : $Mark.value
  }
  $Model.innerHTML = `<option value="0">--Select a model--</option>`
  $Year.innerHTML = `<option value="0">--Select a year--</option>`
  model(Mark)
}


//fetch para rellenar Año 

const year = async (data) => {
  return await fetch("/facturacion/year", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      let year = []      
      const id = []
      
      for(i=0 ; i< response[0].length; i++) {
        year.push(response[0][i].Year)
      }

      let result = year.filter((item, index) => {
        return year.indexOf(item)  === index
      })

      //id
      for(x=0 ; x< response[0].length; x++) {
        id.push(response[1][x].Id)
      }

      let resultado = id.filter((item, index) => {
        return id.indexOf(item)  === index
      })
      
      idResultado = resultado


      let options = `<option value="0">--Select a year--</option>`

      for(i=0 ; i < result.length; i++){
          
        options += `<option value="${result[i]}"  style="color:white !important;">${result[i]}</option>`
      }
      
      $Year.innerHTML = options
      
    })
    .catch(error => console.dir(error));
};


$Model.onchange = () => {
  
  const Model = {
    Type : $VehicleType.value,
    TipoProducto : $ProductType.value,
    Mark : $Mark.value,
    Model : $Model.value
  }
  
  $Year.innerHTML = `<option value="0">--Select a year--</option>`
  year(Model)

}


//Enviar la consulta completa al servidor

const Product = async (data) => {
  return await fetch("/facturacion/catalogue", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {

      
      $Table.innerHTML = `
      <table class="table table-hover table-responsive mb-5">
      <thead class="bg-warning">
          <tr>
              <th class="text-dark text-center h4">Image</th>
              <th class="text-dark text-center h4">Code</th>
              <th class="text-dark text-center h4">Homologous code</th>
              <th class="text-dark text-center h4">Aplication</th>
              <th class="text-dark text-center h4">Name</th>
              <th class="text-dark text-center h4">Year</th>
              <th class="text-dark text-center h4">Position</th>

          </tr>
      </thead>
      <tbody id="tbody">
      </tbody>
  </table>  
      `
       for(i=0; i< response.length ; i++) {
         let line = `
         <tr class="bg-lightWarning">
          <th class="text-dark text-center h5">
          <a href="/css/assets/catalogo/${response[i].NombreImagen}.jpeg" data-lightbox="photos">
          <img src="/css/assets/catalogo/${response[i].NombreImagen}.jpeg" alt="" width="150px" height="150px" class="img-fluid">
        </a>
          </th>
          <td class="text-dark text-center h5 pt-5">${response[i].CodigoT}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].CodigoG}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Modelo}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Nombre}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Año}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Posicion}</td>
         </tr>
         `
         d.getElementById("tbody").innerHTML += line 
       } 
            
    })
    .catch(error => console.dir(error));
};

$Year.onchange = () => {
  if( (($ProductType.value != 0 && $VehicleType.value != 0) && ($Mark.value != 0  && $Model.value != 0)) &&  $Year.value != 0){

    const Desde = $Year.value.substr(0,4)
    const Hasta = $Year.value.substr(5,7)

    const producto = {
      TipoProducto : $ProductType.value,
      TipoVehiculo : $VehicleType.value,
      Marca : $Mark.value,
      Modelo : $Model.value,
      Desde : Desde,
      Hasta : Hasta,
      _id: idResultado
    }
    $Table.innerHTML = ``
    Product(producto)
  }
}




//Search de code y description


const search = async (data) => {

  spinner.removeAttribute('hidden')

  return await fetch("/search", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      spinner.setAttribute('hidden', '');
     
      $Table.innerHTML = `
      <table class="table table-hover table-responsive mb-5">
      <thead class="bg-warning">
          <tr>
              <th class="text-dark text-center h4">Image</th>
              <th class="text-dark text-center h4">Code</th>
              <th class="text-dark text-center h4">Homologous code</th>
              <th class="text-dark text-center h4">Aplication</th>
              <th class="text-dark text-center h4">Name</th>
              <th class="text-dark text-center h4">Year</th>
              <th class="text-dark text-center h4">Position</th>

          </tr>
      </thead>
      <tbody id="tbody">
      </tbody>
  </table>  
      `
       for(i=0; i< response.length ; i++) {
         let line = `
         <tr class="bg-lightWarning">
          <th class="text-dark text-center h5">
            <a href="/css/assets/catalogo/${response[i].NombreImagen}.jpeg" data-lightbox="photos">
              <img src="/css/assets/catalogo/${response[i].NombreImagen}.jpeg" alt="" width="150px" height="150px" class="img-fluid">
            </a>
          </th>
          <td class="text-dark text-center h5 pt-5">${response[i].CodigoT}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].CodigoG}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Modelo}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Nombre}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Año}</td>
          <td class="text-dark text-center h5 pt-5">${response[i].Posicion}</td>
         </tr>
         `
         d.getElementById("tbody").innerHTML += line 
       } 
        
            
    })
    .catch(error => console.dir(error));
};




$Submit.onclick = (e) => {
  e.preventDefault()
  if((!$Code.value) && (!$Description.value)){
    alert("You must enter a value")
  }else{
    const consulta = {
      Code: $Code.value.toUpperCase() ,
      Description: $Description.value.toUpperCase()
    } 

    search(consulta)
  }
}