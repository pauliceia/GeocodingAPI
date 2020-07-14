#!/usr/bin/env python
# -*- coding: utf-8 -*-

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker


# create an engine to save the dataframe in the database afterwards
engine = create_engine(
    'postgresql+psycopg2://postgres:postgres@localhost:15432/pauliceia'
)

Session = sessionmaker(bind=engine)


def execute_query(query):
    # Source: https://docs.sqlalchemy.org/en/13/orm/session_transaction.html
    session = Session()

    try:
        result = session.execute(query)

        session.commit()

        return result
    except:
        session.rollback()
        raise
    finally:
        session.close()
