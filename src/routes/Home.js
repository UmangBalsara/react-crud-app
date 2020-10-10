import React, { Component } from "react";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import "../styles/Home.css";
import { v4 as uuidv4 } from "uuid";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      pname: "",
      cname: "",
      priority: "",
      lists: [],
      deletelist: [],
      editIndex: 0,
      flag: false,
      search: "",
    };
    this.textInput = React.createRef();
    this.onAddProjectHandler = this.onAddProjectHandler.bind(this);
  }

  /*static get() {
    this.textInput.current.focus();
    console.log(this.inputRef);
  }
  */

  componentDidMount() {
    let data = JSON.parse(localStorage.getItem("projectdetails"));
    if (this.state.lists.projectId === data.projectId) {
      //console.log("data is fetch in home component");
      this.setState({
        lists: data,
      });
    } else {
      console.log("data is not fetch from localstorage");
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSelectHandler = (e) => {
    this.setState({
      priority: e.target.value,
    });
  };

  searchHandler = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  onAddProjectHandler(e) {
    e.preventDefault();
    //this.textInput.current.focus();
    this.setState({
      show: !this.state.show,
    });
  }

  onSubmitHandler(e) {
    const { lists } = this.state;
    e.preventDefault();
    this.state.lists.push({
      projectId: uuidv4(),
      projectName: this.state.pname,
      clientName: this.state.cname,
      priority: this.state.priority,
    });
    //console.log("Project Name is: " + this.state.pname);
    //console.log("Client Name is: " + this.state.cname);
    //console.log("Priority is: " + this.state.priority);

    localStorage.setItem("projectdetails", JSON.stringify(lists));
    //let data = JSON.parse(localStorage.getItem("projectdetails"));
    //console.log(data);

    this.setState({
      lists: lists,
      pname: "",
      cname: "",
      show: !this.state.show,
    });
    //console.log(lists);
  }

  viewDetailHandler(e, list) {
    e.preventDefault();
    console.log(list);
    // window.location.href(`/project/${list.projectId}`);
    this.props.history.push({
      pathname: `/project/${list.projectId}`,
    });
  }

  onEdit(e, list, index) {
    e.preventDefault();

    this.setState({
      editIndex: index,
      flag: true,
      show: true,
      pname: list.projectName,
      cname: list.clientName,
      priority: list.priority,
    });
    //console.log(list);
  }

  onUpdate(e) {
    e.preventDefault();
    let data = [...this.state.lists];
    data[this.state.editIndex].priority = this.state.priority;
    data[this.state.editIndex].projectName = this.state.pname;
    data[this.state.editIndex].clientName = this.state.cname;
    //console.log(data);
    this.setState(
      {
        lists: data,
        show: !this.state.show,
      },
      () => {
        localStorage.setItem(
          "projectdetails",
          JSON.stringify(this.state.lists)
        );
      }
    );
  }

  onDeleteHandler(e, index) {
    e.preventDefault();
    var deletelist = [...this.state.lists];
    deletelist.splice(index, 1);
    this.setState({
      lists: deletelist,
      deletelist: localStorage.setItem(
        "projectdetails",
        JSON.stringify(deletelist)
      ),
    });
  }

  render() {
    const { search } = this.state;
    const filterdLists = this.state.lists.filter((list) => {
      return (
        list.projectName.toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    });
    //console.log(filterdLists);
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={this.state.search}
          onChange={this.searchHandler}
        />
        <br />
        <Button
          variant="outline-dark"
          className="btn-style"
          onClick={this.onAddProjectHandler}
        >
          Add Projects
        </Button>

        <Modal show={this.state.show}>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>Add Projects</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder=" Enter Project Name"
                    name="pname"
                    ref={this.textInput}
                    value={this.state.pname}
                    onChange={this.onChangeHandler}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder=" Enter Client Name"
                    name="cname"
                    value={this.state.cname}
                    onChange={this.onChangeHandler}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Select Priority</Form.Label>
                  <Form.Control
                    as="select"
                    value={this.state.priority}
                    onChange={this.onSelectHandler}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              {this.state.flag ? (
                <Button
                  variant="outline-success"
                  onClick={(e) => {
                    this.onUpdate(e);
                  }}
                  disabled={!this.state.pname || !this.state.cname}
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="outline-success"
                  onClick={(e) => {
                    this.onSubmitHandler(e);
                  }}
                  disabled={!this.state.pname || !this.state.cname}
                >
                  Submit
                </Button>
              )}

              <Button
                variant="outline-danger"
                onClick={(e) => {
                  this.onAddProjectHandler(e);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
        {/*this.state.lists ||filteredLists*/}

        {filterdLists.map((list, index) => (
          <ListGroup as="ul" key={list.projectId} className="list-style">
            <ListGroup.Item as="li" active>
              Project Name: {list.projectName}
            </ListGroup.Item>
            <ListGroup.Item as="li">
              Client Name: {list.clientName}
            </ListGroup.Item>
            <ListGroup.Item as="li">
              Priority is: {list.priority}
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <Button
                variant="outline-primary"
                onClick={(e) => {
                  this.viewDetailHandler(e, list);
                }}
              >
                View
              </Button>
              <Button
                variant="outline-warning"
                onClick={(e) => {
                  this.onEdit(e, list, index);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                onClick={(e) => {
                  this.onDeleteHandler(e, index);
                }}
              >
                Delete
              </Button>
            </ListGroup.Item>
          </ListGroup>
        ))}
      </div>
    );
  }
}

export default Home;
