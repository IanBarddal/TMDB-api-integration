from flask import jsonify

def health_service():

    return jsonify("Servidor rodando normalmente.")