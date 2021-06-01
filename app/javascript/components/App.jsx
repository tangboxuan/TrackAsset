import React from "react";
import axios from 'axios'
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

        axios.get(`${Port}/logged_in`, {withCredentials: true})    

        .then(response => {
            if (response.data.logged_in) {
                this.handleLogin(response)
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
        axios.post(`${Port}/logout`, {withCredentials: true})

        .then(response => {
            if (response.data.logged_out) {
                this.handleLogout()
                History.push("/")
            }
        })

        .catch(error => console.log('api errors:', error))
    }

    render() {
        return (
            <div>
            <h1>{this.state.isLoggedIn?<button onClick={this.clickLogout}>Log Out</button>:<>Not Logged In. Use username "test" and password "test".</>}</h1>
            <Router history={History}>
                <Switch>
                    <Route path="/" exact>{this.state.isLoggedIn?<Redirect to="/assets"/>:<Home/>}</Route> 

                    <Route path="/assets" exact>{this.state.isLoggedIn?<Assets/>:<Redirect to="/"/>}</Route>

                    <Route path="/addasset" exact>{this.state.isLoggedIn?<AddAsset/>:<Redirect to="/"/>}</Route>

                    <Route path="/login" exact>{this.state.isLoggedIn?<Redirect to="/assets"/>:<Login handleLogin={this.handleLogin}/>}</Route> 

                    <Route path="/signup" exact>{this.state.isLoggedIn?<Redirect to="/assets"/>:<Signup handleLogin={this.handleLogin}/>}</Route> 
                </Switch>
            </Router>
            </div>
        );
    }
};
export default App;