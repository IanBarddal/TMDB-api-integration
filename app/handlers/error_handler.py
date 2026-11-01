from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_errors_handler(app):

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):

        return jsonify({
            "code": error.code,
            "error": error.name,
            "message": error.description
        }), error.code