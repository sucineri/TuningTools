const Promise = require('bluebird');
const GrilleXlsx = require('grille-xlsx');
const Downloader = require('grille-downloader');
const fs = require('fs');
const writeFile = Promise.promisify(fs.writeFile);
const unlinkFile = Promise.promisify(fs.unlink);
const msgpack = require("msgpack-lite");
const path = require('path');
const settings = require('./settings.json');

const xlsxPath = path.resolve(__dirname, settings.xlsxFilename);
const clientSecretPath = path.resolve(__dirname, "./client_secret.json");
const msgPath = path.resolve(__dirname, settings.msgFilename);

Downloader.download(settings.sheetKey, xlsxPath, clientSecretPath)
	.then(() => {
	 	var grilleXlsx = new GrilleXlsx(xlsxPath, 'meta'); 
	 	return grilleXlsx.toJson();
	})
	.then((json) => {
		console.log(JSON.stringify(json));
		var ws = fs.createWriteStream(msgPath);
		var encodeStream = msgpack.createEncodeStream();
		encodeStream.pipe(ws);
		encodeStream.write(json);
		encodeStream.end();
		return unlinkFile(xlsxPath);
	})
	.then(() => {
		console.log("Tuning created!");
	});
