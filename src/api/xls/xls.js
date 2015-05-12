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

function Xls() {

    this.genXls = function(datas, callback){

        var tmpdir = os.tmpdir() + path.sep + "CPM" + path.sep ;

        var xlsFile = tmpdir+uuid.v4()+".xlsx" ;

        var xlsx = officegen ( 'xlsx' );



        var sheet = xlsx.makeNewSheet ();
        sheet.name = 'Export';

        datas.forEach(function(line, l){
            sheet.data[l] = [];
            line.forEach(function(cell, c){
                sheet.data[l][c] = cell;
            }) ;
        }) ;

        var out = fs.createWriteStream (xlsFile);

        out.on ( 'error', function ( err ) {
            callback( err );
        });

        xlsx.on ( 'finalize', function ( written ) {
            callback(null, xlsFile) ;
        });

        xlsx.on ( 'error', function ( err ) {
             callback( err );
        });

        xlsx.generate ( out );
    } ;

}

module.exports = Xls;