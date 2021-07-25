import React from 'react';
import { Link } from 'react-router-dom';
import History from "../routes/History";
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
            <div class="container">
                <div class="row"><Col><div class="d-flex justify-content-center">
                        <h1>Log In</h1>
                    </div></Col></div>
                
                <Row><Col>{errors}</Col></Row>
                
                <Row><Col>
                <form onSubmit={this.handleSubmit}>
                    <div class="form-group" style={{marginTop: "20px"}}>
                        <label for="username">Username</label>
                        <input type="text" class="form-control" name="username" value={username} placeholder="Username" onChange={this.handleChange} required />
                    </div>
                    <div class="form-group" style={{marginTop: "20px"}}>
                        <label for="password">Password</label>
                        <input type="password" class="form-control" name="password" value={password} placeholder="Password" onChange={this.handleChange} required />
                    </div>
                    <div></div>
                    <Button variant="primary" type="submit" style={{marginTop: "20px"}}>
                        Log In
                    </Button>
                    
                    <div>
                    <br/>    
                    <div class="d-flex justify-content-center">
                    <Link
                    to="/"
                    className="btn btn-lg custom-button"
                    role="button">
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
                    </div>
                </form>
                </Col></Row>
            </div>
        );
    }
}
export default Login;