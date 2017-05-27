import React, { Component } from 'react'
import {withRouter} from "react-router-dom";
class PasswordForm extends Component {
    constructor() {
        super()
        this.state = { password: '' }
    }
    submit() {
        this.props.history.push(this.state.password)
    }
    render() {
        return (
        <div>
            <h1> CAESAR CIPHER </h1>        
            <input id="key" type="text" placeholder="Enter your key here!"
                onChange={(e) => {
                    this.setState({ password: e.target.value })
                }}
                onKeyPress={e => { if (e.key == 'Enter') this.submit() }}
            />
        </div>
        )
    }
}
export default PasswordForm