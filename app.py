#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask
from flask import g

from app.routes import routes

app = Flask(__name__)
app.register_blueprint(routes)


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run()
