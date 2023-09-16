/*//// Data ////*/

const Preferences = {
    DarkMode: false,
    loadedColors: [],
    Colors: [
        {
            Name: `--Content`,
            Dark: `#424242`,
            Light: `#c4bbbb`,
        },
        {
            Name: `--Other`,
            Dark: `#2b2b2b`,
            Light: `#424242`
        },
        {
            Name: `--Outline`,
            Dark: `#5c5c5c`,
            Light: `#7a7a7a`
        }
    ]
}

let questionData = null;


/*//// Initialization Function ////*/

window.onload = async () => {
    questionData = await window.questions.getQuestions();
    console.log(questionData);
    for (elem of questionData) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('filter_option')
        newDiv.innerHTML = elem.topic;
    
        let newColor = null;
        while (!newColor) {
            newColor = generateRandomColor();
            if (!Preferences.loadedColors.includes(newColor))
                newDiv.style.backgroundColor = newColor;
            else {
                Preferences.loadedColors.push(newColor);
                newColor = null;
            }
        }

        FilterContainer.appendChild(newDiv);
    }
}

/*//// General Functions ////*/

function toggleDarkMode() {
    Preferences.DarkMode = !Preferences.DarkMode;
    for (elem of Preferences.Colors)
        document.documentElement.style.cssText += `${elem.Name}: ${Preferences.DarkMode ? elem.Dark : elem.Light}`
}

function generateRandomColor() {
    let color = ['FF', 'FF', 'FF'];
    let slotNum = Math.floor(Math.random() * 2 + 1);
    while (slotNum > 0) { color[Math.floor(Math.random() * 3)] = 'CC'; slotNum--; }
    return `#${color.join().replaceAll(',', '')}`
}

/*//// Event Listeners ////*/

AccIcon.onclick = () => { 
    AccIcon.style.animation = 'hide .5s linear';
    AccIcon.style.animationFillMode = 'forwards';
}