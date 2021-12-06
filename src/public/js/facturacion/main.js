const PUBLIC_VAPID_KEY = 'BFoaDrHm6X4d8VfZRxLVPKauDVgIQ9ro97zoS_RwLo8FewGK-x2Hr4_ieXkCkSKvDeMtXnlcfL1AY64ej5StZFE'
const subscription = async () => {
    //service worker
        const suscripcion = await navigator.serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:  PUBLIC_VAPID_KEY

        })
 
        await fetch('/subscription',{
            method: 'POST',
            body: JSON.stringify(suscripcion),
            headers: {"Content-type": "application/json"}
        })
        console.log("si señor")
    }
    subscription()