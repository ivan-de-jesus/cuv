import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth";
import "firebase/analytics"

import store from "@/store";
import router from "@/router";

import modules from "./modules"

const firebaseConfig = {

    apiKey: "AIzaSyBOe7_xBUAp5VExG-1k7fAv0-IiJw9jnuc",
    authDomain: "cuv-managment.firebaseapp.com",
    databaseURL: "https://cuv-managment.firebaseio.com",
    projectId: "cuv-managment",
    storageBucket: "cuv-managment.appspot.com",
    messagingSenderId: "695421220038",
    appId: "1:695421220038:web:6b1d722b68a15372c293c7",
    measurementId: "G-ED96QMBDVG"

};


const observer = () => {
    if (firebase.apps.length) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {

                modules.client.getOnceUser(user.email)
                    .then((query) => {
                        const active = query.docs[0].data().active;
                        if (!active) {
                            console.log("te cerre la sesion");
                            modules.auth.logOut();
                        } else authProcess();
                    });

                const authProcess = () => {

                    firebase.firestore().collection("users").doc(user.uid)
                        .onSnapshot(function (doc) {
                            let data = doc.data();
                            data.uid = user.uid || user.id;
                            data.emailVerified = user.emailVerified;
                            store.commit("updateUser", data);
                            router.push({
                                name: "user/home"
                            });
                        });

                    // modules.client.getOnce("users", user.uid)
                    //     .then(data => {

                    //     })
                    //     .catch(err => console.log(err));
                }
            } else {
                router.push({
                    name: "main-page"
                });
            }
        });
    }
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics();
observer();



export default modules