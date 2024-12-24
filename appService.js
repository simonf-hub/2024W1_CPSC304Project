const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error("Failed to initialize connection pool:", err);
        throw err;
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error("Error closing connection pool:", err);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error("Error during DB operation:", err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateGuildTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Guild CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Guild table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Guild (
                gid NUMBER PRIMARY KEY,
                gName VARCHAR2(20) NOT NULL,
                gLevel NUMBER NOT NULL,
                gMemberNum NUMBER NOT NULL,
                points NUMBER NOT NULL
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateTeamTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Team CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Team table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Team (
                teid NUMBER PRIMARY KEY,
                tName VARCHAR2(20) NOT NULL,
                teamRank NUMBER NOT NULL,
                tMemberNum NUMBER NOT NULL
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateServerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Server CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Server table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Server (
                sid NUMBER PRIMARY KEY,
                country VARCHAR2(20) NOT NULL
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiatePlayerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Player CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Player table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Player (
                pid NUMBER PRIMARY KEY,
                pName VARCHAR2(20) NOT NULL,
                exp NUMBER NOT NULL,
                survRank NUMBER NOT NULL,
                hunterRank NUMBER NOT NULL,
                currency NUMBER NOT NULL,
                sid NUMBER NOT NULL,
                gid NUMBER,
                teid NUMBER,
                FOREIGN KEY (sid) REFERENCES Server(sid) ON DELETE CASCADE,
                FOREIGN KEY (gid) REFERENCES Guild(gid) ON DELETE CASCADE,
                FOREIGN KEY (teid) REFERENCES Team(teid) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// Checked
async function initiateCharacterTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Character CASCADE CONSTRAINTS`);
        } catch(err) {
            console.log('Character table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Character (
                cName VARCHAR2(20) PRIMARY KEY,
                speed NUMBER NOT NULL,
                agility NUMBER NOT NULL
            )
        `);
        return true; //console.log('Character table created successfully.');
    }).catch(() => {
        return false; //console.error('Error in creating Character table: ' + err.message);
    });
}

// Checked
async function initiateSurvivorStatsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE SurvivorStats CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('SurvivorStats table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE SurvivorStats (
                employment VARCHAR2(20) PRIMARY KEY,
                decode NUMBER NOT NULL,
                skill VARCHAR2(20) NOT NULL
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// Checked
async function initiateSurvivorTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Survivor CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Survivor table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Survivor (
                cName VARCHAR2(20) PRIMARY KEY,
                employment VARCHAR2(20) NOT NULL,
                FOREIGN KEY (cName) REFERENCES Character(cName) ON DELETE CASCADE,
                FOREIGN KEY (employment) REFERENCES SurvivorStats(employment) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// Checked
async function initiateHunterStatsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE HunterStats CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('HunterStats table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE HunterStats (
                codeName VARCHAR2(20) PRIMARY KEY,
                damage NUMBER NOT NULL,
                ability VARCHAR2(20) NOT NULL
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// Checked
async function initiateHunterTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Hunter CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Hunter table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Hunter (
                cName VARCHAR2(20) PRIMARY KEY,
                codeName VARCHAR2(20) NOT NULL,
                FOREIGN KEY (cName) REFERENCES Character(cName) ON DELETE CASCADE,
                FOREIGN KEY (codeName) REFERENCES HunterStats(codeName) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// failure to create...
async function initiateCharacterCardTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE CharacterCard CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('CharacterCard table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE CharacterCard (
                cid NUMBER PRIMARY KEY,
                price NUMBER NOT NULL,
                cName VARCHAR2(20) NOT NULL,
                pid NUMBER NOT NULL,
                FOREIGN KEY (cName) REFERENCES Character(cName) ON DELETE CASCADE,
                FOREIGN KEY (pid) REFERENCES Player(pid) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateTalentTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Talent CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Talent table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Talent (
                taid NUMBER PRIMARY KEY,
                totalPoints NUMBER NOT NULL CHECK (totalPoints <= 120),
                pid NUMBER NOT NULL,
                FOREIGN KEY (pid) REFERENCES Player(pid) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateHunterTalentTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE HunterTalent CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('HunterTalent table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE HunterTalent (
                taid NUMBER PRIMARY KEY,
                dread NUMBER DEFAULT 0 CHECK (dread <= 40),
                vigilance NUMBER DEFAULT 0 CHECK (vigilance <= 40),
                deceit NUMBER DEFAULT 0 CHECK (deceit <= 40),
                strength NUMBER DEFAULT 0 CHECK (strength <= 40),
                FOREIGN KEY (taid) REFERENCES Talent(taid) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateSurvivorTalentTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE SurvivorTalent CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('SurvivorTalent table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE SurvivorTalent (
                taid NUMBER PRIMARY KEY,
                friendliness NUMBER DEFAULT 0 CHECK (friendliness <= 40),
                bravery NUMBER DEFAULT 0 CHECK (bravery <= 40),
                tranquility NUMBER DEFAULT 0 CHECK (tranquility <= 40),
                persistence NUMBER DEFAULT 0 CHECK (persistence <= 40),
                FOREIGN KEY (taid) REFERENCES Talent(taid) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateSurvivorMatchTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE SurvivorMatch CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('SurvivorMatch table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE SurvivorMatch (
                cName VARCHAR2(20),
                taid NUMBER NOT NULL,
                PRIMARY KEY (cName, taid),
                FOREIGN KEY (cName) REFERENCES Character(cName) ON DELETE CASCADE,
                FOREIGN KEY (taid) REFERENCES Talent(taid) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// checked
async function initiateHunterMatchTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE HunterMatch CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('HunterMatch table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE HunterMatch (
                cName VARCHAR2(20) NOT NULL,
                taid NUMBER NOT NULL,
                PRIMARY KEY (cName, taid),
                FOREIGN KEY (cName) REFERENCES Character(cName) ON DELETE CASCADE,
                FOREIGN KEY (taid) REFERENCES Talent(taid) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// single function to initiate all tables
async function initiateAllTables() {
    const tableInitFunctions = [
        initiateGuildTable,
        initiateTeamTable,
        initiateServerTable,
        initiatePlayerTable,
        initiateCharacterTable,
        initiateSurvivorStatsTable,
        initiateSurvivorTable,
        initiateHunterStatsTable,
        initiateHunterTable,
        initiateCharacterCardTable,
        initiateTalentTable,
        initiateHunterTalentTable,
        initiateSurvivorTalentTable,
        initiateSurvivorMatchTable,
        initiateHunterMatchTable
    ];

    try {
        for (const initFunc of tableInitFunctions) {
            const result = await initFunc();
            if (!result) {
                console.error(`Failed to initialize table: ${initFunc.name}`);
            }
        }
        return true;
    } catch (err) {
        console.error("Error initializing all tables:", err.message);
        return false;
    }
}

// Insert Statements
async function insertDefaultValue() {
    const sqlStatements = [
        `insert into Character values ('Freddy Riley', 263, 73)`,
        `insert into Character values ('Emily Dyer', 263, 73)`,
        `insert into Character values ('Kreacher Pierson', 263, 73)`,
        `insert into Character values ('Emma Woods', 263, 73)`,
        `insert into Character values ('Tracy Reznik', 263, 86)`,
        `insert into Character values ('Jeffrey Bonavita', 212, 38)`,
        `insert into Character values ('Leo', 216, 35)`,
        `insert into Character values ('Joker', 219, 25)`,
        `insert into Character values ('Grace', 216, 27)`,
        `insert into Character values ('Ivy', 216, 35)`,
        `insert into SurvivorStats values ('Lawyer', 70, 'Foresight')`,
        `insert into SurvivorStats values ('Doctor', 81, 'Med Master')`,
        `insert into SurvivorStats values ('Thief', 81, 'Cunning')`,
        `insert into SurvivorStats values ('Gardener', 81, 'Ingenuity')`,
        `insert into SurvivorStats values ('Mechanic', 74, 'Operator')`,
        `insert into Survivor values ('Freddy Riley', 'Lawyer')`,
        `insert into Survivor values ('Emily Dyer', 'Doctor')`,
        `insert into Survivor values ('Kreacher Pierson', 'Thief')`,
        `insert into Survivor values ('Emma Woods', 'Gardener')`,
        `insert into Survivor values ('Tracy Reznik', 'Mechanic')`,
        `insert into HunterStats values ('Goatman', 25, 'Shackled')`,
        `insert into HunterStats values ('Hell Ember', 50, 'Infernal Soul')`,
        `insert into HunterStats values ('Smiley Face', 50, 'Rocket Modification')`,
        `insert into HunterStats values ('Naiad', 50, 'Darkest Depths')`,
        `insert into HunterStats values ('The Shadow', 50, 'Phantasm')`,
        `insert into Hunter values ('Jeffrey Bonavita', 'Goatman')`,
        `insert into Hunter values ('Leo', 'Hell Ember')`,
        `insert into Hunter values ('Joker', 'Smiley Face')`,
        `insert into Hunter values ('Grace', 'Naiad')`,
        `insert into Hunter values ('Ivy', 'The Shadow')`,
        `insert into Guild values (1, 'GuildOne', 5, 1, 500)`,
        `insert into Guild values (2, 'GuildTwo', 4, 1, 400)`,
        `insert into Guild values (3, 'GuildThree', 6, 2, 600)`,
        `insert into Guild values (4, 'GuildFour', 7, 1, 700)`,
        `insert into Guild values (5, 'GuildFive', 3, 1, 300)`,
        `insert into Team values (1, 'TeamOne', 1, 1)`,
        `insert into Team values (2, 'TeamTwo', 2, 1)`,
        `insert into Team values (3, 'TeamThree', 3, 1)`,
        `insert into Team values (4, 'TeamFour', 4, 1)`,
        `insert into Team values (5, 'TeamFive', 5, 2)`,
        `insert into Server values (1, 'USA')`,
        `insert into Server values (2, 'Canada')`,
        `insert into Server values (3, 'Japan')`,
        `insert into Server values (4, 'Korea')`,
        `insert into Server values (5, 'Germany')`,
        `insert into Player values (1001, 'Lucia', 10, 7, 7, 1000, 1, 1, 1)`,
        `insert into Player values (1002, 'Simon', 98, 1, 1, 1500, 2, 2, 2)`,
        `insert into Player values (1003, 'Akira', 50, 1, 1, 800, 3, 3, 3)`,
        `insert into Player values (1004, 'Amy', 130, 5, 6, 2000, 4, 4, 4)`,
        `insert into Player values (1005, 'Casey', 140, 4, 3, 2500, 5, 5, 5)`,
        `insert into Player values (1006, 'Nancy', 200, 6, 7, 3000, 1, 3, 5)`,
        `insert into Player values (1007, 'Fiona', 100, 2, 6, 1020, 1, 1, 1)`,
        `insert into Player values (1008, 'Sabrina', 80, 4, 3, 2300, 1, 1, 2)`,
        `insert into Player values (1009, 'Jakey', 190, 2, 1, 600, 1, 1, 2)`,
        `insert into Player values (1010, 'Lily', 195, 3, 2, 60, 1, 2, 3)`,
        `insert into Player values (1011, 'Lance', 105, 3, 5, 188, 1, 2, 3)`,
        `insert into Player values (1012, 'Sean', 200, 5, 6, 365, 1, 2, 1)`,
        `insert into CharacterCard values (1, 488, 'Emily Dyer', 1001)`,
        `insert into CharacterCard values (2, 488, 'Freddy Riley', 1001)`,
        `insert into CharacterCard values (3, 688, 'Jeffrey Bonavita', 1001)`,
        `insert into CharacterCard values (4, 688, 'Grace', 1001)`,
        `insert into CharacterCard values (5, 688, 'Joker', 1001)`,
        `insert into CharacterCard values (6, 688, 'Leo', 1001)`,
        `insert into CharacterCard values (7, 688, 'Ivy', 1001)`,
        `insert into CharacterCard values (8, 488, 'Kreacher Pierson', 1001)`,
        `insert into CharacterCard values (9, 488, 'Tracy Reznik', 1001)`,
        `insert into CharacterCard values (10, 488, 'Emma Woods', 1001)`,
        `insert into CharacterCard values (11, 688, 'Grace', 1002)`,
        `insert into CharacterCard values (12, 488, 'Tracy Reznik', 1005)`,
        `insert into CharacterCard values (13, 488, 'Emily Dyer', 1003)`,
        `insert into CharacterCard values (14, 488, 'Freddy Riley', 1003)`,
        `insert into CharacterCard values (15, 688, 'Jeffrey Bonavita', 1003)`,
        `insert into CharacterCard values (16, 688, 'Grace', 1003)`,
        `insert into CharacterCard values (17, 688, 'Joker', 1003)`,
        `insert into CharacterCard values (18, 688, 'Leo', 1003)`,
        `insert into CharacterCard values (19, 688, 'Ivy', 1003)`,
        `insert into CharacterCard values (20, 488, 'Kreacher Pierson', 1003)`,
        `insert into CharacterCard values (21, 488, 'Tracy Reznik', 1003)`,
        `insert into CharacterCard values (22, 488, 'Emma Woods', 1003)`,        
        `insert into Talent values (1, 90, 1001)`,
        `insert into Talent values (2, 120, 1002)`,
        `insert into Talent values (3, 120, 1003)`,
        `insert into Talent values (4, 120, 1004)`,
        `insert into Talent values (5, 120, 1005)`,
        `insert into Talent values (6, 90, 1001)`,
        `insert into Talent values (7, 120, 1002)`,
        `insert into Talent values (8, 120, 1003)`,
        `insert into Talent values (9, 120, 1004)`,
        `insert into Talent values (10, 120, 1005)`,
        `insert into HunterTalent values (1, 30, 30, 0, 30)`,
        `insert into HunterTalent values (2, 40, 40, 0, 40)`,
        `insert into HunterTalent values (3, 10, 30, 40, 40)`,
        `insert into HunterTalent values (4, 30, 30, 30, 30)`,
        `insert into HunterTalent values (5, 15, 25, 40, 40)`,
        `insert into SurvivorTalent values (6, 30, 10, 20, 30)`,
        `insert into SurvivorTalent values (7, 20, 20, 40, 40)`,
        `insert into SurvivorTalent values (8, 40, 40, 40, 0)`,
        `insert into SurvivorTalent values (9, 25, 25, 35, 35)`,
        `insert into SurvivorTalent values (10, 10, 30, 40, 40)`,
        `insert into SurvivorMatch values ('Freddy Riley', 1)`,
        `insert into SurvivorMatch values ('Freddy Riley', 2)`,
        `insert into SurvivorMatch values ('Emily Dyer', 3)`,
        `insert into SurvivorMatch values ('Emily Dyer', 4)`,
        `insert into SurvivorMatch values ('Kreacher Pierson', 5)`,
        `insert into HunterMatch values ('Jeffrey Bonavita', 6)`,
        `insert into HunterMatch values ('Leo', 7)`,
        `insert into HunterMatch values ('Joker', 8)`,
        `insert into HunterMatch values ('Grace', 9)`,
        `insert into HunterMatch values ('Ivy', 10)`
    ];

    try {
        await withOracleDB(async (connection) => {
            for (const sql of sqlStatements) {
                await connection.execute(sql);
            }
            await connection.commit();
        });

        console.log('Default values inserted successfully.');
    } catch (err) {
        console.error('Error inserting default values:', err.message);
    }
}


// Written Queris
// checked
async function insertCharacterCard(cid, price, cName, pid) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `INSERT INTO CharacterCard (cid, price, cName, pid) VALUES (:cid, :price, :cName, :pid)`,
                [ cid, price, cName, pid ], // Named binding for clarity
                { autoCommit: true }
            );

            return {
                success: result.rowsAffected > 0,
                rowsAffected: result.rowsAffected,
            };
        });
    } catch (err) {
        console.error(`Error inserting into CharacterCard table: ${err.message}`);
        return {
            success: false,
            error: err.message,
        };
    }
}


// checked
async function updateCharacter(cName, newSpeed, newAgility) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Character SET speed = :newSpeed, agility = :newAgility WHERE cName = :cName`,
            [newSpeed, newAgility, cName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false; //console.error(`Error updating Character table: ${err.message}`);
    });
}

async function updateTalent(taid, dr, v, de, s, pid) {
    return await withOracleDB(async (connection) => {
        try {
            // check if new pid exists
            const pidCheck = await connection.execute(
                `SELECT COUNT(*) AS count FROM Player WHERE pid = :pid`,
                [pid]
            );

            const pidExists = pidCheck.rows[0].length > 0;

            if (!pidExists) {
                console.error("The specified Player does not exist in our records");
                return false;
            }

            // update if pid exists
            const TalentResult = await connection.execute(
                `UPDATE Talent 
                 SET totalPoints = :tp, pid = :pid 
                 WHERE taid = :taid`,
                [parseInt(dr) + parseInt(v) + parseInt(de) + parseInt(s), pid, taid],
                { autoCommit: true }
            );

            const HTresult = await connection.execute(
                `UPDATE HunterTalent 
                 SET dread = :dr, vigilance = :v, deceit = :de, strength = :s
                 WHERE taid = :taid`,
                [dr, v, de, s, taid],
                { autoCommit: true }
            );

            return TalentResult.rowsAffected && TalentResult.rowsAffected > 0 && HTresult.rowsAffected && HTresult.rowsAffected > 0;
        } catch (err) {
            console.error(`Error updating Talent details: ${err.message}`);
            return false;
        }
    });
}

// checked
async function deletePlayer(pid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Player WHERE pid = :pid`,
            [pid],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// checked
async function selectPlayer(pid) {
    return await withOracleDB(async (connection) => {
        try {
            const query = `
                SELECT pid, pName, hunterRank, survRank
                FROM Player
                WHERE pid = :pid
            `;

            const result = await connection.execute(query, { pid });

            if (result.rows.length === 0) {
                console.log(`No player found with pid: ${pid}`);
                return null; // Return null if no matching player is found
            }

            console.log(result);
            return result.rows;
        } catch (err) {
            console.error('Error executing selectPlayer query:', err.message);
            throw err; 
        }
    }).catch((err) => {
        console.error('Database operation failed:', err.message);
        return null; 
    });
}

async function showHunterTalents() {
    return await withOracleDB(async (connection) => {
        try {
            const query = `
                SELECT *
                FROM HunterTalent
                NATURAL JOIN Talent
            `;

            const result = await connection.execute(query);

            if (result.rows.length === 0) {
                console.log(`No talents exist`);
                return null; // Return null if no matching player is found
            }
            console.log(result.rows);
            return result.rows;
        } catch (err) {
            console.error('Error extracting hunter talents:', err.message);
            throw err; 
        }
    }).catch((err) => {
        console.error('Database operation failed:', err.message);
        return null; 
    });
}


// checked
async function ProjectionCharacterStat(stat) {
    const allowedColumns = ['speed', 'agility']; // Replace with valid column names
    if (!allowedColumns.includes(stat)) {
        throw new Error('Invalid stat parameter'); // Prevent SQL injection
    }

    return await withOracleDB(async (connection) => {
        const query = `
            SELECT cName, ${stat} FROM Character
        `;

        const result = await connection.execute(query);
        if (result.rows.length === 0) {
            console.log("No data found");
            return null; // No data found
        }
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// checked
async function joinTeamPlayer(teid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT p.pid, p.pName, t.teid, t.tName, t.teamRank, t.tMemberNum
             FROM Player p
             LEFT JOIN Team t ON p.teid = t.teid
             WHERE :teid = t.teid`,
             { teid }
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// checked
async function joinGuildPlayer(gid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT player.pid, player.pName, guild.gid, guild.gName, guild.gLevel, guild.gMemberNum, guild.points
             FROM player
             LEFT JOIN guild ON player.gid = guild.gid
             WHERE guild.gid = :gid`,
             { gid }
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// checked
async function joinServerPlayer(sid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT player.pid, player.pName, server.sid, server.country
             FROM player
             JOIN server ON player.sid = server.sid
             WHERE :sid = server.sid`,
             { sid }
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// checked
async function joinHunter() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT cName, codeName, speed, agility, ability, damage
             FROM Hunter
             NATURAL JOIN Character
             NATURAL JOIN HunterStats`
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// checked
async function joinSurvivor() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT cName, employment, speed, agility, skill, decode
             FROM Survivor
             NATURAL JOIN Character
             NATURAL JOIN SurvivorStats`
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// stat is either decode OR speed OR agility
async function maxStatForSurvivor(stat) {
    const allowedColumns = ['decode', 'speed', 'agility']; // Replace with valid column names
    if (!allowedColumns.includes(stat)) {
        throw new Error('Invalid stat parameter'); // Prevent SQL injection
    }

    return await withOracleDB(async (connection) => {
        const query = `
            SELECT MAX(${stat}) AS max_stat
            FROM Survivor
            NATURAL JOIN Character
            NATURAL JOIN SurvivorStats
        `;

        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// stat is either damage OR speed OR agility
async function maxStatForHunter(stat) {
    const allowedColumns = ['damage', 'speed', 'agility']; // Replace with valid column names
    if (!allowedColumns.includes(stat)) {
        throw new Error('Invalid stat parameter'); // Prevent SQL injection
    }

    return await withOracleDB(async (connection) => {
        const query = `
            SELECT MAX(${stat}) AS max_stat
            FROM Hunter
            NATURAL JOIN Character
            NATURAL JOIN HunterStats
        `;

        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return null;
    });
}


// checked
async function findMaxHunterRankInServer() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT sid, MAX(hunterRank)
            FROM Player
            NATURAL JOIN Server
            GROUP BY sid`
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}

// checked
async function findMaxSurvRankInServer() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT MAX(survRank)
            FROM Player
            NATURAL JOIN Server
            GROUP BY sid`
        );
        return result.rows.map(row => row[0]);
    }).catch(() => {
        return null;
    });
}

// checked
async function avgSurvRankInServer(sid) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT sid, AVG(survRank) AS avg_surv_rank
            FROM Player
            NATURAL JOIN Server
            GROUP BY sid
            HAVING sid = :sid
        `;
        const result = await connection.execute(query, { sid });
        return result.rows;
    }).catch((err) => {
        console.error('Error finding average Survivor Rank:', err.message);
        return null;
    });
}

// checked
async function avgHunterRankInServer(sid) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT sid, AVG(hunterRank) AS avg_hunter_rank
            FROM Player
            NATURAL JOIN Server
            GROUP BY sid
            HAVING sid = :sid
        `;
        const result = await connection.execute(query, { sid });
        return result.rows; 
    }).catch((err) => {
        console.error('Error finding average Hunter Rank:', err.message);
        return null;
    });
}

// checked
async function selectGuildWithMaxAvgHunterRank() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT gName
            FROM Guild
            NATURAL JOIN Player
            GROUP BY gName, gid
            HAVING AVG(hunterRank) >= ALL (SELECT AVG(hunterRank)
                                    FROM Guild
                                    NATURAL JOIN Player
                                    GROUP BY gid)`
        );
        return result.rows.map(row => row[0]);
    }).catch(() => {
        return null;
    });
}

// checked
async function selectGuildWithMaxAvgSurvRank() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT gName
            FROM Guild
            NATURAL JOIN Player
            GROUP BY gName, gid
            HAVING AVG(survRank) >= ALL (SELECT AVG(survRank)
                                    FROM Guild
                                    NATURAL JOIN Player
                                    GROUP BY gid)`
        );
        return result.rows.map(row => row[0]);
    }).catch(() => {
        return null;
    });
}

// checked
async function selectPlayerWithAllChar() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT P.pName, P.pid
            FROM Player P
            WHERE NOT EXISTS (SELECT C.cName
                            FROM Character C
                            WHERE NOT EXISTS (SELECT CC.pid
                                            FROM CharacterCard CC
                                            WHERE C.cname = CC.cname
                                            AND CC.pid = P.pid))`
        );

        return result.rows;
    }).catch(() => {
        return null;
    });
}



module.exports = {
    testOracleConnection,
    initiateAllTables,
    insertCharacterCard,
    updateCharacter,
    deletePlayer,
    selectPlayer,
    ProjectionCharacterStat,
    joinTeamPlayer,
    joinGuildPlayer,
    joinServerPlayer,
    joinHunter,
    joinSurvivor,
    maxStatForSurvivor,
    maxStatForHunter,
    findMaxHunterRankInServer,
    findMaxSurvRankInServer,
    avgSurvRankInServer,
    avgHunterRankInServer,
    selectGuildWithMaxAvgHunterRank,
    selectGuildWithMaxAvgSurvRank,
    selectPlayerWithAllChar,
    insertDefaultValue,
    updateTalent,
    showHunterTalents
};