<template>
    <div>
        <div class="section">
            <div class="section-header">
                <div class="section-title">
                    {{ isOwnProfile ? 'Мой профиль' : `Профиль ${userData.username}` }}
                </div>
            </div>

            <div v-if="isOwnProfile" class="stats-grid">

                <StatCard
                    title="Активность"
                    :value="activityValue"
                    :changeText="activityChangeText"
                    icon="fas fa-fire"
                    :iconStyle="{ backgroundColor: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b' }"
                />

                <StatCard
                    title="Рекорды"
                    :value="recordsValue"
                    :changeText="recordsChangeText"
                    icon="fas fa-trophy"
                    :iconStyle="{ backgroundColor: 'rgba(255, 171, 0, 0.15)', color: '#ffab00' }"
                />


            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <div class="section-title">Личные данные</div>
            </div>

            <div class="progress-container" style="height: auto; padding: 30px;">
                <div v-if="loading" class="loading">Загрузка данных...</div>

                <div v-if="error" class="error-message">
                    <i class="fas fa-exclamation-circle"></i> {{ error }}
                </div>

                <div v-if="!loading" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                    <div>
                        <label>Имя</label>
                        <input
                            type="text"
                            class="profile-input"
                            v-model="userData.username"
                            :disabled="!isOwnProfile"
                        >
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            class="profile-input"
                            v-model="userData.email"
                            disabled
                        >
                    </div>
                    <div>
                        <label>Дата регистрации</label>
                        <input
                            type="text"
                            class="profile-input"
                            :value="formatRegistrationDate(userData.createdAt)"
                            disabled
                        >
                    </div>
                    <div>
                        <label>Дата рождения</label>
                        <input
                            type="date"
                            class="profile-input"
                            v-model="userData.birthDate"
                            :disabled="!isOwnProfile"
                            :min="new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                            .toISOString().split ('T')[0]"
                            :max="new Date().toISOString().split('T')[0]"
                        >
                    </div>
                    <div>
                        <label>Пол</label>
                        <select
                            class="profile-input"
                            v-model="userData.gender"
                            :disabled="!isOwnProfile"
                        >
                            <option :value="null">Не указан</option>
                            <option
                                v-for="gender in genders"
                                :key="gender.id"
                                :value="gender"
                            >
                                {{ gender.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="height">Рост</label>
                            <div class="number-input-container" id="height-container">
                                <input
                                    type="number"
                                    id="height"
                                    class="profile-input"
                                    v-model.number="userData.height"
                                    min="50"
                                    max="300"
                                    placeholder="170"
                                    :disabled="!isOwnProfile"
                                >
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="weight">Вес</label>
                            <div class="number-input-container" id="weight-container">
                                <input
                                    type="number"
                                    id="weight"
                                    class="profile-input"
                                    v-model.number="userData.weight"
                                    step="0.1"
                                    min="20"
                                    max="500"
                                    placeholder="65.5"
                                    :disabled="!isOwnProfile"
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="isOwnProfile" style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button
                        class="btn btn-outline"
                        style="margin-right: 12px;"
                        @click="resetForm"
                        :disabled="loading"
                    >
                        Отмена
                    </button>
                    <button
                        class="btn btn-primary"
                        @click="saveProfile"
                        :disabled="loading"
                    >
                        {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StatCard from '@/components/StatCard.vue'
import api from '@/api'

export default {
    name: 'ProfileView',
    components: {
        StatCard
    },
    data() {
        return {
            loading: true,
            error: null,
            originalData: null,
            userData: {
                username: '',
                email: '',
                birthDate: null,
                gender: null,
                height: null,
                weight: null,
                createdAt: null,
            },
            isOwnProfile: false,
            activePlanName: null,
            activePlanProgress: null,
            activePlanGoal: null,
            completedWorkouts: null,
            weeklyWorkouts: null,
            weightChange: null,
            chestChange: null,
            maxWeight: null,
            maxReps: null,
            genders: []
        }
    },
    computed: {
        hasChanges() {
            if (!this.originalData) return false;

            const fields = ['username', 'birthDate', 'height', 'weight'];
            for (const field of fields) {
                if (this.userData[field] !== this.originalData[field]) {
                    return true;
                }
            }
            const currentGenderId = this.userData.gender ? this.userData.gender.id : null;
            const originalGenderId = this.originalData.gender ? this.originalData.gender.id : null;

            if (currentGenderId !== originalGenderId) {
                return true;
            }

            return false;
        },
        profileId() {
            return this.$route.params.id;
        },
        activePlanValue() {
            return this.activePlanName || 'Нет активной программы';
        },
        activePlanChangeText() {
            if (!this.activePlanProgress || !this.activePlanGoal) {
                return 'Данные о прогрессе отсутствуют';
            }
            return `${this.activePlanProgress} | Цель: ${this.activePlanGoal}`;
        },

        activityValue() {
            return this.completedWorkouts
                ? `${this.completedWorkouts} тренировок`
                : 'Нет данных';
        },
        activityChangeText() {
            return this.weeklyWorkouts
                ? `${this.weeklyWorkouts} на этой неделе`
                : 'Нет данных за неделю';
        },

        progressValue() {
            return this.weightChange
                ? `${this.weightChange} кг`
                : 'Нет данных';
        },
        progressChangeText() {
            return this.chestChange
                ? `Объем груди: ${this.chestChange} см`
                : 'Нет данных об объемах';
        },

        recordsValue() {
            return this.maxWeight
                ? `${this.maxWeight} кг`
                : 'Нет данных';
        },
        recordsChangeText() {
            return this.maxReps
                ? `${this.maxReps} повторений`
                : 'Нет данных';
        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            handler: 'fetchUserProfile'
        }
    },
    async created() {
        await this.loadGenders();
        await this.fetchUserProfile();
    },
    methods: {
        async fetchUserProfile() {
            this.loading = true;
            this.error = null;

            try {
                const profileId = this.profileId;
                const user = JSON.parse(localStorage.getItem('user')) || {};
                const currentUserId = user.id;

                this.isOwnProfile = parseInt(currentUserId) === parseInt(profileId);
                if (this.isOwnProfile) {
                    await Promise.all([
                        this.fetchActivePlan(),
                        this.fetchWorkoutStats(),
                        this.fetchProgressStats(),
                        this.fetchPersonalRecords()
                    ]);
                }

                const response = await api.get(`/profile/${profileId}`);

                if (!response.data) {
                    this.error = 'Профиль не найден';
                    return;
                }

                this.userData = { ...response.data };

                if (this.userData.birthDate) {
                    const date = new Date(this.userData.birthDate);
                    this.userData.birthDate = date.toISOString().split('T')[0];
                }
                if (this.userData.gender) {
                    const foundGender = this.genders.find(g => g.id === this.userData.gender);
                    if (foundGender) {
                        this.userData.gender = foundGender;
                    }
                }

                // Сохраняем оригинальные данные
                this.originalData = { ...this.userData };


            } catch (error) {
                console.error('Ошибка загрузки профиля:', error);

                if (error.response?.status === 404) {
                    this.error = 'Профиль не найден';
                } else if (error.response?.status === 403) {
                    this.error = 'Доступ запрещен';
                } else {
                    this.error = 'Не удалось загрузить данные профиля';
                }
            } finally {
                this.loading = false;
            }
        },
        formatDateForInput(dateString) {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        },

        async saveProfile() {
            if (!this.hasChanges) {
                return;
            }

            this.loading = true;
            this.error = null;
            const updateData = {
                username: this.userData.username,
                birthDate: this.userData.birthDate,
                gender: this.userData.gender ? this.userData.gender.id : null,
                height: this.userData.height,
                weight: this.userData.weight
            };

            try {
                await api.put(`/profile/${this.userData.id}`, updateData);

                // Обновляем исходные данные
                this.originalData = {...this.userData};

                if (this.isOwnProfile) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const updatedUser = {
                        ...user,
                        username: this.userData.username,
                        birthDate: this.userData.birthDate,
                        gender: this.userData.gender ? this.userData.gender.id : null,
                        height: this.userData.height,
                        weight: this.userData.weight
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }

            } catch (error) {
                console.error('Ошибка сохранения профиля:', error);

                if (error.response && error.response.data && error.response.data.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Ошибка при сохранении данных';
                }
            } finally {
                this.loading = false;
            }
        },

        resetForm() {
            this.userData = JSON.parse(JSON.stringify(this.originalData));
            this.error = null;
        },
        formatRegistrationDate(dateString) {
            if (!dateString) return 'Неизвестно';
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        async fetchActivePlan() {
            try {
                const response = await api.get('/workout-plans/active');
                if (response.data) {
                    this.activePlanName = response.data.name;
                    this.activePlanGoal = this.translateGoal(response.data.goal);
                    this.activePlanProgress = `${response.data.completed_weeks}/${response.data.duration_weeks} недель`;
                }else {
                    this.activePlanName = null;
                    this.activePlanGoal = null;
                    this.activePlanProgress = null;
                }
            } catch (error) {
                console.error('Ошибка загрузки активной программы', error);
                this.activePlanName = null;
                this.activePlanGoal = null;
                this.activePlanProgress = null;
            }
        },

        async fetchWorkoutStats() {
            try {
                const response = await api.get('/workouts/stats');
                if (response.data) {
                    this.completedWorkouts = response.data.total;
                    this.weeklyWorkouts = response.data.weekly;
                }else {
                    this.completedWorkouts = null;
                    this.weeklyWorkouts = null;
                }
            } catch (error) {
                console.error('Ошибка загрузки статистики тренировок', error);
                this.completedWorkouts = null;
                this.weeklyWorkouts = null;
            }
        },

        async fetchProgressStats() {
            try {
                const response = await api.get('/progress/stats');
                if (response.data) {
                    this.weightChange = response.data.weight_difference;
                    this.chestChange = response.data.chest_difference;
                }
                else {
                    this.weightChange = null;
                    this.chestChange = null;
                }
            } catch (error) {
                console.error('Ошибка загрузки статистики прогресса', error);
                this.weightChange = null;
                this.chestChange = null;
            }
        },

        async fetchPersonalRecords() {
            try {
                const response = await api.get('/personal-records');
                if (response.data) {
                    this.maxWeight = response.data.max_weight;
                    this.maxReps = response.data.max_reps;
                }else {
                    this.maxWeight = null;
                    this.maxReps = null;
                }
            } catch (error) {
                console.error('Ошибка загрузки личных рекордов', error);
                this.maxWeight = null;
                this.maxReps = null;
            }
        },

        translateGoal(goal) {
            const goals = {
                'похудение': 'Похудение',
                'набор_мышц': 'Набор мышц',
                'выносливость': 'Выносливость',
                'сила': 'Сила'
            };
            return goals[goal] || goal;
        },
        async loadGenders() {
            try {
                const response = await api.get('/genders');
                this.genders = response.data;
            } catch (error) {
                console.error('Ошибка загрузки полов', error);
            }
        },
    }
}
</script>

<style scoped>
.profile-input {
    width: 100%;
    padding: 12px 15px;
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 14px;
    margin-top: 8px;
    transition: border-color 0.3s ease;
}

.profile-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.form-row {
    display: flex;
    gap: 16px;
    grid-column: span 2;
    margin-top: 8px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 6px;
}

.form-group input[type="number"] {
    appearance: none;
    -moz-appearance: textfield;
    padding-right: 40px;
    background-position: right 12px center;
    background-repeat: no-repeat;
}

.form-group input[type="number"]::-webkit-inner-spin-button,
.form-group input[type="number"]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
}

.number-input-container {
    position: relative;
}

.number-input-container::after {
    content: "см";
    position: absolute;
    right: 15px;
    top: 55%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    font-size: 13px;
    pointer-events: none;
}

#weight-container::after {
    content: "кг";
}

.loading {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
}

.error-message {
    background-color: rgba(255, 107, 107, 0.1);
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    padding: 15px;
    color: #ff6b6b;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.registration-date {
    font-style: italic;
    color: var(--text-secondary);
}

@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 12px;
    }

    div > div {
        grid-column: span 2;
    }

    .form-group {
        width: 100%;
    }
}
</style>