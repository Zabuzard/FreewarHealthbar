// ==UserScript==
// @name        FreewarHealthbar
// @namespace   Zabuza
// @description Healthbar für Freewar
// @include     *.freewar.de/freewar/internal/item.php*
// @version     2
// ==/UserScript==

function doIt() {
  if (healthcritical) {
    curLife = healthcritical.innerText;
  } else if (healthmed) {
    curLife = healthmed.innerText;
  } else {
    curLife = healthok.innerText;
  }

  curLife = parseInt(curLife.replace(/\./g, ""), 10);

  if (!document.getElementById("lifedisp")) {
    content = rawLife.innerHTML;
  } else {
    content = rawLife.innerHTML;

    var replacer = new RegExp("&quot;", "g");
    content = content.replace(replacer, "");
    content = content.substring(0, content.length - newContent.length);
  }

  maxLife = parseInt(
    document
      .getElementById("itemlpdisp")
      .innerText.split("/")[1]
      .replace(/\./g, ""),
    10,
  );

  /* ===== Health status ===== */

  if (curLife < maxLife * 0.3) {
    status = 3; // Critical
  } else if (curLife < maxLife * 0.5) {
    status = 2; // Warning
  } else {
    status = 1; // Good
  }

  curWidth = Math.floor((curLife / maxLife) * width);

  /* Prevent tiny/negative values */
  curWidth = Math.max(0, Math.min(width, curWidth));

  var percentage = Math.floor((curLife / maxLife) * 100);

  /* ===== Create healthbar ===== */

  if (!document.getElementById("lifedisp")) {
    newContent =
      '<div id="lifedisp" class="small healthbar-' +
      getHealthStatusClass(status) +
      '" ' +
      'style="' +
      "display:inline-block;" +
      "margin:0px 5px;" +
      "position:relative;" +
      "font-size:10px;" +
      "width:" +
      width +
      "px;" +
      "height:14px;" +
      "vertical-align:middle;" +
      '">' +
      /* ===== Background / Unfilled HP ===== */

      '<div id="fulllifedisp" class="health-background health-background-' +
      getHealthBackgroundClass(status) +
      '" style="' +
      "position:absolute;" +
      "top:0px;" +
      "left:0px;" +
      "width:" +
      width +
      "px;" +
      "height:14px;" +
      "box-sizing:border-box;" +
      "z-index:2;" +
      "border:1px solid rgb(7,100,179);" +
      '">' +
      "</div>" +
      /* ===== Current HP ===== */

      '<div id="curlife" class="health-' +
      getHealthStatusClass(status) +
      '" style="' +
      "position:absolute;" +
      "top:0px;" +
      "left:0px;" +
      "width:" +
      curWidth +
      "px;" +
      "height:14px;" +
      "box-sizing:border-box;" +
      "z-index:3;" +
      "border:1px solid rgb(7,100,179);" +
      "background:" +
      getHealthColor(status) +
      ";" +
      "transition:width 0.4s ease, background 0.3s ease;" +
      '">' +
      /* ===== HP Text ===== */

      '<span id="lifepercent" style="' +
      "position:absolute;" +
      "left:50%;" +
      "top:0px;" +
      "transform:translateX(-50%);" +
      "line-height:12px;" +
      "color:#d8d8d8;" +
      "font-weight:bold;" +
      "font-size:11px;" +
      "white-space:nowrap;" +
      "text-shadow:0px 1px 2px black;" +
      '">' +
      percentage +
      "%" +
      "</span>" +
      "</div>" +
      "</div>";

    rawLife.innerHTML = content + newContent;
  } else {
    var healthbarDiv = document.getElementById("lifedisp");
    var curDiv = document.getElementById("curlife");
    var percentDiv = document.getElementById("lifepercent");
    var backgroundDiv = document.getElementById("fulllifedisp");

    /* ===== Update current HP ===== */

    curDiv.style.width = curWidth + "px";
    curDiv.style.background = getHealthColor(status);

    /* ===== Update percentage ===== */

    percentDiv.innerText = percentage + "%";

    /* ===== Update unfilled background ===== */

    backgroundDiv.className =
      "health-background health-background-" + getHealthBackgroundClass(status);

    /* ===== Update filled HP animation ===== */

    curDiv.className = "health-" + getHealthStatusClass(status);

    /* ===== Update entire healthbar glow ===== */

    healthbarDiv.className = "small healthbar-" + getHealthStatusClass(status);
  }

  window.setTimeout(doIt, 1000);
}

/* =========================================================
   Health colors
   ========================================================= */

function getHealthColor(status) {
  if (status == 1) {
    return "linear-gradient(to bottom, #4caf50, #1b6e2a)";
  } else if (status == 2) {
    return "linear-gradient(to bottom, #e0a52b, #8a5a00)";
  } else {
    return "linear-gradient(to bottom, #e05252, #8f2020)";
  }
}

/* =========================================================
   Health status class
   ========================================================= */

function getHealthStatusClass(status) {
  if (status == 1) {
    return "good";
  } else if (status == 2) {
    return "warning";
  } else {
    return "critical";
  }
}

/* =========================================================
   Unfilled background class
   ========================================================= */

function getHealthBackgroundClass(status) {
  if (status == 1) {
    return "good";
  } else if (status == 2) {
    return "warning";
  } else {
    return "critical";
  }
}

/* =========================================================
   Animation CSS
   ========================================================= */

var style = document.createElement("style");

style.innerHTML = `

    /* =====================================================
       Entire Healthbar Glow
       ===================================================== */

    /* Normal */
    .healthbar-good {
        box-shadow: none;
    }


    /* Warning: entire healthbar gets an orange glow */
    .healthbar-warning {
        animation: healthbarWarning 1.5s ease-in-out infinite;
    }

    @keyframes healthbarWarning {
        0%, 100% {
            box-shadow:
                0 0 2px rgba(224, 165, 43, 0.3),
                0 0 4px rgba(224, 165, 43, 0.2);
        }

        50% {
            box-shadow:
                0 0 5px rgba(224, 165, 43, 0.9),
                0 0 10px rgba(224, 165, 43, 0.6);
        }
    }


    /* Critical: entire healthbar gets a strong red glow */
    .healthbar-critical {
        animation: healthbarCritical 0.7s ease-in-out infinite;
    }

    @keyframes healthbarCritical {
        0%, 100% {
            box-shadow:
                0 0 3px rgba(255, 0, 0, 0.5),
                0 0 7px rgba(255, 0, 0, 0.4);
        }

        50% {
            box-shadow:
                0 0 7px rgba(255, 0, 0, 1),
                0 0 15px rgba(255, 0, 0, 0.8);
        }
    }


    /* =====================================================
       Filled HP
       ===================================================== */

    /* Normal HP */
    .health-good {
        box-shadow: none;
    }


    /* Warning: subtle orange glow */
    .health-warning {
        animation: healthWarning 1.5s ease-in-out infinite;
    }

    @keyframes healthWarning {
        0%, 100% {
            box-shadow:
                0 0 0px rgba(224, 165, 43, 0);
        }

        50% {
            box-shadow:
                0 0 5px rgba(224, 165, 43, 0.8);
        }
    }


    /* Critical: strong red pulse */
    .health-critical {
        animation: healthCritical 0.7s ease-in-out infinite;
    }

    @keyframes healthCritical {
        0%, 100% {
            box-shadow:
                0 0 2px rgba(255, 0, 0, 0.5),
                0 0 5px rgba(255, 0, 0, 0.4);
        }

        50% {
            box-shadow:
                0 0 6px rgba(255, 0, 0, 1),
                0 0 12px rgba(255, 0, 0, 0.8);
        }
    }


    /* =====================================================
       Unfilled HP Background
       ===================================================== */

    /* Normal / Good */
    .health-background-good {
        background: linear-gradient(
            to bottom,
            #252525,
            #111111
        );
    }


    /* Warning */
    .health-background-warning {
        background: repeating-linear-gradient(
            -75deg,
            #323232 0px,
            #323232 4px,
            #e0a52b 4px,
            #e0a52b 8px
        );

        box-shadow:
            0 0 3px rgba(224, 165, 43, 0.5);

        animation:
            healthBackgroundWarning 1.5s ease-in-out infinite;
    }

    @keyframes healthBackgroundWarning {
        0%, 100% {
            opacity: 0.85;
        }

        50% {
            opacity: 1;
        }
    }


    /* Critical */
    .health-background-critical {
        background: repeating-linear-gradient(
            -75deg,
            #323232 0px,
            #323232 4px,
            #e05252 4px,
            #e05252 8px
        );

        background-size: 16px 16px;

        box-shadow:
            0 0 4px rgba(255, 0, 0, 0.7),
            0 0 8px rgba(255, 0, 0, 0.4);

        animation:
            healthBackgroundCritical 0.5s linear infinite;
    }

    @keyframes healthBackgroundCritical {
        from {
            background-position: 0px 0px;
        }

        to {
            background-position: 16px 0px;
        }
    }

`;

/* Add CSS to page */
document.head.appendChild(style);

/* =========================================================
   Variables
   ========================================================= */

var width = 80;
var curWidth = 0;
var curLife = 0;
var maxLife = 0;
var status = 1;
var content = "";
var newContent = "";

/* =========================================================
   Find original Freewar HP elements
   ========================================================= */

var rawLife = document.getElementById("listrow_lifep");
var healthcritical = rawLife.getElementsByClassName("healthcritical")[0];
var healthmed = rawLife.getElementsByClassName("healthmed")[0];
var healthok = rawLife.getElementsByClassName("healthok")[0];

/* =========================================================
   Start
   ========================================================= */

doIt();
