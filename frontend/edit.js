import { BASE_URL } from "./config.js";

//
document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server and populate dropdown
    fetch(`${BASE_URL}/api/data`)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('questionDropdown');
            
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.question;
                dropdown.appendChild(option);
            });

            // Update the input fields when a question is selected
            dropdown.addEventListener('change', () => {
                const selectedId = dropdown.value;
                const selectedQuestion = data.find(q => q.id === parseInt(selectedId, 10));

                if (selectedQuestion) {
                    document.getElementById('questionInput').value = selectedQuestion.question;
                    document.getElementById('phraseInput').value = selectedQuestion.phrase;
                    document.getElementById('isPositiveInput').value = selectedQuestion.isPositive ? 'true' : 'false';
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
// for question deletion 
document.getElementById('deleteButton').addEventListener('click', (e) => {
    console.log(e)
    const selectedId = document.getElementById('questionDropdown').value;

    if (selectedId) {
        // Send request to delete the question
        fetch(`${BASE_URL}/api/delete-question/${selectedId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Question deleted successfully!');
                // Optionally refresh or update the dropdown
                location.reload();
            } else {
                alert('Failed to delete question.');
            }
        })
        .catch(error => console.error('Error deleting question:', error));
    } else {
        alert('Please select a question to delete.');
    }
});

// Handle question update
document.getElementById('saveButton').addEventListener('click', () => {
    const selectedId = document.getElementById('questionDropdown').value;
    const updatedQuestionText = document.getElementById('questionInput').value;
    const updatedPhrase = document.getElementById('phraseInput').value;
    const updatedIsPositive = document.getElementById('isPositiveInput').value === 'true';

    if (selectedId && updatedQuestionText) {
        const updatedQuestion = {
            id: parseInt(selectedId, 10),
            question: updatedQuestionText,
            phrase: updatedPhrase,
            isPositive: updatedIsPositive
        };

        console.log(updatedQuestion);

        // Send updated data to the backend
        fetch(`${BASE_URL}/api/update-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedQuestion) // <-- Corrected here
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Question updated successfully!');
                location.reload();
            } else {
                alert('Failed to update question.');
            }
        })
        .catch(error => console.error('Error sending data:', error));
    } else {
        alert('Please select a question and fill in the required fields.');
    }
});


// Handle adding new questions
document.getElementById('add-question-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const newQuestion = document.getElementById('newQuestion').value;
    const newPhrase = document.getElementById('newPhrase').value;
    const isPositive = document.getElementById('isPositive').value === 'true';
    const index = parseInt(document.getElementById('index').value, 10)-1;

    if (!newQuestion || !newPhrase || isNaN(index)) {
        alert('Please fill in all fields.');
        return;
    }

    const newQuestionData = {
        newQuestion,
        newPhrase,
        isPositive,
        index
    };

    // Send the new question data to the backend
    fetch(`${BASE_URL}/api/add-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestionData)
    })
    .then(response => response.json())
    .then(result => {
        const responseMessage = document.getElementById('responseMessage');
        if (result.success) {
            responseMessage.textContent = 'Question added successfully!';
            responseMessage.style.color = 'green';
            location.reload();
        } else {
            responseMessage.textContent = 'Error: ' + result.message;
            responseMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error adding question:', error);
        document.getElementById('responseMessage').textContent = 'Error adding question.';
    });

    // Clear form inputs
    document.getElementById('newQuestion').value = '';
    document.getElementById('newPhrase').value = '';
    document.getElementById('isPositive').value = 'true';
    document.getElementById('index').value = '';
});
