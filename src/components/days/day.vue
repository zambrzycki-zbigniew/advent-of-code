<template>
  <div class="d-flex">
    <v-card class="my-1" density="compact">
      <v-card-subtitle class="mt-1 d-flex align-center">
        <!-- <v-icon icon="mdi-check" color="success" /> -->
        <span>Part 1</span>
      </v-card-subtitle>
      <v-card-subtitle class="d-flex align-center justify-start">
        <span class="mt-n1 text-caption" v-if="resultTime[0] !== null">
          {{ resultTime[0] }} ms
        </span>
      </v-card-subtitle>
      <v-card-text class="ma-0 pa-1">
        <v-container class="ma-0 pa-0 ml-3" min-width="150px">
          <v-row>
            <v-col>
              <div v-if="result[0] !== null">{{ result[0] }}</div>
              <v-progress-circular indeterminate v-else-if="canRun" />
              <div v-else class="text-caption">No input yet</div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card class="my-1 ml-1" density="compact">
      <v-card-subtitle class="mt-1 d-flex align-center">
        <!-- <v-icon icon="mdi-check" color="success" /> -->
        <span>Part 2</span>
      </v-card-subtitle>
      <v-card-subtitle class="d-flex align-center justify-start">
        <span class="mt-n1 text-caption" v-if="resultTime[1] !== null">
          {{ resultTime[1] }} ms
        </span>
      </v-card-subtitle>
      <v-card-text class="ma-0 pa-1">
        <v-container class="ma-0 pa-0 ml-3" min-width="150px">
          <v-row>
            <v-col>
              <div v-if="result[1] !== null">{{ result[1] }}</div>
              <v-progress-circular indeterminate v-else-if="canRun" />
              <div v-else class="text-caption">No input yet</div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-btn
      class="my-1 ml-1"
      height="auto"
      @click="showcaseDialog = true"
      v-if="!allowPeek"
      >Show solution</v-btn
    >
    <v-btn
      class="my-1 ml-1"
      height="auto"
      v-if="isDev && !allowPeek"
      @click="devBypass"
      >Preview</v-btn
    >
  </div>
  <Showcase :year="year" :day="day" v-if="allowPeek" />
  <v-dialog v-model="showcaseDialog" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="text-h6">Hold on there, partner!</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <!-- Left column for image -->
            <v-col cols="5">
              <span> {{ peekBanter }}</span>
              <v-img src="@/assets/elf.png" max-height="600px" contain></v-img>
            </v-col>

            <!-- Right column for inputs -->
            <v-col cols="7">
              <v-textarea
                v-model="peekInputText"
                label="Your Input"
                rows="20"
                outlined
              ></v-textarea>

              <v-row class="mt-4">
                <v-col>
                  <v-text-field
                    v-model="peekPart1Solution"
                    label="Your Part 1 Solution"
                    type="number"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="peekPart2Solution"
                    label="Your Part 2 Solution"
                    type="number"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog">{{
          allowPeek ? "Exit" : "Cancel"
        }}</v-btn>
        <v-btn
          variant="text"
          :loading="peekLoading"
          :disabled="peekLoading || allowPeek"
          v-if="!allowPeek"
          @click="checkSolutions"
        >
          Check
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
  <script setup>
import { ref, onMounted, watch, onUnmounted, computed } from "vue";
import Showcase from "../showcase.vue";
const isDev = process.env.NODE_ENV !== "production";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  inputs: {
    type: Array,
    required: true,
  },
  exampleInputs: {
    type: Array,
    required: true,
  },
  part: {
    type: [Number, null],
    required: false,
    default: null,
  },
  day: {
    type: Number,
    required: true,
  },
  differentExamples: {
    type: Boolean,
    required: true,
  },
  dataLoaded: {
    type: Boolean,
    required: true,
  },
  rawInput: {
    type: String,
    required: true,
  },
});

const showcaseDialog = ref(false);

const emit = defineEmits(["onExample"]);
const exampleResult = ref([null, null]);
const exampleTime = ref([null, null]);

const result = ref([null, null]);
const resultTime = ref([null, null]);
const isCalculating = ref(false);
let worker;
const canRun = computed(() => props.inputs && props.inputs.length > 0);

const peekInputText = ref("");
const peekPart1Solution = ref(null);
const peekPart2Solution = ref(null);
const peekSolutions = ref([null, null]);
const allowPeek = ref(false);
const peekLoading = ref(false);
const peekPromise = ref(new Promise((r) => r));
const peekBanter = ref(
  "There's a toll on this road—you need to provide your input and solutions before you can check how I got mine!"
);

const closeDialog = () => {
  showcaseDialog.value = false;
};

const devBypass = () => {
  if (!isDev) return;
  allowPeek.value = true;
  showcaseDialog.value = false;
};

const checkSolutions = async () => {
  try {
    const parseModule = await import(
      `@/components/days/${props.year}/${props.day}/parseInput.js`
    );
    let peekInput = parseModule.parseInput(peekInputText.value);
    const part1Correct =
      parseInt(peekPart1Solution.value) === parseInt(result.value[0]);
    const part2Correct =
      parseInt(peekPart2Solution.value) === parseInt(result.value[1]);
    const inputMatches =
      JSON.stringify(peekInput) === JSON.stringify(props.inputs);
    if (!(part1Correct && part2Correct) && !inputMatches) {
      peekBanter.value = "'aight, let me see...";
      peekPromise.value = new Promise((resolve) => setTimeout(resolve, 1000));
      peekLoading.value = true;
      worker.postMessage({
        type: "solvePart1",
        year: props.year,
        day: props.day,
        inputs: JSON.parse(JSON.stringify(peekInput)),
        peek: true,
      });
      worker.postMessage({
        type: "solvePart2",
        year: props.year,
        day: props.day,
        inputs: JSON.parse(JSON.stringify(peekInput)),
        peek: true,
      });
    } else {
      peekBanter.value =
        "Trying to swindle an elf with a gun using his own solutions? No wonder you couldn't come up with your own!";
    }
  } catch (error) {
    console.error("Error in checkSolutions:", error);
    peekBanter.value =
      "Something went wrong. If anyone asks, we've never seen each other.";
  }
};

onMounted(() => {
  worker = new Worker(new URL("@/workers/solveWorker.js", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (event) => {
    const { type, partialResult, peek, durationMs } = event.data;
    if (!peek) {
      if (type === "solvePart1") {
        result.value[0] = partialResult;
        resultTime.value[0] = durationMs ?? null;
      } else if (type === "solvePart2") {
        result.value[1] = partialResult;
        resultTime.value[1] = durationMs ?? null;
      } else if (type === "examplePart1") {
        exampleResult.value[0] = partialResult;
        exampleTime.value[0] = durationMs ?? null;
        emit("onExample", {
          results: [[exampleResult.value[0]], [exampleResult.value[1]]],
          times: [...exampleTime.value],
        });
      } else if (type === "examplePart2") {
        exampleResult.value[1] = partialResult;
        exampleTime.value[1] = durationMs ?? null;
        emit("onExample", {
          results: [[exampleResult.value[0]], [exampleResult.value[1]]],
          times: [...exampleTime.value],
        });
      } else if (type === "error") console.error(event.data.error);
    } else {
      if (type === "solvePart1") peekSolutions.value[0] = partialResult;
      else if (type === "solvePart2") peekSolutions.value[1] = partialResult;
      peekPromise.value.then(() => {
        if (
          parseInt(peekPart1Solution.value) === peekSolutions.value[0] &&
          parseInt(peekPart2Solution.value) === peekSolutions.value[1]
        ) {
          allowPeek.value = true;
          peekLoading.value = false;
          peekBanter.value = "Okay, looks fine. Get on with it then!";
        } else if (
          peekSolutions.value[0] !== null &&
          peekSolutions.value[1] !== null
        ) {
          peekLoading.value = false;
          peekBanter.value = "... I don't like 'em.";
        }
      });
    }
  };

  worker.onerror = (error) => {
    console.error("Worker error:", error);
    isCalculating.value = false;
  };

  watch(
    () => [
      props.inputs,
      props.part,
      props.exampleInputs,
      props.differentExamples,
      props.dataLoaded,
    ],
    ([newInputs, newPart, newExample, newDifferentExamples, newDataLoaded]) => {
      allowPeek.value = false;
      if (newInputs && newInputs.length > 0 && newDataLoaded) {
        isCalculating.value = true;
        if (newExample && newExample.length > 0) {
          if (newPart === 1 || newPart === null) {
            worker.postMessage({
              type: "examplePart1",
              year: props.year,
              day: props.day,
              example: JSON.parse(JSON.stringify(newExample)),
              differentExamples: newDifferentExamples,
            });
          }
          if (newPart === 2 || newPart === null) {
            worker.postMessage({
              type: "examplePart2",
              year: props.year,
              day: props.day,
              example: JSON.parse(JSON.stringify(newExample)),
              differentExamples: newDifferentExamples,
            });
          }
        }
        if (newPart === 1 || newPart === null) {
          worker.postMessage({
            type: "solvePart1",
            year: props.year,
            day: props.day,
            inputs: JSON.parse(JSON.stringify(newInputs)),
          });
        }
        if (newPart === 2 || newPart === null) {
          worker.postMessage({
            type: "solvePart2",
            year: props.year,
            day: props.day,
            inputs: JSON.parse(JSON.stringify(newInputs)),
          });
        }
      }
    },
    { immediate: true, deep: true }
  );
});

onUnmounted(() => {
  worker.terminate();
});
</script>
