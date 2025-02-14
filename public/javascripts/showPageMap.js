
maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: "streets-v2",
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.name}</h3></p>`
            )
    )
    .addTo(map)