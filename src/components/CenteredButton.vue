<template>
  <v-container class="d-flex align-center justify-center" style="height: 100vh">
    <div>
      <v-btn elevation="2" color="primary" @click="fetchMovie"
        >Fetch Movie</v-btn
      >
      <v-btn elevation="2" color="secondary" @click="goToSignup" class="ml-4"
        >Go to Signup</v-btn
      >
    </div>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "CenteredButton",
  methods: {
    async fetchMovie() {
      try {
        const response = await axios.get(
          "http://localhost:3000/movie/Back%20to%20the%20Future"
        );
        console.log(response.data);
        // You can handle the response data here, for example, displaying it in the UI
      } catch (error) {
        console.error("There was an error fetching the movie:", error);
      }
    },
    goToSignup() {
      this.$router.push("/signup");
    },
  },
};
</script>
