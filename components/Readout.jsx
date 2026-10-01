// Elemento de assinatura do caderno: todo método numérico produz, a cada
// passo, uma contagem de iteração e uma medida de erro. Este badge só
// deixa isso explícito — não é decoração, é o dado real do método.
export default function Readout({ iteration, error, status = "pending" }) {
  return (
    <div className="readout">
      <span className="readout-item">
        <span className="label">iteração</span>
        <span className="value">{iteration}</span>
      </span>
      <span className="readout-item">
        <span className="label">erro</span>
        <span className="value">{error}</span>
      </span>
      <span className={`readout-item status-${status}`}>
        <span className="label">status</span>
        <span className="value">
          {status === "ok" ? "convergiu" : "em execução"}
        </span>
      </span>
    </div>
  );
}
