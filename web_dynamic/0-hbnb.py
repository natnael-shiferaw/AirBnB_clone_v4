#!/usr/bin/python3
""" Starts a Flask Web Application """
from models.amenity import Amenity
from models.city import City
from models import storage
from models.state import State
from models.place import Place

from os import environ
from flask import Flask, render_template

app = Flask(__name__)


@app.teardown_appcontext
def close_database_connection(error):
    """
    Close the current SQLAlchemy Session.

    Args:
        error: Error object, if any.
    """
    storage.close()


@app.route('/hbnb', strict_slashes=False)
def display_hbnb():
    """
    Display the HBNB web page.

    Returns:
        Rendered HTML template with states, cities, amenities, and places.
    """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    return render_template('100-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places, cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
