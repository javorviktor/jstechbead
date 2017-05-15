import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Form from './components/form/'
import PasswordForm from './components/password-form/'
import {withRouter} from "react-router-dom";
class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={PasswordForm} />
          <Route path="/:password" component={Form} />
        </div>
      </Router>
    )
  }
}

export default App