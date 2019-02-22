import React, {Component} from 'react';
import './LandingPageStyle.css';

class LandingPage extends Component {
	constructor(props) {
		super(props);
		this.state = {cardCount:props.cardCount, deckCount:props.deckCount};
	}
	componentDidMount() {
		console.log("fetching card count");
		fetch('/API/cardCount')
			.then(res => res.json())
			.then((count) => {
				this.setState({cardCount:count.cardCount});
			});
		console.log("fetching deck count");
		fetch('/API/deckCount')
			.then(res => res.json())
			.then((count) => {
				this.setState({deckCount:count.deckCount});
			});
	}
	render() {
		return(
			<div id="landingPage" className="page">
				<div className="messageContainer">
					<h1>Welcome!</h1>
					<h2>Keyfolio is a free fan site dedicated to the popular collectible card game <b>Keyforge</b>.</h2>
					<h2>Here, you can search through <b>{this.state.cardCount}</b> cards and <b>{this.state.deckCount}</b> decks from the game.</h2>
					<h2>As decks must first be registered on the <a href="https://www.keyforgegame.com">official Keyforge site</a>, not all of them may appear here,
					but new decks and cards are constantly pulled from the main site and added here over time.</h2>
				</div>
			</div>
		);
	}
}
LandingPage.defaultProps = {
	cardCount: 429,
	deckCount: 2025
}

export default LandingPage;