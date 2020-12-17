import React, { useState } from "react";
import "../JobSideList/JobSideList.css";

const JobSideList = (props) => {
  const { allJob, setSelectedJob } = props;
  //console.log("allJob", allJob);
  const [activeIndex, setActiveIndex] = useState(null);

  const renderSideBar = () => {
    const onJobClick = (item, index) => {
      console.log("job", index);
      setActiveIndex(index);
      setSelectedJob(item);
    };

    return allJob && allJob.length ? (
      <div>
        <ul className="job-list">
          {allJob.map((item, index) => {
            const active = index === activeIndex ? "-active" : "";

            return (
              <li
                className={`job-content detail-job-container${active}`}
                key={index}
              >
                <div onClick={() => onJobClick(item, index)}>
                  <div>{item["JobTitle"]}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    ) : null;
  };

  return <div>{renderSideBar()}</div>;
};

export default JobSideList;
