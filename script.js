const STORAGE_KEY = 'hospital-management-system';

const defaultState = {
  patients: [
    {
      id: crypto.randomUUID(),
      name: 'Emma Johnson',
      age: 32,
      gender: 'Female',
      condition: 'Migraine',
      doctorId: 'doc-1',
    },
    {
      id: crypto.randomUUID(),
      name: 'Liam Davis',
      age: 48,
      gender: 'Male',
      condition: 'Hypertension',
      doctorId: 'doc-2',
    },
    {
      id: crypto.randomUUID(),
      name: 'Olivia Smith',
      age: 27,
      gender: 'Female',
      condition: 'Routine Check-up',
      doctorId: 'doc-3',
    },
  ],
  doctors: [
    {
      id: 'doc-1',
      name: 'Dr. Sarah Lee',
      specialty: 'Neurologist',
      departmentId: 'dept-1',
      shift: 'Mon-Fri 9AM-5PM',
    },
    {
      id: 'doc-2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      departmentId: 'dept-2',
      shift: 'Tue-Sat 8AM-4PM',
    },
    {
      id: 'doc-3',
      name: 'Dr. Anita Gomez',
      specialty: 'General Physician',
      departmentId: 'dept-3',
      shift: 'Daily 10AM-6PM',
    },
  ],
  appointments: [
    {
      id: crypto.randomUUID(),
      patientId: 'patient-1',
      doctorId: 'doc-1',
      date: getTodayString(),
      time: '09:30',
      status: 'Scheduled',
    },
    {
      id: crypto.randomUUID(),
      patientId: 'patient-2',
      doctorId: 'doc-2',
      date: getTodayString(),
      time: '11:00',
      status: 'Checked In',
    },
    {
      id: crypto.randomUUID(),
      patientId: 'patient-3',
      doctorId: 'doc-3',
      date: getFutureDate(2),
      time: '14:15',
      status: 'Completed',
    },
  ],
  departments: [
    { id: 'dept-1', name: 'Neurology', floor: '2nd Floor', head: 'Dr. Sarah Lee' },
    { id: 'dept-2', name: 'Cardiology', floor: '3rd Floor', head: 'Dr. Michael Chen' },
    { id: 'dept-3', name: 'General Medicine', floor: '1st Floor', head: 'Dr. Anita Gomez' },
  ],
  billing: [
    {
      id: crypto.randomUUID(),
      invoiceId: 'INV-1001',
      patientId: 'patient-1',
      amount: 220,
      status: 'Paid',
    },
    {
      id: crypto.randomUUID(),
      invoiceId: 'INV-1002',
      patientId: 'patient-2',
      amount: 360,
      status: 'Pending',
    },
  ],
};

let state = loadState();

const navButtons = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page');
const openButtons = document.querySelectorAll('[data-open]');
const closeButtons = document.querySelectorAll('[data-close]');
const resetDataBtn = document.getElementById('resetDataBtn');

const patientForm = document.getElementById('patientForm');
const doctorForm = document.getElementById('doctorForm');
const appointmentForm = document.getElementById('appointmentForm');
const departmentForm = document.getElementById('departmentForm');
const billingForm = document.getElementById('billingForm');

const patientDoctorSelect = document.getElementById('patientDoctorSelect');
const doctorDepartmentSelect = document.getElementById('doctorDepartmentSelect');
const appointmentPatientSelect = document.getElementById('appointmentPatientSelect');
const appointmentDoctorSelect = document.getElementById('appointmentDoctorSelect');
const billingPatientSelect = document.getElementById('billingPatientSelect');

const patientsTable = document.getElementById('patientsTable');
const doctorsGrid = document.getElementById('doctorsGrid');
const appointmentsTable = document.getElementById('appointmentsTable');
const departmentsGrid = document.getElementById('departmentsGrid');
const billingTable = document.getElementById('billingTable');
const todayAppointments = document.getElementById('todayAppointments');

const totalPatients = document.getElementById('totalPatients');
const totalDoctors = document.getElementById('totalDoctors');
const totalAppointments = document.getElementById('totalAppointments');
const totalDepartments = document.getElementById('totalDepartments');
const totalCollected = document.getElementById('totalCollected');
const pendingBills = document.getElementById('pendingBills');

init();

function init() {
  setupNavigation();
  setupModals();
  setupForms();
  renderAll();
}

function setupNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const sectionId = button.dataset.section;
      navButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      pageSections.forEach((section) => {
        section.classList.toggle('active', section.id === sectionId);
      });
    });
  });
}

function setupModals() {
  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.open;
      openModal(modalId);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.close;
      closeModal(modalId);
    });
  });

  window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach((modal) => {
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  resetDataBtn.addEventListener('click', () => {
    state = cloneDefaultState();
    saveState();
    renderAll();
  });
}

function setupForms() {
  patientForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(patientForm);
    const patient = {
      id: crypto.randomUUID(),
      name: formData.get('name').trim(),
      age: Number(formData.get('age')),
      gender: formData.get('gender'),
      condition: formData.get('condition').trim(),
      doctorId: formData.get('doctorId'),
    };

    state.patients.push(patient);
    saveState();
    renderAll();
    patientForm.reset();
    closeModal('patientModal');
  });

  doctorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(doctorForm);
    const doctor = {
      id: crypto.randomUUID(),
      name: formData.get('name').trim(),
      specialty: formData.get('specialty').trim(),
      departmentId: formData.get('departmentId'),
      shift: formData.get('shift').trim(),
    };

    state.doctors.push(doctor);
    saveState();
    renderAll();
    doctorForm.reset();
    closeModal('doctorModal');
  });

  appointmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(appointmentForm);
    const appointment = {
      id: crypto.randomUUID(),
      patientId: formData.get('patientId'),
      doctorId: formData.get('doctorId'),
      date: formData.get('date'),
      time: formData.get('time'),
      status: formData.get('status'),
    };

    state.appointments.push(appointment);
    saveState();
    renderAll();
    appointmentForm.reset();
    closeModal('appointmentModal');
  });

  departmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(departmentForm);
    const department = {
      id: crypto.randomUUID(),
      name: formData.get('name').trim(),
      floor: formData.get('floor').trim(),
      head: formData.get('head').trim(),
    };

    state.departments.push(department);
    saveState();
    renderAll();
    departmentForm.reset();
    closeModal('departmentModal');
  });

  billingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(billingForm);
    const invoice = {
      id: crypto.randomUUID(),
      invoiceId: formData.get('invoiceId').trim(),
      patientId: formData.get('patientId'),
      amount: Number(formData.get('amount')),
      status: formData.get('status'),
    };

    state.billing.push(invoice);
    saveState();
    renderAll();
    billingForm.reset();
    closeModal('billingModal');
  });
}

function renderAll() {
  populateSelects();
  renderDashboard();
  renderPatients();
  renderDoctors();
  renderAppointments();
  renderDepartments();
  renderBilling();
}

function populateSelects() {
  const patientOptions = state.patients
    .map((patient) => `<option value="${patient.id}">${patient.name}</option>`)
    .join('');

  const doctorOptions = state.doctors
    .map((doctor) => `<option value="${doctor.id}">${doctor.name}</option>`)
    .join('');

  const departmentOptions = state.departments
    .map((department) => `<option value="${department.id}">${department.name}</option>`)
    .join('');

  patientDoctorSelect.innerHTML = doctorOptions || '<option value="">No doctors available</option>';
  doctorDepartmentSelect.innerHTML = departmentOptions || '<option value="">No departments available</option>';
  appointmentPatientSelect.innerHTML = patientOptions || '<option value="">No patients available</option>';
  appointmentDoctorSelect.innerHTML = doctorOptions || '<option value="">No doctors available</option>';
  billingPatientSelect.innerHTML = patientOptions || '<option value="">No patients available</option>';
}

function renderDashboard() {
  totalPatients.textContent = String(state.patients.length);
  totalDoctors.textContent = String(state.doctors.length);
  totalAppointments.textContent = String(state.appointments.length);
  totalDepartments.textContent = String(state.departments.length);

  const collected = state.billing
    .filter((invoice) => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const pending = state.billing
    .filter((invoice) => invoice.status === 'Pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  totalCollected.textContent = formatCurrency(collected);
  pendingBills.textContent = formatCurrency(pending);

  const today = getTodayString();
  const todaysAppointments = state.appointments.filter((appointment) => appointment.date === today);

  todayAppointments.innerHTML = todaysAppointments.length
    ? todaysAppointments
        .slice(0, 5)
        .map((appointment) => {
          const patient = getPatientById(appointment.patientId);
          const doctor = getDoctorById(appointment.doctorId);
          return `
            <li>
              <div>
                <strong>${patient ? patient.name : 'Unknown patient'}</strong><br>
                <small>${doctor ? doctor.name : 'Unknown doctor'} • ${appointment.time}</small>
              </div>
              <span class="badge ${appointment.status.toLowerCase().replace(/\s+/g, '-')}">${appointment.status}</span>
            </li>
          `;
        })
        .join('')
    : '<li><strong>No appointments scheduled for today.</strong></li>';
}

function renderPatients() {
  patientsTable.innerHTML = state.patients
    .map((patient) => {
      const doctor = getDoctorById(patient.doctorId);
      return `
        <tr>
          <td>${patient.name}</td>
          <td>${patient.age}</td>
          <td>${patient.gender}</td>
          <td>${patient.condition}</td>
          <td>${doctor ? doctor.name : 'Unassigned'}</td>
          <td><button class="delete-btn" data-delete-patient="${patient.id}">Delete</button></td>
        </tr>
      `;
    })
    .join('');

  document.querySelectorAll('[data-delete-patient]').forEach((button) => {
    button.addEventListener('click', () => {
      const patientId = button.dataset.deletePatient;
      state.patients = state.patients.filter((patient) => patient.id !== patientId);
      state.appointments = state.appointments.filter((appointment) => appointment.patientId !== patientId);
      state.billing = state.billing.filter((invoice) => invoice.patientId !== patientId);
      saveState();
      renderAll();
    });
  });
}

function renderDoctors() {
  doctorsGrid.innerHTML = state.doctors
    .map((doctor) => {
      const department = getDepartmentById(doctor.departmentId);
      return `
        <article class="info-card">
          <h4>${doctor.name}</h4>
          <p class="meta"><strong>Specialty:</strong> ${doctor.specialty}</p>
          <p class="meta"><strong>Department:</strong> ${department ? department.name : 'Unknown'}</p>
          <p class="meta"><strong>Shift:</strong> ${doctor.shift}</p>
          <button class="delete-btn" data-delete-doctor="${doctor.id}">Delete</button>
        </article>
      `;
    })
    .join('');

  document.querySelectorAll('[data-delete-doctor]').forEach((button) => {
    button.addEventListener('click', () => {
      const doctorId = button.dataset.deleteDoctor;
      state.doctors = state.doctors.filter((doctor) => doctor.id !== doctorId);
      state.patients = state.patients.map((patient) =>
        patient.doctorId === doctorId ? { ...patient, doctorId: '' } : patient
      );
      state.appointments = state.appointments.filter((appointment) => appointment.doctorId !== doctorId);
      saveState();
      renderAll();
    });
  });
}

function renderAppointments() {
  appointmentsTable.innerHTML = state.appointments
    .map((appointment) => {
      const patient = getPatientById(appointment.patientId);
      const doctor = getDoctorById(appointment.doctorId);
      return `
        <tr>
          <td>${patient ? patient.name : 'Unknown'}</td>
          <td>${doctor ? doctor.name : 'Unknown'}</td>
          <td>${appointment.date}</td>
          <td>${appointment.time}</td>
          <td><span class="badge ${appointment.status.toLowerCase().replace(/\s+/g, '-')}">${appointment.status}</span></td>
        </tr>
      `;
    })
    .join('');
}

function renderDepartments() {
  departmentsGrid.innerHTML = state.departments
    .map(
      (department) => `
        <article class="info-card">
          <h4>${department.name}</h4>
          <p class="meta"><strong>Floor:</strong> ${department.floor}</p>
          <p class="meta"><strong>Head:</strong> ${department.head}</p>
          <button class="delete-btn" data-delete-department="${department.id}">Delete</button>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('[data-delete-department]').forEach((button) => {
    button.addEventListener('click', () => {
      const departmentId = button.dataset.deleteDepartment;
      state.departments = state.departments.filter((department) => department.id !== departmentId);
      state.doctors = state.doctors.map((doctor) =>
        doctor.departmentId === departmentId ? { ...doctor, departmentId: '' } : doctor
      );
      saveState();
      renderAll();
    });
  });
}

function renderBilling() {
  billingTable.innerHTML = state.billing
    .map((invoice) => {
      const patient = getPatientById(invoice.patientId);
      return `
        <tr>
          <td>${invoice.invoiceId}</td>
          <td>${patient ? patient.name : 'Unknown'}</td>
          <td>${formatCurrency(invoice.amount)}</td>
          <td><span class="badge ${invoice.status.toLowerCase()}">${invoice.status}</span></td>
        </tr>
      `;
    })
    .join('');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneDefaultState();

  try {
    const parsed = JSON.parse(raw);
    return parsed && parsed.patients ? parsed : cloneDefaultState();
  } catch (error) {
    return cloneDefaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getPatientById(id) {
  return state.patients.find((patient) => patient.id === id);
}

function getDoctorById(id) {
  return state.doctors.find((doctor) => doctor.id === id);
}

function getDepartmentById(id) {
  return state.departments.find((department) => department.id === id);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function getTodayString() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function cloneDefaultState() {
  const cloned = JSON.parse(JSON.stringify(defaultState));

  cloned.patients = cloned.patients.map((patient) => ({
    ...patient,
    id: crypto.randomUUID(),
  }));

  cloned.doctors = cloned.doctors.map((doctor) => ({
    ...doctor,
    id: doctor.id,
  }));

  cloned.appointments = cloned.appointments.map((appointment) => ({
    ...appointment,
    id: crypto.randomUUID(),
    patientId: cloned.patients[0]?.id || appointment.patientId,
    doctorId: cloned.doctors[0]?.id || appointment.doctorId,
  }));

  cloned.billing = cloned.billing.map((invoice) => ({
    ...invoice,
    id: crypto.randomUUID(),
    patientId: cloned.patients[0]?.id || invoice.patientId,
  }));

  return cloned;
}

// Fix sample ids to align with patient entries for a smoother demo.
function normalizeDefaultIds() {
  const patientIds = state.patients.map((patient) => patient.id);

  if (patientIds.length >= 3) {
    state.appointments = state.appointments.map((appointment, index) => ({
      ...appointment,
      patientId: patientIds[index % patientIds.length],
    }));

    state.billing = state.billing.map((invoice, index) => ({
      ...invoice,
      patientId: patientIds[index % patientIds.length],
    }));
  }
}

normalizeDefaultIds();
