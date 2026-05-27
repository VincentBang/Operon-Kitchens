interface HelpTooltipProps {
  label: string;
  children: string;
}

export default function HelpTooltip({ label, children }: HelpTooltipProps) {
  return (
    <span className="tooltipWrap">
      <button className="tooltipTrigger" type="button" aria-label={label}>
        i
      </button>
      <span className="tooltipBubble" role="tooltip">{children}</span>
    </span>
  );
}
