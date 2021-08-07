import React from 'react';
import DictionaryAPI from './components/DictionaryAPI';
import Quiz from './components/Quiz';
import MyWords from './components/MyWords';
import Login from './components/Login';
import Registration from './components/Registration';
import Logout from './components/Logout';
import { Switch, Route, Link } from 'react-router-dom';




function Navbar(){
  const currentUser = JSON.parse(localStorage.getItem('token'))
  return (
    <nav>
      {currentUser && <Link to="/">MyWords</Link>}
      {currentUser && <Link to="/quiz">Quiz</Link>}
      {currentUser && <Link to="/search">Search</Link>}
      {!currentUser && <Link to='/auth'>Login</Link>}
      {!currentUser && <Link to='/register'>Register</Link>}
      {currentUser && <Link to='/logout'>Logout</Link>}
    </nav>
  );
}


function setToken(usertoken){
  localStorage.setItem('token', JSON.stringify(usertoken));
}

function getToken(){
  const tokenString = localStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

class App extends React.Component{
  state = {
    token : getToken(),
    isLoggedIn : false,
  }
  render(){
    return (
      <div>
        <Navbar />
        <Switch>
          <Route 
              component={Login}
              setToken={setToken}
              token={this.state.token}
              path='/auth'
          />
          <Route 
            component={Registration}
            setToken={setToken}
            token={this.state.token}
            path='/register'
          />
          <Route 
            path='/' 
            exact 
            token={this.state.token}
            setToken={setToken}
            render={(props) => <MyWords/>}
          />  
          <Route 
            path='/quiz'
            component={Quiz}
            token={this.state.token}
            setToken={setToken}
          />
          <Route 
            path='/search' 
            component={DictionaryAPI}
            token={this.state.token}
            setToken={setToken}
          />
          <Route 
            path='/logout'
            component={Logout}
          />
        </Switch>
      </div>
    );
  }
}



export default App;
