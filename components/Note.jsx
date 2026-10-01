export default function Note({ label = "nota", type = "info", children }) {
  return (
    <div className={`note ${type === "error" ? "note-error" : ""}`}>
      <span className="note-label">{label}</span>
      {children}
    </div>
  );
}
