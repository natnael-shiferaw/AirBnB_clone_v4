#!/usr/bin/python3
"""
This module defines a Flask application that integrates
with AirBnB static HTML Template.
"""
from models import storage
from api.v1.views import app_views
import os
from werkzeug.exceptions import HTTPException
from flask import Flask, jsonify, make_response, render_template, url_for
from flask_cors import CORS, cross_origin
from flasgger import Swagger


app = Flask(__name__)
swagger = Swagger(app)

# global strict slashes
app.url_map.strict_slashes = False

# flask server environmental setup
host = os.getenv('HBNB_API_HOST', '0.0.0.0')
port = os.getenv('HBNB_API_PORT', 5000)

# Enable Cross-Origin Resource Sharing (CORS)
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})

# Register blueprint defined in api.v1.views
app.register_blueprint(app_views)


@app.teardown_appcontext
def close_database_connection(exception):
    """
    Close the current SQLAlchemy Session after each request.
    """
    storage.close()


@app.errorhandler(404)
def handle_404_error(exception):
    """
    Handles 404 errors, in the event that global error handler fails.
    """
    code = exception.__str__().split()[0]
    description = exception.description
    message = {'error': description}
    return make_response(jsonify(message), code)


@app.errorhandler(400)
def handle_400_error(exception):
    """
    Handles 400 errors, in the event that global error handler fails.
    """
    code = exception.__str__().split()[0]
    description = exception.description
    message = {'error': description}
    return make_response(jsonify(message), code)


@app.errorhandler(Exception)
def handle_all_exceptions(err):
    """
    Handle all other exceptions gracefully by returning
    a JSON response with error message and appropriate status code.

    Parameters:
    - err (Exception): The exception that occurred.

    Returns:
    - Response: A JSON response containing the error message
    and status code.
    """
    if isinstance(err, HTTPException):
        if type(err).__name__ == 'NotFound':
            err.description = "Not found"
        message = {'error': err.description}
        code = err.code
    else:
        message = {'error': err}
        code = 500
    return make_response(jsonify(message), code)


def set_custom_error_handlers():
    """
    Update HTTPException Class with custom error function.

    Iterates over subclasses of HTTPException and registers
    the global_error_handler function as the error handler
    for each subclass.

    This function ensures that all exceptions are caught
    and handled gracefully by returning a JSON response
    with the appropriate error message and status code.
    """
    for cls in HTTPException.__subclasses__():
        app.register_error_handler(cls, handle_all_exceptions)


if __name__ == "__main__":
    """Main function to start the Flask application."""
    set_custom_error_handlers()
    app.run(host=host, port=port)
