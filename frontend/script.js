const API_URL = 'http://localhost:8000/api';

let currentUser = null;
let selectedSlotId = null;

const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const submitLogin = document.getElementById('submitLogin');
const userNameSpan = document.getElementById('userName');
const closeBtns = document.querySelectorAll('.close');
const bookingModal = document.getElementById('bookingModal');
const submitBooking = document.getElementById('submitBooking');
const createSlotModal = document.getElementById('createSlotModal');
const submitCreateSlot = document.getElementById('submitCreateSlot');
const createSlotBtn = document.getElementById('createSlotBtn');

document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadSlots();
    loadMyAppointments();
    setupEventListeners();
    setupTabs();
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].onclick = function() {
            const tabName = this.getAttribute('data-tab');
            
            for (let j = 0; j < tabs.length; j++) {
                tabs[j].classList.remove('active');
            }
            this.classList.add('active');
            
            const contents = document.querySelectorAll('.tab-content');
            for (let j = 0; j < contents.length; j++) {
                contents[j].classList.remove('active');
            }
            
            const activeTab = document.getElementById(tabName + 'Tab');
            if (activeTab) {
                activeTab.classList.add('active');
            }
        };
    }
}

function setupEventListeners() {
    loginBtn.onclick = function() { loginModal.style.display = 'flex'; };
    
    submitLogin.onclick = function() {
        var username = document.getElementById('loginUsername').value;
        login(username);
        loginModal.style.display = 'none';
    };
    
    for (var i = 0; i < closeBtns.length; i++) {
        closeBtns[i].onclick = function() {
            loginModal.style.display = 'none';
            bookingModal.style.display = 'none';
            if (createSlotModal) createSlotModal.style.display = 'none';
        };
    }
    
    submitBooking.onclick = createAppointment;
    
    if (createSlotBtn) {
        createSlotBtn.onclick = function() {
            if (createSlotModal) createSlotModal.style.display = 'flex';
        };
    }
    
    if (submitCreateSlot) {
        submitCreateSlot.onclick = createSlot;
    }
}

async function login(username) {
    try {
        const response = await fetch(API_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        });
        
        if (response.ok) {
            currentUser = await response.json();
            var userText = currentUser.full_name;
            if (currentUser.role === 'teacher') {
                userText = userText + ' ( Преподаватель)';
            } else {
                userText = userText + ' ( Студент)';
            }
            userNameSpan.textContent = userText;
            loginBtn.textContent = 'Выйти';
            loginBtn.onclick = logout;
            
            loadSlots();
            loadMyAppointments();
            updateTeacherUI();
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

function logout() {
    currentUser = null;
    userNameSpan.textContent = 'Гость';
    loginBtn.textContent = 'Войти';
    loginBtn.onclick = function() { loginModal.style.display = 'flex'; };
    loadSlots();
    loadMyAppointments();
    updateTeacherUI();
}

function updateTeacherUI() {
    var teacherPanel = document.getElementById('teacherPanel');
    if (teacherPanel) {
        if (currentUser && currentUser.role === 'teacher') {
            teacherPanel.style.display = 'block';
        } else {
            teacherPanel.style.display = 'none';
        }
    }
}

async function loadStats() {
    try {
        const response = await fetch(API_URL + '/stats');
        const stats = await response.json();
        
        document.getElementById('totalSlots').textContent = stats.total_slots;
        document.getElementById('availableSlots').textContent = stats.available_slots;
        document.getElementById('totalBookings').textContent = stats.total_bookings;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadSlots() {
    try {
        var url = API_URL + '/slots/available';
        if (currentUser && currentUser.role === 'teacher') {
            url = API_URL + '/slots/teacher/' + currentUser.id;
        }
        const response = await fetch(url);
        const slots = await response.json();
        
        const container = document.getElementById('slotsList');
        if (slots.length === 0) {
            container.innerHTML = '<div class="loading">Нет доступных консультаций</div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < slots.length; i++) {
            var slot = slots[i];
            var startTime = new Date(slot.start_time);
            var endTime = new Date(slot.end_time);
            var dateStr = startTime.toLocaleDateString() + ' ' + startTime.toLocaleTimeString();
            var teacherName = slot.teacher ? slot.teacher.full_name : 'Преподаватель';
            
            var buttonHtml = '';
            if (currentUser && currentUser.role === 'student') {
                if (slot.appointments_count < slot.max_students) {
                    buttonHtml = '<button class="btn btn-primary" onclick="showBookingModal(' + slot.id + ', \'' + teacherName + '\', \'' + dateStr + '\')">Записаться</button>';
                }
            } else if (currentUser && currentUser.role === 'teacher') {
                buttonHtml = '<button class="btn btn-small" onclick="viewSlotStudents(' + slot.id + ')"> Студенты (' + slot.appointments_count + ')</button>';
            }
            
            html = html + '<div class="slot-card">' +
                '<div class="slot-info">' +
                '<h3> ' + teacherName + '</h3>' +
                '<p> ' + dateStr + ' - ' + endTime.toLocaleTimeString() + '</p>' +
                '<p> Записей: ' + slot.appointments_count + '/' + slot.max_students + '</p>' +
                '</div>' +
                buttonHtml +
                '</div>';
        }
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading slots:', error);
        document.getElementById('slotsList').innerHTML = '<div class="loading">Ошибка загрузки</div>';
    }
}

async function loadMyAppointments() {
    if (!currentUser) {
        document.getElementById('appointmentsList').innerHTML = '<div class="loading">Войдите чтобы увидеть свои записи</div>';
        return;
    }
    
    try {
        var url = '';
        if (currentUser.role === 'student') {
            url = API_URL + '/appointments/student/' + currentUser.id;
        } else if (currentUser.role === 'teacher') {
            url = API_URL + '/appointments/teacher/' + currentUser.id;
        }
        
        const response = await fetch(url);
        const appointments = await response.json();
        
        const container = document.getElementById('appointmentsList');
        if (appointments.length === 0) {
            if (currentUser.role === 'teacher') {
                container.innerHTML = '<div class="loading">Нет записей на ваши консультации</div>';
            } else {
                container.innerHTML = '<div class="loading">У вас нет записей</div>';
            }
            return;
        }
        
        var html = '';
        for (var i = 0; i < appointments.length; i++) {
            var app = appointments[i];
            var startTime = new Date(app.slot ? app.slot.start_time : null);
            var teacherName = app.slot && app.slot.teacher ? app.slot.teacher.full_name : 'Преподаватель';
            var studentName = app.student ? app.student.full_name : 'Студент';
            
            if (currentUser.role === 'teacher') {
                html = html + '<div class="appointment-card">' +
                    '<div class="appointment-info">' +
                    '<h3> ' + studentName + '</h3>' +
                    '<p> ' + startTime.toLocaleString() + '</p>' +
                    '<p> Тема: ' + app.topic + '</p>' +
                    '</div>' +
                    '</div>';
            } else {
                html = html + '<div class="appointment-card">' +
                    '<div class="appointment-info">' +
                    '<h3> ' + teacherName + '</h3>' +
                    '<p> ' + startTime.toLocaleString() + '</p>' +
                    '<p> Тема: ' + app.topic + '</p>' +
                    '</div>' +
                    '<button class="btn btn-danger" onclick="cancelAppointment(' + app.id + ')">Отменить</button>' +
                    '</div>';
            }
        }
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function createSlot() {
    var startDateTime = document.getElementById('slotStart').value;
    var endDateTime = document.getElementById('slotEnd').value;
    var maxStudents = document.getElementById('slotMaxStudents').value;
    
    if (!startDateTime || !endDateTime) {
        alert('Заполните дату и время');
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teacher_id: currentUser.id,
                start_time: new Date(startDateTime).toISOString(),
                end_time: new Date(endDateTime).toISOString(),
                max_students: parseInt(maxStudents) || 2
            })
        });
        
        if (response.ok) {
            if (createSlotModal) createSlotModal.style.display = 'none';
            loadSlots();
            loadStats();
            alert('Слот создан!');
        } else {
            alert('Ошибка при создании слота');
        }
    } catch (error) {
        console.error('Error creating slot:', error);
        alert('Ошибка при создании слота');
    }
}

window.viewSlotStudents = async function(slotId) {
    try {
        const response = await fetch(API_URL + '/appointments/slot/' + slotId);
        const students = await response.json();
        
        if (students.length === 0) {
            alert('Нет записавшихся студентов');
            return;
        }
        
        var message = 'Записанные студенты:\n';
        for (var i = 0; i < students.length; i++) {
            message = message + (i+1) + '. ' + students[i].student.full_name + ' - ' + students[i].topic + '\n';
        }
        alert(message);
    } catch (error) {
        console.error('Error loading students:', error);
    }
};

window.showBookingModal = function(slotId, teacherName, time) {
    if (!currentUser) {
        alert('Сначала войдите в систему');
        loginModal.style.display = 'flex';
        return;
    }
    
    selectedSlotId = slotId;
    document.getElementById('slotInfo').innerHTML = '<strong>Преподаватель:</strong> ' + teacherName + '<br><strong>Время:</strong> ' + time;
    document.getElementById('bookingTopic').value = '';
    bookingModal.style.display = 'flex';
};

async function createAppointment() {
    var topic = document.getElementById('bookingTopic').value;
    
    if (!topic) {
        alert('Введите тему консультации');
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slot_id: selectedSlotId,
                student_id: currentUser.id,
                topic: topic
            })
        });
        
        if (response.ok) {
            bookingModal.style.display = 'none';
            loadSlots();
            loadMyAppointments();
            loadStats();
            alert('Вы успешно записаны!');
        } else {
            var error = await response.json();
            alert(error.detail || 'Ошибка при записи');
        }
    } catch (error) {
        console.error('Error creating appointment:', error);
        alert('Ошибка при записи');
    }
}

window.cancelAppointment = async function(appointmentId) {
    if (!confirm('Отменить запись?')) return;
    
    try {
        await fetch(API_URL + '/appointments/' + appointmentId, {
            method: 'DELETE'
        });
        
        loadMyAppointments();
        loadSlots();
        loadStats();
        alert('Запись отменена');
    } catch (error) {
        console.error('Error cancelling appointment:', error);
    }
};
