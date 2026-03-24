# 📚 Система записи на консультации

Внутренний сервис для записи студентов на консультации преподавателя.

---

## 🚀 Функционал

### 👨‍🎓 Студент
- Просмотр доступных консультаций
- Запись на консультацию с указанием темы
- Отмена своей записи
- Просмотр своих записей

### 👨‍🏫 Преподаватель
- Создание новых консультаций (слоты)
- Просмотр всех записавшихся студентов
- Просмотр количества записавшихся на каждый слот

---

## 🛠 Технологии

| Компонент | Технология |
|-----------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | FastAPI (Python) |
| База данных | SQLite |
| ORM | SQLAlchemy |

---

## 📦 Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/Goydaa/consultation-booking-system.git
cd consultation-booking-system
```

### 2. Установить зависимости

```bash
pip install fastapi uvicorn sqlalchemy pydantic
```

### 3. Запустить backend сервер

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 4. Запустить frontend сервер (в новом окне)

```bash
cd frontend
python -m http.server 8080
```

### 5. Открыть в браузере

```
http://localhost:8080
```

---

## 👥 Тестовые пользователи

| Логин | Роль | Имя |
|-------|------|-----|
| teacher | Преподаватель | Иван Петрович |
| student1 | Студент | Анна Смирнова |
| student2 | Студент | Петр Иванов |

---

## 📁 Структура проекта

```
consultation-booking-system/
├── backend/
│   ├── main.py          # FastAPI приложение
│   ├── database.py      # Модели БД и инициализация
│   └── models.py        # Pydantic модели
├── frontend/
│   ├── index.html       # Главная страница
│   ├── style.css        # Стили
│   └── script.js        # Клиентская логика
└── requirements.txt     # Зависимости Python
```

---

## 📊 API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| POST | /api/login | Авторизация пользователя |
| GET | /api/stats | Получение статистики |
| GET | /api/slots/available | Список доступных слотов |
| GET | /api/slots/teacher/{id} | Слоты преподавателя |
| POST | /api/slots | Создание нового слота |
| GET | /api/appointments/student/{id} | Записи студента |
| GET | /api/appointments/teacher/{id} | Записи на слоты преподавателя |
| POST | /api/appointments | Создание записи |
| DELETE | /api/appointments/{id} | Отмена записи |

---

## 📊 Блок-схема

![Блок-схема](diagram.png)

---

## 👨‍💻 Автор

**Goydaa**

GitHub: https://github.com/Goydaa
