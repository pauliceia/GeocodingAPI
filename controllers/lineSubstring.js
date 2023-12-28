//street -> geometria da rua
//startfraction-> porcentagem onde se inicia o trecho em relação a rua

//FUNÇÕES AUXILIARES
const getDistance = function(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
};
//endfraction-> porcentagem onde se termina o trecho em relação a rua

exports.lineSubstring = function(street, startfraction, endfraction){

    let i;
//tratar a string da geometria linha
    let geomStreet = street.substring(street.indexOf("(") + 2);
    geomStreet = geomStreet.substring(0,geomStreet.indexOf(")"));
    
    //divide a rua em grupo de pontos
    const pointsLine = geomStreet.split(',');

    //variaveis globais
    const results = [];
    const distances = [];
    const frac = [];
    let distTotal = 0;

    //loop para somar as distancias e
     for (i = 1; i < pointsLine.length; i++) {

         //insere as distancias no array distances
         distances[i-1] = getDistance(pointsLine[(i-1)].split(' ')[0], pointsLine[(i-1)].split(' ')[1], pointsLine[(i)].split(' ')[0], pointsLine[(i)].split(' ')[1]);
         
         //soma as distancias para criar o distTotal
         distTotal = distTotal + getDistance(pointsLine[(i-1)].split(' ')[0], pointsLine[(i-1)].split(' ')[1], pointsLine[(i)].split(' ')[0], pointsLine[(i)].split(' ')[1]);
         
    }
    
    distances[pointsLine.length-1] = distTotal;

    //loop para calcular frações
    for (i = 0; i < distances.length; i++) {

        //variavel para calcular distancia até um ponto
        var distPoint = 0;

        //loop para somar as distancias até aquele ponto
        for (var j = 0; j < i; j++) {
            
            //somatoria
            distPoint = distPoint + distances[j]
        }

        //fração
        frac[i] = distPoint/distTotal;
    }

    //loop para percorer as frações 
    for (i = 0; i < distances.length; i++) {

        //verifica o último ponto
        if (frac[i] > endfraction){

            //retorna resultado
            return(results + ",");
        } 
        
        //verifica se o último ponto é o último
        if (frac[i] == endfraction){
            
            //retorna resultado
            return(results);
        }         

        //busca o primeiro ponto
        if (frac[i] > startfraction){

            //adiciona as coordenadas da fração buscada no resultado
            results.push(pointsLine[(i)].split(' ')[0] +' '+ pointsLine[(i)].split(' ')[1]);
        } 
    }
}
