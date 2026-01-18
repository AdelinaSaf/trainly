<template>
    <div class="set-configuration">
        <div class="config-row">
            <div class="config-item">
                <label>Подходы</label>
                <input
                    v-model.number="localConfig.sets"
                    type="number"
                    min="1"
                    max="10"
                    class="config-input"
                    :class="{ 'error-border': setsError }"
                >
                <div v-if="setsError" class="error-message">Минимальное значение: 1</div>
            </div>

            <div class="config-item">
                <label>Повторения (мин)</label>
                <input
                    v-model.number="localConfig.min_reps"
                    type="number"
                    min="1"
                    max="50"
                    class="config-input"
                    :class="{ 'error-border': minRepsError }"
                    required
                >
                <div v-if="minRepsError" class="error-message">Минимальное значение: 1</div>
            </div>

            <div class="config-item">
                <label>Повторения (макс)</label>
                <input
                    v-model.number="localConfig.max_reps"
                    type="number"
                    min="1"
                    max="50"
                    class="config-input"
                    :class="{ 'error-border': maxRepsError }"
                    required
                >
                <div v-if="maxRepsError" class="error-message">Минимальное значение: 1</div>
            </div>

            <div class="config-item">
                <label>Отдых (сек)</label>
                <input
                    v-model.number="localConfig.rest_between_sets"
                    type="number"
                    min="0"
                    max="300"
                    class="config-input"
                >
                <div v-if="restError" class="error-message">Значение не может быть отрицательным</div>
            </div>
        </div>
        <div v-if="repsError" class="error-message">
            Укажите хотя бы одно значение повторений
        </div>
    </div>
</template>

<script>
export default {
    props: {
        sets: Number,
        minReps: Number,
        maxReps: Number,
        rest: Number
    },
    data() {
        return {
            localConfig: {
                sets: this.sets,
                min_reps: this.minReps,
                max_reps: this.maxReps,
                rest_between_sets: this.rest
            }
        }
    },
    computed: {
        setsError() {
            return this.localConfig.sets < 1;
        },
        minRepsError() {
            return this.localConfig.min_reps < 1;
        },
        maxRepsError() {
            return this.localConfig.max_reps < 1;
        },
        restError() {
            return this.localConfig.rest_between_sets < 0;
        },
        repsError() {
            return !this.localConfig.min_reps && !this.localConfig.max_reps;
        },
        configError() {
            return this.setsError || this.minRepsError || this.maxRepsError || this.restError || this.repsError;
        }
    },
    watch: {
        localConfig: {
            deep: true,
            handler(newVal) {
                this.$emit('error', this.configError);
                if (newVal.min_reps > newVal.max_reps) {
                    newVal.max_reps = newVal.min_reps;
                }
                this.$emit('update', { ...newVal });
            }
        }
    }
}
</script>

<style scoped>
.set-configuration {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 15px;
    margin-top: 10px;
}

.config-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.config-item {
    flex: 1;
    min-width: 120px;
}

.config-item label {
    display: block;
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 5px;
}

.config-input {
    width: 100%;
    padding: 8px 12px;
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-primary);
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