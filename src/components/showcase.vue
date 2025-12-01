<template>
  <v-container class="ma-0 pa-0">
    <v-card class="ma-0 mb-1">
      <v-card-title>Day {{ day }} input parser</v-card-title>
      <v-card-text>
         <highlightjs language="javascript" :code="parseFileContent"/>
      </v-card-text>
    </v-card>
    <v-card class="ma-0">
      <v-card-title>Day {{ day }} solver</v-card-title>
      <v-card-text>
         <highlightjs language="javascript" :code="solveFileContent"/>
      </v-card-text>
    </v-card>
  </v-container>
</template>
  
<script setup>
import { ref } from "vue";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
});

const files = import.meta.glob("./days/*/*/*.js", {
  query: "?raw",
  import: "default",
});
const solveFileContent = ref("");
const parseFileContent = ref("");

Object.keys(files).forEach(async (path) => {
  if (path.includes(`/${props.year}/${props.day}/parseInput.js`))
    parseFileContent.value = await files[path]();
    console.log(parseFileContent.value)
  if (path.includes(`/${props.year}/${props.day}/solve.js`))
    solveFileContent.value = await files[path]();
    console.log(solveFileContent.value)
});
</script>
  
