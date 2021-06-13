import React from 'react';
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
          username,
          password
        }
        const token = document.querySelector('meta[name="csrf-token"]').content

        const url = `${Port}/login`
        fetch(url, {
            method: "POST",
            headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then(data => {
            if (data.logged_in) {
                this.props.handleLogin(data)
                this.redirect()
            } else {
                this.setState({
                    errors: data.errors
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