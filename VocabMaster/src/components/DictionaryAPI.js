import React from 'react';
import axios from 'axios';


export default class DictionaryAPI extends React.Component{
    state = {
        word : "",
        meaning : "",
        loading : true
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    addWords = (event) => {
        var word = this.state.word
        var meaning = this.state.meaning
        const options = {
            headers : {
                "x-auth-token" : localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }
        axios.post('/addword', {word, meaning}, options)
        .then(response => {
            console.log(`Response i got ${response}`)
            this.setState({
                word: "",
                meaning : "",
            });
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        var word = this.state.word
        axios.post('/search',{ word })
        .then(response => {
            // console.log(response.data)
            this.setState({
                meaning : response.data,
                loading : false
            })
        })
        .then(error => {
            console.log(error)
        })
    }
    render(){
        return (
           <div>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        placeholder="Enter a word..."
                        name="word"
                        value={this.state.word}
                        onChange={this.handleChange}
                    />
                    {this.state.loading ? null : 
                        <div>
                            {this.state.meaning}
                        </div>
                    }
                    <div>
                        <button type="submit">Search</button>
                    </div>
                </form>
                <div>
                    <button onClick={this.addWords}>Add to my list</button>
                </div>
           </div>
        );
    }
}