<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: '',
      };
    },
    methods: {
      async register() {
        try {
          await axios.post('http://localhost:5000/api/auth/register', {
            username: this.username,
            password: this.password,
          });
          this.$router.push('/login'); // Redirect to login
        } catch (err) {
          this.error = err.response.data.message || 'Registration failed';
        }
      },
    },
  };
  </script>
  