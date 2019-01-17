from json import dumps
from urllib.parse import unquote

from flask import Response
from flask import Blueprint, render_template

from .db import query_db

routes = Blueprint('routes', __name__,
                   template_folder='templates')


@routes.route("/")
def hello():
    return render_template("index.html")


@routes.route("/grossPerGenre")
def grossPerGenre():
    result = query_db(
        """
        SELECT genre, SUM("Domestic Gross"), SUM("Worldwide Gross")
        FROM movies
        GROUP BY genre
        """
    )

    return Response(dumps(result), mimetype="application/json")


@routes.route("/genreGrossPerMonth/<path:genre>")
def genreGrossPerMonth(genre):
    query = """
        SELECT strftime("%m", "Release Date"), SUM("Domestic Gross"),SUM("Worldwide Gross"),"genre"
        FROM movies WHERE genre='{}'
        GROUP BY strftime("%m","Release Date")
    """
    genre = unquote(genre)
    print(genre)
    result = query_db(
        query.format(genre)
    )

    return Response(dumps(result), mimetype="application/json")
