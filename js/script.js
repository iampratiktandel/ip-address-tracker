/** Create Map on initial load */
const map = L?.map("map").setView([34.06254959106445, -118.08197784423828], 13);
/** Add Map image */
L?.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
/** Create Marker */
const marker = L.marker([34.06254959106445, -118.08197784423828]).addTo(map);

/**
 * get data from api based on ip-address and update map
 * @param searchTerm input value
 */
const getSearchData = (searchTerm) => {
  fetch(`http://api.ipstack.com/${searchTerm}?access_key={API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      /** set result values */
      const city = data?.city || "N/A";
      const region_code = data?.region_code || "N/A";
      const zip = data?.zip || "N/A";
      const offset = data?.location?.time_zone?.gmt_offset || "N/A";

      const ip = data?.ip || "N/A";
      const location = `${city}, ${region_code} ${zip}`;
      const timezone = `UTC - ${offset}`;
      const isp = data?.connection?.isp || "N/A";

      /** update map */
      map.setView([data?.latitude, data?.longitude], 13);
      /** update marker */
      marker.setLatLng([data?.latitude, data?.longitude]).update();
      /** set result content in view */
      document.querySelector("#ip").textContent = ip;
      document.querySelector("#location").textContent = location;
      document.querySelector("#timezone").textContent = timezone;
      document.querySelector("#isp").textContent = isp;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/** get searchTerm on btn click and call api to fetch data */
const onSearch = () => {
  const searchTerm = document?.querySelector("#search")?.value;
  if (validateIPaddress(searchTerm)) {
    getSearchData(searchTerm);
  }
};

/** validate the entered ip address */
function validateIPaddress(ipaddress) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  alert("You have entered an invalid IP address!");
  return false;
}
