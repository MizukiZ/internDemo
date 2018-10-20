function registerWithEmailAndPassword(name, email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(data => {
      const firebase_user_id = data.user.uid

      // pass data to create new account
      $.post(
        "/authentication",
        {
          token_id: firebase_user_id,
          name: name,
          email: email
        },
        data => {
          // now ready to go to home page
          window.location.replace("/teams")
        }
      )
    })
    .catch(function(error) {
      var errorCode = error.code
      var errorMessage = error.message

      console.log(errorMessage)
    })
}

function signInWithEmailAndPassword(email, password) {
  firebase.auth()
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(data => {
      const user = data.user

      verifyTokenAndGoToHome(user)
    })
    .catch(function(error) {
      var errorCode = error.code
      var errorMessage = error.message

      console.log(errorMessage)
    })
}

function verifyTokenAndGoToHome(user) {
  // get user token form firebase
  user
    .getIdToken(/* forceRefresh */ true)
    .then(idToken => {
      // Send token to your backend via HTTPS
      $.post("/login", { token: idToken }, data => {
        // get firebase user id
        const user_id = data.tokenData.sub

        // post the firebase user id to get corresponding user in porstgers databse
        $.post("/login", { token_id: user_id }, data => {
          // now ready to go to home page
          window.location.replace("/teams")

          console.log(data)
        }).catch(function(error) {
          // Handle error
          console.log("decode error")
        })
      })
    })
    .catch(function(error) {
      // Handle error
      console.log("decode error")
    })
}

// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//     console.log("user is in")

//     var user = firebase.auth().currentUser
//     console.log("Your email address is " + user.email)

//     // get user token form firebase
//     user
//       .getIdToken(/* forceRefresh */ true)
//       .then(idToken => {
//         // Send token to your backend via HTTPS
//         $.post("/login", { token: idToken }, data => {
//           // get firebase user id
//           const user_id = data.tokenData.sub

//           // post the firebase user id to get corresponding user in porstgers databse
//           $.post("/login", { token_id: user_id }, data => {
//             // now ready to go to home page
//             // window.location.replace("/teams")

//             console.log(data)
//           }).catch(function(error) {
//             // Handle error
//             console.log("decode error")
//           })
//         })
//       })
//       .catch(function(error) {
//         // Handle error
//         console.log("decode error")
//       })
//   } else {
//     // No user is signed in.
//     console.log("no user is in")
//   }
// })

$(document).ready(function() {
  // login
  $("#loginForm").submit(event => {
    // Stop the browser from submitting the form.
    event.preventDefault()

    const email = event.target.email.value
    const password = event.target.password.value

    signInWithEmailAndPassword(email, password)
  })

  // create new user
  $("#registerForm").submit(event => {
    // Stop the browser from submitting the form.
    event.preventDefault()

    const name = event.target.name.value
    const email = event.target.email.value
    const password = event.target.password.value

    registerWithEmailAndPassword(name, email, password)
  })
})
