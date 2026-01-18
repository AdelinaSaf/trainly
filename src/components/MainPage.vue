<template>
    <div>

        <div class="section">
            <div class="section-header">
                <div class="section-title">Рекомендуемые тренировки</div>
                <router-link to="/workouts" class="section-link">
                    <span>Показать все</span>
                    <i class="fas fa-arrow-right"></i>
                </router-link>
            </div>

            <div v-if="workoutsLoading" class="loading">
                <i class="fas fa-spinner fa-spin"></i> Загрузка тренировок...
            </div>
            <div v-else class="workouts-grid">
                <WorkoutCard
                    v-for="workout in workouts"
                    :key="workout.id"
                    :title="workout.name"
                    :day-of-week="getDayName(workout.day_of_week)"
                    :exercises-count="workout.exercises_count"
                    :show-actions="false"
                    @start="startWorkout(workout.id)"
                />
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <div class="section-title">Рекомендуемые планы тренировок</div>
                <router-link to="/workout-plans" class="section-link">
                    <span>Показать все</span>
                    <i class="fas fa-arrow-right"></i>
                </router-link>
            </div>

            <div v-if="plansLoading" class="loading">
                <i class="fas fa-spinner fa-spin"></i> Загрузка планов...
            </div>
            <div v-else class="plans-grid">
                <WorkoutPlanCard
                    v-for="plan in plans"
                    :key="plan.id"
                    :title="plan.name"
                    :goal="getGoalName(plan.goal_id)"
                    :difficulty="getDifficultyName(plan.difficulty_id)"
                    :duration-weeks="plan.duration_weeks"
                    :workouts-count="plan.workouts_count"
                    :show-details="false"
                    :show-actions="false"
                />
            </div>
        </div>

    </div>
</template>

<script>
import WorkoutCard from '@/components/WorkoutCard.vue'
import api from "@/api";
import WorkoutPlanCard from "@/components/WorkoutPlanCard.vue";
import router from "@/router";

export default {
    name: 'HomeView',
    components: {
        WorkoutPlanCard,
        WorkoutCard
    },

    data() {
        return {
            workouts: [],
            plans: [],
            workoutsLoading: true,
            plansLoading: true,
            goals: [],
            difficulties: [],
            daysOfWeek: []
        }
    },
    computed: {
        goalsMap() {
            const map = {};
            this.goals.forEach(goal => {
                map[goal.id] = goal.name;
            });
            return map;
        },
        difficultiesMap() {
            const map = {};
            this.difficulties.forEach(difficulty => {
                map[difficulty.id] = difficulty.name;
            });
            return map;
        },
        daysMap() {
            const map = {};
            this.daysOfWeek.forEach(day => {
                map[day.id] = day.name;
            });
            return map;
        }

    },
    async created() {
        await this.fetchDictionaries();
        await this.fetchDaysOfWeek();
        await this.fetchRecommendedWorkouts();
        await this.fetchRecommendedPlans();
    },
    methods: {
        async fetchDictionaries() {
            try {
                const [goalsRes, difficultiesRes] = await Promise.all([
                    api.get('/goals'),
                    api.get('/difficulties')
                ]);

                this.goals = goalsRes.data;
                this.difficulties = difficultiesRes.data;
            } catch (error) {
                console.error('Ошибка загрузки справочников:', error);
            }
        },
        async fetchDaysOfWeek() {
            try {
                const response = await api.get('/days-of-week');
                this.daysOfWeek = response.data;
            } catch (error) {
                console.error('Ошибка загрузки дней недели:', error);
            }
        },

        async fetchRecommendedWorkouts() {
            try {
                this.workoutsLoading = true;
                const response = await api.get('/workouts/public');
                this.workouts = response.data;
            } catch (error) {
                console.error('Ошибка загрузки тренировок:', error);
            } finally {
                this.workoutsLoading = false;
            }
        },

        async fetchRecommendedPlans() {
            try {
                this.plansLoading = true;
                const response = await api.get('/workout-plans/public');
                this.plans = response.data;
            } catch (error) {
                console.error('Ошибка загрузки планов:', error);
            } finally {
                this.plansLoading = false;
            }
        },

        getGoalName(goalId) {
            return this.goalsMap[goalId] || `Цель #${goalId}`;
        },

        getDifficultyName(difficultyId) {
            return this.difficultiesMap[difficultyId] || `Уровень #${difficultyId}`;
        },
        getDayName(dayCode) {
            return this.daysMap[dayCode] || dayCode;
        },
        startWorkout(id) {
            router.push(`/workouts/execute/${id}`)
        },
    }
}
</script>

<style scoped>
.progress-container {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 24px;
    height: 380px;
    display: flex;
    flex-direction: column;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
}

.chart-filters {
    display: flex;
    gap: 10px;
}

.chart-filter {
    padding: 6px 16px;
    border-radius: 30px;
    background-color: var(--bg-hover);
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition);
}

.chart-filter.active {
    background-color: var(--primary);
    color: white;
}

.chart-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(77, 150, 255, 0.1), rgba(110, 69, 226, 0.1));
    border-radius: 12px;
    color: var(--text-secondary);
}
.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}



.plan-icon i {
    font-size: 20px;
    color: white;
}



.loading {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
}
</style>