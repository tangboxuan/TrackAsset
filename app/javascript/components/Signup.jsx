import React from 'react';
import Port from "../routes/Port";
import { Link } from "react-router-dom";
import History from "../routes/History"
import Button from 'react-bootstrap/Button'

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
            username,
            password,
            password_confirmation
        }
        const token = document.querySelector('meta[name="csrf-token"]').content
        const url = `${Port}/users`

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
            if (data.status === 'created') {
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
                <div class="d-flex justify-content-center">
                <h1>Sign Up</h1>        
                </div>
                
                <form onSubmit={this.handleSubmit} style={{padding: "40px"}}>
                <div class="form-group" style={{marginTop: "20px"}}>
                    <label for="username">Username</label>
                    <input type="text" class="form-control" name="username" value={username} placeholder="Username" onChange={this.handleChange} required />
                </div>
                <div class="form-group" style={{marginTop: "20px"}}>
                    <label for="password">Password</label>
                    <input type="password" class="form-control" name="password" value={password} placeholder="Password" onChange={this.handleChange} required />
                </div>
                <div class="form-group" style={{marginTop: "20px"}}>
                    <label for="password">Confirm Password</label>
                    <input type="password" class="form-control" name="password_confirmation" value={password_confirmation} placeholder="Password" onChange={this.handleChange} required />
                </div>
                    <Button variant="primary" type="submit" style={{marginTop: "20px"}}>
                        Sign up
                    </Button>
                </form>
                
                <br/>
                <div class="d-flex justify-content-center">
                <Link
                to="/"
                className="btn btn-lg custom-button"
                role="button"
                >  
                    Home
                </Link>
                </div>
            </div>
        );
    }
}
export default Signup;