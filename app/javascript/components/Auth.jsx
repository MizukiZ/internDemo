import React from "react"
import axios from "axios"
import PropTypes from "prop-types"
class Auth extends React.Component {
  state = {
    registerMode: false
  }

  registerWithEmailAndPassword = (name, email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        const firebase_user_id = data.user.uid

        // pass data to create new account
        axios
          .post("/authentication", {
            token_id: firebase_user_id,
            name: name,
            email: email,
            authenticity_token: window._token
          })
          .then(data => {
            // now ready to go to home page
            window.location.replace("/teams")
          })
          .catch(error => {
            console.log(error.message)
          })
      })
      .catch(function(error) {
        const errorMessage = error.message

        // set the error Message and show it
        $("#registerErrorMessage").text(errorMessage)
        $("#registerErrorMessage").show()
        console.log(errorMessage)
      })
  }

  signInWithEmailAndPassword = (email, password) => {
    firebase.auth()
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        const user = data.user

        this.verifyTokenAndGoToHome(user)
      })
      .catch(function(error) {
        var errorMessage = error.message

        // set the error Message and show it
        $("#loginErrorMessage").text(errorMessage)
        $("#loginErrorMessage").show()
        console.log(errorMessage)
      })
  }

  verifyTokenAndGoToHome = user => {
    // get user token form firebase
    user
      .getIdToken(/* forceRefresh */ true)
      .then(idToken => {
        // Send token to your backend via HTTPS
        axios.post("/login", { token: idToken }).then(data => {
          // get firebase user id
          const user_id = data.data.tokenData.sub

          // post the firebase user id to get corresponding user in porstgers databse
          axios
            .post("/login", { token_id: user_id })
            .then(data => {
              // if result is fail, stop execution and show error message
              if (data.data.result === "fail") {
                const user = firebase.auth().currentUser

                // delete firebase unnecessary current user
                user.delete().then(function(e) {
                  // User deleted.
                  $("#loginErrorMessage").text(data.data.message)
                  $("#loginErrorMessage").show()
                })
                return
              }
              // now ready to go to home page
              window.location.replace("/teams")
            })
            .catch(function(error) {
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

  register_with_google = () => {
    // hide error message
    $("#registerErrorMessage").hide()

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
        axios
          .post("/authentication", {
            token_id: firebase_user_id,
            name: name,
            email: email
          })
          .then(data => {
            // if result is fail, stop execution and show error message
            if (data.data.result == "fail") {
              $("#registerErrorMessage").text(
                "You have an account with this google account"
              )
              $("#registerErrorMessage").show()

              return
            }
            // now ready to go to home page
            window.location.replace("/teams")
          })
          .catch(error => {
            console.log(error.message)
          })
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message

        console.log(errorMessage)
      })
  }

  login_With_Goolge = () => {
    // hide error message
    $("#loginErrorMessage").hide()

    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // The signed-in user info.
        const user = result.user

        this.verifyTokenAndGoToHome(user)
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message

        console.log(errorMessage)
      })
  }

  toggleRegisterMode = () => {
    this.setState(prevState => ({ registerMode: !prevState.registerMode }))
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.registerMode ? (
          <LoginForm
            onLogin={this.signInWithEmailAndPassword}
            loginWithGoogle={this.login_With_Goolge}
            toggleRegisterMode={this.toggleRegisterMode}
          />
        ) : (
          <RegisterForm
            onRegister={this.registerWithEmailAndPassword}
            registerWithGoogle={this.register_with_google}
            toggleRegisterMode={this.toggleRegisterMode}
          />
        )}
      </React.Fragment>
    )
  }
}

function LoginForm({ onLogin, loginWithGoogle, toggleRegisterMode }) {
  return (
    <React.Fragment>
      <form
        id="loginForm"
        style={{ width: "40%", margin: "0 auto" }}
        onSubmit={e => {
          e.preventDefault()

          const email = e.target.email.value
          const password = e.target.password.value

          onLogin(email, password)
        }}
      >
        <img className="mb-4" src="" alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Please Log in</h1>

        <div
          id="loginErrorMessage"
          style={{ display: "none" }}
          className="alert alert-danger"
        >
          {" "}
        </div>

        <label htmlFor="inputEmail" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          name="email"
          id="inputEmail"
          className="form-control"
          placeholder="Email address"
          required
          autoFocus
        />

        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="inputPassword"
          className="form-control mb-3"
          placeholder="Password"
          required
        />

        <button className="btn btn-primary mb-3" type="submit">
          Log in
        </button>

        <div />
      </form>

      <button
        onClick={e => {
          toggleRegisterMode()
        }}
      >
        Don't have an account
      </button>

      <button
        onClick={e => {
          loginWithGoogle()
        }}
        type="button"
        className="btn btn-warning"
      >
        Login with google
      </button>
    </React.Fragment>
  )
}

function RegisterForm({ onRegister, registerWithGoogle, toggleRegisterMode }) {
  return (
    <React.Fragment>
      <form
        id="loginForm"
        style={{ width: "40%", margin: "0 auto" }}
        onSubmit={e => {
          e.preventDefault()

          const name = e.target.name.value
          const email = e.target.email.value
          const password = e.target.password.value

          onRegister(name, email, password)
        }}
      >
        <img className="mb-4" src="" alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Please register</h1>

        <div
          id="loginErrorMessage"
          style={{ display: "none" }}
          className="alert alert-danger"
        >
          {" "}
        </div>

        <label htmlFor="nameEmail" className="sr-only">
          Email address
        </label>
        <input
          type="name"
          name="name"
          id="nameEmail"
          className="form-control"
          placeholder="User name"
          required
          autoFocus
        />

        <label htmlFor="inputEmail" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          name="email"
          id="inputEmail"
          className="form-control"
          placeholder="Email address"
          required
        />

        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="inputPassword"
          className="form-control mb-3"
          placeholder="Password"
          required
        />

        <button className="btn btn-primary mb-3" type="submit">
          Register
        </button>

        <div />
      </form>

      <button
        onClick={e => {
          toggleRegisterMode()
        }}
      >
        Have an account
      </button>

      <button
        onClick={e => {
          registerWithGoogle()
        }}
        type="button"
        className="btn btn-warning"
      >
        Register with google
      </button>
    </React.Fragment>
  )
}

export default Auth
