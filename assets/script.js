var nameRender = document.getElementById("cityname");
var mainTemp = document.getElementById("maintemp");
var mainwind =document.getElementById("mainwind")
var mainhumid = document.getElementById("mainhumid");
var uv = document.getElementById("uv");
var uvbox = document.getElementById("uvbox")

var submitcity = document.getElementById("submitcity");
var searchBtn = document.getElementById("searchBtn")

var sidebar = document.getElementById("sidebar")
var errorMsg = document.getElementById('errorMsg');
var maincontainer = document.getElementById('console')

var lon ;
var lat ; 
var city ;
var totalBtnsArray = [];

var maindate = moment().format("dddd, MMMM Do");
$('#date').text(maindate);
console.log(maindate);

var oneDayAway = moment().add(1,"days").format("dddd")
console.log(oneDayAway);
$('#oneDayAway').text(oneDayAway)

var twoDA = moment(). add(2, 'days').format("dddd")
$('#twoDayAway').text(twoDA);

var threeDA = moment(). add(3, 'days').format("dddd")
$('#threeDayAway').text(threeDA);

var fourDA = moment(). add(4, 'days').format("dddd")
$('#fourDayAway').text(fourDA)

var fiveDA = moment(). add(5, 'days').format("dddd")
$("#fiveDayAway").text(fiveDA)

searchBtn.addEventListener('click', getFirstApi)

function getFirstApi(){
    if ($('#errorMsg').hasClass('hide')){
        var hi = "hi"
    } else {
        errorMsg.classList.add('hide')
    }
    maincontainer.classList.remove('hide');
    var tempcity = submitcity.value.trim();
    var firstRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${tempcity}&units=imperial&appid=653c3d756cdb491e49246259dd8b749c`

    fetch (firstRequestUrl)
    .then (function(response){
        return response.json();
    })
    .then(function(data){
        city = data.name
        console.log(city);
        var cityT= {
                lon: data.coord.lon, 
                lat: data.coord.lat,
            }
        lon = data.coord.lon
        lat = data.coord.lat
        console.log(data);
        var cityBtn = document.createElement("button");
        cityBtn.textContent = data.name;
        sidebar.append(cityBtn);
        cityBtn.classList.add('allbuttons',"btn", "btn-lg", 'btn-block');
        cityBtn.setAttribute("value", city)
        totalBtnsArray.push(city)
        console.log(city);
        localStorage.setItem(city, JSON.stringify(cityT))
        localStorage.setItem("count", JSON.stringify(totalBtnsArray))
        renderCityTemp();
    })
    .catch((error) => {
        errorMsg.classList.remove('hide');
    })
}

function initial () {
    var stored = JSON.parse(localStorage.getItem("count"))
    console.log(stored);
    if (stored == null) {
        return;
    } else {
    totalBtnsArray = JSON.parse(localStorage.getItem("count"))
    for( i = 0 ; i < totalBtnsArray.length; i++) {
        var initialBtn = document.createElement('button');
        initialBtn.textContent= totalBtnsArray[i];
        sidebar.append(initialBtn);
        initialBtn.classList.add("allbuttons", "btn", "btn-lg", "btn-block")
        initialBtn.setAttribute("value", totalBtnsArray[i])
    }}
}

var allBtns = document.querySelectorAll("allbuttons")


$(document).on('click', '.allbuttons', getLocation);

function getLocation(event){
    event.preventDefault();

    console.log("I just got clicked")
    console.log("event.target:", event.target)
    console.log(event.target.value);
    
    city = event.target.value 

    var storedPlace = JSON.parse(localStorage.getItem(city))

    console.log(storedPlace);

    lat = storedPlace.lat
    lon = storedPlace.lon
    console.log(lat, lon);
    renderCityTemp()
}


initial()

var dailytemps = document.getElementsByClassName('daytemp');
var dailywind = document.getElementsByClassName('daywind');
var dailyhumid = document.getElementsByClassName('dayhumid');
var wPic = document.getElementsByClassName('wPic');

console.log(dailytemps);
console.log(dailywind);
console.log(dailywind);

function uvQuality (){
    if (uvValue < 3){
        uvbox.classList.add('green')
    }else if (uvValue < 6){
        uvbox.classList.add('yellow')
    }else if(uvValue < 8) {
        uvbox.classList.add('orange')
    }else if (uvValue < 11){
        uvbox.classList.add('red')
    }else {
        uvbox.classList.add('violet')
    }
}

var uvValue;

function renderCityTemp() {
    maincontainer.classList.remove('hide');
    var renderUrl= `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,alerts&appid=653c3d756cdb491e49246259dd8b749c`

    fetch (renderUrl)
    .then (function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);

        nameRender.textContent = city;
        mainTemp.textContent = data.current.temp;
        mainwind.textContent = data.current.wind_speed;
        mainhumid.textContent = data.current.humidity;
        uvValue = data.current.uvi;
        uv.textContent = uvValue;
        uvQuality();
        for (i = 0; i < dailytemps.length; i++){
            var icon = data.daily[i].weather[0].icon;
            var img = document.createElement('img');
            img.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
            wPic[i].innerHTML= ""
            wPic[i].append(img);
            console.log(wPic[0]);
            dailytemps[i].textContent = data.daily[i].temp.day;
            dailywind[i].textContent = data.daily[i].wind_speed;
            dailyhumid[i].textContent = data.daily[i].humidity;
        }
    })
}

// how to add to existing tags with text
// var paragraph = document.getElementById("p");
// var text = document.createTextNode("This just got added");

// paragraph.appendChild(text);

// also have appendchild texts for celsius and percentages in the end