import React from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './index.css';

function LoginForm () {


  return(
    <Container className="log-container">
      <div className="form-card">
        <Form>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="loginEmail" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="loginPassword" />
          </FormGroup>
          <Button color="info" className="submit-btn">Login</Button>
        </Form>
      </div>
      <p>Need an account?</p>
      <Link to="/signup" className="signup-link">Create an account here</Link>
    </Container>
  )
}

export default LoginForm;