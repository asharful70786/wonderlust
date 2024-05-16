let mapKey = mapToken ;
mapboxgl.accessToken = mapKey;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
});




const popup = new mapboxgl.Popup({ offset: 25 }).setText(
  'exact location will be provided after the booking'
);

const marker = new mapboxgl.Marker()
.setLngLat(coordinates)
.setPopup(popup)
.addTo(map);
