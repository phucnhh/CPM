/**
 * XLS namespace.
 * @namespace xls
 */

var os = require("os");
var uuid = require("node-uuid");
var fs = require("fs-extra");
var async = require("async");
var path = require("path");
var wkhtmltopdf = require('wkhtmltopdf');
var spawn = require('child_process').spawn
var officegen = require("officegen") ;

function Csv() {

    this.genCsv = function(datas, callback){

        var tmpdir = os.tmpdir() + path.sep + "CPM" + path.sep ;

        var csvFile = tmpdir+uuid.v4()+".csv" ;

        var str = "" ;

        datas.forEach(function(line){
            str += line.join("\t") ;
            str += "\r\n" ;
        }) ;

        fs.writeFile(csvFile, str, {encoding: "utf8"}, function(err){
           callback(err, csvFile) ;
        });
    } ;

}

module.exports = Csv;