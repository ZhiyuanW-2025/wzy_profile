import { referenceCity as city } from "@/content/reference-city";

/** Editable facade signage shares the art's world coordinates, never the HUD. */
export function CityLandmarkSigns() {
  const entry = city.studioEntrySign;
  return <svg className="rc-landmark-signs" viewBox={`0 0 ${city.width} ${city.height}`} aria-hidden="true">
    {city.landmarkSigns.map(sign => <g key={sign.id} transform={`translate(${sign.x} ${sign.y})`}>
      <g fill="#233b60" stroke="#6c8bb0" strokeWidth="1" shapeRendering="crispEdges">
        <path d={`M20 -8h4v48h-4z M${sign.width - 24} -8h4v48h-4z`} />
      </g>
      <path fill="#071125" stroke="#153c6d" strokeWidth="5" d={`M3 0h${sign.width - 6}v3h3v${sign.height - 6}h-3v3H3v-3H0V3h3z`} />
      <path fill="#071b33" stroke={sign.color} strokeWidth="1.5" d={`M3 0h${sign.width - 6}v3h3v${sign.height - 6}h-3v3H3v-3H0V3h3z`} />
      <path stroke="#3b5b89" d={`M5 4h${sign.width - 10} M5 ${sign.height - 4}h${sign.width - 10}`} />
      <text x={sign.width / 2} y={sign.height / 2 + 5.5} textAnchor="middle" fill={sign.color}
        fontFamily="Consolas, monospace" fontSize="17" fontWeight="700" letterSpacing=".2">{sign.text}</text>
    </g>)}
    <g className="rc-studio-entry-sign" transform={`translate(${entry.x} ${entry.y})`}>
      <rect width={entry.width} height={entry.height} fill="#07162a" />
      <path d={`M5 2H${entry.width - 5}v3h3v${entry.height - 10}h-3v3H5v-3H2V5h3z`} fill="#06192d" stroke="#2ce0ed" strokeWidth="2" />
      <path d={`M7 6H${entry.width - 7} M7 ${entry.height - 6}H${entry.width - 7}`} stroke="#25496a" strokeWidth="1" />
      <text x="18" y="28" fill="#e3faff" fontFamily="PingFang SC, Microsoft YaHei, sans-serif" fontWeight="600" fontSize="23" letterSpacing="1.2">{city.campusSign}</text>
      <path d={`M${entry.width - 29} 28l12 -12 M${entry.width - 29} 16h12v12`} fill="none" stroke="#36ecf2" strokeWidth="2.5" strokeLinejoin="miter" />
    </g>
  </svg>;
}
