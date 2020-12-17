import React, { useState } from "react";
import "./JobContent.css";

const JobContent = (props) => {
  const { selectedJob } = props;
  return (
    <div className="job-detail-container">
      {selectedJob ? <h2>Job Title:</h2> : null}
      <h3 className="content">
        {selectedJob ? selectedJob["JobTitle"] : null}
      </h3>
      {selectedJob ? <h2>Location:</h2> : null}
      <h3 className="content">
        {selectedJob ? selectedJob["Location"] : null}
      </h3>
      {selectedJob ? <h2>Employer:</h2> : null}
      <h3 className="content">
        {selectedJob ? selectedJob["Employer"] : null}
      </h3>
      {selectedJob ? <h2>Job Type:</h2> : null}
      <h3 className="content">{selectedJob ? selectedJob["JobType"] : null}</h3>
      {selectedJob ? <h2>Skills:</h2> : null}
      <h3 className="content">{selectedJob ? selectedJob["Skill"] : null}</h3>
      {selectedJob ? <h2>Description:</h2> : null}
      <p>{selectedJob ? selectedJob["Description"] : null}</p>
    </div>
  );
};

export default JobContent;
