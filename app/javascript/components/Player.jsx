import React from "react"
import axios from "axios"
import PropTypes from "prop-types"

class Player extends React.Component {
  state = {
    players: [],
    createValue: "",
    editPlayer: {},
    createMode: false
  }

  load = () => {
    axios
      .get("/players", { params: { request: "get" } })
      .then(data => {
        const players = data.data
        this.setState({ players })
      })
      .catch(e => {
        conosle.log(e)
      })
  }

  onSetCreateMode = () => {
    this.setState({ createValue: "", createMode: true })
  }

  onSetEdit = id => {
    const player = this.state.players.filter(player => player.id === id)
    this.setState({ editPlayer: player[0] })
    this.setState({ createMode: false })
  }

  onChangeInput = (mode, value) => {
    if (mode === "edit") {
      this.setState(prevState => ({
        editPlayer: { ...prevState.editPlayer, name: value }
      }))
    } else if (mode == "new") {
      this.setState({ createValue: value })
    }
  }

  onCreate = name => {
    axios
      .post("/players", { name, authenticity_token: window._token })
      .then(data => {
        this.load()
        $("#exampleModal").modal("hide")
      })
      .catch(e => {
        console.log(e)
      })
  }

  onEdit = (id, value) => {
    axios
      .put(`players/${id}`, {
        player: { id, name: value },
        authenticity_token: window._token
      })
      .then(data => {
        this.load()
        $("#exampleModal").modal("hide")
      })
      .catch(e => {
        console.log(e)
      })
  }

  onDelete = id => {
    axios
      .delete(`players/${id}`, {
        params: { id, authenticity_token: window._token }
      })
      .then(data => {
        this.load()
      })
      .catch(e => {
        console.log(e)
      })
  }

  render() {
    const { players, createValue, editPlayer, createMode } = this.state
    const { url, currentUser } = this.props

    return (
      <React.Fragment>
        <Header currentUser={currentUser} />
        <Modal
          createMode={createMode}
          createValue={createValue}
          editPlayer={editPlayer}
          onChangeInput={this.onChangeInput}
          onEdit={this.onEdit}
          onCreate={this.onCreate}
        />
        <List
          players={players}
          onDelete={this.onDelete}
          onSetEdit={this.onSetEdit}
          onSetCreateMode={this.onSetCreateMode}
        />
      </React.Fragment>
    )
  }

  componentDidMount() {
    this.setState({ players: this.props.players })
  }
}

function List({ players, onDelete, onSetEdit, onSetCreateMode }) {
  return (
    <React.Fragment>
      <button
        className="btn btn-primary"
        onClick={e => {
          onSetCreateMode()
          $("#exampleModal").modal("show")
        }}
      >
        Create new player
      </button>

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Created at</th>
            <th scope="col">Operation</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => {
            return (
              <tr key={`tr${player.id}`}>
                <th scope="row">1</th>
                <td>{player.name}</td>
                <td>{player.created_at}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={e => {
                      onSetEdit(player.id)
                      $("#exampleModal").modal("show")
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={e => {
                      onDelete(player.id)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </React.Fragment>
  )
}

function Header({ currentUser }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info mb-5">
      <a className="navbar-brand">Intern Demo</a>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a href="/teams" className="nav-item nav-link">
            Teams
          </a>
        </div>

        <div className="navbar-nav">
          <a href="/players" className="nav-item nav-link">
            Players
          </a>
        </div>

        <div className="navbar-nav ml-auto">
          <button
            id="logout"
            className="btn btn-sm btn-danger"
            type="button"
            onClick={e => {
              firebase
                .auth()
                .signOut()
                .then(function() {
                  axios.get("/logout").then(() => {
                    window.location.replace("/")
                  })
                })
                .catch(error => {
                  console.log(error)
                })
            }}
          >
            Logout
          </button>

          <i className="nav-item navbar-text text-dark">
            Hello {currentUser.name}
          </i>
        </div>
      </div>
    </nav>
  )
}

function Modal({
  createValue,
  createMode,
  editPlayer,
  onChangeInput,
  onEdit,
  onCreate
}) {
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {createMode ? "Create new player" : "Edit player"}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <label htmlFor="name">Name</label>
            {createMode ? (
              <input
                type="text"
                id="name"
                className="form-control"
                value={createValue}
                onChange={e => {
                  const value = e.target.value
                  onChangeInput("new", value)
                }}
              />
            ) : (
              <input
                type="text"
                id="name"
                className="form-control"
                value={editPlayer.name != null ? editPlayer.name : ""}
                onChange={e => {
                  const value = e.target.value
                  onChangeInput("edit", value)
                }}
              />
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                if (createMode) {
                  onCreate(createValue)
                } else {
                  onEdit(editPlayer.id, editPlayer.name)
                }
              }}
            >
              {createMode ? "Create" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player
