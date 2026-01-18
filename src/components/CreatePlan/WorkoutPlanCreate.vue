<template>
    <div class="workout-creator">
        <div v-if="step === 1" class="plan-config">
            <h2>Создание новой программы тренировок</h2>

            <div class="form-group">
                <label>Название программы<span class="required">*</span></label>
                <input v-model="workoutPlan.name"
                       class="form-input"
                       placeholder="Моя программа"
                       :class="{ 'error-border': !workoutPlan.name }"
                >
                <div v-if="!workoutPlan.name" class="error">Название обязательно</div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Цель</label>
                    <select v-model="workoutPlan.goal" class="form-select">
                        <option value="похудение">Похудение</option>
                        <option value="набор_мышц">Набор мышц</option>
                        <option value="выносливость">Выносливость</option>
                        <option value="сила">Сила</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Сложность</label>
                    <select v-model="workoutPlan.difficulty" class="form-select">
                        <option value="начинающий">Начинающий</option>
                        <option value="средний">Средний</option>
                        <option value="продвинутый">Продвинутый</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Продолжительность (недель)</label>
                <input
                    v-model.number="workoutPlan.duration_weeks"
                    type="number"
                    min="1"
                    max="52"
                    class="form-input"
                    :class="{ 'error-border': durationError }"
                >
                <div v-if="durationError" class="error-message">Продолжительность может быть в пределах от 1 до 52 недель</div>
            </div>

            <div class="form-group">
                <label>Описание программы</label>
                <textarea v-model="workoutPlan.description" class="form-textarea"></textarea>
            </div>

            <button @click="step = 2" class="btn btn-primary">Далее: Настройка дней</button>
        </div>

        <div v-if="step === 2" class="days-config">
            <h2>Настройка тренировочных дней</h2>

            <div class="days-grid">
                <div
                    v-for="day in daysOfWeek"
                    :key="day.value"
                    class="day-card"
                    :class="{ 'active': selectedDays.includes(day.value) }"
                    @click="toggleDay(day.value)"
                >
                    <div class="day-icon">
                        <i :class="day.icon"></i>
                    </div>
                    <div class="day-name">{{ day.label }}</div>
                </div>
            </div>

            <div v-if="selectedDays.length" class="workouts-container">
                <h3>Тренировки для выбранных дней:</h3>

                <WorkoutDayEditor
                    v-for="day in selectedDays"
                    :key="day"
                    :day="day"
                    :workout="getWorkoutForDay(day)"
                    @update="updateWorkout"
                />
            </div>
            <div v-else class="empty-workouts">
                <i class="fas fa-calendar-alt"></i>
                <p>Выберите дни тренировок</p>
            </div>

            <div v-if="!workoutPlan.name" class="error-message" style="margin-bottom: 20px;">
                <i class="fas fa-exclamation-circle"></i> Введите название программы
            </div>

            <div class="navigation-buttons">
                <button @click="step = 1" class="btn btn-outline"><i class="fas fa-arrow-left"></i>Назад</button>
                <button @click="saveWorkoutPlan" class="btn btn-primary" :disabled="!canSave">Сохранить программу</button>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api'
import WorkoutDayEditor from '@/components/CreatePlan/WorkoutDayEditor.vue'

export default {
    components: { WorkoutDayEditor },

    data() {
        return {
            step: 1,
            workoutPlan: {
                name: '',
                goal: 'набор_мышц',
                difficulty: 'средний',
                duration_weeks: 4,
                description: '',
                is_active: true,
                userRole: 'user'
            },
            daysOfWeek: [
                { value: 'пн', label: 'Пн', icon: 'fas fa-dumbbell', full: 'Понедельник' },
                { value: 'вт', label: 'Вт', icon: 'fas fa-running', full: 'Вторник' },
                { value: 'ср', label: 'Ср', icon: 'fas fa-bicycle', full: 'Среда' },
                { value: 'чт', label: 'Чт', icon: 'fas fa-swimmer', full: 'Четверг' },
                { value: 'пт', label: 'Пт', icon: 'fas fa-heartbeat', full: 'Пятница' },
                { value: 'сб', label: 'Сб', icon: 'fas fa-walking', full: 'Суббота' },
                { value: 'вс', label: 'Вс', icon: 'fas fa-restroom', full: 'Воскресенье' }
            ],
            selectedDays: [],
            workouts: {},
            durationError: false
        }
    },
    watch: {
        'workoutPlan.duration_weeks'(newVal) {
            this.durationError = newVal < 1 || newVal > 52;
        }
    },
    computed: {
        canSave() {
            if (!this.workoutPlan.name) return false;
            if (this.selectedDays.length === 0) return false

            return this.selectedDays.every(day => {
                const workout = this.workouts[day]
                return workout && workout.exercises && workout.exercises.length > 0 && !this.durationError
            })
        }
    },

    methods: {
        toggleDay(day) {
            if (this.selectedDays.includes(day)) {
                this.selectedDays = this.selectedDays.filter(d => d !== day);

                const updatedWorkouts = {...this.workouts};
                delete updatedWorkouts[day];
                this.workouts = updatedWorkouts;
            } else {
                this.selectedDays = [...this.selectedDays, day];

                this.workouts = {
                    ...this.workouts,
                    [day]: {
                        day_of_week: day,
                        name: `Тренировка ${this.getDayName(day)}`,
                        rest_between_exercises: 90,
                        notes: '',
                        exercises: []
                    }
                };
            }
        },

        getDayName(day) {
            const dayObj = this.daysOfWeek.find(d => d.value === day)
            return dayObj ? dayObj.full : day
        },

        getWorkoutForDay(day) {
            return this.workouts[day] || {
                day_of_week: day,
                name: `Тренировка ${this.getDayName(day)}`,
                rest_between_exercises: 90,
                notes: '',
                exercises: []
            }
        },

        updateWorkout(updatedWorkout) {
            this.workouts[updatedWorkout.day_of_week] = updatedWorkout
        },

        async saveWorkoutPlan() {
            try {
                if (!this.workoutPlan.name) {
                    alert('Пожалуйста, введите название программы');
                    return;
                }
                // Собираем данные для отправки
                const user = JSON.parse(localStorage.getItem('user'));
                const isTrainer = this.userRole === 'trainer';

                // Собираем данные для отправки
                const transformedWorkouts = Object.values(this.workouts).map(workout => {
                    return {
                        ...workout,
                        exercises: workout.exercises.map(ex => ({
                            exercise_id: ex.exercise.id,
                            sets: ex.sets,
                            min_reps: ex.min_reps,
                            max_reps: ex.max_reps,
                            rest_between_sets: ex.rest_between_sets,
                            order_index: ex.order_index
                        }))
                    }
                });

                const planData = {
                    ...this.workoutPlan,
                    user_id: isTrainer ? null : user.id,
                    workouts: transformedWorkouts
                }

               await api.post('/workout-plans', planData)
                this.$router.push(`/my-workout-plans/`)
            } catch (error) {
                console.error('Ошибка сохранения программы:', error)
            }
        }
    }
}
</script>

<style scoped>
.workout-creator {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.plan-config, .days-config {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--text-primary);
}

.subtitle {
    color: var(--text-secondary);
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.form-row > * {
    flex: 1;
}

.form-input, .form-select, .form-textarea {
    width: 100%;
    padding: 12px 15px;
    background-color: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 14px;
    margin-top: 8px;
    transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.form-textarea {
    min-height: 100px;
    resize: vertical;
}

.btn {
    padding: 12px 24px;
    border-radius: 30px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-primary {
    background-color: var(--primary);
    color: white;
}

.btn-primary:hover {
    background-color: var(--primary-dark);
}

.btn-outline {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
}

.btn-outline:hover {
    background-color: var(--bg-hover);
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    margin: 20px 0;
}

.day-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 15px 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.day-card:hover {
    border-color: var(--primary);
    background-color: rgba(79, 70, 229, 0.05);
}

.day-card.active {
    border-color: var(--primary);
    background-color: rgba(79, 70, 229, 0.1);
}

.day-icon {
    font-size: 24px;
    margin-bottom: 8px;
    color: var(--text-secondary);
}

.day-card.active .day-icon {
    color: var(--primary);
}

.day-name {
    font-size: 14px;
    font-weight: 500;
}

.workouts-container {
    margin-top: 30px;
}

.workout-editor {
    margin-bottom: 25px;
}

.empty-workouts {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
    border: 1px dashed var(--border);
    border-radius: 12px;
    margin-top: 20px;
}

.empty-workouts i {
    font-size: 48px;
    margin-bottom: 15px;
    opacity: 0.5;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
}
.error-border {
    border: 1px solid red;
}
.error-message {
    color: red;
    font-size: 0.8rem;
    margin-top: 4px;
}
</style>