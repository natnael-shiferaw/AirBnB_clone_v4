#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template
from models import storage
import uuid

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


@app.route('/1-hbnb')
def hbnb():
    """
    Handle request to custom template with states, cities & amenities.

    This function retrieves data from the storage (database) and
    renders a template containing information about states, cities,
    amenities, places, and users.

    Returns:
        Rendered HTML template displaying the required information.
    """
    states = storage.all('State').values()
    states = sorted(states, key=lambda state: state.name)
    amenities = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}

    return render_template('1-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=states,
                           amenities=amenities,
                           places=places,
                           users=users)


if __name__ == "__main__":
    """Main Function"""
    app.run(host=host, port=port)
