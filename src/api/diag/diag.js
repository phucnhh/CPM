/**
 * Diagnostic namespace.
 * @namespace diag
 */

var Qty = require('js-quantities');

/**
 * Possible diagnotic modes
 *
 * @enum {string}
 * @memberof diag
 */
var DIAG_MODES = {
    /** Verification mode */
    VER: "VER",
    /** Algae problem */
    ALG: "ALG",
    /** Colored water problem */
    COLOR: "COLOR",
    /** Troubled water problem */
    TROUBLED: "TROUBLED"
};

/**
 * Pool disinfectant
 *
 * @enum {string}
 * @memberOf diag
 */
var DISINFECTANT = {
    /** Chlorine */
    CL: "CL",
    /** Bromine */
    BR: "BR",
    /** Active oxygen*/
    O2: "O2"
};

/**
 * Pool filter types
 *
 * @enum {string}
 * @memberof diag
 */
var FILTER = {
    /** Sand */
    SAND: "SAND",
    /** Glass */
    GLASS: "GLASS",
    /** Cartridge */
    CARTRIDGE: "CARTRIDGE",
    /** Pocket */
    POCKET: "POCKET",
    /** Diatom */
    DIATOM: "DIATOM"
};

/**
 * Shock products
 *
 * @enum {string}
 * @memberOf diag
 */
var PROD_SHOCK = {
    /** Chloriklar */
    CHLORIKLAR: "CHLORIKLAR",
    /** Chloryte */
    CHLORYTE: "CHLORYTE",
    /** Chlorifix */
    CHLORIFIX: "CHLORIFIX",
    /** Aquabrome regenerator */
    AQUABROME: "AQUABROME"
};

/**
 * Long term products
 *
 * @enum {string}
 * @memberof diag
 */
var PROD_LONG = {
    /** Chlorilong */
    CHLORILONG: "CHLORILONG",
    /** Chlorilong 5 Fonctions */
    CHLORILONG_5F: "CHLORILONG_5F",
    /** Chlore 5 fonctions - piscine hors-sol */
    CHLORE_5F: "CHLORE_5F",
    /** Varitab */
    VARITAB: "VARITAB",
    /** Chlorilong bloc */
    CHLORILONG_BLOC: "CHLORILONG_BLOC",
    /** Multibloc */
    MULTIBLOC: "MULTIBLOC",
    /** Multilong */
    MULTILONG: "MULTILONG",
    /** Complete & Easy */
    C_AND_E: "C_AND_E",
    /** Chloriliquide C */
    CHLORILIQUE_C: "CHLORILIQUE_C",
    /** Soft & Easy 20 */
    S_AND_E_20: "S_AND_E_20",
    /** Soft & Easy 30 */
    S_AND_E_30: "S_AND_E_30",
    /** Softswim Multi */
    SOFTSWIM_MULTI: "SOFTSWIM_MULTI",
    /** Bayrosoft */
    BAYROSOFT: "BAYROSOFT",
    /** Superflock Plus */
    SUPERFLOCK_PLUS: "SUPERFLOCK_PLUS",
    /** Filter clean tab */
    FILTER_CLEAN_TAB: "FILTER_CLEAN_TAB",
    /** AQUABROME */
    "AQUABROME" : "AQUABROME"
};

/**
 * Algae products
 *
 * @enum {string}
 * @memberof diag
 */
var PROD_ALG = {
    /** Desalgine */
    DESALGINE: "DESALGINE",
    /** Desalgine Jet */
    DESALGINE_JET: "DESALGINE_JET",
    /** X 100 */
    X100: "X100"
};

/**
 * Equipment products
 *
 * @enum {string}
 * @memberof diag
 */
var EQUIP = {
    /** Fountain */
    FOUTAIN: "FOUTAIN",
    /** Waterfall */
    WATERFALL: "WATERFALL",
    /** Against current */
    AGAINS_CURRENT: "AGAINS_CURRENT",
    /** Infinity pool */
    INFINITY: "INFINITY"
};

/**
 * Type diagnostic input. It represent
 * the data received when proceed to a diagnostic
 *
 * @typedef {object} diag.input
 * @property {object} measures                            Water measures
 * @property {number} measures.alk                    Alkalinity
 * @property {number} measures.ph                          pH
 * @property {number} measures.th                          TH
 * @property {number} measures.clFree                  Free chlorine
 * @property {number} measures.clTotal                  Total chlorine
 * @property {number} measures.br                      Bromine
 * @property {number} measures.salt                    Salt
 * @property {number} measures.cu                      Copper
 * @property {number} measures.fe                      Iron
 * @property {number} measures.stab                    Chlorine stabilizer
 * @property {number} measures.temp                    Temperature
 * @property {number} measures.oxygen                    Oxygen
 * @property {object} options                            Analysis options
 * @property {diag.DIAG_MODES} options.mode            Diagnostic mode
 * @property {boolean} options.filterMaint              Filter maintenance
 * @property {boolean} options.cleanLine                Water line cleaning
 * @property {boolean} options.startUp                  Basin start-up
 * @property {boolean} options.wintering                Wintering
 * @property {boolean} options.mark                    Marks
 * @property {object} pool                                Pool parameters
 * @property {diag.DISINFECTANT} pool.disinf         Used disinfectant
 * @property {number} pool.volume                      Pool volume
 * @property {boolean} pool.saltElect                  Use a salt electrolyzer
 * @property {number} pool.saltRate                    Recommended salt rate
 * @property {diag.FILTER} pool.filter                  Filter types
 * @property {boolean} pool.regul                      Use a regulation
 * @property {Array<diag.PROD_SHOCK>} pool.shock        List of used shock products
 * @property {Array<diag.PROD_LONG>} pool.long          List of used long-term products
 * @property {Array<diag.PROD_ALG>} pool.alg            List of used algae products
 * @property {Array<diag.EQUIP>} pool.equip            List of pool equipments


 */

/**
 * Variables of analyze
 *
 * @typedef {object} diag.variables
 * @property {object} references                          References values
 * @property {number} references.minAlk              Minimum alkalinity
 * @property {number} references.minPH               Minimum pH
 * @property {number} references.loPHlimit           Low pH limit
 * @property {number} references.maxPH               Maximum pH
 * @property {number} references.targetPH            Target pH
 * @property {number} references.targetPHzone        Target pH zone
 * @property {number} references.hiPHlimit           Hight pH limit
 * @property {number} references.minFreeCl           Minimum free chlorine
 * @property {number} references.maxFreeCl           Maxinimum free chlorine
 * @property {number} references.minTotalCl          Minimum total chlorine
 * @property {number} references.maxTotalCl          Maximum total chlorine
 * @property {number} references.minTH               Minimum TH
 * @property {number} references.maxTH               Maximum TH
 * @property {number} references.maxFe               Maximum Fe
 * @property {number} references.maxCu               Maximum Cu
 * @property {number} references.maxStab             Maximum stab
 * @property {number} references.minBr               Minimum bromine
 * @property {number} references.maxBr               Maximum bromine
 * @property {number} references.hiBrlimit           Hight bromine limit
 * @property {object} computed                            Computed values
 * @property {number} computed.alkOk                 Alkalinity is OK
 * @property {number} computed.alkLow                Alkalinity is low
 * @property {number} computed.alkVeryLow            Alkalinity is very low
 * @property {number} computed.phLow                 pH is low
 * @property {number} computed.phVeryLow             pH verylow
 * @property {number} computed.phHigh                pH is high
 * @property {number} computed.phVeryHigh            pH is very high
 * @property {number} computed.phOk                  pH is OK
 * @property {number} computed.thOk                  TH is OK
 * @property {number} computed.thLow                 TH is low
 * @property {number} computed.thHigh                TH is high
 * @property {number} computed.thNotHight            TH is not high
 * @property {number} computed.stabHigh              Stab is high
 * @property {number} computed.feZero                No Fe
 * @property {number} computed.fePresent             Fe != 0
 * @property {number} computed.feLow                 Fe is low
 * @property {number} computed.feHigh                Fe is high
 * @property {number} computed.cuZero                No Cu
 * @property {number} computed.cuPresent             Cu != 0
 * @property {number} computed.cuLow                 Cu is low
 * @property {number} computed.cuHigh                Cu is high
 * @property {number} computed.clLow                 Cl is low
 * @property {number} computed.clOk                  Cl is OK
 * @property {number} computed.clNotHigh             Cl is not high
 * @property {number} computed.clHigh                Cl is high
 * @property {number} computed.clVeryHigh            Cl is very high
 * @property {number} computed.clNotVeryHigh         Cl is not very high
 * @property {number} computed.clTotalHigh           Cl total is high
 * @property {number} computed.saltLow               Salt is low
 * @property {number} computed.brOk                  Br is OK
 * @property {number} computed.brLow                 Br is low
 * @property {number} computed.brNotHigh             Br is not high
 * @property {number} computed.brHigh                Br is high
 * @property {number} computed.brVeryHigh            Br is very high
 * @property {object} dosage                              Dosage values
 * @property {number} dosage.xt1                     Filter
 * @property {number} dosage.xph+                    pH Plus
 * @property {number} dosage.xph-                    pH Moins
 * @property {number} dosage.xtac                    Alca plus
 * @property {number} dosage.x1                      Calcinex
 * @property {number} dosage.x2                      Chloriklar
 * @property {number} dosage.x3                      Chloryte
 * @property {number} dosage.x4                      Chlore 5 fonctions - hors sol
 * @property {number} dosage.x5                      Superflock Plus
 * @property {number} dosage.x6                      Varitab
 * @property {number} dosage.x7                      Chlorilong 5 Fonctions
 * @property {number} dosage.x8                      Chlorilong
 * @property {number} dosage.x9                      Decalcit Filtre
 * @property {number} dosage.x10                     Aquabrome Regenerator
 * @property {number} dosage.x11                     Bayroshocl
 * @property {number} dosage.x12                     Soft & Easy 20
 * @property {number} dosage.x13                     Desalgine Jet
 * @property {number} dosage.x14                     Chlorifix
 * @property {number} dosage.x15                     Desalgine
 * @property {number} dosage.x16                     Superklar
 * @property {number} dosage.x17                     Filterclean Tab
 * @property {number} dosage.x18                     Chlorilong Bloc
 * @property {number} dosage.x19                     Multibloc
 * @property {number} dosage.x20                     Multilong
 * @property {number} dosage.x21                     Complete & Easy
 * @property {number} dosage.x22                     Soft & Easy 30
 * @property {number} dosage.x23                     Softswim multi
 * @property {number} dosage.x24                     Bayrosoft
 * @property {number} dosage.xsel                    Salt
 * @property {number} dosage.maxph+                  Max quantity of pH+ for 1 time
 * @property {number} dosage.maxph-                  Max quantity of pH- for 1 time
 * @property {number} dosage.maxtac                  Max quantity of TAC for 1 time
 *
 */

/**
 * Analyze result
 *
 * @typedef {object} diag.result
 * @property {string} block              the block code
 * @property {string} order              the print order
 */

/**
 * Diag object : represent a diagnostic
 *
 * @example
 * var myDiag = new Diag(myInput) ;
 * var diagResults = myDiag.doFullDiag() ;
 *
 * @class
 * @memberof diag
 *
 * @param {diag.input} input     diagnostic input
 */
function Diag(input) {
    var _self = this;

    /**
     * The inputed variables
     * @type {diag.input}
     */
    this.input = input;


    /**
     * The computed variables
     *
     * @type diag.variables
     */
    this.variables = {};


    /**
     * The computed variables
     *
     * @type Array.<diag.result>
     */
    this.results = [];

    /**
     * List of block in the results
     * @type {Array.<diag.string>}
     */
    this.blockList = [] ;

    var HOURS = "H";
    var GRAM = "g";
    var KILOGRAM = "kg";
    var ML = "ml";
    var LITER = "l";
    var PASTILLE = "pastille"; //FIXME translation
    var GALET = "galet"; //FIXME translation
    var BLOCK = "bloc"; //FIXME translation
    var POCKET = "sachet"; //FIXME translation
    var CARTRIDGE = "cartouche"; //FIXME translation


    this._sanitizeInput = function(){
        this.input.options.modeTroubled = (this.input.options.mode === DIAG_MODES.TROUBLED);
        this.input.options.modeAlg = (this.input.options.mode === DIAG_MODES.ALG);
        this.input.options.modeColor = (this.input.options.mode === DIAG_MODES.COLOR);
        this.input.options.modeNotColor = !this.input.options.modeColor;
        this.input.options.modeVer = (this.input.options.mode === DIAG_MODES.VER);
        this.input.pool.filterGlassSand = (this.input.pool.filter === FILTER.GLASS || this.input.pool.filter === FILTER.SAND);
        this.input.pool.filterCart = (this.input.pool.filter === FILTER.CARTRIDGE || this.input.pool.filter === FILTER.POCKET);
        this.input.pool.cl = (this.input.pool.disinf === DISINFECTANT.CL);
        this.input.pool.isBr = (this.input.pool.disinf === DISINFECTANT.BR);
        this.input.pool.o2 = (this.input.pool.disinf === DISINFECTANT.O2);

    }

    this._sanitizeInput() ;

    this._format = function(value, unit){
        if([CARTRIDGE, PASTILLE, GALET, BLOCK, POCKET].indexOf(unit) !== -1){
            return value+" "+unit+((value>1 || value==="des")?"s":"") ;
        }
        var qty = Qty(value+' '+unit);
        var result = qty ;
        if(unit === GRAM){
            //try kg
            if(qty.to(KILOGRAM).scalar>=1){
                result = qty.to(KILOGRAM).toPrec(0.1) ;
            }
        }else if(unit === ML){
            //try liter
            if(qty.to(LITER).scalar>=1){
                result = qty.to(LITER).toPrec(0.1) ;
            }
        }else if(unit === HOURS){
            // do nothing on hours
        }
        return result.toPrec(0.1).toString() ;
    };

    /**
     * analyze the input and generate all needed variables
     */
    this.computeVariables = function () {
        _self.variables.references = {};
        _self.variables.references.minAlk = 90;
        _self.variables.references.minPH = 7;
        if (_self.input.pool.disinf === DISINFECTANT.CL) {
            _self.variables.references.loPHlimit = 6.9;
        } else if (_self.input.pool.disinf === DISINFECTANT.BR) {
            _self.variables.references.loPHlimit = 7.0;
        } else if (_self.input.pool.disinf === DISINFECTANT.O2) {
            _self.variables.references.loPHlimit = 6.9;
        }

        if (_self.input.pool.disinf === DISINFECTANT.CL) {
            _self.variables.references.maxPH = 7.4;
        } else if (_self.input.pool.disinf === DISINFECTANT.BR) {
            _self.variables.references.maxPH = 7.6;
        } else if (_self.input.pool.disinf === DISINFECTANT.O2) {
            _self.variables.references.maxPH = 7.4;
        }

        if (_self.input.pool.disinf === DISINFECTANT.CL) {
            _self.variables.references.targetPH = 7.2;
        } else if (_self.input.pool.disinf === DISINFECTANT.BR) {
            _self.variables.references.targetPH = 7.4;
        } else if (_self.input.pool.disinf === DISINFECTANT.O2) {
            _self.variables.references.targetPH = 7.2;
        }

        if (_self.input.pool.disinf === DISINFECTANT.CL) {
            _self.variables.references.targetPHzone = " entre 7.0 et 7.4 ";
        } else if (_self.input.pool.disinf === DISINFECTANT.BR) {
            _self.variables.references.targetPHzone = " à une valeur de 7.4 ";
        } else if (_self.input.pool.disinf === DISINFECTANT.O2) {
            _self.variables.references.targetPHzone = " entre 7.0 et 7.4 ";
        }

        if (_self.input.pool.disinf === DISINFECTANT.CL) {
            _self.variables.references.hiPHlimit = 7.6;
        } else if (_self.input.pool.disinf === DISINFECTANT.BR) {
            _self.variables.references.hiPHlimit = 7.8;
        } else if (_self.input.pool.disinf === DISINFECTANT.O2) {
            _self.variables.references.hiPHlimit = 7.6;
        }

        _self.variables.references.minFreeCl = 0.5;

        if (_self.input.options.mode === DIAG_MODES.TROUBLED) {
            _self.variables.references.maxFreeCl = 4;
        } else if (_self.input.options.mode === DIAG_MODES.ALG) {
            _self.variables.references.maxFreeCl = 4;
        } else if (_self.input.options.mode === DIAG_MODES.COLOR) {
            _self.variables.references.maxFreeCl = 4;
        } else {
            _self.variables.references.maxFreeCl = 2;
        }

        _self.variables.references.minTotalCl = 0.5;
        _self.variables.references.maxTotalCl = 2.5;
        _self.variables.references.minTH = 150;
        _self.variables.references.maxTH = 200;
        _self.variables.references.maxFe = 0;
        _self.variables.references.maxCu = 0;

        if (_self.input.pool.disinf === DISINFECTANT.CL) {
            _self.variables.references.maxStab = 100;
        } else if (_self.input.pool.disinf === DISINFECTANT.BR) {
            _self.variables.references.maxStab = 0;
        } else if (_self.input.pool.disinf === DISINFECTANT.O2) {
            _self.variables.references.maxStab = 150;
        }

        _self.variables.references.minBr = 1;

        if (_self.input.options.mode === DIAG_MODES.TROUBLED) {
            _self.variables.references.maxBr = 5;
        } else if (_self.input.options.mode === DIAG_MODES.ALG) {
            _self.variables.references.maxBr = 5;
        } else if (_self.input.options.mode === DIAG_MODES.COLOR) {
            _self.variables.references.maxBr = 5;
        } else {
            _self.variables.references.maxBr = 3;
        }


        var mes = _self.input.measures;
        var ref = _self.variables.references;
        var pool = _self.input.pool;


        _self.variables.references.hiBrlimit = 8;
        _self.variables.computed = {};


        mes.displayedAlk = mes.alk ;
        if(mes.alk === undefined || mes.alk === null){
            mes.alk = 91;
            mes.displayedAlk = "" ;
        }
        mes.displayedTh = mes.th ;
        if(mes.th === undefined || mes.th === null){
            mes.th = 151;
            mes.displayedTh = "" ;
        }
        mes.displayedClTotal = mes.clTotal ;
        if(mes.clTotal === undefined || mes.clTotal === null){
            mes.clTotal = mes.clFree;
            mes.displayedClTotal = "" ;
        }
        mes.displayedFe = mes.fe  ;
        if(mes.fe === undefined || mes.fe === null){
            mes.fe = 0;
            mes.displayedFe = "" ;
        }
        mes.displayedCu = mes.cu ;
        if(mes.cu === undefined || mes.cu === null){
            mes.cu = 0;
            mes.displayedCu = "" ;
        }
        mes.displayedStab = mes.stab ;
        if(mes.stab === undefined || mes.stab === null){
            mes.stab = 99;
            mes.displayedStab = "" ;
        }

        mes.displayedSalt = mes.salt ;
        if(mes.salt === undefined || mes.salt === null){
            mes.displayedSalt = "" ;
        }

        mes.displayedSaltRate = pool.saltRate ;
        if(pool.saltRate === undefined || pool.saltRate === null){
            mes.displayedSaltRate = "" ;
        }




        _self.variables.computed.alkOk = (mes.alk >= ref.minAlk);
        _self.variables.computed.alkLow = (mes.alk < ref.minAlk);
        _self.variables.computed.alkVeryLow = (mes.alk < 80 );
        _self.variables.computed.phLow = (mes.ph < ref.minPH );
        _self.variables.computed.phVeryLow = (mes.ph < ref.loPHlimit );
        _self.variables.computed.phHigh = (mes.ph > ref.maxPH );
        _self.variables.computed.phVeryHigh = (mes.ph > ref.hiPHlimit );
        _self.variables.computed.phOk = (mes.ph >= ref.minPH && mes.ph <= ref.maxPH);
        _self.variables.computed.thOk = (mes.th >= ref.minTH && mes.th <= ref.maxTH);
        _self.variables.computed.thLow = (mes.th < ref.minTH);
        _self.variables.computed.thHigh = (mes.th > ref.maxTH);
        _self.variables.computed.thNotHight = !_self.variables.computed.thHigh;
        _self.variables.computed.stabHigh = (mes.stab > ref.maxStab);
        _self.variables.computed.feZero = (mes.fe === 0);
        _self.variables.computed.fePresent = !_self.variables.computed.feZero;
        _self.variables.computed.feLow = (mes.fe > 0 && mes.fe <= 0.1);
        _self.variables.computed.feHigh = (mes.fe > 0.1);
        _self.variables.computed.cuZero = (mes.cu === 0);
        _self.variables.computed.cuPresent = !_self.variables.computed.cuZero;
        _self.variables.computed.cuLow = (mes.cu >= 0.01 && mes.cu <= 0.2);
        _self.variables.computed.cuHigh = (mes.cu > 0.2);
        _self.variables.computed.clLow = (mes.clFree < ref.minFreeCl);
        _self.variables.computed.clOk = (mes.clFree >= ref.minFreeCl && mes.clFree <= ref.maxFreeCl);
        _self.variables.computed.clNotHigh = (mes.clFree <= ref.maxFreeCl);
        _self.variables.computed.clHigh = (mes.clFree > ref.maxFreeCl && mes.clFree <= 8);
        _self.variables.computed.clVeryHigh = (mes.clFree > 8);
        _self.variables.computed.clNotVeryHigh = !_self.variables.computed.clVeryHigh;
        _self.variables.computed.clDiff = (mes.clFree && mes.clTotal)?(Math.round((mes.clTotal - mes.clFree) * 100) / 100):0 ;
        _self.variables.computed.clTotalHigh = (mes.clFree && mes.clTotal && (mes.clTotal - mes.clFree).toFixed(1) > 0.6);
        _self.variables.computed.saltLow = (mes.salt !== null && mes.salt !== undefined && mes.salt < pool.saltRate);
        _self.variables.computed.brOk = (mes.br >= ref.minBr && mes.br <= ref.maxBr);
        _self.variables.computed.brLow = (mes.br < ref.minBr);
        _self.variables.computed.brNotHigh = (mes.br <= ref.maxBr);
        _self.variables.computed.brHigh = (mes.br > ref.maxBr && mes.br <= ref.hiBrlimit);
        _self.variables.computed.brVeryHigh = (mes.br > ref.hiBrlimit);
        _self.variables.computed.poolMore8m3 = (pool.volume >= 8)


        _self.variables.dosage = {};
        if(mes.temp / 2 > 24){
            _self.variables.dosage.xt1 = _self._format(24, HOURS);
        }else{
            _self.variables.dosage.xt1 = _self._format(mes.temp / 2, HOURS);
        }

        _self.variables.dosage["xph+"] = _self._format((10 * pool.volume) * ( (ref.targetPH - mes.ph) * 10 ), GRAM);
        _self.variables.dosage["xph-"] = _self._format((10 * pool.volume) * ( (mes.ph - ref.targetPH) * 10 ), GRAM);
        _self.variables.dosage.xtac = _self._format((18 * pool.volume) * ( (100 - mes.alk) * 0.1 ), GRAM);

        _self.variables.dosage.x1 = _self._format(30 * pool.volume, ML);
        _self.variables.dosage.x2 = _self._format(1 * pool.volume, PASTILLE);
        _self.variables.dosage.x3 = _self._format(15 * pool.volume, GRAM);
        if (pool.volume <= 3) {
            _self.variables.dosage.x4 = 1;
        } else if (pool.volume <= 6) {
            _self.variables.dosage.x4 = 2;
        } else if (pool.volume <= 9) {
            _self.variables.dosage.x4 = 3;
        } else if (pool.volume <= 12) {
            _self.variables.dosage.x4 = 4;
        } else if (pool.volume <= 14) {
            _self.variables.dosage.x4 = 5;
        } else {
            _self.variables.dosage.x4 = "des";
        }
        _self.variables.dosage.x4 = _self._format(_self.variables.dosage.x4, PASTILLE);

        if (pool.volume <= 50) {
            _self.variables.dosage.x5 = 1;
        } else if (pool.volume <= 100) {
            _self.variables.dosage.x5 = 2;
        } else if (pool.volume <= 150) {
            _self.variables.dosage.x5 = 3;
        } else if (pool.volume <= 200) {
            _self.variables.dosage.x5 = 4;
        } else {
            _self.variables.dosage.x5 = "des";
        }
        _self.variables.dosage.x5 = _self._format(_self.variables.dosage.x5, CARTRIDGE);

        if (pool.volume <= 35) {
            _self.variables.dosage.x6 = 1;
        } else if (pool.volume <= 70) {
            _self.variables.dosage.x6 = 2;
        } else if (pool.volume <= 105) {
            _self.variables.dosage.x6 = 3;
        } else if (pool.volume <= 140) {
            _self.variables.dosage.x6 = 4;
        } else if (pool.volume <= 175) {
            _self.variables.dosage.x6 = 5;
        } else if (pool.volume <= 210) {
            _self.variables.dosage.x6 = 6;
        } else {
            _self.variables.dosage.x6 = "des";
        }
        _self.variables.dosage.x6 = _self._format(_self.variables.dosage.x6, GALET);

        if (pool.volume <= 30) {
            _self.variables.dosage.x7 = 1;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x7 = 2;
        } else if (pool.volume <= 90) {
            _self.variables.dosage.x7 = 3;
        } else if (pool.volume <= 120) {
            _self.variables.dosage.x7 = 4;
        } else if (pool.volume <= 150) {
            _self.variables.dosage.x7 = 5;
        } else if (pool.volume <= 180) {
            _self.variables.dosage.x7 = 6;
        } else if (pool.volume <= 210) {
            _self.variables.dosage.x7 = 7;
        } else {
            _self.variables.dosage.x7 = "des";
        }
        _self.variables.dosage.x7 = _self._format(_self.variables.dosage.x7, GALET);

        if (pool.volume <= 30) {
            _self.variables.dosage.x8 = 1;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x8 = 2;
        } else if (pool.volume <= 90) {
            _self.variables.dosage.x8 = 3;
        } else if (pool.volume <= 120) {
            _self.variables.dosage.x8 = 4;
        } else if (pool.volume <= 150) {
            _self.variables.dosage.x8 = 5;
        } else if (pool.volume <= 180) {
            _self.variables.dosage.x8 = 6;
        } else if (pool.volume <= 210) {
            _self.variables.dosage.x8 = 7;
        } else {
            _self.variables.dosage.x8 = "des";
        }
        _self.variables.dosage.x8 = _self._format(_self.variables.dosage.x8, GALET);

        _self.variables.dosage.x9 = _self._format(10 * pool.volume, GRAM);
        _self.variables.dosage.x10 = _self._format(10 * pool.volume, GRAM);
        _self.variables.dosage.x11 = _self._format(0.1 * pool.volume, LITER);

        if (pool.volume <= 20) {
            _self.variables.dosage.x12 = 1;
        } else if (pool.volume <= 40) {
            _self.variables.dosage.x12 = 2;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x12 = 3;
        } else if (pool.volume <= 80) {
            _self.variables.dosage.x12 = 4;
        } else if (pool.volume <= 100) {
            _self.variables.dosage.x12 = 5;
        } else {
            _self.variables.dosage.x12 = "des";
        }
        _self.variables.dosage.x12 = _self._format(_self.variables.dosage.x12, POCKET);

        _self.variables.dosage.x13 = _self._format(5 * pool.volume, ML);
        _self.variables.dosage.x14 = _self._format(20 * pool.volume, GRAM);
        _self.variables.dosage.x15 = _self._format(5 * pool.volume, ML);
        _self.variables.dosage.x16 = _self._format(1 * pool.volume, ML);

        if (pool.volume <= 15) {
            _self.variables.dosage.x17 = 1;
        } else if (pool.volume <= 30) {
            _self.variables.dosage.x17 = 2;
        } else if (pool.volume <= 45) {
            _self.variables.dosage.x17 = 3;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x17 = 4;
        } else if (pool.volume <= 75) {
            _self.variables.dosage.x17 = 5;
        } else if (pool.volume <= 90) {
            _self.variables.dosage.x17 = 6;
        } else if (pool.volume <= 105) {
            _self.variables.dosage.x17 = 7;
        } else if (pool.volume <= 120) {
            _self.variables.dosage.x17 = 8;
        } else if (pool.volume <= 135) {
            _self.variables.dosage.x17 = 9;
        } else if (pool.volume <= 150) {
            _self.variables.dosage.x17 = 10;
        } else {
            _self.variables.dosage.x17 = "des";
        }
        _self.variables.dosage.x17 = _self._format(_self.variables.dosage.x17, GALET);

        if (pool.volume <= 30) {
            _self.variables.dosage.x18 = 1;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x18 = 2;
        } else if (pool.volume <= 90) {
            _self.variables.dosage.x18 = 3;
        } else if (pool.volume <= 120) {
            _self.variables.dosage.x18 = 4;
        } else if (pool.volume <= 150) {
            _self.variables.dosage.x18 = 5;
        } else if (pool.volume <= 180) {
            _self.variables.dosage.x18 = 6;
        } else if (pool.volume <= 210) {
            _self.variables.dosage.x18 = 7;
        } else {
            _self.variables.dosage.x18 = "des";
        }
        _self.variables.dosage.x18 = _self._format(_self.variables.dosage.x18, BLOCK);

        if (pool.volume <= 30) {
            _self.variables.dosage.x19 = 1;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x19 = 2;
        } else if (pool.volume <= 90) {
            _self.variables.dosage.x19 = 3;
        } else if (pool.volume <= 120) {
            _self.variables.dosage.x19 = 4;
        } else if (pool.volume <= 150) {
            _self.variables.dosage.x19 = 5;
        } else if (pool.volume <= 180) {
            _self.variables.dosage.x19 = 6;
        } else if (pool.volume <= 210) {
            _self.variables.dosage.x19 = 7;
        } else {
            _self.variables.dosage.x19 = "des";
        }
        _self.variables.dosage.x19 = _self._format(_self.variables.dosage.x19, BLOCK);

        if (pool.volume <= 50) {
            _self.variables.dosage.x20 = 1;
        } else if (pool.volume <= 100) {
            _self.variables.dosage.x20 = 2;
        } else if (pool.volume <= 150) {
            _self.variables.dosage.x20 = 3;
        } else if (pool.volume <= 200) {
            _self.variables.dosage.x20 = 4;
        } else {
            _self.variables.dosage.x20 = "des";
        }
        _self.variables.dosage.x20 = _self._format(_self.variables.dosage.x20, CARTRIDGE);

        if (pool.volume <= 20) {
            _self.variables.dosage.x21 = 1;
        } else if (pool.volume <= 40) {
            _self.variables.dosage.x21 = 2;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x21 = 3;
        } else if (pool.volume <= 80) {
            _self.variables.dosage.x21 = 4;
        } else if (pool.volume <= 100) {
            _self.variables.dosage.x21 = 5;
        } else {
            _self.variables.dosage.x21 = "des";
        }
        _self.variables.dosage.x21 = _self._format(_self.variables.dosage.x21, POCKET);

        if (pool.volume <= 30) {
            _self.variables.dosage.x22 = 1;
        } else if (pool.volume <= 60) {
            _self.variables.dosage.x22 = 2;
        } else if (pool.volume <= 90) {
            _self.variables.dosage.x22 = 3;
        } else if (pool.volume <= 120) {
            _self.variables.dosage.x22 = 4;
        } else {
            _self.variables.dosage.x22 = "des";
        }
        _self.variables.dosage.x22 = _self._format(_self.variables.dosage.x22, POCKET);

        _self.variables.dosage.x23 = _self._format(0.05 * pool.volume, LITER);
        _self.variables.dosage.x24 = _self._format(0.05 * pool.volume, LITER);
        _self.variables.dosage.xsel = _self._format((pool.saltRate - mes.salt) * pool.volume, KILOGRAM);
        _self.variables.dosage["maxph+"] = _self._format(30 * pool.volume, GRAM);
        _self.variables.dosage["maxph-"] = _self._format(40 * pool.volume, GRAM);
        _self.variables.dosage.maxtac = _self._format(36 * pool.volume, GRAM);

    };

    this.rules = [
        {block: "TROU_1", order: "0.1", orderTroubled: "0.1", orderAlg: "0.1", orderColor: "0.1", rule: ["input.options.modeTroubled"]    },
        {block: "FILT_2", order: "1.3", orderTroubled: "1.3", orderAlg: "1.3", orderColor: "1.3", rule: ["input.options.modeTroubled"]    },
        {block: "FILT_2", order: "1.3", orderTroubled: "1.3", orderAlg: "1.3", orderColor: "1.3", rule: ["input.options.modeAlg"]    },
        {block: "ALG_2", order: "0.1", orderTroubled: "0.1", orderAlg: "0.1", orderColor: "0.1", rule: ["input.options.modeAlg"]    },
        {block: "ALG_3", order: "1.2", orderTroubled: "1.2", orderAlg: "1.2", orderColor: "1.2", rule: ["input.options.modeAlg"]    },
        {block: "ALG_4", order: "1.4", orderTroubled: "1.4", orderAlg: "1.4", orderColor: "1.4", rule: ["input.options.modeAlg", "input.pool.filterGlassSand", "variables.computed.poolMore8m3"]    },
        {block: "COL_1", order: "0.1", orderTroubled: "0.1", orderAlg: "0.1", orderColor: "0.1", rule: ["input.options.modeColor"]    },
        {block: "FILT_6", order: "1.2", orderTroubled: "1.2", orderAlg: "1.2", orderColor: "1.2", rule: ["input.options.modeColor"]    },
        {block: "TEMP_1", order: "1.6", orderTroubled: "1.6", orderAlg: "1.6", orderColor: "1.6", rule: []    },
        {block: "REGUL_1", order: "1.7", orderTroubled: "1.7", orderAlg: "1.7", orderColor: "1.7", rule: ["input.pool.regul"]    },
        {block: "SEL_1", order: "1.7", orderTroubled: "6.1", orderAlg: "6.1", orderColor: "9a.0", rule: ["input.pool.cl", "input.pool.saltElect", "variables.computed.saltLow"]    },
        {block: "PH_1", order: "2.1", orderTroubled: "2.1", orderAlg: "2.1", orderColor: "2.5", rule: ["variables.computed.alkOk", "variables.computed.phLow"]    },
        {block: "PH_2", order: "2.2", orderTroubled: "2.2", orderAlg: "2.2", orderColor: "7.1", rule: ["variables.computed.alkOk", "variables.computed.phHigh"]    },
        {block: "TAC_1", order: "2.3", orderTroubled: "2.3", orderAlg: "2.3", orderColor: "2.1", rule: ["variables.computed.alkLow"]    },
        {block: "PH_3", order: "2.4", orderTroubled: "2.4", orderAlg: "2.4", orderColor: "2.2", rule: ["variables.computed.alkLow", "variables.computed.phLow"]    },
        {block: "PH_4", order: "2.7", orderTroubled: "2.7", orderAlg: "2.7", orderColor: "2.4", rule: ["variables.computed.alkLow", "variables.computed.phOk"]    },
        {block: "PH_5", order: "2.6", orderTroubled: "2.6", orderAlg: "2.6", orderColor: "2.3", rule: ["variables.computed.alkLow", "variables.computed.phHigh"]    },
        {block: "TH_1", order: "3.1", orderTroubled: "3.1", orderAlg: "3.1", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thHigh"]    },
        {block: "TH_1", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "9a.1", rule: ["input.options.modeColor", "variables.computed.thHigh", "variables.computed.feZero", "variables.computed.cuZero"]    },
        {block: "TH_2", order: "3.2", orderTroubled: "3.2", orderAlg: "3.2", orderColor: "9a.2", rule: ["variables.computed.thLow"]    },
        {block: "TH_3", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "9a.3", rule: ["input.options.modeColor", "variables.computed.thHigh", "variables.computed.fePresent"]    },
        {block: "TH_3", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "9a.3", rule: ["input.options.modeColor", "variables.computed.thHigh", "variables.computed.cuPresent"]    },
        {block: "STA_1", order: "4.1", orderTroubled: "1.4", orderAlg: "1.5", orderColor: "7.0", rule: ["input.pool.cl", "variables.computed.stabHigh"]    },
        {block: "STA_2", order: "4.1", orderTroubled: "1.4", orderAlg: "1.5", orderColor: "7.0", rule: ["input.pool.o2", "variables.computed.stabHigh"]    },
        {block: "FE_1", order: "7.1", orderTroubled: "7.1", orderAlg: "7.1", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thNotHight", "variables.computed.feLow"]    },
        {block: "FE_2", order: "7.2", orderTroubled: "7.2", orderAlg: "7.2", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thNotHight", "variables.computed.feHigh"]    },
        {block: "FE_3", order: "7.3", orderTroubled: "7.3", orderAlg: "7.3", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thHigh", "variables.computed.feLow"]    },
        {block: "FE_4", order: "7.4", orderTroubled: "7.4", orderAlg: "7.4", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thHigh", "variables.computed.feHigh"]    },
        {block: "CU_1", order: "7.5", orderTroubled: "7.5", orderAlg: "7.5", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thNotHight", "variables.computed.feZero", "variables.computed.cuLow"]    },
        {block: "CU_2", order: "7.6", orderTroubled: "7.6", orderAlg: "7.6", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thNotHight", "variables.computed.feZero", "variables.computed.cuHigh"]    },
        {block: "CU_3", order: "7.7", orderTroubled: "7.7", orderAlg: "7.7", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.fePresent", "variables.computed.cuLow"]    },
        {block: "CU_4", order: "7.8", orderTroubled: "7.8", orderAlg: "7.8", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.fePresent", "variables.computed.cuHigh"]    },
        {block: "CU_5", order: "7.9", orderTroubled: "7.9", orderAlg: "7.9", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thHigh", "variables.computed.feZero", "variables.computed.cuLow"]    },
        {block: "CU_6", order: "7.9", orderTroubled: "7.9", orderAlg: "7.9", orderColor: "-", rule: ["input.options.modeNotColor", "variables.computed.thHigh", "variables.computed.feZero", "variables.computed.cuHigh"]    },
        {block: "FE_5", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "3.1", rule: ["input.options.modeColor", "variables.computed.feLow"]    },
        {block: "FE_6", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "3.2", rule: ["input.options.modeColor", "variables.computed.feHigh"]    },
        {block: "CU_7", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "3.3", rule: ["input.options.modeColor", "variables.computed.feZero", "variables.computed.cuLow"]    },
        {block: "CU_8", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "3.4", rule: ["input.options.modeColor", "variables.computed.feZero", "variables.computed.cuHigh"]    },
        {block: "CU_9", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "3.5", rule: ["input.options.modeColor", "variables.computed.fePresent", "variables.computed.cuLow"]    },
        {block: "CU_10", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "3.6", rule: ["input.options.modeColor", "variables.computed.fePresent", "variables.computed.cuHigh"]    },
        {block: "CL_1", order: "5.1", orderTroubled: "-", orderAlg: "-", orderColor: "-", rule: ["input.pool.cl", "input.options.modeVer", "variables.computed.clLow"]    },
        {block: "CL_2", order: "5.2", orderTroubled: "-", orderAlg: "-", orderColor: "-", rule: ["input.pool.cl", "input.options.modeVer", "variables.computed.clHigh"]    },
        {block: "CL_3", order: "5.3", orderTroubled: "-", orderAlg: "-", orderColor: "-", rule: ["input.pool.cl", "input.options.modeVer", "variables.computed.clVeryHigh"]    },
        {block: "CL_4", order: "6.1", orderTroubled: "5.1", orderAlg: "5.1", orderColor: "7.2", rule: ["input.pool.cl", "variables.computed.clNotVeryHigh", "variables.computed.clTotalHigh"]    },
        {block: "CL_6", order: "-", orderTroubled: "4.1", orderAlg: "-", orderColor: "-", rule: ["input.pool.cl", "input.options.modeTroubled", "variables.computed.clNotHigh"]    },
        {block: "TROU_3", order: "-", orderTroubled: "4.2", orderAlg: "-", orderColor: "-", rule: ["input.pool.cl", "input.options.modeTroubled", "variables.computed.clHigh"]    },
        {block: "TROU_4", order: "-", orderTroubled: "4.3", orderAlg: "-", orderColor: "-", rule: ["input.pool.cl", "input.options.modeTroubled", "variables.computed.clVeryHigh"]    },
        {block: "CL_6", order: "-", orderTroubled: "-", orderAlg: "4.1", orderColor: "-", rule: ["input.pool.cl", "input.options.modeAlg", "variables.computed.clNotHigh"]    },
        {block: "ALG_5", order: "-", orderTroubled: "-", orderAlg: "4.2", orderColor: "-", rule: ["input.pool.cl", "input.options.modeAlg", "variables.computed.clHigh"]    },
        {block: "ALG_6", order: "-", orderTroubled: "-", orderAlg: "4.3", orderColor: "-", rule: ["input.pool.cl", "input.options.modeAlg", "variables.computed.clVeryHigh"]    },
        {block: "CL_7", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "5.1", rule: ["input.pool.cl", "input.options.modeColor", "variables.computed.clNotHigh"]    },
        {block: "COL_2", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "5.2", rule: ["input.pool.cl", "input.options.modeColor", "variables.computed.clHigh"]    },
        {block: "COL_3", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "5.3", rule: ["input.pool.cl", "input.options.modeColor", "variables.computed.clVeryHigh"]    },
        {block: "COL_4", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "6.1", rule: ["input.options.modeColor"]    },
        {block: "CALC_1", order: "9b.1", orderTroubled: "9b.1", orderAlg: "9b.1", orderColor: "9b.1", rule: []    },
        {block: "SABLE_1", order: "9b.2", orderTroubled: "9b.2", orderAlg: "9b.2", orderColor: "9b.2", rule: ["input.pool.filterGlassSand", "variables.computed.poolMore8m3"]    },
        {block: "MESU_1", order: "9b.3", orderTroubled: "9b.3", orderAlg: "9b.3", orderColor: "9b.3", rule: ["input.pool.cl"]    },
        {block: "PH_6", order: "9b.4", orderTroubled: "9b.4", orderAlg: "9b.4", orderColor: "9b.4", rule: []    },
        {block: "CL_5", order: "9b.5", orderTroubled: "9b.5", orderAlg: "9b.5", orderColor: "9b.5", rule: ["input.pool.cl"]    },
        {block: "ALG_1", order: "9b.6", orderTroubled: "9b.6", orderAlg: "9b.6", orderColor: "9b.6", rule: ["input.pool.cl"]    },
        {block: "ALG_1", order: "9b.6", orderTroubled: "9b.6", orderAlg: "9b.6", orderColor: "9b.6", rule: ["input.pool.isBr"]    },
        {block: "FILT_1", order: "9b.7", orderTroubled: "9b.7", orderAlg: "9b.7", orderColor: "9b.7", rule: ["input.pool.filterGlassSand"]    },
        {block: "FILT_1", order: "9b.7", orderTroubled: "9b.7", orderAlg: "9b.7", orderColor: "9b.7", rule: ["input.pool.filterCart"]    },
        {block: "LIGN_1", order: "9b.8", orderTroubled: "9b.8", orderAlg: "9b.8", orderColor: "9b.8", rule: []    },
        {block: "CALC_2", order: "9b.9", orderTroubled: "9b.9", orderAlg: "9b.9", orderColor: "9b.9", rule: []    },
        {block: "REN_1", order: "9b.9a", orderTroubled: "9b.9a", orderAlg: "9b.9a", orderColor: "9b.9a", rule: []    },
        {block: "O2_1", order: "9b.5", orderTroubled: "9b.5", orderAlg: "9b.5", orderColor: "9b.5", rule: ["input.pool.o2"]    },
        {block: "O2_2", order: "-", orderTroubled: "4.1", orderAlg: "-", orderColor: "-", rule: ["input.pool.o2", "input.options.modeTroubled"]    },
        {block: "O2_2", order: "-", orderTroubled: "-", orderAlg: "4.1", orderColor: "-", rule: ["input.pool.o2", "input.options.modeAlg"]    },
        {block: "O2_3", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "5.1", rule: ["input.pool.o2", "input.options.modeColor"]    },
        {block: "BR_1", order: "5.1", orderTroubled: "5.1", orderAlg: "5.1", orderColor: "5.1", rule: ["input.pool.isBr", "input.options.modeVer", "variables.computed.brLow"]    },
        {block: "BR_2", order: "5.2", orderTroubled: "5.2", orderAlg: "5.2", orderColor: "5.2", rule: ["input.pool.isBr", "input.options.modeVer", "variables.computed.brHigh"]    },
        {block: "BR_3", order: "5.3", orderTroubled: "5.3", orderAlg: "5.3", orderColor: "5.3", rule: ["input.pool.isBr", "input.options.modeVer", "variables.computed.brVeryHigh"]    },
        {block: "BR_5", order: "-", orderTroubled: "4.1", orderAlg: "-", orderColor: "-", rule: ["input.pool.isBr", "input.options.modeTroubled", "variables.computed.brNotHigh"]    },
        {block: "TROU_6", order: "-", orderTroubled: "4.2", orderAlg: "-", orderColor: "-", rule: ["input.pool.isBr", "input.options.modeTroubled", "variables.computed.brHigh"]    },
        {block: "TROU_7", order: "-", orderTroubled: "4.3", orderAlg: "-", orderColor: "-", rule: ["input.pool.isBr", "input.options.modeTroubled", "variables.computed.brVeryHigh"]    },
        {block: "BR_5", order: "-", orderTroubled: "-", orderAlg: "4.1", orderColor: "-", rule: ["input.pool.isBr", "input.options.modeAlg", "variables.computed.brNotHigh"]    },
        {block: "ALG_8", order: "-", orderTroubled: "-", orderAlg: "4.2", orderColor: "-", rule: ["input.pool.isBr", "input.options.modeAlg", "variables.computed.brHigh"]    },
        {block: "ALG_9", order: "-", orderTroubled: "-", orderAlg: "4.3", orderColor: "-", rule: ["input.pool.isBr", "input.options.modeAlg", "variables.computed.brVeryHigh"]    },
        {block: "BR_6", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "5.1", rule: ["input.pool.isBr", "input.options.modeColor", "variables.computed.brNotHigh"]    },
        {block: "COL_5", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "5.2", rule: ["input.pool.isBr", "input.options.modeColor", "variables.computed.brHigh"]    },
        {block: "COL_6", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "5.3", rule: ["input.pool.isBr", "input.options.modeColor", "variables.computed.brVeryHigh"]    },
        {block: "MESU_2", order: "9b.3", orderTroubled: "9b.3", orderAlg: "9b.3", orderColor: "9b.3", rule: ["input.pool.isBr"]    },
        {block: "BR_4", order: "9b.5", orderTroubled: "9b.5", orderAlg: "9b.5", orderColor: "9b.5", rule: ["input.pool.isBr"]    },
        {block: "MESU_3", order: "9b.3", orderTroubled: "9b.3", orderAlg: "9b.3", orderColor: "9b.3", rule: ["input.pool.o2"]    },
        {block: "FILT_3", order: "-", orderTroubled: "5.2", orderAlg: "-", orderColor: "-", rule: ["input.options.modeTroubled", "input.pool.filterGlassSand"]    },
        {block: "FILT_4", order: "-", orderTroubled: "5.2", orderAlg: "-", orderColor: "-", rule: ["input.options.modeTroubled", "input.pool.filterCart"]    },
        {block: "FILT_3", order: "-", orderTroubled: "-", orderAlg: "5.3", orderColor: "-", rule: ["input.options.modeAlg", "input.pool.filterGlassSand"]    },
        {block: "FILT_4", order: "-", orderTroubled: "-", orderAlg: "5.3", orderColor: "-", rule: ["input.options.modeAlg", "input.pool.filterCart"]    },
        {block: "ALG_7", order: "-", orderTroubled: "-", orderAlg: "5.2", orderColor: "-", rule: ["input.pool.cl", "input.options.modeAlg"]    },
        {block: "ALG_7", order: "-", orderTroubled: "-", orderAlg: "5.3", orderColor: "-", rule: ["input.pool.isBr", "input.options.modeAlg"]    },
        {block: "FILT_3", order: "-", orderTroubled: "-", orderAlg: "-", orderColor: "4.1", rule: ["input.options.modeColor", "variables.computed.feZero", "variables.computed.cuZero", "input.pool.filterGlassSand"]    },
        {block: "MIS_1", order: "9c.1", orderTroubled: "9c.1", orderAlg: "9c.1", orderColor: "9c.1", rule: ["input.options.startUp"]    },
        {block: "HIV_1", order: "9c.4", orderTroubled: "9c.4", orderAlg: "9c.4", orderColor: "9c.4", rule: ["input.options.wintering"]    },
        {block: "FILT_5", order: "9c.2", orderTroubled: "9c.2", orderAlg: "9c.2", orderColor: "9c.2", rule: ["input.options.filterMaint"]    },
        {block: "LIGN_2", order: "9c.3", orderTroubled: "9c.3", orderAlg: "9c.3", orderColor: "9c.3", rule: ["input.options.cleanLine"]    },
        {block: "TACH_1", order: "9a.4", orderTroubled: "9a.4", orderAlg: "9a.4", orderColor: "9a.4", rule: ["input.options.mark"]    }

    ];

    /**
     * Get the value of a variable path
     * @param path {string} the path of the variable (ex : "input.pool.cl")
     * @returns {Diag}
     * @private
     */
    this._getValueFromPath = function(path){
        var aVars = path.split(".");
        var variable = _self;
        aVars.forEach(function (v) {
            if(variable[v] === undefined){
                throw "Can't find "+v+" in path "+path ;
            }
            variable = variable[v];
        });
        return variable ;
    } ;

    /**
     * analyze the rules and return the blocks to print
     * <br><br>
     * You must run {@link diag.Diag#computeVariables} before run this function
     *
     */
    this.applyRules = function () {
        _self.results = [];
        var addedBlock = {} ;
        _self.rules.forEach(function (r) {
            var toAdd = false;
            if (r.rule.length === 0) {
                //no condition, add it
                toAdd = true;
            } else {
                toAdd = true;
                r.rule.forEach(function (ru) {
                    if(!_self._getValueFromPath(ru)){
                        toAdd = false;
                    }
                });
            }

            if(addedBlock[r.block]){
                //already added
                toAdd = false;
            }

            if (toAdd) {
                var order = r.order;
                if (_self.input.options.modeTroubled) {
                    order = r.orderTroubled;
                } else if (_self.input.options.modeAlg) {
                    order = r.orderAlg;
                } else if (_self.input.options.modeColor) {
                    order = r.orderColor;
                }
                _self.results.push({
                    block: r.block,
                    order: order
                });
                addedBlock[r.block] = true ;
            }
        });
        _self.results = _self.results.sort(function (a, b) {
            if (a.order > b.order) {
                return 1;
            } else if (a.order < b.order) {
                return -1;
            } else {
                // a = b
                return 0;
            }
        });
        _self.blockList = Object.keys(addedBlock) ;
    };

    /**
     * Do a full diagnostic
     *
     * @return {Array.<diag.result>} The results of diagnostic
     */
    this.doFullDiag = function () {
        _self.computeVariables();
        return _self.applyRules();
    };
}

module.exports = Diag;
