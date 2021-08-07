import React from 'react';
import axios from 'axios';

class Registration extends React.Component{
    state = {
        name : "",
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
        const {name, email, password} = this.state;
        axios.post('/register', {name, email, password})
        .then(res => {
            console.log(res.data.token);
            this.setState({
                token : res.data.token
            });
        })
        .catch(error => {
            console.log(error)
        })        
    }
    render(){
        return (
            <div>
                Register
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input 
                            placeholder="Enter name"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.name}
                        />
                    </div>
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
                        <button type="submit">Register</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Registration;