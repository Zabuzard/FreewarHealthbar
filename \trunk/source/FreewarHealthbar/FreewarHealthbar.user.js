// ==UserScript==
// @name        FreewarHealthbar
// @namespace   Zabuza
// @description Healthbar für Freewar
// @include     *.freewar.de/freewar/internal/item.php*
// @version     1
// ==/UserScript==

function doIt () {
	if(healthcritical) {															//get raw life
		curLife = healthcritical.innerHTML;
	} else if(healthmed) {
		curLife = healthmed.innerHTML;
	} else {
		curLife = healthok.innerHTML;
	}
	curLife = curLife.substring(3, curLife.length - 4);								//extract actual life
	if(! document.getElementById("lifedisp")) {										//healthbar already displayed?
		content = rawLife.innerHTML;												//p-tag which contains lifepoints
	} else {
		content = rawLife.innerHTML;												//p-tag which contains lifepoints
		var replacer = new RegExp("&quot;", "g");									//global RegExp for removing quots which where added by browser
		content = content.replace(replacer,"");										//remove them
		content = content.substring(0, content.length - newContent.length);			//cut new content off, now equals to if-branch
	}
	maxLife = content.substring(content.indexOf("span>/") + 6, content.length - 1);	// extract maximum life
	if(curLife <= maxLife / 6) {													// 16% = critical
		status = 3;                     											//critical health status
	} else if(curLife <= maxLife / 2) {												// 50% = medium
		status = 2;																	//medium health status
	} else {
		status = 1;																	//ok health status
	}
	curWidth = Math.floor((curLife / maxLife) * width);								//convert curLife from LP to px
	if(! document.getElementById("lifedisp")) {										//healthbar already displayed?
		newContent = '<div style="display: inline-block; margin: 0px 5px; position: relative; font-size: 9px; width: ' + width + 'px; height: 11px;" id="lifedisp" class="small">' +
					'<div style="position: absolute; font-size: 9px; top: 0px; left: 0px; width: ' + width + 'px; height: 11px; z-index: 2; border: 1px solid rgb(7, 100, 179); background-image: url(' + pics[0] + ');" id="fulllifedisp">' +
					'</div>' +
					'<div style="position: absolute; font-size: 9px; top: 0px; left: 0px; width: ' + curWidth + 'px; height: 11px; z-index: 3; border: 1px solid rgb(7, 100, 179); background-image: url(' + pics[status] + ');" id="curlife">' +
					'</div>' +
					'</div>';
		rawLife.innerHTML = content + newContent;									//add healthbar
	} else {
		var curDiv = document.getElementById("curlife");
		curDiv.style.width = curWidth;												//update width of health
		curDiv.style.backgroundImage = "url(" + pics[status] + ")";					//update picture for health status
	}
	window.setTimeout(doIt, 1000);													//loop every second
}

																					/* ======Begin====== */

																					//Vars
var width = 85;																		//width of bar in px
var pics = new Array("http://file1.npage.de/005000/36/bilder/phaseleer2.jpg",		//background of bar
					"http://file1.npage.de/005000/36/bilder/green_bg.jpg",			//health ok background
					"http://file1.npage.de/005000/36/bilder/orange_bg.jpg",			//health medium background
					"http://file1.npage.de/005000/36/bilder/red_bg.jpg"); 			//health critical background
var curWidth = 0;																	//actual width of health in px
var curLife = 0;																	//actual health in LP
var maxLife = 0;																	//maximal health
var status = 1;																		//health ok, med or critical
var content = "";																	//content of p-tag which contains lifepoints
var newContent = "";																//content of healthbar
var rawLife = document.getElementById("listrow_lifep");
var healthcritical = rawLife.getElementsByClassName("healthcritical")[0];			//ressource of critical health
var healthmed = rawLife.getElementsByClassName("healthmed")[0];						//ressource of medium health
var healthok = rawLife.getElementsByClassName("healthok")[0];						//ressource of ok health

doIt();																				//begin func