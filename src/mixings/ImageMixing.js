import { v4 as uuid } from "uuid";
import firebase from "@/firebase";

export default {

    methods: {

        createUrlArray(fileArray) {
            try {
                const arrayUrls = [];

                for (const file of fileArray) {
                    file.source = this.createUrl(file);
                    const ext = this.getExtension(file.name);
                    arrayUrls.push(this.createFile(file, ext, file.source))
                }
                return arrayUrls;

            } catch (e) {
                console.log(e);
                return null;
            }
        },

        createUrl(file) {
            const nav = window.URL || window.webkitURL;
            console.log(nav)
            return nav.createObjectURL(file);
        },

        getExtension(filename) {
            return filename.split('.').pop();
        },

        createFile(file, ext, url) {
            const myFile = new File([file], `${uuid()}.${ext}`, {type: file.type});
            myFile.source = url;
            return myFile;
        },

        async createIonicAlert(header, message) {
            const alert = await this.$ionic.alertController.create({
                header,
                message,
                backdropDismiss: false,
                buttons: ["Aceptar"]
            });

            return alert.present();
        },

        async createVehicle(vin, data) {
            try {
                const docs = await firebase.client.getOnceVIN("vehicles", vin);

                if (docs.length > 0) {
                   return this.createIonicAlert(
                       "VIN Duplicado",
                       "El VIN que escribiste ya esta registrado en otro vehículo",
                   );
                } else {
                    return firebase.client.create("vehicles", data);
                }

            } catch (e) {
                console.log(`ERROR AL CREAR VEHICULO: ${e}`);
            }
        },

        async uploadImages(photos) {
            try {
                const URLS = [];
                const storage = firebase.client.getStorage();

                for (const photo of photos) {
                    if (photo.size < 10) {
                        URLS.push(photo.source);
                    } else {
                        const fileRef = storage.child(photo.name);
                        const imageUploaded = await fileRef.put(photo);
                        const url = await imageUploaded.ref.getDownloadURL();
                        URLS.push(url)
                    }
                }

                return URLS;

            } catch (e) {
                console.log(`ERROR SUBIENDO IMAGENES ${e}`);
            }
        },

        async createHistoric(vehicle, id, data) {
            console.log(data);

            try {
                await firebase.client.create("history", {
                    data: vehicle,
                    id: vehicle.id,
                    collection: "vehicles",
                    timestamp: firebase.client.genTimestamp()
                });

                await firebase.client.update("vehicles", id, data)

            } catch (e) {
                console.log(`ERROR CREANDO HISTORIAL ${e}`)
            }
        }
    }
}