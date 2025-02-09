document.addEventListener('DOMContentLoaded', function() {
    // Function to handle scrolling and highlighting
    function scrollToSection(linkId, sectionSelector) {
        const link = document.getElementById(linkId);
        const section = document.querySelector(sectionSelector);

        link.addEventListener('click', function(event) {
            event.preventDefault();

            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            section.classList.add('highlighted');

        });
    }

    // Apply the function to each link and section
    scrollToSection('whoWeAreBtn', '.hero');
    scrollToSection('dietLink', '#dietBox');
    scrollToSection('physicalHealthBtn', '#physicalHealthBox');

    // Go to the Selected Section
    const mentalHealthIntro = document.querySelector('.mentalHealthIntro');

    const whatWeDoBtn = document.getElementById('whatWeDoBtn');
    whatWeDoBtn.addEventListener('click', function(event) {
        event.preventDefault();

        mentalHealthIntro.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        mentalHealthIntro.classList.add('highlighted');

        setTimeout(function() {
            mentalHealthIntro.classList.remove('highlighted');
        }, 3000);

    })

});

// Function to toggle visibility
function showSection(toShow, toHide) {
    toShow.style.display = 'block';
    toHide.style.display = 'none';
}

// Event Listener for Diet Link
function dietToggle() {
    const dietBox = document.querySelector('#dietBox');
    const physicalHealthBox = document.querySelector('#physicalHealthBox');
    if (dietBox.style.display === 'none') {
        showSection(dietBox, physicalHealthBox);
    }
    showDiet();
}

// Event Listener for Exercise Link
function exerciseToggle() {
    const dietBox = document.querySelector('#dietBox');
    const physicalHealthBox = document.querySelector('#physicalHealthBox');
    if (physicalHealthBox.style.display === 'none') {
        showSection(physicalHealthBox, dietBox);
    }
    showExercise();
}

// DIET-API
document.querySelector('#dietLink').addEventListener('click', dietToggle);
document.querySelector('#getDietButton').addEventListener('click', getSelectedDiet);

function showDiet() {
    const dietBox = document.querySelector('#dietBox');
    dietBox.style.display = 'block';
}

function getSelectedDiet() {
    const dietType = document.querySelector('#dietType').value;
    fetchUserDiet(dietType);
}

async function fetchUserDiet(type) {
    const apiKey = '32a8f96f9b1c4f489a8a80d4f51fc20e';
    const endpoint = `https://api.spoonacular.com/recipes/complexSearch?diet=${type}&number=8&apiKey=${apiKey}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            let recommendations = '';
            data.results.forEach(recipe => {
                recommendations += `
                    <div>
                        <h3>${recipe.title}</h3>
                        <img src="${recipe.image}" alt="${recipe.title}" width="100">
                        <p><a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank">View Recipe</a></p>
                    </div>
                `;
            });
            document.getElementById('dietSuggestions').innerHTML = recommendations;
            document.getElementById('dietSuggestions').style.display = 'grid';
        }
    } catch (error) {
        console.error('Error fetching diet data:', error);
        document.getElementById('dietSuggestions').innerHTML = 'Error fetching diet suggestions.';
    }
}

// PHYSICAL HEALTH - API
document.querySelector('#physicalHealthBtn').addEventListener('click', exerciseToggle);
document.querySelector('#getExercisesBtn').addEventListener('click', getSelectedExercise);

function showExercise() {
    document.querySelector('#physicalHealthBox').style.display = 'block';
}

function getSelectedExercise() {
    const exerciseType = document.querySelector('#exerciseType').value;
    fetchExercises(exerciseType);
}

async function fetchExercises(type) {
    const apiKey = 'cc65018371msh27356ce58896615p1ebc2djsn88b4e9e7967b';
    const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${type}?limit=8`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        });

        const data = await response.json();

        if (data.length > 0) {
            let exerciseList = '';
            data.forEach(exercise => {
                exerciseList += `
                    <div class="exercise">
                        <h3>${exercise.name}</h3>
                        <p><strong>Target Muscle:</strong> ${exercise.target}</p>
                        <img src="${exercise.gifUrl}" alt="${exercise.name}" width="200">
                    </div>
                `;
            });

            document.getElementById('exerciseSuggestions').innerHTML = exerciseList;
            document.getElementById('exerciseSuggestions').style.display = 'grid';
        } else {
            document.getElementById('exerciseSuggestions').innerHTML = 'No exercises found.';
        }
    } catch (error) {
        console.error('Error fetching exercise data:', error);
        document.getElementById('exerciseSuggestions').innerHTML = 'Error fetching exercises.';
    }
}
