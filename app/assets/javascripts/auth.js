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
      ).catch(error => {
        console.log(error.message)
      })
    })
    .catch(function(error) {
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

  // sing up with google account
  $("#google_singup").click(() => {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // The signed-in user info.
        const user = result.user

        const name = user.displayName
        const email = user.email
        const firebase_user_id = user.uid

        // pass data to create new account
        $.post(
          "/authentication",
          {
            token_id: firebase_user_id,
            name: name,
            email: email
          },
          data => {
            // if result is fail, stop execution and show error message
            if (data.result == "fail") {
              console.log(data.message)
              return
            }
            // now ready to go to home page
            window.location.replace("/teams")
          }
        ).catch(error => {
          console.log(error.message)
        })
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message

        console.log(errorMessage)
      })
  })

  // login with google account
  $("#google_login").click(() => {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // The signed-in user info.
        const user = result.user

        verifyTokenAndGoToHome(user)
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message

        console.log(errorMessage)
      })
  })
})
