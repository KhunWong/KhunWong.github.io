// Global variables
let scheduleData = [];
let currentFilter = 'all';

// Time slots for the schedule (7 AM to 6 PM)
const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// <CHANGE> Added helper function to calculate time difference in hours
function getTimeDifferenceInSlots(startTime, endTime) {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return (endMinutes - startMinutes) / 60; // Return hours as decimal
}

// <CHANGE> Added helper function to find the closest time slot index
function findTimeSlotIndex(time) {
  const [hour, min] = time.split(':').map(Number);
  const timeMinutes = hour * 60 + min;
  
  // Find the closest time slot
  let closestIndex = 0;
  let minDiff = Infinity;
  
  timeSlots.forEach((slot, index) => {
    const [slotHour, slotMin] = slot.split(':').map(Number);
    const slotMinutes = slotHour * 60 + slotMin;
    const diff = Math.abs(timeMinutes - slotMinutes);
    
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });
  
  return closestIndex;
}

// Load schedule data from JSON
async function loadSchedule() {
  try {
    const response = await fetch('schedule.json');
    const data = await response.json();
    scheduleData = data.tasks;
    renderSchedule();
    updateTodayHighlights();
  } catch (error) {
    console.error('Error loading schedule:', error);
    document.getElementById('schedule-grid').innerHTML = 
      '<div class="error-message">Error loading schedule. Please make sure schedule.json is in the same folder.</div>';
  }
}

// Get tasks for a specific day and time
function getTasksForSlot(day, time) {
  return scheduleData.filter(task => {
    // Check if task matches the day
    const matchesDay = task.recurring 
      ? task.days.includes(day)
      : task.day === day;
    
    if (!matchesDay) return false;
    
    // <CHANGE> Check if the time slot falls within the task's time range
    if (task.endTime) {
      const taskStartIndex = findTimeSlotIndex(task.time);
      const taskEndIndex = findTimeSlotIndex(task.endTime);
      const currentSlotIndex = timeSlots.indexOf(time);
      
      return currentSlotIndex >= taskStartIndex && currentSlotIndex < taskEndIndex;
    } else {
      // For tasks without endTime, match exact time slot
      return task.time === time;
    }
  });
}

// <CHANGE> Check if this is the first slot for a task (to avoid rendering duplicates)
function isFirstSlotForTask(task, day, time) {
  if (!task.endTime) return true;
  
  const taskStartIndex = findTimeSlotIndex(task.time);
  const currentSlotIndex = timeSlots.indexOf(time);
  
  return currentSlotIndex === taskStartIndex;
}

// Render the schedule grid
function renderSchedule() {
  const grid = document.getElementById('schedule-grid');
  grid.innerHTML = '';
  
  // Create header row
  const headerRow = document.createElement('div');
  headerRow.className = 'grid-header';
  headerRow.innerHTML = '<div class="time-header">Time</div>';
  
  daysOfWeek.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.textContent = day;
    
    // Highlight today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    if (day === today) {
      dayHeader.classList.add('today');
    }
    
    headerRow.appendChild(dayHeader);
  });
  
  grid.appendChild(headerRow);
  
  // Create time slots
  timeSlots.forEach(time => {
    const row = document.createElement('div');
    row.className = 'time-row';
    
    // Time label
    const timeLabel = document.createElement('div');
    timeLabel.className = 'time-label';
    timeLabel.textContent = time;
    row.appendChild(timeLabel);
    
    // Day cells
    daysOfWeek.forEach(day => {
      const cell = document.createElement('div');
      cell.className = 'schedule-cell';
      
      const tasks = getTasksForSlot(day, time);
      
      // <CHANGE> Filter tasks to only render at their first slot
      const tasksToRender = tasks.filter(task => isFirstSlotForTask(task, day, time));
      
      tasksToRender.forEach(task => {
        // Apply filter
        if (currentFilter !== 'all' && task.type !== currentFilter) {
          return;
        }
        
        const taskElement = document.createElement('div');
        taskElement.className = `task-item task-${task.type}`;
        
        // <CHANGE> Calculate span height if task has endTime
        if (task.endTime) {
          const duration = getTimeDifferenceInSlots(task.time, task.endTime);
          const heightPercentage = duration * 100; // Each hour = 100% of one slot
          taskElement.style.height = `${heightPercentage}%`;
          taskElement.classList.add('task-spanning');
        }
        
        // <CHANGE> Show duration in task title if it spans multiple slots
        const durationText = task.endTime 
          ? ` (${task.time}-${task.endTime})`
          : '';
        
        taskElement.innerHTML = `
          <div class="task-title">${task.title}${durationText}</div>
          <div class="task-time">${task.time}</div>
        `;
        
        taskElement.addEventListener('click', () => showTaskDetails(task));
        cell.appendChild(taskElement);
      });
      
      row.appendChild(cell);
    });
    
    grid.appendChild(row);
  });
}

// Show task details in modal
function showTaskDetails(task) {
  const modal = document.getElementById('task-modal');
  const details = document.getElementById('task-details');
  
  // <CHANGE> Include endTime in details if available
  const timeDisplay = task.endTime 
    ? `${task.time} - ${task.endTime}`
    : task.time;
  
  const duration = task.endTime 
    ? ` (${getTimeDifferenceInSlots(task.time, task.endTime).toFixed(1)} hours)`
    : '';
  
  const schedule = task.recurring
    ? `Every ${task.days.join(', ')}`
    : task.day;
  
  details.innerHTML = `
    <h3 class="task-detail-title">${task.title}</h3>
    <div class="task-detail-row">
      <span class="task-detail-label">Type:</span>
      <span class="task-badge task-${task.type}">${task.type}</span>
    </div>
    <div class="task-detail-row">
      <span class="task-detail-label">Time:</span>
      <span>${timeDisplay}${duration}</span>
    </div>
    <div class="task-detail-row">
      <span class="task-detail-label">Schedule:</span>
      <span>${schedule}</span>
    </div>
    <div class="task-detail-row">
      <span class="task-detail-label">Description:</span>
      <span>${task.description}</span>
    </div>
  `;
  
  modal.classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('task-modal').classList.remove('active');
}

// Filter tasks by type
function filterTasks(type) {
  currentFilter = type;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  renderSchedule();
}

// Update today's highlights
function updateTodayHighlights() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const highlightsContainer = document.getElementById('today-tasks');
  
  const todayTasks = scheduleData.filter(task => {
    return task.recurring 
      ? task.days.includes(today)
      : task.day === today;
  });
  
  // <CHANGE> Sort tasks by start time
  todayTasks.sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });
  
  if (todayTasks.length === 0) {
    highlightsContainer.innerHTML = '<p class="no-tasks">No tasks scheduled for today</p>';
    return;
  }
  
  highlightsContainer.innerHTML = todayTasks.map(task => {
    // <CHANGE> Show time range if endTime exists
    const timeDisplay = task.endTime 
      ? `${task.time} - ${task.endTime}`
      : task.time;
    
    return `
      <div class="highlight-item task-${task.type}">
        <div class="highlight-time">${timeDisplay}</div>
        <div class="highlight-title">${task.title}</div>
      </div>
    `;
  }).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSchedule();
  
  // Close modal when clicking outside
  document.getElementById('task-modal').addEventListener('click', (e) => {
    if (e.target.id === 'task-modal') {
      closeModal();
    }
  });
});