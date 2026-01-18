<template>
    <div class="workout-day-editor">
        <div class="day-header">
            <h3>{{ getDayName(localWorkout.day_of_week) }}</h3>
            <button
                @click="showExerciseSelector = true"
                class="btn btn-sm btn-primary"
            >
                <i class="fas fa-plus"></i> Добавить упражнение
            </button>
        </div>

        <div class="workout-config">
            <div class="form-group">
                <label>Название тренировки</label>
                <input v-model="localWorkout.name" class="form-input">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Отдых между упражнениями (сек)</label>
                    <input
                        v-model.number="localWorkout.rest_between_exercises"
                        type="number"
                        min="0"
                        class="form-input"
                    >
                </div>
            </div>

            <div class="form-group">
                <label>Заметки</label>
                <textarea v-model="localWorkout.notes" class="form-textarea"></textarea>
            </div>
        </div>

        <div class="exercises-list">
            <div
                v-for="(exercise, index) in localWorkout.exercises"
                :key="index"
                class="exercise-item"
            >
                <div class="exercise-header">
                    <div class="exercise-name">{{ exercise.exercise.name }}</div>
                    <button
                        @click="removeExercise(index)"
                        class="btn btn-icon"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>

                <SetConfiguration
                    :key="`${exercise.id}-${index}`"
                    :sets="exercise.sets"
                    :minReps="exercise.min_reps"
                    :maxReps="exercise.max_reps"
                    :rest="exercise.rest_between_sets"
                    @update="updateExerciseConfig(index, $event)"
                />
            </div>

            <div v-if="!localWorkout.exercises.length" class="empty-state">
                <i class="fas fa-dumbbell"></i>
                <p>Нет добавленных упражнений</p>
            </div>
        </div>

        <ExerciseSelector
            v-if="showExerciseSelector"
            :excluded-ids="addedExerciseIds"
            @close="showExerciseSelector = false"
            @select="addExercise"
        />
    </div>
</template>

<script>
import SetConfiguration from '@/components/CreatePlan/SetConfiguration.vue'
import ExerciseSelector from '@/components/CreatePlan/ExerciseSelector.vue'

export default {
    components: { SetConfiguration, ExerciseSelector },

    props: {
        day: String,
        workout: Object
    },

    data() {
        return {
            localWorkout: JSON.parse(JSON.stringify(this.workout)),
            showExerciseSelector: false
        }
    },
    watch: {
        workout: {
            handler(newVal) {
                this.localWorkout = JSON.parse(JSON.stringify(newVal));
            },
            deep: true
        }
    },
    computed: {
        addedExerciseIds() {
            return this.localWorkout.exercises.map(e => e.exercise.id);
        }
    },

    methods: {
        getDayName(day) {
            const days = {
                'пн': 'Понедельник',
                'вт': 'Вторник',
                'ср': 'Среда',
                'чт': 'Четверг',
                'пт': 'Пятница',
                'сб': 'Суббота',
                'вс': 'Воскресенье'
            }
            return days[day] || day
        },

        addExercise(exercise) {
            this.localWorkout.exercises.push({
                id: Date.now(),
                exercise,
                sets: 3,
                min_reps: 8,
                max_reps: 12,
                rest_between_sets: 60,
                order_index: this.localWorkout.exercises.length
            })
            this.emitUpdate();
            this.showExerciseSelector = false
        },

        removeExercise(index) {
            this.localWorkout.exercises.splice(index, 1)
            this.emitUpdate()
        },

        updateExerciseConfig(index, config) {
            Object.assign(
                this.localWorkout.exercises[index],
                config
            );
            this.$nextTick(() => {
                this.localWorkout.exercises[index].repsError = config.repsError;
            });
            this.emitUpdate();
        },

        emitUpdate() {
            this.$emit('update', this.localWorkout)
        }
    },

}
</script>
<style scoped>
.workout-day-editor {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.workout-day-editor:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
}

.day-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 12px;
}

.day-header h3::before {
    content: "";
    display: block;
    width: 8px;
    height: 32px;
    background: linear-gradient(to bottom, var(--primary), #6e45e2);
    border-radius: 4px;
}

.btn-sm {
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 250px;
}

.btn-sm:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(77, 150, 255, 0.25);
}

.workout-config {
    margin-bottom: 24px;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
}

.form-input, .form-textarea {
    width: 100%;
    padding: 14px 16px;
    background-color: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-primary);
    font-size: 15px;
    transition: all 0.25s ease;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(77, 150, 255, 0.2);
}

.form-textarea {
    min-height: 100px;
    resize: vertical;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.form-row > * {
    flex: 1;
}

.exercises-list {
    margin-top: 10px;
}

.exercise-item {
    background-color: var(--bg-hover);
    border-radius: 12px;
    padding: 18px;
    margin-bottom: 18px;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
    overflow: hidden;
}

.exercise-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: rgba(77, 150, 255, 0.3);
}

.exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}

.exercise-name {
    font-weight: 600;
    font-size: 17px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 10px;
}

.exercise-name::before {
    content: "•";
    color: var(--primary);
    font-size: 24px;
    line-height: 0;
}

.btn-icon {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 16px;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s ease;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-icon:hover {
    background-color: rgba(255, 107, 107, 0.15);
    color: var(--accent);
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
    background: linear-gradient(135deg, rgba(77, 150, 255, 0.05), transparent);
    border-radius: 12px;
    border: 1px dashed var(--border);
    margin-top: 20px;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
    color: var(--primary);
}

.empty-state p {
    font-size: 16px;
    margin: 0;
    font-weight: 500;
}

/* Анимация для добавления/удаления упражнений */
.exercise-item {
    animation: fadeIn 0.4s ease-out;
}


@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>