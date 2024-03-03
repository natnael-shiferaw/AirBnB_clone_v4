$(document).ready(init);

const HOST = '0.0.0.0';
const amenityObj = {};
const stateObj = {};
const cityObj = {};

function init() {
    $('.amenities .popover input').change(function () { handleCheckedObjects.call(this, amenityObj, '.amenities h4'); });
    $('.state_input').change(function () { handleCheckedObjects.call(this, stateObj, '.locations h4'); });
    $('.city_input').change(function () { handleCheckedObjects.call(this, cityObj, '.locations h4'); });
    apiStatus();
    searchPlaces();
    showReviews();
}

function handleCheckedObjects(obj, h4Selector) {
    if ($(this).is(':checked')) {
        obj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else {
        delete obj[$(this).attr('data-name')];
    }
    const names = Object.keys(obj);
    $(h4Selector).text(names.sort().join(', ') || '\u00A0'); // Non-breaking space if empty
}

function apiStatus() {
    $.get(`http://${HOST}:5001/api/v1/status/`, function (response) {
        if (response.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });
}

function searchPlaces() {
    $.ajax({
        url: `http://${HOST}:5001/api/v1/places_search/`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            amenities: Object.values(amenityObj),
            states: Object.values(stateObj),
            cities: Object.values(cityObj)
        }),
        success: function (response) {
            $('SECTION.places').empty();
            response.forEach(place => {
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
                    <div class="reviews">
                        <h2><span class="reviewSpan" data-id="${place.id}">Show</span> Reviews</h2>
                        <ul></ul>
                    </div>
                </article>`;
                $('SECTION.places').append(article);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function showReviews() {
    $(document).on('click', '.reviewSpan', function () {
        const placeId = $(this).attr('data-id');
        const ulElement = $(this).closest('.reviews').find('ul');
        if ($(this).text() === 'Show') {
            $(this).text('Hide');
            $.get(`http://${HOST}:5001/api/v1/places/${placeId}/reviews`, function (data) {
                ulElement.empty();
                data.forEach(review => {
                    const date = new Date(review.created_at);
                    const month = date.toLocaleString('en', { month: 'long' });
                    const day = dateOrdinal(date.getDate());
                    ulElement.append(`<li>From ${review.author.first_name} ${review.author.last_name} on ${day} ${month} ${date.getFullYear()}: ${review.text}</li>`);
                });
            });
        } else {
            $(this).text('Show');
            ulElement.empty();
        }
    });
}

function dateOrdinal(dom) {
    if (dom === 31 || dom === 21 || dom === 1) return dom + 'st';
    else if (dom === 22 || dom === 2) return dom + 'nd';
    else if (dom === 23 || dom === 3) return dom + 'rd';
    else return dom + 'th';
}
