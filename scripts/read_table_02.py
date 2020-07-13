#!/usr/bin/env python
# -*- coding: utf-8 -*-

from numpy import NaN
from pandas import read_csv, notna, to_numeric
from sqlalchemy import create_engine


# create an engine to save the dataframe in the database afterwards
engine = create_engine(
    'postgresql+psycopg2://postgres:postgres@localhost:15432/pauliceia'
)
# create a connection
conn = engine.connect()

# dataframe `Big Table`
df_bt = read_csv('entrada/test/TABELAO_2019_12_11__50_rows.csv')

# rename the columns
df_bt.rename(columns={
    'id_da rua': 'id_street', 'Id_ponto': 'id_point', 'metragem': 'metre', 'logradouro': 'address',
     'numero': 'number', 'numero original': 'original_n', 'Data inicial': 'initial_date', 'Data_final': 'final_date',
    'fonte': 'source', 'autor_da_alimentação': 'author', 'Data': 'date'
}, inplace=True)

# add attributes
df_bt['cord'] = ''
df_bt['first_day'] = NaN
df_bt['first_month'] = NaN
df_bt['first_year'] = NaN
df_bt['last_day'] = NaN
df_bt['last_month'] = NaN
df_bt['last_year'] = NaN

# fix some attributes
df_bt['metre'] = df_bt['metre'].str.replace(',', '.').astype(float)
df_bt['number'] = df_bt['number'].str.replace(',', '.').astype(float)

for row in df_bt.itertuples():
    # create the SQL query
    query = 'SELECT saboya_geometry({}, {}) AS saboya_geometry;'.format(row.id_street, row.metre)

    print(row.Index, ' - ', query)

    result = conn.execute(query)
    result = result.fetchone()
    df_bt.at[row.Index, 'cord'] = result['saboya_geometry'].replace('POINT(', '').replace(')', '')

    if (notna(row.initial_date)):
        initial_date = row.initial_date.split('/')

        df_bt.at[row.Index, 'first_day'] = initial_date[0]
        df_bt.at[row.Index, 'first_month'] = initial_date[1]
        df_bt.at[row.Index, 'first_year'] = initial_date[2]
    # else:
    #     print('error 1: ', row, '\n')

    if (notna(row.final_date)):
        final_date = row.final_date.split('/')

        df_bt.at[row.Index, 'last_day'] = final_date[0]
        df_bt.at[row.Index, 'last_month'] = final_date[1]
        df_bt.at[row.Index, 'last_year'] = final_date[2]
    # else:
    #     print('error 2: ', row, '\n')

# df_bt[["first_day", 'first_month', 'first_year']] = df_bt[["first_day", 'first_month', 'first_year']].astype(int)
# df_bt[["last_day", 'last_month', 'last_year']] = df_bt[["last_day", 'last_month', 'last_year']].astype(int)

# Drop some columns
df_bt.drop(['address', 'metre', 'initial_date', 'final_date', 'id_point'], axis=1, inplace=True)

print('\ndf_bt.tail(): \n', df_bt.tail())
# print('\ndf_bt[cord].tail(): \n', df_bt['cord'].tail())
