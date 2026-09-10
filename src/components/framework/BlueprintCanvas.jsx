import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { DESKTOP_POSITIONS, COMPACT_POSITIONS, buildPathFromNodes } from "./blueprintLayout";

/**
 * The live "project framework" visualization. Extends the line-drawing pattern already
 * used in presentation/islands/WorkflowTimeline.jsx (stroke-dashoffset draw, cyan glow)
 * instead of introducing a second animation system or any WebGL/Three.js.
 */
const BlueprintCanvas = ({ completedStepIds, currentStepId, stepLabels, compact = false, reducedMotion = false }) => {
  const pathRef = useRef(null);
  const seenNodesRef = useRef(new Set());
  const nodeRefs = useRef({});

  const positions = compact ? COMPACT_POSITIONS : DESKTOP_POSITIONS;
  const viewWidth = compact ? 320 : 100;
  const viewHeight = compact ? 60 : 100;

  const orderedIds = Object.keys(positions).filter((id) => completedStepIds.includes(id));
  const pathData = buildPathFromNodes(positions, orderedIds);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    if (!pathData) {
      path.style.strokeDasharray = "0";
      path.style.strokeDashoffset = "0";
      return;
    }

    const totalLength = path.getTotalLength();

    if (reducedMotion) {
      path.style.strokeDasharray = `${totalLength}`;
      path.style.strokeDashoffset = "0";
    } else {
      path.style.strokeDasharray = `${totalLength}`;
      gsap.fromTo(
        path,
        { strokeDashoffset: totalLength },
        { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  }, [pathData, reducedMotion]);

  useEffect(() => {
    orderedIds.forEach((id) => {
      if (seenNodesRef.current.has(id)) return;
      seenNodesRef.current.add(id);
      const node = nodeRefs.current[id];
      if (!node) return;
      if (reducedMotion) {
        gsap.set(node, { scale: 1, opacity: 1 });
      } else {
        gsap.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
      }
    });
  }, [orderedIds.join(","), reducedMotion]);

  const currentPoint = currentStepId && !completedStepIds.includes(currentStepId) ? positions[currentStepId] : null;

  return (
    <div className="relative h-full w-full pointer-events-none" aria-hidden="true">
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio={compact ? "xMidYMid meet" : "xMidYMid meet"}
      >
        <path
          d={pathData || undefined}
          fill="none"
          stroke="rgba(245,245,247,0.14)"
          strokeWidth={compact ? 0.6 : 0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          ref={pathRef}
          d={pathData || undefined}
          fill="none"
          stroke="#22D3EE"
          strokeWidth={compact ? 0.8 : 0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.5))" }}
        />

        {orderedIds.map((id) => {
          const point = positions[id];
          const size = compact ? 3.2 : 2.2;
          return (
            <rect
              key={id}
              ref={(node) => {
                nodeRefs.current[id] = node;
              }}
              x={point.x - size / 2}
              y={point.y - size / 2}
              width={size}
              height={size}
              transform={`rotate(45 ${point.x} ${point.y})`}
              fill="#050505"
              stroke="#22D3EE"
              strokeWidth={0.5}
            />
          );
        })}

        {currentPoint && (
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r={compact ? 2.2 : 1.6}
            fill="none"
            stroke="rgba(245,245,247,0.5)"
            strokeWidth={0.5}
            strokeDasharray="1.4 1.2"
            className={reducedMotion ? "" : "animate-pulse"}
          />
        )}
      </svg>

      {!compact &&
        orderedIds.map((id) => {
          const point = positions[id];
          const label = stepLabels?.[id];
          if (!label) return null;
          return (
            <span
              key={id}
              className="pointer-events-none absolute -translate-x-1/2 translate-y-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.14em] text-white/45"
              style={{ left: `${(point.x / viewWidth) * 100}%`, top: `${(point.y / viewHeight) * 100}%` }}
            >
              {label}
            </span>
          );
        })}
    </div>
  );
};

export default BlueprintCanvas;
