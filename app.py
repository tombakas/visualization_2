#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sass

from flask import Flask
from flask import g

from app.routes import routes
from app.scatter_routes import scatter_routes

app = Flask(__name__)
app.register_blueprint(routes)
app.register_blueprint(scatter_routes)


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    sass.compile(
        dirname=("./static/scss", "./static/css"),
        output_style="compressed"
    )

    app.run()
