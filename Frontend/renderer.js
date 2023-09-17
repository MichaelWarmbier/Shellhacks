/*//// Data ////*/

const DisplayData = {
    DarkMode: false,
    QuestionData: null,
    LoginSession: null,
    PageIndex: 1,
    MenuIndex: 0,
    Menus: [ContentProblems, ContentResource, ContentAbout, ContentAnswer],
    Colors: [
        {
            Name: `--Content`,
            Dark: `#666666`,
            Light: `#c4bbbb`,
        },
        {
            Name: `--Other`,
            Dark: `#303030`,
            Light: `#d1c8bc`
        },
        {
            Name: `--Text`,
            Dark: `#c9c9c9`,
            Light: `#5e5e5e`
        },
        {
            Name: `--Select`,
            Dark: '#383838',
            Light: '#858585'
        },
        {
            Name: '--TableBlack',
            Dark: '#363636',
            Light: '#a1a1a1'
        },
        {
            Name: '--TextBlack',
            Dark: '#a1a1a1',
            Light: 'black'
        },
        {
            Name: '--Labels',
            Dark: '#b8b8b8',
            Light: '#474747'
        },
        {
            Name: '--LabelText',
            Dark: 'Black',
            Light: 'White'
        }
    ]
}


/*//// Initialization Function ////*/

window.onload = async () => {
    DisplayData.QuestionData = await window.questions.getQuestions();
    let data = DisplayData.QuestionData;
    let uniqueList = [];
    for (elem of data) {
        if (uniqueList.includes(elem.topic)) continue;
        uniqueList.push(elem.topic);
        const newDiv = document.createElement('div');
        newDiv.classList.add('filter_option')
        newDiv.innerHTML = elem.topic;
        FilterContainer.appendChild(newDiv);
    }
    renderTable();
    for (let i = 0; i < data.length / 10; i++) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('page');
        newDiv.onclick = () => { 
            for (page of document.querySelectorAll('.page'))
                page.style.transform = 'scale(1)';
            newDiv.style.transform = 'scale(1.5)';
            DisplayData.PageIndex = i + 1;
            renderTable();
        }
        PageSelect.appendChild(newDiv);
    }
    //console.log(requestServerDetails('Michael'))
}

/*//// General Functions ////*/

function toggleDarkMode() {
    DisplayData.DarkMode = !DisplayData.DarkMode;
    const lilDiv = document.querySelectorAll('#CelestialBody div')[0];
    for (elem of DisplayData.Colors)
        document.documentElement.style.cssText += `${elem.Name}: ${DisplayData.DarkMode ? elem.Dark : elem.Light}`;
    if (DisplayData.DarkMode) {
        NightLight.style.backgroundColor = 'black';
        CelestialBody.style.top = '4vh';
        CelestialBody.style.left = '-.2vw';
        CelestialBody.style.backgroundColor = 'white';
        CelestialBody.style.transform = 'rotate(360deg)';
        lilDiv.style.left = '-2vh';
        lilDiv.style.backgroundColor = 'black';
    } else {
        NightLight.style.backgroundColor = 'var(--BarRed);';
        CelestialBody.style.top = '.5vh';
        CelestialBody.style.left = '0';
        CelestialBody.style.backgroundColor = 'rgba(230, 158, 87, .7)';
        CelestialBody.style.transform = 'rotate(0deg)';
        lilDiv.style.left = '0';
        lilDiv.style.backgroundColor = '#dec34e';
    }
}

function renderTable() {
    let data = DisplayData.QuestionData;
    const Table = document.querySelectorAll('#ProblemList Table')[0];
    Table.innerHTML = '<tr><td style="font-weight: bold">Name</td><td style="font-weight: bold">Difficulty</td><td style="font-weight: bold">Status</td></tr>';
    let metronome = true;
    const bounds = (DisplayData.PageIndex - 1) * 10;
    while (data.length % 10 != 0) data.push(null);
    for (elem of data.slice(bounds, bounds + 9)) {
        const newRow = document.createElement('tr');
        for(index of [1, 2, 3]) {
            const newData = document.createElement('td');
            newRow.appendChild(newData);
            if (!elem) continue;
            switch (index) {
                case 1: 
                    let keywords = elem.keywords.join();
                    newData.innerHTML = `${keywords.split(',').splice(0, 2).join().replaceAll(',', '<br>')}`
                break;
                case 2: 
                    newData.innerHTML = `${elem.difficulty}&emsp;<span class="${elem.difficulty}_tag _${metronome} tag"><span>`;
                    break;
                case 3: 
                    newData.innerHTML = 'Complete';
                    newData.classList.add('Complete_tag'); 
                    break;
            }
        }
        Table.appendChild(newRow);
        newRow.style.backgroundColor = `${metronome ? 'var(--TableBlack)' : 'gray' }`;
        newRow.style.color = `${metronome ? 'var(--TextBlack)' : '#424242' }`;
        metronome = !metronome;
    }
}

function toggleContent(index) {
    const oldMenu = DisplayData.Menus[DisplayData.MenuIndex];
    const MenuContext = DisplayData.Menus[index];
    DisplayData.MenuIndex = index;

    oldMenu.style.opacity = '0';
    MenuContext.style.opacity = '1';
}

/*//// Cookie Methods ////*/

const getCookie = (name) => { document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '' }

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

/*//// Server Methods ////*/

async function updateUserDetails(user) { 
    let response = '';
    try { response = await fetch(`https://server-06.kirbout.repl.co/users?username=${user}`); }
    catch (e) { console.log(e); DisplayData.LoginSession = null; return; }
    return response.text();
} 

async function login(username, password) { 
    let session = '';
    try { session = await fetch(`https://server-06.kirbout.repl.co/login?username=${username}&password=${password}`); }
    catch (e) { console.log(e); DisplayData.LoginSession = null; return; }
    setCookie(session.text());
} 

/*//// Event Listeners ////*/

AccIcon.onclick = () => { 
    AccIcon.style.animation = 'hide .5s linear';
    AccIcon.style.animationFillMode = 'forwards';
}