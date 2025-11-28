<template>
  <v-app>
    <v-navigation-drawer app :rail="rail" permanent @click="rail = false">
      <v-list-item prepend-icon="mdi-home" :to="`/`">
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop.prevent="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>
      <v-list density="compact">
        <template v-for="year in years" :key="year">
          <v-list-subheader>{{ year }}</v-list-subheader>
          <v-list-item
            min-height="32"
            v-for="day in dayNumbers"
            :key="`${year}-${day}`"
            :to="hasDay(year, day) ? `/${year}/days/${day}` : null"
            :disabled="!hasDay(year, day)"
            link
          >
            <v-list-item-title v-if="!rail" class="d-flex justify-space-between">
              Day {{ day }}
              <span>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      :color="getStarColor(year, day, 1).color"
                      icon="mdi-star"
                    />
                  </template>
                  <template v-slot:default>
                    {{ getStarColor(year, day, 1).time }}
                  </template>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      :color="getStarColor(year, day, 2).color"
                      icon="mdi-star"
                    />
                  </template>
                  <template v-slot:default>
                    {{ getStarColor(year, day, 2).time }}
                  </template>
                </v-tooltip>
              </span>
            </v-list-item-title>
            <v-list-item-title v-else>{{ day }}</v-list-item-title>
            <template v-slot:append>
              <v-btn
                density="compact"
                color="transparent"
                :disabled="false"
                v-if="isDev && !rail"
                :icon="hasDay(year, day) ? 'mdi-pencil' : 'mdi-plus'"
                @click.stop="openDialog(year, day)"
                style="pointer-events: auto"
              ></v-btn>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-dialog v-model="dialogVisible" max-width="600">
      <v-card>
        <v-card-title>Edit {{ dialogYear }} Day {{ dialogDay }}</v-card-title>
        <v-card-text>
          <v-textarea
            label="Input"
            v-model="dialogData.input"
            outlined
          ></v-textarea>
          <v-textarea
            label="Example 1"
            v-model="dialogData.example1"
            outlined
          ></v-textarea>
          <v-textarea
            label="Example 2"
            v-model="dialogData.example2"
            outlined
          ></v-textarea>
          <v-btn-toggle v-model="dialogData.outputType" mandatory @update:modelValue="console.log($event)">
            <v-btn>Number</v-btn>
            <v-btn>String</v-btn>
          </v-btn-toggle>
          <v-text-field
            label="Example Solution 1"
            :type="dialogData.outputType === 0 ? 'number' : 'string'"
            v-model="dialogData.exampleSolution1"
            outlined
          ></v-text-field>
          <v-text-field
            label="Example Solution 2"
            :type="dialogData.outputType === 0 ? 'number' : 'string'"
            v-model="dialogData.exampleSolution2"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text @click="saveData">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const isDev = process.env.NODE_ENV !== "production";
const basePath = import.meta.env.BASE_URL || "/";
const defaultYear = 2024;

const drawer = ref(true);
const rail = ref(false);
const dialogVisible = ref(false);
const dialogYear = ref(defaultYear);
const dialogDay = ref(null);
const dialogData = ref({
  input: "",
  example1: "",
  example2: "",
  exampleSolution1: "",
  exampleSolution2: "",
  outputType: 0,
});

const completionByYear = ref({});
const examples = ref({});

const dayNumbers = Array.from({ length: 25 }, (_, i) => i + 1);
const dayFiles = import.meta.glob("@/components/days/*/*/solve.js");
const dayMap = ref({});

Object.keys(dayFiles).forEach((filePath) => {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const match = normalizedPath.match(/days\/([^/]+)\/([^/]+)\/solve\.js$/);
  if (!match) return;
  const year = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  if (!dayMap.value[year]) dayMap.value[year] = [];
  if (!dayMap.value[year].includes(day)) dayMap.value[year].push(day);
});

Object.keys(dayMap.value).forEach((year) =>
  dayMap.value[year].sort((a, b) => a - b)
);

const years = computed(() => {
  const list = Object.keys(dayMap.value)
    .map((year) => parseInt(year, 10))
    .sort((a, b) => b - a);
  return list.length ? list : [defaultYear];
});

const hasDay = (year, day) => !!dayMap.value[year]?.includes(day);

async function getLeaderboardData(year = defaultYear) {
  const urls = [
    `${basePath}leaderboard_member_${year}.json`,
    `${basePath}leaderboard_member_3788958.json`,
  ];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch from ${url}: ${response.statusText}`);
        continue;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn(`Unexpected content type from ${url}: ${contentType}`);
        continue;
      }

      const data = await response.json();
      completionByYear.value[year] = data.completion_day_level || data;
      return;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
    }
  }

  console.error("Failed to fetch leaderboard data from all sources.");
}

getLeaderboardData();

async function fetchExamples() {
  try {
    const response = await fetch(`${basePath}examples.json`);
    if (response.ok) {
      examples.value = await response.json();
    } else {
      console.error("Failed to load examples.json");
    }
  } catch (error) {
    console.error("Error fetching examples.json:", error);
  }
}

onMounted(() => {
  fetchExamples();
});

function formatTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function getStarColor(year, day, part) {
  let star = { color: "gray", time: "not yet" };
  const completion = completionByYear.value[year];
  if (completion && completion[day] && completion[day][part]) {
    star = {
      color: "amber",
      time: formatTimestamp(completion[day][part].get_star_ts),
    };
  }
  return star;
}

async function openDialog(year, day) {
  dialogYear.value = year;
  dialogDay.value = day;
  dialogData.value = {
    input: "",
    example1: "",
    example2: "",
    exampleSolution1: "",
    exampleSolution2: "",
    outputType: 0,
  };

  const examplesForYear = examples.value[year] || examples.value;

  if (hasDay(year, day)) {
    try {
      const prefix = `${basePath}inputs/${year}/`;
      await Promise.all([
        fetch(`${prefix}${day}.txt`).then((res) =>
          res
            .text()
            .then((text) => (text.includes("<!DOCTYPE html>") ? "" : text))
        ),
        fetch(`${prefix}${day}example.txt`).then((res) =>
          res
            .text()
            .then((text) =>
              text.includes("<!DOCTYPE html>")
                ? fetch(`${prefix}${day}example1.txt`).then((res2) =>
                    res2
                      .text()
                      .then((text2) =>
                        text2.includes("<!DOCTYPE html>") ? "" : text2
                      )
                  )
                : text
            )
        ),
        fetch(`${prefix}${day}example2.txt`).then((res) =>
          res
            .text()
            .then((text) => (text.includes("<!DOCTYPE html>") ? "" : text))
        ),
      ])
        .then(([input, example1, example2]) => {
          dialogData.value.input = input;
          dialogData.value.example1 = example1;
          dialogData.value.example2 = example2;
          dialogData.value.exampleSolution1 =
            examplesForYear?.[day]?.[0] ?? null;
          dialogData.value.exampleSolution2 =
            examplesForYear?.[day]?.[1] ?? null;
        })
        .then(() => {
          setTimeout(() => (dialogVisible.value = true), 10);
        });
    } catch (error) {
      console.error("Error fetching data for dialog:", error);
    }
  } else dialogVisible.value = true;
}

function closeDialog() {
  dialogVisible.value = false;
  dialogDay.value = null;
}

function saveData() {
  if (!isDev) return;

  const year = dialogYear.value;
  const day = dialogDay.value;
  if (!day || !year) return;

  const data = dialogData.value;

  const newExamples = {
    [year]: {
      [day]: [],
    },
  };
  if (data.outputType === 0)
    newExamples[year][day].push(
      parseInt(data.exampleSolution1),
      parseInt(data.exampleSolution2)
    );
  else newExamples[year][day].push(data.exampleSolution1, data.exampleSolution2);

  Promise.all([
    fetch(`http://localhost:3001/inputs/${year}/${day}.txt`, {
      method: "PUT",
      body: data.input,
    }),
    fetch(`http://localhost:3001/inputs/${year}/${day}example1.txt`, {
      method: "PUT",
      body: data.example1,
    }),
    fetch(`http://localhost:3001/inputs/${year}/${day}example2.txt`, {
      method: "PUT",
      body: data.example2,
    }),
    fetch(`http://localhost:3001/examples`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExamples),
    }),
    fetch(`http://localhost:3001/create-day/${year}/${day}`, {
      method: "POST",
    }),
  ])
    .then(() => {
      console.log("Files and examples.json updated successfully");
      const examplesForYear = examples.value[year] || {};
      if (data.outputType === 0)
        examplesForYear[day] = [
          parseInt(data.exampleSolution1),
          parseInt(data.exampleSolution2),
        ];
      else
        examplesForYear[day] = [
          data.exampleSolution1,
          data.exampleSolution2,
        ];
      examples.value = {
        ...examples.value,
        [year]: examplesForYear,
      };
    })
    .catch((error) =>
      console.error("Error saving files or examples.json:", error)
    );

  closeDialog();
}
</script>
