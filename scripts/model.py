#!/usr/bin/env python
# -*- coding: utf-8 -*-

from psycopg2 import connect as pg_connect
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker


# create a sqlalchemy connection in order to execute a simple query
engine = create_engine(
    'postgresql+psycopg2://postgres:postgres@localhost:15432/pauliceia'
)
SYSession = sessionmaker(bind=engine)


# create a psycopg2 connection in order to execute SQL file
pg_connection = pg_connect(
    host="localhost",database="pauliceia", user="postgres", password="postgres", port=15432
)


def execute_query(query):
    session = SYSession()

    try:
        result = session.execute(query)

        session.commit()

        return result
    except:
        session.rollback()
        raise Exception('Executing query was not possible!')
    finally:
        session.close()


def execute_file(file_name):
    file = open(file_name, "r")

    cursor = pg_connection.cursor()

    try:
        result = cursor.execute(file.read())

        pg_connection.commit()

        return result
    except:
        pg_connection.rollback()
        raise Exception('Executing query was not possible!')
    finally:
        if (pg_connection):
            cursor.close()
            pg_connection.close()
