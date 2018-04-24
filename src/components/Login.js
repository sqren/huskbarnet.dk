import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { login } from '../services/firebase';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { textField } from './styles';
import ButtonProgress from './ButtonProgress';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  signupLink: {
    textDecoration: 'none'
  },
  textField: textField(theme)
});

class Login extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
    errorCode: null
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  onSubmit = async () => {
    this.setState({ isLoading: true, errorCode: null });
    try {
      await login(this.state.email, this.state.password);
    } catch (e) {
      this.setState({ isLoading: false, errorCode: e.code });
    }
  };

  render() {
    const { classes } = this.props;
    const { isLoading, errorCode, email, password } = this.state;

    return (
      <form className={classes.root}>
        <TextField
          label="Email"
          className={classes.textField}
          value={email}
          onChange={this.handleChange('email')}
          margin="normal"
        />

        <TextField
          label="Password"
          className={classes.textField}
          value={password}
          onChange={this.handleChange('password')}
          type="password"
          margin="normal"
        />

        <div>
          <a href="#/signup" className={classes.signupLink}>
            <Button variant="raised" color="default" type="button">
              Opret konto
            </Button>
          </a>
          <ButtonProgress
            type="button"
            isLoading={isLoading}
            label="Log ind"
            onClick={this.onSubmit}
          />
        </div>

        <Snackbar
          open={errorCode != null}
          autoHideDuration={4000}
          onClose={this.handleClose}
          message={<span>{parseError(errorCode)}</span>}
          className={classes.snackbar}
        />
      </form>
    );
  }
}

function parseError(errorCode) {
  switch (errorCode) {
    case null:
      return '';
    case 'auth/invalid-email':
      return 'Emailadressen er ugyldig';
    case 'auth/user-disabled':
      return 'Brugeren er deaktiveret';
    case 'auth/user-not-found':
      return 'Emailadressen eksisterer ikke';
    case 'auth/wrong-password':
      return 'Forkert adgangskode';
    case 'auth/too-many-requests':
      return 'For mange forsøg. Prøv igen senere';
    default:
      console.error(errorCode);
      return 'Der skete en fejl';
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
