<template>
    <div class="my-workouts">
        <div class="header">
            <h1>Мои тренировки</h1>
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

        <div v-if="!loading && workouts.length === 0" class="empty-state">
            <i class="fas fa-dumbbell"></i>
            <h3>У вас еще нет созданных тренировок</h3>
            <p>Начните с создания своей первой тренировки</p>
            <button
                @click="router().push('/workouts/new')"
                class="btn btn-primary"
            >
                Создать тренировку
            </button>
        </div>

        <div v-else-if="workouts.length > 0" class="workouts-grid">
            <WorkoutCard
                v-for="workout in validWorkouts"
                :key="workout.id"
                :title="workout.name"
                :day-of-week="getDayName(workout.day_of_week)"
                :exercises-count="workout.exercises_count"
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
    name: 'MyWorkouts',
    components: {WorkoutCard},
    data() {
        return {
            loading: true,
            workouts: [],
            error: null,
            daysOfWeek: []
        }
    },
    async created() {
        await this.fetchDaysOfWeek();
        await this.fetchWorkouts()
    },
    computed: {
        validWorkouts() {
            return this.workouts.filter(
                workout => workout && workout.id && workout.name
            )
        },
        daysMap() {
            const map = {};
            this.daysOfWeek.forEach(day => {
                map[day.id] = day.name;
            });
            return map;
        }
    },
    methods: {
        router() {
            return router
        },
        async fetchDaysOfWeek() {
            try {
                const response = await api.get('/days-of-week');
                this.daysOfWeek = response.data;
            } catch (error) {
                console.error('Ошибка загрузки дней недели:', error);

            }
        },
        async fetchWorkouts() {
            try {
                this.loading = true
                this.error = null
                this.workouts = []

                const response = await api.get('/workouts/user')

                // Проверяем, что ответ содержит массив
                if (Array.isArray(response.data)) {
                    this.workouts = response.data
                } else {
                    this.error = "Некорректный формат данных"
                    console.error("Ожидался массив, получено:", response.data)
                }
            } catch (error) {
                console.error('Ошибка загрузки тренировок:', error)
                this.error = 'Не удалось загрузить ваши тренировки. Пожалуйста, попробуйте позже.'
            } finally {
                this.loading = false
            }
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
.my-workouts {
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

.header h1 {
    margin: 0;
    font-size: 28px;
}

.loading, .error, .empty-state {
    text-align: center;
    padding: 40px 20px;
    border-radius: 16px;
    background-color: var(--bg-card);
    margin: 20px 0;
}

.loading i {
    font-size: 24px;
    margin-bottom: 15px;
    display: block;
}

.error i {
    color: var(--accent);
    font-size: 32px;
    margin-bottom: 15px;
    display: block;
}

.empty-state i {
    font-size: 48px;
    color: var(--primary);
    margin-bottom: 20px;
}

.empty-state h3 {
    margin-bottom: 10px;
}

.empty-state p {
    color: var(--text-secondary);
    margin-bottom: 20px;
}

.workouts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.workout-card {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
}

.workout-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.workout-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.workout-icon i {
    font-size: 20px;
    color: white;
}

.workout-title {
    font-size: 18px;
    font-weight: 600;
    flex: 1;
}

.workout-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    padding-left: 10px;
    border-left: 2px solid var(--primary);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
}

.workout-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
}

.btn-sm {
    padding: 8px 15px;
    font-size: 14px;
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: flex-start;
    }

    .workouts-grid {
        grid-template-columns: 1fr;
    }
}
</style>