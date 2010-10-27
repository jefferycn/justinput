package com.youjf;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.palm.luna.LSException;
import com.palm.luna.service.LunaServiceThread;
import com.palm.luna.service.ServiceMessage;

public class JustInputService extends LunaServiceThread {

	private String version = "1.4.1-4";
	private Connection db;
	private boolean cnMode = false;
	private boolean studyMode = true;
	private boolean backgroundMode = true;
	private int IME = 1;
	private boolean sync = false;
	private HashMap<String, Boolean> keys;

	public JustInputService() throws ClassNotFoundException, SQLException, JSONException {
		getAllConfig();
		db = connectDatabase(IME);
		if(IME == 1) {
			keys = getKeys();
		}
	}
	
	private Connection connectDatabase(int type) throws SQLException, ClassNotFoundException {
		Class.forName("org.sqlite.JDBC");
		Connection co;
		String dbPath = "/usr/palm/frameworks/mojo/justinput/db/";
		
		switch(type) {
			case 1:
				co = DriverManager.getConnection("jdbc:sqlite://" + dbPath + "py.db");
				break;
			case 2:
				co = DriverManager.getConnection("jdbc:sqlite://" + dbPath + "wb.db");
				break;
			case 3:
				co = DriverManager.getConnection("jdbc:sqlite://" + dbPath + "cj.db");
				break;
			case 4:
				co = DriverManager.getConnection("jdbc:sqlite://" + dbPath + "sc.db");
				break;
			case 5:
				co = DriverManager.getConnection("jdbc:sqlite://" + dbPath + "jp.db");
				break;
			default:
				co = DriverManager.getConnection("jdbc:sqlite://" + dbPath + "config.db");
		}
		if(type > 0) {
	        Statement st = co.createStatement();
			st.execute("PRAGMA cache_size=8000");
			st.execute("PRAGMA synchronous=OFF");
			st.execute("PRAGMA count_changes=OFF");
			//st.execute("PRAGMA temp_store=2");
			st.close();
		}
		return co;
	}

	@LunaServiceThread.PublicMethod
	public void get(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		String query = message.getJSONPayload().getString("query");
		int limit = message.getJSONPayload().getInt("limit");
		int offset = message.getJSONPayload().getInt("offset");
		JSONObject reply;
		if(IME == 3 || IME == 4) {
			reply = buildCjQuery(query, limit, offset);
		}else if(IME == 2) {
			reply = buildWbQuery(query, limit, offset);
		}else if(IME == 5) {
			reply = buildJpQuery(query, limit, offset);
		}else {
			reply = buildPyQuery(query, limit, offset);
		}
		reply.put("cnMode", cnMode);
		reply.put("type", IME);
		reply.put("studyMode", studyMode);
		message.respond(reply.toString());
	}


	@LunaServiceThread.PublicMethod
	public void put(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		JSONArray words = message.getJSONPayload().getJSONArray("words");
		long begin = System.currentTimeMillis();
		JSONObject reply = new JSONObject();
		if (words.length() < 10 && IME == 1) {
			String sql = "select key, start, value from words where rowid = ?";
			PreparedStatement stmt = db.prepareStatement(sql);
			ResultSet rs;
			String whole = "";
			String key = "";
			String start = "";
			for(int i = 0;i < words.length();i ++) {
				JSONObject word = words.getJSONObject(i);
				if(word.getInt("l") != word.getString("v").length()) {
					return ;
				}
				stmt.setInt(1, word.getInt("id"));
				rs = stmt.executeQuery();
				rs.next();
				String k = rs.getString("key");
				start += rs.getString("start");
				whole += rs.getString("value");
				key += k + " ";
				rs.close();
			}
			stmt.close();
			key = key.trim();
			sql = "select key from words where start = ? and value = ? and key = ?";
			stmt = db.prepareStatement(sql);
			stmt.setString(1, start);
			stmt.setString(2, whole);
			stmt.setString(3, key);
			rs = stmt.executeQuery();
			boolean exist = rs.next();
			rs.close();
			stmt.close();
			if(exist == false) {
				sql = "insert into words(value, key, rank, score, user_define, length, start) values (?, ?, 3, 0, 1, ?, ?);";
				stmt = db.prepareStatement(sql);
				stmt.setString(1, whole);
				stmt.setString(2, key);
				stmt.setInt(3, whole.length());
				stmt.setString(4, start);
				stmt.executeUpdate();
				stmt.close();
			}
		}else {
			reply.put("ime", IME);
		}
		long end = System.currentTimeMillis();
		reply.put("time", end - begin);
		message.respond(reply.toString());
	}
	
	@LunaServiceThread.PublicMethod
	public void update(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		long start = System.currentTimeMillis();
		int score = message.getJSONPayload().getInt("s");
		int rank = message.getJSONPayload().getInt("r");
		int rowid = message.getJSONPayload().getInt("id");
		String sql;
		PreparedStatement stmt;
		if (rank < 999) {
			if (score >= 2) {
				// update rank
				sql = "update words set rank = rank + 1, score = 0 where rowid = ?;";
				stmt = db.prepareStatement(sql);
				stmt.setInt(1, rowid);
				stmt.executeUpdate();
			} else {
				// update score
				sql = "update words set score = score + 1 where rowid = ?;";
				stmt = db.prepareStatement(sql);
				stmt.setInt(1, rowid);
				stmt.executeUpdate();
			}
			stmt.close();
		}
		JSONObject reply = new JSONObject();
		long end = System.currentTimeMillis();
		reply.put("time", end - start);
		message.respond(reply.toString());
	}

	@LunaServiceThread.PublicMethod
	public void delete(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		long start = System.currentTimeMillis();
		JSONObject reply = new JSONObject();
		if(IME == 1) {
			int rowid = message.getJSONPayload().getInt("id");
			String sql = "delete from words where rowid = ? and length > 1;";
			PreparedStatement stmt = db.prepareStatement(sql);
			stmt.setInt(1, rowid);
			stmt.executeUpdate();
			stmt.close();
		}else {
			reply.put("ime", IME);
		}
		long end = System.currentTimeMillis();
		reply.put("time", end - start);
		message.respond(reply.toString());
	}

	@LunaServiceThread.PublicMethod
	public void version(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		JSONObject reply = new JSONObject();
		message.respond(reply.put("version", version).toString());
	}
	@LunaServiceThread.PublicMethod
	public void ping(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		JSONObject reply = new JSONObject();
		reply.put("status", "true");
		message.respond(reply.toString());
	}
	
	@LunaServiceThread.PublicMethod
	public void status(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		JSONObject reply = new JSONObject();
		String dbPath = "/usr/palm/frameworks/mojo/justinput/db/";
		JSONArray choices = new JSONArray();
		File py = new File(dbPath + "py.db");
		if(py.exists() && py.length() > 1) {
			choices.put(1);
		}
		File wb = new File(dbPath + "wb.db");
		if(wb.exists() && wb.length() > 1) {
			choices.put(2);
		}
		File cj = new File(dbPath + "cj.db");
		if(cj.exists() && cj.length() > 1) {
			choices.put(3);
		}
		File sc = new File(dbPath + "sc.db");
		if(sc.exists() && sc.length() > 1) {
			choices.put(4);
		}
		File jp = new File(dbPath + "jp.db");
		if(jp.exists() && jp.length() > 1) {
			choices.put(5);
		}
		reply.put("ime", IME);
		reply.put("choices", choices);
		reply.put("studyMode", studyMode);
		reply.put("backgroundMode", backgroundMode);
		reply.put("cnMode", cnMode);
		reply.put("status", "true");
		reply.put("sync", sync);
		reply.put("dbMode", db.isReadOnly());
		message.respond(reply.toString());
	}

	@LunaServiceThread.PublicMethod
	public void toggleCnMode(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		if (cnMode) {
			setConfig("cnMode", "0");
		}else {
			setConfig("cnMode", "1");
		}
		JSONObject reply = new JSONObject();
		message.respond(reply.put("cnMode", cnMode).toString());
	}

	@LunaServiceThread.PublicMethod
	public void toggleSync(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		if (sync) {
			setConfig("sync", "0");
		}else {
			setConfig("sync", "1");
		}
		JSONObject reply = new JSONObject();
		message.respond(reply.put("sync", sync).toString());
	}

	@LunaServiceThread.PublicMethod
	public void toggleStudyMode(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		if (studyMode) {
			setConfig("studyMode", "0");
		}else {
			setConfig("studyMode", "1");
		}
		JSONObject reply = new JSONObject();
		message.respond(reply.put("studyMode", studyMode).toString());
	}

	@LunaServiceThread.PublicMethod
	public void toggleBackgroundModeMode(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		if (backgroundMode) {
			setConfig("backgroundMode", "0");
		}else {
			setConfig("backgroundMode", "1");
		}
		JSONObject reply = new JSONObject();
		message.respond(reply.put("backgroundMode", backgroundMode).toString());
	}

	@LunaServiceThread.PublicMethod
	public void toggle(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException, IOException {
		boolean database;
		if (db.isClosed()) {
			Runtime sh = Runtime.getRuntime();
			sh.exec("mount -o remount,rw /");
			db = connectDatabase(IME);
			database = true;
		}else {
			db.close();
			database = false;
		}
		JSONObject reply = new JSONObject();
		message.respond(reply.put("database", database).toString());
	}

	@LunaServiceThread.PublicMethod
	public void change(ServiceMessage message) throws JSONException, LSException, SQLException,
			ClassNotFoundException {
		int IME = message.getJSONPayload().getInt("ime");
		if(IME < 1) {
			IME = 1;
		}
		if(IME > 5) {
			IME = 1;
		}
		setConfig("IME", IME + "");
		db.close();
		db = connectDatabase(IME);
		if(IME == 1) {
			keys = getKeys();
		}
		JSONObject reply = new JSONObject();
		message.respond(reply.put("ime", IME).toString());
	}
	
	private void setConfig(String field, String value) throws SQLException, ClassNotFoundException {
		Connection conn = connectDatabase(0);
		String sql = "update config set value = '%s' where field = '%s'";
		sql = String.format(sql, value, field);
		Statement stmt = conn.createStatement();
		int ret = stmt.executeUpdate(sql);
		stmt.close();
		
		if(ret > 0) {
			if(field.equals("cnMode")) {
				if(Integer.parseInt(value) > 0) {
					this.cnMode = true;
				}else {
					this.cnMode = false;
				}
			}
			if(field.equals("studyMode")) {
				if(Integer.parseInt(value) > 0) {
					this.studyMode = true;
				}else {
					this.studyMode = false;
				}
			}
			if(field.equals("backgroundMode")) {
				if(Integer.parseInt(value) > 0) {
					this.backgroundMode = true;
				}else {
					this.backgroundMode = false;
				}
			}
			if(field.equals("IME")) {
				this.IME = Integer.parseInt(value);
			}
			if(field.equals("sync")) {
				if(Integer.parseInt(value) > 0) {
					this.sync = true;
				}else {
					this.sync = false;
				}
			}
		}
		conn.close();
	}

	private void getAllConfig() throws SQLException, ClassNotFoundException {
		Connection conn = connectDatabase(0);
		String sql = "select field, value from config";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(sql);
		while (rs.next()) {
			String field = rs.getString(1);
			if(field.equals("cnMode")) {
				this.cnMode = rs.getBoolean(2);
			}
			if(field.equals("studyMode")) {
				this.studyMode = rs.getBoolean(2);
			}
			if(field.equals("backgroundMode")) {
				this.backgroundMode = rs.getBoolean(2);
			}
			if(field.equals("IME")) {
				this.IME = rs.getInt(2);
			}
			if(field.equals("sync")) {
				this.sync = rs.getBoolean(2);
			}
		}
		rs.close();
		stmt.close();
		conn.close();
	}

	private JSONObject buildPyQuery(String query, int limit, int offset) throws JSONException,
			SQLException, ClassNotFoundException {
		long begin = System.currentTimeMillis();

		boolean isEnd;
		JSONArray sons = new JSONArray();
		JSONArray words = new JSONArray();
		
		if(query.startsWith("v") || query.startsWith("u") || query.startsWith("i")) {
			sons.put(query);
		}else {
			sons = splitQuery(query);
			sons = reserse(sons);

			String outer = "select id, value, score, rank, length, start from (%s) order by length desc, rank desc limit ? offset ?;";
			String inner = "select ROWID as id, value, score, rank, length, start from words where start = ? and length = ? and key like ?";
			String driver = "";

			int maxLength;
			if (sons.length() > 4) {
				maxLength = getMaxLength(sons.getString(0).substring(0, 1));
				if (maxLength > sons.length()) {
					maxLength = sons.length();
				}
			} else {
				maxLength = sons.length();
			}
			if (maxLength > 0) {
				JSONArray queryConditions = new JSONArray();
				for (int i = maxLength; i > 0; i--) {
					String search = "";
					String start = "";
					for (int j = 0; j < i; j++) {
						search += sons.getString(j) + " ";
						start += sons.getString(j).substring(0, 1);
					}
					search = search.trim();
					queryConditions.put(start);
					queryConditions.put(i);
					queryConditions.put(search);
					driver += inner;
					if (i > 1) {
						driver += " union all ";
					}
				}
				String sql = String.format(outer, driver);
				PreparedStatement pstmt = db.prepareStatement(sql);
				for (int i = 0; i < queryConditions.length(); i++) {
					if (i % 3 != 1) {
						pstmt.setString(i + 1, queryConditions.getString(i));
					} else {
						pstmt.setInt(i + 1, queryConditions.getInt(i));
					}
				}
				pstmt.setInt(queryConditions.length() + 1, limit + 1);
				pstmt.setInt(queryConditions.length() + 2, offset);
				ResultSet rs = pstmt.executeQuery();
				while (rs.next()) {
					JSONObject word = new JSONObject("{id:\"" + rs.getString("id") + "\",v:\""
							+ rs.getString("value") + "\",s:\"" + rs.getString("score") + "\",r:\""
							+ rs.getString("rank") + "\",l:\"" + rs.getString("length") + "\",t:\""
							+ rs.getString("start") + "\"}");
					words.put(word);
				}
				rs.close();
				pstmt.close();
			}
		}
		
		if(words.length() > limit) {
			isEnd = false;
		}else {
			isEnd = true;
		}
		
		if(words.length() == 0) {
			isEnd = true;
			if(query.substring(0, 1).equals("v")) {
				query = query.substring(1);
			}
			words.put(new JSONObject("{v:\"" + query + "\",l:\"0\"}"));
		}

		if(words.length() > 1) {
			JSONObject temp = words.getJSONObject(1);
			words.put(1, words.getJSONObject(0));
			words.put(0, temp);
		}
		
		JSONArray fixed = new JSONArray();
		for(int i = 0;i < sons.length();i ++) {
			String fix = sons.getString(i);
			if(fix.endsWith("%")) {
				fix = fix.substring(0, fix.indexOf("%"));
			}
			fixed.put(i, fix);
		}

		long end = System.currentTimeMillis();

		JSONObject reply = new JSONObject();
		reply.put("isEnd", isEnd);
		reply.put("fixed", fixed);
		reply.put("time", end - begin);
		reply.put("words", words);
		reply.put("cnMode", cnMode);
		reply.put("studyMode", studyMode);

		return reply;
	}

	private JSONObject buildWbQuery(String query, int limit, int offset) throws JSONException,
			SQLException, ClassNotFoundException {
		long begin = System.currentTimeMillis();

		boolean isEnd;
		JSONArray words = new JSONArray();

		String longer = "select ROWID as id, value, score, rank from words where key >= ? and key < ? order by rank desc limit ? offset ?";
		String shorter = "select ROWID as id, value, score, rank from words where key = ? order by rank desc limit ? offset ?";

		String sql;
		JSONArray queryConditions = new JSONArray();
		if(query.length() > 2) {
			sql = longer;
			queryConditions.put(query);
			queryConditions.put(query + "z");
		}else {
			sql = shorter;
			queryConditions.put(query);
		}
		PreparedStatement pstmt = db.prepareStatement(sql);
		for (int i = 0; i < queryConditions.length(); i++) {
			pstmt.setString(i + 1, queryConditions.getString(i));
		}
		pstmt.setInt(queryConditions.length() + 1, limit + 1);
		pstmt.setInt(queryConditions.length() + 2, offset);
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			JSONObject word = new JSONObject("{id:\"" + rs.getString("id") + "\",v:\""
					+ rs.getString("value") + "\",s:\"" + rs.getString("score") + "\",r:\""
					+ rs.getString("rank") + "\"}");
			words.put(word);
		}
		rs.close();
		pstmt.close();

		if(words.length() > limit) {
			isEnd = false;
		}else {
			isEnd = true;
		}

		if(words.length() == 0) {
			isEnd = true;
			words.put(new JSONObject("{v:\"" + query + "\",l:\"0\"}"));
		}

		if(words.length() > 1) {
			JSONObject temp = words.getJSONObject(1);
			words.put(1, words.getJSONObject(0));
			words.put(0, temp);
		}

		long end = System.currentTimeMillis();

		JSONObject reply = new JSONObject();
		reply.put("isEnd", isEnd);
		reply.put("time", end - begin);
		reply.put("words", words);
		reply.put("cnMode", cnMode);
		reply.put("studyMode", studyMode);

		return reply;
	}

	private JSONObject buildCjQuery(String query, int limit, int offset) throws JSONException,
			SQLException, ClassNotFoundException {
		long begin = System.currentTimeMillis();

		boolean isEnd;
		JSONArray words = new JSONArray();

		String longer = "select ROWID as id, value, score, rank from words where key >= ? and key < ? order by rank desc limit ? offset ?";
		String shorter = "select ROWID as id, value, score, rank from words where key = ? order by rank desc limit ? offset ?";

		String sql;
		JSONArray queryConditions = new JSONArray();
		if(query.length() < 5) {
			sql = longer;
			queryConditions.put(query);
			queryConditions.put(query + "z");
		}else {
			sql = shorter;
			queryConditions.put(query);
		}
		PreparedStatement pstmt = db.prepareStatement(sql);
		for (int i = 0; i < queryConditions.length(); i++) {
			pstmt.setString(i + 1, queryConditions.getString(i));
		}
		pstmt.setInt(queryConditions.length() + 1, limit + 1);
		pstmt.setInt(queryConditions.length() + 2, offset);
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			JSONObject word = new JSONObject("{id:\"" + rs.getString("id") + "\",v:\""
					+ rs.getString("value") + "\",s:\"" + rs.getString("score") + "\",r:\""
					+ rs.getString("rank") + "\"}");
			words.put(word);
		}
		rs.close();
		pstmt.close();

		if(words.length() > limit) {
			isEnd = false;
		}else {
			isEnd = true;
		}

		if(words.length() == 0) {
			isEnd = true;
			words.put(new JSONObject("{v:\"" + query + "\",l:\"0\"}"));
		}

		if(words.length() > 1) {
			JSONObject temp = words.getJSONObject(1);
			words.put(1, words.getJSONObject(0));
			words.put(0, temp);
		}

		long end = System.currentTimeMillis();

		JSONObject reply = new JSONObject();
		reply.put("isEnd", isEnd);
		reply.put("time", end - begin);
		reply.put("words", words);
		reply.put("cnMode", cnMode);
		reply.put("studyMode", studyMode);

		return reply;
	}
	
	private JSONObject buildJpQuery(String query, int limit, int offset) throws JSONException, SQLException,
	ClassNotFoundException {
		long start = System.currentTimeMillis();
		JSONArray words = new JSONArray();
		String fixedQuery = "";
		if(offset == 0) {
			limit --;
		}else {
			offset --;
		}
		int maxHiraLength = 4;
		String sql = "select key from hira where code = ?;";
		PreparedStatement pstmt = db.prepareStatement(sql);
		int searchLength;
		JSONArray searched = new JSONArray();
		String hira = "";
		do {
			if(maxHiraLength > query.length()) {
				searchLength = query.length();
			}else {
				searchLength = maxHiraLength;
			}
			String hiraKey = "";
			int searchedLength = searchLength;
			for(int i = searchLength;i > 0;i --) {
				pstmt.setString(1, query.substring(0, i));
				ResultSet rs = pstmt.executeQuery();
				while (rs.next()) {
					hiraKey = rs.getString("key");
					hira += hiraKey;
				}
				if(hiraKey.length() > 0) {
					searchedLength = i;
					break;
				}
				rs.close();
			}
			if(hiraKey.length() > 0) {
				// continue translate query to hira
				String tmp = query.substring(0, searchedLength);
				searched.put(tmp);
				fixedQuery += tmp;
				query = query.substring(searchedLength);
			}else {
				// no hira matched, searchedLength is the only candidate
				break;
			}
		}while (query.length() > 0);

		pstmt.close();

		boolean isEnd;
		if(hira.length() > 0) {
			if(offset == 0) {
				words.put(new JSONObject("{v:\"" + hira + "\",l:\"" + hira.length() + "\"}"));
			}

			int keyLength = hira.length();
			String container = "select value, rank, length(key) as key from (%s) order by rank desc limit ? offset ?;";
			String format = "select value, rank, key from words where %s";
			String keyFull = " ( key >= ? and key < ? and length(key) = ? ) ";
			JSONArray queryConditions = new JSONArray();
			String driver = "";
			for(int i = keyLength;i > 0;i --) {
				String keyString = hira.substring(0, i);
				String endKeyString = getJpNextPhaseKey(keyString);
				driver += String.format(format, keyFull);
				queryConditions.put(keyString);
				queryConditions.put(endKeyString);
				queryConditions.put(i);
				if(i > 1) {
					driver += " union all ";
				}
			}

			if(driver.length() > 0) {
				sql = String.format(container, driver);
				pstmt = db.prepareStatement(sql);
				for (int i = 0; i < queryConditions.length(); i++) {
					if(i % 3 != 2) {
						pstmt.setString(i + 1, queryConditions.getString(i));
					}else {
						pstmt.setInt(i + 1, queryConditions.getInt(i));
					}
				}
				pstmt.setInt(queryConditions.length() + 1, limit + 1);
				pstmt.setInt(queryConditions.length() + 2, offset);

				ResultSet rs = pstmt.executeQuery();
				while (rs.next()) {
					JSONObject word = new JSONObject("{v:\"" + rs.getString("value") + "\",l:\"" + rs.getString("key") + "\"}");
					words.put(word);
				}
				rs.close();
				pstmt.close();
			}

			if(words.length() > limit) {
				isEnd = false;
			}else {
				isEnd = true;
			}
		}else {
			isEnd = true;
			words.put(new JSONObject("{v:\"" + query + "\",l:\"0\"}"));
			searched.put(query);
		}

		if(words.length() > 1) {
			JSONObject temp = words.getJSONObject(1);
			words.put(1, words.getJSONObject(0));
			words.put(0, temp);
		}

		long end = System.currentTimeMillis();

		JSONObject reply = new JSONObject();
		reply.put("isEnd", isEnd);
		reply.put("searched", searched);
		reply.put("fixedQuery", fixedQuery);
		reply.put("ms", end - start);
		reply.put("cnMode", cnMode);
		reply.put("studyMode", studyMode);
		reply.put("words", words);

		return reply;
	}

	private JSONArray splitQuery(String in) throws JSONException {
		JSONArray found = new JSONArray();
		String rest = "";

		if(in.startsWith("qinai") || in.startsWith("xinai") || in.startsWith("yinai")) {
			in = in.substring(0, 3) + "'" + in.substring(3);
		}
		
		String[] parts = in.split("'");
		for(int i = parts.length - 1;i >= 0;i --) {
			in = parts[i];
			while(in.length() > 0) {
				if(in.length() > 6) {
					rest = in.substring(0, in.length() - 6);
					in = in.substring(in.length() - 6);
				}
				if(keys.containsKey(in)) {
					if(keys.get(in)) {
						found.put(in);
					}else {
						found.put(in + "%");
					}
					if(rest.length() > 0) {
						in = rest;
						rest = "";
					}else {
						break;
					}
				}else {
					if(in.length() == 1 && !(in.equals("i") || in.equals("u") || in.equals("v"))) {
						found.put(in + "%");
						in = rest;
						rest = "";
					}else {
						rest = rest + in.substring(0, 1);
						in = in.substring(1);
					}
				}
			}
			if(rest.length() > 0) {
				found.put(rest);
			}
		}
		return found;
	}
	
	private String getJpNextPhaseKey(String before) {
		String after = new String();
		after = before + '¤ò';
		return after;
	}
	
	private int getMaxLength(String start) throws SQLException {
		int length = 0;
		String sql = "select max(length) from words where start >= ? and start < ?;";
		PreparedStatement pstmt = db.prepareStatement(sql);
		pstmt.setString(1, start);
		pstmt.setString(2, start + "z");
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			length = rs.getInt(1);
		}
		rs.close();
		pstmt.close();
		
		return length;
	}

	private JSONArray reserse(JSONArray sons) throws JSONException {
		JSONArray newSons = new JSONArray();
		for(int i = 0;i < sons.length();i ++) {
			newSons.put(sons.length() - i - 1, sons.get(i));
		}
		return newSons;
	}
	
	private HashMap<String, Boolean> getKeys() throws JSONException, SQLException {
		// for py
		String sql = "select key, full from keys;";
		Statement st = db.createStatement();
		st.execute(sql);
		ResultSet rs = st.getResultSet();
		HashMap<String, Boolean> h = new HashMap<String, Boolean>(512);
		while(rs.next()) {
			String key = rs.getString("key");
			boolean full = rs.getBoolean("full");
			h.put(key, full);
		}
		st.close();
		rs.close();
		
		return h;
	}
}
