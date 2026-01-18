<template>
    <div class="exercise-selector-modal">
        <div class="modal-backdrop" @click="$emit('close')"></div>

        <div class="modal-content">
            <div class="modal-header">
                <h3>Выбор упражнения</h3>
                <button @click="$emit('close')" class="btn btn-icon">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="search-box">
                <input
                    v-model="searchQuery"
                    placeholder="Поиск упражнений..."
                    class="search-input"
                >
                <i class="fas fa-search"></i>
            </div>

            <div class="filters">
                <select v-model="muscleGroupFilter" class="filter-select">
                    <option :value="null">Все группы мышц</option>
                    <option v-for="group in availableMuscleGroups" :value="group.id" :key="group.id">
                        {{ group.name }}
                    </option>
                </select>

                <select v-model="equipmentFilter" class="filter-select">
                    <option :value="null">Все типы оборудования</option>
                    <option v-for="eq in availableEquipmentTypes" :value="eq.id" :key="eq.id">
                        {{ eq.name }}
                    </option>
                </select>
            </div>


            <div class="exercises-grid">
                <div
                    v-for="exercise in filteredExercises"
                    :key="exercise.id"
                    class="exercise-card"
                    @click="selectExercise(exercise)"
                >
                    <div class="exercise-name">{{ exercise.name }}</div>
                    <div class="exercise-meta">
                        <span class="badge">{{ exercise.muscle_group_name }}</span>
                        <span class="badge">{{ exercise.equipment_name }}</span>
                        <span v-if="!exercise.is_public" class="badge private">Приватное</span>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="loading">Загрузка упражнений...</div>
            <div v-if="!loading && !filteredExercises.length" class="empty-state">
                Упражнения не найдены
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api'

export default {
    data() {
        return {
            exercises: [],
            loading: true,
            searchQuery: '',
            muscleGroupFilter: null,
            equipmentFilter: null,
            availableMuscleGroups: [],
            availableEquipmentTypes: []
        }
    },
    props: {
        excludedIds: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        filteredExercises() {

            return this.exercises.filter(ex => {
                if (this.excludedIds.includes(ex.id)) {
                    return false;
                }
                const matchesSearch = ex.name.toLowerCase().includes(this.searchQuery.toLowerCase())

                let matchesMuscle = true;
                if (this.muscleGroupFilter) {
                    matchesMuscle = ex.muscle_group === this.muscleGroupFilter;
                }

                let matchesEquipment = true;
                if (this.equipmentFilter) {
                    matchesEquipment = ex.equipment === this.equipmentFilter;
                }

                return matchesSearch && matchesMuscle && matchesEquipment;
            })
        }
    },
    async created() {
        try {
            const [exercisesRes, muscleGroupsRes, equipmentRes] = await Promise.all([
                api.get('/exercises'),
                api.get('/muscle-groups'),
                api.get('/equipment-types')
            ]);

            this.exercises = exercisesRes.data;
            this.availableMuscleGroups = muscleGroupsRes.data;
            this.availableEquipmentTypes = equipmentRes.data;

        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        selectExercise(exercise) {
            this.$emit('select', {
                id: exercise.id,
                name: exercise.name,
                muscle_group_id: exercise.muscle_group_id,
                equipment_id: exercise.equipment_id
            });
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.exercise-selector-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background-color: var(--bg-card);
    border-radius: 16px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 1001;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border);
}

.search-box {
    position: relative;
    padding: 0 20px;
    margin-top: 15px;
}

.search-box i {
    position: absolute;
    left: 35px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.search-input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    background-color: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 30px;
    color: var(--text-primary);
    font-size: 14px;
}

.filters {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
}

.filter-select {
    flex: 1;
    padding: 10px 15px;
    background-color: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
}

.exercises-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 0 20px 20px;
    overflow-y: auto;
}

.exercise-card {
    background-color: var(--bg-hover);
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.exercise-card:hover {
    border-color: var(--primary);
    transform: translateY(-3px);
}

.exercise-name {
    font-weight: 500;
    margin-bottom: 10px;
}

.exercise-meta {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.badge {
    background-color: var(--primary);
    color: white;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 12px;
}

.loading, .empty-state {
    text-align: center;
    padding: 30px 20px;
    color: var(--text-secondary);
}
.private {
    background-color: #6c757d !important;
}
</style>