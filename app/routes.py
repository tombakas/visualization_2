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


@routes.route("/grossPerGenre/")
def grossPerGenre():
    return render_template("gross_per_genre.html")


@routes.route("/genreGrossPerMonth/<path:genre>/")
def genreGrossPerMonth(genre):
    return render_template("genre_gross_per_month.html", genre=genre.lower())


@routes.route("/separateFilmGrossPerMonth/<month>/<path:genre>/")
@routes.route("/separateFilmGrossPerMonth/<month>/")
def seperateFilmGrossPerMonth(month, genre=""):
    title = "Top grossing {} films in {}".format(genre.lower(), month.title())
    return render_template("separate_film_gross_per_month.html", title=title)


@routes.route("/film/<film_index>/")
def filmPage(film_index=""):
    film_keys = ["Director", "Release date", "Budget", "Domestic gross", "Worldwide gross", "Genre"]

    resp = APIfilmPage(film_index).get_json()[0]
    film_info = resp[1:]

    film_info[2] = "$ {:,}".format(film_info[2])
    film_info[3] = "$ {:,}".format(film_info[3])
    film_info[4] = "$ {:,}".format(film_info[4])

    z = zip(film_keys, film_info)
    return render_template("film_page.html", film_info=z, title=resp[0])


@routes.route("/api/film/<film_index>/")
def APIfilmPage(film_index):
    query = """
        SELECT movie_title, director_name, "Release Date", "Production Budget", "Domestic Gross", "Worldwide Gross", genre
        FROM movies
        WHERE "index"="{}"
        """
    result = query_db(query.format(film_index))

    return Response(dumps(result), mimetype="application/json")


@routes.route("/api/grossPerGenre/")
def APIgrossPerGenre():
    result = query_db(
        """
        SELECT genre, SUM("Domestic Gross"), SUM("Worldwide Gross")
        FROM movies
        GROUP BY genre
        """
    )

    return Response(dumps(result), mimetype="application/json")


@routes.route("/api/genreGrossPerMonth/<path:genre>/")
def APIgenreGrossPerMonth(genre):
    query = """
        SELECT strftime("%m", "Release Date"), SUM("Domestic Gross"),SUM("Worldwide Gross"),"genre"
        FROM movies
        WHERE genre=?
        GROUP BY strftime("%m","Release Date")
    """
    genre = unquote(genre)
    result = query_db(
        query, (genre,)
    )

    return Response(dumps(result), mimetype="application/json")


@routes.route("/genreAllMonths/<path:genre>/")
def genreAllMonths(genre):
    return render_template("genre_all_months.html", genre=genre.lower())


@routes.route("/api/genreAllMonths/<path:genre>/")
def APIgenreAllMonths(genre):

    def get_one_month(month):
        sql_script = """
            DROP VIEW IF EXISTS allMonths_q1;
            CREATE VIEW allMonths_q1 AS
            SELECT "Release Date", "Production Budget", "Domestic Gross","Worldwide Gross","genre"
            FROM movies
            WHERE genre="{0}" AND "Release Date" LIKE "%-{1}-%"
            ORDER BY "Worldwide Gross" DESC
            LIMIT 50;

            DROP VIEW IF EXISTS allMonths_q2;
            CREATE VIEW allMonths_q2 AS
            SELECT "Release Date", "Production Budget", "Domestic Gross","Worldwide Gross","genre"
            FROM movies
            WHERE genre="{0}" AND "Release Date" LIKE "%-{1}-%"
            ORDER BY "Domestic Gross" DESC
            LIMIT 50;
        """

        cur = get_db().executescript(
            sql_script.format(genre.title(), month)
        )
        cur.close()

        query = """
            SELECT *
            FROM allMonths_q1
            UNION
            SELECT *
            FROM allMonths_q2
        """
        result = query_db(query)
        return result

    genre = unquote(genre)
    result = {}

    for month in range(1, 13):
        result[month] = get_one_month("{:02d}".format(month))

    return Response(dumps(result), mimetype="application/json")


@routes.route("/api/separateFilmGrossPerMonth/<month>/<path:genre>/")
@routes.route("/api/separateFilmGrossPerMonth/<month>/")
def APIseperateFilmGrossPerMonth(month, genre=None):
    if genre:
        genre = genre.title()

    month_number = int(datetime.strptime(month[:3], "%b").month)
    print(month_number)

    if genre is not None:
        genre = unquote(genre)
        genre_clause = "AND \"genre\"='{}'".format(genre)
    else:
        genre_clause = ""

    sql_script = """
        DROP VIEW IF EXISTS q1;
        CREATE VIEW q1 AS
        SELECT "movie_title", "Production Budget","Domestic Gross","Worldwide Gross","Release Date", "index"
        FROM movies WHERE "Release Date" LIKE "%-{0:02d}-%" {1}
        ORDER BY "Worldwide Gross" DESC
        LIMIT 70;

        DROP VIEW IF EXISTS q2;
        CREATE VIEW q2 AS
        SELECT "movie_title", "Production Budget","Domestic Gross","Worldwide Gross", "Release Date", "index"
        FROM movies WHERE "Release Date" LIKE "%-{0:02d}-%" {1}
        ORDER BY "Domestic Gross" DESC
        LIMIT 70;
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
