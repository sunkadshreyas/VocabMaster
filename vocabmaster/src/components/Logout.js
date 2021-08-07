import React from 'react';

class Logout extends React.Component{
    handleClick = event => {
        localStorage.clear()
        window.location.reload(false);
    }
    render(){
        return (
            <div>
                <button onClick={this.handleClick}>Logout</button>
            </div>
        );
    }
}

export default Logout;