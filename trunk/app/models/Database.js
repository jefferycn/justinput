
/**
 * Creates or opens a new database with the given name. You can optionally
 * specify a version.
 * 
 * @param {String}
 *            dbname the name of the database
 * @param {Number}
 *            version an optional version
 */
function Database(dbname, version, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("Opening db: " + dbname);
	this.dbname = dbname;
	this.version = version;
	this.isReady = false;
	this.callback = callback;
	if (typeof(version) == "undefined" || version == null) {
		this.db = openDatabase(dbname);
	} else {
		this.db = openDatabase(dbname, version);
	}

	if (this.db) {
		var setAutoVac = function(success) {
			// Mojo.Log.info("setAutoVac -> " + success);
			var readyOrCreate = function(exists) {
				if (exists) {
					this.isReady = true;
					this.callback(this.isReady);
				} else {
					this
							.createTable(
									"words",
									'"id" INTEGER PRIMARY KEY  NOT NULL ,"value" VARCHAR(512) NOT NULL ,"key" VARCHAR(8) NOT NULL ,"key1" VARCHAR(8),"key2" VARCHAR(8),"key3" VARCHAR(8),"key4" VARCHAR(8),"key5" VARCHAR(64),"rank" INTEGER NOT NULL  DEFAULT 0',
									function(created) {
										// We set the autoVacuum pragma
										// this.setAutoVacuum(1);
										this.isReady = created;
										this.callback(this.isReady);
									}.bind(this));
				}
			}.bind(this);
			// Checking the for the existence of "data"
			this.tableExists("words", readyOrCreate);
		}.bind(this);
		// Setting the auto-vacuum pragma
		this.setAutoVacuum(1, setAutoVac);
	} else {
		// Couldn't open
		callback(false);
	}
}

/**
 * Sanitizes a name so that it can be stored in the DB.
 * 
 * @param {String}
 *            input the name that should be sanitized.
 */
Database.makeSaneName = function(input) {
	// We make sure that the dbName is sane
	var sane = input.replace(/[^\w]/g, "_");
	return sane;
}

Database.prototype.setAutoVacuum = function(val, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("setAutoVacuum");
	var sql = "PRAGMA auto_vacuum = " + val + ";";
	this.executeBooleanSQL(sql, callback);
}

Database.prototype.tableExists = function(name, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("tableExists");
	var exists = function(callback, SQLResultSet) {
		if (SQLResultSet == null) {
			// Mojo.Log.info("Table does not exist");
			callback(false);
		} else {
			// Mojo.Log.info("Table might exist");
			callback(SQLResultSet.rows.length > 0);
		}
	}.bind(this, callback);
	// Selecting from the master table
	this.select("sqlite_master", "name", "name", name, exists);
}

Database.prototype.select = function(table, retCol, matchCol, matchVal,
		callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("select");
	this.db.transaction(function(table, retCol, matchCol, matchVal, callback,
					tx) {
				if (typeof(matchCol) != "undefined" && matchCol != null) {
					var sql = "SELECT " + retCol + " FROM " + table + " WHERE "
							+ matchCol + " = ?;";
					var arr = [matchVal];
				} else {
					var sql = "SELECT " + retCol + " FROM " + table + ";";
					var arr = [];
				}
				// Mojo.Log.info("Query = " + sql);
				tx.executeSql(sql, arr, function(callback, tx, SQLResultSet) { // onSuccess
							if (SQLResultSet == null
									|| SQLResultSet.rows.length <= 0) {
								// Mojo.Log.info("Select returned nothing.");
								callback(null);
							} else {
								// Mojo.Log.info("Select returned something.");
								callback(SQLResultSet);
							}
						}.bind(this, callback), function(callback, tx, error) { // onFailure
							// Mojo.Log.info("Select failed");
							callback(null);
						}.bind(this, callback))
			}.bind(this, table, retCol, matchCol, matchVal, callback));
}

Database.prototype.readCandidates = function(keys, limit, offset, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("read");
	// We check if the db object's ready
	if (this.isReady == false) {
		callback(null);
		return;
	}
	var fetchVal = function(callback, sql) {
		// Mojo.Log.info("Select returned something." + sql);
		if (sql == null || sql.rows == null) {
			callback(null);
		};
		var ret = new Array();
		for (var i = 0; i < sql.rows.length; i += 1) {
			ret.push(sql.rows.item(i).value);
		}
		callback(ret);
	}.bind(this, callback);

	var table = "words";
	var retCol = "value";
	this.db.transaction(function(table, retCol, keys, limit, offset, fetchVal,
			tx) {
		var sql = "SELECT " + retCol + " FROM " + table + " WHERE ";
		var arr = [];
		for (var i = 0; i < keys.length; i++) {
			if (keys[i].length === 1
					&& (keys[i] === 'a' || keys[i] === 'e' || keys[i] === 'o')) {
				if (i === 0) {
					var matchCol = "key";
					sql += " ( " + matchCol + " >= ? and " + matchCol
							+ " < ? ) ";
					arr.push(keys[i]);
					arr.push(String.fromCharCode(keys[i].charCodeAt(0) + 1));
				} else {
					var matchCol = "key" + i;
					sql += " and ( " + matchCol + " >= ? and " + matchCol
							+ " < ? ) ";
					arr.push(keys[i]);
					arr.push(String.fromCharCode(keys[i].charCodeAt(0) + 1));
				}
			} else {
				if (keys[i].length === 1) {
					if (i === 0) {
						var matchCol = "key";
						sql += " ( " + matchCol + " > ? and " + matchCol
								+ " < ? ) ";
						arr.push(keys[i]);
						arr.push(String.fromCharCode(keys[i].charCodeAt(0) + 1));
					} else {
						var matchCol = "key" + i;
						sql += " and ( " + matchCol + " > ? and " + matchCol
								+ " < ? ) ";
						arr.push(keys[i]);
						arr.push(String.fromCharCode(keys[i].charCodeAt(0) + 1));
					}
				} else {
					var matchCol = (i === 0) ? "key " : " and key" + i;
					sql += matchCol + " = ?";
					arr.push(keys[i]);
				}
			}
		}
		sql += " limit " + limit + " offset " + offset + ";";
		tx.executeSql(sql, arr, function(fetchVal, tx, SQLResultSet) { // onSuccess
					if (SQLResultSet == null || SQLResultSet.rows.length <= 0) {
						// Mojo.Log.info("Select returned nothing.");
						fetchVal(null);
					} else {
						// Mojo.Log.info("Select returned something.");
						fetchVal(SQLResultSet);
					}
				}.bind(this, fetchVal), function(fetchVal, tx, error) { // onFailure
					// Mojo.Log.info("Select failed");
					fetchVal(null);
				}.bind(this, fetchVal))
	}.bind(this, table, retCol, keys, limit, offset, fetchVal));
}

/**
 * Reads a named variable from the DB and returns the associated string value.
 * 
 * @param {Object}
 *            name the name of the variable that's stored in the DB.
 * @param {Object}
 *            callback the function to call once the data is loaded.
 * @return an array containing the string value that is associated with the
 *         given name, or an empty array if the named variable does not exist or
 *         null if an error occured.
 */
Database.prototype.read = function(name, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("read");
	// We check if the db object's ready
	if (this.isReady == false) {
		callback(null);
		return;
	}
	var fetchVal = function(callback, sql) {
		if (sql == null || sql.rows == null) {
			callback(null);
		};
		var ret = new Array();
		for (var i = 0; i < sql.rows.length; i += 1) {
			ret.push(sql.rows.item(i).value);
		}
		callback(ret);
	}.bind(this, callback);
	this.select("words", "value", "key", name, fetchVal);
}

Database.prototype.write = function(name, value, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("write");
	// We check if the db object's ready
	if (this.isReady == false) {
		callback(null);
		return;
	}
	this.db.transaction(function(name, value, callback, tx) {
				var sql = "INSERT OR REPLACE INTO data (name,value) values (\'"
						+ name + "\', ?);";
				// Mojo.Log.info("Query = " + sql);
				tx.executeSql(sql, [value],
						function(callback, tx, SQLResultSet) { // onSuccess
							// Mojo.Log.info("Write success");
							callback(true);
						}.bind(this, callback), function(callback, tx, error) { // onFailure
							// Mojo.Log.info("Write failure");
							callback(false);
						}.bind(this, callback))
			}.bind(this, name, value, callback));
}

Database.prototype.remove = function(name, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("remove: " + name);
	var sql = "DELETE FROM data WHERE name == " + name + ";";
	this.executeBooleanSQL(sql, callback);
}

Database.prototype.createTable = function(name, scheme, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("createTable: " + name);
	var sql = "CREATE TABLE " + name + " (" + scheme + ");";
	this.executeBooleanSQL(sql, callback);
}

Database.prototype.flushTable = function(name, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("flushTable: " + name);
	var sql = "DELETE FROM TABLE " + name + ";";
	this.executeBooleanSQL(sql, callback);
}

Database.prototype.dropTable = function(name, callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("dropTable: " + name);
	var sql = "DROP TABLE " + name + ";";
	this.executeBooleanSQL(sql, callback);
}

Database.prototype.vacuum = function(callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("vacuum");
	var sql = "VACUUM;";
	this.executeBooleanSQL(sql, callback);
}

Database.prototype.purgeDB = function(callback) {
	if (!callback)
		callback = function() {
		};
	// Mojo.Log.info("purgeDB");
	// The function that deletes the dbs
	var deleter = function(callback, result) {
		// Mojo.Log.info("deleter");
		if (result == null || result.rows == null) {
			callback(false);
		};
		var vacWait = function(callback, curr, max, res) {
			// Mojo.Log.info("vacWait; success = " + res);
			if (curr < max)
				return;
			// We have dropped the last table!
			this.vacuum(callback);
		};
		var len = result.rows.length;
		for (var i = 0; i < len; i += 1) {
			var name = result.rows.item(i).name;
			this.dropTable(name, vacWait.bind(this, callback, i, len - 1))
		}
	}.bind(this, callback);
	// We get a list of all tables and drop them
	var sql = this.select("sqlite_master", "name", null, null, deleter);
}

Database.prototype.executeBooleanSQL = function(sql, callback) {
	// Mojo.Log.info("executeBooleanSQL");
	this.db.transaction(function(sql, callback, tx) {
		// Mojo.Log.info("Query = " + sql);
		tx.executeSql(sql, [], function(callback, tx, SQLResultSet) { // onSuccess
					callback(true);
				}.bind(this, callback), function(callback, tx, error) { // onFailure
					Mojo.Log.warn("SQL Error: Code " + error.code);
					Mojo.Log.warn("SQL Error: Message: " + error.message);
					callback(false);
				}.bind(this, callback));
			// Mojo.Log.info("Query sent");
		}.bind(this, sql, callback));
}
