<template>
  <div>
    <div :class="['card', cardColorClass, isVertical ? 'rotated-card' : '', !isBotCard ? 'hover-effect' : '']"  v-if="!isBotCard">
      <!-- Ellipse -->
    <div v-if="isWildCard"><img src="@/assets/WildCard.jpg" alt="wild" class="card-back-image" /></div>
      <div class="ellipse" v-if="!isWildCard"></div>
  
      <!-- Large centered content with the card color applied directly -->
      <div v-if="isNumberCard" class="large-content">{{ card.number }}</div>
      <div v-if="isSkipCard" class="large-content">⦸</div>
      <div v-if="isReverseCard" class="large-content">↻</div>
      <div v-if="isDrawCard" class="large-content"><span class="plus-symbol">+</span>2</div>
      <div v-if="isWildDrawCard" class="large-content"><span class="plus-symbol">+</span>4</div>
  
      <!-- Small upper-left corner content with card color applied directly -->
      <div v-if="isNumberCard" class="corner-content top-left">{{ card.number }}</div>
      <div v-if="isSkipCard" class="corner-content top-left">⦸</div>
      <div v-if="isReverseCard" class="corner-content top-left">↻</div>
      <div v-if="isDrawCard" class="corner-content top-left"><span class="plus-symbol small">+</span>2</div>
      <div v-if="isWildDrawCard" class="corner-content top-left"><span class="plus-symbol small">+</span>4</div>
  
      <!-- Small bottom-right corner content with card color applied directly -->
      <div v-if="isNumberCard" class="corner-content bottom-right">{{ card.number }}</div>
      <div v-if="isSkipCard" class="corner-content bottom-right">⦸</div>
      <div v-if="isReverseCard" class="corner-content bottom-right">↻</div>
      <div v-if="isDrawCard" class="corner-content bottom-right"><span class="plus-symbol small">+</span>2</div>
      <div v-if="isWildDrawCard" class="corner-content bottom-right"><span class="plus-symbol small">+</span>4</div>
    </div>
    <div v-if="isBotCard" :class="['card-back', isVertical ? 'rotated-card' : '']">
    <img src="@/assets/uno-back.png" alt="UNO Back" class="card-back-image" />
  </div>
    </div>
  </template>
  
  
  

<script lang="ts">
import { defineComponent } from 'vue';

import type { ICard } from '../interfaces/IDeck.js';

export default defineComponent({
  name: 'UNOCard',
  props: {
    card: {
      type: Object as () => ICard,
      required: true,
    },
    isBotCard: {
      type: Boolean,
      default: false, // Add this prop to differentiate bot cards from player cards
    },
    isVertical: {
      type: Boolean,
      default: false, // Add this prop to control card rotation
    },
  },
  computed: {
    cardColorClass() {
      const color = this.card.color ? this.card.color.toLowerCase() : 'black';
      return color;
    },
    isNumberCard() {
      return this.card.type === 'NUMBERED';
    },
    isSkipCard() {
      return this.card.type === 'BLOCK';
    },
    isReverseCard() {
      return this.card.type === 'REVERSE';
    },
    isDrawCard() {  
      return this.card.type === 'DRAW2';
    },
    isWildCard() {
      return this.card.type === 'WILD';
    },
    isWildDrawCard() {
      return this.card.type === 'DRAW4';
    },
  },
});
</script>

<style scoped>
/* Card base styles */ 
.card {
  width: 100px;
  height: 160px;
  border-radius: 16px;
  display: inline-block;
  position: relative;
  border: 10px solid white;
  margin: 10px;
  box-sizing: border-box; /* Ensures borders are counted in the width and height */
}

.card-back {
  width: 100px;
  height: 160px;
  border-radius: 16px;
  display: inline-block;
  position: relative;
  
  box-sizing: border-box; /* Ensures borders are counted in the width and height */
}

.card-back-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image fills the entire div */
  border-radius: 16px; /* Keeps the rounded corners */
}

.rotated-card {
  transform: rotate(90deg); /* Rotate the card for side bots */
  transform-origin: center center;
}

.red { background-color: #C11F1F; }
.green { background-color: #3E9E32; }
.blue { background-color: #3F4CFF; }
.yellow { background-color: #DED71F; }
.black { background-color: black; }

/* Ellipse */
.ellipse {
  background-color: transparent; /* Make the ellipse background transparent */
  width: 80%;
  height: 65%;
  border-radius: 50%;
  margin: auto;
  transform: skewX(-25deg);
  position: absolute;
  top: 10%;
  border: 10px solid white; /* Add a white outline */
}

/* Large centered content (numbers) */
.large-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 56px;
  color: white; /* Make the number in the center white */
  font-weight: bold; /* Make the numbers bolder */
  font-family: 'Arial', sans-serif; /* You can choose a different font */
}


/* Corner symbols (Small corner content) - Always white */
.corner-content {
  position: absolute;
  font-size: 22px; /* Slightly increase the font size for the corner content */
  font-weight: bold;
  color: white; /* Make the corner content white */
  font-family: 'Arial', sans-serif; /* You can adjust this as per preference */
}

.top-left {
  top: 5px;
  left: 10px;
}

.bottom-right {
  right: 10px;
  bottom: 5px;
  transform: rotate(180deg);
}
.segment {
  width: 45%;
  height: 45%;
  border-radius: 50%;
}

.plus-symbol {
  font-size: 30px; /* Smaller font size for + in the middle */
}

/* Styling for smaller corner + symbols */
.plus-symbol.small {
  font-size: 14px; /* Smaller font size for + in corners */
}
 
    .yellow {
    background-color: yellow;
    top: 0;
    left: 0;
    }

    .green {
    background-color: green;
    top: 0;
    right: 0;
    }

    .blue {
    background-color: blue;
    bottom: 0;
    left: 0;
    }

    .red {
    background-color: red;
    bottom: 0;
    right: 0;
    }

    /* Positioning of the corner wild content */
    .corner-wild-content {
    position: absolute;
    width: 20px;
    height: 30px;
    }

    .top-left {
    top: 5px;
    left: 10px;
    }

    .bottom-right {
    right: 10px;
    bottom: 5px;
    transform: rotate(180deg); /* Inverts for the opposite corner */
    }


.rotated-card  {
    margin-bottom: -20px;
    transform: rotate(90deg);
    transform-origin: center center;
  }

.hover-effect {
  border-radius: 10px;
  transition: all 0.3s ease; /* Smooth transition */
}

/* Hover effect */
.hover-effect:hover {
  width: 120px; /* Slightly increase the size */
  height: 192px; /* Slightly increase the size */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* Add shadow */
}


</style>
