import type { PlaceholderAsset } from "@/content/site";

export function Placeholder({ asset, className = "" }: { asset: PlaceholderAsset; className?: string }) {
  return (
    <figure className={`placeholder placeholder-${asset.ratio || "wide"} placeholder-${asset.accent || "orange"} ${className}`}>
      <div className="placeholder-grid" aria-hidden="true" />
      <div className="placeholder-cross" aria-hidden="true">+</div>
      <figcaption>
        <span>{asset.label}</span>
        <small>{asset.note}</small>
      </figcaption>
    </figure>
  );
}
