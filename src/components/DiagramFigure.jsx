import { useMemo, useState } from "react";

const SOURCES = ["/diagram.png", "/diagram.jpg", "/diagram.jpeg", "/diagram.webp", "/diagram.svg"];

export default function DiagramFigure({ alt = "Standard inclined-plane setup diagram" }) {
  const [index, setIndex] = useState(0);
  const source = SOURCES[index] ?? "/diagram.svg";

  const fallbackText = useMemo(
    () =>
      "Diagram file not found. Add your image as public/diagram.png (recommended), or public/diagram.jpg, public/diagram.jpeg, public/diagram.webp, public/diagram.svg.",
    []
  );

  return (
    <figure className="diagram-figure">
      <img
        className="diagram"
        src={source}
        alt={alt}
        onError={() => setIndex((i) => Math.min(i + 1, SOURCES.length - 1))}
      />
      <figcaption className="muted">{fallbackText}</figcaption>
    </figure>
  );
}
