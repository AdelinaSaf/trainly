<template>
    <div class="workouts-page">
        <div class="header">
            <h1>Рекомендуемые тренировки</h1>
            <div class="subtitle">Выберите готовую программу или создайте свою</div>
        </div>

        <div class="filters">

            <div class="filter-group">
                <label>День недели:</label>
                <select v-model="selectedDay">
                    <option value="">Все дни</option>
                    <option v-for="day in daysOfWeek" :key="day.id" :value="day.id">
                        {{ day.name }}
                    </option>
                </select>
            </div>

            <button class="btn btn-outline" @click="resetFilters">
                <i class="fas fa-sync-alt"></i> Сбросить фильтры
            </button>
        </div>

        <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Загрузка тренировок...
        </div>

        <div v-if="error" class="error">
            <i class="fas fa-exclamation-triangle"></i> {{ error }}
            <button @click="fetchWorkouts" class="btn btn-outline">
                Попробовать снова
            </button>
        </div>

        <div v-if="!loading && filteredWorkouts.length === 0" class="empty-state">
            <i class="fas fa-dumbbell"></i>
            <h3>Тренировки не найдены</h3>
            <p>Попробуйте изменить параметры фильтрации</p>
        </div>

        <div v-else class="workouts-grid">
            <WorkoutCard
                v-for="workout in filteredWorkouts"
                :key="workout.id"
                :title="workout.name"
                :day-of-week="getDayName(workout.day_of_week)"
                :exercises-count="workout.exercises_count"
                :show-actions="true"
                @start="startWorkout(workout.id)"
            />
        </div>
    </div>
</template>

<script>
import api from '@/api'
import router from '@/router'
import WorkoutCard from "@/components/WorkoutCard.vue";

export default {
    name: 'WorkoutsView',
    components: { WorkoutCard },
    data() {
        return {
            loading: true,
            workouts: [],
            filteredWorkouts: [],
            error: null,
            goals: [],
            difficulties: [],
            daysOfWeek: [],
            selectedGoal: '',
            selectedDifficulty: '',
            selectedDay: ''
        }
    },
    watch: {
        selectedGoal() {
            this.applyFilters();
        },
        selectedDifficulty() {
            this.applyFilters();
        },
        selectedDay() {
            this.applyFilters();
        }
    },
    async created() {
        await this.fetchDictionaries();
        await this.fetchWorkouts();
    },
    methods: {
        async fetchDictionaries() {
            try {
                const [goalsRes, difficultiesRes, daysRes] = await Promise.all([
                    api.get('/goals'),
                    api.get('/difficulties'),
                    api.get('/days-of-week')
                ]);

                this.goals = goalsRes.data || [];
                this.difficulties = difficultiesRes.data || [];
                this.daysOfWeek = daysRes.data || [];
            } catch (error) {
                console.error('Ошибка загрузки справочников:', error);
            }
        },
        async fetchWorkouts() {
            try {
                this.loading = true;
                this.error = null;
                const response = await api.get('/workouts/public-all');
                this.workouts = response.data || [];
                this.filteredWorkouts = [...this.workouts];
            } catch (error) {
                console.error('Ошибка загрузки тренировок:', error);
                this.error = 'Не удалось загрузить тренировки. Пожалуйста, попробуйте позже.';
            } finally {
                this.loading = false;
            }
        },
        getDayName(dayCode) {
            const day = this.daysOfWeek.find(d => d.id === dayCode);
            return day ? day.name : dayCode;
        },

        startWorkout(id) {
            router.push(`/workouts/execute/${id}`);
        },
        applyFilters() {
            this.filteredWorkouts = this.workouts.filter(workout => {
                const goalMatch = !this.selectedGoal || workout.goal_id == this.selectedGoal;
                const difficultyMatch = !this.selectedDifficulty || workout.difficulty_id == this.selectedDifficulty;
                const dayMatch = !this.selectedDay || workout.day_of_week === this.selectedDay;

                return goalMatch && difficultyMatch && dayMatch;
            });
        },
        resetFilters() {
            this.selectedGoal = '';
            this.selectedDifficulty = '';
            this.selectedDay = '';
            this.filteredWorkouts = [...this.workouts];
        }
    }
}
</script>

<style scoped>
.workouts-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    margin-bottom: 30px;
    text-align: center;
}

.header h1 {
    margin-bottom: 10px;
    font-size: 32px;
}

.subtitle {
    color: var(--text-secondary);
    font-size: 18px;
}

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    background-color: var(--bg-card);
    border-radius: 16px;
}

.filter-group {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
}

.filter-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.filter-group select {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

.loading, .error, .empty-state {
    text-align: center;
    padding: 40px 20px;
    border-radius: 16px;
    background-color: var(--bg-card);
    margin: 20px 0;
}

.empty-state i {
    font-size: 48px;
    color: var(--primary);
    margin-bottom: 20px;
}

.workouts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
.btn{
    margin-left: auto;
}

@media (max-width: 768px) {
    .filters {
        flex-direction: column;
    }

    .workouts-grid {
        grid-template-columns: 1fr;
    }
}
</style>