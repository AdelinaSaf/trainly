<template>
    <div>
        <div class="section">
            <div class="section-header">
                <div class="section-title">Ваш прогресс</div>
                <div class="chart-filters">
                    <div class="chart-filter active">Неделя</div>
                    <div class="chart-filter">Месяц</div>
                    <div class="chart-filter">Год</div>
                </div>
            </div>

            <div class="progress-container">
                <div class="chart-header">
                    <div class="chart-title">Активность за последние 7 дней</div>
                    <div class="chart-actions">
                        <button class="btn btn-outline">
                            <i class="fas fa-download"></i> Экспорт
                        </button>
                    </div>
                </div>
                <div class="chart-placeholder">
                    <i class="fas fa-chart-bar"></i>
                    <span>Детальная статистика вашего прогресса</span>
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <StatCard
                title="Общая активность"
                value="8 ч 42 м"
                changeText="15% с прошлой недели"
                icon="fas fa-running"
                iconClass="steps"
            />

            <StatCard
                title="Сожжено калорий"
                value="4,820"
                changeText="8.7% с прошлой недели"
                icon="fas fa-fire"
                iconClass="calories"
            />

            <StatCard
                title="Пройдено шагов"
                value="62,350"
                changeText="12.3% с прошлой недели"
                icon="fas fa-shoe-prints"
                iconClass="steps"
            />

            <StatCard
                title="Средний пульс"
                value="76"
                changeText="1.5% с прошлой недели"
                icon="fas fa-heartbeat"
                iconClass="heart"
                :isNegative="true"
            />
        </div>
    </div>
</template>

<script>
import StatCard from '@/components/StatCard.vue'

export default {
    name: 'ProgressView',
    components: {
        StatCard
    }
}
</script>