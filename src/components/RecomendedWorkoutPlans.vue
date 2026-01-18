<template>
    <div class="plans-page">
        <div class="header">
            <h1>Рекомендуемые планы тренировок</h1>
            <div class="subtitle">Выберите готовую программу или создайте свою</div>
        </div>

        <div class="filters">
            <div class="filter-group">
                <label>Цель:</label>
                <select v-model="selectedGoal">
                    <option value="">Все цели</option>
                    <option v-for="goal in goals" :key="goal.id" :value="goal.id">
                        {{ goal.name }}
                    </option>
                </select>
            </div>

            <div class="filter-group">
                <label>Сложность:</label>
                <select v-model="selectedDifficulty">
                    <option value="">Все уровни</option>
                    <option v-for="difficulty in difficulties" :key="difficulty.id" :value="difficulty.id">
                        {{ difficulty.name }}
                    </option>
                </select>
            </div>

            <div class="filter-group">
                <label>Длительность:</label>
                <select v-model="selectedDuration">
                    <option value="">Любая</option>
                    <option value="1-4">1-4 недели</option>
                    <option value="5-8">5-8 недель</option>
                    <option value="9-12">9-12 недель</option>
                    <option value="12+">12+ недель</option>
                </select>
            </div>

            <button class="btn btn-outline" @click="resetFilters">
                <i class="fas fa-sync-alt"></i> Сбросить фильтры
            </button>
        </div>

        <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Загрузка планов...
        </div>

        <div v-if="error" class="error">
            <i class="fas fa-exclamation-triangle"></i> {{ error }}
            <button @click="fetchPlans" class="btn btn-outline">
                Попробовать снова
            </button>
        </div>

        <div v-if="!loading && filteredPlans.length === 0" class="empty-state">
            <i class="fas fa-calendar-alt"></i>
            <h3>Планы тренировок не найдены</h3>
            <p>Попробуйте изменить параметры фильтрации</p>
        </div>

        <div v-else class="plans-grid">
            <WorkoutPlanCard
                v-for="plan in filteredPlans"
                :key="plan.id"
                :title="plan.name"
                :goal="getGoalName(plan.goal_id)"
                :difficulty="getDifficultyName(plan.difficulty_id)"
                :duration-weeks="plan.duration_weeks"
                :workouts-count="plan.workouts_count"
                :show-details="true"
                :show-actions="true"
                @activate="activatePlan(plan.id)"
            />
        </div>
    </div>
</template>

<script>
import api from '@/api'
import WorkoutPlanCard from "@/components/WorkoutPlanCard.vue";

export default {
    name: 'WorkoutPlansView',
    components: { WorkoutPlanCard },
    data() {
        return {
            loading: true,
            plans: [],
            filteredPlans: [],
            error: null,
            goals: [],
            difficulties: [],
            selectedGoal: '',
            selectedDifficulty: '',
            selectedDuration: ''
        }
    },
    watch: {
        selectedGoal() {
            this.applyFilters();
        },
        selectedDifficulty() {
            this.applyFilters();
        },
        selectedDuration() {
            this.applyFilters();
        }
    },
    async created() {
        await this.fetchDictionaries();
        await this.fetchPlans();
    },
    methods: {
        async fetchDictionaries() {
            try {
                const [goalsRes, difficultiesRes] = await Promise.all([
                    api.get('/goals'),
                    api.get('/difficulties')
                ]);

                this.goals = goalsRes.data || [];
                this.difficulties = difficultiesRes.data || [];
            } catch (error) {
                console.error('Ошибка загрузки справочников:', error);
            }
        },
        async fetchPlans() {
            try {
                this.loading = true;
                this.error = null;
                const response = await api.get('/workout-plans/public-all');
                this.plans = response.data || [];
                this.filteredPlans = [...this.plans];
            } catch (error) {
                console.error('Ошибка загрузки планов:', error);
                this.error = 'Не удалось загрузить планы тренировок. Пожалуйста, попробуйте позже.';
            } finally {
                this.loading = false;
            }
        },
        getGoalName(goalId) {
            const goal = this.goals.find(g => g.id == goalId);
            return goal ? goal.name : `Цель #${goalId}`;
        },
        getDifficultyName(difficultyId) {
            const difficulty = this.difficulties.find(d => d.id == difficultyId);
            return difficulty ? difficulty.name : `Уровень #${difficultyId}`;
        },
        async activatePlan(id) {
            try {
                await api.put(`/workout-plans/${id}/activate`);
                this.$toast.success('План тренировок активирован');
                await this.fetchPlans();
            } catch (error) {
                console.error('Ошибка активации плана:', error);
                this.$toast.error('Не удалось активировать план тренировок');
            }
        },
        applyFilters() {
            this.filteredPlans = this.plans.filter(plan => {
                const goalMatch = !this.selectedGoal || plan.goal_id == this.selectedGoal;
                const difficultyMatch = !this.selectedDifficulty || plan.difficulty_id == this.selectedDifficulty;

                let durationMatch = true;
                if (this.selectedDuration) {
                    const weeks = plan.duration_weeks || 0;
                    switch (this.selectedDuration) {
                        case '1-4': durationMatch = weeks >= 1 && weeks <= 4; break;
                        case '5-8': durationMatch = weeks >= 5 && weeks <= 8; break;
                        case '9-12': durationMatch = weeks >= 9 && weeks <= 12; break;
                        case '12+': durationMatch = weeks > 12; break;
                    }
                }

                return goalMatch && difficultyMatch && durationMatch;
            });
        },
        resetFilters() {
            this.selectedGoal = '';
            this.selectedDifficulty = '';
            this.selectedDuration = '';
            this.filteredPlans = [...this.plans];
        }
    }
}
</script>

<style scoped>
.plans-page {
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

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
}

@media (max-width: 768px) {
    .filters {
        flex-direction: column;
    }

    .plans-grid {
        grid-template-columns: 1fr;
    }
}
</style>