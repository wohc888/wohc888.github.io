const body = document.querySelector('body');
    askForm = document.querySelector('.askName'),
    ask = askForm.querySelector('.ask'),
    askInput = askForm.querySelector('.name-input'),
    greet = document.querySelector('.greet')
    clock = document.querySelector('.clock'),
    weather = document.querySelector('.weather'),
    toDoForm = document.querySelector('.toDo-form'),
    toDoInput = toDoForm.querySelector('.toDo-input'),
    toDoList = document.querySelector('.toDo-list');

const NAME = 'NAME',
    COORDS = 'COORDS',
    TODOS = 'TODOS';

let toDoTable = [];

const IMG_NUM = 5;

const API_KEY = '997b1aa499cb14cf6ac6d58362166ecf';

function loadName(name){
    greet.innerHTML = `Hey, ${name}!`
}

function handleNameSubmit(e){
    e.preventDefault();
    const name = askInput.value;
    loadName(name);
    localStorage.setItem(NAME, name)
    askForm.classList.add('hide');
}

function nameCheck(){
    const isName = localStorage.getItem(NAME);
    if(isName){
        loadName(isName);
    }else{
        askForm.classList.remove('hide');
        askForm.addEventListener('submit', handleNameSubmit);
    }
}

function setClock(){
    const time = new Date();
    const hr = time.getHours(),
        min = time.getMinutes();
    
    clock.innerHTML = `${hr < 10 ? '0'+hr : hr}:${min < 10 ? '0'+min:min}`
}

function coordCheck(){
    const isCoord = JSON.parse(localStorage.getItem(COORDS));
    
    if(isCoord){
        getWeather(isCoord.latitude, isCoord.longitude);

    } else{
        askCoord();
    }
}

function getWeather(lat, lon){
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        ).then(fetchedData => {
            return fetchedData.json();
        }).then(json => {
            const temperature = json.main.temp;
            const place = json.name;
            const description = json.weather[0].description;
            weather.innerHTML = `${place}, ${temperature}C, ${description}`;
        })
}

function askCoord(){
    navigator.geolocation.getCurrentPosition(handleCoord, handleCoordError);
}

function handleCoord(position){
    const longitude = position.coords.longitude,
        latitude = position.coords.latitude;
    const coords = {
        longitude,
        latitude
    };
    saveCoords(coords);
    getWeather(coords.latitude, coords.longitude);
}

function handleCoordError(){
    console.log('cant get coords');
}

function saveCoords(coords){
    localStorage.setItem(COORDS, JSON.stringify(coords));
}

function toDosCheck(){
    toDoTable = JSON.parse(localStorage.getItem(TODOS)) || [];
    if(toDoTable){
        restoreToDos();
    }
}

function restoreToDos(){
    toDoTable.forEach(toDo => {
        paintToDo(toDo);
    })
}

function handleToDoSubmit(e){
    e.preventDefault();
    const toDoObj = genToDoObj(toDoInput.value);
    toDoInput.value = "";
    paintToDo(toDoObj);
    saveState();
}

function genToDoObj(toDo){
    const id = String(Date.now());
    const toDoObj = {
        id,
        toDo
    };
    return toDoObj;
}

function paintToDo(Obj){
    const span = document.createElement('span'),
        doneBtn = document.createElement('button'),
        li = document.createElement('li');

    span.innerHTML = Obj.toDo + ' ';
    doneBtn.classList.add('far');
    doneBtn.classList.add('fa-check-circle');
    doneBtn.addEventListener('click', handleDoneClick);
    li.append(doneBtn, span);
    li.id = Obj.id;

    toDoList.appendChild(li);
    toDoTable.push(Obj);
}

function handleDoneClick(e){
    e.preventDefault();
    const target = e.target.parentNode;
    deleteFromTable(target.id);
    toDoList.removeChild(target);
}

function deleteFromTable(id){
    toDoTable = toDoTable.filter(toDo => {
        return toDo.id !== id;
    });
    saveState();
}

function saveState(){
    localStorage.setItem(TODOS, JSON.stringify(toDoTable));
}

function generateRandom(){
    const num = Math.floor(Math.random() * IMG_NUM);
    return num;
}

function paintImg(num){
    const image = new Image();
    image.src = `img/IMG_${num + 1}.jpeg`;
    image.classList.add("bgImage");
    body.prepend(image);
}

function init(){
    const randomNum = generateRandom();
    paintImg(randomNum);
    nameCheck();
    setClock();
    setInterval(setClock, 1000);
    coordCheck();
    toDosCheck();
    toDoForm.addEventListener("submit", handleToDoSubmit);
}

init();


{/* <i class="far fa-check-circle"></i> */}