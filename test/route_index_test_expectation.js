const parameters = [
    'alameda barao de piracicaba,34,1908',
    'rua adolpho gordo, 53, 1930',
    'avenida angelica, 1008, 1935',
    'avenida brigadeiro luiz antonio, 80, 1919',
    'avenida rudge, 85, 1915',
    'rua alexandre levy, 15, 1931',
    'rua inexistente, 28, 1800',
    'avenida angelica, 10, 1935',
    'avenida angelica, 100, 1931',
    'alameda barao de piracicaba,20,1908',
    'alameda barao de piracicaba,21,1908',
    'alameda barao de piracicaba,0,1908',
    'rua libero badaro,99,1921',
    'rua elisa whitacker, 100, 1931',
    'rua dom antonio de mello, 5, 1900',
    'rua bandeirantes, 5, 1950',
    'rua victorino carmillo, 188, 1927',
    'rua victorino carmillo, 18, 1935',
    'rua sebastiao pereira, 85, 2000',
    'rua bento pires, 85, 1929'
]

const expectations = [
    {
        "name": "",
        "geom": "POINT(-46.6431266727365 -23.5336389826616)",
        "confidence": 1,
        "status": 1
    },
    {
        "name": "",
        "geom": "POINT(-46.6505693977023 -23.5322257321534)",
        "confidence": 1,
        "status": 1
    },
    {
        "name": "",
        "geom": "POINT(-46.6557305423885 -23.5416188413513)",
        "confidence": 1,
        "status": 1
    },
    {
        "name": "",
        "geom": "POINT(-46.6385883483564 -23.5541268606423)",
        "confidence": 1,
        "status": 1
    },
    {
        "name": "",
        "geom": "POINT(-46.6486920286517 -23.5260160437558)",
        "confidence": 1,
        "status": 1
    },
    {
        "name": "",
        "geom": "POINT(-46.6199692007838 -23.5573770232058)",
        "confidence": 1,
        "status": 1
    },
    {
        "name": "Point not found",
        "alertMsg": "Não encontramos pontos nesse logradouro referentes ao ano buscado (rua inexistente, 28, 1800)",
        "status": 0
    },
    {
        "name": "Point Geolocated S",
        "geom": "POINT(-46.65295362736152 -23.53305298046432)",
        "confidence": 0.9,
        "status": 1
    },
    {
        "name": "Point Spatial Extrapolated",
        "geom": "POINT(-46.6557305423885 -23.5416188413513)",
        "confidence": 0,
        "status": 1
    },
    {
        "name": "Point Geolocated",
        "geom": "POINT(-46.64246841920372 -23.534516508951405)",
        "confidence": 0.6001362125771471,
        "status": 1
    },
    {
        "name": "Point Geolocated",
        "geom": "POINT(-46.64231869675886 -23.53471610587716)",
        "confidence": 0.6001420993123368,
        "status": 1
    },
    {
        "name": "Point not found",
        "alertMsg": "Não encontramos pontos necessarios para a geolocalização nesse logradouro no ano buscado (alameda barao de piracicaba, 0, 1908)",
        "status": 0
    },
    {
        "name": "Point Geolocated",
        "geom": "POINT(-46.636238968103186 -23.54652446673687)",
        "confidence": 0.7625302136416297,
        "status": 1
    },
    {
        "name": "Point Spatial Extrapolated",
        "geom": "POINT(-46.619347893101 -23.5359344159166)",
        "confidence": 0,
        "status": 1
    },
    {
        "name": "Point not found",
        "alertMsg": "Não encontramos pontos nesse logradouro referentes ao ano buscado (rua dom antonio de mello, 5, 1900)",
        "status": 0
    },
    {
        "name": "Point Geolocated S",
        "geom": "POINT(-46.63137691996074 -23.52882415006165)",
        "confidence": 0.9,
        "status": 1
    },
    {
        "name": "",
        "geom": "POINT(-46.6548466851782 -23.5282862018479)",
        "confidence": 1,
        "status": 1
    },
    {
        "name": "Point Geolocated S",
        "geom": "POINT(-46.64885083691818 -23.536208145029658)",
        "confidence": 0.9,
        "status": 1
    },
    {
        "name": "Point Geolocated S",
        "geom": "POINT(-46.64810968387028 -23.54075960410395)",
        "confidence": 0.9,
        "status": 1
    },
    {
        "name": "Point Spatial Extrapolated",
        "geom": "POINT(-46.6227699423928 -23.5528338458217)",
        "confidence": 0,
        "status": 1
    }

]

module.exports = {expectations,
          parameters}