const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
// TODO: Add logging afterwards to signal failure, add trycatch
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.post("/initiate-tables", async (req, res) => {
    const initiateResult = await appService.initiateAllTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-default-vals", async (req, res) => {
    const insertRes = await appService.insertDefaultValue();
    if (insertRes) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false});
    }
})

router.post("/insert-character-card", async (req, res) => {
    const { cid, price, cName, pid } = req.body;
    console.log(cid, price, cName, pid);
    const insertResult = await appService.insertCharacterCard(parseInt(cid, 10), parseInt(price, 10), cName, parseInt(pid, 10));
    if (insertResult.success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, message: "ERROR: Given Character Card ID already exists, or given Character Name does not exist, or given Player ID does not exist. Insert unsuccessful."});
    }
});

router.post("/update-character", async (req, res) => {
    const { cName, newSpeed, newAgility } = req.body;
    const updateResult = await appService.updateCharacter(cName, newSpeed, newAgility);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, message : `ERROR: Cannot find character with character name ${cName}, and make sure to enter numbers for speed and agility.` });
    }
});

router.post("/update-talent", async (req, res) => {
    const { taid, dr, v, de, s, pid } = req.body;
    const updateResult = await appService.updateTalent(taid, dr, v, de, s, pid);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, message: "ERROR: Did not find talent or player with given IDs." });
    }
});

router.post("/delete-player", async (req, res) => {
    const { pid } = req.body;
    const delResult = await appService.deletePlayer(pid);
    if (delResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/select-player", async (req, res) => {
    const { pid } = req.query;
    const selectResult = await appService.selectPlayer(pid);
    if (selectResult && selectResult.length > 0) {
        res.json({
            success: true,
            data: selectResult.map(row => ({
                pid: row[0],
                pName: row[1],
                hunterRank: row[2],
                survRank: row[3]
            }))
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/proj-speed", async (req, res) => {
    const projResult = await appService.ProjectionCharacterStat("speed");
    if (projResult && projResult.length > 0) {
        res.json({
            success: true,
            data: projResult.map(row => ({
                cName: row[0],
                speed: row[1]
            }))
        });
    } else if (projResult) {
        res.status(404).json({ success: false})
    }
    else {
        res.status(500).json({ success: false });
    }
});

router.get("/proj-agility", async (req, res) => {
    const projResult = await appService.ProjectionCharacterStat("agility");
    if (projResult && projResult.length > 0) {
        res.json({
            success: true,
            data: projResult.map(row => ({
                cName: row[0],
                agility: row[1]
            }))
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/join-team", async (req, res) => {
    const { teid } = req.query;
    const joinResult = await appService.joinTeamPlayer(teid);
    if (joinResult && joinResult.length > 0) {
        res.json({
            success: true,
            data: joinResult.map(row => ({
                pid: row[0],
                pName: row[1],
                teid: row[2],
                tName: row[3],
                teamRank: row[4],
                tMemberNum: row[5]
            }))
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/join-guild", async (req, res) => {
    const { gid } = req.query;
    const joinResult = await appService.joinGuildPlayer(gid);
    if (joinResult && joinResult.length > 0) {
        res.json({
            success: true,
            data: joinResult.map(row => ({
                pid: row[0],
                pName: row[1],
                gid: row[2],
                gName: row[3],
                gLevel: row[4],
                gMemberNum: row[5],
                gPoints: row[6]
            }))
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/join-server", async (req, res) => {
    const { sid } = req.query;
    const joinResult = await appService.joinServerPlayer(sid);
    if (joinResult && joinResult.length > 0) {
        res.json({
            success: true,
            data: joinResult.map(row => ({
                pid: row[0],
                pName: row[1],
                sid: row[2],
                country: row[3]
            }))
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/join-hunter", async (req, res) => {
    const joinResult = await appService.joinHunter();
    if (joinResult && joinResult.length > 0) {
        res.json({
            success: true,
            data: joinResult.map(row => ({
                cName: row[0],
                codeName: row[1],
                speed: row[2],
                agility: row[3],
                ability: row[4],
                damage: row[5]
            }))
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/join-survivor", async (req, res) => {
    const joinResult = await appService.joinSurvivor();
    if (joinResult && joinResult.length > 0) {
        res.json({
            success: true,
            data: joinResult.map(row => ({
                cName: row[0],
                employment: row[1],
                speed: row[2],
                agility: row[3],
                skill: row[4],
                decode: row[5]
            }))
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/get-max-stat-survivor", async (req, res) => {
    const { stat } = req.query;
    const result = await appService.maxStatForSurvivor(stat);
    if (result && result.length > 0) {
        res.json({
            success: true,
            reqStat: stat,
            val: result[0]
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/get-max-stat-hunter", async (req, res) => {
    const { stat } = req.query;
    const result = await appService.maxStatForHunter(stat);
    if (result && result.length > 0) {
        res.json({
            success: true,
            reqStat: stat,
            val: result
        });
    } else {
        res.status(404).json({ success: false });
    }
});

router.get("/get-max-rank-hunter", async (req, res) => {
    const result = await appService.findMaxHunterRankInServer();
    if (result && result.length > 0) {
        res.json({
            success: true,
            data: result.map(row => ({
                sid: row[0],
                hunterRank: row[1]
            }))
        });
    } else if (result = -1) {
        res.status(404).json({
            success: false,
            message: "No valid data!"
        })
    
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/get-max-rank-survivor", async (req, res) => {
    const result = await appService.findMaxSurvRankInServer();
    if (result && result.length > 0) {
        res.json({
            success: true,
            data: result
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/avg-survivor-rank", async (req, res) => {
    const { sid } = req.query;
    const result = await appService.avgSurvRankInServer(sid);
    if (result && result.length > 0) {
        res.json({
            success: true,
            data: result[0]
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/avg-hunter-rank", async (req, res) => {
    const { sid } = req.query;
    const result = await appService.avgHunterRankInServer(sid);
    if (result && result.length > 0) {
        res.json({
            success: true,
            data: result[0]
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/guild-with-max-avg-hunter-rank", async (req, res) => {
    const result = await appService.selectGuildWithMaxAvgHunterRank();
    if (result && result.length > 0) {
        res.json({
            success: true,
            data: result
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/guild-with-max-avg-surv-rank", async (req, res) => {
    const result = await appService.selectGuildWithMaxAvgSurvRank();
    if (result && result.length > 0) {
        res.json({
            success: true,
            data: result
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/get-players-all-char", async (req, res) => {
    const result = await appService.selectPlayerWithAllChar();
    if (result && result.length > 0) {
        res.json({
            success: true,
            data: result.map(row => ({
                pName: row[0],
                pid: row[1]
            }))
        });
    } else if (result == -1) {
        res.status(404).json({ success: false, 
                                message: "No player has all characters!"
                            })
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/show-hunter-talents", async (req, res) => {
    const joinResult = await appService.showHunterTalents();
    if (joinResult && joinResult.length > 0) {
        res.json({
            success: true,
            data: joinResult.map(row => ({
                taid: row[0],
                dread: row[1],
                vigilance: row[2],
                deceit: row[3],
                strength: row[4],
                totalPoints: row[5],
                pid: row[6]
            }))
        });
    } else if (joinResult == -1) {
        res.status(404).json({ success: false, 
                                message: "No talents exist!"
                            })
    } else {
        res.status(500).json({ success: false });
    }
});

module.exports = router;