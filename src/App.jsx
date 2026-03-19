import { useEffect, useMemo, useState } from "react";
import TopBar from "./components/TopBar";
import StaticExperimentInfo from "./components/StaticExperimentInfo";
import SessionForm from "./components/SessionForm";
import ResultsSection from "./components/ResultsSection";
import HistoryDrawer from "./components/HistoryDrawer";
import TeacherPanel from "./components/TeacherPanel";
import ReportPrintView from "./components/ReportPrintView";
import { computeViscosity, validateInput } from "./utils/calculations";
import {
  deleteStudentSession,
  getStudentSessions,
  getTeacherRecords,
  saveStudentSession,
  syncToTeacher,
  updateTeacherRecord,
} from "./utils/storage";

function initialState() {
  return {
    id: crypto.randomUUID(),
    studentName: "",
    rollNo: "",
    date: new Date().toISOString().slice(0, 10),
    sessionName: `Viscosity Session ${new Date().toLocaleDateString()}`,
    fluid: "Caramel",
    unitSystem: "SI",
    diameter: "3.3",
    diameterUnit: "cm",
    hypotenuse: "44",
    hypotenuseUnit: "cm",
    distance: "17.5",
    distanceUnit: "cm",
    positions: [
      { height: "26.4", heightUnit: "cm", mass: "1.2", massUnit: "g", time: "81", timeUnit: "s" },
      { height: "22.1", heightUnit: "cm", mass: "1.37", massUnit: "g", time: "162", timeUnit: "s" },
      { height: "11.3", heightUnit: "cm", mass: "1.21", massUnit: "g", time: "27.45", timeUnit: "s" },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export default function App() {
  const [state, setState] = useState(initialState);
  const [rows, setRows] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [mode, setMode] = useState("student");
  const [teacherRecords, setTeacherRecords] = useState([]);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    setSessions(getStudentSessions());
    setTeacherRecords(getTeacherRecords());
  }, []);

  useEffect(() => {
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = { ...state, rows, updatedAt: new Date().toISOString() };
      localStorage.setItem("lab:draft", JSON.stringify(draft));
    }, 900);
    return () => clearTimeout(timer);
  }, [state, rows]);

  useEffect(() => {
    const raw = localStorage.getItem("lab:draft");
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      setState((s) => ({ ...s, ...draft }));
      if (Array.isArray(draft.rows)) setRows(draft.rows);
    } catch {
      // Ignore corrupted draft.
    }
  }, []);

  const canExport = useMemo(() => rows.length > 0, [rows]);

  const onCalculate = () => {
    const validation = validateInput(state);
    setErrors(validation);
    if (validation.length) return;
    const { rows: computed, warnings: warn } = computeViscosity(state);
    setRows(computed);
    setWarnings(warn);
  };

  const onSave = () => {
    const validation = validateInput(state);
    setErrors(validation);
    if (validation.length) return;
    const saved = {
      ...state,
      rows,
      updatedAt: new Date().toISOString(),
    };
    const all = saveStudentSession(saved);
    setSessions(all);
    const t = syncToTeacher(saved);
    setTeacherRecords(t);
    alert("Session saved.");
  };

  const onNew = () => {
    setState(initialState());
    setRows([]);
    setWarnings([]);
    setErrors([]);
  };

  const onLoad = (id) => {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    setState(s);
    setRows(s.rows || []);
    setHistoryOpen(false);
  };

  const onDelete = (id) => {
    setSessions(deleteStudentSession(id));
  };

  const onDownload = async () => {
    if (!canExport || isPdfGenerating) return;
    setIsPdfGenerating(true);
    const target = document.getElementById("report-sheet");
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const w = 210;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`${state.rollNo || "report"}-${state.date || "lab"}.pdf`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const onInstallApp = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
  };

  const onPrint = () => {
    window.print();
  };

  const onStatus = (id, status) => setTeacherRecords(updateTeacherRecord(id, { status }));
  const onRemark = (id, remark) => setTeacherRecords(updateTeacherRecord(id, { remark }));

  return (
    <div className="app-shell">
      <TopBar
        onNew={onNew}
        onSave={onSave}
        onPrint={onPrint}
        onDownload={onDownload}
        onToggleHistory={() => setHistoryOpen((x) => !x)}
        mode={mode}
        onModeChange={setMode}
        canInstall={Boolean(deferredInstallPrompt)}
        onInstall={onInstallApp}
        isPdfGenerating={isPdfGenerating}
      />

      <HistoryDrawer open={historyOpen} sessions={sessions} onLoad={onLoad} onDelete={onDelete} />

      <main className="layout">
        {mode === "student" ? (
          <>
            <StaticExperimentInfo />
            <SessionForm state={state} setState={setState} onCalculate={onCalculate} errors={errors} warnings={warnings} />
            <ResultsSection rows={rows} />
          </>
        ) : (
          <TeacherPanel records={teacherRecords} onStatus={onStatus} onRemark={onRemark} />
        )}
      </main>

      <section className="print-container" aria-hidden="true">
        <ReportPrintView state={state} rows={rows} />
      </section>

      <div className="mobile-actions">
        <button className="btn primary" onClick={onCalculate}>Calculate</button>
        <button className="btn primary" onClick={onSave}>Save</button>
        <button className="btn accent" onClick={onDownload} disabled={!canExport || isPdfGenerating}>
          {isPdfGenerating ? "Working..." : "PDF"}
        </button>
      </div>
    </div>
  );
}
