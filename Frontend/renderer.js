/*//// Data ////*/

const DisplayData = {
    DarkMode: false,
    QuestionData: null,
    LoginSession: null,
    PageIndex: 1,
    MenuIndex: 0,
    ActiveFilter: '',
    ActiveQuery: '',
    Menus: [ContentProblems, ContentResource, ContentAbout, ContentAnswer, ContentLogin],
    UserData: null,
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
            Dark: '#262626',
            Light: '#474747'
        },
        {
            Name: '--LabelText',
            Dark: 'gray',
            Light: 'White'
        }
    ]
}


/*//// Initialization Function ////*/

window.onload = async () => {
    login('','');
    //await checkLogin();
    if (!DisplayData.LoginSession) toggleContent(4);
    DisplayData.QuestionData = await window.questions.getQuestions();
    let data = DisplayData.QuestionData;
    let uniqueList = [];
    for (elem of data) {
        if (uniqueList.includes(elem.topic)) continue;
        uniqueList.push(elem.topic);
        const newDiv = document.createElement('div');
        newDiv.classList.add('filter_option')
        newDiv.innerHTML = elem.topic;
        let into = elem.topic;
        newDiv.onclick = function() { 
            updateFilter(into); 
            renderTable();
        }
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
        NightLight.style.backgroundColor = 'gray';
        CelestialBody.style.top = '.5vh';
        CelestialBody.style.left = '0';
        CelestialBody.style.backgroundColor = 'rgba(230, 158, 87, .7)';
        CelestialBody.style.transform = 'rotate(0deg)';
        lilDiv.style.left = '0';
        lilDiv.style.backgroundColor = '#dec34e';
    }
}

async function renderTable() {
    /* Filter Data */
    if (!DisplayData.ActiveFilter && !DisplayData.ActiveQuery) DisplayData.QuestionData = await window.questions.getQuestions();
    else DisplayData.QuestionData = await window.questions.getFilter([], [], DisplayData.ActiveQuery);
    let data = DisplayData.QuestionData;

    /* Generate Table */
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
                    let name = `${keywords.split(',').splice(0, 2).join().replaceAll(',', '<br>')}`;
                    newData.innerHTML = `<span class="question" onclick="openQuestion(${elem.ID})">${name}</span>`
                break;
                case 2: 
                    newData.innerHTML = `${elem.difficulty}&emsp;<span class="${elem.difficulty}_tag _${metronome} tag"><span>`;
                    break;
                case 3: 
                    newData.innerHTML = 'Incomplete';
                    newData.classList.add('Incomplete_tag'); 
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
    for (let i = 0; i < DisplayData.Menus.length; i++) {
        if (i !== index) {
            DisplayData.Menus[i].style.opacity = '0';
            DisplayData.Menus[i].style.pointerEvents = 'None';
        }
        else {
            DisplayData.Menus[i].style.opacity = '1';
            DisplayData.Menus[i].style.pointerEvents = 'Auto';
        }
    }
}

function openQuestion(ID) {
    console.log(ID);
    toggleContent(3);
    for (elem of DisplayData.QuestionData)
        if (elem.ID == ID) {
            document.querySelectorAll('#ContentAnswer h1')[0].innerHTML = elem.title;
            return;
        }
}

function updateFilter(name) { 
    DisplayData.ActiveFilter = name; 
    renderTable();
}

function updateSearch() {
    const Value = document.querySelector('#SearchProblems Input').value;
    DisplayData.ActiveQuery = Value;
    renderTable();
}

function toggleLogin(face) {
    switch (face) {
        case 0: 
            Login.style.transform = 'rotateY(0deg)';
            Register.style.transform = 'rotateY(180deg)';
            setTimeout(() => { 
                Login.style.zIndex = 1;
                Register.style.zIndex = -1;
            }, 350);
            break;
        case 1:
            Login.style.transform = 'rotateY(-180deg)';
            Register.style.transform = 'rotateY(0deg)';
            setTimeout(() => { 
                Login.style.zIndex = -1;
                Register.style.zIndex = 1;
            }, 350);
            break;
    }
}

function warn(msg) {
    Warn.innerHTML = msg;
    Warn.style.opacity = .4;
    setTimeout(() => { Warn.style.opacity = 0; }, 3000);
}

/*//// Server Methods ////*/

async function updateUserDetails(user) { 
    let response = '';
    try { response = await fetch(`https://server-06.kirbout.repl.co/users?username=${user}`); }
    catch (e) { console.log(e); DisplayData.LoginSession = null; return; }
    return response.text();
} 

async function login() { 

    let data = null;
    let prefs = await window.user.LoadPreferences();
    if (prefs.Prefs.DarkMode) toggleDarkMode();

    if (!prefs.Prefs.Session) {
        let resp = await window.user.Login(User.value, Pass.value);
        if (User.value == '' || Pass.value == '') { 
            warn("Please enter a username and password");
            return;
        }
        if (resp && resp !== "Invalid") {
            DisplayData.LoginSession = resp;
            toggleContent(0);
        } else if (!resp) warn("Unable to fetch server data");
        else warn("Incorrect login information. Please try again")
        try {
            data = await window.user.GetUser(User.value);
            console.log("Current Session: " + await data.Session);
        }
        catch { warn("Unabble to connect to server"); return; }
        await window.user.SavePreferences(`{"Prefs": {"DarkMode": ${prefs.DarkMode}, "Session": ${await data.Session}, "LastLogged": ${data.Username}}}`)
    } else if (prefs.Prefs.LastLogged) {
        try {
            data = await window.user.GetUser(prefs.Prefs.LastLogged);
            console.log("Current Session: " + await data.Session);
        }
        catch { warn("Could not verify user login"); return; }
        if (data.Session === prefs.Prefs.Session) {
            toggleContent(0);
            return;
        }
    } else { return; }
    
    DisplayData.UserData = data;
    const totalQuestions = (await window.questions.getQuestions()).length;
    CompleteInfo.style.background = `linear-gradient(90deg, var(--BarGreen) ${Math.floor(data.Solved/totalQuestions) + .1}%, var(--BarRed) ${Math.floor(data.Solved/totalQuestions) + .1}%, var(--BarRed) 100%)`; 
    CompleteInfo.innerHTML = `${data.Solved}/${totalQuestions}`;
} 

async function register() {
    user = UserTry.value;
    pass1 = Pass1.value;
    pass2 = Pass2.value;
    if (pass1 != pass2) {
        warn("Both passwords must match");
        return;
    }
    if (!user || !pass1 || !pass2) {
        warn("Please enter a username and verify your password");
        return;
    }
}