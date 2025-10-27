// Configuration
const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let scheduleData = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSchedule();
    setupEventListeners();
});

// Load schedule from JSON
async function loadSchedule() {
    try {
        const response = await fetch('schedule.json');
        scheduleData = await response.json();
        renderSchedule();
    } catch (error) {
        console.error('Error loading schedule:', error);
        scheduleData = [];
        renderSchedule();
        showError('Could not load schedule.json. Make sure the file exists in the same folder.');
    }
}

// Render the schedule table
function renderSchedule() {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    TIME_SLOTS.forEach(time => {
        const row = document.createElement('tr');
        
        // Time cell
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.textContent = time;
        row.appendChild(timeCell);

        // Day cells
        DAYS.forEach((day, dayIndex) => {
            const cell = document.createElement('td');
            const tasks = getTasksForTimeAndDay(time, day);
            
            tasks.forEach(task => {
                const taskElement = createTaskElement(task, day, dayIndex);
                cell.appendChild(taskElement);
            });

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    applyFilter();
}

// Get tasks for specific time and day
function getTasksForTimeAndDay(time, day) {
    return scheduleData.filter(task => {
        if (task.recurring) {
            return task.days.includes(day) && task.time === time;
        } else {
            return task.day === day && task.time === time;
        }
    });
}

// Create task element
function createTaskElement(task, day, dayIndex) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task ${task.type}`;
    taskDiv.dataset.type = task.type;
    taskDiv.dataset.taskId = task.id;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'task-title';
    titleDiv.textContent = task.title;

    const timeDiv = document.createElement('div');
    timeDiv.className = 'task-time';
    timeDiv.textContent = task.time;

    taskDiv.appendChild(titleDiv);
    taskDiv.appendChild(timeDiv);

    taskDiv.addEventListener('click', () => showTaskDetails(task, day));

    return taskDiv;
}

// Show task details in modal
function showTaskDetails(task, day) {
    const modal = document.getElementById('editModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Title</div>
            <div class="detail-value">${task.title}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Time</div>
            <div class="detail-value">${task.time}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Type</div>
            <div class="detail-value ${task.type}">${formatType(task.type)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Day(s)</div>
            <div class="detail-value">${task.recurring ? task.days.map(d => capitalize(d)).join(', ') : capitalize(day)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Recurring</div>
            <div class="detail-value">${task.recurring ? 'Yes' : 'No'}</div>
        </div>
        ${task.description ? `
        <div class="detail-row">
            <div class="detail-label">Description</div>
            <div class="detail-value">${task.description}</div>
        </div>
        ` : ''}
        ${task.location ? `
        <div class="detail-row">
            <div class="detail-label">Location</div>
            <div class="detail-value">${task.location}</div>
        </div>
        ` : ''}
    `;

    modal.classList.remove('hidden');
}

// Show today's highlights
function showTodayHighlights() {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to our format
    const dayName = DAYS[dayIndex];

    const todayTasks = scheduleData.filter(task => {
        if (task.recurring) {
            return task.days.includes(dayName);
        } else {
            return task.day === dayName;
        }
    }).sort((a, b) => a.time.localeCompare(b.time));

    const highlightsSection = document.getElementById('todayHighlights');
    const content = document.getElementById('todayContent');

    if (todayTasks.length === 0) {
        content.innerHTML = '<p style="color: #718096;">No tasks scheduled for today.</p>';
    } else {
        content.innerHTML = todayTasks.map(task => `
            <div class="highlight-item ${task.type}">
                <div>
                    <div class="highlight-title">${task.title}</div>
                    ${task.description ? `<div class="highlight-desc">${task.description}</div>` : ''}
                </div>
                <div class="highlight-time">${task.time}</div>
            </div>
        `).join('');
    }

    highlightsSection.classList.remove('hidden');
}

// Apply filter
function applyFilter() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        if (currentFilter === 'all' || task.dataset.type === currentFilter) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter
    document.getElementById('typeFilter').addEventListener('change', (e) => {
        currentFilter = e.target.value;
        applyFilter();
    });

    // Today button
    document.getElementById('todayBtn').addEventListener('click', showTodayHighlights);

    // Close today highlights
    document.getElementById('closeTodayBtn').addEventListener('click', () => {
        document.getElementById('todayHighlights').classList.add('hidden');
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('editModal').classList.add('hidden');
    });

    // Close modal on outside click
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            document.getElementById('editModal').classList.add('hidden');
        }
    });
}

// Utility functions
function formatType(type) {
    return type.split('-').map(word => capitalize(word)).join(' ');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showError(message) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'background: #fed7d7; color: #742a2a; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #f56565;';
    errorDiv.textContent = '⚠️ ' + message;
    container.insertBefore(errorDiv, container.firstChild);
}