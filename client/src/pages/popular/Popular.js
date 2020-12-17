import React from 'react';
import PageNavbar from '../PageNavbar';
import PopularRow from './PopularRow';
import './Popular.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Popular extends React.Component {
  constructor(props) {
		super(props);

		this.state = {
			  selectedSkill: "",
			  selectedState: "",
			  selectedTitle: "",
			  skills: [],
			  locations: [],
			  topSkills: []
		};
    
		this.submitSkill = this.submitSkill.bind(this);
		this.submitTopSkills = this.submitTopSkills.bind(this);

		this.handleChange = this.handleChange.bind(this);
		this.handleStateChange = this.handleStateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
	}

	componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/popular", {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(skillList => {
        if (!skillList) return;
        // Map each genreObj in genreList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let skillDivs = skillList.map((skillObj, i) =>
			    <option value={skillObj.skill}>{skillObj.skill}</option>
        );
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
			skills: skillDivs
        })
      })
      .catch(err => console.log(err))	// Print the error if there is one.
	}

	handleChange(e) {
		this.setState({
			selectedSkill: e.target.value,
		});
	}

	handleStateChange(e) {
		this.setState({
			selectedState: e.target.value,
		});
	}

	handleTitleChange(e){
		this.setState({
			selectedTitle: e.target.value,
		});
	}

	/* ---- Popular Skill By Job Title ---- */
	submitTopSkills() {
		console.log(this.state.selectedTitle)
		fetch("http://localhost:8081/popular/topskills/" + this.state.selectedTitle, {
			method: "GET", // The type of HTTP request.
		  })
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(topSkillsList => {
			  if (!topSkillsList) return;
			  console.log(topSkillsList)
			  let topSkillsDivs = topSkillsList.map((topSkillsObj, i) => 
			  <PopularRow key={i} location = {topSkillsObj.skill} count = {topSkillsObj.count} />
			  );
			  this.setState({
				topSkills: topSkillsDivs,
			  })
			})
		  .catch(err => console.log(err))	// Print the error if there is one.
	}


	/* ---- Popular Location ---- */
	submitSkill() {
		fetch("http://localhost:8081/popular/" + this.state.selectedSkill + "/" + this.state.selectedState, {
			method: "GET", // The type of HTTP request.
		  })
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(locationList => {
			  if (!locationList) return;
			  let locationDivs = locationList.map((locationObj, i) => 
			  	<PopularRow key={i} location = {locationObj.location} count = {locationObj.count} />
			  );
			  this.setState({
				locations: locationDivs,
			  })
			})
		  .catch(err => console.log(err))	// Print the error if there is one.
	}

	render() {

		return (
			<div className="BestGenres">
				<PageNavbar active="bestgenres" />

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="title">TOP 10 SKILLS THAT YOU MAY NEED</div>

			        <div className="years-container">
						<div className="input-container">
							Ｗhat Kind Of Job Are You Looking For? 
			    			<input type='text' placeholder="Enter..." value={this.state.selectedTitle} onChange={this.handleTitleChange} id="jobName" className="movie-input"/>
			    			<button id="jobSubmitBtn" className="submit-btn" onClick={this.submitTopSkills}>submit</button>

			        		<div className="movies-container">
							<div className="movie">
			            		<div className="header"><strong>Top 10 Skills For Job Related To: {this.state.selectedTitle}</strong></div>
			            		<div className="header"><strong>Numbers of Jobs That Require This Skill</strong></div>
								</div>
								<div className="movies-container" id="results">
									{this.state.topSkills}
								</div>
			          		</div>
			        	</div>
			    	</div>
				</div>
	    	</div>


				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="title">TOP 100 SKILLS THAT EMPLOYERS ARE LOOKING FOR</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedSkill} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	<option select value> --- select your skill --- </option>
			            	{this.state.skills}
			            </select>
			            {/* <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitSkill}>submit</button> */}
						<p></p>
						<div className="input-container">
							Do You Have A Prefered State? 
			    			<input type='text' placeholder="Enter State Abbreviation" value={this.state.selectedState} onChange={this.handleStateChange} id="movieName" className="movie-input"/>
			    			<button id="decadesSubmitBtn" className="submit-btn" onClick={this.submitSkill}>submit</button>

			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Top 10 Locations</strong></div>
			            <div className="header"><strong>Number of Jobs That Match Skill: {this.state.selectedSkill}</strong></div>
			          	</div>
			          	<div className="movies-container" id="results">
			            	{this.state.locations}
			          	</div>
						  </div>
			          </div>
			        </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}