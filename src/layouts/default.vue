<template>
  <v-app>
    <v-navigation-drawer
      app
      :rail="rail"
      permanent
      @click="rail = false"
      :width="rail ? undefined : drawerWidth"
    >
      <v-list-item prepend-icon="mdi-home" :to="`/`">
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop.prevent="toggleRail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>
      <v-list-item v-if="isDev && !rail">
        <v-btn
          block
          prepend-icon="mdi-calendar-plus"
          @click.stop="openYearDialog"
        >
          Add year
        </v-btn>
      </v-list-item>

      <v-list
        density="compact"
        :opened="openYears"
        @update:opened="(val) => (openYears = val)"
        open-strategy="single"
      >
        <v-list-group
          v-for="year in years"
          :key="year.toString()"
          :value="year.toString()"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="year.toString()"
              prepend-icon="mdi-calendar"
            />
          </template>

          <v-list-item
            min-height="32"
            v-for="day in Array.from(
              { length: daysForYear(year) },
              (_, i) => i + 1
            )"
            :key="`${year}-${day}`"
            :to="
              hasDay(year, day) && isAvailable(year, day)
                ? `/${year}/days/${day}`
                : null
            "
            :disabled="!hasDay(year, day) || !isAvailable(year, day)"
            link
          >
            <v-list-item-title
              v-if="!rail"
              class="d-flex justify-space-between text-body-2"
            >
              <span style="white-space: nowrap">
                Day {{ day }}
                <span v-if="getTitle(year, day)"> - {{ getTitle(year, day) }}</span>
              </span>
              <span>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      :color="getStarInfo(year, day, 1).color"
                      icon="mdi-star"
                    />
                  </template>
                  <template v-slot:default>
                    <div
                      v-for="(line, idx) in getStarInfo(year, day, 1).lines"
                      :key="idx"
                    >
                      {{ line }}
                    </div>
                  </template>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      :color="getStarInfo(year, day, 2).color"
                      icon="mdi-star"
                    />
                  </template>
                  <template v-slot:default>
                    <div
                      v-for="(line, idx) in getStarInfo(year, day, 2).lines"
                      :key="idx"
                    >
                      {{ line }}
                    </div>
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
        </v-list-group>
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
          <v-btn-toggle
            v-model="dialogData.outputType"
            mandatory
            @update:modelValue="console.log($event)"
          >
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

    <v-dialog v-model="yearDialogVisible" max-width="500">
      <v-card>
        <v-card-title>Add year</v-card-title>
        <v-card-text>
          <v-text-field label="Year" v-model.number="newYear" type="number" />
          <v-text-field
            label="Day count"
            v-model.number="newYearDayCount"
            type="number"
            min="1"
            max="31"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeYearDialog">Cancel</v-btn>
          <v-btn text @click="saveYear">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const isDev = process.env.NODE_ENV !== "production";
const basePath = import.meta.env.BASE_URL || "/";
const defaultYear = 2024;
const openYears = ref([]);
const yearsConfig = ref({});
const lastUpdated = ref({});
const inputCreated = ref({});

const drawer = ref(true);
const rail = ref(false);
const dialogVisible = ref(false);
const dialogYear = ref(defaultYear);
const dialogDay = ref(null);
const yearDialogVisible = ref(false);
const newYear = ref("");
const newYearDayCount = ref(25);
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
const titles = ref({});

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
  const configYears = Object.keys(yearsConfig.value).map((y) =>
    parseInt(y, 10)
  );
  const merged = Array.from(
    new Set([...list, ...configYears, defaultYear])
  ).sort((a, b) => b - a);
  return merged;
});

const daysForYear = (year) => {
  if (yearsConfig.value[year]) return parseInt(yearsConfig.value[year], 10);
  return dayMap.value[year]?.length || 25;
};

const hasDay = (year, day) => !!dayMap.value[year]?.includes(day);
const dayAvailability = ref({});
const setAvailability = (year, day, available) => {
  if (!dayAvailability.value[year]) dayAvailability.value[year] = {};
  dayAvailability.value[year][day] = available;
  dayAvailability.value = { ...dayAvailability.value };
};
const isAvailable = (year, day) => dayAvailability.value[year]?.[day] === true;
const sse = ref(null);
const route = useRoute();
const fetchedLeaderboardYears = ref(new Set());

async function fetchLeaderboard(year) {
  if (fetchedLeaderboardYears.value.has(year)) return;
  const url = `${basePath}leaderboard_member_${year}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch from ${url}: ${response.statusText}`);
      return;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Unexpected content type from ${url}: ${contentType}`);
      return;
    }

    const data = await response.json();
    completionByYear.value[year] = data.completion_day_level || data;
    fetchedLeaderboardYears.value = new Set([
      ...fetchedLeaderboardYears.value,
      year,
    ]);
  } catch (error) {
    console.error(`Error fetching leaderboard for ${year}:`, error);
  }
}

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
  fetchTitles();
});

async function fetchLastUpdated() {
  try {
    const res = await fetch(`${basePath}last-updated.json`, {
      cache: "no-store",
    });
    if (res.ok) {
      lastUpdated.value = await res.json();
    }
  } catch (error) {
    console.error("Error fetching last-updated.json:", error);
  }
}

fetchLastUpdated();

async function fetchInputCreated() {
  try {
    const res = await fetch(`${basePath}input-created.json`, {
      cache: "no-store",
    });
    if (res.ok) {
      inputCreated.value = await res.json();
    }
  } catch (error) {
    console.error("Error fetching input-created.json:", error);
  }
}

fetchInputCreated();

onMounted(() => {
  if (!isDev) return;
  try {
    const origin = window.location.origin.replace(/:\d+$/, ":3001");
    const es = new EventSource(`${origin}/inputs-events`);
    es.onmessage = () => {
      location.reload();
    };
    sse.value = es;
  } catch (err) {
    console.error("Failed to initialize inputs watcher SSE:", err);
  }
});

onUnmounted(() => {
  if (sse.value) sse.value.close();
});

watch(
  years,
  (val) => {
    if (val?.length && openYears.value.length === 0) {
      openYears.value = [val[0].toString()];
    }
  },
  { immediate: true }
);

async function fetchYearsConfig() {
  try {
    const response = await fetch(`${basePath}years.json`);
    if (response.ok) {
      yearsConfig.value = await response.json();
    }
  } catch (error) {
    console.error("Error fetching years.json:", error);
  }
}

fetchYearsConfig();

watch(
  () => route.fullPath,
  (path) => {
    const match = path.match(/\/(\d{4})\/days\/\d+/);
    const activeYear = match ? match[1] : null;
    if (!activeYear) return;
    openYears.value = [activeYear];
  },
  { immediate: true }
);

async function fetchAvailability() {
  years.value.forEach((year) => {
    const maxDay = daysForYear(year);
    const last = parseInt(lastUpdated.value[year] || 0, 10);
    if (last) {
      for (let d = 1; d <= maxDay; d += 1) {
        setAvailability(year, d, d <= last);
      }
    } else {
      for (let d = 1; d <= maxDay; d += 1) {
        setAvailability(year, d, hasDay(year, d));
      }
    }
  });
}

watch(
  () => [years.value, yearsConfig.value],
  () => {
    fetchAvailability();
    years.value.forEach((year) => fetchLeaderboard(year));
  },
  { immediate: true, deep: true }
);

function formatTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatMillis(ms) {
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatDurationMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hoursNum = Math.floor(totalSeconds / 3600);
  const minutesNum = Math.floor((totalSeconds % 3600) / 60);
  const secondsNum = totalSeconds % 60;
  const parts = [];
  if (hoursNum > 0) parts.push(`${String(hoursNum).padStart(2, "0")}h`);
  if (minutesNum > 0) parts.push(`${String(minutesNum).padStart(2, "0")}m`);
  if (hoursNum === 0 && minutesNum === 0) {
    parts.push(`${String(secondsNum).padStart(2, "0")}s`);
  }
  return parts.join(" ");
}

function getStarInfo(year, day, part) {
  const completion = completionByYear.value[year];
  const createdAtRaw =
    inputCreated.value?.[year]?.[day] !== undefined
      ? inputCreated.value[year][day]
      : null;
  const part1Ts = completion?.[day]?.[1]?.get_star_ts || null;
  const part2Ts = completion?.[day]?.[2]?.get_star_ts || null;
  const part1Ms = part1Ts ? part1Ts * 1000 : null;
  const part2Ms = part2Ts ? part2Ts * 1000 : null;
  const createdAt =
    createdAtRaw && part1Ms && createdAtRaw > part1Ms ? null : createdAtRaw;
  const lines = [];
  let color = "gray";

  if (part === 1) {
    if (createdAt) lines.push(`Input: ${formatMillis(createdAt)}`);
    if (part1Ts) {
      color = "amber";
      lines.push(`Done: ${formatTimestamp(part1Ts)}`);
      if (createdAt) {
        lines.push(`Duration: ${formatDurationMs(part1Ms - createdAt)}`);
      }
    }
  } else if (part === 2) {
    if (part2Ts) {
      color = "amber";
      lines.push(`Done: ${formatTimestamp(part2Ts)}`);
      if (part1Ts) {
        lines.push(`Duration: ${formatDurationMs(part2Ms - part1Ms)}`);
      }
    }
  }

  if (lines.length === 0) lines.push("not yet");
  return { color, lines };
}

async function fetchTitles() {
  try {
    const res = await fetch(`${basePath}titles.json`);
    if (res.ok) {
      titles.value = await res.json();
    }
  } catch (error) {
    console.error("Error fetching titles.json:", error);
  }
}

const getTitle = (year, day) => {
  const y = year?.toString();
  const d = day?.toString();
  return titles.value?.[y]?.[d] || null;
};

const maxLabelLength = computed(() => {
  let max = 0;
  years.value.forEach((year) => {
    for (let day = 1; day <= daysForYear(year); day += 1) {
      const title = getTitle(year, day);
      const label = title ? `Day ${day} - ${title}` : `Day ${day}`;
      max = Math.max(max, label.length);
    }
  });
  return max || 10;
});

const drawerWidth = computed(() => {
  // rough width estimate per character plus padding/icons; lean wider to avoid clipping
  const estimated = maxLabelLength.value * 10 + 120;
  return Math.max(240, Math.min(480, estimated));
});

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
  else
    newExamples[year][day].push(data.exampleSolution1, data.exampleSolution2);

  const requests = [];

  // always save main input
  requests.push(
    fetch(`http://localhost:3001/inputs/${year}/${day}.txt`, {
      method: "PUT",
      body: data.input,
    })
  );

  const hasExample1 = !!data.example1;
  const hasExample2 = !!data.example2;

  if (hasExample1 && hasExample2) {
    // two examples: write example1/example2 and remove single example file
    requests.push(
      fetch(`http://localhost:3001/inputs/${year}/${day}example1.txt`, {
        method: "PUT",
        body: data.example1,
      })
    );
    requests.push(
      fetch(`http://localhost:3001/inputs/${year}/${day}example2.txt`, {
        method: "PUT",
        body: data.example2,
      })
    );
    requests.push(
      fetch(`http://localhost:3001/inputs/${year}/${day}example.txt`, {
        method: "DELETE",
      })
    );
  } else if (hasExample1 && !hasExample2) {
    // single example goes to example.txt; clear any split files
    requests.push(
      fetch(`http://localhost:3001/inputs/${year}/${day}example.txt`, {
        method: "PUT",
        body: data.example1,
      })
    );
    requests.push(
      fetch(`http://localhost:3001/inputs/${year}/${day}example1.txt`, {
        method: "DELETE",
      })
    );
    requests.push(
      fetch(`http://localhost:3001/inputs/${year}/${day}example2.txt`, {
        method: "DELETE",
      })
    );
  } else {
    // no examples entered, clean up
    ["example.txt", "example1.txt", "example2.txt"].forEach((suffix) => {
      requests.push(
        fetch(`http://localhost:3001/inputs/${year}/${day}${suffix}`, {
          method: "DELETE",
        })
      );
    });
  }

  // merge examples.json
  requests.push(
    fetch(`http://localhost:3001/examples`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExamples),
    })
  );

  // ensure stubs exist
  requests.push(
    fetch(`http://localhost:3001/create-day/${year}/${day}`, {
      method: "POST",
    })
  );

  // store last updated day for quick redirect
  requests.push(
    fetch(`http://localhost:3001/last-updated`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [year]: day }),
    })
  );

  Promise.all(requests)
    .then(() => {
      console.log("Files and examples.json updated successfully");
      const examplesForYear = examples.value[year] || {};
      if (data.outputType === 0)
        examplesForYear[day] = [
          parseInt(data.exampleSolution1),
          parseInt(data.exampleSolution2),
        ];
      else
        examplesForYear[day] = [data.exampleSolution1, data.exampleSolution2];
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

function openYearDialog() {
  newYear.value = "";
  newYearDayCount.value = 25;
  yearDialogVisible.value = true;
}

function closeYearDialog() {
  yearDialogVisible.value = false;
}

function saveYear() {
  if (!isDev) return;
  const year = parseInt(newYear.value, 10);
  const dayCount = parseInt(newYearDayCount.value, 10);
  if (!year || !dayCount) return;

  // Update local config immediately for UI
  yearsConfig.value = {
    ...yearsConfig.value,
    [year]: dayCount,
  };

  // Persist config and scaffold files
  fetch(`http://localhost:3001/years`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [year]: dayCount }),
  }).catch((error) => console.error("Error saving years.json:", error));

  fetch(`http://localhost:3001/create-year`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year, dayCount }),
  }).catch((error) => console.error("Error creating year files:", error));

  // Pre-expand the new year
  openYears.value = [year.toString()];
  yearDialogVisible.value = false;
}

const toggleRail = () => {
  rail.value = !rail.value;
  if (rail.value) {
    openYears.value = [];
  }
};
</script>
