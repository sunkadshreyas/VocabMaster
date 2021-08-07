import axios from 'axios';
import React from 'react';

class MyWords extends React.Component{
    state = {
        word : "",
        meaning : "",
        words : []
    }
    componentDidMount(){
        const options = {
            headers : {
                "x-auth-token" : localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }
        // console.log(options.headers['x-auth-token']);
        axios.get('/listwords', options)
        .then(response => {
            // console.log(response.data.listWords)
            this.setState({
                words : response.data.listWords
            })
        })
    }
  
    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    handleDelete = (question) => {
        
    }
    handleSubmit = event => {
        event.preventDefault();
        var word = this.state.word
        var meaning = this.state.meaning
        // console.log(localStorage.getItem('token'))
        const options = {
            headers : {
                "x-auth-token" : localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }
        console.log(word)
        axios.post('/addword',{word, meaning}, options)
        .then(response => {
            console.log(response)
        })
        this.setState({
            word : "",
            meaning : ""
        })
        window.location.reload(false);
    }
    render(){
        return (
            <div>
                <div>List of My words and their meanings</div>
                <div>
                    {this.state.words.map(word => 
                        <div key={word.question}>
                            {word.question} means {word.correct_answer}
                            <button onClick={() => {
                                const options = {
                                    headers : {
                                        "x-auth-token" : localStorage.getItem("token"),
                                        'Content-Type': 'application/json'
                                    }
                                }
                                var currword = word.question
                                axios.post('/deleteword', {currword}, options)
                                .then(res => {
                                    console.log(res);
                                })
                                window.location.reload(false);
                            }}>x</button>
                        </div>
                        )
                    }
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input 
                            name="word"
                            value={this.state.word}
                            placeholder="Enter the word"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <input 
                            name="meaning"
                            value={this.state.meaning}
                            placeholder="Enter the meaning of word"
                            onChange={this.handleChange}
                        />
                    </div>
                    <button type="submit">Add to my list</button>
                </form>
            </div>
        );
    }
}

export default MyWords;

/* 

  componentDidUpdate(){
        const options = {
            headers : {
                "x-auth-token" : localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }
        axios.get('/listwords', options)
        .then(response => {
            // console.log(response.data)
            this.setState({
                words : response.data
            })
        })
    }
*/