import React, {Component} from 'react';

//props
	//title: the title/category of the filter ("house","type",etc)
	//options: the options the user can select from
	//selected: list of selected options
//state
	//selected: a list of all currently selected options
	//colapsed: whether the options are collapsed (visible) or not

class CollapseFilter extends Component {
	constructor(props) {
		super(props);
		//sets the initially selected buttons to either the given list (via props), or all buttons (by default)
		var selectedButtons = props.selected.length === 0 || props.selected === undefined
			? props.options : props.selected;
		this.state = {collapsed:false, selected:selectedButtons};
		this.getOptions = this.getOptions.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}
	selectAll() {
		this.setState({selected:this.props.options});
	}
	toggleDropdown() {
		this.setState((prevState, props) => {
			return {collapsed:!prevState.collapsed};
		});
	}
	toggleFilter(e) {
		console.log(e.target.value);
		var val = e.target.value;
		this.setState((prevState,props) => {
			const index = prevState.selected.indexOf(val);
			if(index !== -1) {
				return {selected:
					prevState.selected.slice(0,index).concat(prevState.selected.slice(index+1,prevState.selected.length))};
			}
			return({selected:prevState.selected.concat([val])});
		});
	}
	getOptions() {
		var t = this;
		return this.props.options.map(function(option) {
			return(
				<span>
					<input type="checkbox" className="filterOption" id={option} value={option} name={t.props.title} 
						checked={t.state.selected.includes(option)} onClick={t.toggleFilter} />
					<label for={option}>{option}</label>
				</span>
			);
		});
	}
	render() {
		var filterClass = this.state.collapsed ? "filterButtons collapsed" : "filterButtons";
		var caret = this.state.collapsed ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-up"></i>;
		return (
			<div className="dropFilter">
				<button type="button" className="dropButton" onClick={this.toggleDropdown}>{this.props.title}{caret}</button>
				<div className={filterClass}>
					<button type="button" className="selectAllButton" onClick={this.selectAll}>Select All</button>
					{this.getOptions()}
				</div>
			</div>
		);
	}
}
CollapseFilter.defaultProps = {
	title: "Default Title",
	options: [],
	selected: []
}

export default CollapseFilter;