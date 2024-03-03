#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
import uuid
from flask import Flask, render_template
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


@app.teardown_appcontext
def close_database_connection(exception):
    """
    Teardown function for cleaning up the SQLAlchemy session
    after each request.

    Args:
        exception: The exception raised during the request handling, if any.
    """
    storage.close()


@app.route('/2-hbnb')
def hbnb():
    """
    Handle request to custom template with states, cities & amenities.

    This function retrieves data from the storage (database) and
    renders a template containing information about states, cities,
    amenities, places, and users.

    Returns:
        Rendered HTML template displaying the required information.
    """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = [[state, sorted(state.cities, key=lambda k: k.name)] for state in states]
    amenities = sorted(storage.all(Amenity).values(), key=lambda k: k.name)
    places = sorted(storage.all(Place).values(), key=lambda k: k.name)
    cache_id = str(uuid.uuid4())
    return render_template('2-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=cache_id)


if __name__ == "__main__":
    """Main Function"""
    app.run(host=host, port=port)
