import React from 'react';
import axios from 'axios';



class Quiz extends React.Component{
  state = {
    words : [],
    quizQuestions : [],
    curr_q : 0,
    clicked : false,
    selectedOption : ""
  }
  componentDidMount(){
    const options = {
      headers : {
        "x-auth-token" : localStorage.getItem("token"),
        'Content-Type': 'application/json'
      }
    }
    axios.get('/listwords', options).then((res) => {
      // console.log(res);
      this.setState({
        words : res.data.listWords
      });
    })
  }
  handleChange = event => {
    this.setState({
      selectedOption : event.target.value,
      clicked : true
    });
  }
  render(){
    if(this.state.words.length <= 0){
      return <div>No words added yet...</div>
    }
    if(this.state.curr_q >= this.state.words.length){
      return <div>End of quiz</div>
    }
    return (
      <div>
        {this.state.words[this.state.curr_q]?.question}
        <div>
          <div>
            <input 
              type="radio" 
              value={this.state.words[this.state.curr_q]?.options[0]} 
              checked={this.state.selectedOption === this.state.words[this.state.curr_q]?.options[0]}
              onChange={this.handleChange}
            />
            <label>{this.state.words[this.state.curr_q]?.options[0]}</label>
          </div>
          <div>
            <input 
              type="radio" 
              value={this.state.words[this.state.curr_q]?.options[1]} 
              checked={this.state.selectedOption === this.state.words[this.state.curr_q]?.options[1]}
              onChange={this.handleChange}
            />
            <label>{this.state.words[this.state.curr_q]?.options[1]}</label>
          </div>
          <div>
            <input 
              type="radio" 
              value={this.state.words[this.state.curr_q]?.options[2]} 
              checked={this.state.selectedOption === this.state.words[this.state.curr_q]?.options[2]}
              onChange={this.handleChange}
            />
            <label>{this.state.words[this.state.curr_q]?.options[2]}</label>
          </div>
          <div>
            <input 
              type="radio" 
              value={this.state.words[this.state.curr_q]?.options[3]} 
              checked={this.state.selectedOption === this.state.words[this.state.curr_q]?.options[3]}
              onChange={this.handleChange}
            />
            <label>{this.state.words[this.state.curr_q]?.options[3]}</label>
          </div>
        </div>
          {!this.state.clicked ? null : 
          <div>
            {this.state.selectedOption === this.state.words[this.state.curr_q]?.correct_answer ? 
            <div style={{ color:"green"}}>
              Correct answer
            </div> : 
            <div style={{color : "red"}}>
              Wrong answer
            </div>}
          </div>
          }
        <div>
          <button onClick={() => {
            this.setState({
              curr_q : this.state.curr_q + 1,
              clicked : false
            });
          }}>Next question</button>
        </div>  
      </div>
    );
  }
}

export default Quiz;



