import React, {Component} from 'react';
import {
    Button,
    ListGroup,
    ListGroupItem,
    Glyphicon,
    FormGroup,
    FormControl,
    ControlLabel,
    Form,
    ButtonToolbar,
    ToggleButton,
    ToggleButtonGroup,
    ButtonGroup
} from 'react-bootstrap';
import './App.css';
import * as Datetime from 'react-datetime';

class App extends Component {

    constructor() {
        super();
        this.state = {
            activeFilter: 'all',
            title: "",
            description: "",
            importance: "",
            date: "",
            date_finish: "",
            date_delay: "",
            filter: "",
            input: 'Submit',
            index: "",
            TodoList: localStorage.getItem('Items') ? JSON.parse(localStorage.getItem('Items')) : []
        };
    }

    AddItem(e) {
        e.preventDefault();

        if (this.state.input === 'Submit') {
            let date = this.state.date ? this.state.date.format('YYYY.MM.DD HH:mm') : "";
            let obj = {
                id: this.state.TodoList.length,
                completed: false,
                overdue: false,
                title: this.state.title,
                description: this.state.description,
                date: date,
                date_finish: "",
                date_delay: this.state.date.valueOf(),
                filter: this.state.filter || "usual",
                editing: false
            };

            if (this.state.title)
                this.setState({
                    TodoList: [...this.state.TodoList, obj],
                    activeFilter: 'all'
                });
        } else if (this.state.input === 'Edit') {
            this.state.input = 'Submit';
            const index = Number(this.state.index);
            let date = this.state.date ? this.inputDate.state.selectedDate._d.valueOf() : "";

            this.state.TodoList[index].title = this.inputTitle.value;
            this.state.TodoList[index].description = this.inputDescription.value;
            this.state.TodoList[index].filter = this.inputFilter.value;
            this.state.TodoList[index].date = this.inputDate.state.inputValue;
            this.state.TodoList[index].date_delay = date;

            this.setState({
                TodoList: this.state.TodoList
            });
        }
        this.clearInputs();
    }

    clearInputs() {
        this.inputTitle.value = '';
        this.inputDescription.value = '';
        this.inputFilter.value = '';
        this.state.title = '';
        this.state.description = '';
        this.state.filter = '';
        this.state.date = '';
    }

    editItem(id) {
        let index = this.state.TodoList.findIndex(function (item) {
            return item.id === id
        });

        this.inputTitle.value = this.state.TodoList[index].title;
        this.state.title = this.state.TodoList[index].title;
        this.inputDescription.value = this.state.TodoList[index].description;
        this.state.description = this.state.TodoList[index].description;
        this.inputFilter.value = this.state.TodoList[index].filter;
        this.state.filter = this.state.TodoList[index].filter;
        this.inputDate.value = this.state.TodoList[index].date;
        this.state.date = this.state.TodoList[index].date;
        this.state.input = 'Edit';
        this.state.index = index;

        this.setState({
            TodoList: this.state.TodoList
        });
    }

    deleteItem(id) {
        let index = this.state.TodoList.findIndex(function (item) {
            return item.id === id
        });
        this.state.TodoList.splice(index, 1);

        for (let i = 0; i < this.state.TodoList.length; i++) {
            this.state.TodoList[i].id = i;
        }

        this.setState({
            TodoList: this.state.TodoList
        });
    }


    getDateComplete(date) {

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
        let index = this.state.TodoList.findIndex(function (item) {
            return item.id === id
        });
        let date = new Date();
        this.state.TodoList[index].completed = !this.state.TodoList[index].completed;
        this.state.TodoList[index].overdue = !this.state.TodoList[index].overdue;
        if (this.state.TodoList[index].completed) {
            this.state.TodoList[index].date_finish = this.getDateComplete(date);
        } else {
            this.state.TodoList[index].date_finish = "";
        }

        this.setState({
            TodoList: this.state.TodoList
        });

    }

    componentDidMount() {
        this.intervalId = setInterval(this.overdue.bind(this), 1000);
    }

    overdue() {

        if (this.state.TodoList.length) {
            let date = new Date().valueOf();
            this.state.TodoList.map(function (item) {
                if (item.date_delay && item.date_delay <= date && !item.completed) {
                    item.overdue = true;
                } else {
                    item.overdue = false;
                }
            });
        } else {
            clearInterval(this.interval)
        }

        this.setState({
            TodoList: this.state.TodoList
        });

    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    filterItem() {
        const id = this.state.activeFilter;

        if (id === 'all') {
            return this.state.TodoList
        } else if (id === 'usual') {
            return this.state.TodoList.filter(item => (item.filter === id))
        } else if (id === 'important') {
            return this.state.TodoList.filter((item) => (item.filter === id))
        } else if (id === 'grand') {
            return this.state.TodoList.filter((item) => (item.filter === id))
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
                //<tr className={item.completed ? "completed" : item.overdue ? "overdue" : "" } key={i}>
                <tr className={item.overdue ? "overdue" : item.completed ? "completed" : ""} key={i}>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.filter}</td>
                    <td>{item.date}</td>
                    <td>{item.date_finish}</td>
                    <td className="glyphicon glyphicon-trash" onClick={this.deleteItem.bind(this, item.id)}></td>
                    <td className="glyphicon glyphicon-pencil" onClick={this.editItem.bind(this, item.id)}></td>
                    <td className="glyphicon glyphicon-ok" onClick={this.completedItem.bind(this, item.id)}></td>
                </tr>
            )
        });

        const filter = (
            <div className="button-group">
                <ButtonGroup>
                    <Button onClick={this.displayTodo.bind(this, "all")}>Все</Button>
                    <Button onClick={this.displayTodo.bind(this, "usual")}>Обычное</Button>
                    <Button onClick={this.displayTodo.bind(this, "important")}>Важное</Button>
                    <Button onClick={this.displayTodo.bind(this, "grand")}>Очень важное</Button>
                </ButtonGroup>
            </div>
        );

        const formInstance = (
            <form>
                <FormGroup>
                    <ControlLabel>Working example with validation</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.title}
                        placeholder="Enter text"
                    />
                </FormGroup>
            </form>
        );

        return (

            <div className="container">
                <h1>TODO LIST</h1>
                <div className="container block">
                    <div className="form left">
                        <form
                            className="form-horizontal"
                            role="form"
                            onSubmit={this.AddItem.bind(this)}>
                            <FormGroup controlId="formInlineName">
                                <ControlLabel>Title</ControlLabel>
                                <FormControl
                                    required
                                    type="text"
                                    inputRef={input => this.inputTitle = input}
                                    onChange={event => this.setState({title: event.target.value})}
                                    value={this.state.title}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsTextarea">
                                <ControlLabel>Description</ControlLabel>
                                <FormControl
                                    required
                                    componentClass="textarea"
                                    inputRef={(input) => this.inputDescription = input}
                                    onChange={event => this.setState({description: event.target.value})}
                                    value={this.state.description}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>importance</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    value={this.state.filter}
                                    inputRef={(input) => this.inputFilter = input}
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
                                    ref={(ref) => this.inputDate = ref}
                                    onChange={date => this.setState({date: date})}
                                    value={this.state.date}
                                />
                            </div>
                            <Button type="submit" ref={(ref) => this.submitInput = ref}>{this.state.input}</Button>
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





