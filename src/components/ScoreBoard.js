import React from "react";

class ScoreBoard extends React.Component{

    render(){
        return(
            <div className="scoreBoardContainer">
                <div className="scoreBoard">
                    <h3 className="score">Correct: {this.props.correct}</h3>
                    <h3 className="score">Incorrect: {this.props.incorrect}</h3>
                </div>
            </div>
        )
    }

}

export default ScoreBoard;