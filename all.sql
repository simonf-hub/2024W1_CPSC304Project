--
-- 	Database Table Creation
--

-- SET FOREIGN_KEY_CHECKS=0;

DROP TABLE Character CASCADE CONSTRAINTS;
DROP TABLE SurvivorStats CASCADE CONSTRAINTS;
DROP TABLE Survivor CASCADE CONSTRAINTS;
DROP TABLE HunterStats CASCADE CONSTRAINTS;
DROP TABLE Hunter CASCADE CONSTRAINTS;
DROP TABLE CharacterCard CASCADE CONSTRAINTS;
DROP TABLE Guild CASCADE CONSTRAINTS;
DROP TABLE Team CASCADE CONSTRAINTS;
DROP TABLE Server CASCADE CONSTRAINTS;
DROP TABLE Player CASCADE CONSTRAINTS;
DROP TABLE Talent CASCADE CONSTRAINTS;
DROP TABLE HunterTalent CASCADE CONSTRAINTS;
DROP TABLE SurvivorTalent CASCADE CONSTRAINTS;
DROP TABLE SurvivorMatch CASCADE CONSTRAINTS;
DROP TABLE HunterMatch CASCADE CONSTRAINTS;


--
-- Now, add each table.
--
create table Character(
	cName varchar(20) primary key,
	speed int not null,
    agility int not null
);

create table SurvivorStats (
    employment varchar(20) primary key,
    decode int not null,
    skill varchar(20) not null
);

create table Survivor (
    cName varchar(20) primary key,
    employment varchar(20) not null,
    foreign key (cName) references Character(cName) on delete cascade,
    foreign key (employment) references SurvivorStats(employment) on delete cascade
);

create table HunterStats (
    codeName varchar(20) primary key,
    damage int not null,
    ability varchar(20) not null
);

create table Hunter (
    cName varchar(20) primary key,
    codeName varchar(20) not null,
    foreign key (cName) references Character(cName) on delete cascade,
    foreign key (codeName) references HunterStats(codeName) on delete cascade
);


create table Guild (
    gid int primary key,
    gName varchar(20) not null,
    gLevel int not null,
    gMemberNum int not null,
    points int not null
);

create table Team (
    teid int primary key,
    tName varchar(20) not null,
    teamRank int not null,
    tMemberNum int not null
);

create table Server (
    sid int primary key,
    country varchar(20) not null
);

create table Player (
    pid int primary key,
    pName varchar(20) not null,
    exp int not null,
    survRank int not null,
    hunterRank int not null,
    currency int not null,
    sid int not null,
    gid int,
    teid int,
    foreign key (sid) references Server(sid) on delete cascade,
    foreign key (gid) references Guild(gid) on delete cascade,
    foreign key (teid) references Team(teid) on delete cascade
);

create table CharacterCard (
    cid int primary key,
    price int not null,
    cName varchar(20) not null,
    pid int not null,
    foreign key (cName) references Character(cName) on delete cascade,
    foreign key (pid) references Player(pid) on delete cascade
);


create table Talent (
    taid int primary key,
    totalPoints int not null check (totalPoints <= 120),
    pid int not null,
    foreign key (pid) references Player(pid) on delete cascade
);

create table HunterTalent (
    taid int primary key,
    dread int default 0 check (dread <= 40),
    vigilance int default 0 check (vigilance <= 40),
    deceit int default 0 check (deceit <= 40),
    strength int default 0 check (strength <= 40),
    foreign key (taid) references Talent(taid) on delete cascade
);

create table SurvivorTalent (
    taid int primary key,
    friendliness int default 0 check (friendliness <= 40),
    bravery int default 0 check (bravery <= 40),
    tranquility int default 0 check (tranquility <= 40),
    persistence int default 0 check (persistence <= 40),
    foreign key (taid) references Talent(taid) on delete cascade
);

create table SurvivorMatch (
    cName varchar(20),
    taid int not null,
    primary key (cName, taid),
    foreign key (cName) references Character(cName) on delete cascade,
    foreign key (taid) references Talent(taid) on delete cascade
);

create table HunterMatch (
    cName varchar(20),
    taid int not null,
    primary key (cName, taid),
    foreign key (cName) references Character(cName) on delete cascade,
    foreign key (taid) references Talent(taid) on delete cascade
);

--
-- done adding all of the tables, now add in some tuples
--
insert into Character values ('Freddy Riley', 263, 73);
insert into Character values ('Emily Dyer', 263, 73);
insert into Character values ('Kreacher Pierson', 263, 73);
insert into Character values ('Emma Woods', 263, 73);
insert into Character values ('Tracy Reznik', 263, 86);
insert into Character values ('Jeffrey Bonavita', 212, 38);
insert into Character values ('Leo', 216, 35);
insert into Character values ('Joker', 219, 25);
insert into Character values ('Grace', 216, 27);
insert into Character values ('Ivy', 216, 35);

insert into SurvivorStats values ('Lawyer', 70, 'Foresight');
insert into SurvivorStats values ('Doctor', 81, 'Med Master');
insert into SurvivorStats values ('Thief', 81, 'Cunning');
insert into SurvivorStats values ('Gardener', 81, 'Ingenuity');
insert into SurvivorStats values ('Mechanic', 74, 'Operator');

insert into Survivor values ('Freddy Riley', 'Lawyer');
insert into Survivor values ('Emily Dyer', 'Doctor');
insert into Survivor values ('Kreacher Pierson', 'Thief');
insert into Survivor values ('Emma Woods', 'Gardener');
insert into Survivor values ('Tracy Reznik', 'Mechanic');

insert into HunterStats values ('Goatman', 25, 'Shackled');
insert into HunterStats values ('Hell Ember', 50, 'Infernal Soul');
insert into HunterStats values ('Smiley Face', 50, 'Rocket Modification');
insert into HunterStats values ('Naiad', 50, 'Darkest Depths');
insert into HunterStats values ('The Shadow', 50, 'Phantasm');

insert into Hunter values ('Jeffrey Bonavita', 'Goatman');
insert into Hunter values ('Leo', 'Hell Ember');
insert into Hunter values ('Joker', 'Smiley Face');
insert into Hunter values ('Grace', 'Naiad');
insert into Hunter values ('Ivy', 'The Shadow');

insert into Guild values (1, 'GuildOne', 5, 1, 500);
insert into Guild values (2, 'GuildTwo', 4, 1, 400);
insert into Guild values (3, 'GuildThree', 6, 2, 600);
insert into Guild values (4, 'GuildFour', 7, 1, 700);
insert into Guild values (5, 'GuildFive', 3, 1, 300);

insert into Team values (1, 'TeamOne', 1, 1);
insert into Team values (2, 'TeamTwo', 2, 1);
insert into Team values (3, 'TeamThree', 3, 1);
insert into Team values (4, 'TeamFour', 4, 1);
insert into Team values (5, 'TeamFive', 5, 2);

insert into Server values (1, 'USA');
insert into Server values (2, 'Canada');
insert into Server values (3, 'Japan');
insert into Server values (4, 'Korea');
insert into Server values (5, 'Germany');

insert into Player values (1001, 'Lucia', 10, 7, 7, 1000, 1, 1, 1);
insert into Player values (1002, 'Simon', 98, 1, 1, 1500, 2, 2, 2);
insert into Player values (1003, 'Akira', 50, 1, 1, 800, 3, 3, 3);
insert into Player values (1004, 'Amy', 130, 5, 6, 2000, 4, 4, 4);
insert into Player values (1005, 'Casey', 140, 4, 3, 2500, 5, 5, 5);
insert into Player values (1006, 'Nancy', 200, 6, 7, 3000, 1, 3, 5);

insert into Player values (1007, 'Fiona', 100, 2, 6, 1020, 1, 1, 1);
insert into Player values (1008, 'Sabrina', 80, 4, 3, 2300, 1, 1, 2);
insert into Player values (1009, 'Jakey', 190, 2, 1, 600, 1, 1, 2);
insert into Player values (1010, 'Lily', 195, 3, 2, 60, 1, 2, 3);
insert into Player values (1011, 'Lance', 105, 3, 5, 188, 1, 2, 3);
insert into Player values (1012, 'Sean', 200, 5, 6, 365, 1, 2, 1);

insert into CharacterCard values (1, 488, 'Emily Dyer', 1001);
insert into CharacterCard values (2, 488, 'Freddy Riley', 1001);
insert into CharacterCard values (3, 688, 'Jeffrey Bonavita', 1001);
insert into CharacterCard values (4, 688, 'Grace', 1001);
insert into CharacterCard values (5, 688, 'Joker', 1001);
insert into CharacterCard values (6, 688, 'Leo', 1001);
insert into CharacterCard values (7, 688, 'Ivy', 1001);
insert into CharacterCard values (8, 488, 'Kreacher Pierson', 1001);
insert into CharacterCard values (9, 488, 'Tracy Reznik', 1001);
insert into CharacterCard values (10, 488, 'Emma Woods', 1001);
insert into CharacterCard values (11, 688, 'Grace', 1002);
insert into CharacterCard values (12, 488, 'Tracy Reznik', 1005);

insert into CharacterCard values (13, 488, 'Emily Dyer', 1003);
insert into CharacterCard values (14, 488, 'Freddy Riley', 1003);
insert into CharacterCard values (15, 688, 'Jeffrey Bonavita', 1003);
insert into CharacterCard values (16, 688, 'Grace', 1003);
insert into CharacterCard values (17, 688, 'Joker', 1003);
insert into CharacterCard values (18, 688, 'Leo', 1003);
insert into CharacterCard values (19, 688, 'Ivy', 1003);
insert into CharacterCard values (20, 488, 'Kreacher Pierson', 1003);
insert into CharacterCard values (21, 488, 'Tracy Reznik', 1003);
insert into CharacterCard values (22, 488, 'Emma Woods', 1003);


insert into Talent values (1, 90, 1001);
insert into Talent values (2, 120, 1002);
insert into Talent values (3, 120, 1003);
insert into Talent values (4, 120, 1004);
insert into Talent values (5, 120, 1005);
insert into Talent values (6, 90, 1001);
insert into Talent values (7, 120, 1002);
insert into Talent values (8, 120, 1003);
insert into Talent values (9, 120, 1004);
insert into Talent values (10, 120, 1005);

insert into HunterTalent values (1, 30, 30, 0, 30);
insert into HunterTalent values (2, 40, 40, 0, 40);
insert into HunterTalent values (3, 10, 30, 40, 40);
insert into HunterTalent values (4, 30, 30, 30, 30);
insert into HunterTalent values (5, 15, 25, 40, 40);

insert into SurvivorTalent values (6, 30, 10, 20, 30);
insert into SurvivorTalent values (7, 20, 20, 40, 40);
insert into SurvivorTalent values (8, 40, 40, 40, 0);
insert into SurvivorTalent values (9, 25, 25, 35, 35);
insert into SurvivorTalent values (10, 10, 30, 40, 40);

insert into SurvivorMatch values ('Freddy Riley', 1);
insert into SurvivorMatch values ('Freddy Riley', 2);
insert into SurvivorMatch values ('Emily Dyer', 3);
insert into SurvivorMatch values ('Emily Dyer', 4);
insert into SurvivorMatch values ('Kreacher Pierson', 5);

insert into HunterMatch values ('Jeffrey Bonavita', 6);
insert into HunterMatch values ('Leo', 7);
insert into HunterMatch values ('Joker', 8);
insert into HunterMatch values ('Grace', 9);
insert into HunterMatch values ('Ivy', 10);

-- SET FOREIGN_KEY_CHECKS=1;
