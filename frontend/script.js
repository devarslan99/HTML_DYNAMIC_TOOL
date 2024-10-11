import { generatePDF } from "./generatePDF.js";

//
let query = {};
let questions = {};
let ratingText = {
    "1": "Strongly Disagree",
    "2": "Disagree",
    "3": "Somewhat Disagree",
    "4": "Neither Agree<br>nor Disagree",
    "5": "Somewhat Agree",
    "6": "Agree",
    "7": "Strongly Agree"
  };
let AnswerText = {
    "1": "substantial weakness",
    "2": "moderate weakness",
    "3": "slight weakness",
    "4": "neutral",
    "5": "slight strength",
    "6": "moderate strength",
    "7": "substantial strength"
  };
let positiveQuestions = [];
let negativeQuestions = [];
let newData = [];

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server
    fetch('https://html-dynamic-tool.vercel.app/api/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Store the data from the server
        newData = data;

        // Populate positive and negative questions arrays
        newData.forEach((item, index) => {
            if (item.isPositive) {
                positiveQuestions.push(index + 1);
            } else {
                negativeQuestions.push(index + 1);
            }
            // Map `query` as `question` and `questions` as `phrase`
            query[`q${index + 1}`] = item.question;
            questions[`q${index + 1}`] = item.phrase;
        });
        // Populate the form with questions
        const form = document.getElementById('assessmentForm');
        newData.forEach((item, index) => {
            const questionNumber = index + 1;
            const questionHTML = `
                <div class="question">
                    <p>${questionNumber}. ${item.question}</p> <!-- Using phrase as the question text -->
                    <table>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                        </tr>
                        <tr>
                            <td>
                                <div class='radioDiv radio-value-1'>
                                    <input type="radio" name="q${questionNumber}" value="1">
                                    <span>${ratingText[1]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv radio-value-2'>
                                    <input type="radio" name="q${questionNumber}" value="2">
                                    <span>${ratingText[2]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv radio-value-3'>
                                    <input type="radio" name="q${questionNumber}" value="3">
                                    <span>${ratingText[3]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv  radio-value-4'>
                                    <input type="radio" name="q${questionNumber}" value="4">
                                    <span>${ratingText[4]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv radio-value-5'>
                                    <input type="radio" name="q${questionNumber}" value="5">
                                    <span>${ratingText[5]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv radio-value-6'>
                                    <input type="radio" name="q${questionNumber}" value="6">
                                    <span>${ratingText[6]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv radio-value-7'>
                                    <input type="radio" name="q${questionNumber}" value="7">
                                    <span>${ratingText[7]}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            `;
            form.innerHTML += questionHTML;
        });
// document.getElementById('generatePDFButton').addEventListener('click',generatePDF);
// document.getElementById('submitButton').addEventListener('click', function(event) {
//     // Prevent the default form submission
//     event.preventDefault();
//     // Call the function to calculate score
//     calculateScore();
//       const spinnerElement = document.getElementById("spinner");
//     const elementPosition = spinnerElement.getBoundingClientRect().top + window.scrollY;

//     window.scrollTo({
//         top: elementPosition,
//         behavior: 'smooth' // This adds a smooth scrolling effect
//     });
// });
// // document.getElementById('submitButton').addEventListener('click', calculateScore);

document.getElementById('submitButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form submission


  

    // Call validation function
    const formValid = validateForm(); 

    // Check if form is valid
    if (!formValid) {
        const unansweredQuestions = getUnansweredQuestions();
        alert("Please provide an answer to the following questions: " + unansweredQuestions.join(", "));
        return; // Stop further execution if the form is invalid
    }
      // Check if both identifiers are filled
  

    // If both identifiers are filled and form is valid, calculate score
   calculateScore();
       const spinnerElement = document.getElementById("spinner");
    const elementPosition = spinnerElement.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth' // This adds a smooth scrolling effect
    });

      setTimeout(() => {
        document.getElementById('generatePDFButton').style.display = 'inline-block';
    }, 3000); // Delay of 2000ms (2 seconds)
});

document.getElementById('generatePDFButton').addEventListener('click', generatePDF);

    })
    
    .catch(error => console.error('Error fetching data:', error));
});

function validateForm() {
    let allAnswered = true;

    // Loop through each question
    newData.forEach((item, index) => {
        const questionNumber = index + 1;
        const selectedAnswer = document.querySelector(`input[name="q${questionNumber}"]:checked`);
        
        // If no radio button is selected for the question, mark as not answered
        if (!selectedAnswer) {
            allAnswered = false;
        }
    });

    return allAnswered; // Return true if all questions are answered, otherwise false
}
function getUnansweredQuestions() {
    const questions = document.querySelectorAll('.question'); // Assuming each question has a class 'question'
    const unanswered = [];

    questions.forEach((question, index) => {
        if (!question.querySelector('input:checked')) {
            unanswered.push(index + 1); // Store question number (1-based index)
        }
    });

    return unanswered;
}
document.getElementById('Rater').addEventListener('click', function() {
  this.style.boxShadow = 'none'; // Remove the shadow on click

});
document.getElementById('identifier').addEventListener('click', function() {
  this.style.boxShadow = 'none'; // Remove the shadow on click

});


function calculateScore() {
    const spinnerElement = document.getElementById("spinner");


    // Display the spinner
    spinnerElement.style.display = "block"; // Ensure the spinner is shown
   
    // Hide the chart and feedback containers initially
    document.getElementById("chartContainer").style.display = "none"; 
    document.querySelector('.feedback-container').style.display = 'none';
    
    setTimeout(() => {

  let score =50;
        const answers = {};

        // Iterate through all questions
        newData.forEach(item => {
            const questionId = item.id;
            const value = document.querySelector(`input[name="q${questionId}"]:checked`);
            if (value) {
                const val = parseInt(value.value);
                const normalizedVal = item.isPositive 
                    ? (val - 4) * 1.25 // For positive questions
                    : (4 - val) * 1.25; // For negative questions

                score += normalizedVal;
                answers[`q${questionId}`] = (item.isPositive ? (val - 4) : (4 - val)) * 33.33;
            }
        });

        // Final score adjustment to be between 0 and 10
        score = (Math.max(0, Math.min(100, score)).toFixed(1)/10).toFixed(1);
        document.getElementById("score").innerHTML = `The provider's overall testimonial readiness score is <span style="color: red; font-weight: bold; border-bottom: 3px solid red;">${score}</span>`;


   // Determine strengths and weaknesses
        const sortedAnswers = Object.entries(answers).sort((a, b) => b[1] - a[1]);

        const strengths = sortedAnswers.slice(0, 2).map(([key]) => {
            const question = questions[key];
            // Fixed rounding logic to correctly map values to ratings
            return `${question}: ${AnswerText[Math.round((answers[key] / 33.33) + 4)]}`;  // Correction: Ensured rounding works properly
        });
        
        const weaknesses = sortedAnswers.slice(-2).map(([key]) => {
            const question = questions[key];
            // Fixed rounding logic to correctly map values to ratings
            return `${question}: ${AnswerText[Math.round((answers[key] / 33.33) + 4)]}`;  // Correction: Ensured rounding works properly
        });

        document.getElementById("strengths").innerText = strengths.join('\n');
        document.getElementById("weaknesses").innerText = weaknesses.join('\n');
        //  document.getElementById("feedback-container").style.display = 'block';

        // Display bar chart
        const barChart = document.getElementById("barChart");
        const elementPosition = barChart.getBoundingClientRect().top + window.scrollY;

        // Scroll to the element's position smoothly
    
        barChart.innerHTML = `<div class="axis top">
        <span class="left-span" >-100</span><span class="left-span" >-75</span ><span class="left-span" >-50</span><span class="left-span" >-25</span><span class="center-span" style="width: 0;" >0</span><span class="right-span">25</span><span class="right-span" >50</span><span class="right-span">75</span><span class="right-span">100</span>

        </div>
        <div class="axis bottom">
        <span class="left-span" >-100</span><span class="left-span" >-75</span ><span class="left-span" >-50</span><span class="left-span" >-25</span><span class="center-span" style="width: 0;" >0</span><span class="right-span">25</span><span class="right-span" >50</span><span class="right-span">75</span><span class="right-span">100</span>

        </div>`;
        
        Object.keys(answers).forEach((key) => {
            const value = answers[key];
            const color = value > 0 ? 'green' : 'red';
            const width = Math.abs(value) + "%";
            const positionStyle = value > 0 ? `left: 50%; transform: translateX(0);` : `right: 50%; transform: translateX(0);`;
            let bar =``;
            if(value==0){
                bar = `
                <div>
                <span class='spanQuerry'> (${key.split('q')[1]}) ${questions[key]} (${AnswerText[4]}) </span>
                <div class="axis">
                <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ><div class="half-circle"></div></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
            </div>
                    <div class="bar">
                        <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                    </div>
                    </div>
                `; 
            }
            else if (value==-99.99){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[1]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
        else if (value==-66.66){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[2]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
        else if (value==-33.33){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[3]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            else if (value==33.33){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[5]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            else if (value==66.66){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[6]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            else if (value==99.99){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[7]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            barChart.innerHTML += bar;
        });
        
        // Trigger the animation by setting the width after rendering
 setTimeout(() => {
    // Update bar widths
    const bars = document.querySelectorAll('.bar div');
    bars.forEach((bar, index) => {
        const value = answers[Object.keys(answers)[index]];
        const width = (value / 100) * 50;
        bar.style.width = Math.abs(width) + "%"; // Set bar width based on the answers
    });

    // Hide the spinner and show the feedback and chart containers
    document.getElementById("spinner").style.display = "none";
    document.querySelector('.feedback-container').style.display = 'block';
    document.querySelector('.chart-container').style.display = 'block';

    // Auto-scroll to the bottom of the page after the elements are shown
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight, // Scroll to the end of the page
            behavior: 'smooth' // Add smooth scrolling
        });
    }, 100); // A small delay to ensure the DOM is fully updated and visible

}, 3000); // Slight delay to ensure the DOM is fully updated

})       
    }





