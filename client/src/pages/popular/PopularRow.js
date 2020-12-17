import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PopularRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="genre">{this.props.location}</div>
				<div className="rating">{this.props.count}</div>
			</div>
		);
	}
}
