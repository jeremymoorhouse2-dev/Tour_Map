mapboxgl.accessToken = "pk.eyJ1Ijoiam1vb3Job3VzZSIsImEiOiJjbW13YWVoenYydXQ1MnJwbGVlemRxdzdtIn0.6TPYi4u6gPKJmjUrXj4Orw";

const canadaBounds = [
  [-141.5, 41.5], // southwest [lng, lat]
  [-52.0, 83.5]   // northeast [lng, lat]
];

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  bounds: canadaBounds,
  fitBoundsOptions: {
    padding: 30
  },
  maxBounds: canadaBounds
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

map.on("load", () => {
  map.addSource("tour-points", {
    type: "geojson",
    data: "data/tour-points.geojson"
  });

  map.addLayer({
    id: "visited-points",
    type: "circle",
    source: "tour-points",
    filter: ["==", ["get", "status"], "visited"],
    paint: {
      "circle-radius": 7,
      "circle-color": "#D52B1E",
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1.5
    }
  });

  map.addLayer({
    id: "planned-points",
    type: "circle",
    source: "tour-points",
    filter: ["==", ["get", "status"], "planned"],
    paint: {
      "circle-radius": 6,
      "circle-color": "#8C8C8C",
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1.5
    }
  });

  const popupLayers = ["visited-points", "planned-points"];

  popupLayers.forEach((layerId) => {
    map.on("click", layerId, (e) => {
      const feature = e.features && e.features[0];
      if (!feature) return;

      const props = feature.properties || {};
      const coordinates = feature.geometry.coordinates.slice();

      const name = props.name || "Untitled site";
      const province = props.province || "";
      const status = props.status || "";
      const type = props.type || "";
      const date = props.date || "";
      const summary = props.summary || "";

      const html = `
        <div>
          <h3 class="popup-title">${name}</h3>
          <p class="popup-meta">
            ${[province, status, type, date].filter(Boolean).join(" · ")}
          </p>
          <p class="popup-summary">${summary}</p>
        </div>
      `;

      new mapboxgl.Popup({ offset: 12 })
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(map);
    });

    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });
  });
});
