mapboxgl.accessToken =
  "pk.eyJ1Ijoic3poZW5nOCIsImEiOiJjbHZyY3RvaWUwbWJpMnFtZ3UzeTU4dzJjIn0.wb94Ftyvl-L_ObiJ9KkVkw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/szheng8/clvr0zi6i05bi01ped6ne4s6t",
  center: [-71.073046, 42.359686],
  zoom: 13,
});

const cleanFeatureString = (s) => {
  console.log(s.replace(/(?:\\[rn])+/g, "<br>"));
  return s.replace(/(?:\\[rn])+/g, "<br>");
};

/**
 * Displays the sidebar and its content when an icon is clicked on the map.
 *
 * @param {object} restroomProps - The restroom properties as passed in from the mapbox layer
 * @param {object} originalData - The data as passed in from the original csv
 */
const displaySidebar = (restroomProps, summaryData) => {
  console.log("summary data at displaySidebar", summaryData);

  // Gets the map element and appends the sidebar content to it
  const mapElement = document.getElementById("map");
  let sidebar = document.getElementById("sidebar");
  if (!sidebar) {
    sidebar = document.createElement("div");
    mapElement.appendChild(sidebar);
  }
  sidebar.id = "sidebar";
  sidebar.innerHTML = `
    <div id="sidebar-content-container" class="container">
      <div class="sidebar-header">
        <h2 id = "sidebar-title">${restroomProps.name}</h2>
        <button id="close-sidebar" type="button" class="btn-close btn-close-white btn-lg" aria-label="Close"></button>
      </div>
      <hr>

      <div class="row sidebar-top-row">
        <div id="adress" class="col-6 text-center">
          <h3 class="sidebar-top-labels">ADDRESS</h3>
          <h1 class="text-center sidebar-top-values">${summaryData.address}</h1>
        </div>

        <div id="hours" class="col-6 text-center">
          <h3 class="sidebar-top-labels">HOURS OF SERVICE</h3>
          <h1 class="text-center sidebar-top-values">${cleanFeatureString(
            summaryData.hours
          )}</h1>
        </div>

        <div id="hours" class="col-6 text-center">
          <h3 class="sidebar-top-labels">MORE INFORMATION</h3>
          <h1 class="text-center sidebar-top-values">${cleanFeatureString(
            summaryData.remarks
          )}</h1>
        </div>

        <div id="hours" class="col-6 text-center">
          <h3 class="sidebar-top-labels">RATING</h3>
          <h1 class="text-center sidebar-top-values">3.5/5</h1>
        </div>
      </div>
    </div>`;

  // closing the sidebar
  const closeButton = document.getElementById("close-sidebar");
  closeButton.onclick = () => {
    mapElement.removeChild(sidebar);
    map.flyTo({
      center: [-71.073046, 42.359686],
      zoom: 13,
      speed: 0.75,
      curve: 1.5,
    });
  };
};

// load sidebar on click
map.on("click", "bathrooms", function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ["bathrooms"],
  });

  console.log("features", features);

  const feature = features[0];

  map.flyTo({
    center: feature.geometry.coordinates,
    offset: [-100, 100],
    zoom: 16,
    speed: 0.75,
    curve: 1.5,
  });

  const restroomProps = feature.properties;

  if (features.length) {
    d3.csv(
      "https://raw.githubusercontent.com/zhengsophia/ses-5460/main/BostonBathrooms.csv",
      d3.autoType
    ).then((data) => {
      summary_data = data.find((row) => row.name === restroomProps.name);
      console.log(restroomProps);
      console.log(summary_data);
      displaySidebar(restroomProps, summary_data);
    });
  } else {
    //if not hovering over a feature set tooltip to empty
    const map = document.getElementById("map");
    map.removeChild(document.getElementById("sidebar"));
  }
});
