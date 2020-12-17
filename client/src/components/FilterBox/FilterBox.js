import React, { useState, useEffect } from "react";
import { fetchAllJobUrl } from "../../constants/constants";
import "./FilterBox.css";

const FilterBox = (props) => {
  const {
    setAllJob,
    jobTitle,
    setJobTitle,
    location,
    setLocation,
    jobType,
    setJobType,
    employer,
    setEmployer,
    skill,
    setSkill,
  } = props;

  const filterSearch = () => {
    let finalQuery = "";
    let jobTitleQuery = "";
    let locationQuery = "";
    let jobTypeQuery = "";
    let employerQuery = "";
    let skillQuery = "";
    let baseUrl = fetchAllJobUrl + "?";
    if (jobTitle) {
      jobTitleQuery = `&jobTitle=${jobTitle}`;
    }
    if (location) {
      locationQuery = `&location=${location}`;
    }
    if (jobType.includes(true)) {
      if (jobType[0]) {
        jobTypeQuery += `&jobType="full-time"`;
      }
      if (jobType[1]) {
        jobTypeQuery += `&jobType="part-time"`;
      }
      if (jobType[2]) {
        jobTypeQuery += `&jobType="intern"`;
      }
    }
    if (employer) {
      employerQuery = `&employer=${employer}`;
    }
    if (skill) {
      skillQuery = `&skill=${skill}`;
    }

    finalQuery =
      baseUrl +
      jobTitleQuery +
      locationQuery +
      jobTypeQuery +
      employerQuery +
      skillQuery;

    if (finalQuery.length > baseUrl.length) {
      finalQuery =
        finalQuery.slice(0, baseUrl.length) +
        finalQuery.slice(baseUrl.length + 1);
    }

    console.log("finalQuery", finalQuery);

    return finalQuery;
  };

  const filterFetch = async () => {
    const filterJobData = await fetch(filterSearch()).then((res) => res.json());
    console.log("filterJobData", filterJobData);
    // if (Array.isArray(filterJobData)) {
    //   setAllJob(filterJobData);
    // }
    setAllJob(filterJobData);
  };

  useEffect(() => {
    console.log("jobTitle", jobTitle);
  }, [jobTitle]);

  useEffect(() => {
    console.log("location", location);
  }, [location]);

  useEffect(() => {
    console.log("jobType", jobType);
  }, [jobType]);

  useEffect(() => {
    console.log("min", employer);
  }, [employer]);

  useEffect(() => {
    console.log("max", skill);
  }, [skill]);

  return (
    <div>
      <div className="job-search-container">
        <div>
          <input
            className="job-title-input-box"
            type="text"
            placeholder="Search Job Title e.g: MySQL Database Administrator"
            onChange={(e) => {
              setJobTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="filter-box-container">
        <div className="input">
          <div className="location-employer-skill-input">
            <div className="location-input">
              <div>Location </div>
              <input
                type="text"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </div>

            <div className="employer-input">
              <div>Employer </div>
              <input
                type="text"
                onChange={(e) => {
                  setEmployer(e.target.value);
                }}
              />
            </div>
            <div className="skill-input">
              <div>Skill </div>
              <input
                type="text"
                onChange={(e) => {
                  setSkill(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="job-input">
            <div>Job type </div>
            <div className="job-type-input">
              <div className="checkbox">
                <input
                  type="checkbox"
                  onChange={() =>
                    setJobType([!jobType[0], jobType[1], jobType[2]])
                  }
                />
                <label>full-time</label>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  onChange={() =>
                    setJobType([jobType[0], !jobType[1], jobType[2]])
                  }
                />
                <label>part-time</label>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  onChange={() =>
                    setJobType([jobType[0], jobType[1], !jobType[2]])
                  }
                />
                <label>intern</label>
              </div>
            </div>
          </div>

          <div
            className="submit-button"
            onClick={() => {
              filterFetch();
              console.log("submitted");
            }}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
