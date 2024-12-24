/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

console.log("Script.js loaded successfully!");
  
  // Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');
  
    const response = await fetch('/demotable', {
        method: 'GET'
    });
  
    const responseData = await response.json();
    const demotableContent = responseData.data;
  
    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }
  
    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

  
  // This function resets or initializes the demotable.
async function initTables() {
    const response = await fetch("/initiate-tables", {
        method: 'POST'
    });
    const responseData = await response.json();
  
    if (responseData.success) {
        console.log("Initiated successfully");
    } else {
        alert("Error initiating table!");
    }

    const insert = await fetch("/insert-default-vals", {
        method: 'POST'
    });
    const insertData = await insert.json();
}
  

// updateContentDiv
function updateContentDiv(content, type = 'info', isHTML = false) {
    const contentDiv = document.getElementById('contentDiv');
    
    // Set class based on the type
    contentDiv.className = `content-div ${type}`;
    
    // Update the content of the div
    if (isHTML) {
        contentDiv.innerHTML = content; // Interpret content as HTML
    } else {
        contentDiv.textContent = content; // Interpret content as plain text
    }
    
    // Ensure the div is visible
    contentDiv.style.display = 'block';

    // Automatically scroll to the top of the contentDiv
    contentDiv.scrollTop = 0;
}



// completed: POST action
async function insertCharCard(event) {
    event.preventDefault();

    const cid = document.getElementById('cid').value;
    const price = document.getElementById('price').value;
    const cName = document.getElementById('cName').value;
    const pid = document.getElementById('pid').value;

    const response = await fetch('/insert-character-card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cid: cid,
            price: price,
            cName: cName,
            pid: pid
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        updateContentDiv(`Successfully entered character card ${cName} with id ${cid} and price ${price}, attributed to player with pid ${pid}.`, 'success')
    } else {
        updateContentDiv(responseData.message, 'error')
    }
}


async function updateCharacter(event) {
    event.preventDefault();

    const cName = document.getElementById('cNameUpdate').value;
    const speed = document.getElementById('speed').value;
    const agility = document.getElementById('agility').value;

    const response = await fetch('/update-character', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cName: cName,
            newSpeed: speed,
            newAgility: agility
        })
    })

    const responseData = await response.json();

    if (responseData.success) {
        updateContentDiv(`Successfully updated ${cName}'s speed to ${speed}, and agility to ${agility}.`, 'success');
    } else {
        updateContentDiv(responseData.message, 'error');
    }
}

async function updateTalent(event) {
    event.preventDefault();

    const taid = document.getElementById('taid').value;
    const dread = document.getElementById('dread').value;
    const vigilance = document.getElementById('vigilance').value;
    const deceit = document.getElementById('deceit').value;
    const strength = document.getElementById('strength').value;
    const pid = document.getElementById('hunter-talent-pid').value;

    if (parseInt(dread) + parseInt(vigilance) + parseInt(deceit) + parseInt(strength) > 120) {
        updateContentDiv(`Your sum of the four talent points should not exceed 120. Your current total points is ${parseInt(dread) + parseInt(vigilance) + parseInt(deceit) + parseInt(strength)}`, 'error');
    }
    const response = await fetch('/update-talent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            taid: taid,
            dr: dread,
            v: vigilance,
            de: deceit,
            s: strength,
            pid: pid
        })
    })

    const responseData = await response.json();

    if (responseData.success) {
        updateContentDiv(`Successfully updated Talent with ID ${taid}, attributed to Player with ID ${pid}`, 'success');
    } else {
        updateContentDiv(responseData.message, 'error');
    }
}

async function deletePlayer(event) {
    event.preventDefault();

    const pid = document.getElementById("pidDelete").value;

    const response = await fetch('/delete-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pid: pid
        })
    })

    const responseData = await response.json();

    if (responseData.success) {
        updateContentDiv(`Successfully deleted Player with ID: ${pid}`, 'success')
    } else {
        updateContentDiv("ERROR: Did not complete the deletion, please recheck your Player ID", 'error')
    }
}

async function selectPlayer(event) {
    event.preventDefault();

    const pid = document.getElementById("pidSelect").value;

    const response = await fetch(`/select-player?pid=${encodeURIComponent(pid)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const responseData = await response.json();

    if (responseData.success) {
        const playerData = responseData.data;

        const infoHTML = `
            <h3>Player Information</h3>
            <ul>
                <li><strong>Player ID:</strong> ${playerData[0].pid}</li>
                <li><strong>Player Name:</strong> ${playerData[0].pName}</li>
                <li><strong>Hunter Rank:</strong> ${playerData[0].hunterRank}</li>
                <li><strong>Survivor Rank:</strong> ${playerData[0].survRank}</li>
            </ul>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Player with given ID does not exist", 'error');
    }
}

// todo: GET action
async function showCharSpeed() {
    const response = await fetch("/proj-speed", {
        method: 'GET'
    });

    if (response.status == 404) {
      updateContentDiv("No speed data found", 'error');
      return;
    }

    if (!response.ok) {
      updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
  
    const responseData = await response.json();
  
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>Character Speed Table</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Character Name</th>
                        <th>Speed</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].cName}</td>
                    <td> ${playerData[i].speed}</td>
                </tr>
            `;
        }
        
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showCharAgility() {
    const response = await fetch("/proj-agility", { 
        method: 'GET' 
    });

    if (response.status == 404) {
        updateContentDiv("No agility data found", 'error');
        return;
    }

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>Character Agility Table</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Character Name</th>
                        <th>Agility</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].cName}</td>
                    <td> ${playerData[i].agility}</td>
                </tr>
            `;
        }
        
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showTeamPlayer() {

    const teid = document.getElementById('idGroup').value;

    const response = await fetch(`/join-team?teid=${encodeURIComponent(teid)}`, { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>Team Player Match</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Player ID</th>
                        <th>Player Name</th>
                        <th>Team ID</th>
                        <th>Team Name</th>
                        <th>Team Rank</th>
                        <th>Team Member Number</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].pid}</td>
                    <td> ${playerData[i].pName}</td>
                    <td> ${playerData[i].teid}</td>
                    <td> ${playerData[i].tName}</td>
                    <td> ${playerData[i].teamRank}</td>
                    <td> ${playerData[i].tMemberNum}</td>
                </tr>
            `;
        }
        
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showGuildPlayer() {

    const gid = document.getElementById('idGroup').value;

    const response = await fetch(`/join-guild?gid=${encodeURIComponent(gid)}`, { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>Guild Player Match</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Player ID</th>
                        <th>Player Name</th>
                        <th>Guild ID</th>
                        <th>Guild Name</th>
                        <th>Guild Level</th>
                        <th>Guild Member Number</th>
                        <th>Guild Points</th>
                    </tr>
                </thead>
                <tbody>
        `;
        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].pid}</td>
                    <td> ${playerData[i].pName}</td>
                    <td> ${playerData[i].gid}</td>
                    <td> ${playerData[i].gName}</td>
                    <td> ${playerData[i].gLevel}</td>
                    <td> ${playerData[i].gMemberNum}</td>
                    <td> ${playerData[i].gPoints}</td>
                </tr>
            `;
        }

        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showServerPlayer() {
    const sid = document.getElementById('idGroup').value;

    const response = await fetch(`/join-server?sid=${encodeURIComponent(sid)}`, { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>Server Player Match</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Player ID</th>
                        <th>Player Name</th>
                        <th>Server ID</th>
                        <th>Server Country</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].pid}</td>
                    <td> ${playerData[i].pName}</td>
                    <td> ${playerData[i].sid}</td>
                    <td> ${playerData[i].country}</td>
                </tr>
            `;
        }

        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showAllHunters() {
    const response = await fetch("/join-hunter", { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>All Hunters' Information</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Character Name</th>
                        <th>Code Name</th>
                        <th>Speed</th>
                        <th>Agility</th>
                        <th>Ability</th>
                        <th>Damage</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].cName}</td>
                    <td> ${playerData[i].codeName}</td>
                    <td> ${playerData[i].speed}</td>
                    <td> ${playerData[i].agility}</td>
                    <td> ${playerData[i].ability}</td>
                    <td> ${playerData[i].damage}</td>
                </tr>
            `;
        }
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showAllSurvivors() {
    const response = await fetch("/join-survivor", { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>All Survivors' Information</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Character Name</th>
                        <th>Employment</th>
                        <th>Speed</th>
                        <th>Agility</th>
                        <th>Skill</th>
                        <th>Decode</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].cName}</td>
                    <td> ${playerData[i].employment}</td>
                    <td> ${playerData[i].speed}</td>
                    <td> ${playerData[i].agility}</td>
                    <td> ${playerData[i].skill}</td>
                    <td> ${playerData[i].decode}</td>
                </tr>
            `;
        }
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxHunterDamage() {
    const response = await fetch("/get-max-stat-hunter?stat=damage", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Max Hunter Damage: ${responseData.val}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxHunterSpeed() {
    const response = await fetch("/get-max-stat-hunter?stat=speed", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Max Hunter Speed: ${responseData.val}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxHunterAgility() {
    const response = await fetch("/get-max-stat-hunter?stat=agility", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Max Hunter Agility: ${responseData.val}`,'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxSurvivorDecode() {
    const response = await fetch("/get-max-stat-survivor?stat=decode", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Max Survivor Decode: ${responseData.val}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxSurvivorSpeed() {
    const response = await fetch("/get-max-stat-survivor?stat=speed", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Max Survivor Speed: ${responseData.val}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxSurvivorAgility() {
    const response = await fetch("/get-max-stat-survivor?stat=agility", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Max Survivor Agility: ${responseData.val}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showGuildWithMaxHunterRank() {
    const response = await fetch("/guild-with-max-avg-hunter-rank", { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Guild with the highest average hunter rank: ${JSON.stringify(responseData.data[0])}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showGuildWithMaxSurvivorRank() {
    const response = await fetch("/guild-with-max-avg-surv-rank", { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Guild with the highest average survivor rank: ${JSON.stringify(responseData.data[0])}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxHunterRank() {
    const response = await fetch("/get-max-rank-hunter", { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>Max Hunter Rank for Each Server</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Server ID</th>
                        <th>Max Hunter Rank in Server</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].sid}</td>
                    <td> ${playerData[i].hunterRank}</td>
                </tr>
            `;
        }
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);

    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showMaxSurvivorRank() {
    const response = await fetch("/get-max-rank-survivor", { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Max survivor rank in all servers: ${JSON.stringify(responseData.data[0])}`, 'info');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showHunterTalents() {
    const response = await fetch("/show-hunter-talents", { method: 'GET' });

    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
        return;
    }

    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>All Hunter Talents</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Talent ID</th>
                        <th>Total Points</th>
                        <th>Dread</th>
                        <th>Vigilance</th>
                        <th>Deceit</th>
                        <th>Strength</th>
                        <th>Player ID</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].taid}</td>
                    <td> ${playerData[i].totalPoints}</td>
                    <td> ${playerData[i].dread}</td>
                    <td> ${playerData[i].vigilance}</td>
                    <td> ${playerData[i].deceit}</td>
                    <td> ${playerData[i].strength}</td>
                    <td> ${playerData[i].pid}</td>
                </tr>
            `;
        }
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

async function showAvgHunterRank(event) {
    event.preventDefault();

    const sid = document.getElementById('sidHSelect').value;

    const response = await fetch(`/avg-hunter-rank?sid=${encodeURIComponent(sid)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Average hunter rank in server with sid ${JSON.stringify(responseData.data[0])}: ${JSON.stringify(responseData.data[1])}`, 'info');
    } else {
        updateContentDiv("Given server doesn't exist!", 'error');
    }
}


async function showAvgSurvivorRank(event) {

    event.preventDefault();

    const sid = document.getElementById('sidSSelect').value;

    const response = await fetch(`/avg-survivor-rank?sid=${encodeURIComponent(sid)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    const responseData = await response.json();
    if (responseData.success) {
        updateContentDiv(`Average survivor rank in server with sid ${JSON.stringify(responseData.data[0])}: ${JSON.stringify(responseData.data[1])}`, 'info');
    } else {
        updateContentDiv("Given server doesn't exist!", 'error');
    }
}

async function showPlayersWithAllCharacter() {
    const response = await fetch("/get-players-all-char", { method: 'GET' });
    const responseData = await response.json();
    if (responseData.success) {
        const playerData = responseData.data;

        let infoHTML = `
            <h3>Player with All Characters</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                        <th>Player Name</th>
                        <th>Player ID</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < playerData.length; i++) {
            infoHTML += `
                <tr>
                    <td> ${playerData[i].pName}</td>
                    <td> ${playerData[i].pid}</td>
                </tr>
            `;
        }
        infoHTML += `
            </tbody>
        </table>
        `;

        updateContentDiv(infoHTML, 'info', true);
    } else if (response.status == 404) {
        updateContentDiv(responseData.message, 'error');
    } else {
        updateContentDiv("ERROR: Could not retrieve data!", 'error');
    }
}

function handleFetchResponse(response, title) {
    if (!response.ok) {
        updateContentDiv("ERROR: Could not retrieve data!", "error");
        return;
    }
    response.json().then(responseData => {
        if (responseData.success) {
            const data = responseData.data;
            let infoHTML = `<h3>${title}</h3>`;
            infoHTML += createTableHTML(data); // Generate HTML table dynamically
            updateContentDiv(infoHTML, "info", true);
        } else {
            updateContentDiv("ERROR: Could not retrieve data!", "error");
        }
    });
}

function createTableHTML(data) {
    if (!data || data.length === 0) {
        return "<p>No data found.</p>";
    }
    const keys = Object.keys(data[0]);
    let html = "<table border='1'><thead><tr>";
    keys.forEach(key => {
        html += `<th>${key}</th>`;
    });
    html += "</tr></thead><tbody>";
    data.forEach(row => {
        html += "<tr>";
        keys.forEach(key => {
            html += `<td>${row[key]}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table>";
    return html;
}

  
  // ---------------------------------------------------------------
  // Initializes the webpage functionalities.
  // Add or remove event listeners based on the desired functionalities.
  window.onload = function() {
    initTables();
    document.getElementById("insert-character-card").addEventListener("submit", insertCharCard);
    document.getElementById("update-character").addEventListener("submit", updateCharacter);
    document.getElementById("update-talent").addEventListener("submit", updateTalent);
    document.getElementById("delete-player").addEventListener("submit", deletePlayer);
    document.getElementById("select-player").addEventListener("submit", selectPlayer);

    document.getElementById("project-speed").addEventListener("click", showCharSpeed);
    document.getElementById("project-agility").addEventListener("click", showCharAgility);
    document.getElementById("show-groups").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission behavior
    
        const idGroup = document.getElementById("idGroup").value; // Get the input value
        const action = event.submitter.value; // Get the value of the button clicked
    
        switch (action) {
            case "team":
                fetch(`/join-team?teid=${encodeURIComponent(idGroup)}`)
                    .then(response => handleFetchResponse(response, "Team Player Match"));
                break;
            case "guild":
                fetch(`/join-guild?gid=${encodeURIComponent(idGroup)}`)
                    .then(response => handleFetchResponse(response, "Guild Player Match"));
                break;
            case "server":
                fetch(`/join-server?sid=${encodeURIComponent(idGroup)}`)
                    .then(response => handleFetchResponse(response, "Server Player Match"));
                break;
            default:
                updateContentDiv("Unknown action!", "error");
        }
    });

    
    document.getElementById("all-hunters").addEventListener("click", showAllHunters)
    document.getElementById("all-survivors").addEventListener("click", showAllSurvivors)
    document.getElementById("show-hunter-talents").addEventListener("click", showHunterTalents)

    document.getElementById("max-hunter-damage").addEventListener("click", showMaxHunterDamage)
    document.getElementById("max-hunter-speed").addEventListener("click", showMaxHunterSpeed)
    document.getElementById("max-hunter-agility").addEventListener("click", showMaxHunterAgility)

    document.getElementById("max-survivor-decode").addEventListener("click", showMaxSurvivorDecode)
    document.getElementById("max-survivor-speed").addEventListener("click", showMaxSurvivorSpeed)
    document.getElementById("max-survivor-agility").addEventListener("click", showMaxSurvivorAgility)

    document.getElementById("guild-max-hunter-rank").addEventListener("click", showGuildWithMaxHunterRank)
    document.getElementById("guild-max-survivor-rank").addEventListener("click", showGuildWithMaxSurvivorRank)

    document.getElementById("find-max-hunter-rank").addEventListener("click", showMaxHunterRank);
    document.getElementById("find-max-surv-rank").addEventListener("click", showMaxSurvivorRank);
    document.getElementById("avg-hunter-rank").addEventListener("submit", showAvgHunterRank);
    document.getElementById("avg-surv-rank").addEventListener("submit", showAvgSurvivorRank);

    document.getElementById("division").addEventListener("click", showPlayersWithAllCharacter)
  };