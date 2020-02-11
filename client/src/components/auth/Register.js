import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
// This is used to connect redux to this component
// A container is a redux component that works with redux

import { connect } from "react-redux";
import { registeruser } from "../../actions/authActions";

import { withRouter } from "react-router-dom";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  //This runs when the component receives new properties
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    // Since it's a form, we don't want it to have its default behavior
    // TODO: What is the default behavior of form
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // Any action that we bring-in is going to be stored inside props
    // The 2nd param will allow us to redirect from inside the action registerUser
    this.props.registeruser(newUser, this.props.history);
  }
  render() {
    // Using DECONSTRUCTING here: Using the braces will allow me to pull errors from the state instead
    // of asssigning it directly like this:
    // const errors = this.state.errors
    const { errors } = this.state;
    return (
      <div>
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">
                  Create your DevConnector account
                </p>
                <form noValidate onSubmit={this.onSubmit}>
                  <div className="form-group">
                    {/* The first parameter of classnames are the default classNames 
                    The second parameter is the condition to apply is-invalid
                    if errors.name exists then is-invalid will be applied*/}
                    <input
                      type="text"
                      className={"form-control form-control-lg"}
                      className={classnames("form-control form-control-lg", {
                        "is-invalid": errors.name
                      })}
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      className={classnames("form-control form-control-lg", {
                        "is-invalid": errors.email
                      })}
                      placeholder="Email Address"
                      value={this.state.email}
                      name="email"
                      onChange={this.onChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}

                    <small className="form-text text-muted">
                      This site uses Gravatar so if you want a profile image,
                      use a Gravatar email
                    </small>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={classnames("form-control form-control-lg", {
                        "is-invalid": errors.password
                      })}
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      className={classnames("form-control form-control-lg", {
                        "is-invalid": errors.password2
                      })}
                      placeholder="Confirm Password"
                      name="password2"
                      value={this.state.password2}
                      onChange={this.onChange}
                    />
                    {errors.password2 && (
                      <div className="invalid-feedback">{errors.password2}</div>
                    )}
                  </div>
                  <input
                    type="submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//TODO: Why do I have to use propTypes
Register.propTypes = {
  // Remember that registerUser is an action but it's also a property
  //this.props.registeruser(newUser);
  registeruser: PropTypes.func.isRequired,
  // auth is also a property; inside mapStateToProps
  // TODO: What does isRequired mean
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
/**This function should take state as an argument, then return an object which maps that state to specific property names.
 * These properties will become accessible to your component via props.
 */
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { registeruser })(withRouter(Register));
