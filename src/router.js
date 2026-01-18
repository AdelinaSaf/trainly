import {createRouter, createWebHistory} from 'vue-router';
import AboutPage from "@/components/AboutPage.vue";
import MainPage from "@/components/MainPage.vue";
import WorkoutsView from "@/components/MyWorkoutsView.vue";
import ProgressView from "@/components/ProgressView.vue";
import ProfileView from "@/components/ProfileView.vue";
import RegistrationForm from "@/components/RegistrationForm.vue";
import EmptyLayout from "@/components/layout/EmptyLayout.vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import LoginView from "@/components/LoginView.vue";
import WorkoutPlanCreate from "@/components/CreatePlan/WorkoutPlanCreate.vue";
import ExerciseCreate from "@/components/ExerciseCreate.vue";
import WorkoutExecution from "@/components/WorkoutExecution.vue";
import MyWorkoutPlans from "@/components/MyWorkoutPlans.vue";
import RecomendedWorkoutPlans from "@/components/RecomendedWorkoutPlans.vue";
import RecomendedWorkouts from "@/components/RecomendedWorkouts.vue";
import Error404 from "@/components/Error404.vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', component: MainPage, name: "main", meta: { requiresAuth: true } },
            { path: '/my-workouts', component: WorkoutsView, meta: { requiresAuth: true, requiresClient: true } },
            { path: '/progress', component: ProgressView, meta: { requiresAuth: true } },
            { path: '/profile/:id', component: ProfileView, meta: { requiresAuth: true } },
            {path: '/workout-plans/new', component: WorkoutPlanCreate, meta: { requiresAuth: true }},
            {path: '/exercises/new', component: ExerciseCreate, meta: { requiresAuth: true }},
            {path: '/workouts/execute/:id', component: WorkoutExecution, meta: { requiresAuth: true }},
            {path: '/my-workout-plans', name: 'MyWorkoutPlans', component: MyWorkoutPlans,
                meta: { requiresAuth: true, requiresClient: true }},
            {path: '/workout-plans', name: 'WorkoutPlans', component: RecomendedWorkoutPlans, meta: { requiresAuth: true }},
            {path: '/workouts', name: 'Workout', component: RecomendedWorkouts,meta: { requiresAuth: true}},
        ]
    },

    {
        path: '/',
        component: EmptyLayout,
        children: [
            { path: '/about', component: AboutPage, name: "about", meta: { requiresAuth: true } },
            { path: '/registration', component: RegistrationForm, name: "register", meta: { guestOnly: true }  },
            { path: '/login', component: LoginView, name: "login", meta: { guestOnly: true }  },
            {path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404}
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const isCoach = user?.role === 'trainer';


    if (to.matched.some(record => record.meta.requiresClient)) {
        if (!isAuthenticated) {
            next({ name: 'login' });
        } else if (isCoach) {
            next({ name: 'main' });
            return;
        } else {
            next();
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({ name: 'login' });
        } else {
            next();
        }
    }
    else if (to.matched.some(record => record.meta.guestOnly)) {
        if (isAuthenticated) {
            next({ name: 'main' });
        } else {
            next();
        }
    }
    else {
        next();
    }
})

export default router;
