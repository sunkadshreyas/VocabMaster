import React from 'react';
import axios from 'axios';

class Login extends React.Component{
    state = {
        email : "",
        password : "",
        token : ""
    }
    handleChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    handleSubmit = event => {
        event.preventDefault();
        const {email, password} = this.state;
        axios.post('/auth', {email, password})
        .then(res => {
            if(res.data.token){
                localStorage.setItem("token", JSON.stringify(res.data.token))
            }
            this.setState({
                token : res.data.token
            })
            console.log(`Token is ${this.state.token}`)
            window.location.reload(false);
        })
        .catch(error => {
            console.log(error)
        })        
    }
    render(){
        return (
            <div>
                Login
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input
                            name="email" 
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <input 
                            name="password"
                            placeholder="Enter password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;