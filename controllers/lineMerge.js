//line -> geometria do rua

  exports.lineMerge = function(line){
    //tratar a string da geometria linha
    let geomLine = line.substring(line.indexOf("(") + 2);
    geomLine = geomLine.substring(0,geomLine.indexOf(")"));

    return ('LINESTRING('+ geomLine +')')
}