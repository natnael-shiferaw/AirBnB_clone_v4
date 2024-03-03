$(document).ready(function () {
  const HOST = '0.0.0.0';

  // Function to update amenities display
  function updateAmenities(amenityObj) {
      const names = Object.keys(amenityObj);
      $('.amenities h4').text(names.sort().join(', ') || '\u00A0'); // Non-breaking space if empty
  }

  // Function to handle API status
  function apiStatus() {
      const API_URL = `http://${HOST}:5001/api/v1/status/`;
      $.get(API_URL, function(data, textStatus) {
          const $apiStatus = $('#api_status');
          if (textStatus === 'success' && data.status === 'OK') {
              $apiStatus.addClass('available');
          } else {
              $apiStatus.removeClass('available');
          }
      });
  }

  // Event handler for amenity checkboxes
  const amenityIds = {};
  $('.amenities .popover input').change(function () {
      const { name, id } = $(this).data();
      if ($(this).is(':checked')) {
          amenityIds[name] = id;
      } else {
          delete amenityIds[name];
      }
      updateAmenities(amenityIds);
  });

  // Initial API status check
  apiStatus();
});
