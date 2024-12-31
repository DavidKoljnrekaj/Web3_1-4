<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
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
      async login() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            username: this.username,
            password: this.password,
          });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', this.username);
          this.$router.push('/'); // Redirect to games list
        } catch (err) {
          this.error = err.response.data.message || 'Login failed';
        }
      },
    },
  };
  </script>
  