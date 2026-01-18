<template>
    <div class="exercise-creator">
        <h2>Создание нового упражнения</h2>

        <div class="form-container">
            <div class="form-group">
                <label>Название упражнения</label>
                <input
                    v-model="exercise.name"
                    class="form-input"
                    placeholder="Жим штанги лёжа"
                    required
                >
            </div>

            <div class="form-group">
                <label>Описание</label>
                <textarea
                    v-model="exercise.description"
                    class="form-textarea"
                    placeholder="Описание техники выполнения..."
                ></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Группа мышц</label>
                    <select v-model="exercise.muscle_group" class="form-select" required>
                        <option :value="null">Выберите группу</option>
                        <option v-for="group in muscleGroups" :value="group.id" :key="group.id">
                            {{ group.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Оборудование</label>
                    <select v-model="exercise.equipment" class="form-select" required>
                        <option :value="null">Выберите оборудование</option>
                        <option v-for="eq in equipmentTypes" :value="eq.id" :key="eq.id">
                            {{ eq.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Ссылка на видео</label>
                <input
                    v-model="exercise.video_url"
                    class="form-input"
                    placeholder="https://vkvideo.ru/..."
                    type="url"
                >
            </div>

            <div class="preview-section" v-if="showPreview">
                <h3>Предпросмотр</h3>
                <div class="preview-card">
                    <div class="preview-header">
                        <div class="badge">{{ getMuscleGroupName(exercise.muscle_group) }}</div>
                        <div class="badge">{{ getEquipmentName(exercise.equipment) }}</div>
                    </div>
                    <h4>{{ exercise.name }}</h4>
                    <p v-if="exercise.description">{{ exercise.description }}</p>
                    <div v-if="exercise.video_url" class="video-preview">
                        <i class="fas fa-video"></i> Видео доступно
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button
                    @click="saveExercise"
                    class="btn btn-primary"
                    :disabled="!canSave"
                >
                    Сохранить упражнение
                </button>
                <button @click="resetForm" class="btn btn-outline">
                    Сбросить
                </button>
                <button
                    @click="showPreview = !showPreview"
                    class="btn btn-icon"
                    :title="showPreview ? 'Скрыть предпросмотр' : 'Показать предпросмотр'"
                >
                    <i class="fas" :class="showPreview ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api'

export default {
    data() {
        return {
            exercise: {
                name: '',
                description: '',
                muscle_group: null,
                equipment: null,
                video_url: ''
            },
            muscleGroups: [],
            equipmentTypes: [],
            showPreview: true,
            userRole: 'user'
        }
    },
    computed: {
        canSave() {
            return this.exercise.name &&
                this.exercise.muscle_group &&
                this.exercise.equipment
        },
        getMuscleGroupName() {
            return (id) => {
                const group = this.muscleGroups.find(g => g.id === id);
                return group ? group.name : '';
            };
        },
        getEquipmentName() {
            return (id) => {
                const equipment = this.equipmentTypes.find(eq => eq.id === id);
                return equipment ? equipment.name : '';
            };
        },
    },
    async created() {
        await this.loadMuscleGroups();
        await this.loadEquipmentTypes();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role) {
            this.userRole = user.role;
        }
    },
    methods: {
        async saveExercise() {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const isTrainer = this.userRole === 'trainer';

                const payload = {
                    ...this.exercise,
                    user_id: isTrainer ? null : user.id
                };

                await api.post('/exercises', payload);
                this.resetForm();
            } catch (error) {
                console.error('Ошибка сохранения упражнения:', error)
            }
        },
        resetForm() {
            this.exercise = {
                name: '',
                description: '',
                muscle_group: null,
                equipment: null,
                video_url: '',

            }
        },
        async loadMuscleGroups() {
            try {
                const response = await api.get('/muscle-groups');
                this.muscleGroups = response.data;
            } catch (error) {
                console.error('Ошибка загрузки групп мышц:', error);
            }
        },
        async loadEquipmentTypes() {
            try {
                const response = await api.get('/equipment-types');
                this.equipmentTypes = response.data;
            } catch (error) {
                console.error('Ошибка загрузки типов оборудования:', error);
            }
        },
    }
}
</script>

<style scoped>
.exercise-creator {
    max-width: 700px;
    margin: 0 auto;
    padding: 30px;
    background-color: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h2 {
    font-size: 24px;
    margin-bottom: 25px;
    color: var(--text-primary);
    text-align: center;
}

.form-container {
    padding: 20px;
    background-color: var(--bg-hover);
    border-radius: 12px;
}

.form-group {
    margin-bottom: 25px;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.form-row > .form-group {
    flex: 1;
    margin-bottom: 0;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text-secondary);
}

.form-input, .form-select, .form-textarea {
    width: 100%;
    padding: 14px 16px;
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-primary);
    font-size: 15px;
    transition: all 0.25s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(77, 150, 255, 0.2);
}

.form-textarea {
    min-height: 120px;
    resize: vertical;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
    align-items: center;
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
    transform: translateY(-2px);
}

.btn-primary:disabled {
    background-color: var(--bg-hover);
    color: var(--text-secondary);
    cursor: not-allowed;
    transform: none;
}

.btn-outline {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
}

.btn-outline:hover {
    background-color: var(--bg-hover);
}

.btn-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--bg-hover);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-icon:hover {
    background-color: var(--primary);
    color: var(--primary);
}

.preview-section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
}

.preview-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid var(--border);
}

.preview-header {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.badge {
    background-color: var(--primary);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 13px;
}

.video-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 15px;
    color: var(--primary);
}
</style>