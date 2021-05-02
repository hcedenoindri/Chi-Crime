// Home and results map
let map1;
let map2;
function initMap() {
    // let map_properties = {
    //     center: geolocated,
    //     zoom: 14,
    // };
    // map1 = new google.maps.Map(document.querySelector('#home-map'), map_properties);

    map_properties = {
        center: new google.maps.LatLng(41.88145468743958, -87.63328143107563),
        zoom: 11,
    };
    map2 = new google.maps.Map(document.querySelector('#results-map'), map_properties);
}

db = new Dexie("crimes_database");
db.version(1).stores({
    crimes: 'id,case_number,date,block,iucr,primary_type,' +
            'description,location_description,arrest,domestic,beat,' +
            'district,ward,community_area,fbi_code,x_coordinate,' +
            'y_coordinate,year,updated_on,latitude,longitude'
});
db.open().catch( (err) => {
    console.error (err);
});

db.crimes.orderBy('date').reverse().limit(100).each( (crime) => {
    let new_card = document.createElement("div");
    let title = document.createElement("h3");
    let subtitle = document.createElement("h4");
    let text = document.createElement("span");
    new_card.classList.add(["mdc-card", "crime-card"]);
    
    title.innerText = crime.type;
    subtitle.innerText = crime.block;
    text.innerText = "ID: " + crime.id + ". " + crime.date;
    new_card.append(title, subtitle, text);

    let marker = new google.maps.Marker({ 
      position: new google.maps.LatLng(crime.lat, crime.lng)
    });
    marker.setMap(map2);

    let infowindow = new google.maps.InfoWindow({
      content: new_card
    });
    marker.addListener("click", () => {
      infowindow.open(map2, marker);
    });
});


