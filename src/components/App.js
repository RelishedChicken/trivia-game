import React from "react";
import Question from "./Question";
import AnswerGrid from "./AnswerGrid";
import ScoreBoard from "./ScoreBoard";
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
        chosenCategory: "",
        questionType: "",
        chosenDifficulty: "",
        nCorrect: 0,
        nWrong: 0
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
        fetch("https://opentdb.com/api.php?amount=1"+this.state.chosenCategory+this.state.questionType+this.state.chosenDifficulty).then(res => res.json()).then((jsonData) => {
            //Get question data and clean up for use in web-app
            qData = jsonData.results[0];
            var realDifficulty = qData.difficulty.substring(0,1).toUpperCase() + qData.difficulty.substring(1,qData.difficulty.length);
            var allAnswers = qData.incorrect_answers;
            allAnswers.push(this.decode(qData.correct_answer));
            allAnswers = this.shuffleArray(allAnswers);

            for(var i=0;i<allAnswers.length;i++){
                allAnswers[i] = this.decode(allAnswers[i]);
            }

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
                buttonsDisabled: false,
            });

            //Set the button backgrounds back to normal (for when buttons show answers)
            var allButtons = $(".answerButton");
            for(var k=0;k<allButtons.length;k++){
                allButtons[k].style.backgroundColor = "#603385";
                allButtons[k].style.opacity = 1;
                allButtons[k].style.border = "none";
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
                allButtons[i].style.opacity = 0.5; 
            }
            
            if(e.target.textContent === allButtons[i].textContent){
                allButtons[i].style.border = "3px solid white";
            }
        }
        this.setState({
            buttonsDisabled: true
        });
        
        setTimeout(()=>{this.getQuestion()},3400);
        if(e.target.textContent === this.state.correctAnswer){
            this.setState({
                nCorrect: this.state.nCorrect + 1
            })
        }else{
            this.setState({
                nWrong: this.state.nWrong + 1
            })
        }
    }
    
    //Parse new options and generate new question & reset score
    updateOptions = (e) => {
        e.preventDefault();
        console.log(e.target);
        this.setState({
            chosenCategory: "&category="+e.target[0].value,
            questionType: "&type="+e.target[1].value,
            chosenDifficulty: "&difficulty="+e.target[2].value,
            nCorrect: 0,
            nWrong: 0
        }, this.getQuestion);
    }

    render(){
        return(
            <div className="appContainer">
                <div className="menuCol">
                    <h1 className="title">Tricky Trivia</h1>
                    <h3 className="subtitle">Options</h3>
                    <div className="options">
                        <form onSubmit={this.updateOptions}>
                            <label className="optionsLabel">Category</label>
                            <select name="chosenCategory" id="categories" className="optionDropdown">
                                {this.state.allCategories}
                            </select>
                            <label className="optionsLabel">Type</label>
                            <select name="questionType" className="optionDropdown">
                                <option value="">Any</option>
                                <option value="multiple">Multiple Choice</option>
                                <option value="boolean">True / False</option>
                            </select>
                            <label className="optionsLabel">Difficulty</label>
                            <select name="questionType" className="optionDropdown">
                                <option value="">Any</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <button className="submitButton">Get Questions!</button>
                        </form>
                    </div>
                </div>
                <div className="content">
                    <Question questionText={this.state.question} difficulty={this.state.difficulty} category={this.state.category}/>
                    <AnswerGrid type={this.state.multipleChoice} buttonsDisabled={this.state.buttonsDisabled} verifyAnswer={this.verifyAnswer} answers={this.state.answers} correctAnswer={this.state.correctAnswer} incorrectAnswers={this.state.incorrect_answers} />
                    <ScoreBoard correct={this.state.nCorrect} incorrect={this.state.nWrong} />
                </div>
            </div>
        )
    }

}

export default App;