async function sendMessage() {
    const chatOutput = document.getElementById('chat-output');
    const chatInput = document.getElementById('chat-input');
    const appointmentForm = document.getElementById('appointment-form');
    const message = chatInput.value.trim();

    if (!message) return;

    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'user');
    userMessage.textContent = message;
    chatOutput.appendChild(userMessage);

    try {
        const response = await fetch('/chatbot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        const botMessage = document.createElement('div');
        botMessage.classList.add('chat-message', 'bot');
        botMessage.textContent = data.reply || "Sorry, something went wrong.";
        chatOutput.appendChild(botMessage);

        if (data.showAppointmentForm) {
            appointmentForm.style.display = 'block';
            appointmentForm.style.order = '999';
        } else {
            appointmentForm.style.display = 'none';
        }

        chatOutput.scrollTop = chatOutput.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('chat-message', 'error');
        errorMessage.textContent = "Error communicating with the server. Please try again.";
        chatOutput.appendChild(errorMessage);
    }

    chatInput.value = '';
}

document.getElementById('chat-form').addEventListener('submit', function (event) {
    event.preventDefault();
    sendMessage();
});

function filterAppointments(filter) {
    const appointmentItems = document.querySelectorAll('.appointment-booked-item');
    appointmentItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const appointmentData = Object.fromEntries(formData);
    const chatOutput = document.getElementById('chat-output');
    const appointmentForm = document.getElementById('appointment-form');
  
    try {
      const response = await fetch('/appointment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
  
      if (response.ok) {
        const newAppointment = await response.json();
        addAppointmentToList(newAppointment);
        appointmentForm.style.display = 'none';
        const botMessage = document.createElement('div');
        botMessage.classList.add('chat-message', 'bot');
        botMessage.textContent = "Appointment request is successfully submitted." || "Sorry, something went wrong.";
        chatOutput.appendChild(botMessage);
      } else {
        const error = await response.json();
        console.error(error.message);
        alert(error.message);
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
    }
  });

  document.getElementById('appointments-list').addEventListener('click', async (e) => {
    const target = e.target;
    const appointmentId = target.getAttribute('data-id');
  
    if (target.classList.contains('view-btn')) {
      openModal('View Appointment', appointmentId, false);
    } else if (target.classList.contains('edit-btn')) {
      openModal('Edit Appointment', appointmentId, true);
    } else if (target.classList.contains('cancel-btn')) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            await cancelAppointment(appointmentId);
            removeAppointmentFromList(appointmentId)
        }
    }
  });
  
  const modal = document.getElementById('appointment-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const modalTitle = document.getElementById('modal-title');
  const saveBtn = document.getElementById('save-appointment');
  const form = document.getElementById('appointment-form-edit');
  
  // Open Modal
  async function openModal(title, appointmentId, isEditable) {
    try {
      console.log("appointment id: ", appointmentId);
      const response = await fetch(`/appointment/${appointmentId}`);
      const appointment = await response.json();

      console.log("appointment: ", appointment);
  
      document.getElementById('doctor').value = appointment.Doctor ? `Dr. ${appointment.Doctor.User.firstName} ${appointment.Doctor.User.lastName}` : 'Unknown';
      document.getElementById('firstName').value = appointment.firstName;
      document.getElementById('lastName').value = appointment.lastName;
      document.getElementById('uniqueId').value = appointment.uniquePersonalIdentificationNumber;
      document.getElementById('date').value = appointment.date;
      document.getElementById('time').value = appointment.time;
      document.getElementById('desc').value = appointment.issueDescription;
      document.getElementById('status').value = appointment.status;
  
      modalTitle.textContent = title;
      saveBtn.style.display = isEditable ? 'block' : 'none';
      document.getElementById('firstName').readOnly = !isEditable;
      document.getElementById('lastName').readOnly = !isEditable;
      document.getElementById('uniqueId').readOnly = !isEditable;
      document.getElementById('desc').readOnly = !isEditable;
      document.getElementById('date').readOnly = !isEditable;
      document.getElementById('time').readOnly = !isEditable;
  
      form.onsubmit = (e) => {
        e.preventDefault();
        if (isEditable) editAppointment(appointmentId);
      };
  
      modal.style.display = 'flex';
    } catch (error) {
      console.error('Error fetching appointment:', error);
    }
  }
  
  // Close Modal
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Edit Appointment
  async function editAppointment(appointmentId) {
    const newFirstName = document.getElementById('firstName').value;
    const newlastName = document.getElementById('lastName').value;
    const newUniqueId = document.getElementById('uniqueId').value;
    const newDesc = document.getElementById('desc').value;
    const newDate = document.getElementById('date').value;
    const newTime = document.getElementById('time').value;
  
    try {
      const response = await fetch(`/appointment/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: newFirstName, lastName: newlastName, uniquePersonalIdentificationNumber: newUniqueId, date: newDate, time: newTime, issueDescription: newDesc }),
      });
  
      if (response.ok) {
        alert('Appointment updated successfully!');
        modal.style.display = 'none';
        location.reload(); 
      } else {
        alert('Failed to update appointment.');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  }
  
  
  function addAppointmentToList(appointment) {
    const list = document.getElementById('appointments-list');
    
    const listItem = document.createElement('li');
    listItem.classList.add('appointment-item');
    listItem.innerHTML = `
      <strong>Doctor:</strong> ${appointment.doctor}<br>
      <strong>Date:</strong> ${appointment.date}<br>
      <strong>Time:</strong> ${appointment.time}<br>
      <strong>Status:</strong> ${appointment.status}<br>
      <button class="view-btn appointment-btn" data-id="${appointment.id}">View</button>
      <button class="edit-btn appointment-btn" data-id="${appointment.id}">Edit</button>
      <button class="cancel-btn appointment-btn" data-id="${appointment.id}">Cancel</button>
    `;

    list.appendChild(listItem);

    listItem.querySelector('.view-btn').addEventListener('click', () => {
        openModal('View Appointment', appointment.id, false);
    });

    listItem.querySelector('.edit-btn').addEventListener('click', () => {
        openModal('Edit Appointment', appointment.id, true);
    });

    listItem.querySelector('.cancel-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            await cancelAppointment(appointment.id);
            listItem.remove();
        }
    });
  }

  async function cancelAppointment(appointmentId) {
    try {
        const response = await fetch(`/appointment/${appointmentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Appointment canceled successfully!');
        } else {
            alert('Failed to cancel the appointment.');
        }
    } catch (error) {
        console.error('Error canceling appointment:', error);
    }
}

function removeAppointmentFromList(appointmentId) {
    const list = document.getElementById('appointments-list');
    const appointmentItems = list.querySelectorAll('.appointment-item');

    appointmentItems.forEach(item => {
        const cancelButton = item.querySelector('.cancel-btn');
        const id = cancelButton.getAttribute('data-id');
        if (id === appointmentId) {
            item.remove(); 
        }
    });
}

/* Edit profile popup */ 

const modalEditProfile = document.getElementById('editProfileModal');

const openEditProfileModalBtn = document.getElementById('edit-profile');
const closeEditProfileModalBtn = document.getElementById('closeEditModalBtn');

openEditProfileModalBtn.onclick = function() {
  modalEditProfile.style.display = "block";
}

openEditProfileModalBtn.addEventListener('click', () => {
  modalEditProfile.style.display = 'block';
});


closeEditProfileModalBtn.addEventListener('click', () => {
  modalEditProfile.style.display = 'none';
});


  