function onSubmit(event) {
    event.preventDefault();
    
    clearResult();
    
    var inputXp = document.getElementById("xp").value;
    var inputLevel = document.getElementById("level").value;
    
    if (isNaN(inputXp)) {
        alert("\"" + inputXp + "\" is not a valid number");
        return;
    }
    
    if (isNaN(inputLevel)) {
        alert("\"" + inputLevel + "\" is not a valid number");
        return;
    }
    
    var currentLevel = xpToLevel(parseInt(inputXp));
    var currentXp = 0;
    
    if (currentLevel < 0) {
        currentLevel = parseInt(inputLevel);
        
        if (currentLevel >= 0) {
            currentXp = levelToXp(currentLevel);
            document.getElementById("xp").value = currentXp;
        }
        
    } else {
        currentXp = parseInt(inputXp);
        document.getElementById("level").value = currentLevel;
    }
    
    if (currentLevel < 0) {
        return;
    } else if (currentLevel < 25) {
        alert("You need a minimum of level 25 to gain any experience (7842 xp)");
        return;
    }
    
    var table = document.getElementById("result-table");
    
    insertRows(0, currentLevel, currentXp);
    insertDivider();
    insertRows(1, currentLevel, currentXp);    
}

function clearResult() {
    var table = document.getElementById("result-table");
    
    var len = table.rows.length;
    
    for (var i = 0; i < len; i++) {
        table.deleteRow(0);
    }
}

function insertDivider() {
    var table = document.getElementById("result-table");
    table.insertRow().style.cssText = "height: 20px !important"; 
}

function insertRows(type, currentLevel, currentXp) {
    var table = document.getElementById("result-table");

    if (type == 0) {
        var titleRow = table.insertRow();
        
        for (var i = currentLevel; i < 127; i++) {
            var titleCell  = titleRow.insertCell();
            
            if (i == currentLevel) {
                titleCell.innerHTML = "<b>Level</b>";
            } else {
                titleCell.innerHTML = "<b>" + i + "</b>";
            }
        }
        
        return;
    }
            
    var row1   = table.insertRow();
    var row10  = table.insertRow();
    var row100 = table.insertRow();
        
    row1.insertCell().innerHTML = "<b>1 point at a time</b>";
    row10.insertCell().innerHTML = "<b>10 points at a time</b>";
    row100.insertCell().innerHTML = "<b>100 points at a time</b>";
    
    insertCells(row1, currentXp, 1, 1);
    insertCells(row10, currentXp, 10, 1.01);
    insertCells(row100, currentXp, 100, 1.1);
}

function insertCells(row, currentXp, pointsTraded, multiplier) {
    
    var level = xpToLevel(currentXp);
    var xp = currentXp;
    var counter = 0;
    
    while (level < 126) {
        var xppt = Math.floor(baseXpPerPoint(xpToLevel(xp)) * pointsTraded * multiplier);
        var xpToNextLevel = levelToXp(level + 1) - xp;
        var trades = Math.ceil(xpToNextLevel / xppt);
        xp += xppt * trades;
                
        var newLevel = xpToLevel(xp);
        counter += trades * pointsTraded;
        //console.log(xp + "   " + newLevel + "   " + level + "   " + counter);
        for (var i = level; i < newLevel && i < 126; i++) {
            row.insertCell().innerHTML = counter;
        }
        
        level = newLevel;
    }
}

function xpToLevel(xp) {
    var level = 2;
    while (level < 150) {
        if (levelToXp(level) > xp) {
            return level - 1;
        }
        level++;
    }
    return -1;
}

function levelToXp(level) {
    
    var sum = 0;
    for (var i = 1; i < level; i++) {
        sum += Math.floor(i + 300 * Math.pow(2, i / 7));
    }
    
    return Math.floor(sum / 4);
}

function baseXpPerPoint(level) {
    return 18 * Math.floor(level*level / 600);
}