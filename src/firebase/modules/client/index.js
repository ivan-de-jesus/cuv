import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { v4 as uuid } from 'uuid';

export default {

    create(collection, data, idDoc) {
        return new Promise((resolve, reject) => {
            var query;
            if (idDoc) {
                query = firebase.firestore().collection(collection).doc(idDoc).set(data);
            } else {
                query = firebase.firestore().collection(collection).add(data);
            }

            query.then(() => {
                resolve()
            })
                .catch(function (error) {
                    reject(error)
                });
        })

    },
    delete(collection, doc) {
        return new Promise((resolve, reject) => {

            //firebase.firestore().collection(collection).where()

            firebase.firestore().collection(collection).doc(doc).delete()
                .then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                });
        })
    },
    update(collection, doc, data) {

        console.log(data)

        return new Promise((resolve, reject) => {

            firebase.firestore().collection(collection).doc(doc).update(data)
                .then(() => {
                    resolve()
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                });
        })

    },
    getOnce(collection, doc) {

        return new Promise((resolve, reject) => {
            var docRef = firebase.firestore().collection(collection).doc(doc);

            docRef.get().then(function (docResponse) {
                if (docResponse.exists) {
                    resolve(docResponse.data());
                } else {
                    reject({});
                }
            }).catch(function (error) {
                reject(error);
            });
        })
    },

    getOnceVIN(collection, vin) {
        return new Promise((resolve, reject) => {
            var docRef = firebase.firestore().collection(collection)
                .where("vin", "==", vin);

            docRef.get()
                .then(function (querySnapshot) {
                    resolve(querySnapshot);
                }).catch(function (error) {
                    reject(error);
                });
        })
    },

    getOncePlate(collection, plate) {
        return new Promise((resolve, reject) => {
            var docRef = firebase.firestore().collection(collection)
                .where("plate", "==", plate);

            docRef.get()
                .then(function (querySnapshot) {
                    resolve(querySnapshot);
                }).catch(function (error) {
                    reject(error);
                });
        })
    },

    getOnceUser(email) {
        return new Promise((resolve, reject) => {
            const docRef = firebase.firestore().collection("users")
                .where("email", "==", email);

            docRef.get()
                .then(function (querySnapshot) {
                    resolve(querySnapshot);
                }).catch(function (error) {
                    reject(error);
                });
        })
    },


    getQuickAccessCards() {
        return new Promise(resolve => {
            const userRef = firebase.firestore().collection("users");
            const vehicleRef = firebase.firestore().collection("vehicles");

            var meeting, user, vehicle;

            userRef.orderBy("name", "desc").limit(1).get()
                .then(function (querySnapshot) {

                    querySnapshot.docs.forEach(function (doc) {
                        user = (doc.data())
                    });

                    vehicleRef.orderBy("createdAt", "desc")
                        .limit(1)
                        .get()
                        .then(querySnapshot => {
                            //vehicle = querySnapshot.docs.reverse()[0].data();
                            querySnapshot.docs.reverse().forEach(doc => {
                                vehicle = doc.data();
                            });
                        });

                    var meetingRef = firebase.firestore().collection("meetings");

                    meetingRef.orderBy("user", "desc").limit(1).get()
                        .then(function (querySnapshot) {

                            querySnapshot.docs.forEach(function (doc) {
                                meeting = (doc.data())
                            });

                            resolve({
                                user,
                                meeting,
                                vehicle
                            })


                        })
                        .catch(function (error) {
                            console.log("Error getting documents: ", error);
                        });


                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });

            // userRef.orderBy("name", "desc").limit(1).then(response => {
            //     console.log(response);
            //     resolve(response)
            // })
        });
    },

    getQuickAccessCardsById(userId) {
        return new Promise(resolve => {
            let meeting, user, vehicle;

            const userRef = firebase.firestore().collection("users");
            const vehicleRef = firebase.firestore().collection("vehicles");
            const meetingRef = firebase.firestore().collection("meetings");

            userRef
                .where("members", "array-contains", userId)
                .orderBy("createdAt", "desc")
                .limit(1)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        let id = doc.id;
                        user = doc.data();
                        user.id = id;
                    });

                    vehicleRef
                        .where("members", "array-contains", userId)
                        .orderBy("createdAt", "desc")
                        .limit(1)
                        .get()
                        .then(querySnapshot => querySnapshot.docs.forEach(doc => {
                            let id = doc.id;
                            vehicle = doc.data();
                            vehicle.id = id;
                        }));


                    meetingRef
                        .where("members", "array-contains", userId)
                        .orderBy("date", "desc")
                        .limit(1)
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.docs.forEach(doc => {
                                let id = doc.id;
                                meeting = doc.data();
                                meeting.id = id;
                            });
                            resolve({ user, meeting, vehicle });
                        })
                        .catch(error => console.error("Error getting documents: ", error));
                })
                .catch(error => console.error("Error getting documents: ", error));
        })
    },
    uploadImage(file, uid) {
        return new Promise((resolve, reject) => {
            const imgType = file.type.split("/")[1];

            console.log(file)
            console.log(imgType, uid)

            const storageRef = firebase.storage().ref();
            const ref = storageRef.child(`${uuid()}.${imgType}`);
            const uploadTask = ref.put(file);

            uploadTask.on('state_changed',
                () => { },
                error => {
                    reject(error);
                },
                () => {
                    uploadTask.snapshot.ref.
                        getDownloadURL().then((downloadURL) => {
                            resolve(downloadURL);
                        });
                });
            // .then(response => {
            //     resolve(response);
            // }).catch(error => reject(error))
        })
    },

    getStorage() {
        return firebase.storage().ref()
    },


    getProcess(vehicleId) {
        return new Promise(((resolve, reject) => {
            firebase.firestore()
                .collection("processes")
                .where("vehicle", "==", vehicleId)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(item => {
                        let data = item.data();
                        resolve(data);
                    });
                })
                .catch(err => reject(err));
        }));
    },

    getVehicle(vehicleId) {
        return new Promise(((resolve, reject) => {
            firebase.firestore()
                .collection("vehicles")
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(item => {
                        if (item.id === vehicleId) {
                            let data = item.data();
                            resolve(data);
                        }
                    });
                })
                .catch(err => reject(err));
        }));
    },


    getProccesById(vehicleId) {
        return new Promise(((resolve, reject) => {
            firebase.firestore()
                .collection("processes")
                .where("vehicle", "==", vehicleId)
                .get()
                .then(querySnapshot => {
                    let arr = [];
                    querySnapshot.docs.forEach(doc => {
                        arr.push(doc.data());
                    });
                    resolve(arr)
                })
                .catch(err => reject(err));
        }));
    },

    raw() {
        return firebase.firestore();
    },

    genTimestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    },

    // valuation

    valuation: {
        getProcesses(vehicleId) {
            return new Promise((resolve) => {

                var processes = [];

                var processesRef = firebase.firestore().collection("processes");
                processesRef.where("vehicle", "==", vehicleId).orderBy("timestamp", "desc")

                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {

                            processes.push({
                                id: doc.id,
                                ...doc.data()
                            })
                        });
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });

                resolve(processes);

            })
        }
    },

    getFirestore() {
        return firebase.firestore;
    }

}