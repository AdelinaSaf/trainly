<template>
    <router-view></router-view>
</template>

<script>
</script>

<style>
:root {
    --bg-dark: #121212;
    --bg-card: #1e1e1e;
    --bg-hover: #2d2d2d;
    --primary: #4d96ff;
    --primary-dark: #3a7bdb;
    --accent: #ff6b6b;
    --success: #4caf50;
    --warning: #ffc107;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --border: #333333;
    --transition: all 0.3s ease;
    --text-tertiary: #94a3b8;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: var(--bg-dark);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
}
body.light-theme {
    --primary: #4a76d0;
    --primary-dark: #3a65b8;
    --accent: #ff6b6b;
    --success: #4caf50;
    --warning: #ff9800;
}

.app-container {
    display: flex;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
}

/* Общие стили для всех компонентов */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
}

.section {
    margin-bottom: 40px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 22px;
    font-weight: 700;
}

.section-link {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: var(--transition);
}

.section-link:hover {
    color: var(--primary-dark);
}

.workouts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.btn {
    padding: 10px 20px;
    border-radius: 30px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background-color: var(--primary);
    color: white;
    flex: 1;
    justify-content: center;
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

/* Адаптивность */
@media (max-width: 1200px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .workouts-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 992px) {
    .sidebar {
        width: 80px;
    }

    .search-box input {
        width: 200px;
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .workouts-grid {
        grid-template-columns: 1fr;
    }

    .user-info {
        display: none;
    }
}
</style>