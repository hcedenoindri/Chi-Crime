import {MDCTabBar} from '@material/tab-bar';
import {MDCRipple} from '@material/ripple';
import {MDCMenu} from '@material/menu';
import {MDCSelect} from '@material/select';
import {MDCTopAppBar} from '@material/top-app-bar';

const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
  return new MDCRipple(el);
});
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const select = new MDCSelect(document.querySelector('.mdc-select'));
const menu = new MDCMenu(document.querySelector('.mdc-menu'));
const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

let handler;
document.querySelectorAll(".hidden").forEach( (page) => {
    page.style.display='none';
});
  
let show = (elem) => {
    let shown = document.querySelector('.shown');
    let hidden = document.querySelector('div#' + elem);
    if (shown == hidden) {
        return;
    }

    shown.classList.remove("shown");
    hidden.classList.remove("hidden");
    shown.classList.add("hidden");
    hidden.classList.add("shown");

    document.querySelector(".shown").style.display='block';

    document.querySelectorAll(".hidden").forEach( (page) => {
        page.style.display='none';
    });
};

document.querySelectorAll('.tab-button').forEach( (button) => {
    let elem = button.getAttribute("id");
    button.addEventListener('click', handler = () => {
        show(elem);
    });
});

let db;
Dexie.exists("crimes-database").then( (exists) => {
    if (!exists) {
        db = new Dexie("crimes_database");
        db.version(1).stores({
            crimes: 'id,case_number,date,block,iucr,primary_type,' +
                    'description,location_description,arrest,domestic,beat,' +
                    'district,ward,community_area,fbi_code,x_coordinate,' +
                    'y_coordinate,year,updated_on,latitude,longitude'
        });
        fetch("https://data.cityofchicago.org/resource/crimes.json")
        .then( (response) => {return response.json()})
        .then( (data) => {
            for (let crime of data) {
                let date = crime.date;
                let date_formatted = date.slice(11,14) + date.slice(14,16) + "PM. " +
                                     date.slice(5,7) + "/" + date.slice(8,10) +
                                     "/" + date.slice(0,4);
                db.crimes.put({
                    id: crime.id, case_n: crime.case_number, date: date_formatted,
                    block: crime.block, iucr: crime.iucr, type: crime.primary_type,
                    desc: crime.description, location_desc: crime.location_description,
                    arrest: crime.arrest, domestic: crime.domestic, beat: crime.beat,
                    district: crime.district, ward: crime.ward, comm_area: crime.community_area,
                    fbi_code: crime.fbi_code, x_coord: crime.x_coordinate, y_coord: crime.y_coordinate,
                    year: crime.year, timestamp: crime.updated_on, lat: crime.latitude,
                    lng: crime.longitude 
                });
            }

            for (let field of Object.keys(data[0])) {
                if (field[0] == ":" || field == "location") {
                    continue;
                }
                let initOption = document.querySelector("#option");
                let newOption = initOption.cloneNode(true);
                newOption.querySelector("#option-label").innerText = field;
                document.querySelector("#filter-listbox").append(newOption);
                
                let example = document.createElement('a');
                example.innerHTML = field + ": " + data[0][field] + ".<br>";
                document.querySelector("div#search").append(example);
            }
        });
    }
});



