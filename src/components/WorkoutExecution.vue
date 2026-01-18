<template>
    <div class="workout-execution">
        <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Загрузка тренировки...
        </div>
        <div v-if="isRestingBetweenExercises" class="rest-between-exercises">
            <h2>Отдых между упражнениями</h2>
            <p>Запуск может занять пару секунд</p>
            <div class="rest-timer">
                {{ restBetweenExercisesTime }} сек
            </div>
            <p>Следующее: {{ nextExerciseName }}</p>
        </div>
        <template v-else-if="workout && !isRestingBetweenExercises">
            <div class="header">
                <h1>{{ workout?.name }}</h1>
                <div class="timer">
                    <i class="fas fa-clock"></i>
                    {{ formatTime(elapsedTime) }}
                </div>
            </div>

            <div class="progress-container">
                <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                <div class="progress-text">
                    Упражнение {{ currentExerciseIndex + 1 }} из {{ workout?.exercises?.length }}
                </div>
            </div>

            <div v-if="currentExercise" class="current-exercise">
                <h2>{{ currentExercise?.exercise?.name }}</h2>
                <div class="exercise-meta">
                    <span class="badge">{{ currentExercise?.exercise?.muscle_group_name }}</span>
                    <span class="badge">{{ currentExercise?.exercise?.equipment_name }}</span>
                </div>

                <div class="set-info">
                    <div class="set-number">
                        Подход {{ currentSetIndex + 1 }} из {{ currentExercise.sets }}
                    </div>
                    <div v-if="restTime > 0" class="rest-timer">
                        Отдых: {{ restTime }} сек
                    </div>
                </div>
                <div v-if="currentExercise.exercise.video_url" class="video-container">
                    <div v-if="isYouTubeVideo(currentExercise.exercise.video_url)" class="video-wrapper">
                        <iframe
                            :src="getYouTubeEmbedUrl(currentExercise.exercise.video_url)"
                            class="video-iframe"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>

                    <video
                        v-else-if="isDirectVideo(currentExercise.exercise.video_url)"
                        controls
                        :src="currentExercise.exercise.video_url"
                        class="exercise-video"
                    ></video>

                    <div v-else class="video-link">
                        <a :href="currentExercise.exercise.video_url" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Смотреть видео упражнения
                        </a>
                    </div>
                </div>
            </div>

            <div class="set-recording" v-if="currentExercise">
                <div class="input-group">
                    <label>Вес (кг)</label>
                    <input
                        type="number"
                        v-model.number="currentSet.weight"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        @input="validateWeight"
                    >
                </div>

                <div class="input-group">
                    <label>Повторения</label>
                    <input
                        type="number"
                        v-model.number="currentSet.reps"
                        min="0"
                        placeholder="0"
                        @input="validateReps"
                    >
                </div>

                <div class="input-group">
                    <label>Длительность (сек)</label>
                    <input
                        type="number"
                        v-model.number="currentSet.duration"
                        min="0"
                        placeholder="0"
                        @input="validateDuration"
                    >
                </div>
            </div>

            <div class="actions" v-if="currentExercise">
                <button
                    v-if="currentSetIndex < currentExercise.sets - 1"
                    @click="finishSet()"
                    class="btn btn-primary"
                    :disabled="isResting"
                >
                    Завершить подход
                </button>

                <button
                    v-else-if="currentExerciseIndex < workout?.exercises?.length - 1"
                    @click="nextExercise"
                    class="btn btn-primary"
                >
                    Следующее упражнение
                </button>

                <button
                    v-else
                    @click="finishWorkout"
                    class="btn btn-success"
                >
                    Завершить тренировку
                </button>

                <button @click="pauseWorkout" class="btn btn-outline">
                    {{ isPaused ? 'Продолжить' : 'Пауза' }}
                </button>
            </div>

            <div class="notes-section">
                <textarea
                    v-model="notes"
                    placeholder="Заметки о тренировке..."
                ></textarea>
            </div>
            <div class="rating-section">
                <label>Оценка тренировки:</label>
                <div class="rating-stars">
                    <span
                        v-for="star in 5"
                        :key="star"
                        @click="rating = star"
                        :class="{ 'active': star <= rating }"
                    >
                        ★
                    </span>
                </div>
            </div>

            <div class="completed-sets">
                <h3>Выполненные подходы</h3>
                <div v-for="(set, index) in completedSets" :key="index" class="set-item">
                    <span>{{ set.exerciseName }} - Подход {{ index + 1 }}</span>
                    <span v-if="set.weight">Вес: {{ set.weight }} кг</span>
                    <span v-if="set.reps">Повторений: {{ set.reps }}</span>
                    <span v-if="set.duration">Длительность: {{ set.duration }} сек</span>
                </div>
            </div>
        </template>
        <div v-else class="error">
            <i class="fas fa-exclamation-triangle"></i> Тренировка не найдена
            <button @click="$router.push('/workouts')" class="btn btn-outline">
                Вернуться к списку тренировок
            </button>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    name: 'WorkoutExecution',
    data() {
        return {
            workout: null,
            currentExerciseIndex: 0,
            currentSetIndex: 0,
            currentSet: {
                weight: null,
                reps: null,
                duration: null
            },
            completedSets: [],
            elapsedTime: 0,
            restTime: 0,
            timer: null,
            restTimer: null,
            isPaused: false,
            startTime: null,
            endTime: null,
            notes: '',
            loading: true,
            workoutId: null,
            rating: null,
            isRestingBetweenExercises: false,
            restBetweenExercisesTime: 0,
        };
    },
    computed: {
        currentExercise() {
            return this.workout?.exercises?.[this.currentExerciseIndex] || null;
        },
        progressPercentage() {
            if (!this.workout?.exercises?.length) return 0;
            const totalExercises = this.workout.exercises.length;
            return totalExercises ? ((this.currentExerciseIndex + 1) / totalExercises) * 100 : 0;
        },
        nextExerciseName() {
            if (!this.workout?.exercises) return '';
            if (this.currentExerciseIndex < this.workout.exercises.length - 1) {
                return this.workout.exercises[this.currentExerciseIndex + 1].exercise.name;
            }
            return '';
        },
        isResting() {
            return this.restTime > 0;
        }
    },

    async mounted() {
        this.workoutId = this.$route.params.id;
        await this.fetchWorkout();
        this.startTimer();
    },
    beforeUnmount() {
        this.clearTimers();
    },
    watch: {
        '$route.params.id'(newId) {
            this.workoutId = newId;
            this.fetchWorkout();
        },

    },
    methods: {
        async fetchWorkout() {
            try {
                this.loading = true;
                const response = await api.get(`/workouts/${this.workoutId}`);
                this.workout = response.data || null;
            } catch (error) {
                console.error('Ошибка загрузки тренировки:', error);
                this.workout = null;
            } finally {
                this.loading = false;
            }
        },

        startTimer() {
            this.startTime = new Date();
            this.timer = setInterval(() => {
                if (!this.isPaused) {
                    this.elapsedTime++;

                    if (this.restTime > 0) {
                        this.restTime--;
                        if (this.restTime === 0) {
                            this.currentSetIndex++;
                        }
                    }

                    else if (this.isRestingBetweenExercises) {
                        this.restBetweenExercisesTime--;
                        if (this.restBetweenExercisesTime === 0) {
                            this.isRestingBetweenExercises = false;
                            this.currentExerciseIndex++;
                            this.currentSetIndex = 0;
                            this.resetCurrentSet();
                        }
                    }
                }
            }, 1000);
        },


        clearTimers() {
            clearInterval(this.timer);
            clearInterval(this.restTimer);
        },

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },

        finishSet() {
            if (this.currentSet.reps <= 0) {
                alert('Количество повторений не может быть отрицательным');
                return;
            }
            if (this.currentSet.weight < 0) {
                alert('Вес не может быть отрицательным');
                return;
            }
            if (this.currentSet.duration <= 0) {
                alert('Длительность не может быть отрицательной');
                return;
            }
            const isRepsEmpty = this.currentSet.reps === null || isNaN(this.currentSet.reps);
            const isDurationEmpty = this.currentSet.duration === null || isNaN(this.currentSet.duration);
            if (isRepsEmpty && isDurationEmpty) {
                alert('Заполните хотя бы одно поле: повторения или длительность');
                return;
            }
            this.completedSets.push({
                exerciseId: this.currentExercise.exercise.id,
                exerciseName: this.currentExercise.exercise.name,
                weight: this.currentSet.weight,
                reps: this.currentSet.reps,
                duration: this.currentSet.duration,
                order: this.currentExerciseIndex,
                setIndex: this.currentSetIndex
            });

            this.resetCurrentSet();
            this.startRest();
            return true;
        },

        startRest() {
            if (!this.currentExercise) return;
            this.restTime = this.currentExercise.rest_between_sets || 90;
        },
        endRest() {
            if (!this.currentExercise) return;
            this.restTime = 0;
        },


        nextExercise() {

            if (!this.finishSet()) {
                return;
            }

            if (this.currentExerciseIndex < this.workout.exercises.length - 1) {
                const restBetween = this.workout.rest_between_exercises || 0;

                if (restBetween > 0) {
                    this.isRestingBetweenExercises = true;
                    this.restBetweenExercisesTime = restBetween;
                } else {
                    this.currentExerciseIndex++;
                    this.currentSetIndex = 0;
                    this.resetCurrentSet();
                }
            }
        },

        resetCurrentSet() {
            this.currentSet = {
                weight: null,
                reps: null,
                duration: null
            };
        },

        pauseWorkout() {
            this.isPaused = !this.isPaused;
        },

        async finishWorkout() {
            if (this.isRestingBetweenExercises) {
                this.isRestingBetweenExercises = false;
            }
            if (this.currentSet.reps !== null || this.currentSet.duration !== null) {
                if (!this.finishSet()) {
                    return;
                }
                if (this.currentSet.reps < 0) {
                    alert('Количество повторений не может быть отрицательным');
                    return;
                }
                if (this.currentSet.weight < 0) {
                    alert('Вес не может быть отрицательным');
                    return;
                }
                if (this.currentSet.duration < 0) {
                    alert('Длительность не может быть отрицательной');
                    return;
                }

            }
            this.endTime = new Date();
            this.clearTimers();

            try {
                const workoutData = {
                    workoutId: this.workout.id,
                    startTime: this.startTime.toISOString(),
                    endTime: this.endTime.toISOString(),
                    sets: this.completedSets,
                    notes: this.notes,
                    rating: this.rating
                };

                await api.post('/completed-workouts', workoutData);
                alert('Тренировка успешно сохранена!');
                this.endRest()
                this.$router.push('/workouts');
            } catch (error) {
                console.error('Ошибка сохранения тренировки:', error);
                alert('Не удалось сохранить результаты тренировки');
            }
        },
        isYouTubeVideo(url) {
            return url && (url.includes('youtube.com') || url.includes('youtu.be'));
        },

        getYouTubeEmbedUrl(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);

            const videoId = (match && match[2].length === 11) ? match[2] : null;

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            return url;
        },

        isDirectVideo(url) {
            if (!url) return false;
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', 'video/'];
            return videoExtensions.some(ext => url.toLowerCase().includes(ext));
        },
        validateWeight() {
            if (this.currentSet.weight === '' || isNaN(this.currentSet.weight)) {
                this.currentSet.weight = null;
            } else if (this.currentSet.weight < 0) {
                this.currentSet.weight = 0;
            }
        },
        validateReps() {
            if (this.currentSet.reps === '' || isNaN(this.currentSet.reps)) {
                this.currentSet.reps = null;
            } else if (this.currentSet.reps < 0) {
                this.currentSet.reps = 0;
            }
        },
        validateDuration() {
            if (this.currentSet.duration === '' || isNaN(this.currentSet.duration)) {
                this.currentSet.duration = null;
            } else if (this.currentSet.duration < 0) {
                this.currentSet.duration = 0;
            }
        }
    }
};
</script>

<style scoped>
.workout-execution {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
}

.timer {
    font-size: 24px;
    font-weight: bold;
    background-color: var(--bg-card);
    padding: 10px 20px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.progress-container {
    margin-bottom: 30px;
    background-color: var(--bg-hover);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.progress-bar {
    height: 8px;
    background: linear-gradient(90deg, var(--primary), #6e45e2);
    transition: width 0.5s ease;
}

.progress-text {
    padding: 12px;
    text-align: center;
    font-weight: 500;
}

.current-exercise {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 25px;
    margin-bottom: 30px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.exercise-meta {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
}

.badge {
    background-color: var(--primary);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 14px;
}

.set-info {
    margin-top: 25px;
    display: flex;
    justify-content: space-around;
    font-size: 18px;
}

.set-number {
    font-weight: bold;
}

.rest-timer {
    color: var(--accent);
    font-weight: bold;
}

.set-recording {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 30px;
}

.input-group {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
}

.input-group label {
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
}

.input-group input {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    text-align: center;
    background-color: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
}

.actions {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    justify-content: center;
}

.btn {
    padding: 14px 28px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(77, 150, 255, 0.4);
}

.btn-success {
    background: linear-gradient(135deg, #4caf50, #2e7d32);
    color: white;
}

.btn-outline {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
}

.notes-section textarea {
    width: 100%;
    min-height: 100px;
    padding: 15px;
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-primary);
    margin-bottom: 30px;
}

.completed-sets {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 25px;
}

.completed-sets h3 {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border);
}

.set-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
}

.set-item:last-child {
    border-bottom: none;
}

.loading, .error {
    text-align: center;
    padding: 40px;
    font-size: 18px;
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

.video-container {
    margin-top: 20px;
    max-width: 100%;
    border-radius: 12px;
    overflow: hidden;
}

.exercise-video {
    width: 100%;
    max-height: 300px;
    background-color: black;
    border-radius: 12px;
}

.video-container {
    margin-top: 20px;
    border-radius: 12px;
    overflow: hidden;
}

.video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
}

.video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
}

.exercise-video {
    width: 100%;
    max-height: 300px;
    background-color: black;
    border-radius: 12px;
}

.video-link {
    text-align: center;
    padding: 15px;
    background-color: var(--bg-card);
    border-radius: 12px;
}

.video-link a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: var(--transition);
}

.video-link a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}

.video-container {
    margin-top: 20px;
    border-radius: 12px;
    overflow: hidden;
}

.video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
}

.video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border: none;
}

.exercise-video {
    width: 100%;
    max-height: 300px;
    background-color: black;
    border-radius: 12px;
}

.rating-section {
    margin: 20px 0;
}

.rating-stars {
    display: flex;
    font-size: 24px;
    cursor: pointer;
}

.rating-stars span {
    color: #ccc;
    transition: color 0.2s;
}

.rating-stars span.active {
    color: #ffc107;
}

.set-info {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.rest-timer {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--primary);
    background: rgba(0, 123, 255, 0.1);
    padding: 10px 20px;
    border-radius: 50px;
    min-width: 120px;
    text-align: center;
}

.rest-between-exercises {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 16px;
    margin: 30px 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

    h2 {
        margin-bottom: 15px;
        color: var(--text-primary);
    }

    .rest-timer {
        font-size: 3.5rem;
        margin: 20px 0;
        color: var(--primary);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    p {
        font-size: 1.2rem;
        color: var(--text-secondary);
    }
}

.rest-between-exercises {
    text-align: center;
    padding: 40px;
    background: linear-gradient(135deg, #4d96ff, #6e45e2);
    border-radius: 16px;
    color: white;
    margin: 30px 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: pulse 2s infinite;
}


.rest-between-exercises h2 {
    font-size: 28px;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.rest-between-exercises .rest-timer {
    font-size: 5rem;
    font-weight: bold;
    margin: 30px 0;
    color: white;
}

.rest-between-exercises p {
    font-size: 1.5rem;
    opacity: 0.9;
    margin-top: 20px;
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

@media (max-width: 768px) {
    .set-recording {
        grid-template-columns: 1fr;
    }

    .actions {
        flex-direction: column;
    }

    .exercise-video {
        max-height: 250px;
    }

    .video-wrapper {
        padding-bottom: 75%;
    }
}
</style>