import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import firebaseApp from "../../index"
import router from "../../../router";
import store from "../../../store";

export default {
	signUp(name, phone, email, password, lastname1, lastname2) {
		return new Promise((_, reject) => {
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password).then(() => {

					const data = {
						name,
						lastname1,
						lastname2,
						phone,
						email,
						active: false,
						type: "adviser",
						photoURL: "https://drogaspoliticacultura.net/wp-content/uploads/2017/09/placeholder-user.jpg"
					};

					firebase.auth().onAuthStateChanged(User => {
						if (User) {
							setTimeout(() => {
								User.sendEmailVerification()
									.then(() => console.log("[DONE] EMAIL SENDED"))
									.catch(e => console.log("[ERROR]" + e));

								User.updateProfile({
									displayName: data.name,
									photoURL: ""
								}).then(() => {

									firebaseApp
										.client
										.create("users", data, User.uid)
										.then(() => {
											console.log("[DONE] User Created", data)
											store.commit("updateUser", {
												uid: User.uid || User.id,
												...data
											});
										})
										.catch(e => console.log("[ERROR] " + e))
								}).catch(e => {
									console.log(e)
								});
							}, 2000);
						}
					});


					/*setTimeout(() => {
						var currentUser = firebase.auth().currentUser;
						currentUser.sendEmailVerification().then(function () {
							console.log("si");
						}).catch(error => {
							console.log(error);
						});
						this.updateProfile({
							displayName: name,
							phoneNumber: phone
						});
					}, 1000);*/

					router.push('/user/home')
						.then()
						.catch();

				}).catch(error => {
					reject(error)
				});
		})

	},

	signIn(email, password) {
		return new Promise((_, reject) => {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
				reject(error)
			});
		})
	},

	updateProfile(profile) {
		return new Promise((resolve, reject) => {
			var user = firebase.auth().currentUser;

			console.log(profile);

			const profileData = {};

			if (profile.displayName) profileData.displayName = profile.displayName
			if (profile.phoneNumber) profileData.phoneNumber = profile.phoneNumber
			if (profile.photoURL) profileData.photoURL = profile.photoURL
			if (profile.email) profileData.email = profile.email

			if (profileData.email !== user.email) {
				console.log("ES DIFERENTE")
				user.updateEmail(profileData.email)
					.then(() => user.sendEmailVerification())
					.catch(e => console.log(e));
			}

			user.updateProfile(profileData)
				.then(response => {
					console.log(response);

					var data = {}

					if (profile.email) data.email = profile.email
					if (profile.displayName) data.name = profile.displayName
					if (profile.phoneNumber) data.phone = profile.phoneNumber
					if (profile.photoURL) data.photoURL = profile.photoURL
					if (profile.lastname1) data.lastname1 = profile.lastname1
					if (profile.lastname2) data.lastname2 = profile.lastname2

					console.log(data);

					firebaseApp.client.update("users", user.uid, data).then(() => {
						resolve();
					})

				}).catch(function (error) {
					reject(error);
				});
		})
	},

	async updateUserProfile(profile) {
		const user = firebase.auth().currentUser;

		if (profile.email !== user.email) {
			console.log("aqui=")
			await user.updateEmail(profile.email)
			console.log("ERROR EMAIL?")
			await firebaseApp.client.update("users", user.uid, profile);
			location.reload();
			return;
		}
		profile.uid = profile.id || profile.uid
		store.commit("updateUser", profile);

		return firebaseApp.client.update("users", user.uid, profile)
	},

	async resendEmail() {
		const user = firebase.auth().currentUser;

		if (!user) {
			console.log("ESTA SESION VIENE VACIA NO HAY USUARIO");
			return null;
		}

		return user.sendEmailVerification();
	},

	logOut() {
		return new Promise((resolve, reject) => {
			firebase.auth().signOut().then(() => {
				resolve()
				store.resetuser();
			}).catch(() => {
				reject()
			});
		})
	},

	restorePassword(email) {
		return new Promise((resolve, reject) => {
			var auth = firebase.auth();
			var emailAddress = email;
			auth.sendPasswordResetEmail(emailAddress).then(function () {
				resolve()
			}).catch(function (error) {
				reject(error)
			});
		})
	},

	getCurrentUser() {
		return firebase.auth().currentUser;
	}
}