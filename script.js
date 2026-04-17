function addCanadaReferenceLayers(map) {
  map.addSource("mapbox-reference", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-streets-v8"
  });

  // Dark Canada national border
  map.addLayer({
    id: "canada-country-border",
    type: "line",
    source: "mapbox-reference",
    "source-layer": "admin",
    filter: [
      "all",
      ["==", ["get", "admin_level"], 0],
      ["any",
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

  // Major city labels in Canada
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

  // Canada-only highway route numbers
  // Uses road ref values from the road layer.
  map.addLayer({
    id: "canada-highway-refs",
    type: "symbol",
    source: "mapbox-reference",
    "source-layer": "road",
    minzoom: 5.5,
    filter: [
      "all",
      ["==", ["get", "iso_3166_1"], "CA"],
      ["has", "ref"],
      ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]]
    ],
    layout: {
      "symbol-placement": "line-center",
      "text-field": ["get", "ref"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        5.5, 10,
        8, 12
      ],
      "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
      "symbol-spacing": 300,
      "text-rotation-alignment": "map",
      "text-keep-upright": true
    },
    paint: {
      "text-color": "#2B2B2B",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1.5
    }
  });
}
