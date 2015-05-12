var fs = require("fs-extra") ;
var stringify = require('csv').stringify;


var jsonFiles = [__dirname+"/../locales/Vi/translation.json", __dirname+"/../locales/Vi/w2ui.json"] ;

fs.readdir(__dirname+"/views", function(err, views){
    views.forEach(function(v){
        var f = __dirname+"/views/"+v+"/locales/Vi/translation.json" ;
        //console.log(f) ;
        if(fs.existsSync(f)){
            jsonFiles.push(f) ;
        }


    }) ;

    var csv = [] ;
    jsonFiles.forEach(function(f){
        var json = fs.readJsonSync(f) ;

        var parentKey = "" ;

        addSubObj(f, csv, null, json) ;



    }) ;
    stringify(csv, function(err, output){
        console.log(output) ;
    });
}) ;



function addSubObj(f, csv, parentKey, json){
    Object.keys(json).forEach(function(key){
        if(typeof(json[key]) === "object"){
            addSubObj(f, csv, key, json[key]) ;
        }else{
            csv.push([f, (parentKey?parentKey+".":"")+key,json[key]]) ;
        }
    }) ;
}