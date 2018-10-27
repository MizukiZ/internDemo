import React from "react"
import axios from "axios"
import PropTypes from "prop-types"

class TeamList extends React.Component {
  state = {
    teams: [],
    createValue: "",
    editTeam: {},
    createMode: false
  }

  load = () => {
    axios
      .get("/teams", { params: { request: "get" } })
      .then(data => {
        const teams = data.data
        this.setState({ teams })
      })
      .catch(e => {
        conosle.log(e)
      })
  }

  onSetCreateMode = () => {
    this.setState({ createValue: "", createMode: true })
  }

  onSetEdit = id => {
    const team = this.state.teams.filter(team => team.id === id)
    this.setState({ editTeam: team[0] })
    this.setState({ createMode: false })
  }

  onChangeInput = (mode, value) => {
    if (mode === "edit") {
      this.setState(prevState => ({
        editTeam: { ...prevState.editTeam, name: value }
      }))
    } else if (mode == "new") {
      this.setState({ createValue: value })
    }
  }

  onCreate = name => {
    axios
      .post("/teams", { name, authenticity_token: window._token })
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
      .put(`teams/${id}`, {
        team: { id, name: value },
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
      .delete(`teams/${id}`, {
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
    const { teams, createValue, editTeam, createMode } = this.state
    const { url, currentUser } = this.props

    return (
      <React.Fragment>
        <Header currentUser={currentUser} />
        <Modal
          createMode={createMode}
          createValue={createValue}
          editTeam={editTeam}
          onChangeInput={this.onChangeInput}
          onEdit={this.onEdit}
          onCreate={this.onCreate}
        />
        <List
          teams={teams}
          onDelete={this.onDelete}
          onSetEdit={this.onSetEdit}
          onSetCreateMode={this.onSetCreateMode}
        />
      </React.Fragment>
    )
  }

  componentDidMount() {
    this.setState({ teams: this.props.teams })
  }
}

function List({ teams, onDelete, onSetEdit, onSetCreateMode }) {
  return (
    <React.Fragment>
      <button
        className="btn btn-primary"
        onClick={e => {
          onSetCreateMode()
          $("#exampleModal").modal("show")
        }}
      >
        Create new team
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
          {teams.map(team => {
            return (
              <tr key={`tr${team.id}`}>
                <th scope="row">1</th>
                <td>{team.name}</td>
                <td>{team.created_at}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={e => {
                      onSetEdit(team.id)
                      $("#exampleModal").modal("show")
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={e => {
                      onDelete(team.id)
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
  editTeam,
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
              {createMode ? "Create new team" : "Edit team"}
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
            <label htmlFor="team_name">Name</label>
            {createMode ? (
              <input
                type="text"
                id="team_name"
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
                id="team_name"
                className="form-control"
                value={editTeam.name != null ? editTeam.name : ""}
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
                  onEdit(editTeam.id, editTeam.name)
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

export default TeamList
