var config = require("./db-config.js");
var mysql = require("mysql");

config.connectionLimit = 10;
var connection = mysql.createPool(config);

function getJobs(req, res) {
  var jobTitle = req.query.jobTitle;
  if (jobTitle == null) jobTitle = "";

  var location = req.query.location;
  if (location == null) location = "";

  var jobType = req.query.jobType;
  if (jobType == null) jobType = [];

  var employer = req.query.employer;
  if (employer == null) employer = "";

  var skill = req.query.skill;
  if (skill == null) skill = "";

  var query = `
  SELECT *
  FROM (SELECT JOB_TITLE As JobTitle, JOB_TYPE AS JobType, LOCATION AS Location, ORGANIZATION AS Employer, sector AS Skill, JOB_DESCRIPTION AS Description FROM Dice 
    UNION ALL
     SELECT job_title AS JobTitle, job_type AS JobType, location AS Location, NULL AS Employer, sector AS Skill, job_description AS Description FROM Monster) tables
  WHERE JobTitle LIKE '%${jobTitle}%'
  AND Location LIKE '%${location}%'
  AND Employer LIKE '%${employer}%'
  AND Skill LIKE '%${skill}%';
  `;

  if (jobType != null && typeof jobType === "string") {
    jobType = jobType.replace('"', "");
    jobType = jobType.replace('"', "");
    jobType = jobType.replace("-time", "");
    query = `
    SELECT JobTitle, JobType, Location, Employer, Skill, Description
    FROM (SELECT JOB_TITLE As JobTitle, JOB_TYPE AS JobType, LOCATION AS Location, ORGANIZATION AS Employer, sector AS Skill, JOB_DESCRIPTION AS Description FROM Dice 
      UNION ALL
       SELECT job_title AS JobTitle, job_type AS JobType, location AS Location, NULL AS Employer, sector AS Skill, job_description AS Description FROM Monster) tables
    WHERE JobTitle LIKE '%${jobTitle}%'
    AND Location LIKE '%${location}%'
    AND Employer LIKE '%${employer}%'
    AND JobType LIKE '%${jobType}%'
    AND Skill LIKE '%${skill}%';
    `;
  } else if (jobType != null && jobType.length == 2) {
    var jobType1 = jobType[0];
    jobType1 = jobType1.replace('"', "");
    jobType1 = jobType1.replace('"', "");
    jobType1 = jobType1.replace("-time", "");

    var jobType2 = jobType[1];
    jobType2 = jobType2.replace('"', "");
    jobType2 = jobType2.replace('"', "");
    jobType2 = jobType2.replace("-time", "");

    query = `
    SELECT JobTitle, JobType, Location, Employer, Skill, Description
    FROM (SELECT JOB_TITLE As JobTitle, JOB_TYPE AS JobType, LOCATION AS Location, ORGANIZATION AS Employer, sector AS Skill, JOB_DESCRIPTION AS Description FROM Dice 
      UNION ALL
       SELECT job_title AS JobTitle, job_type AS JobType, location AS Location, NULL AS Employer, sector AS Skill, job_description AS Description FROM Monster) tables
    WHERE JobTitle LIKE '%${jobTitle}%'
    AND Location LIKE '%${location}%'
    AND Employer LIKE '%${employer}%'
    AND (JobType LIKE '%${jobType1}%' OR JobType LIKE '%${jobType2}%')
    AND Skill LIKE '%${skill}%';
    `;
  }

  connection.query(query, function (err, jobTitle, fields) {
    if (err) console.log(err);
    else {
      console.log(jobTitle);
      res.json(jobTitle);
    }
  });
}

// Get all skills
function getSkills(req, res) {
// var query = `
// WITH SKILLS AS (
//   SELECT count(*) AS count, 
//   TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.sector, ',', numbers.n), ',', -1)) AS skill 
//   FROM (select 1 n union all
//   select 2 union all select 3 union all
//   select 4 union all select 5) numbers INNER JOIN 
//   (SELECT * FROM Dice WHERE JOB_TITLE LIKE '%${title}') d 
//   ON CHAR_LENGTH(d.sector) -CHAR_LENGTH(REPLACE(d.sector, ', ','')) >= numbers.n-1
//   GROUP BY skill ORDER BY count(*) desc
//   LIMIT 10)
//   SELECT * FROM SKILLS WHERE skill<>''
//   `;
  
  var query = `
  CREATE TEMPORARY TABLE numbers(select 1 n union all 
    select 2 union all select 3 union all 
    select 4 union all select 5 union all 
    select 6 union all select 7 union all 
    select 8 union all select 9 union all 
    select 10 union all select 11 union all 
    select 12 union all select 13 union all 
    select 14 union all select 15 union all 
    select 16 union all select 17 union all 
    select 18 union all select 19 union all select 20 );

  WITH SKILLS AS (SELECT count(*) AS count, 
  TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(Dice.sector, ',', numbers.n), ',', -1)) skill
  FROM numbers INNER JOIN Dice
  ON CHAR_LENGTH(Dice.sector)
     -CHAR_LENGTH(REPLACE(Dice.sector, ', ','')) >= numbers.n-1
  GROUP BY skill
  ORDER BY count(*) desc
  LIMIT 100)
  SELECT skill AS skill FROM SKILLS WHERE skill<>'' AND skill<>' '
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log(rows);
      res.json(rows);
    }
  });
}

// Get Popular Location from Selected Skill
function getPopularLocations(req, res) {
  var selected_skill = req.params.skill;
  var selected_state = req.params.state;
  //console.log(selected_state);
  //console.log(selected_skill);
  if (selected_skill === "topskills") {
    getTopSkills(req, res);
    return;
  }
  var query = `
  SELECT Location AS location, COUNT(*) AS count
  FROM (SELECT LOCATION AS Location, sector AS Skill, JOB_DESCRIPTION AS Description FROM Dice 
    UNION ALL
      SELECT location AS Location, sector AS Skill, job_description AS Description FROM Monster) tables
  WHERE (Skill LIKE '%${selected_skill}%' OR Description LIKE '%${selected_skill}%')
  GROUP BY Location
  ORDER BY COUNT(*) DESC
  LIMIT 10;
  `;

  if (selected_state != null && typeof selected_state === "string") {
    query = `
  SELECT Location AS location, COUNT(*) AS count
  FROM (SELECT LOCATION AS Location, sector AS Skill, JOB_DESCRIPTION AS Description FROM Dice 
    UNION ALL
      SELECT location AS Location, sector AS Skill, job_description AS Description FROM Monster) tables
  WHERE (Skill LIKE '%${selected_skill}%' OR Description LIKE '%${selected_skill}%')
  AND Location LIKE '%${selected_state}%'
  GROUP BY Location
  ORDER BY COUNT(*) DESC
  LIMIT 10;
  `;
  }

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

// Get top skills related to input job title
function getTopSkills(req, res) {
  var title = req.params.state;
  console.log(title)
  var query = `
  CREATE TEMPORARY TABLE numbers(select 1 n union all 
    select 2 union all select 3 union all 
    select 4 union all select 5 union all 
    select 6 union all select 7 union all 
    select 8 union all select 9 union all 
    select 10 union all select 11 union all 
    select 12 union all select 13 union all 
    select 14 union all select 15 union all 
    select 16 union all select 17 union all 
    select 18 union all select 19 union all select 20 );

  WITH SKILLS AS (SELECT count(*) AS count,
  TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.sector, ',', numbers.n), ',', -1)) AS skill
  FROM numbers INNER JOIN (SELECT * FROM Dice WHERE JOB_TITLE LIKE '%${title}') d
  ON CHAR_LENGTH(d.sector)
     -CHAR_LENGTH(REPLACE(d.sector, ', ','')) >= numbers.n-1
  GROUP BY skill
  ORDER BY count(*) desc
  LIMIT 10)
  SELECT * FROM SKILLS WHERE skill<>''
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  getJobs: getJobs,
  getSkills: getSkills,
  getPopularLocations: getPopularLocations,
  getTopSkills: getTopSkills,
};
