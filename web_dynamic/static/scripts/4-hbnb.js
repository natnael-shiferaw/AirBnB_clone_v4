$(document).ready(function () {
  const api = 'http://' + window.location.hostname;

  // Function to update amenities display
  function updateAmenities(amenities) {
      if (Object.values(amenities).length === 0) {
          $('.amenities h4').html('&nbsp;');
      } else {
          $('.amenities h4').text(Object.values(amenities).join(', '));
      }
  }

  // Function to handle checkbox changes
  function handleCheckboxChange() {
      const amenities = {};
      $('input[type="checkbox"]').each(function () {
          if ($(this).is(':checked')) {
              amenities[$(this).data('id')] = $(this).data('name');
          }
      });
      updateAmenities(amenities);
      return amenities;
  }

  // Event listener for checkbox changes
  $('input[type="checkbox"]').change(function () {
      handleCheckboxChange();
  });

  // Initial API status check
  $.ajax({
      url: `${api}:5001/api/v1/status/`,
      success: function (response) {
          if (response.status === 'OK') {
              $('#api_status').addClass('available');
          } else {
              $('#api_status').removeClass('available');
          }
      }
  });

  // Initial places search
  $.ajax({
      url: `${api}:5001/api/v1/places_search/`,
      type: 'POST',
      data: JSON.stringify({}),
      contentType: 'application/json',
      success: function (data) {
          $('SECTION.places').empty();
          for (const place of data) {
              const template = `<article>
                  <div class="title">
                      <h2>${place.name}</h2>
                      <div class="price_by_night">$${place.price_by_night}</div>
                  </div>
                  <div class="information">
                      <div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br>${place.max_guest} Guests</div>
                      <div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br>${place.number_rooms} Bedrooms</div>
                      <div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br>${place.number_bathrooms} Bathrooms</div>
                  </div>
                  <div class="description">${place.description}</div>
              </article>`;
              $('SECTION.places').append(template);
          }
      }
  });

  // Event listener for button click (filter)
  $('.filters button').click(function () {
      const amenities = handleCheckboxChange();
      $.ajax({
          type: 'POST',
          url: `${api}:5001/api/v1/places_search/`,
          contentType: 'application/json',
          data: JSON.stringify({ amenities: Object.keys(amenities) }),
          success: function (data) {
              $('SECTION.places').empty().append('<h1>Places</h1>');
              for (const place of data) {
                  const template = `<article>
                      <div class="title">
                          <h2>${place.name}</h2>
                          <div class="price_by_night">$${place.price_by_night}</div>
                      </div>
                      <div class="information">
                          <div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br>${place.max_guest} Guests</div>
                          <div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br>${place.number_rooms} Bedrooms</div>
                          <div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br>${place.number_bathrooms} Bathroom</div>
                      </div>
                      <div class="description">${place.description}</div>
                  </article>`;
                  $('SECTION.places').append(template);
              }
          }
      });
  });
});
