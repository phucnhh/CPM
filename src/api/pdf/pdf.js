/**
 * PDF namespace.
 * @namespace pdf
 */

var os = require("os");
var uuid = require("node-uuid");
var fs = require("fs-extra");
var async = require("async");
var path = require("path");
var spawn = require('child_process').spawn;

function Pdf() {
    var wkhtmltopdf = "wkhtmltopdf"
    if (process.platform === "win32") {
        wkhtmltopdf = path.dirname(process.execPath) + "/external/wkhtmltopdf/wkhtmltopdf.exe";
    }

    /**
     * Generate a PDF from a HTML report
     *
     * @param html the HTML content
     * @param [grayscale] {boolean} generate in grayscale or color. Default is false
     * @param callback
     */
    this.genPdf = function (html, grayscale, callback) {
        if(typeof(grayscale)==="function"){
            callback = grayscale;
            grayscale = false ;
        }
        //create a temporary directory
        var tmpdir = os.tmpdir() + path.sep + "BAYROLSolution" + path.sep + uuid.v4();
        fs.mkdir(tmpdir, function (err) {
            if (err) {
                return callback(err);
            }

            async.parallel([
                async.apply(fs.copy, path.dirname(process.execPath)+"/report/banner.jpg", tmpdir + path.sep + "banner.jpg"),
                async.apply(fs.copy, path.dirname(process.execPath)+"/report/adv_elec.jpg", tmpdir + path.sep + "adv_elec.jpg"),
                async.apply(fs.copy, path.dirname(process.execPath)+"/report/shop_logo.jpg", tmpdir + path.sep + "shop_logo.jpg"),
                async.apply(fs.copy, path.dirname(process.execPath)+"/report/newunivers.ttf", tmpdir + path.sep + "newunivers.ttf"),
                async.apply(fs.copy, path.dirname(process.execPath)+"/report/newuniverslight.ttf", tmpdir + path.sep + "newuniverslight.ttf")
            ], function(err){
                if (err) {
                    console.log(err) ;
                    return callback(err);
                }

                var fileHTML = tmpdir + path.sep + "report.html";
                fs.writeFile(fileHTML, html, {encoding: "utf8"}, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    /*

                     wkhtmltopdf \
                     --encoding utf-8 \
                     --margin-top 25mm \
                     --margin-left 0mm \
                     --margin-right 0mm \
                     --margin-bottom 10mm \
                     --header-html head.html \
                     --footer-html footer.html \
                     --footer-line \
                     maquette.html maquette.pdf
                     */

                    var templateDir = path.dirname(process.execPath) + path.sep + "report";

                    var outputFile = tmpdir + path.sep + 'out.pdf';
                    /*wkhtmltopdf("file:///" + fileHTML,
                        {
                            encoding    : 'utf-8',
                            marginTop   : "5mm",
                            marginLeft  : "5mm",
                            marginRight : "5mm",
                            marginBottom: "15mm",
                            //pageSize: "A4",
                            pageWidth: "200mm",
                            pageHeight: "290mm",
                            grayscale: grayscale,
                            //headerHtml  : templateDir + path.sep + "head.html",
                            footerHtml  : templateDir + path.sep + "footer.html",
                            output      : outputFile
                        }, function (err, signal) {
                            if (err) {
                                return callback(err);
                            }
                            //fs.unlink(fileHTML) ;
                            callback(null, outputFile);
                        });*/

                    var args = [];
                    args.push("--quiet");
                    args.push("--encoding"); args.push("utf-8");
                    args.push("--margin-top"); args.push( "5mm");
                    args.push("--margin-left"); args.push("5mm");
                    args.push("--margin-right"); args.push("5mm");
                    args.push("--margin-bottom"); args.push("15mm");
                    args.push("--page-width"); args.push("200mm");
                    args.push("--page-height"); args.push("290mm");
                    if(grayscale) {args.push("--grayscale"); }
                    args.push("--footer-html", templateDir + path.sep + "footer.html");
                    args.push("file:///" + fileHTML, outputFile);

                    console.log(args) ;
                    var wk = spawn(wkhtmltopdf, args, {cwd : tmpdir});
                    wk.stdout.on('data', function (data) {
                        console.log('stdout: ' + data);
                    });

                    wk.stderr.on('data', function (data) {
                        console.log('stderr: ' + data);
                    });

                    wk.on('close', function (code) {
                        console.log('child process exited with code ' + code);
                        callback(null, outputFile);
                    });
                });
            });


        });
    };


    /**
     * Print PDF file
     * @param pathPdf
     * @param callback
     */
    this.printPdf = function (pathPdf, callback) {


        if (process.platform === "win32") {
            /**
             *
             C:\Program Files\BAYROL Solution\external\gs32\bin>gswin32c.exe

             C:\Program Files\BAYROL Solution\external\gs32\bin>
             */
            var args = [
                "-dFitPage",
                "-dPrinted",
                "-dBATCH",
                "-dNOPAUSE",
                "-dNOSAFER",
                "-q" ,
                "-dNoCancel" ,
                "-dNumCopies=1",
                "-sPAPERSIZE=a4",
                "-sDEVICE=mswinpr2",
                pathPdf

            ];
            var gs = spawn(path.dirname(process.execPath) + "/external/gs32/bin/gswin32c.exe", args);
            gs.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
            });

            gs.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });

            gs.on('close', function (code) {
                console.log('child process exited with code ' + code);
                if(callback){
                    callback() ;
                }
            });
        }


    };


}

module.exports = Pdf;