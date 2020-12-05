import firebase from "@/firebase";

export default {
    methods: {
        async createIonicAlert(header, message) {
            const alert = await this.$ionic.alertController.create({
                header,
                message,
                buttons: ["Aceptar"]
            });

            return alert.present();
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


    }
};