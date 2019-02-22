import React, {Component} from 'react';

//props
	//title: the title/category of the filter ("house","type",etc)
	//options: the options the user can select from
//state
	//selected: a *set* of all currently selected options
	//colapsed: whether the options are collapsed (visible) or not

class CollapseFilter extends Component {
	constructor(props) {
		super(props);
		var buttonStatuses = {};
		for(var i in props.options) {
			buttonStatuses[props.options[i]] = true;
		}
		this.state = {collapsed:false, selected:buttonStatuses};
		this.getOptions = this.getOptions.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}
	selectAll() {
		//iterate through all the options, and keep track of ones which aren't selected
		var toSelect = [];
		for(var i in this.props.options) {
			var option = this.props.options[i];
			if(!this.state.selected[option]) {
				toSelect.push(option);
			}
		}
		console.log(toSelect);
		//if there are options to select, select all of them
		if(toSelect.length > 0) {
			this.setState((prevState,props) => {
				for(var i in toSelect) {
					prevState.selected[toSelect[i]] = true;
				}
				return({selected:prevState.selected});
			});
		}
		//if all the options are already selected, unselect them
		else {
			this.setState({selected:{}});
		}

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
			prevState.selected[val] = !prevState.selected[val];
			return({selected:prevState.selected});
		});
	}
	getOptions() {
		var t = this;
		return this.props.options.map(function(option) {
			return(
				<span>
					<input type="checkbox" className="filterOption" id={option} value={option} name={t.props.title} 
						checked={t.state.selected[option]} onClick={t.toggleFilter} />
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

export default CollapseFilter;