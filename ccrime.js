import {MDCTabBar} from '@material/tab-bar';
import {MDCRipple} from '@material/ripple';
import {MDCMenu} from '@material/menu';

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

fetch("https://data.cityofchicago.org/resource/crimes.json")
.then ( (response) => {return response.json() })
.then ( (result) => {
    for (let field of Object.keys(result[0])) {
        if (field[0] == ":") {
          continue;
        }
        console.log(field);
        // let opt = document.createElement("option");
        // opt.innerText = field;
        // document.querySelector("#fields").append(opt);
        
        // let example = document.createElement('a');
        // example.innerHTML = field + ": " + result[0][field] + ".<br>";
        // document.querySelector("#form").append(example);

    }
//   let br = document.createElement("br");
//   document.querySelector("#form").append(br);

});

