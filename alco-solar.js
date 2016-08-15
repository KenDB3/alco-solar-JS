// Javascript to grab solar data from hamqsl.com
// Based on the Python script alco-solar.py by Andrew Haworth

load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load(js.exec_dir + "ctrl-a_colors.js"); //predefined a whole bunch of Ctrl-A (Synchronet) Color Codes

console.clear();

//store the last update in a CFG file
var cfgFile = js.exec_dir + "solar.cfg";

if (file_exists(cfgFile)) {
	var current_solar_update = time();
	var solarcfgfile = new File(cfgFile);
	solarcfgfile.open("r");		// open file with read access
	solarcfginfo = solarcfgfile.readAll();
	var last_solar_update = solarcfginfo[0];
	solarcfgfile.close();
	if((time() - last_solar_update) > 60*60) { //1 Hour in between polls
		solarcfgfile.open("w");		// open file with write access
		solarcfgfile.writeln(current_solar_update);
		solarcfgfile.close();
	}
} else {
	var last_solar_update = time();
	var newcfgfile = js.exec_dir + "solar.cfg";
	var makenewcfgfile = new File(newcfgfile);
	//Does the new file open? 
	if(!makenewcfgfile.open("w")) {
		alert(format("Error %d opening %s\n", errno, newcfgfile));
		exit();
	}
	makenewcfgfile.writeln(last_solar_update);
	makenewcfgfile.close();
}

// Get the data from a local file if it has been less than 1 hour
// otherwise, grab the data fresh and store it

var xmlfile = js.exec_dir + "solardata.xml";

if(!file_exists(xmlfile) || ((time() - last_solar_update) > 60*60)) {
	try {
	  var solardata = new XML(
		(new HTTPRequest()).Get(
		  'http://www.hamqsl.com/solarxml.php'
		).replace(
		  /<\?[^?]*\?>/g, ''
		)
	  ).solardata;
	} catch (err) {
	  log('Shit done borked! ' + err);
	}
	var newxmlfile = new File(xmlfile);
	//Does the new file open? 
	if(!newxmlfile.open("w")) {
		alert(format("Error %d opening %s\n", errno, xmlfile));
		exit();
	}
	newxmlfile.write(solardata);
	newxmlfile.close();
} else {
	try {
	var localxmlfile = new File(xmlfile);
	localxmlfile.open("r");		// open file with read access
	var solardata = new XML(localxmlfile.read().replace(/<\?[^?]*\?>/g, ''));
	localxmlfile.close();
	} catch (err) {
	  log('Shit done borked! ' + err);
	}
}


// read solar datapoints from xml and load into variables

var timestamp = solardata.updated;

var sfi = solardata.solarflux;
if (sfi == undefined) {
	var sfi = 0;
}
	    
var sfi_int = parseInt(sfi);

var ai = solardata.aindex;
if (ai == undefined) {
	var ai = "No Data";
}

var ki = solardata.kindex;
if (ki == undefined) {
	var ki = "No Data";
}

var kint = solardata.kindexnt;
if (kint == undefined) {
	var kint = "No Data";
}

var xr = solardata.xray;
if (xr == undefined) {
	var xr = "No Data";
}

var spots = solardata.sunspots;
if (spots == undefined) {
	var spots = "No Data";
}
	    
var hl = solardata.heliumline;
if (hl == undefined) {
	var hl = "No Data";
}

var pf = solardata.protonflux;
if (pf == undefined) {
	var pf = "No Data";
}

var ef = solardata.electonflux;
if (ef == undefined) {
	var ef = "No Data";
}

var au = solardata.aurora;
if (au == undefined) {
	var au = "No Data";
}

var norm = solardata.normalization;
if (norm == undefined) {
	var norm = "No Data";
}

var lat = solardata.latdegree;
if (lat == undefined) {
	var lat = "No Data";
}

var sw = solardata.solarwind;
if (sw == undefined) {
	var sw = "No Data";
}
	
var mag = solardata.magneticfield;
if (mag == undefined) {
	var mag = "No Data";
}

var geomag = solardata.geomagfield;
if (geomag == undefined) {
	var geomag = "No Data";
}

var signoise = solardata.signalnoise;
if (signoise == undefined) {
	var signoise = "No Data";
}

var maxufreq = solardata.muf;
if (maxufreq == undefined) {
	var maxufreq = "No Data";
}


// HF conditions day / night
day1 = solardata.calculatedconditions.band[0];
day2 = solardata.calculatedconditions.band[1];
day3 = solardata.calculatedconditions.band[2];
day4 = solardata.calculatedconditions.band[3];
night1 = solardata.calculatedconditions.band[4];
night2 = solardata.calculatedconditions.band[5];
night3 = solardata.calculatedconditions.band[6];
night4 = solardata.calculatedconditions.band[7];


// lets colorize the band conditions
var poor = (darkred + "Poor" + gray);
var good = (darkgreen + "Good" + gray);
var fair = (darkyellow + "Fair" + gray);
        
if (day1 == "Poor") {
    day1 = poor;
} else if (day1 == "Good") {
    day1 = good;
} else {
    day1 = fair;
}
        	
if (day2 == "Poor") {
    day2 = poor;
} else if (day2 == "Good") {
    day2 = good;
} else {
    day2 = fair;
}

if (day3 == "Poor") {
    day3 = poor;
} else if (day3 == "Good") {
    day3 = good;
} else {
    day3 = fair;
}

if (day4 == "Poor") {
    day4 = poor;
} else if (day4 == "Good") {
    day4 = good;
} else {
    day4 = fair;
}
        	
if (night1 == "Poor") {
    night1 = poor;
} else if (night1 == "Good") {
    night1 = good;
} else {
    night1 = fair;
}
        	
if (night2 == "Poor") {
    night2 = poor;
} else if (night2 == "Good") {
    night2 = good;
} else {
    night2 = fair;
}

if (night3 == "Poor") {
    night3 = poor;
} else if (night3 == "Good") {
    night3 = good;
} else {
    night3 = fair;
}

if (night4 == "Poor") {
    night4 = poor;
} else if (night4 == "Good") {
    night4 = good;
} else {
    night4 = fair;
}


// VHF conditions
vhfaurora = solardata.calculatedvhfconditions.phenomenon[0];
eu_e_skip = solardata.calculatedvhfconditions.phenomenon[1];
na_e_skip = solardata.calculatedvhfconditions.phenomenon[2];
eu_6m = solardata.calculatedvhfconditions.phenomenon[3];
eu_4m = solardata.calculatedvhfconditions.phenomenon[4];
band_closed = (darkred + "Band Closed" + gray);


// print proper template file to terminal depending on value of sfi_int
if (sfi_int >= 150) {
	console.printfile(js.exec_dir + "sun-hi.asc");
} else if (sfi_int <= 149 && sfi_int >= 120) {
	console.printfile(js.exec_dir + "sun-med.asc");
} else if (sfi_int <= 119 && sfi_int >= 80) {
	console.printfile(js.exec_dir + "sun-low.asc");
} else {
	console.printfile(js.exec_dir + "sun-dead.asc");
}


// time stamp
console.gotoxy(51,2);
console.putmsg(bluebackground + grey + timestamp.trim() + blackbackground + black);


// solar data, column 1
console.gotoxy(28,4);
console.putmsg(gray + sfi.trim());
console.gotoxy(28,5);
console.putmsg(gray + ai.trim());
console.gotoxy(28,6);
console.putmsg(gray + ki.trim());
console.gotoxy(28,7);
console.putmsg(gray + xr.trim());
console.gotoxy(28,8);
console.putmsg(gray + spots.trim());
console.gotoxy(28,9);
console.putmsg(gray + hl.trim() + " @ SEM");
console.gotoxy(28,10);
console.putmsg(gray + pf.trim());


// solar data, column 2
console.gotoxy(66,4);
console.putmsg(gray + ef.trim());
console.gotoxy(66,5);
console.putmsg(gray + au.trim() + "/n=" + norm.trim());
console.gotoxy(66,6);
console.putmsg(gray + mag.trim());
console.gotoxy(66,7);
console.putmsg(gray + sw.trim());
console.gotoxy(66,8);
console.putmsg(gray + geomag.trim());
console.gotoxy(66,9);
console.putmsg(gray + signoise.trim());
console.gotoxy(66,10);
console.putmsg(gray + maxufreq.trim());


// hf 'day' column
console.gotoxy(16,16);
console.putmsg(day1);
console.gotoxy(16,17);
console.putmsg(day2);
console.gotoxy(16,18);
console.putmsg(day3);
console.gotoxy(16,19);
console.putmsg(day4);


// hf 'night' column
console.gotoxy(24,16);
console.putmsg(night1);
console.gotoxy(24,17);
console.putmsg(night2);
console.gotoxy(24,18);
console.putmsg(night3);
console.gotoxy(24,19);
console.putmsg(night4);


// VHF conditions
console.gotoxy(47,14);
console.putmsg(gray + lat.trim());
console.gotoxy(47,15);
if (vhfaurora.trim() == "Band Closed") {console.putmsg(band_closed);} else {console.putmsg(vhfaurora);}
console.gotoxy(47,16);
if (eu_6m.trim() == "Band Closed") {console.putmsg(band_closed);} else {console.putmsg(eu_6m);}
console.gotoxy(47,17);
if (eu_4m.trim() == "Band Closed") {console.putmsg(band_closed);} else {console.putmsg(eu_4m);}
console.gotoxy(47,18);
if (eu_e_skip.trim() == "Band Closed") {console.putmsg(band_closed);} else {console.putmsg(eu_e_skip);}
console.gotoxy(47,19);
if (na_e_skip.trim() == "Band Closed") {console.putmsg(band_closed);} else {console.putmsg(na_e_skip);}
console.gotoxy(0,22);


// pause, clear screen after pause, and then close out the program
console.pause();
console.clear();
console.aborted = false;
exit();

// alco-solar.py by Andrew Haworth, KK4DSD.
// alco-solar.js rewritten into javascript by KenDB3, bbs.kd3.us
