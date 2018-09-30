import React, {Component} from 'react';
import {
	Button,
	FormGroup,
	FormControl,
	ControlLabel,
	ButtonGroup
} from 'react-bootstrap';
import './App.css';
import * as Datetime from 'react-datetime';

class App extends Component {
	constructor() {
		super();
		this.state = {
			activeFilter: 'all',
			title: '',
			description: '',
			importance: '',
			date: '',
			date_finish: '',
			filter: '',
			input: 'Submit',
			index: '',
			TodoList: localStorage.getItem('Items') ? JSON.parse(localStorage.getItem('Items')) : []
		};
	}

	addItem(e) {
		e.preventDefault();
		let date, date_delay;
		if (this.state.date && typeof(this.state.date) !== 'string') {
			date = this.state.date.format('YYYY.MM.DD HH:mm');
			date_delay = this.state.date.valueOf();
		}

		if (this.state.input === 'Submit') {

			let obj = {
				id: this.state.TodoList.length,
				completed: false,
				overdue: false,
				title: this.state.title,
				description: this.state.description,
				date: date || this.state.date,
				date_finish: '',
				date_delay: date_delay,
				filter: this.state.filter || 'usual',
				editing: false
			};

			if (this.state.title)
				this.setState({
					TodoList: [...this.state.TodoList, obj],
					activeFilter: 'all'
				});
		} else if (this.state.input === 'Edit') {
			//this.state.input = 'Submit';
			const index = Number(this.state.index);

			let stateCopy = Object.assign({}, this.state);
			stateCopy.TodoList[index] = Object.assign({}, stateCopy.TodoList[index]);
			stateCopy.TodoList[index].title = this.state.title;
			stateCopy.TodoList[index].description = this.state.description;
			stateCopy.TodoList[index].filter = this.state.filter;
			stateCopy.TodoList[index].date = date || this.state.date;
			stateCopy.TodoList[index].date_delay = date_delay;

			this.setState({
				stateCopy,
				input: 'Submit'
			});
		}
		this.clearInputs();
	}

	clearInputs() {
		this.state.title = '';
		this.state.description = '';
		this.state.filter = '';
		this.state.date = '';
	}

	editItem(id) {
		let index = this.state.TodoList.findIndex(function (item) {
			return item.id === id;
		});

		this.state.title = this.state.TodoList[index].title;
		this.state.description = this.state.TodoList[index].description;
		this.state.filter = this.state.TodoList[index].filter;
		this.state.date = this.state.TodoList[index].date;

		this.setState({
			index: index,
			input: 'Edit'
		});
	}

	deleteItem(id) {
		let stateCopy = Object.assign({}, this.state);
		let index = stateCopy.TodoList.findIndex(function (item) {
			return item.id === id;
		});
		stateCopy.TodoList.splice(index, 1);

		for (let i = 0; i < stateCopy.TodoList.length; i++) {
			stateCopy.TodoList[i].id = i;
		}

		this.setState({stateCopy});
	}


	static getDateComplete(date) {

		let dd = date.getDate();
		if (dd < 10) dd = '0' + dd;

		let mm = date.getMonth() + 1;
		if (mm < 10) mm = '0' + mm;

		let yy = date.getFullYear();
		let hr = date.getHours();
		let min = date.getMinutes();

		return yy + '.' + mm + '.' + dd + ' ' + hr + ':' + min;
	}

	completedItem(id) {
		let stateCopy = Object.assign({}, this.state);
		let index = stateCopy.TodoList.findIndex(function (item) {
			return item.id === id;
		});
		let date = new Date();
		stateCopy.TodoList[index].completed = !stateCopy.TodoList[index].completed;
		stateCopy.TodoList[index].overdue = !stateCopy.TodoList[index].overdue;
		if (stateCopy.TodoList[index].completed) {
			stateCopy.TodoList[index].date_finish = App.getDateComplete(date);
		} else {
			stateCopy.TodoList[index].date_finish = '';
		}

		this.setState({stateCopy});
	}

	componentDidMount() {
		this.intervalId = setInterval(this.overdue.bind(this), 1000);
	}

	overdue() {
		let stateCopy = Object.assign({}, this.state);
		if (stateCopy.TodoList.length) {
			let date = new Date().valueOf();
			stateCopy.TodoList.map(function (item) {
				item.overdue = !!(item.date_delay && item.date_delay <= date && !item.completed);
			});
		} else {
			clearInterval(this.interval);
		}

		this.setState({stateCopy});
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

	filterItem() {
		const id = this.state.activeFilter;

		switch (id) {
		case 'usual':
			return this.state.TodoList.filter(item => (item.filter === id));
		case 'important':
			return this.state.TodoList.filter((item) => (item.filter === id));
		case 'grand':
			return this.state.TodoList.filter((item) => (item.filter === id));
		default:
			return this.state.TodoList;
		}
	}

	displayTodo(id) {
		this.setState({
			activeFilter: id
		});
	}

	render() {
		localStorage.setItem('Items', JSON.stringify(this.state.TodoList));
		const listArray = this.filterItem();
		const listEntries = listArray.map((item, i) => {
			return (
				<tr className={item.overdue ? 'overdue' : item.completed ? 'completed' : ''} key={i}>
					<td>{item.title}</td>
					<td>{item.description}</td>
					<td>{item.filter}</td>
					<td>{item.date}</td>
					<td>{item.date_finish}</td>
					<td className="glyphicon glyphicon-trash" onClick={this.deleteItem.bind(this, item.id)}/>
					<td className="glyphicon glyphicon-pencil" onClick={this.editItem.bind(this, item.id)}/>
					<td className="glyphicon glyphicon-ok" onClick={this.completedItem.bind(this, item.id)}/>
				</tr>
			);
		});

		const filter = (
			<div className="button-group">
				<ButtonGroup>
					<Button onClick={this.displayTodo.bind(this, 'all')}>Все</Button>
					<Button onClick={this.displayTodo.bind(this, 'usual')}>Обычное</Button>
					<Button onClick={this.displayTodo.bind(this, 'important')}>Важное</Button>
					<Button onClick={this.displayTodo.bind(this, 'grand')}>Очень важное</Button>
				</ButtonGroup>
			</div>
		);

		return (

			<div className="container">
				<h1>TODO LIST</h1>
				<div className="container block">
					<div className="form left">
						<form
							className="form-horizontal"
							role="form"
							onSubmit={this.addItem.bind(this)}>
							<FormGroup controlId="formInlineName">
								<ControlLabel>Title</ControlLabel>
								<FormControl
									required
									type="text"
									onChange={event => this.setState({title: event.target.value})}
									value={this.state.title}/>
							</FormGroup>
							<FormGroup controlId="formControlsTextarea">
								<ControlLabel>Description</ControlLabel>
								<FormControl
									required
									componentClass="textarea"
									onChange={event => this.setState({description: event.target.value})}
									value={this.state.description}/>
							</FormGroup>
							<FormGroup controlId="formControlsSelect">
								<ControlLabel>importance</ControlLabel>
								<FormControl
									componentClass="select"
									value={this.state.filter}
									onChange={event => this.setState({filter: event.target.value})}>
									<option value="usual">Обычное</option>
									<option value="important">Важное</option>
									<option value="grand">Очень важное</option>
								</FormControl>
							</FormGroup>
							<div className="form-group">
								<Datetime
									timeFormat="HH:mm"
									dateFormat="YYYY.MM.DD"
									onChange={date => this.setState({date: date})}
									value={this.state.date}
								/>
							</div>
							<Button
								type="submit"
								onChange={event => this.setState({input: event.target.value})}
							>{this.state.input}</Button>
						</form>
					</div>
					<div className="todo-list right">
						{filter}
						<div className="table">
							<table className="table table-hover">
								<thead>
									<tr>
										<th>Title</th>
										<th>Description</th>
										<th>Filter</th>
										<th>Date</th>
										<th>Date completed</th>
										<th>Options</th>
									</tr>
								</thead>
								<tbody>
									{listEntries}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>);
	}
}

export default App;





