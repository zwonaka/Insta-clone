const firebaseAuthContainer = document.querySelector("#firebase-auth-container")
const mainApp = document.querySelector("#main-app")
const ui = new firebaseui.auth.AuthUI(auth);


const redirectToAuth = () => {
    mainApp.style.display = "none";
    firebaseAuthContainer.style.display = "block";

    ui.start("#firebase-auth-container", {
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            console.log("authResult", authResult.user.uid);
            // this.userId = authResult.user.uid;
            // this.$authUserText.innerHTML = user.displayName;
            redirectToApp();
          },
        },
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        // Other config options...
      });
};

const redirectToApp = () => {
    mainApp.style.display = "block";
    firebaseAuthContainer.style.display = "none";
};

const handleLogout = () => {
    auth
        .signOut()
        .then(() => {
            redirectToAuth();
        })
    .catch((error) =>{
        console.log("error occured", error);
    })
}

auth.onAuthStateChanged((user) =>{
    if (user) {
        console.log(user.uid);
        //this.userId = user.uid;
        //this.SauthUserText.innerHTML = user.displayName;
        redirectToApp();
    } else {
        console.log("not logged in");
        redirectToAuth();
    }
})