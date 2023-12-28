//line -> geometria do rua

//FUNÇÕES AUXILIARES
const getDistance = function(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
};
//point-> geometria do ponto

exports.lineLocate = function(line, point){
    
    let i;
//tratar a string da geometria ponto
    let geomPoint = point.substring(point.indexOf("(") + 1);
    geomPoint = geomPoint.substring(0,geomPoint.indexOf(")"));

    //tratar a string da geometria linha
    let geomLine = line.substring(line.indexOf("(") + 2);
    geomLine = geomLine.substring(0,geomLine.indexOf(")"));

    //divide a rua em grupo de pontos
    const pointsLine = geomLine.split(',');

    //variaveis globais
    const distances = [];
    let distTotal = 0;
    let minDistance = 1000;
    let index = 0;
    let distDesired = 0;

    //loop para somar as distancias
    for (i = 1; i < pointsLine.length; i++) {

        //insere as distancias no array distances
        distances[i] = getDistance(pointsLine[(i-1)].split(' ')[0], pointsLine[(i-1)].split(' ')[1], pointsLine[(i)].split(' ')[0], pointsLine[(i)].split(' ')[1]);
        distTotal = distTotal + distances[i];

        //descobre onde se encontre o endereço buscados
        if (getDistance(geomPoint.split(' ')[0], geomPoint.split(' ')[1], pointsLine[(i)].split(' ')[0], pointsLine[(i)].split(' ')[1]) < minDistance) {
        	minDistance = getDistance(geomPoint.split(' ')[0], geomPoint.split(' ')[1], pointsLine[(i)].split(' ')[0], pointsLine[(i)].split(' ')[1])
        	index = i;
        }
    }
        
    //checa se o dado se encontra no primeiro intervale
    if (index==1){

        //soma as distancias com a distancia entre o entre o ultimo ponto e ponto buscado
        distDesired = distDesired + getDistance(geomPoint.split(' ')[0], geomPoint.split(' ')[1], pointsLine[0].split(' ')[0], pointsLine[0].split(' ')[1]);
       
        //retorna o resultado
        return (distDesired)/(distTotal)

    }else{
    
        //loop para somar a distancia entre o ponto inicial e o ponto procurado
        for (i = 1; i < index; i++) {
            
            //insere as distancias no array 
            distDesired = distDesired + getDistance(pointsLine[(i-1)].split(' ')[0], pointsLine[(i-1)].split(' ')[1], pointsLine[(i)].split(' ')[0], pointsLine[(i)].split(' ')[1]);

        }

        //soma as distancias com a distancia entre o entre o ultimo ponto e ponto buscado
        distDesired = distDesired + getDistance(geomPoint.split(' ')[0], geomPoint.split(' ')[1], pointsLine[index-1].split(' ')[0], pointsLine[index-1].split(' ')[1]);
        
        //retorna o resultado
        return (distDesired)/(distTotal)
    }

}