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

![Блок-схема](block%20diagram.png)

---
более подробная https://mermaid.live/view#pako:eNqNVFFvGkcQ_iurfcKSDb7bu4O7h0rggyat61wDfumSh0s420hwIDjSNpal2FH74khxU1eJlNhRU_WpfiBuSKgd7L8w9486e3vUS4utHhI7s_PNzLezM7tNH3QaAXXoRqvz7YMtvxeRmlsPCX79wf3Nnt_dIuvV8l1ep_AGjuEVnMALXJ_DAbyFX4Rep_ekg_jWNQ7H8R6cxY_jfTiFIYziPRLvovBXvKcCdY5BTuEC3sMYIXCO4p8whokKYhyO0PUD7n9KY8EZTBB6iSmepNAgbNTDf5Gu3L2zViuvuUh8KpLMrdpXq7mVajX3RXVhhnYFaf-MFIbIaALD-BlSjvfix7gxQXo_wlAFJ9TPEvh7XIcEfhX00WFfhbH_wF4j8TGBj7hziWF3YaziDY4lFglHcB4_JXCJ-UcIFCUSxIZYV2F6pjqZPIkqEOiUlGZE8C-p0g31KRVXvpTlSSWSqfj9qOjdnq1MSePenWqN5PxuM9fqbDZD1ajzz8uprd_qRP2c_9Bvtvz7rUBFsSuU3-12mmHUDkIE96NBA4Vcs6GiDSWhClcxJnfLq-VaeU7Q2WCWEixheENJ3GKtWCpWy6LXf8L-fgEHBA5ROMLfH_A7yVS_Xm1GwWyBXI1nBv2g119QN3WeSdLNbDKeUaku3MDFK9ZuyZn7DefsxCGCDWovsdVORL-9RcMhDuARSgczhDyNa1kCz-MfRF-QtMiaitC5niXXX6vHOMMIb7D_LrDvRrgm7XtKsC6HJDmtCje4kSX_oxE8k5sJs314h-OSRh3DR6JeTYK0uIVI8ZJcwLtkDj9g7-MsYnfj3CTTJsipPnmeRx_5XohZEVgs23TWcCt-imOtjo9X4AW1Etf0m2dze15BPqG4K96k0ytSo5mrWObacpbcXsMntCZg1yXQ8NLErR1jZSZJknPlvOpT9M8bo7TNukaWlj7DVyxVdamaUq2YiVpKrSUJdlPV1eZZK3rqK0OVUrUkVTdV3bnWqe86k1YjtRrSl6W-c60VNj2TJ4l4MqYn0Z5EefJEniWXvFwKcrHloi2nq0YX6Wav2aBO1BsEi7Qd9Nq-UOm2yFSn0VbQDurUQbERbPiDVlSn9XAH3bp--E2n05569jqDzS3qbPitPmqDbsOPArfp48ReQfBWgt5KZxBG1DF0lsSgzjb9jjpLel7PMqYb-jLT84bBrEX6PXVMzcyaNjNty7YtTWP6ziJ9lGTVsqZmWaZVKBSMvM2YZu_8DV017nI
---
