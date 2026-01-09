// Country data for flags and abbreviations
const countryData = {
    "Argentina": { code: "ar", abbr: "ARG" }, "Australia": { code: "au", abbr: "AUS" }, "Austria": { code: "at", abbr: "AUT" },
    "Belgium": { code: "be", abbr: "BEL" }, "Brazil": { code: "br", abbr: "BRA" }, "Canada": { code: "ca", abbr: "CAN" },
    "China": { code: "cn", abbr: "CHN" }, "Colombia": { code: "co", abbr: "COL" }, "Denmark": { code: "dk", abbr: "DEN" },
    "Finland": { code: "fi", abbr: "FIN" }, "France": { code: "fr", abbr: "FRA" }, "Germany": { code: "de", abbr: "GER" },
    "Hungary": { code: "hu", abbr: "HUN" }, "India": { code: "in", abbr: "IND" }, "Indonesia": { code: "id", abbr: "IDN" },
    "Ireland": { code: "ie", abbr: "IRL" }, "Italy": { code: "it", abbr: "ITA" }, "Japan": { code: "jp", abbr: "JPN" },
    "Malaysia": { code: "my", abbr: "MAS" }, "Mexico": { code: "mx", abbr: "MEX" }, "Monaco": { code: "mc", abbr: "MON" },
    "Netherlands": { code: "nl", abbr: "NED" }, "New Zealand": { code: "nz", abbr: "NZL" }, "Poland": { code: "pl", abbr: "POL" },
    "Portugal": { code: "pt", abbr: "POR" }, "Russia": { code: "ru", abbr: "RUS" }, "South Africa": { code: "za", abbr: "RSA" },
    "Spain": { code: "es", abbr: "ESP" }, "Sweden": { code: "se", abbr: "SWE" }, "Switzerland": { code: "ch", abbr: "SUI" },
    "Thailand": { code: "th", abbr: "THA" }, "United Kingdom": { code: "gb", abbr: "GBR" }, "USA": { code: "us", abbr: "USA" },
    "Venezuela": { code: "ve", abbr: "VEN" }
};

// Helper function to calculate current age from birth date
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Helper function to calculate seasons from debut year
function calculateSeasons(debutYear, lastYear) {
    if (!debutYear) return 0;
    // If lastYear is not provided, assume they're still active (use current year)
    const endYear = lastYear || new Date().getFullYear();
    return endYear - debutYear + 1;
}

function countTeammates(teammates) {
    // If teammates is a number, return it, otherwise return 0
    return typeof teammates === 'number' ? teammates : 0;
}

// Extract unique nationalities and constructors
const nationalities = [...new Set(drivers.map(driver => driver.nationality))];
const constructors = [...new Set(drivers.flatMap(driver => driver.constructors))];

// Create statistics categories
const statisticsCategories = {
    'Podiums 20+': drivers.filter(d => d.podiums && d.podiums >= 20).map(d => d.name),
    'Podiums 35+': drivers.filter(d => d.podiums && d.podiums >= 35).map(d => d.name),
    'Podiums 50+': drivers.filter(d => d.podiums && d.podiums >= 50).map(d => d.name),

    'Races <50': drivers.filter(d => d.races && d.races < 50).map(d => d.name),
    'Races 50-100': drivers.filter(d => d.races && d.races >= 50 && d.races <= 100).map(d => d.name),
    'Races 100+': drivers.filter(d => d.races && d.races > 100).map(d => d.name),

    'Wins 1-5': drivers.filter(d => d.wins && d.wins >= 1 && d.wins <= 5).map(d => d.name),
    'Wins 6+': drivers.filter(d => d.wins && d.wins >= 6).map(d => d.name),
    'Wins 10+': drivers.filter(d => d.wins && d.wins >= 10).map(d => d.name),
    'Wins 15+': drivers.filter(d => d.wins && d.wins >= 15).map(d => d.name),

    'Pole Positions 7+': drivers.filter(d => d.poles && d.poles >= 7).map(d => d.name),

    'Seasons 10+': drivers.filter(d => d.debutYear && calculateSeasons(d.debutYear, d.lastYear) >= 10).map(d => d.name),

    'Teammates 4+': drivers.filter(d => countTeammates(d.teammates) >= 4).map(d => d.name),
    'Teammates 7+': drivers.filter(d => countTeammates(d.teammates) >= 6).map(d => d.name),
    'Teammates 10+': drivers.filter(d => countTeammates(d.teammates) >= 10).map(d => d.name),

    'Debut before 2000': drivers.filter(d => d.debutYear && d.debutYear < 2000).map(d => d.name),
    'Debut after 2000': drivers.filter(d => d.debutYear && d.debutYear > 2000).map(d => d.name),

    'Age 17-25': drivers.filter(d => d.birthDate && calculateAge(d.birthDate) >= 17 && calculateAge(d.birthDate) <= 25).map(d => d.name),
    'Age 26-33': drivers.filter(d => d.birthDate && calculateAge(d.birthDate) >= 26 && calculateAge(d.birthDate) <= 33).map(d => d.name),
    'Age 34+': drivers.filter(d => d.birthDate && calculateAge(d.birthDate) >= 34).map(d => d.name)
};

// Game state
let gameState = {
    currentPlayer: 1, // 1 or 2
    countries: [],
    teams: [],
    board: Array(3).fill().map(() => Array(3).fill(null)),
    correctAnswers: {},
    gameOver: false,
    lastSelectedDifficulty: null
};
let showTooltips = true;
let winCounts = { p1: 0, p2: 0 };

// Setup state
let setupState = {
    selectedLeftTeams: [],
    selectedTopTeams: [],
    availableItems: [] // Now contains both teams and countries
};

// DOM elements
const gameBoard = document.getElementById('gameBoard');
const playerTurn = document.getElementById('playerTurn');
const driverInput = document.getElementById('driverInput');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const winner = document.getElementById('winner');
const skipBtn = document.getElementById('skipBtn');

// Initialize the setup screen
function initSetup() {
    // Show setup screen, hide game screen
    document.getElementById('setupScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('gameControls').style.display = 'none';
    
    // Reset setup state and difficulty memory
    setupState.selectedLeftTeams = [];
    setupState.selectedTopTeams = [];
    gameState.lastSelectedDifficulty = null;
    
    // Combine teams, countries, and statistics with separators
    const sortedTeams = [...constructors].sort();
    const sortedCountries = [...nationalities].sort();
    const statisticsKeys = Object.keys(statisticsCategories).sort();
    
    setupState.availableItems = [
        { type: 'divider', name: '--- TEAMS ---' },
        ...sortedTeams.map(team => ({ type: 'team', name: team, difficulty: assignDifficulty(team, 'team') })),
        { type: 'divider', name: '--- NATIONALITY ---' },
        ...sortedCountries.map(country => ({ type: 'country', name: country, difficulty: assignDifficulty(country, 'country') })),
        { type: 'divider', name: '--- STATS/MISC ---' },
        ...statisticsKeys.map(statKey => ({ type: 'statistic', name: statKey, difficulty: assignDifficulty(statKey, 'statistic') }))
    ];
    
    // Generate selectors
    generateLeftTeamSelector();
    generateTopTeamSelector();
    updateSetupDisplay();
}

function assignDifficulty(name, type) {
    // Define difficulty ratings here. 1=Easy, 10=Hard.
    const teamDifficulties = {
        "Ferrari": 1, "McLaren": 1, "Williams": 1, "Lotus": 3, "Sauber / BMW Sauber": 2,
        "Tyrrell": [5, 7], "Renault": 2, "Brabham": 6, "Red Bull": 1, "Arrows": 8,
        "Minardi": 6, "Ligier": 8, "Mercedes": 1, "Scuderia Toro Rosso": 4, "Benetton": 5,
        "Jordan": 6, "Alfa Romeo": 3, "BRM": 8, "March": 9, "Force India": 5,
        "Haas": 3, "Osella": 9, "Lola": 8, "Toyota": 5, "Ensign": 10,
        "Cooper": 8, "Fittipaldi (Copersucar)": 9, "Surtees": 9, "BAR (British American Racing)": 8,
        "Shadow": 9, "ATS (Auto Technisches Spezialzubehör)": 9, "Honda": 5, "Aston Martin": 2,
        "Alpine": 3, "Jaguar": 6, "Prost": 7, "AGS (Automobiles Gonfaronnaises Sportives)": 10,
        "Dallara": 9, "Marussia": 7, "Zakspeed": 9, "Maserati": 7, "Toleman": 9,
        "Coloni": 10, "Alpha Tauri": 4, "Frank WIlliams Racing Cars": 10, "Matra": 8,
        "Hesketh": 9, "Caterham": 8, "HRT": 8, "Theodore": 10, "Stewart": 8,
        "Wolf": 9, "EuroBrun": 10, "RAM": 10, "Penske": 9, "Super Aguri": 9,
        "Racing Point": 5, "Virgin": 8, "Porsche": 7, "Gordini": 10, "Pacific": 10,
        "Larrousse": 10, "Leyton House": 9, "Rial": 10, "Merzario": 10, "Vanwall": 8,
        "Fondmetal": 10, "Forti": 10, "Eagle (Anglo American Racers)": 10, "Onyx": 10,
        "Spirit": 10, "Manor": 8, "Simtek": 9, "Connaught": 10, "Midland": 9,
        "Brawn": 5, "Spyker": 8, "HWM (Hersham and Walton Motors)": 10, "Lambo (Modena Team)": 7,
        "Parnelli": 10, "Venturi": 10, "De Tomaso": 10, "Simca–Gordini": 10, "Life": 9,
        "BRP (British Racing Partnership)": 10, "Talbot–Lago": 10, "Tecno": 10, "Hill": 9,
        "Andrea Moda": 9, "Boro": 10, "Eifelland": 10, "Maki": 10, "Trojan": 10,
        "ERA (English Racing Automobiles)": 10, "Martini": 10, "OSCA (Officine Specializate Costruzione Automobili)": 10,
        "Scirocco": 10, "Bellasi": 10, "Emeryson": 10, "Gilby": 10, "JBW": 10,
        "Veritas": 10, "Alta": 10, "ATS (Automobili Turismo e Sport)": 9, "LDS": 10,
        "LEC": 10, "Scarab": 10, "AFM (Alex von Falkenhausen Motorenbau)": 10, "Amon": 10,
        "Aston Butterworth": 10, "Behra–Porsche": 7, "Frazer–Nash": 10, "Lancia": 9,
        "Rebaque": 10, "Token": 10, "Connew": 10, "Kauhsen": 10, "Kojima": 10,
        "Lyncar": 10, "Apollon": 10, "Arzani–Volpini": 10, "Bugatti": 9, "Cisitalia": 10,
        "De Klerk": 10, "Derrington–Francis": 10, "EMW (Eisenacher Motorenwerk)": 10, "ENB (Ecurie Nationale Belge)": 10,
        "Ferguson": 10, "Fry": 10, "Greifzu": 10, "Klenk": 10, "Kurtis": 10,
        "McGuire": 10, "Milano": 10, "RE": 10, "Shannon": 10, "Stebro": 10, "Tec–Mec": 10
    };
    
    const statisticDifficulties = {
        'Podiums 20+': [2, 7], 'Podiums 35+': [2, 7], 'Podiums 50+': [2, 7],
        'Races <50': [2, 6], 'Races 50-100': [3,8], 'Races 100+': [2,5],
        'Wins 1-5': [3,9], 'Wins 6+': [2,7], 'Wins 10+': [2, 9], 'Wins 15+': [2, 9],
        'Pole Positions 7+': [3, 10], 'Seasons 10+': [2, 10],
        'Teammates 4+': [1, 4], 'Teammates 7+': [2, 6], 'Teammates 10+': [3, 10],
        'Debut before 2000': [2, 10], 'Debut after 2000': [1, 4],
        'Age 17-25': [3, 8], 'Age 26-33': [3, 8], 'Age 34+': [2, 4]
    };
    
    if (type === 'team' && teamDifficulties[name]) {
        return teamDifficulties[name];
    }
    if (type === 'statistic' && statisticDifficulties[name]) {
        return statisticDifficulties[name];
    }
    // Default difficulty for unlisted items
    return 5;
}

function updateWinTracker() {
    document.getElementById('scoreTracker').textContent = `${winCounts.p1}-${winCounts.p2}`;
}

// Initialize the game with selected left teams and top teams
function initGame(leftTeams, topTeams) {
    // Set up game state with selected teams
    gameState.countries = leftTeams || setupState.selectedLeftTeams;
    gameState.teams = topTeams || setupState.selectedTopTeams;
    
    gameState.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    gameState.currentPlayer = 1;
    gameState.gameOver = false;
    gameState.correctAnswers = {};
    gameState.selectedRow = undefined;
    gameState.selectedCol = undefined;
    // Show game screen, hide setup screen
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('gameControls').style.display = 'block';
    // Clear winner display
    document.getElementById("winner").textContent = "";
    document.getElementById("winner").classList.remove("winner");
    // Update player turn display
    updatePlayerTurn();
    // Generate the game board
    generateBoard();
}

// Get random items from an array with better randomization
function getRandomItems(array, count) {
    const result = [];
    const shuffled = [...array];
    
    // Fisher-Yates shuffle for better randomization
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
}

// Napravi mapu s ključevima "nacionalnost|konstruktor" koji imaju barem jednog vozača
const validCombosMap = new Set();
drivers.forEach(driver => {
    driver.constructors.forEach(team => {
        validCombosMap.add(`${driver.nationality}|${team}`);
    });
});

// Validacija da svih 9 kombinacija (3 nacije x 3 konstruktora) imaju barem jednog vozača
function validateAllCellsHaveDriver(selectedCountries, selectedConstructors) {
    for (const nat of selectedCountries) {
        for (const team of selectedConstructors) {
            if (!validCombosMap.has(`${nat}|${team}`)) {
                return false;
            }
        }
    }
    return true;
}

// Get a valid combination from a specific pool of items based on difficulty
function getValidCombinationFromPool(pool) {
    let attempts = 0;
    const maxAttempts = 500; // Increased attempts for harder difficulties
    // Separate the pool into potential left and top items
    const availableTopItems = pool.filter(item => item.type === 'team' || item.type === 'statistic').map(item => item.name);
    const availableLeftItems = pool.filter(item => item.type !== 'divider').map(item => item.name);
    
    if (availableTopItems.length < 3 || availableLeftItems.length < 3) {
        console.warn(`Not enough items in the pool for this difficulty.`);
        alert("Could not generate a grid for this difficulty. There may not be enough valid items in the selected range.");
        return null;
    }
    while (attempts < maxAttempts) {
        const topItems = getRandomItems(availableTopItems, 3);
        const shuffledLeftPool = getRandomItems(availableLeftItems, availableLeftItems.length);
        const leftItems = [];
        for (const leftItem of shuffledLeftPool) {
            // Avoid duplicates on the axes
            if (topItems.includes(leftItem)) continue;
            if (leftItems.includes(leftItem)) continue;
            // Check if this new leftItem creates a valid row with the topItems
            const isRowValid = topItems.every(topItem => checkDriverExists(leftItem, topItem));
            if (isRowValid) {
                leftItems.push(leftItem);
            }
            if (leftItems.length === 3) {
                console.log("Found a valid random combination from pool:", { countries: leftItems, teams: topItems });
                return { countries: leftItems, teams: topItems };
            }
        }
        attempts++;
    }
    console.warn("Could not find a valid combination from the provided pool after many attempts.");
    alert("Failed to generate a valid grid for this difficulty. Please try again or select a different difficulty.");
    return null;
}

// Generate the game board
function generateBoard() {
    gameBoard.innerHTML = '';

    // Add constructor headers
    gameState.teams.forEach((team, colIndex) => {
        const header = document.createElement('div');
        header.className = 'header';
        header.textContent = team;
        header.dataset.teamIndex = colIndex;
        header.style.gridRow = 1;
        header.style.gridColumn = colIndex + 2; // +2 offset for the country header column
        gameBoard.appendChild(header);
    });

    // Add country headers and cells
    gameState.countries.forEach((country, rowIndex) => {
        // Country header - position it in the correct grid row
        const countryHeader = document.createElement('div');
        countryHeader.className = 'country-header';
        
        const countryInfo = countryData[country];
        if (countryInfo && nationalities.includes(country)) {
            countryHeader.innerHTML = `
                <img src="https://flagcdn.com/w40/${countryInfo.code}.png" alt="${country}" style="height: 20px; width: 30px; object-fit: cover;">
                <span>${countryInfo.abbr}</span>
            `;
        } else {
            countryHeader.textContent = country; // Fallback for stats/teams
        }
        countryHeader.dataset.countryIndex = rowIndex;
        countryHeader.style.gridRow = rowIndex + 2; // +2 because row 1 is for constructor headers
        gameBoard.appendChild(countryHeader);
        // Cells for this row
        gameState.teams.forEach((team, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.style.gridRow = rowIndex + 2; // +2 because row 1 is for constructor headers
            cell.style.gridColumn = colIndex + 2; // +2 because column 1 is for country headers
            
            // Count matching drivers for this combination
            const leftItem = gameState.countries[rowIndex];
            const topItem = gameState.teams[colIndex];
            
            // Determine item types
            const leftIsTeam = constructors.includes(leftItem);
            const leftIsCountry = nationalities.includes(leftItem);
            const leftIsStatistic = Object.keys(statisticsCategories).includes(leftItem);
            const topIsTeam = constructors.includes(topItem);
            const topIsCountry = nationalities.includes(topItem);
            const topIsStatistic = Object.keys(statisticsCategories).includes(topItem);
            
            let matchingDrivers = [];
            let combinationType = '';
            
            if (leftIsTeam && topIsTeam) {
                // Team vs Team: drivers who raced for both teams
                matchingDrivers = drivers.filter(driver =>
                    driver.constructors.includes(leftItem) && 
                    driver.constructors.includes(topItem)
                );
                combinationType = 'raced for both';
            } else if (leftIsCountry && topIsTeam) {
                // Country vs Team: drivers from that nationality who raced for that team
                matchingDrivers = drivers.filter(driver =>
                    driver.nationality === leftItem && 
                    driver.constructors.includes(topItem)
                );
                combinationType = 'from country, raced for team';
            } else if (leftIsTeam && topIsCountry) {
                // Team vs Country: drivers who raced for that team and are from that nationality
                matchingDrivers = drivers.filter(driver =>
                    driver.constructors.includes(leftItem) && 
                    driver.nationality === topItem
                );
                combinationType = 'raced for team, from country';
            } else if (leftIsStatistic && topIsTeam) {
                // Statistic vs Team: drivers who meet statistical criteria and raced for that team
                const statisticDrivers = statisticsCategories[leftItem];
                matchingDrivers = drivers.filter(driver =>
                    statisticDrivers.includes(driver.name) &&
                    driver.constructors.includes(topItem)
                );
                combinationType = 'meet criteria, raced for team';
            } else if (leftIsTeam && topIsStatistic) {
                // Team vs Statistic: drivers who raced for that team and meet statistical criteria
                const statisticDrivers = statisticsCategories[topItem];
                matchingDrivers = drivers.filter(driver =>
                    driver.constructors.includes(leftItem) &&
                    statisticDrivers.includes(driver.name)
                );
                combinationType = 'raced for team, meet criteria';
            } else if (leftIsCountry && topIsStatistic) {
                // Country vs Statistic: drivers from that nationality who meet statistical criteria
                const statisticDrivers = statisticsCategories[topItem];
                matchingDrivers = drivers.filter(driver =>
                    driver.nationality === leftItem &&
                    statisticDrivers.includes(driver.name)
                );
                combinationType = 'from country, meet criteria';
            } else if (leftIsStatistic && topIsCountry) {
                // Statistic vs Country: drivers who meet statistical criteria and are from that nationality
                const statisticDrivers = statisticsCategories[leftItem];
                matchingDrivers = drivers.filter(driver =>
                    statisticDrivers.includes(driver.name) &&
                    driver.nationality === topItem
                );
                combinationType = 'meet criteria, from country';
            } else if (leftIsStatistic && topIsStatistic) {
                // Statistic vs Statistic: drivers who meet both statistical criteria
                const leftStatisticDrivers = statisticsCategories[leftItem];
                const topStatisticDrivers = statisticsCategories[topItem];
                matchingDrivers = drivers.filter(driver =>
                    leftStatisticDrivers.includes(driver.name) &&
                    topStatisticDrivers.includes(driver.name)
                );
                combinationType = 'meet both criteria';
            } else if (leftIsCountry && topIsCountry) {
                // Country vs Country: not valid (driver can't have two nationalities)
                matchingDrivers = [];
                combinationType = 'invalid combination';
            }
            
            const count = matchingDrivers.length;
            
            // Add tooltip showing combination and driver count with appropriate description
            if (showTooltips) {
                if (leftIsCountry && topIsCountry) {
                    cell.title = `${leftItem} & ${topItem}: Invalid - driver cannot have two nationalities`;
                } else {
                    const driverText = count !== 1 ? 'drivers' : 'driver';
                    cell.title = `${leftItem} & ${topItem}: ${count} ${driverText} (${combinationType})`;
                }
            } else {
                cell.removeAttribute('title');
            }
            // Show count in corner if cell isn't occupied and tooltips are enabled
            if (gameState.board[rowIndex][colIndex] === null && showTooltips) {
                const countEl = document.createElement('div');
                countEl.textContent = count;
                cell.appendChild(countEl);
            }
            // If this cell has been answered
            if (gameState.board[rowIndex][colIndex] !== null) {
                const player = gameState.board[rowIndex][colIndex];
                cell.classList.add(player === 1 ? 'correct-p1' : 'correct-p2');
                cell.textContent = gameState.correctAnswers[`${rowIndex}-${colIndex}`];
            }
            
            cell.addEventListener('click', () => selectCell(rowIndex, colIndex));
            gameBoard.appendChild(cell);
        });
    });
}

// Update player turn display
function updatePlayerTurn() {
    playerTurn.textContent = `Player ${gameState.currentPlayer}'s Turn (${gameState.currentPlayer === 1 ? 'Blue' : 'Yellow'})`;
    playerTurn.className = `player-turn ${gameState.currentPlayer === 1 ? 'p1' : 'p2'}`;
}

// Select a cell
function selectCell(row, col) {
    if (gameState.gameOver || gameState.board[row][col] !== null) return;
    
    message.textContent = `Guess a driver from ${gameState.countries[row]} who raced for ${gameState.teams[col]}`;
    message.className = 'message';
    
    // Store selected cell
    gameState.selectedRow = row;
    gameState.selectedCol = col;
    
    driverInput.focus();
}

// Check if a driver matches the selected criteria
function checkDriverExists(leftItem, topItem) {
    // This is a simplified checker just to see if ANY driver fits the criteria.
    const hasDriver = drivers.some(driver => {
        const leftIsTeam = constructors.includes(leftItem);
        const leftIsCountry = nationalities.includes(leftItem);
        const leftIsStatistic = Object.keys(statisticsCategories).includes(leftItem);
        const topIsTeam = constructors.includes(topItem);
        const topIsCountry = nationalities.includes(topItem);
        const topIsStatistic = Object.keys(statisticsCategories).includes(topItem);
        if (leftIsTeam && topIsTeam) return driver.constructors.includes(leftItem) && driver.constructors.includes(topItem);
        if (leftIsCountry && topIsTeam) return driver.nationality === leftItem && driver.constructors.includes(topItem);
        if (leftIsTeam && topIsCountry) return driver.constructors.includes(leftItem) && driver.nationality === topItem;
        if (leftIsStatistic && topIsTeam) return statisticsCategories[leftItem].includes(driver.name) && driver.constructors.includes(topItem);
        if (leftIsTeam && topIsStatistic) return driver.constructors.includes(leftItem) && statisticsCategories[topItem].includes(driver.name);
        if (leftIsCountry && topIsStatistic) return driver.nationality === leftItem && statisticsCategories[topItem].includes(driver.name);
        if (leftIsStatistic && topIsCountry) return statisticsCategories[leftItem].includes(driver.name) && driver.nationality === topItem;
        if (leftIsStatistic && topIsStatistic) return statisticsCategories[leftItem].includes(driver.name) && statisticsCategories[topItem].includes(driver.name);
        if (leftIsCountry && topIsCountry) return false; // A driver can't have two nationalities
        return false;
    });
    return hasDriver;
}

// Check if a driver matches the selected criteria
function checkDriver(driverName, leftItem, topItem) {
    const driver = drivers.find(d => d.name.toLowerCase() === driverName.toLowerCase());
    if (!driver) return false;
    
    // Determine item types
    const leftIsTeam = constructors.includes(leftItem);
    const leftIsCountry = nationalities.includes(leftItem);
    const leftIsStatistic = Object.keys(statisticsCategories).includes(leftItem);
    const topIsTeam = constructors.includes(topItem);
    const topIsCountry = nationalities.includes(topItem);
    const topIsStatistic = Object.keys(statisticsCategories).includes(topItem);
    
    if (leftIsTeam && topIsTeam) {
        // Team vs Team: driver must have raced for both teams
        return driver.constructors.includes(leftItem) && driver.constructors.includes(topItem);
    } else if (leftIsCountry && topIsTeam) {
        // Country vs Team: driver must be from that nationality and raced for that team
        return driver.nationality === leftItem && driver.constructors.includes(topItem);
    } else if (leftIsTeam && topIsCountry) {
        // Team vs Country: driver must have raced for that team and be from that nationality
        return driver.constructors.includes(leftItem) && driver.nationality === topItem;
    } else if (leftIsStatistic && topIsTeam) {
        // Statistic vs Team: driver must meet statistical criteria and raced for that team
        const statisticDrivers = statisticsCategories[leftItem];
        return statisticDrivers.includes(driver.name) && driver.constructors.includes(topItem);
    } else if (leftIsTeam && topIsStatistic) {
        // Team vs Statistic: driver must have raced for that team and meet statistical criteria
        const statisticDrivers = statisticsCategories[topItem];
        return driver.constructors.includes(leftItem) && statisticDrivers.includes(driver.name);
    } else if (leftIsCountry && topIsStatistic) {
        // Country vs Statistic: driver must be from that nationality and meet statistical criteria
        const statisticDrivers = statisticsCategories[topItem];
        return driver.nationality === leftItem && statisticDrivers.includes(driver.name);
    } else if (leftIsStatistic && topIsCountry) {
        // Statistic vs Country: driver must meet statistical criteria and be from that nationality
        const statisticDrivers = statisticsCategories[leftItem];
        return statisticDrivers.includes(driver.name) && driver.nationality === topItem;
    } else if (leftIsStatistic && topIsStatistic) {
        // Statistic vs Statistic: driver must meet both statistical criteria
        const leftStatisticDrivers = statisticsCategories[leftItem];
        const topStatisticDrivers = statisticsCategories[topItem];
        return leftStatisticDrivers.includes(driver.name) && topStatisticDrivers.includes(driver.name);
    } else if (leftIsCountry && topIsCountry) {
        // Country vs Country: not valid (driver can't have two nationalities)
        return false;
    }
    
    return false;
}

// Check for a winner
function checkWinner() {
    const lines = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        if (gameState.board[a[0]][a[1]] !== null && 
            gameState.board[a[0]][a[1]] === gameState.board[b[0]][b[1]] && 
            gameState.board[a[0]][a[1]] === gameState.board[c[0]][c[1]]) {
            return gameState.board[a[0]][a[1]];
        }
    }

    // Check for draw
    let isDraw = true;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (gameState.board[row][col] === null) {
                isDraw = false;
                break;
            }
        }
        if (!isDraw) break;
    }

    return isDraw ? 'draw' : null;
}

// Handle form submission
function handleSubmit() {
    if (gameState.gameOver || gameState.selectedRow === undefined || gameState.selectedCol === undefined) {
        message.textContent = 'Please select a cell first';
        message.className = 'message error';
        return;
    }

    const driverName = driverInput.value.trim();
    if (!driverName) {
        message.textContent = 'Please enter a driver name';
        message.className = 'message error';
        return;
    }

    const row = gameState.selectedRow;
    const col = gameState.selectedCol;
    const leftItem = gameState.countries[row];
    const topItem = gameState.teams[col];
    if (checkDriver(driverName, leftItem, topItem)) {
        // Correct answer
        gameState.board[row][col] = gameState.currentPlayer;
        gameState.correctAnswers[`${row}-${col}`] = driverName;
        
        // Generate appropriate success message based on combination type
        const leftIsTeam = constructors.includes(leftItem);
        const topIsTeam = constructors.includes(topItem);
        
        let successMessage = `Correct! ${driverName}`;
        if (leftIsTeam && topIsTeam) {
            successMessage += ` raced for both ${leftItem} and ${topItem}`;
        } else if (!leftIsTeam && topIsTeam) {
            successMessage += ` is from ${leftItem} and raced for ${topItem}`;
        } else if (leftIsTeam && !topIsTeam) {
            successMessage += ` raced for ${leftItem} and is from ${topItem}`;
        }
        
        message.textContent = successMessage;
        message.className = 'message success';
        
        // Check for winner
        const winnerResult = checkWinner();
        if (winnerResult === 1 || winnerResult === 2) {
            gameState.gameOver = true;
            winner.textContent = `Player ${winnerResult} wins!`;
            if (winnerResult === 1) winCounts.p1++;
            if (winnerResult === 2) winCounts.p2++;
            updateWinTracker();
        } else if (winnerResult === 'draw') {
            gameState.gameOver = true;
            winner.textContent = "It's a draw!";
        }
        if (gameState.gameOver) {
            winner.classList.add('winner');
            setTimeout(() => {
                if (gameState.lastSelectedDifficulty) {
                    generateRandomGameByDifficulty(gameState.lastSelectedDifficulty);
                } else {
                    initSetup();
                }
            }, 2500);
        }
    } else {
        // Incorrect answer
        const leftIsTeam = constructors.includes(leftItem);
        const topIsTeam = constructors.includes(topItem);
        
        let errorMessage = `Incorrect. ${driverName}`;
        if (leftIsTeam && topIsTeam) {
            errorMessage += ` didn't race for both ${leftItem} and ${topItem} or doesn't exist`;
        } else if (!leftIsTeam && topIsTeam) {
            errorMessage += ` is not from ${leftItem} or didn't race for ${topItem} or doesn't exist`;
        } else if (leftIsTeam && !topIsTeam) {
            errorMessage += ` didn't race for ${leftItem} or is not from ${topItem} or doesn't exist`;
        } else {
            errorMessage += ` doesn't match this invalid combination or doesn't exist`;
        }
        
        message.textContent = errorMessage;
        message.className = 'message error';
    }

    // Switch player if game isn't over
    if (!gameState.gameOver) {
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        updatePlayerTurn();
    }

    // Reset selection and input
    gameState.selectedRow = undefined;
    gameState.selectedCol = undefined;
    driverInput.value = '';
    
    // Regenerate board to show updates
    generateBoard();
}

// Handle skip turn
function handleSkipTurn() {
    if (gameState.gameOver) return;
    
    // Clear any selection
    gameState.selectedRow = undefined;
    gameState.selectedCol = undefined;
    driverInput.value = '';
    
    // Show skip message
    message.textContent = `Player ${gameState.currentPlayer} skipped their turn`;
    message.className = 'message';
    
    // Switch to next player
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    updatePlayerTurn();
}

// Autocomplete functionality
const driverDropdown = document.getElementById('driverDropdown');
let filteredDrivers = [];
function showDropdown(drivers) {
    driverDropdown.innerHTML = '';
    filteredDrivers = drivers;
    
    if (drivers.length === 0) {
        driverDropdown.style.display = 'none';
        return;
    }
    
    drivers.forEach((driver, index) => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = driver.name;
        item.addEventListener('click', () => selectDriver(driver.name));
        driverDropdown.appendChild(item);
    });
    
    driverDropdown.style.display = 'block';
}
function hideDropdown() {
    driverDropdown.style.display = 'none';
}
function selectDriver(driverName) {
    driverInput.value = driverName;
    hideDropdown();
    driverInput.focus();
}
function filterDrivers(searchTerm) {
    if (searchTerm.length < 3) {
        hideDropdown();
        return;
    }
    
    const filtered = drivers.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8); // Limit to 8 results
    
    showDropdown(filtered);
}

// Event listeners
submitBtn.addEventListener('click', handleSubmit);
const toggleTooltipsBtn = document.getElementById('toggleTooltipsBtn');
const endAsDrawBtn = document.getElementById('endAsDrawBtn');

toggleTooltipsBtn.addEventListener('click', () => {
    showTooltips = !showTooltips;
    toggleTooltipsBtn.textContent = showTooltips ? 'Hide Tooltips' : 'Show Tooltips';
    generateBoard(); // regenerate board
});

endAsDrawBtn.addEventListener('click', () => {
    if (gameState.gameOver) return;

    const confirmDraw = confirm("Are you sure you want to end this round as a draw?");
    if (confirmDraw) {
        gameState.gameOver = true;
        winner.textContent = "Round ended as draw!";
        winner.classList.add('winner');

        setTimeout(() => {
            if (gameState.lastSelectedDifficulty) {
                generateRandomGameByDifficulty(gameState.lastSelectedDifficulty);
            } else {
                initSetup();
            }
        }, 2000);
    }
});

skipBtn.addEventListener('click', handleSkipTurn);

driverInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
});

driverInput.addEventListener('input', (e) => {
    filterDrivers(e.target.value);
});

driverInput.addEventListener('blur', () => {
    // Delay hiding to allow click on dropdown item
    setTimeout(hideDropdown, 150);
});

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-container')) {
        hideDropdown();
    }
});

// Setup screen functions
function generateLeftTeamSelector(searchTerm = '') {
    const container = document.getElementById('leftTeamsSelector');
    container.innerHTML = '';
    
    const filteredItems = setupState.availableItems.filter(item => {
        if (item.type === 'divider') return true;
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    filteredItems.forEach(item => {
        const element = document.createElement('div');
        
        if (item.type === 'divider') {
            element.className = 'setup-divider';
            element.textContent = item.name;
        } else {
            element.className = 'setup-item';
            element.dataset.name = item.name; // Use a data attribute for the name
            const countryInfo = countryData[item.name];
            if (item.type === 'country' && countryInfo) {
                element.innerHTML = `
                    <img src="https://flagcdn.com/w20/${countryInfo.code}.png" alt="${item.name}" style="height: 16px; margin-bottom: 4px;">
                    <span>${countryInfo.abbr}</span>
                `;
                element.style.flexDirection = 'column';
                element.style.gap = '2px';
            } else {
                element.textContent = item.name;
            }
            element.addEventListener('click', () => toggleLeftTeamSelection(item));
        }
        
        container.appendChild(element);
    });
}

function generateTopTeamSelector(searchTerm = '') {
    const container = document.getElementById('topTeamsSelector');
    container.innerHTML = '';
    
    const filteredItems = setupState.availableItems.filter(item => {
        if (item.type === 'divider') return true;
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    filteredItems.forEach(item => {
        const element = document.createElement('div');
        
        if (item.type === 'divider') {
            element.className = 'setup-divider';
            element.textContent = item.name;
        } else {
            element.className = 'setup-item';
            element.dataset.name = item.name; // Use a data attribute for the name
            const countryInfo = countryData[item.name];
             if (item.type === 'country' && countryInfo) {
                element.innerHTML = `
                    <img src="https://flagcdn.com/w20/${countryInfo.code}.png" alt="${item.name}" style="height: 16px; margin-bottom: 4px;">
                    <span>${countryInfo.abbr}</span>
                `;
                element.style.flexDirection = 'column';
                element.style.gap = '2px';
            } else {
                element.textContent = item.name;
            }
            element.addEventListener('click', () => toggleTopTeamSelection(item));
        }
        
        container.appendChild(element);
    });
}

function toggleLeftTeamSelection(item) {
    const itemName = item.name;
    const index = setupState.selectedLeftTeams.indexOf(itemName);
    if (index === -1) {
        if (setupState.selectedLeftTeams.length < 3) {
            setupState.selectedLeftTeams.push(itemName);
        }
    } else {
        setupState.selectedLeftTeams.splice(index, 1);
    }
    updateSetupDisplay();
    document.getElementById('leftTeamSearch').value = '';
    generateLeftTeamSelector();
    updateSetupDisplay(); // Call again to apply correct states after list regeneration
}

function toggleTopTeamSelection(item) {
    const itemName = item.name;
    const index = setupState.selectedTopTeams.indexOf(itemName);
    if (index === -1) {
        if (setupState.selectedTopTeams.length < 3) {
            setupState.selectedTopTeams.push(itemName);
        }
    } else {
        setupState.selectedTopTeams.splice(index, 1);
    }
    updateSetupDisplay();
    document.getElementById('topTeamSearch').value = '';
    generateTopTeamSelector();
    updateSetupDisplay(); // Call again to apply correct states after list regeneration
}

function updateSetupDisplay() {
    
    // Update left team selector
    const leftTeamItems = document.querySelectorAll('#leftTeamsSelector .setup-item');
    leftTeamItems.forEach(item => {
        const itemName = item.dataset.name;
        const isSelected = setupState.selectedLeftTeams.includes(itemName);
        const canSelect = setupState.selectedLeftTeams.length < 3;
        item.classList.toggle('selected', isSelected);
        item.classList.toggle('disabled', !isSelected && !canSelect);
    });
    
    // Update top team selector with validation against selected left items
    const topTeamItems = document.querySelectorAll('#topTeamsSelector .setup-item');
    topTeamItems.forEach(item => {
        const itemName = item.dataset.name;
        const isSelected = setupState.selectedTopTeams.includes(itemName);
        const canSelect = setupState.selectedTopTeams.length < 3;
        // Check if this top item has valid combinations with any selected left item
        let hasValidCombination = true;
        if (setupState.selectedLeftTeams.length > 0) {
            hasValidCombination = setupState.selectedLeftTeams.every(leftItem => {
                // Determine item types
                const leftIsTeam = constructors.includes(leftItem);
                const leftIsCountry = nationalities.includes(leftItem);
                const leftIsStatistic = Object.keys(statisticsCategories).includes(leftItem);
                const topIsTeam = constructors.includes(itemName);
                const topIsCountry = nationalities.includes(itemName);
                const topIsStatistic = Object.keys(statisticsCategories).includes(itemName);
                let matchingDrivers = [];
                if (leftIsTeam && topIsTeam) {
                    matchingDrivers = drivers.filter(driver =>
                        driver.constructors.includes(leftItem) &&
                        driver.constructors.includes(itemName)
                    );
                } else if (leftIsCountry && topIsTeam) {
                    matchingDrivers = drivers.filter(driver =>
                        driver.nationality === leftItem &&
                        driver.constructors.includes(itemName)
                    );
                } else if (leftIsTeam && topIsCountry) {
                    matchingDrivers = drivers.filter(driver =>
                        driver.constructors.includes(leftItem) &&
                        driver.nationality === itemName
                    );
                } else if (leftIsStatistic && topIsTeam) {
                    const statisticDrivers = statisticsCategories[leftItem];
                    matchingDrivers = drivers.filter(driver =>
                        statisticDrivers.includes(driver.name) &&
                        driver.constructors.includes(itemName)
                    );
                } else if (leftIsTeam && topIsStatistic) {
                    const statisticDrivers = statisticsCategories[itemName];
                    matchingDrivers = drivers.filter(driver =>
                        driver.constructors.includes(leftItem) &&
                        statisticDrivers.includes(driver.name)
                    );
                } else if (leftIsCountry && topIsStatistic) {
                    const statisticDrivers = statisticsCategories[itemName];
                    matchingDrivers = drivers.filter(driver =>
                        driver.nationality === leftItem &&
                        statisticDrivers.includes(driver.name)
                    );
                } else if (leftIsStatistic && topIsCountry) {
                    const statisticDrivers = statisticsCategories[leftItem];
                    matchingDrivers = drivers.filter(driver =>
                        statisticDrivers.includes(driver.name) &&
                        driver.nationality === itemName
                    );
                } else if (leftIsStatistic && topIsStatistic) {
                    const leftStatisticDrivers = statisticsCategories[leftItem];
                    const topStatisticDrivers = statisticsCategories[itemName];
                    matchingDrivers = drivers.filter(driver =>
                        leftStatisticDrivers.includes(driver.name) &&
                        topStatisticDrivers.includes(driver.name)
                    );
                } else if (leftIsCountry && topIsCountry) {
                    matchingDrivers = [];
                }
                return matchingDrivers.length > 0;
            });
        }
        item.classList.toggle('selected', isSelected);
        item.classList.toggle('disabled', (!isSelected && !canSelect) || !hasValidCombination);
    });
    
    // Update selected lists
    document.getElementById('selectedLeftTeamsList').textContent = setupState.selectedLeftTeams.join(', ') || 'None selected';
    document.querySelector('#selectedLeftTeams strong').textContent = `Selected Left Teams (${setupState.selectedLeftTeams.length}/3):`;
    
    document.getElementById('selectedTopTeamsList').textContent = setupState.selectedTopTeams.join(', ') || 'None selected';
    document.querySelector('#selectedTopTeams strong').textContent = `Selected Top Teams (${setupState.selectedTopTeams.length}/3):`;
    
    // Validate and update start button
    validateSelection();
}

function validateSelection() {
    const validationMsg = document.getElementById('validationMessage');
    const startBtn = document.getElementById('startGameBtn');
    
    if (setupState.selectedLeftTeams.length !== 3 || setupState.selectedTopTeams.length !== 3) {
        validationMsg.textContent = 'Select exactly 3 teams for each side.';
        validationMsg.style.color = '#f44336';
        startBtn.disabled = true;
        return;
    }
    
    // Check if all combinations have drivers (handling mixed teams and countries)
    let hasValidDrivers = true;
    let invalidCombinations = [];
    
    for (const leftItem of setupState.selectedLeftTeams) {
        for (const topItem of setupState.selectedTopTeams) {
            // Determine item types
            const leftIsTeam = constructors.includes(leftItem);
            const leftIsCountry = nationalities.includes(leftItem);
            const leftIsStatistic = Object.keys(statisticsCategories).includes(leftItem);
            const topIsTeam = constructors.includes(topItem);
            const topIsCountry = nationalities.includes(topItem);
            const topIsStatistic = Object.keys(statisticsCategories).includes(topItem);
            
            let matchingDrivers = [];
            
            if (leftIsTeam && topIsTeam) {
                // Team vs Team: drivers who raced for both teams
                matchingDrivers = drivers.filter(driver =>
                    driver.constructors.includes(leftItem) && 
                    driver.constructors.includes(topItem)
                );
            } else if (leftIsCountry && topIsTeam) {
                // Country vs Team: drivers from that nationality who raced for that team
                matchingDrivers = drivers.filter(driver =>
                    driver.nationality === leftItem && 
                    driver.constructors.includes(topItem)
                );
            } else if (leftIsTeam && topIsCountry) {
                // Team vs Country: drivers who raced for that team and are from that nationality
                matchingDrivers = drivers.filter(driver =>
                    driver.constructors.includes(leftItem) && 
                    driver.nationality === topItem
                );
            } else if (leftIsStatistic && topIsTeam) {
                // Statistic vs Team: drivers who meet the statistical criteria and raced for that team
                const statisticDrivers = statisticsCategories[leftItem];
                matchingDrivers = drivers.filter(driver =>
                    statisticDrivers.includes(driver.name) &&
                    driver.constructors.includes(topItem)
                );
            } else if (leftIsTeam && topIsStatistic) {
                // Team vs Statistic: drivers who raced for that team and meet the statistical criteria
                const statisticDrivers = statisticsCategories[topItem];
                matchingDrivers = drivers.filter(driver =>
                    driver.constructors.includes(leftItem) &&
                    statisticDrivers.includes(driver.name)
                );
            } else if (leftIsCountry && topIsStatistic) {
                // Country vs Statistic: drivers from that nationality who meet the statistical criteria
                const statisticDrivers = statisticsCategories[topItem];
                matchingDrivers = drivers.filter(driver =>
                    driver.nationality === leftItem &&
                    statisticDrivers.includes(driver.name)
                );
            } else if (leftIsStatistic && topIsCountry) {
                // Statistic vs Country: drivers who meet the statistical criteria and are from that nationality
                const statisticDrivers = statisticsCategories[leftItem];
                matchingDrivers = drivers.filter(driver =>
                    statisticDrivers.includes(driver.name) &&
                    driver.nationality === topItem
                );
            } else if (leftIsStatistic && topIsStatistic) {
                // Statistic vs Statistic: drivers who meet both statistical criteria
                const leftStatisticDrivers = statisticsCategories[leftItem];
                const topStatisticDrivers = statisticsCategories[topItem];
                matchingDrivers = drivers.filter(driver =>
                    leftStatisticDrivers.includes(driver.name) &&
                    topStatisticDrivers.includes(driver.name)
                );
            } else if (leftIsCountry && topIsCountry) {
                // Country vs Country: not valid (driver can't have two nationalities)
                matchingDrivers = [];
            }
            
            if (matchingDrivers.length === 0) {
                hasValidDrivers = false;
                invalidCombinations.push(`${leftItem} & ${topItem}`);
            }
        }
    }
    
    if (hasValidDrivers) {
        validationMsg.textContent = 'Selection is valid! All combinations have drivers.';
        validationMsg.style.color = '#4caf50';
        startBtn.disabled = false;
    } else {
        validationMsg.textContent = `Invalid selection: No drivers for combinations: ${invalidCombinations.slice(0, 3).join(', ')}${invalidCombinations.length > 3 ? '...' : ''}`;
        validationMsg.style.color = '#f44336';
        startBtn.disabled = true;
    }
}

// Event listeners for setup
document.getElementById('startGameBtn').addEventListener('click', () => {
    if (setupState.selectedLeftTeams.length === 3 && setupState.selectedTopTeams.length === 3) {
        initGame(setupState.selectedLeftTeams, setupState.selectedTopTeams);
    }
});

document.getElementById('randomSelectionBtn').addEventListener('click', () => {
    const container = document.getElementById('difficultySelectionContainer');
    container.style.display = container.style.display === 'none' ? 'flex' : 'none';
});
document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const difficulty = e.target.dataset.difficulty;
        generateRandomGameByDifficulty(difficulty);
    });
});

function generateRandomGameByDifficulty(difficulty) {
    const difficultyRanges = {
        easy: { min: 1, max: 2 },
        medium: { min: 3, max: 5 },
        hard: { min: 6, max: 8 },
        extreme: { min: 9, max: 10 }
    };
    const range = difficultyRanges[difficulty];
    if (!range) return;
    
    // Filter available items based on difficulty. Always include countries.
    const difficultyPool = setupState.availableItems.filter(item => {
        if (item.type === 'country') return true; // Always include all countries

        const itemDifficulty = item.difficulty;
        if (Array.isArray(itemDifficulty)) {
            // It's a range, check for overlap
            const [itemMin, itemMax] = itemDifficulty;
            return itemMin <= range.max && range.min <= itemMax;
        } else {
            // It's a single number
            return itemDifficulty >= range.min && itemDifficulty <= range.max;
        }
    });
    gameState.lastSelectedDifficulty = difficulty; // Remember the difficulty
    const combination = getValidCombinationFromPool(difficultyPool);
    if (combination) {
        initGame(combination.countries, combination.teams);
    }
}

document.getElementById('newGameBtn').addEventListener('click', () => {
    initSetup();
});

// Add search functionality
document.getElementById('leftTeamSearch').addEventListener('input', (e) => {
    generateLeftTeamSelector(e.target.value);
    updateSetupDisplay();
});

document.getElementById('topTeamSearch').addEventListener('input', (e) => {
    generateTopTeamSelector(e.target.value);
    updateSetupDisplay();
});

// Initialize the setup screen
initSetup();
updateWinTracker();
