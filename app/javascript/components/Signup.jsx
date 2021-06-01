import React from 'react';
import axios from 'axios';
import Port from "../routes/Port";
import { Link } from "react-router-dom";
import History from "../routes/History"

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '',
            password: '',
            password_confirmation: '',
            errors: ''
        };
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    };

    handleSubmit = (event) => {
        event.preventDefault()
        const {username, password, password_confirmation} = this.state
        let user = {
            username: username,
            password: password,
            password_confirmation: password_confirmation
        }

        axios.post(`${Port}/users`, {user}, {withCredentials: true})

        .then(response => {
            if (response.data.status === 'created') {
                this.props.handleLogin(response.data)
                this.redirect()
            } else {
                this.setState({
                errors: response.data.errors
                })
            }
        })
        .catch(error => console.log('api errors:', error))
    };

    redirect = () => {
        History.push('/')
    }

    handleErrors = () => {
        return (
            <div>
                <ul>
                {this.state.errors.map((error) => {
                    return <li key={error}>{error}</li>
                })}
                </ul> 
            </div>
        )
    };

    render() {
        const {username, password, password_confirmation} = this.state
        return (
            <div>
                <h1>Sign Up</h1>        
                <form onSubmit={this.handleSubmit}>
                    <input
                    placeholder="username"
                    type="text"
                    name="username"
                    value={username}
                    required
                    onChange={this.handleChange}
                    />
                    <input 
                    placeholder="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    />          
                    <input
                    placeholder="password confirmation"
                    type="password"
                    name="password_confirmation"
                    value={password_confirmation}
                    required
                    onChange={this.handleChange}
                    />
                    <button placeholder="submit" type="submit">
                    Sign Up
                    </button>
                </form>
                <br/>
                <Link
                to="/"
                className="btn btn-lg custom-button"
                role="button"
                >  
                    Home
                </Link>
            </div>
        );
    }
}
export default Signup;