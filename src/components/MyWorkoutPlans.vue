<template>
    <div class="my-workout-plans">
        <div class="header">
            <h1>Мои планы тренировок</h1>
            <button
                @click="router().push('/workout-plans/new')"
                class="btn btn-primary"
            >
                <i class="fas fa-plus"></i> Создать новый план
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

        <div v-if="!loading && plans.length === 0" class="empty-state">
            <i class="fas fa-calendar-alt"></i>
            <h3>У вас еще нет планов тренировок</h3>
            <p>Создайте свой первый план тренировок</p>
            <button
                @click="router().push('/workout-plans/new')"
                class="btn btn-primary"
            >
                Создать план
            </button>
        </div>

        <div v-else class="plans-grid">
            <WorkoutPlanCard
                v-for="plan in plans"
                :key="plan.id"
                :title="plan.name"
                :goal="getGoalName(plan.goal)"
                :difficulty="getDifficultyName(plan.difficulty)"
                :duration-weeks="plan.duration_weeks"
                :workouts-count="plan.workouts_count"
                :is-active="plan.is_active"
                :created-at="plan.created_at"
                :description="plan.description"
            />
        </div>
    </div>
</template>

<script>
import api from '@/api'
import router from '@/router'
import WorkoutPlanCard from "@/components/WorkoutPlanCard.vue";

export default {
    name: 'MyWorkoutPlans',
    components: {WorkoutPlanCard},
    data() {
        return {
            loading: true,
            plans: [],
            error: null,
            goals: [],
            difficulties: []
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
        }
    },
    async created() {
        await this.fetchDictionaries();
        await this.fetchPlans()
    },
    methods: {
        router() {
            return router
        },
        async fetchPlans() {
            try {
                this.loading = true
                this.error = null
                this.plans = []

                const response = await api.get('/workout-plans/user')

                if (Array.isArray(response.data)) {
                    this.plans = response.data
                } else {
                    this.error = "Некорректный формат данных"
                }
            } catch (error) {
                console.error('Ошибка загрузки планов:', error)
                this.error = 'Не удалось загрузить ваши планы тренировок. Пожалуйста, попробуйте позже.'
            } finally {
                this.loading = false
            }
        },
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
        getGoalName(goalId) {
            return this.goalsMap[goalId] || `Цель #${goalId}`;
        },
        getDifficultyName(difficultyId) {
            return this.difficultiesMap[difficultyId] || `Уровень #${difficultyId}`;
        },
        viewPlan(id) {
            router.push(`/workout-plans/${id}`)
        },
        editPlan(id) {
            router.push(`/workout-plans/edit/${id}`)
        },
        async activatePlan(id) {
            try {
                await api.put(`/workout-plans/${id}/activate`)
                this.fetchPlans()
            } catch (error) {
                console.error('Ошибка активации плана:', error)
                alert('Не удалось активировать план тренировки')
            }
        }
    }
}
</script>

<style scoped>
.my-workout-plans {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
    margin-top: 20px;
}

.plan-card {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.plan-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.active-plan {
    border-left: 4px solid var(--primary);
}

.card-header {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    align-items: flex-start;
}

.plan-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.plan-icon i {
    font-size: 20px;
    color: white;
}

.plan-info {
    flex: 1;
}

.plan-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.plan-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.badge {
    background-color: var(--bg-hover);
    color: var(--text-primary);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.active-badge {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
}

.plan-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
    padding: 10px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-secondary);
}

.plan-description {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.5;
    flex: 1;
}

.plan-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
}

.btn-sm {
    padding: 8px 15px;
    font-size: 14px;
}
.btn{
    max-width:250px;
    margin-left: auto;
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

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: flex-start;
    }

    .plans-grid {
        grid-template-columns: 1fr;
    }
}
</style>