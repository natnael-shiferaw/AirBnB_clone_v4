#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
import uuid
from flask import Flask, render_template
from models import storage

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


@app.route('/100-hbnb/')
def hbnb_filters(the_id=None):
    """
    Handle request to custom template with states, cities & amenities.

    This function retrieves data from the storage (database) and
    renders a template containing information about states, cities,
    amenities, places, and users.

    Returns:
        Rendered HTML template displaying the required information.
    """
    states = storage.all('State').values()
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    cache_id = str(uuid.uuid4())
    return render_template('100-hbnb.html',
                           states=states,
                           amens=amens,
                           places=places,
                           users=users,
                           cache_id=cache_id)


if __name__ == "__main__":
    """Main Function"""
    app.run(host=host, port=port)
