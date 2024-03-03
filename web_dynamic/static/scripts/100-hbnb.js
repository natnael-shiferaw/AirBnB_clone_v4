$(document).ready(function () {
  const api = 'http://' + window.location.hostname + ':5001/api/v1';

  // Task 1: Check API status on page load
  $.get(api + '/status/', function (response) {
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Task 2: Handle amenities selection
  const amenityIds = {};
  $('.amenities input[type=checkbox]').change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      amenityIds[id] = name;
    } else {
      delete amenityIds[id];
    }
    updateLocations();
  });

  // Task 3: Handle filters button click
  $('.filters button').click(function () {
    $.ajax({
      url: api + '/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenityIds)
      }),
      success: function (data) {
        displayPlaces(data);
      }
    });
  });

  // Task 4: Update locations display
  function updateLocations() {
    const locations = Object.values(amenityIds);
    $('.locations h4').text(locations.join(', ') || '\u00A0'); // Non-breaking space if empty
  }

  // Function to append places data to HTML
  function displayPlaces(data) {
    $('section.places').empty().append(data.map(place => {
      return `<article>
                <div class="title">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">
                    <i class="fa fa-users fa-3x" aria-hidden="true"></i><br>${place.max_guest} Guests
                  </div>
                  <div class="number_rooms">
                    <i class="fa fa-bed fa-3x" aria-hidden="true"></i><br>${place.number_rooms} Bedrooms
                  </div>
                  <div class="number_bathrooms">
                    <i class="fa fa-bath fa-3x" aria-hidden="true"></i><br>${place.number_bathrooms} Bathrooms
                  </div>
                </div>
                <div class="description">${place.description}</div>
              </article>`;
    }));
  }
});
$(document).ready(function () {
  const api = 'http://' + window.location.hostname + ':5001/api/v1';

  // Task 1: Check API status on page load
  $.get(api + '/status/', function (response) {
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Task 2: Handle amenities selection
  const amenityIds = {};
  $('.amenities input[type=checkbox]').change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      amenityIds[id] = name;
    } else {
      delete amenityIds[id];
    }
    updateLocations();
  });

  // Task 3: Handle filters button click
  $('.filters button').click(function () {
    $.ajax({
      url: api + '/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenityIds)
      }),
      success: function (data) {
        displayPlaces(data);
      }
    });
  });

  // Task 4: Update locations display
  function updateLocations() {
    const locations = Object.values(amenityIds);
    $('.locations h4').text(locations.join(', ') || '\u00A0'); // Non-breaking space if empty
  }

  // Function to append places data to HTML
  function displayPlaces(data) {
    $('section.places').empty().append(data.map(place => {
      return `<article>
                <div class="title">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">
                    <i class="fa fa-users fa-3x" aria-hidden="true"></i><br>${place.max_guest} Guests
                  </div>
                  <div class="number_rooms">
                    <i class="fa fa-bed fa-3x" aria-hidden="true"></i><br>${place.number_rooms} Bedrooms
                  </div>
                  <div class="number_bathrooms">
                    <i class="fa fa-bath fa-3x" aria-hidden="true"></i><br>${place.number_bathrooms} Bathrooms
                  </div>
                </div>
                <div class="description">${place.description}</div>
              </article>`;
    }));
  }
});
