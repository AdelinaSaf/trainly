<template>
    <div class="registration-container">
        <div class="registration-card">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <h1 class="app-title">Создайте аккаунт в Trainly</h1>
                <p class="app-subtitle">Ваш путь к здоровью начинается здесь</p>
            </div>

            <form @submit.prevent="submitForm" class="registration-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="username">Имя пользователя*</label>
                        <input
                            type="text"
                            id="username"
                            v-model="formData.username"
                            required
                            placeholder="Введите ваше имя"
                            :class="{ 'error-border': errors.username }"
                        >
                        <div v-if="errors.username" class="error">{{ errors.username }}</div>
                    </div>

                    <div class="form-group">
                        <label for="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            v-model="formData.email"
                            required
                            placeholder="example@mail.com"
                            :class="{ 'error-border': errors.email }"
                        >
                        <div v-if="errors.email" class="error">{{ errors.email }}</div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="password">Пароль*</label>
                        <input
                            type="password"
                            id="password"
                            v-model="formData.password"
                            required
                            placeholder="Не менее 8 символов"
                            :class="{ 'error-border': errors.password }"
                        >
                        <div v-if="errors.password" class="error">{{ errors.password }}</div>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Подтвердите пароль*</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            v-model="formData.confirmPassword"
                            required
                            placeholder="Повторите пароль"
                            :class="{ 'error-border': errors.confirmPassword }"
                            @paste.prevent
                            @drop.prevent
                            @keydown="blockPaste"
                        >
                        <div v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Роль*</label>
                        <div class="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="user"
                                    v-model="formData.role"
                                > Пользователь
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="trainer"
                                    v-model="formData.role"
                                > Тренер
                            </label>
                        </div>
                        <div v-if="errors.role" class="error">{{ errors.role }}</div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="birthDate">Дата рождения</label>
                        <input
                            type="date"
                            id="birthDate"
                            v-model="formData.birthDate"
                            :min="new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                            .toISOString().split ('T')[0]"
                            :max="new Date().toISOString().split('T')[0]"
                            :class="{ 'error-border': errors.birthDate }"
                        >
                        <div v-if="errors.birthDate" class="error">{{ errors.birthDate }}</div>
                    </div>

                    <div class="form-group">
                        <label>Пол</label>
                        <div class="radio-group">
                            <label v-for="gender in genders" :key="gender.id">
                                <input
                                    type="radio"
                                    :value="gender.id"
                                    v-model="formData.gender"
                                > {{ gender.name }}
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="height">Рост (см)</label>
                        <input
                            type="number"
                            id="height"
                            v-model.number="formData.height"
                            min="50"
                            max="300"
                            placeholder="170"
                            :class="{ 'error-border': errors.height }"
                        >
                        <div v-if="errors.height" class="error">{{ errors.height }}</div>
                    </div>

                    <div class="form-group">
                        <label for="weight">Вес (кг)</label>
                        <input
                            type="number"
                            id="weight"
                            v-model.number="formData.weight"
                            step="0.1"
                            min="20"
                            max="500"
                            placeholder="65.5"
                            :class="{ 'error-border': errors.weight }"
                        >
                        <div v-if="errors.weight" class="error">{{ errors.weight }}</div>
                    </div>
                </div>

                <button
                    type="submit"
                    class="submit-btn"
                    :disabled="loading"
                >
                    {{ loading ? 'Регистрация...' : 'Создать аккаунт' }}
                </button>

                <div v-if="successMessage" class="success-message">
                    <i class="fas fa-check-circle"></i> {{ successMessage }}
                    <p>Перенаправление на страницу входа...</p>
                </div>

                <div v-if="error" class="error-message">
                    <i class="fas fa-exclamation-circle"></i> {{ error }}
                </div>
            </form>

            <div class="login-link">
                Уже есть аккаунт? <router-link to="/login">Войти</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RegistrationForm',
    data() {
        return {
            formData: {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                birthDate: null,
                gender: null,
                height: null,
                weight: null,
                acceptTerms: false,
                role: 'user',
            },
            errors: {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                birthDate: '',
                height: '',
                weight: '',
                role: '',
            },
            loading: false,
            error: null,
            successMessage: null,
            genders: [],

        }
    },
    async created() {
        await this.loadGenders();
    },
    methods: {
        blockPaste(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                e.preventDefault();
            }
        },
        validatePassword() {
            let isValid = true;
            const passLower = this.formData.password.toLowerCase();
            const nameLower = this.formData.username.toLowerCase();
            const emailUser = this.formData.email.split('@')[0].toLowerCase();
            const weakPasswords = ['password', '12345678', 'qwertyui', nameLower, emailUser];


            if (!this.formData.password) {
                this.errors.password = 'Пароль обязателен';
                isValid = false;
            } else if (this.formData.password.length < 8) {
                this.errors.password = 'Пароль должен быть не менее 8 символов';
                isValid = false;
            }else if (/^\d+$/.test(this.formData.password)) {
                this.errors.password = 'Не только цифры';
                isValid = false;
            }else if (nameLower.length >= 3 && passLower.includes(nameLower)) {
                this.errors.password = 'Не используйте имя в пароле';
                isValid = false;
            }else if (emailUser.length >= 3 && passLower.includes(emailUser)) {
                this.errors.password = 'Не используйте часть email в пароле';
                isValid = false;
            }else if (weakPasswords.includes(passLower)) {
                this.errors.password = 'Пароль слишком простой';
                isValid = false;
            }

            return isValid;
        },
        validateForm() {
            let isValid = true;

            this.errors = {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                birthDate: '',
                height: '',
                weight: ''
            };

            if (!this.formData.username.trim()) {
                this.errors.username = 'Имя пользователя обязательно';
                isValid = false;
            } else if (this.formData.username.length < 3) {
                this.errors.username = 'Имя должно быть не менее 3 символов';
                isValid = false;
            }

            if (!this.formData.email) {
                this.errors.email = 'Email обязателен';
                isValid = false;
            } else if (!this.validateEmail(this.formData.email)) {
                this.errors.email = 'Введите корректный email';
                isValid = false;
            }

            if (this.formData.password !== this.formData.confirmPassword) {
                this.errors.confirmPassword = 'Пароли не совпадают';
                isValid = false;
            }
            if (!this.validatePassword(isValid)){
                isValid = false;
            }

            if (this.formData.birthDate) {
                const birthDate = new Date(this.formData.birthDate);
                const minDate = new Date();
                minDate.setFullYear(minDate.getFullYear() - 100);
                const maxDate = new Date();
                maxDate.setFullYear(maxDate.getFullYear() - 14);

                if (birthDate > new Date()) {
                    this.errors.birthDate = 'Дата рождения не может быть в будущем';
                    isValid = false;
                } else if (birthDate < minDate) {
                    this.errors.birthDate = 'Проверьте дату рождения';
                    isValid = false;
                }
            }

            if (this.formData.height) {
                if (this.formData.height < 50 || this.formData.height > 300) {
                    this.errors.height = 'Рост должен быть от 50 до 300 см';
                    isValid = false;
                }
            }

            if (this.formData.weight) {
                if (this.formData.weight < 20 || this.formData.weight > 500) {
                    this.errors.weight = 'Вес должен быть от 20 до 500 кг';
                    isValid = false;
                } else if (isNaN(this.formData.weight)) {
                    this.errors.weight = 'Введите корректное число';
                    isValid = false;
                }
            }
            if (!this.formData.role) {
                this.errors.role = 'Выберите роль';
                isValid = false;
            }

            return isValid;
        },

        validateEmail(email) {
            const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        async submitForm() {
            if (!this.validateForm()) return;

            this.loading = true;
            this.error = null;
            this.successMessage = null;

            try {
                const payload = {
                    username: this.formData.username,
                    email: this.formData.email,
                    password: this.formData.password,
                    birthDate: this.formData.birthDate || null,
                    gender: this.formData.gender || null,
                    height: this.formData.height || null,
                    weight: this.formData.weight || null,
                    role: this.formData.role,
                };

                const response = await fetch('http://localhost:8042/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.message) {
                        throw new Error(data.message);
                    } else {
                        throw new Error('Ошибка регистрации');
                    }
                }

                this.successMessage = 'Регистрация прошла успешно!';

                this.formData = {
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    birthDate: null,
                    gender: null,
                    height: null,
                    weight: null,
                    acceptTerms: false,
                    role: 'user'
                };

                setTimeout(() => {
                    this.$router.push('/login');
                }, 3000);

            } catch (error) {
                this.error = error.message || 'Произошла неизвестная ошибка';
            } finally {
                this.loading = false;
            }
        },
        async loadGenders() {
            try {
                const response = await fetch('http://localhost:8042/genders');
                if (response.ok) {
                    this.genders = await response.json();
                } else {
                    console.error('Failed to load genders');
                }
            } catch (error) {
                console.error('Error loading genders:', error);
            }
        },
    }
}
</script>

<style scoped>
.registration-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--bg-dark);
    padding: 20px;
}

.registration-card {
    background-color: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 800px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.logo-section {
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    padding: 40px 30px;
    text-align: center;
    color: white;
}

.logo-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
}

.app-title {
    font-size: 28px;
    margin-bottom: 10px;
    font-weight: 700;
}

.app-subtitle {
    font-size: 16px;
    opacity: 0.9;
}

.registration-form {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-row {
    display: flex;
    gap: 20px;
}

.form-row > .form-group {
    flex: 1;
}

.form-group {
    position: relative;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #b0b0b0;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="date"] {
    width: 100%;
    padding: 14px;
    background-color: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 16px;
    transition: all 0.3s ease;
}

input:focus {
    outline: none;
    border-color: #4d96ff;
    box-shadow: 0 0 0 3px rgba(77, 150, 255, 0.2);
}

.radio-group {
    display: flex;
    gap: 20px;
    margin-top: 8px;
}

.radio-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: normal;
}

input[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: #4d96ff;
}

.terms-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.terms-section label {
    color: #b0b0b0;
    font-size: 14px;
}

.terms-section a {
    color: #4d96ff;
    text-decoration: none;
}

.terms-section a:hover {
    text-decoration: underline;
}

.submit-btn {
    background: linear-gradient(135deg, #4d96ff, #6e45e2);
    color: white;
    border: none;
    border-radius: 30px;
    padding: 16px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 20px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(77, 150, 255, 0.3);
}

.submit-btn:disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.7;
}

.login-link {
    text-align: center;
    padding: 20px 0;
    color: var(--text-secondary);
    border-top: 1px solid var(--border);
}

.login-link a {
    color: #4d96ff;
    text-decoration: none;
    font-weight: 600;
}

.login-link a:hover {
    text-decoration: underline;
}

.error {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 5px;
}

.error-message {
    background-color: rgba(255, 107, 107, 0.1);
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    padding: 15px;
    color: #ff6b6b;
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.success-message {
    background-color: rgba(76, 175, 80, 0.1);
    border: 1px solid #4CAF50;
    border-radius: 8px;
    padding: 15px;
    color: #4CAF50;
    margin-top: 20px;
    text-align: center;
}

.success-message p {
    margin-top: 10px;
    font-size: 14px;
    color: #b0b0b0;
}
.radio-group {
    display: flex;
    gap: 20px;
    margin-top: 8px;
}

.radio-group label {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Адаптивность */
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 15px;
    }

    .registration-card {
        border-radius: 12px;
    }

    .logo-section {
        padding: 30px 20px;
    }

    .registration-form {
        padding: 20px;
    }
}
</style>