import React from "react";

class Question extends React.Component{
    render(){
        return(
            <>
                <div className="questionContainer">
                    <div className="questionBox">
                        <h2 className="questionText">{this.props.questionText}</h2>
                        <div className="informationBox">
                            <p className="informationBit">Difficulty: {this.props.difficulty}</p>
                            <p className="informationBit">Category: {this.props.category}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Question;