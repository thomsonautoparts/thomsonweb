const $div = document.getElementById("contenido");

const lenguajes = () =>{
    if(localStorage.getItem("Lenguajes") == "Spanish"){
        $div.innerHTML = `
        <form class="form-signin" action="/sign-in" method="POST">
        <img class="mb-4" src=".//css/assets/logo.png" alt="" width="300" height="60">
        <h1 class="h3 mb-3 font-weight-normal">Por favor, incia sesión.</h1>
        <label for="inputEmail" class="sr-only">Correo electronico:</label>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        </svg>
        <input type="email" id="inputEmail" class="form-control" placeholder="Email" name="email" required autofocus>
        <label for="inputPassword" class="sr-only">Contraseña</label>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        </svg>
        <input type="password" id="inputPassword" class="form-control" name="password" placeholder="Contraseña" required>
        <div class="checkbox mb-3">
          <div>
            <a href="/solicitud-recuperacion-contrasena" class="back_top h6 text-decoration-none">¿Olvidaste tu contraseña? Haz click aqui</a>
          </div>
          
        </div>
        <a href="">
          <button class="btn btn-secondary btn-block" type="submit">Iniciar</button> <br>
        </a>
      </form>
      <a href="register">
        <button class="btn btn-secondary btn-block" type="submit">Registrate aquí</button> <br><br>
      </a>
      <a href="thomson" class="back_top">Volver al inicio</a>
        `

    document.querySelector(".html").setAttribute("lang", "es")
    }
}
document.addEventListener("DOMContentLoaded", lenguajes())