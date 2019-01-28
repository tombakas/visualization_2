from json import dumps
from datetime import datetime
from urllib.parse import unquote

from flask import Response
from flask import Blueprint, render_template

from .db import query_db

routes = Blueprint('routes', __name__,
                   template_folder='templates')


@routes.route("/")
def hello():
    return render_template("landing.html")


@routes.route("/grossPerGenre")
def grossPerGenre():
    return render_template("gross_per_genre.html")


@routes.route("/genreGrossPerMonth/<path:genre>")
def genreGrossPerMonth(genre):
    return render_template("genre_gross_per_month.html")


@routes.route("/separateFilmGrossPerMonth/<month>")
def seperateFilmGrossPerMonth(month):
    return render_template("separate_film_gross_per_month.html")


@routes.route("/api/grossPerGenre")
def APIgrossPerGenre():
    result = query_db(
        """
        SELECT genre, SUM("Domestic Gross"), SUM("Worldwide Gross")
        FROM movies
        GROUP BY genre
        """
    )

    return Response(dumps(result), mimetype="application/json")


@routes.route("/api/genreGrossPerMonth/<path:genre>")
def APIgenreGrossPerMonth(genre):
    query = """
        SELECT strftime("%m", "Release Date"), SUM("Domestic Gross"),SUM("Worldwide Gross"),"genre"
        FROM movies WHERE genre="{}"
        GROUP BY strftime("%m","Release Date")
    """
    genre = unquote(genre)
    result = query_db(
        query.format(genre)
    )

    return Response(dumps(result), mimetype="application/json")


@routes.route("/api/separateFilmGrossPerMonth/<month>")
def APIseperateFilmGrossPerMonth(month):
    query = """
        SELECT ("movie_title"), "Production Budget","Domestic Gross","Worldwide Gross"
        FROM movies WHERE "Release Date" LIKE "%-{0:02d}-%"
    """
    result = query_db(
        query.format(int(datetime.strptime(month[:3], "%b").month))
    )

    return Response(dumps(result), mimetype="application/json")
