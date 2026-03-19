const STUDENT_KEY = "lab:student:sessions";
const TEACHER_KEY = "lab:teacher:records";

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getStudentSessions() {
  return read(STUDENT_KEY);
}

export function saveStudentSession(session) {
  const all = getStudentSessions();
  const existingIndex = all.findIndex((x) => x.id === session.id);
  if (existingIndex >= 0) {
    all[existingIndex] = session;
  } else {
    all.unshift(session);
  }
  write(STUDENT_KEY, all);
  return all;
}

export function deleteStudentSession(id) {
  const all = getStudentSessions().filter((x) => x.id !== id);
  write(STUDENT_KEY, all);
  return all;
}

export function getTeacherRecords() {
  return read(TEACHER_KEY);
}

export function syncToTeacher(session) {
  const all = getTeacherRecords();
  const minimal = {
    id: session.id,
    studentName: session.studentName,
    rollNo: session.rollNo,
    date: session.date,
    sessionName: session.sessionName,
    fluid: session.fluid,
    status: session.status ?? "Pending",
    remark: session.remark ?? "",
    updatedAt: session.updatedAt,
    rows: session.rows,
  };
  const i = all.findIndex((x) => x.id === minimal.id);
  if (i >= 0) all[i] = { ...all[i], ...minimal };
  else all.unshift(minimal);
  write(TEACHER_KEY, all);
  return all;
}

export function updateTeacherRecord(id, patch) {
  const all = getTeacherRecords();
  const i = all.findIndex((x) => x.id === id);
  if (i >= 0) {
    all[i] = { ...all[i], ...patch, updatedAt: new Date().toISOString() };
    write(TEACHER_KEY, all);
  }
  return all;
}
