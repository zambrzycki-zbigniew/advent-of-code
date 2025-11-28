import { createRouter, createWebHashHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes as autoRoutes } from 'vue-router/auto-routes';
import GenericDayComponent from '@/pages/advent-of-code/day.vue';
import ArcCalculatorComponent from '@/pages/minecraft/arcCalculator.vue';

const defaultYear = 2024;

const arcCalculatorRoute = {
  path: `/minecraft/arcCalculator`,
  component: ArcCalculatorComponent,
  name: "MinecraftArcCalculator",
};

const dayFiles = import.meta.glob('@/components/days/*/*/solve.js');

const parseExamplesForYear = (year, day) => {
  const examplesForYear = examplesData[year] || examplesData;
  return examplesForYear?.[day] || [];
};

let examplesData = {};
async function fetchExamples() {
  try {
    const base = import.meta.env.BASE_URL || '/';
    const url = `${base}examples.json`;
    const response = await fetch(url);
    try {
      examplesData = await response.json();
    } catch (err) {
      console.error(err);
    }
  } catch (error) {
    console.error('Error fetching examples.json:', error);
  }
}

const dayRoutes = Object.keys(dayFiles).map((filePath) => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/days\/([^/]+)\/([^/]+)\/solve\.js$/);
  if (!match) return null;

  const [, year, day] = match;
  const yearNumber = parseInt(year, 10);
  const dayNumber = parseInt(day, 10);

  return [
    {
      path: `/${yearNumber}/days/${dayNumber}`,
      component: GenericDayComponent,
      name: `Year${yearNumber}Day${dayNumber}`,
      props: () => ({
        year: yearNumber,
        day: dayNumber,
        examples: parseExamplesForYear(yearNumber, dayNumber),
      }),
      beforeEnter: async (to, from, next) => {
        await fetchExamples();
        next();
      },
    },
    {
      path: `/${yearNumber}/days/${dayNumber}/part/1`,
      component: GenericDayComponent,
      name: `Year${yearNumber}Day${dayNumber}Part1`,
      props: () => ({
        year: yearNumber,
        day: dayNumber,
        part: 1,
        examples: parseExamplesForYear(yearNumber, dayNumber),
      }),
      beforeEnter: async (to, from, next) => {
        await fetchExamples();
        next();
      },
    },
    {
      path: `/${yearNumber}/days/${dayNumber}/part/2`,
      component: GenericDayComponent,
      name: `Year${yearNumber}Day${dayNumber}Part2`,
      props: () => ({
        year: yearNumber,
        day: dayNumber,
        part: 2,
        examples: parseExamplesForYear(yearNumber, dayNumber),
      }),
      beforeEnter: async (to, from, next) => {
        await fetchExamples();
        next();
      },
    },
  ];
}).flat().filter(Boolean);

const routes = setupLayouts([
  {
    path: '/',
    redirect: `/${defaultYear}/days/1`,
  },
  ...autoRoutes,
  ...dayRoutes,
  {
    path: '/days/:day(\\d+)',
    redirect: (route) => `/${defaultYear}/days/${route.params.day}`,
  },
  arcCalculatorRoute,
]);

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
