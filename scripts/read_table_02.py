#!/usr/bin/env python
# -*- coding: utf-8 -*-

from numpy import NaN
from pandas import DataFrame, notna, read_csv, to_numeric
from model import engine, execute_file, execute_query


# table name to store the dataframe
TABLE_TO_STORE_DF = 'places_pilot_area_test'
CSV_TO_READ_DF = 'TABELAO_2019_12_11__50_rows.csv'

execute_file('sql/01_saboya_geometry_plsql.sql')

# drop the table if it exists in order to create it again based on the dataframe
execute_query('DROP TABLE IF EXISTS public.{};'.format(TABLE_TO_STORE_DF))

# dataframe `Big Table`
df_bt = read_csv('entrada/test/{}'.format(CSV_TO_READ_DF))

# rename the columns
df_bt.rename(columns={
    'id_da rua': 'id_street', 'Id_ponto': 'id_point', 'metragem': 'metre', 'logradouro': 'address',
     'numero': 'number', 'numero original': 'original_n', 'Data inicial': 'initial_date', 'Data_final': 'final_date',
    'fonte': 'source', 'autor_da_alimentação': 'author', 'Data': 'date'
}, inplace=True)

# add some columns
df_bt['cord'] = ''
df_bt['first_day'] = NaN
df_bt['first_month'] = NaN
df_bt['first_year'] = NaN
df_bt['last_day'] = NaN
df_bt['last_month'] = NaN
df_bt['last_year'] = NaN

# fix some columns
df_bt['metre'] = df_bt['metre'].str.replace(',', '.').astype(float)
df_bt['number'] = df_bt['number'].str.replace(',', '.').astype(float)

# create a dataframe to store the rows with some error with the same columns from the original dataframe
df_error = DataFrame(columns=df_bt.columns)
df_error['reason'] = ''

# create a copied dataframe to iterate over it while I remove the records from the original one
df_bt_copy = df_bt.copy()

# print('len(df_bt) before removing rows: ', len(df_bt))

for row in df_bt_copy.itertuples():
    # create the SQL query
    query = 'SELECT saboya_geometry({}, {}) AS saboya_geometry;'.format(row.id_street, row.metre)

    # print(row.Index, ' - ', query)

    result = execute_query(query)
    result = result.fetchone()
    df_bt.at[row.Index, 'cordinate'] = result['saboya_geometry']

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

    if df_bt.at[row.Index, 'first_year'] > df_bt.at[row.Index, 'last_year']:
        df_error = df_error.append(df_bt.loc[[row.Index]])
        df_error.at[row.Index, 'reason'] = 'Initial year is greater than final year.'
        df_bt.drop(row.Index, inplace=True)

# drop some columns
df_bt.drop(['address', 'metre', 'initial_date', 'final_date', 'id_point'], axis=1, inplace=True)

print('\ndf_bt.tail(): \n', df_bt.tail())
print('len(df_bt): ', len(df_bt))

# print('\ndf_bt[cordinate].tail(): \n', df_bt['cordinate'].tail())

print('\ndf_error.tail(): \n', df_error.tail())
print('len(df_error): ', len(df_error))

# save the dataframe in a CSV file
df_error.to_csv('saida/error_{}'.format(CSV_TO_READ_DF))

# save the dataframe in the table `places_pilot_area_test` in the database
df_bt.to_sql(TABLE_TO_STORE_DF, con=engine, schema='public')

print('\nOK!')
