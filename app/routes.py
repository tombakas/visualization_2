from json import dumps
from datetime import datetime
from urllib.parse import unquote

from flask import Response
from flask import Blueprint, render_template

from .db import query_db, get_db

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


@routes.route("/separateFilmGrossPerMonth/<month>/<path:genre>")
@routes.route("/separateFilmGrossPerMonth/<month>")
def seperateFilmGrossPerMonth(month, genre=""):
    title = "Top grossing {} films in {}".format(genre.lower(), month.title())
    return render_template("separate_film_gross_per_month.html", title=title)


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
        FROM movies WHERE genre=?
        GROUP BY strftime("%m","Release Date")
    """
    genre = unquote(genre)
    result = query_db(
        query, (genre,)
    )

    return Response(dumps(result), mimetype="application/json")


@routes.route("/api/separateFilmGrossPerMonth/<month>/<path:genre>/")
@routes.route("/api/separateFilmGrossPerMonth/<month>")
def APIseperateFilmGrossPerMonth(month, genre=None):
    month_number = int(datetime.strptime(month[:3], "%b").month)

    if genre is not None:
        genre = unquote(genre)
        genre_clause = "AND \"genre\"='{}'".format(genre)
    else:
        genre_clause = ""

    sql_script = """
        DROP VIEW IF EXISTS q1;
        CREATE VIEW q1 AS
        SELECT "movie_title", "Production Budget","Domestic Gross","Worldwide Gross"
        FROM movies WHERE "Release Date" LIKE "%-{0:02d}-%" {1}
        ORDER BY "Worldwide Gross" DESC
        LIMIT 100;

        DROP VIEW IF EXISTS q2;
        CREATE VIEW q2 AS
        SELECT "movie_title", "Production Budget","Domestic Gross","Worldwide Gross"
        FROM movies WHERE "Release Date" LIKE "%-{0:02d}-%" {1}
        ORDER BY "Domestic Gross" DESC
        LIMIT 100;
    """

    cur = get_db().executescript(
        sql_script.format(month_number, genre_clause)
    )
    cur.close()

    query = """
        SELECT *
        FROM q1
        UNION
        SELECT *
        FROM q2
    """
    result = query_db(
        query.format(month_number)
    )

    return Response(dumps(result), mimetype="application/json")
