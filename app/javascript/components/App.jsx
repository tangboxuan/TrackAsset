import React from "react";
import Port from "../routes/Port";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import History from "../routes/History"
import Home from "../components/Home";
import Assets from "../components/Assets";
import AddAsset from "../components/AddAsset";
import Login from "../components/Login";
import Signup from "../components/Signup";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoggedIn: false,
            user: {},
        };
    };


    componentDidMount() {
        this.loginStatus()
    }

    loginStatus = () => {
        const token = document.querySelector('meta[name="csrf-token"]').content

        const url = `${Port}/logged_in`
        fetch(url, {
            method: "GET",
            headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
            },
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
        .then(data => {
            if (data.logged_in) {
                this.handleLogin(data)
            } else {
                this.handleLogout()
            }
        })
        .catch(error => console.log('api errors:', error))
    };

    handleLogin = (data) => {
        this.setState({
            isLoggedIn: true,
            user: data.user
        })
    }

    handleLogout = () => {
        this.setState({
            isLoggedIn: false,
            user: {}
        })
      }
    
    clickLogout = () => {
        const token = document.querySelector('meta[name="csrf-token"]').content
        const url = `${Port}/logout`
        fetch(url, {
            method: "POST",
            headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
            },
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then(data => {
            if (data.logged_out) {
                this.handleLogout()
                History.push("/")
            }
        })

        .catch(error => console.log('api errors:', error))
    }

    render() {
        const {id, username,} = this.state.isLoggedIn ? this.state.user : {id:0, username:""};
        return (
            <div>
            <h1>{this.state.isLoggedIn ? <><button onClick={this.clickLogout}>Log Out</button> Username: {username}</> : <>Not Logged In. Use username "test" and password "test".</>}</h1>
            <Router history={History}>
                <Switch>
                    <Route path="/" exact>{this.state.isLoggedIn ? <Redirect to="/assets"/> : <Home/>}</Route> 

                    <Route path="/assets" exact>{this.state.isLoggedIn ? <Assets id={id}/> : <Redirect to="/"/>}</Route>

                    <Route path="/addasset" exact>{this.state.isLoggedIn ? <AddAsset id={id}/> : <Redirect to="/"/>}</Route>

                    <Route path="/login" exact>{this.state.isLoggedIn ? <Redirect to="/assets"/> : <Login handleLogin={this.handleLogin}/>}</Route> 

                    <Route path="/signup" exact>{this.state.isLoggedIn ? <Redirect to="/assets"/> : <Signup handleLogin={this.handleLogin}/>}</Route> 
                </Switch>
            </Router>
            </div>
        );
    }
};
export default App;