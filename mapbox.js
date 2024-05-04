mapboxgl.accessToken =
  "pk.eyJ1Ijoic3poZW5nOCIsImEiOiJjbHZyY3RvaWUwbWJpMnFtZ3UzeTU4dzJjIn0.wb94Ftyvl-L_ObiJ9KkVkw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/szheng8/clvr0zi6i05bi01ped6ne4s6t",
  center: [-71.04, 42.37],
  zoom: 12,
});

/**
 * Displays the sidebar and its content when an icon is clicked on the map.
 *
 * @param {object} restroomProps - The restroom properties as passed in from the mapbox layer
 * @param {object} originalData - The data as passed in from the original csv
 */
const displaySidebar = (facilityProps, summaryData) => {
  console.log(summaryData);

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
        <h2 id = "sidebar-title">${facilityProps.FACILITY_APPROVED}</h2>
        <button id="close-sidebar" type="button" class="btn-close btn-close-white btn-lg" aria-label="Close"></button>
      </div>
      <hr>

      <div class="row sidebar-top-row">
        <div id="average-days" class="col-6 text-center">
          <h3 class="sidebar-top-labels">Average duration of separation</h3>
          <h1 class="text-center sidebar-top-values">${Math.round(
            summaryData.Duration
          )}<label>days</label></h1>

        </div>
        <div id="reunification-rate" class="col-6 text-center">
          <h3 class="sidebar-top-labels">Reunification rate</h3>
          <h1 class="text-center sidebar-top-values">${Math.round(
            summaryData.discharge_rate * 100
          )}<label>%</label></h1>
        </div>
      </div>
      <div id="arc-diagram"></div>

      <div id="sidebar-summary-container" class="sidebar-summary-container">
        <h3 class="sidebar-summary-main" style="text-align: center" id="summary-text-${dashify(
          facilityProps.FACILITY_APPROVED
        )}">Waiting for data...</h3>
        <label>(Out of those reunited)</label>
      </div>
    </div>`;

  loadAndDraw(facilityProps.FACILITY_APPROVED);

  // closing the sidebar
  const closeButton = document.getElementById("close-sidebar");
  closeButton.onclick = () => {
    mapElement.removeChild(sidebar);
    map.flyTo({
      center: [-71.04, 42.37],
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
    offset: [-400, 100],
    zoom: 15,
    speed: 0.75,
    curve: 1.5,
  });

  const restroomProps = feature.properties;

  if (features.length) {
    d3.csv("BostonBathrooms.csv", d3.autoType).then((data) => {
      summary_data = data.find((row) => row.name === restroomProps.name);
      console.log(facilityProps);
      console.log(summary_data);
      displaySidebar(facilityProps, summary_data);
    });
  } else {
    //if not hovering over a feature set tooltip to empty
    const map = document.getElementById("map");
    map.removeChild(document.getElementById("sidebar"));
  }
});

var nav = new mapboxgl.NavigationControl({
  showCompass: false,
  showZoom: true,
});
