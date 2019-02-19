import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './CardListingStyles.css';

class CardListing extends Component {
	//props: 
		//data :
			//card_title - string
			//house - string
			//card_type - string
			//front_image - string (URL)
			//traits - array of strings
			//amber - number
			//power - number
			//rarity - string
			//flavor_text - string
			//card_number - number
			//expansion - number
			//is_maverick - boolean
	constructor(props) {
		super(props);
	}
}
CardListing.defaultProps = {
	data: {
		card_title: "Unknown",
		house: "Unknown",
		card_type: "Unknown",
		front_image: null,
		traits: [],
		amber: 0,
		power: 0,
		rarity: 0,
		flavor_text: "",
		card_number: 0,
		is_maverick: false,
	}
}

class ListCard extends CardListing {
	render() {
		return(
			<Link className="cardListing listCard" to={{pathname:"/cards/cardDetails",state:{data:this.props.data}}}>
				<h1 className="cardTitle">{this.props.data.card_title}</h1>
				<h1 className="cardHouse">{this.props.data.house}</h1>
				<h1 className="cardType">{this.props.data.card_type}</h1>
				<h1 className="cardRarity">{this.props.data.rarity}</h1>
			</Link>
		);
	}
}

class GridCard extends CardListing {
	render() {
		return(
			<Link className="cardListing gridCard" to={{pathname:"/cards/cardDetails",state:{data:this.props.data}}}>
				<div class="imgContainer">
					<img src={this.props.data.front_image} alt="Card image" />
				</div>
			</Link>
		);
	}
}

class DetailCard extends CardListing {
	render() {
		return(
			<div className="detailCard">
				<img src={this.props.data.front_image} alt="Card image" />
				<div className="detailListing">
					<div className="detail"><p className="property">Title</p><p className="value">{this.props.data.card_title}</p></div>
					<div className="detail"><p className="property">Type</p><p className="value">{this.props.data.card_type}</p></div>
					<div className="detail"><p className="property">House</p><p className="value">{this.props.data.house}</p></div>
					{this.props.data.flavor_text != null ? 
						<div className="detail"><p className="property">Flavor Text</p><p className="value">{this.props.data.flavor_text}</p></div> :
						null
					}
					{this.props.data.traits.length > 0 ?
				 		<div className="detail"><p className="property">Traits</p><p className="value">{this.props.data.traits.join()}</p></div> :
				 		null
					}
					<div className="detail"><p className="property">Rarity</p><p className="value">{this.props.data.rarity}</p></div>
					{this.props.data.amber > 0 ? 
						<div className="detail"><p className="property">Amber</p><p className="value">{this.props.data.amber}</p></div> :
						null
					}
					<div className="detail"><p className="property">Card Number</p><p className="value">{this.props.data.card_number}</p></div>
				</div>
			</div>
		)
	}
}

export {ListCard, GridCard, DetailCard};