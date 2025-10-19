import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [form, setForm] = useState({
    name: '',
    registerNumber: '',
    year: '',
    college: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save user info to localStorage
    localStorage.setItem('userInfo', JSON.stringify(form));

    // Navigate to quiz page
    navigate('/quiz');
  };

  return (
   <div className="home-container">
  <div className="home-overlay" />
  <h1 className="home-title">WELCOME TO RECODEX</h1>
  <div className="home-form-box">
    <div>
      <center><h2>Enter Your Details</h2></center>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="registerNumber"
          placeholder="Register Number"
          value={form.registerNumber}
          onChange={handleChange}
          required
        />
        <input
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          required
        />
        <input
          name="college"
          placeholder="College"
          value={form.college}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Start Quiz</button>
      </form>
    </div>
  </div>
</div>

  );
};

export default Home;
