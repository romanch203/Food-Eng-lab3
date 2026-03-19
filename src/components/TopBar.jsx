import { FaFileAlt, FaHistory, FaPlus, FaPrint, FaSave } from "react-icons/fa";

export default function TopBar({
  onNew,
  onSave,
  onPrint,
  onDownload,
  onToggleHistory,
  mode,
  onModeChange,
  canInstall,
  onInstall,
  isPdfGenerating,
}) {
  return (
    <header className="topbar">
      <div className="title-wrap">
        <h1>Digital Lab Report</h1>
        <p>Viscosity by Newton's Law Using Inclined Plane</p>
      </div>
      <div className="toolbar">
        <button onClick={onNew} className="btn ghost"><FaPlus /> New Session</button>
        <button onClick={onSave} className="btn primary"><FaSave /> Save</button>
        <button onClick={onDownload} className="btn accent" disabled={isPdfGenerating}>
          <FaFileAlt /> {isPdfGenerating ? "Generating..." : "Download PDF"}
        </button>
        <button onClick={onPrint} className="btn ghost"><FaPrint /> Print</button>
        <button onClick={onToggleHistory} className="btn ghost"><FaHistory /> History</button>
        {canInstall ? <button onClick={onInstall} className="btn ghost">Install App</button> : null}
        <select value={mode} onChange={(e) => onModeChange(e.target.value)} className="mode-select" aria-label="App mode">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
    </header>
  );
}
