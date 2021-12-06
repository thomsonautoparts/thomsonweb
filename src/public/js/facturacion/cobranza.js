const d = document
        const $facturas = d.getElementById("Factura")
        const $Cliente = d.getElementById("Cliente")
        const $PendienteAPagar = d.getElementById("PendienteAPagar")
        const $Pagar = d.getElementById("Pagar")


        const solicitarInfoFactura = async (data) => {
            return await fetch("/solicitar-info-factura-registrar-pago", {
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
                console.log(response)
                $PendienteAPagar.value = response

            })
        }
        const solicitarInfoCliente = async (data) => {
            return await fetch("/solicitar-info-cliente-registrar-pago", {
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
                $facturas.innerHTML = `<option value="0">--SELECCIONE FACTURA--</option>`
                for(i=0; i < response.length; i++){
                let option = `<option value="${response[i].Numero}">${response[i].Numero}</option>`
                $facturas.innerHTML += option
                }

            })
        }

        $Cliente.onchange = () => {
        $PendienteAPagar.value = 0
            if($Cliente.value != 0){
                let data = {
                    Cliente : $Cliente.value
                }

                solicitarInfoCliente(data)
            }
        }
        $facturas.onchange = () => {
        $PendienteAPagar.value = 0
            if( $facturas.value != 0){
                let data = {
                    Numero :  $facturas.value
                }

                solicitarInfoFactura(data)
            }
        }

        document.addEventListener("keydown", e => {
            if(e.keyCode == 120 ){
                window.open('/facturacion/acceso-directo-stock', 'Stock', "width=1400, heigh=100%")
            }
        })
$(document).ready(function () {
  $(".js-exam").select2();
});
