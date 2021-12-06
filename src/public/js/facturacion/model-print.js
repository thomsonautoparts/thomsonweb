const d = document,
$contenidoTable = d.getElementById("contenido-table")

if(+$contenidoTable.clientHeight < 500) {
    console.log($contenidoTable.clientHeight)
    d.getElementById("footer").classList.add("fixed-bottom")
}

window.print()
