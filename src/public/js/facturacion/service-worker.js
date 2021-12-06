console.log("Service wokrer")

self.addEventListener('push',e => {
    const data = e.data.json()
    console.log("Serviceee")
    console.log(data)
})