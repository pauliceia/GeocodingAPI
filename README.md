# Spatiotemporal Geocoding for Historical Data


## Authors

```
Gabriel Sansigolo, INPE
Carlos A. Noronha, INPE
Gilberto R. de Queiroz, INPE
Karine R. Ferreira, INPE
```


## Requirements

```
PostgreSQL >= 9.5.8
PostGIS >= 2.3
NodeJS >= 4.2.6
```


## Running the API

```
$ git clone https://github.com/Pauliceia/GeocodingAPI.git
$ cd GeocodingAPI/

$ npm install
$ npm start
```


## Extra: Script

### Normal installation

Install a specific Python version using `pyenv`:

```
$ pyenv install 3.7.1
```

Create a Python environment with the Python version above through `pyenv-virtualenv`:

```
$ pyenv virtualenv 3.7.1 pauliceia-geocoding
```

Activate the virtual environment:

```
$ pyenv activate pauliceia-geocoding
```

Install the requirements:

```
$ pip install -r requirements.txt
```


### Run the application

Activate the virtual environment:

```
$ pyenv activate pauliceia-geocoding
```

Run `read_table.py` file in order to run the application:

```
$ cd scripts/
$ python read_table.py
```
