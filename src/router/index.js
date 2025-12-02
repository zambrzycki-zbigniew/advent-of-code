import { createRouter, createWebHashHistory } from 'vue-router/auto';
import { routes as autoRoutes } from 'vue-router/auto-routes';
import GenericDayComponent from '@/pages/advent-of-code/day.vue';
import ArcCalculatorComponent from '@/pages/minecraft/arcCalculator.vue';
import { h, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const defaultYear = 2024;

const arcCalculatorRoute = {
  path: `/minecraft/arcCalculator`,
  component: ArcCalculatorComponent,
  name: "MinecraftArcCalculator",
};

const dayFiles = import.meta.glob('@/components/days/*/*/solve.js');
const dayMap = {};

Object.keys(dayFiles).forEach((filePath) => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/days\/([^/]+)\/([^/]+)\/solve\.js$/);
  if (!match) return;
  const year = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  if (!dayMap[year]) dayMap[year] = new Set();
  dayMap[year].add(day);
});

const computeDefaultTarget = async () => {
  const base = import.meta.env.BASE_URL || '/';
  let yearsConfig = {};
  let lastUpdated = {};
  try {
    const res = await fetch(`${base}years.json`, { cache: 'no-store' });
    if (res.ok) yearsConfig = await res.json();
  } catch (err) {
    console.error('Failed to fetch years.json', err);
  }
  try {
    const res = await fetch(`${base}last-updated.json`, { cache: 'no-store' });
    if (res.ok) lastUpdated = await res.json();
  } catch (err) {
    console.error('Failed to fetch last-updated.json', err);
  }

  const yearsFromFiles = Object.keys(dayMap).map((y) => parseInt(y, 10));
  const yearsFromConfig = Object.keys(yearsConfig).map((y) => parseInt(y, 10));
  const years = [...yearsFromFiles, ...yearsFromConfig, defaultYear].filter(Boolean);
  if (!years.length) return `/${defaultYear}/days/1`;

  const targetYear = Math.max(...years);

  const dayCount =
    yearsConfig[targetYear] !== undefined
      ? parseInt(yearsConfig[targetYear], 10)
      : dayMap[targetYear]
        ? Math.max(...dayMap[targetYear])
        : 25;

  const hasInput = async (year, day) => {
    const url = `${base}inputs/${year}/${day}.txt`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 600);
    try {
      const res = await fetch(url, { cache: 'no-store', method: 'GET', signal: controller.signal });
      if (!res.ok) return false;
      const txt = await res.text();
      return !!txt && !txt.includes('<!DOCTYPE html>');
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  };

  // Prefer last updated day if present for target year
  if (lastUpdated[targetYear]) {
    return `/${targetYear}/days/${lastUpdated[targetYear]}`;
  }

  let targetDay = 1;
  for (let d = dayCount; d >= 1; d -= 1) {
    const ok = await hasInput(targetYear, d);
    if (ok) {
      targetDay = d;
      break;
    }
  }

  return `/${targetYear}/days/${targetDay}`;
};

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

const RedirectLoader = {
  name: 'RedirectLoader',
  setup() {
    if (!document.getElementById('redirect-loader-style')) {
      const style = document.createElement('style');
      style.id = 'redirect-loader-style';
      style.textContent = `
        @keyframes redirect-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    const router = useRouter();
    onMounted(async () => {
      const target = await computeDefaultTarget();
      router.replace(target || '/');
    });
    return () =>
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            gap: '12px',
            flexDirection: 'column',
          },
        },
        [
          h('div', { class: 'text-subtitle-1' }, 'Loading...'),
          h('div', {
            class: 'loading-spinner',
            style: {
              width: '32px',
              height: '32px',
              border: '3px solid #888',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'redirect-spin 1s linear infinite',
            },
          }),
        ]
      );
  },
};

const routes = [
  {
    path: '/',
    component: RedirectLoader,
  },
  ...autoRoutes,
  ...dayRoutes,
  {
    path: '/days/:day(\\d+)',
    redirect: (route) => `/${defaultYear}/days/${route.params.day}`,
  },
  {
    path: '/:pathMatch(.*)*',
    beforeEnter: async (to, from, next) => {
      const target = await computeDefaultTarget();
      if (!target || target === to.fullPath) return next();
      next(target);
    },
  },
  arcCalculatorRoute,
];

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
