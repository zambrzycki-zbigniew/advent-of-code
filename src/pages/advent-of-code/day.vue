<template>
  <Transition name="fade" mode="out-in">
    <v-container v-if="dataLoaded">
      <v-card class="mb-1">
        <v-card-title v-if="dayTitle">
          <span>{{ dayTitle }}</span><v-btn :href="aocLink" icon="mdi-page-next-outline" variant="plain" target="_blank" rel="noopener"></v-btn>
        </v-card-title>
        <v-card-subtitle class="mt-n6 mb-4">Day {{ day }}, {{ year }}</v-card-subtitle>
      </v-card>
      <div v-if="!differentExamples && exampleText">
        <v-textarea v-model="exampleText" hide-details label="Example" :rows="exampleText.split('\n').length"
          class="monospaced-textarea" outlined disabled></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[0]" class="my-1 mr-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon v-if="exampleResults[0][0] === examples[0]" icon="mdi-check" color="success" />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 1</span>
            </v-card-subtitle>
            <v-card-subtitle class="d-flex align-center justify-start">
              <span class="mt-n1 text-caption" v-if="exampleTimes[0] !== null">
                {{ Math.round(exampleTimes[0]*1000)/1000 }} ms
              </span>
            </v-card-subtitle>
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[0] }}</div>
                    <div :style="{
                      color:
                        exampleResults[0][0] === examples[0] ? 'lime' : 'red',
                    }">
                      {{ exampleResults[0][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>

          <v-card v-if="exampleResults[1]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon v-if="exampleResults[1][0] === examples[1]" icon="mdi-check" color="success" />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 2</span>
            </v-card-subtitle>
            <v-card-subtitle class="d-flex align-center justify-start">
              <span class="mt-n1 text-caption" v-if="exampleTimes[1] !== null">
                {{ Math.round(exampleTimes[1]*1000)/1000 }} ms
              </span>
            </v-card-subtitle>
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[1] }}</div>
                    <div :style="{
                      color:
                        exampleResults[1][0] === examples[1] ? 'lime' : 'red',
                    }">
                      {{ exampleResults[1][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <div v-else>
        <v-textarea v-if="exampleTexts[0]" hide-details v-model="exampleTexts[0]" label="Example 1"
          :rows="exampleTexts[0].split('\n').length" class="monospaced-textarea" outlined disabled></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[0]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon v-if="exampleResults[0][0] === examples[0]" icon="mdi-check" color="success" />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 1</span>
              <span class="ml-2 text-caption" v-if="exampleTimes[0] !== null">
                {{ exampleTimes[0] }} ms
              </span>
            </v-card-subtitle>
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[0] }}</div>
                    <div :style="{
                      color:
                        exampleResults[0][0] === examples[0] ? 'lime' : 'red',
                    }">
                      {{ exampleResults[0][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
        <v-textarea v-if="exampleTexts[1]" hide-details v-model="exampleTexts[1]" label="Example 2"
          :rows="exampleTexts[1].split('\n').length" class="monospaced-textarea" outlined disabled></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[1]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon v-if="exampleResults[1][0] === examples[1]" icon="mdi-check" color="success" />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 2</span>
              <span class="ml-2 text-caption" v-if="exampleTimes[1] !== null">
                {{ exampleTimes[1] }} ms
              </span>
            </v-card-subtitle>
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[1] }}</div>
                    <div :style="{
                      color:
                        exampleResults[1][0] === examples[1] ? 'lime' : 'red',
                    }">
                      {{ exampleResults[1][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <v-btn class="mt-0" prepend-icon="mdi-content-copy" @click="copyToClipboard">copy input to clipboard</v-btn>
      <Transition name="fade" mode="out-in">
        <v-alert v-if="copySuccess" type="success" border="start" position="absolute" location="bottom right">
          Input copied to clipboard!
        </v-alert>
      </Transition>
      <v-textarea v-model="text" hide-details label="Input" class="monospaced-textarea" rows="10" outlined
        disabled></v-textarea>
      <DayComponent v-if="DayComponent && inputs.length > 0" :inputs="inputs" :exampleInputs="exampleInputs"
        :part="part" :year="year" :day="day" :differentExamples="differentExamples" :dataLoaded="dataLoaded"
        :rawInput="text" @onExample="handleExampleResults" />
    </v-container>
    <v-container v-else class="d-flex align-center justify-center" style="min-height: 300px">
      <div class="text-center">
        <v-progress-circular indeterminate size="48" class="mb-3" />
        <div class="text-subtitle-2">Loading input and examples…</div>
      </div>
    </v-container>
  </Transition>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import DayComponent from "@/components/days/day.vue";

const isDev = process.env.NODE_ENV !== "production";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  part: {
    type: Number,
    required: false,
    default: null,
  },
  examples: {
    type: Array,
    required: true,
  },
});

const text = ref("");
const exampleText = ref("");
const exampleTexts = ref(["", ""]);
const inputs = ref([]);
const exampleInputs = ref([]);
const dayTitle = ref("");
// const DayComponent = shallowRef(null);
const parseInput = ref(null);
const differentExamples = ref(false);
const dataLoaded = ref(false);
const exampleResults = ref([
  [null, 0],
  [null, 0],
]);
const exampleTimes = ref([null, null]);

const copySuccess = ref(false);

const aocLink = computed(() => `https://adventofcode.com/${props.year}/day/${props.day}`);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(text.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy text: ", error);
  }
};

const handleExampleResults = ref((payload) => {
  if (payload?.results) exampleResults.value = payload.results;
  if (payload?.times) exampleTimes.value = payload.times;
});

const basePath = import.meta.env.BASE_URL || "/";

let titlesCache = {};
let titlesLoaded = false;
let titlesLoadPromise = null;
const attemptedTitleFetch = new Set();

const ensureTitlesLoaded = async () => {
  if (titlesLoaded) return titlesCache;
  if (!titlesLoadPromise) {
    titlesLoadPromise = fetch(`${basePath}titles.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}))
      .then((data) => {
        titlesCache = data || {};
        titlesLoaded = true;
        return titlesCache;
      });
  }
  return titlesLoadPromise;
};

const persistTitle = async (year, day, title) => {
  if (!isDev || !title) return;
  try {
    await fetch(`http://localhost:3001/titles`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [year]: { [day]: title } }),
    });
  } catch (err) {
    console.error("Failed to persist title:", err);
  }
};

const fetchTitleFromAoc = async (year, day) => {
  const key = `${year}-${day}`;
  if (attemptedTitleFetch.has(key)) return null;
  if (!isDev) return null;
  attemptedTitleFetch.add(key);
  try {
    const res = await fetch(`http://localhost:3001/aoc-title/${year}/${day}`);
    if (!res.ok) return null;
    const data = await res.json();
    const title = data?.title;
    if (title) {
      if (!titlesCache[year]) titlesCache[year] = {};
      titlesCache[year][day] = title;
      await persistTitle(year, day, title);
      return title;
    }
  } catch (err) {
    console.error("Failed to fetch AoC title:", err);
  }
  return null;
};

const loadTitle = async (year, day) => {
  dayTitle.value = "";
  await ensureTitlesLoaded();
  const cached = titlesCache?.[year]?.[day];
  if (cached) {
    dayTitle.value = cached;
    return;
  }
  const fetched = await fetchTitleFromAoc(year, day);
  if (fetched) dayTitle.value = fetched;
};

const normalizeParseResult = (value, sourceLabel) => {
  if (Array.isArray(value)) return value;
  const type = value === null ? "null" : typeof value;
  console.warn(
    `parseInput expected to return an array (${sourceLabel}), got ${type}; ignoring value.`
  );
  return [];
};

const safeFetchText = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const txt = await res.text();
    if (!txt || txt.includes("<!DOCTYPE html>")) return null;
    return txt;
  } catch (err) {
    console.error("Failed to fetch text", url, err);
    return null;
  }
};

const loadDayData = async (day) => {
  dataLoaded.value = false;
  let transitionResolve,
    transitionPromise = new Promise((r) => (transitionResolve = r));
  setTimeout(() => {
    transitionResolve();
  }, 300);
  differentExamples.value = false;
  exampleText.value = "";
  exampleTexts.value = ["", ""];
  try {
    const parseModule = await import(
      `@/components/days/${props.year}/${day}/parseInput.js`
    );
    parseInput.value = parseModule.parseInput;
    const inputUrl = `${basePath}inputs/${props.year}/${day}.txt`;
    const shouldFetchExamples =
      Array.isArray(props.examples) &&
      props.examples.some((v) => v !== null && v !== undefined);
    const exampleUrl = shouldFetchExamples
      ? `${basePath}inputs/${props.year}/${day}example.txt`
      : null;
    const examplePart1Url = shouldFetchExamples
      ? `${basePath}inputs/${props.year}/${day}example1.txt`
      : null;
    const examplePart2Url = shouldFetchExamples
      ? `${basePath}inputs/${props.year}/${day}example2.txt`
      : null;
    text.value = await safeFetchText(inputUrl);
    exampleText.value = exampleUrl ? await safeFetchText(exampleUrl) : null;
    exampleTexts.value[0] = examplePart1Url
      ? await safeFetchText(examplePart1Url)
      : null;
    exampleTexts.value[1] = examplePart2Url
      ? await safeFetchText(examplePart2Url)
      : null;
    differentExamples.value =
      !!exampleTexts.value[0] &&
      !exampleTexts.value[0].includes("<!DOCTYPE html>") &&
      !!exampleTexts.value[1] &&
      !exampleTexts.value[1].includes("<!DOCTYPE html>");
    inputs.value = text.value
      ? normalizeParseResult(parseInput.value(text.value), "input")
      : [];
    if (
      differentExamples.value &&
      exampleTexts.value[0] &&
      exampleTexts.value[1]
    )
      exampleInputs.value = [
        normalizeParseResult(
          parseInput.value(exampleTexts.value[0]),
          "example 1"
        ),
        normalizeParseResult(
          parseInput.value(exampleTexts.value[1]),
          "example 2"
        ),
      ];
    else if (exampleText.value)
      exampleInputs.value = normalizeParseResult(
        parseInput.value(exampleText.value),
        "example"
      );
    transitionPromise.then(() => (dataLoaded.value = true));
    loadTitle(props.year, day);
  } catch (error) {
    console.error(`Failed to load data for day ${day}:`, error);
  }
};

watch(
  () => [props.year, props.day],
  async ([, newDay]) => {
    await loadDayData(newDay);
  },
  { immediate: true }
);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.monospaced-textarea textarea {
  font-family: "Courier New", Courier, monospace;
}
</style>
