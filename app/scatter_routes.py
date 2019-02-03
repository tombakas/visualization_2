from json import dumps

from flask import Response
from flask import Blueprint, render_template

from .db import query_db

scatter_routes = Blueprint('scatter_routes', __name__,
                           template_folder='templates')


@scatter_routes.route("/scatter/gross-time-genre/")
def gross_time_genre(film_index=""):
    return render_template("scatter_gross_time_genre.html")


@scatter_routes.route("/scatter/year-genre/")
def year_genre(film_index=""):
    return render_template("scatter_year_genre.html")


@scatter_routes.route("/api/scatter/gross-time-genre/")
def APIgross_time_genre(film_index=""):
    query = """
        SELECT "Release Date", genre, "Worldwide Gross"
        FROM movies
        WHERE "Worldwide Gross" > 0
    """

    result = query_db(query)
    return Response(dumps(result), mimetype="application/json")


@scatter_routes.route("/api/scatter/year-genre/")
def APIyear_genre():
    query = """
        SELECT strftime("%Y", "Release Date") AS YEAR, genre, count(genre)
        FROM movies
        WHERE "Worldwide Gross" > 0
        GROUP BY YEAR, genre
    """
    result = query_db(query)
    processed_result = []
    max_freq = 0
    year_min_max = [2017, 0]
    genres = []

    for item in result:
        if item[2] > max_freq:
            max_freq = item[2]

        if int(item[0]) < year_min_max[0]:
            year_min_max[0] = int(item[0])
        if int(item[0]) > year_min_max[1]:
            year_min_max[1] = int(item[0])

        if item[1] not in genres:
            genres.append(item[1])

        processed_result.append([item[0], item[1], item[2]])

    return Response(dumps({"data": processed_result, "year_min_max": year_min_max, "max": max_freq, "genres": genres}), mimetype="application/json")
