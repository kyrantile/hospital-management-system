const STORAGE_KEY = 'hospital-management-system';
const USER_SESSION_KEY = 'hospital-management-session';

const defaultState = {
  patients: [
    { id: 'p-1', name: 'Emma Johnson', age: 32, gender: 'Female', condition: 'Migraine', doctorId: 'd-1' },
    { id: 'p-2', name: 'Liam Davis', age: 48, gender: 'Male', condition: 'Hypertension', doctorId: 'd-2' },
    { id: 'p-3', name: 'Olivia Smith', age: 27, gender: 'Female', condition: 'Routine Check-up', doctorId: 'd-3' },
    { id: 'p-4', name: 'Noah Brown', age: 41, gender: 'Male', condition: 'Back Pain', doctorId: 'd-1' },
  ],
  doctors: [
    { id: 'd-1', name: 'Dr. Sarah Lee', specialty: 'Neurologist', departmentId: 'dept-1', shift: 'Mon-Fri 9AM-5PM' },
    { id: 'd-2', name: 'Dr. Michael Chen', specialty: 'Cardiologist', departmentId: 'dept-2', shift: 'Tue-Sat 8AM-4PM' },
    { id: 'd-3', name: 'Dr. Anita Gomez', specialty: 'General Physician', departmentId: 'dept-3', shift: 'Daily 10AM-6PM' },
    { id: 'd-4', name: 'Dr. Paul Nguyen', specialty: 'Orthopedic', departmentId: 'dept-4', shift: 'Mon-Thu 8AM-2PM' },
  ],
  appointments: [
    { id: 'a-1', patientId: 'p-1', doctorId: 'd-1', date: getTodayString(), time: '09:30', status: 'Scheduled' },
    { id: 'a-2', patientId: 'p-2', doctorId: 'd-2', date: getTodayString(), time: '11:00', status: 'Checked In' },
    { id: 'a-3', patientId: 'p-3', doctorId: 'd-3', date: getFutureDate(2), time: '14:15', status: 'Completed' },
    { id: 'a-4', patientId: 'p-4', doctorId: 'd-4', date: getFutureDate(5), time: '10:00', status: 'Scheduled' },
  ],
  departments: [
    { id: 'dept-1', name: 'Neurology', floor: '2nd Floor', head: 'Dr. Sarah Lee' },
    { id: 'dept-2', name: 'Cardiology', floor: '3rd Floor', head: 'Dr. Michael Chen' },
    { id: 'dept-3', name: 'General Medicine', floor: '1st Floor', head: 'Dr. Anita Gomez' },
    { id: 'dept-4', name: 'Orthopedics', floor: '4th Floor', head: 'Dr. Paul Nguyen' },
  ],
  billing: [
    { id: 'b-1', invoiceId: 'INV-1001', patientId: 'p-1', amount: 220, status: 'Paid' },
    { id: 'b-2', invoiceId: 'INV-1002', patientId: 'p-2', amount: 360, status: 'Pending' },
    { id: 'b-3', invoiceId: 'INV-1003', patientId: 'p-3', amount: 140, status: 'Paid' },
  ],
  records: [
    {
      id: 'r-1',
      patientId: 'p-1',
      doctorId: 'd-1',
      date: getTodayString(),
      title: 'Neurology Follow-up',
      notes: 'Patient reports reduced headache frequency and improved sleep quality following previous treatment.',
      prescription: 'Paracetamol 500mg, 1 tablet twice daily for 5 days.'
    },
    {
      id: 'r-2',
      patientId: 'p-2',
      doctorId: 'd-2',
      date: getFutureDate(1),
      title: 'Cardiac Review',
      notes: 'Blood pressure remains elevated. Recommend continued lifestyle monitoring and medication review.',
      prescription: 'Amlodipine 5mg once daily.'
    },
    {
      id: 'r-3',
      patientId: 'p-3',
      doctorId: 'd-3',
      date: getFutureDate(2),
      title: 'General Consultation',
      notes: 'Routine health evaluation with no major findings. Continue annual wellness check schedule.',
      prescription: 'Vitamin D3 1000 IU once daily.'
    }
  ]
};

const credentials = {
  email: 'admin@medflow.com',
  password: 'admin123'
};

let state = loadState();

const authScreen = document.getElementById('authScreen');
const appShell = document.getElementById('appShell');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const navButtons = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page');
const openButtons = document.querySelectorAll('[data-open]');
const closeButtons = document.querySelectorAll('[data-close]');
const resetDataBtn = document.getElementById('resetDataBtn');
const globalSearch = document.getElementById('globalSearch');

const patientForm = document.getElementById('patientForm');
const doctorForm = document.getElementById('doctorForm');
const appointmentForm = document.getElementById('appointmentForm');
const recordForm = document.getElementById('recordForm');
const departmentForm = document.getElementById('departmentForm');
const billingForm = document.getElementById('billingForm');

const patientDoctorSelect = document.getElementById('patientDoctorSelect');
const doctorDepartmentSelect = document.getElementById('doctorDepartmentSelect');
const appointmentPatientSelect = document.getElementById('appointmentPatientSelect');
const appointmentDoctorSelect = document.getElementById('appointmentDoctorSelect');
const recordPatientSelect = document.getElementById('recordPatientSelect');
const recordDoctorSelect = document.getElementById('recordDoctorSelect');
const billingPatientSelect = document.getElementById('billingPatientSelect');

const patientsTable = document.getElementById('patientsTable');
const doctorsGrid = document.getElementById('doctorsGrid');
const appointmentsTable = document.getElementById('appointmentsTable');
const recordsGrid = document.getElementById('recordsGrid');
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
  setupAuth();
  setupNavigation();
  setupModals();
  setupForms();
  setupSearch();
  syncAuthView();
  renderAll();
}

function setupAuth() {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    if (email === credentials.email && password === credentials.password) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify({ email, role: 'admin' }));
      loginError.textContent = '';
      syncAuthView();
      return;
    }

    loginError.textContent = 'Invalid email or password.';
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(USER_SESSION_KEY);
    syncAuthView();
  });
}

function syncAuthView() {
  const session = JSON.parse(localStorage.getItem(USER_SESSION_KEY) || 'null');
  const isLoggedIn = !!session;

  authScreen.classList.toggle('hidden', isLoggedIn);
  appShell.classList.toggle('hidden', !isLoggedIn);

  if (isLoggedIn) {
    renderAll();
  }
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

function setupSearch() {
  globalSearch.addEventListener('input', renderAll);
}

function setupForms() {
  patientForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(patientForm);
    const patient = {
      id: makeId('p'),
      name: formData.get('name').trim(),
      age: Number(formData.get('age')),
      gender: formData.get('gender'),
      condition: formData.get('condition').trim(),
      doctorId: formData.get('doctorId') || ''
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
      id: makeId('d'),
      name: formData.get('name').trim(),
      specialty: formData.get('specialty').trim(),
      departmentId: formData.get('departmentId') || '',
      shift: formData.get('shift').trim()
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
      id: makeId('a'),
      patientId: formData.get('patientId'),
      doctorId: formData.get('doctorId'),
      date: formData.get('date'),
      time: formData.get('time'),
      status: formData.get('status')
    };

    state.appointments.push(appointment);
    saveState();
    renderAll();
    appointmentForm.reset();
    closeModal('appointmentModal');
  });

  recordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(recordForm);
    const record = {
      id: makeId('r'),
      patientId: formData.get('patientId'),
      doctorId: formData.get('doctorId'),
      date: formData.get('date'),
      title: formData.get('title').trim(),
      notes: formData.get('notes').trim(),
      prescription: formData.get('prescription').trim()
    };

    state.records.push(record);
    saveState();
    renderAll();
    recordForm.reset();
    closeModal('recordModal');
  });

  departmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(departmentForm);
    const department = {
      id: makeId('dept'),
      name: formData.get('name').trim(),
      floor: formData.get('floor').trim(),
      head: formData.get('head').trim()
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
      id: makeId('b'),
      invoiceId: formData.get('invoiceId').trim(),
      patientId: formData.get('patientId'),
      amount: Number(formData.get('amount')),
      status: formData.get('status')
    };

    state.billing.push(invoice);
    saveState();
    renderAll();
    billingForm.reset();
    closeModal('billingModal');
  });
}

function renderAll() {
  if (!localStorage.getItem(USER_SESSION_KEY)) return;

  populateSelects();
  renderDashboard();
  renderPatients();
  renderDoctors();
  renderAppointments();
  renderRecords();
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
  recordPatientSelect.innerHTML = patientOptions || '<option value="">No patients available</option>';
  recordDoctorSelect.innerHTML = doctorOptions || '<option value="">No doctors available</option>';
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
              <span class="badge ${statusClass(appointment.status)}">${appointment.status}</span>
            </li>
          `;
        })
        .join('')
    : '<li><strong>No appointments scheduled for today.</strong></li>';
}

function renderPatients() {
  const searchTerm = getSearchTerm();
  const rows = state.patients.filter((patient) => matchesSearch(patient, searchTerm));

  patientsTable.innerHTML = rows.length
    ? rows.map((patient) => {
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
      }).join('')
    : '<tr><td colspan="6"><p class="empty-state">No patients match your search.</p></td></tr>';

  document.querySelectorAll('[data-delete-patient]').forEach((button) => {
    button.addEventListener('click', () => {
      const patientId = button.dataset.deletePatient;
      state.patients = state.patients.filter((patient) => patient.id !== patientId);
      state.appointments = state.appointments.filter((appointment) => appointment.patientId !== patientId);
      state.billing = state.billing.filter((invoice) => invoice.patientId !== patientId);
      state.records = state.records.filter((record) => record.patientId !== patientId);
      saveState();
      renderAll();
    });
  });
}

function renderDoctors() {
  const searchTerm = getSearchTerm();
  const doctors = state.doctors.filter((doctor) => matchesSearch(doctor, searchTerm));

  doctorsGrid.innerHTML = doctors.length
    ? doctors.map((doctor) => {
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
      }).join('')
    : '<p class="empty-state">No doctors match your search.</p>';

  document.querySelectorAll('[data-delete-doctor]').forEach((button) => {
    button.addEventListener('click', () => {
      const doctorId = button.dataset.deleteDoctor;
      state.doctors = state.doctors.filter((doctor) => doctor.id !== doctorId);
      state.patients = state.patients.map((patient) =>
        patient.doctorId === doctorId ? { ...patient, doctorId: '' } : patient
      );
      state.appointments = state.appointments.filter((appointment) => appointment.doctorId !== doctorId);
      state.records = state.records.filter((record) => record.doctorId !== doctorId);
      saveState();
      renderAll();
    });
  });
}

function renderAppointments() {
  const searchTerm = getSearchTerm();
  const appointments = state.appointments.filter((appointment) => {
    const patient = getPatientById(appointment.patientId);
    const doctor = getDoctorById(appointment.doctorId);
    const searchTarget = `${patient ? patient.name : ''} ${doctor ? doctor.name : ''} ${appointment.status} ${appointment.date}`.toLowerCase();
    return searchTarget.includes(searchTerm);
  });

  appointmentsTable.innerHTML = appointments.length
    ? appointments.map((appointment) => {
        const patient = getPatientById(appointment.patientId);
        const doctor = getDoctorById(appointment.doctorId);
        return `
          <tr>
            <td>${patient ? patient.name : 'Unknown'}</td>
            <td>${doctor ? doctor.name : 'Unknown'}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td><span class="badge ${statusClass(appointment.status)}">${appointment.status}</span></td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="5"><p class="empty-state">No appointments match your search.</p></td></tr>';
}

function renderRecords() {
  const searchTerm = getSearchTerm();
  const records = state.records.filter((record) => {
    const patient = getPatientById(record.patientId);
    const doctor = getDoctorById(record.doctorId);
    const searchTarget = `${patient ? patient.name : ''} ${doctor ? doctor.name : ''} ${record.title} ${record.notes} ${record.prescription}`.toLowerCase();
    return searchTarget.includes(searchTerm);
  });

  recordsGrid.innerHTML = records.length
    ? records.map((record) => {
        const patient = getPatientById(record.patientId);
        const doctor = getDoctorById(record.doctorId);
        return `
          <article class="record-card">
            <h4>${record.title}</h4>
            <p class="meta"><strong>Patient:</strong> ${patient ? patient.name : 'Unknown'}</p>
            <p class="meta"><strong>Doctor:</strong> ${doctor ? doctor.name : 'Unknown'}</p>
            <p class="meta"><strong>Date:</strong> ${record.date}</p>
            <div class="record-body">
              <p><strong>Notes:</strong> ${record.notes}</p>
              <p><strong>Prescription:</strong> ${record.prescription}</p>
            </div>
            <div class="modal-actions">
              <button class="delete-btn" data-delete-record="${record.id}">Delete</button>
            </div>
          </article>
        `;
      }).join('')
    : '<p class="empty-state">No medical records match your search.</p>';

  document.querySelectorAll('[data-delete-record]').forEach((button) => {
    button.addEventListener('click', () => {
      const recordId = button.dataset.deleteRecord;
      state.records = state.records.filter((record) => record.id !== recordId);
      saveState();
      renderAll();
    });
  });
}

function renderDepartments() {
  const searchTerm = getSearchTerm();
  const departments = state.departments.filter((department) => matchesSearch(department, searchTerm));

  departmentsGrid.innerHTML = departments.length
    ? departments.map(
        (department) => `
          <article class="info-card">
            <h4>${department.name}</h4>
            <p class="meta"><strong>Floor:</strong> ${department.floor}</p>
            <p class="meta"><strong>Head:</strong> ${department.head}</p>
            <button class="delete-btn" data-delete-department="${department.id}">Delete</button>
          </article>
        `
      ).join('')
    : '<p class="empty-state">No departments match your search.</p>';

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
  const searchTerm = getSearchTerm();
  const invoices = state.billing.filter((invoice) => {
    const patient = getPatientById(invoice.patientId);
    const target = `${invoice.invoiceId} ${patient ? patient.name : ''} ${invoice.status}`.toLowerCase();
    return target.includes(searchTerm);
  });

  billingTable.innerHTML = invoices.length
    ? invoices.map((invoice) => {
        const patient = getPatientById(invoice.patientId);
        return `
          <tr>
            <td>${invoice.invoiceId}</td>
            <td>${patient ? patient.name : 'Unknown'}</td>
            <td>${formatCurrency(invoice.amount)}</td>
            <td><span class="badge ${invoice.status.toLowerCase()}">${invoice.status}</span></td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="4"><p class="empty-state">No billing records match your search.</p></td></tr>';
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
    currency: 'USD'
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
  const base = JSON.parse(JSON.stringify(defaultState));
  return base;
}

function matchesSearch(item, searchTerm) {
  if (!searchTerm) return true;
  const values = Object.values(item).join(' ').toLowerCase();
  return values.includes(searchTerm);
}

function getSearchTerm() {
  return (globalSearch?.value || '').trim().toLowerCase();
}

function statusClass(status) {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  return normalized;
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}
