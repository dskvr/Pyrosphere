shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

normalize = function(SET, rangeLow, rangeHigh, toMin, toMax, round){
	toMin = toMin || 0;
	toMax = toMax || 1000;
	var result = toMin + (SET-rangeLow)*(toMax-toMin)/(rangeHigh-rangeLow);
	return round ? Math.round(result) : result;
}