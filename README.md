# 📚 Система записи на консультации

Внутренний сервис для записи студентов на консультации преподавателя. Разработан в рамках практической работы.

## 🎯 Цель проекта

Автоматизация процесса записи студентов на консультации к преподавателю, исключение хаоса и очередей, удобное управление временными слотами.

## 🚀 Функционал

### 👨‍🎓 Для студентов:
- Просмотр доступных консультаций
- Запись на консультацию с указанием темы вопроса
- Отмена своей записи
- Просмотр своих записей

### 👨‍🏫 Для преподавателей:
- Создание новых консультаций (слоты) с указанием времени и количества мест
- Просмотр всех записавшихся студентов на свои консультации
- Просмотр количества записавшихся на каждый слот
- Просмотр тем вопросов студентов

## 🛠 Технологии

| Компонент | Технология |
|-----------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | FastAPI (Python) |
| База данных | SQLite |
| ORM | SQLAlchemy |

## 📦 Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/Goydaa/consultation-booking-system.git
cd consultation-booking-system
2. Установить зависимости
bash
pip install fastapi uvicorn sqlalchemy pydantic
3. Запустить backend сервер
bash
cd backend
python -m uvicorn main:app --reload --port 8000
4. Запустить frontend сервер (в новом окне терминала)
bash
cd frontend
python -m http.server 8080
5. Открыть в браузере
text
http://localhost:8080
👥 Тестовые пользователи
Логин	Роль	Имя
teacher	Преподаватель	Иван Петрович
student1	Студент	Анна Смирнова
student2	Студент	Петр Иванов
📁 Структура проекта
text
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
📊 API Endpoints
Метод	URL	Описание
POST	/api/login	Авторизация пользователя
GET	/api/stats	Получение статистики
GET	/api/slots/available	Список доступных слотов
GET	/api/slots/teacher/{id}	Слоты преподавателя
POST	/api/slots	Создание нового слота
GET	/api/appointments/student/{id}	Записи студента
GET	/api/appointments/teacher/{id}	Записи на слоты преподавателя
POST	/api/appointments	Создание записи
DELETE	/api/appointments/{id}	Отмена записи
