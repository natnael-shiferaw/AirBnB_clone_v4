$(document).ready(function () {
  const HOST = '0.0.0.0';
  const amenityObj = {};

  // Function to update amenities display
  function updateAmenities() {
      const names = Object.keys(amenityObj);
      $('.amenities h4').text(names.sort().join(', ') || '\u00A0'); // Non-breaking space if empty
  }

  // Event handler for amenity checkboxes
  $('.amenities .popover input').change(function () {
      const name = $(this).data('name');
      const id = $(this).data('id');
      if ($(this).is(':checked')) {
          amenityObj[name] = id;
      } else {
          delete amenityObj[name];
      }
      updateAmenities();
  });

  // API status check
  $.ajax({
      url: `http://${HOST}:5001/api/v1/status`,
      success: function (data) {
          if (data.status === 'OK') {
              $('#api_status').addClass('available');
          } else {
              $('#api_status').removeClass('available');
          }
      }
  });

  // Initial places search
  $.ajax({
      type: 'POST',
      url: `http://${HOST}:5001/api/v1/places_search/`,
      contentType: 'application/json',
      success: function (data) {
          $('SECTION.places').empty();
          for (const place of data) {
              const article = `<article>
                  <div class="title_box">
                      <h2>${place.name}</h2>
                      <div class="price_by_night">$${place.price_by_night}</div>
                  </div>
                  <div class="information">
                      <div class="max_guest">${place.max_guest} Guest(s)</div>
                      <div class="number_rooms">${place.number_rooms} Bedroom(s)</div>
                      <div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>
                  </div>
                  <div class="description">${place.description}</div>
              </article>`;
              $('SECTION.places').append(article);
          }
      }
  });
});
