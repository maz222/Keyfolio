import React, { Component } from 'react';
import {DetailCard} from './CardListing.js';

class CardPage extends Component {
	render() {
		console.log("??");
		return(
			<div id="cardPage" className="page">
				<DetailCard data={this.props.location.state.data} />
			</div>
		);
	}
}

export default CardPage;