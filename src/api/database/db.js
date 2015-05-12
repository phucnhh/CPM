var Datastore = require('nedb') ;
var fs = require('fs');

var VERSION_0_0_0 = "0.0.0" ;
var VERSION_0_0_1 = "0.0.1" ;
var VERSION_CURRENT = VERSION_0_0_1 ;

/**
 * Database layer
 * 
 * @param file {string} the path to the file of the database
 */
function Db(file) {
	
	this.file = file;
	this.fileVersion = file+"_version";
	
	this.db = new Datastore({ filename: file , autoload: true});
	
	/**
	 * migrate from previous version to new version
	 */
	this._migrate = function(){
		var version = { version : VERSION_0_0_0 } ;
		if(fs.existsSync(this.fileVersion)){
			//a version already exists
			try{
				version = JSON.parse(fs.readFileSync(this.fileVersion, {encoding : "utf8"})) ;
			}catch(e){
				console.log("buggy version file "+e) ;
			}
		}
		
		//perform migration
		if(version.version === VERSION_0_0_0){
			this._migrate_0_0_0_to_0_0_1() ;
		}
		
		if(version.version !== VERSION_CURRENT){
			//update version file
			fs.writeFileSync(this.fileVersion, JSON.stringify({version : VERSION_CURRENT, updated : new Date()}), {encoding : "utf8"}) ;
		}
	};
	
	/**
	 *  Migrate from version 0.0.0 to 0.0.1
	 */
	this._migrate_0_0_0_to_0_0_1 = function(){
		console.log("migrating from 0.0.0 to 0.0.1") ;
		this.db.ensureIndex({ fieldName: '_nameFirstName' }, function (err) {
			if(err){
				console.log("should not happen "+err); //it should not happen because it is not an unique index
			}
		});
	};
	
	this._migrate() ;
	
	//in the case user never close the software, set a compaction interval each 24h
	this.db.persistence.setAutocompactionInterval(1000 * 60 * 60 * 24) ;
	
	
	/**
	 * Insert a new document in the database
	 * 
	 * @param doc {object} the object to insert
	 * @param callback {function(err, newDoc)} callback called after the insert is done. newDoc is the newly inserted document, including its _id
	 */
	this.insert = function(doc, callback){
		this.db.insert(doc, callback) ;
	};
	
	/**
	 * Update a document in the database
	 * 
	 * @param doc {object} the object to update
	 * @param callback {function(err)} callback called after the update is done
	 */
	this.update = function(doc, callback){
		this.db.update({ _id: doc._id}, doc, callback) ;
	};
	
	/**
	 * Find document in the database
	 * see https://github.com/louischatriot/nedb#finding-documents
	 */
	this.find = function(query, callback){
		this.db.find(query, callback) ;
	};

    /**
     * Get document by id
     * @param {string} id id of the document (property _id)
     */
    this.get = function(id, callback){
        this.db.findOne({_id : id}, callback) ;
    };

    /**
     * Delete document by id
     * @param {string} id id of the document (property _id)
     */
    this.remove = function(id, callback){
        this.db.remove({_id : id}, callback) ;
    };
}

module.exports = Db;
