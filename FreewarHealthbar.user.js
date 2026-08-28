// ==UserScript==
// @name        FreewarHealthbar
// @namespace   Zabuza
// @description Healthbar für Freewar
// @include     *.freewar.de/freewar/internal/item.php*
// @version     1
// ==/UserScript==

function doIt () {
	if(healthcritical) {
		curLife = healthcritical.innerHTML;
	} else if(healthmed) {
		curLife = healthmed.innerHTML;
	} else {
		curLife = healthok.innerHTML;
	}

	curLife = curLife.substring(3, curLife.length - 4);

	if(! document.getElementById("lifedisp")) {
		content = rawLife.innerHTML;
	} else {
		content = rawLife.innerHTML;
		var replacer = new RegExp("&quot;", "g");
		content = content.replace(replacer,"");
		content = content.substring(0, content.length - newContent.length);
	}

	maxLife = content.substring(content.indexOf("span>/") + 6, content.length - 1);

	if(curLife <= maxLife / 6) {
		status = 3;
	} else if(curLife <= maxLife / 2) {
		status = 2;
	} else {
		status = 1;
	}

	curWidth = Math.floor((curLife / maxLife) * width);

	if(! document.getElementById("lifedisp")) {
		newContent = '<div style="display: inline-block; margin: 0px 5px; position: relative; font-size: 9px; width: ' + width + 'px; height: 11px;" id="lifedisp" class="small">' +
					'<div style="position: absolute; top: 0px; left: 0px; width: ' + width + 'px; height: 11px; z-index: 2; border: 1px solid rgb(7, 100, 179); background: linear-gradient(to bottom, #eee, #bbb);" id="fulllifedisp">' +
					'</div>' +
					'<div style="position: absolute; top: 0px; left: 0px; width: ' + curWidth + 'px; height: 11px; z-index: 3; border: 1px solid rgb(7, 100, 179); background: ' + getHealthColor(status) + ';" id="curlife">' +
					'</div>' +
					'</div>';

		rawLife.innerHTML = content + newContent;
	} else {
		var curDiv = document.getElementById("curlife");
		curDiv.style.width = curWidth + "px";
		curDiv.style.background = getHealthColor(status);
	}

	window.setTimeout(doIt, 1000);
}


/* CSS color for each health status */
function getHealthColor(status) {
	if(status == 1) {
		return "linear-gradient(to bottom, #66dd66, #229922)";
	} else if(status == 2) {
		return "linear-gradient(to bottom, #ffcc55, #dd8800)";
	} else {
		return "linear-gradient(to bottom, #ff6666, #bb0000)";
	}
}


/* ======Begin====== */

// Vars
var width = 85;
var curWidth = 0;
var curLife = 0;
var maxLife = 0;
var status = 1;
var content = "";
var newContent = "";

var rawLife = document.getElementById("listrow_lifep");
var healthcritical = rawLife.getElementsByClassName("healthcritical")[0];
var healthmed = rawLife.getElementsByClassName("healthmed")[0];
var healthok = rawLife.getElementsByClassName("healthok")[0];

doIt();