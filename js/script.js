const map = L?.map("map").setView([34.06254959106445, -118.08197784423828], 13);
L?.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const marker = L.marker([34.06254959106445, -118.08197784423828]).addTo(map);

const getSearchData = (searchTerm) => {
  fetch(
    `http://api.ipstack.com/${searchTerm}?access_key={API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const ip = data?.ip || "N/A";
      const city = data?.city || "N/A";
      const region_code = data?.region_code || "N/A";
      const zip = data?.zip || "N/A";
      const location = `${city}, ${region_code} ${zip}`;
      const offset = data?.location?.time_zone?.gmt_offset || "N/A";
      const timezone = `UTC - ${offset}`;
      const isp = data?.connection?.isp || "N/A";

      map.setView([data?.latitude, data?.longitude], 13);
      marker.setLatLng([data?.latitude, data?.longitude]).update();
      document.querySelector("#ip").textContent = ip;
      document.querySelector("#location").textContent = location;
      document.querySelector("#timezone").textContent = timezone;
      document.querySelector("#isp").textContent = isp;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const onSearch = () => {
  const searchTerm = document?.querySelector("#search")?.value;
  getSearchData(searchTerm);
};
