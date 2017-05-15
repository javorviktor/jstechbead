import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import './form.css'

class Form extends Component {
  constructor() {
    super()
    this.state = { result: '' }
    this.text = ''
  }

  encode() {
    fetch('http://localhost/api',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipus: 'encode',
          kulcs: this.props.match.params.password,
          szoveg: this.text
        })
      })
      .then(resp => {
        if (resp.ok) {
          resp.json().
            then(json => {
              this.setState({ result: json.kodoltSzoveg })
            })
        } else {
          resp.json()
            .then(json => {
              this.setState({ result: json.status })
            })
        }
      })
  }

  decode() {
    fetch('http://localhost/api',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipus: 'decode',
          kulcs: this.props.match.params.password,
          szoveg: this.text
        })
      })
      .then(resp => {
        if (resp.ok) {
          resp.json().
            then(json => {
              this.setState({ result: json.dekodoltSzoveg })
            })
        } else {
          resp.json()
            .then(json => {
              this.setState({ result: json.status })
            })
        }
      })
  }

  render() {
    return (
      <div>
        <h3 className="meno_header">Current password: {this.props.match.params.password}</h3>
        <input type="text" placeholder="Text"
          onChange={e => {
            this.text = e.target.value
          }}
        />
        <input type="button" value="Encode" onClick={e => this.encode()} />
        <input type="button" value="Decode" onClick={e => this.decode()} />
        <div>{this.state.result}</div>
        <Link to="/">Go Back</Link>
      </div>
    )
  }
}

export default Form