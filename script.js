mapboxgl.accessToken = "pk.eyJ1Ijoiam1vb3Job3VzZSIsImEiOiJjbW13YWVoenYydXQ1MnJwbGVlemRxdzdtIn0.6TPYi4u6gPKJmjUrXj4Orw";

function applyCanadaSetup(map) {
  map.addSource("country-mask", {
    type: "vector",
    url: "mapbox://mapbox.country-boundaries-v1"
  });

  map.addLayer({
    id: "country-mask-fill",
    type: "fill",
    source: "country-mask",
    "source-layer": "country_boundaries",
    filter: ["!=", ["get", "iso_3166_1_alpha_3"], "CAN"],
    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": 0.5
    }
  });
}

function addCanadaReferenceLayers(map) {
  map.addSource("mapbox-reference", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-streets-v8"
  });

  // Canada national border (dark charcoal)
  map.addLayer({
    id: "canada-country-border",
    type: "line",
    source: "mapbox-reference",
    "source-layer": "admin",
    filter: [
      "all",
      ["==", ["get", "admin_level"], 0],
      [
        "any",
        ["==", ["get", "iso_3166_1"], "CA"],
        ["==", ["get", "iso_3166_1"], "CA-US"]
      ]
    ],
    paint: {
      "line-color": "#2B2B2B",
      "line-width": 1.8,
      "line-opacity": 0.95
    }
  });

  // Canada province boundaries
  map.addLayer({
    id: "canada-province-boundaries",
    type: "line",
    source: "mapbox-reference",
    "source-layer": "admin",
    filter: [
      "all",
      ["==", ["get", "iso_3166_1"], "CA"],
      ["==", ["get", "admin_level"], 1]
    ],
    paint: {
      "line-color": "#B5B5B5",
      "line-width": 0.8,
      "line-opacity": 0.7
    }
  });

  // Canada label
  map.addLayer({
    id: "canada-country-label",
    type: "symbol",
    source: "mapbox-reference",
    "source-layer": "place_label",
    filter: [
      "all",
      ["==", ["get", "iso_3166_1"], "CA"],
      ["==", ["get", "class"], "country"]
    ],
    layout: {
      "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
      "text-size": 20,
      "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"]
    },
    paint: {
      "text-color": "#444444",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1
    }
  });

  // Province labels
  map.addLayer({
    id: "canada-province-labels",
    type: "symbol",
    source: "mapbox-reference",
    "source-layer": "place_label",
    filter: [
      "all",
      ["==", ["get", "iso_3166_1"], "CA"],
      ["==", ["get", "class"], "state"]
    ],
    layout: {
      "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
      "text-size": 14,
      "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"]
    },
    paint: {
      "text-color": "#777777",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1
    }
  });

  // City labels (optional — remove if too busy)
  map.addLayer({
    id: "canada-city-labels",
    type: "symbol",
    source: "mapbox-reference",
    "source-layer": "place_label",
    filter: [
      "all",
      ["==", ["get", "iso_3166_1"], "CA"],
      ["==", ["get", "class"], "settlement"]
    ],
    layout: {
      "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3, 10,
        6, 12
      ],
      "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"]
    },
    paint: {
      "text-color": "#555555",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1
    }
  });
}

const canadaBounds = [
  [-141.0, 41.0],
  [-52.0, 70.5]
];

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/jmoorhouse/cmnymfb57001101scek64hfrl",
  bounds: canadaBounds,
  fitBoundsOptions: {
    padding: 30
  },
  maxBounds: canadaBounds
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

map.on("load", () => {
  applyCanadaSetup(map);
  addCanadaReferenceLayers(map);

  map.addSource("tour-points", {
    type: "geojson",
    data: "data/tour-points.geojson"
  });

  map.addSource("tour-route", {
    type: "geojson",
    data: "https://raw.githubusercontent.com/jeremymoorhouse2-dev/Tour_Map/main/data/tour-route.geojson"
  });

  map.addLayer({
    id: "route-completed",
    type: "line",
    source: "tour-route",
    filter: ["==", ["get", "status"], "completed"],
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "#D52B1E",
      "line-width": 2
    }
  });

  map.addLayer({
    id: "route-planned",
    type: "line",
    source: "tour-route",
    filter: ["==", ["get", "status"], "planned"],
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "#2B2B2B",
      "line-width": 2,
      "line-dasharray": [3, 2]
    }
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
      const storyUrl = props.story_url || "";
      const photoUrl = props.photo_url || "";
      const coverImageUrl = props.cover_image_url || "";

      const imageHtml = coverImageUrl
        ? `<img src="${coverImageUrl}" alt="${name}" class="popup-image">`
        : "";

      const links = [];
      if (storyUrl) {
        links.push(`<a href="${storyUrl}" target="_blank" rel="noopener noreferrer">Story</a>`);
      }
      if (photoUrl) {
        links.push(`<a href="${photoUrl}" target="_blank" rel="noopener noreferrer">Photos</a>`);
      }

      const linksHtml = links.length
        ? `<p class="popup-links">${links.join(" · ")}</p>`
        : "";

      const html = `
        <div>
          ${imageHtml}
          <h3 class="popup-title">${name}</h3>
          <p class="popup-meta">
            ${[province, status, type, date].filter(Boolean).join(" · ")}
          </p>
          <p class="popup-summary">${summary}</p>
          ${linksHtml}
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
