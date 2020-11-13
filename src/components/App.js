import React from "react";
import Question from "./Question";
import AnswerGrid from "./AnswerGrid";
import $ from "jquery";

class App extends React.Component{

    state = {
        question: "",
        answers: ["","","",""],
        correctAnswer: "",
        wrongAnswers: ["","",""],
        category: "",
        difficulty: "",
        multipleChoice: false,
        questionLoaded: false,
        buttonsDisabled: false,
        allCategories: [<option value="">Any</option>],
        chosenCategory: ""
    }

    //Trigger to load question and categories
    componentDidMount(){
        this.getQuestion();
        this.getCategories();
    }

    //Helper function to decode HTML special chars
    decode(text){
        return new DOMParser().parseFromString(text,"text/html").documentElement.textContent;
    }

    //Used to shuffle the answers so correct answer is in a random place
    shuffleArray(array){
        var count = array.length,
            randomnumber,
            temp;
        while( count ){
            randomnumber = Math.random() * count-- | 0;
            temp = array[count];
            array[count] = array[randomnumber];
            array[randomnumber] = temp;
        }
        return array;
    }

    //Get all categories from the Trivia API
    getCategories = () => {
        fetch("https://opentdb.com/api_category.php").then(res => res.json()).then((jsonData) => {
            var allCategories = jsonData.trivia_categories;
            for(var i=0;i<allCategories.length;i++){
                this.state.allCategories.push(<option value={allCategories[i].id}>{allCategories[i].name}</option>);
            }
        })
    }

    //Get quetsion data from the Trivia API
    getQuestion = () => {
        var qData;
        fetch("https://opentdb.com/api.php?amount=1"+this.state.chosenCategory).then(res => res.json()).then((jsonData) => {
            //Get question data and clean up for use in web-app
            qData = jsonData.results[0];
            var realDifficulty = qData.difficulty.substring(0,1).toUpperCase() + qData.difficulty.substring(1,qData.difficulty.length);
            var allAnswers = qData.incorrect_answers;
            allAnswers.push(qData.correct_answer);
            allAnswers = this.shuffleArray(allAnswers);
            var incorrectAnswers = qData.incorrect_answers.map(e=>this.decode(e));

            //Save the question in App state
            this.setState({
                question: this.decode(qData.question),
                answers: allAnswers,
                category: this.decode(qData.category),
                difficulty: realDifficulty,
                correctAnswer: this.decode(qData.correct_answer),
                wrongAnswers: incorrectAnswers,
                multipleChoice: qData.type === "multiple" ? true : false,
                questionLoaded: true,
                buttonsDisabled: false
            });

            //Set the button backgrounds back to normal (for when buttons show answers)
            var allButtons = $(".answerButton");
            for(var i=0;i<allButtons.length;i++){
                allButtons[i].style.backgroundColor = "#603385";
            }
        });       
    }

    //Check if selected answer is correct and to handle showing answers
    verifyAnswer = (e) =>{
        var allButtons = $(".answerButton");
        for(var i=0;i<allButtons.length;i++){
            if(allButtons[i].textContent === this.state.correctAnswer){
                allButtons[i].style.backgroundColor = "green";
            }else{
                allButtons[i].style.backgroundColor = "red";
            }
        }
        this.setState({
            buttonsDisabled: true
        });
        console.log(this.state);
        setTimeout(()=>{this.getQuestion()},5000);
    }
    
    updateOptions = (e) => {
        e.preventDefault();
        console.log(e.target);
        this.setState({
            chosenCategory: "&category="+e.target[0].value 
        })
        this.getQuestion();
    }

    render(){
        return(
            <div className="appContainer">
                <div className="menuCol">
                    <h1 className="title">Trivia</h1>
                    <h3 className="subtitle">Options</h3>
                    <div className="options">
                        <form onSubmit={this.updateOptions}>
                            <label className="optionsLabel">Category</label>
                            <select name="chosenCategory" id="categories" className="optionDropdown">
                                {this.state.allCategories}
                            </select>
                            <button className="submitButton">Update</button>
                        </form>
                    </div>
                </div>
                <div className="content">
                    <Question questionText={this.state.question} difficulty={this.state.difficulty} category={this.state.category}/>
                    <AnswerGrid type={this.state.multipleChoice} buttonsDisabled={this.state.buttonsDisabled} verifyAnswer={this.verifyAnswer} answers={this.state.answers} correctAnswer={this.state.correctAnswer} incorrectAnswers={this.state.incorrect_answers} />
                </div>
            </div>
        )
    }

}

export default App;