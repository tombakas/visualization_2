from json import dumps

from flask import Response
from flask import Blueprint, render_template

from .db import query_db

routes = Blueprint('routes', __name__,
                   template_folder='templates')


@routes.route("/")
def hello():
    return render_template("index.html")


@routes.route("/grossPerGenre")
def hi():
    result = query_db(
        """
        SELECT genre, SUM("Domestic Gross"), SUM("Worldwide Gross")
        FROM movies
        GROUP BY genre
        """
    )

    return Response(dumps(result), mimetype="application/json")
