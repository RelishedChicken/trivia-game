import React from "react";

class AnswerGrid extends React.Component{

    render(){
        return(
            <div className="answerGridContainer">
                <div className="answerGrid">
                    <button disabled={this.props.buttonsDisabled} onClick={this.props.verifyAnswer} className="answerButton">{this.props.answers[0]}</button>
                    <button disabled={this.props.buttonsDisabled} onClick={this.props.verifyAnswer} className="answerButton">{this.props.answers[1]}</button>
                    {this.props.type && (
                        <>
                            <button disabled={this.props.buttonsDisabled} onClick={this.props.verifyAnswer} className="answerButton">{this.props.answers[2]}</button>
                            <button disabled={this.props.buttonsDisabled} onClick={this.props.verifyAnswer} className="answerButton">{this.props.answers[3]}</button>
                        </>
                    )}
                </div>
            </div>
        )
    }
}

export default AnswerGrid;