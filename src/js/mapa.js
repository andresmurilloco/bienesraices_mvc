(function () {
  const lat = 3.4566232;
  const lng = -76.5288644;
  const mapa = L.map("mapa").setView([lat, lng], 13);
  let marker;

  //Utilizar provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //Pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  //Detectar movimiento del pin
  marker.on("moveend", function (e) {
    marker = e.target;

    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    //Obtener información de calles al soltar pin
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, resultado) {
        marker.bindPopup(resultado.address.LongLabel);

        //Llenar los campos
        document.querySelector(".calle").textContent =
          resultado?.address?.Address ?? "";

        document.querySelector("#calle").value =
          resultado?.address?.Address ?? "";
        document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
        document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
      });
  });
})();
