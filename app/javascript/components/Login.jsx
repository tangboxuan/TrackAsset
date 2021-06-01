import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import History from "../routes/History";
import Port from "../routes/Port";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '',
            password: '',
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
        const {username, password} = this.state
        let user = {
          username: username,
          password: password
        }
        
        axios.post(`${Port}/login`, {user}, {withCredentials: true})

        .then(response => {
            if (response.data.logged_in) {
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

    render() {
        const {username, password, errors} = this.state;

        return (
            <div>
                <h1>Log In</h1>
                {errors}
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
                        required
                        onChange={this.handleChange}
                    />         
                    <button placeholder="submit" type="submit">
                        Log In
                    </button>
                    
                    <div>
                    <br/>    
                    <Link
                    to="/"
                    className="btn btn-lg custom-button"
                    role="button"
                    >
                    Home
                    </Link> &ensp;
                    <Link
                    to="/signup"
                    className="btn btn-lg custom-button"
                    role="button"
                    >
                    Sign Up
                    </Link>
                    </div>
                </form>
            </div>
        );
    }
}
export default Login;