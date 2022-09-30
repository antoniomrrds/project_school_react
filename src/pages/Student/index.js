import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';

import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

import Axios from '../../services/Axios';
import history from '../../services/history';

import * as actions from '../../store/modules/auth/actions';

export default function Student({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    if (!id) return;
    (async function getData() {
      try {
        setIsLoading(true);
        const { data } = await Axios.get(`/Students/${id}`);
        const photo = get(data, 'Photos[0].url', '');

        setPhoto(photo);

        setName(data.name);
        setLastName(data.lastname);
        setEmail(data.email);
        setAge(data.age);
        setWeight(data.weight);
        setHeight(data.height);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);
        if (status == 400 || status == 404)
          errors.map((error) => toast.error(error));
        history.push('/');
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Name field must be between 3 and 255 characters');
    }

    if (lastname.length < 3 || lastname.length > 255) {
      formErrors = true;
      toast.error('lastName field must be between 3 and 255 characters');
    }
    if (!isInt(String(age))) {
      formErrors = true;
      toast.error('Age must be an integer');
    }
    if (!isEmail(email)) {
      formErrors = true;
      toast.error('invalid e-mail');
    }
    if (!isFloat(String(weight))) {
      formErrors = true;
      toast.error('Weight must be an integer or floating');
    }
    if (!isFloat(String(height))) {
      formErrors = true;
      toast.error('Height must be an integer or floating');
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await Axios.put(`/students/${id}`, {
          name,
          lastname,
          age,
          email,
          height,
          weight,
        });
        toast.success('Student changed successfully');
      } else {
        const { data } = await Axios.post(`/students/`, {
          name,
          lastname,
          age,
          email,
          height,
          weight,
        });
        toast.success('Student created successfully');
        history.push(`/student/${data.id}`);
      }
      setIsLoading(false);
    } catch (err) {
      // const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('unexpected error');
      }
      if (status == 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>{id ? 'Edit Student' : 'New Student'}</Title>
      {id && (
        <ProfilePicture>
          {photo ? <img src={photo} alt={name} /> : <FaUserCircle size={180} />}
          <Link to={`/photos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />

        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Your Last Name"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
        />

        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Your Age"
        />

        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Your Height"
        />

        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Your Weight"
        />

        <button type="submit">Submit</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
