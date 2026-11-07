import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const DEMO_WIDTH = 1280;
export const DEMO_HEIGHT = 800;
export const DEMO_FPS = 30;
export const DEMO_DURATION = 180;

const INK = "#0f172a";
const MUTED = "#475569";
const LINE = "#cbd5e1";
const BG = "#f8fafc";
const SURFACE = "#ffffff";

const CVE = "CVE-2026-98432";
const FLAVOR = "24.04 linux-generic";
const FIXED_VERSION = "6.8.0-149.149";

const T = {
  typeStart: 8,
  typeEnd: 40,
  chip1: 44,
  chip2: 52,
  click: 60,
  needed: 68,
  pending: 98,
  released: 128,
  email: 132,
  fadeOut: 168,
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const Chip = ({ label, at }: { label: string; at: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 160 } });
  if (frame < at) return null;
  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${s})`,
        border: `2px solid ${INK}`,
        color: INK,
        padding: "6px 14px",
        fontSize: 20,
        fontWeight: 600,
        marginRight: 10,
      }}
    >
      {label}
    </span>
  );
};

const Status = ({ frame }: { frame: number }) => {
  let label = "needed";
  let detail = "no fix in any pocket";
  let at = T.needed;
  if (frame >= T.released) {
    label = "released";
    detail = `${FIXED_VERSION} in noble-security`;
    at = T.released;
  } else if (frame >= T.pending) {
    label = "pending";
    detail = `${FIXED_VERSION} queued`;
    at = T.pending;
  }
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 200 } });
  const filled = label === "released";
  if (frame < T.needed) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span
        style={{
          display: "inline-block",
          transform: `scale(${0.85 + 0.15 * s})`,
          background: filled ? INK : SURFACE,
          color: filled ? SURFACE : INK,
          border: `2px solid ${INK}`,
          padding: "6px 16px",
          fontSize: 22,
          fontWeight: 700,
          minWidth: 140,
          textAlign: "center",
        }}
      >
        {label}
      </span>
      <span style={{ color: MUTED, fontSize: 20 }}>{detail}</span>
    </div>
  );
};

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [T.fadeOut, DEMO_DURATION - 1], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const typed = CVE.slice(
    0,
    Math.round(clamp01((frame - T.typeStart) / (T.typeEnd - T.typeStart)) * CVE.length)
  );
  const caret = frame < T.click && Math.floor(frame / 8) % 2 === 0;

  const clickPulse = spring({ frame: frame - T.click, fps, config: { damping: 12, stiffness: 240 } });
  const buttonScale = frame >= T.click && frame < T.click + 12 ? 1 - 0.06 * (1 - clickPulse) : 1;

  const emailIn = spring({ frame: frame - T.email, fps, config: { damping: 20, stiffness: 120 } });
  const emailY = interpolate(emailIn, [0, 1], [60, 0]);

  const pollDots = ".".repeat((Math.floor(frame / 10) % 3) + 1);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        color: INK,
        fontFamily: "inherit",
        opacity,
        padding: 48,
      }}
    >
      <div style={{ display: "flex", gap: 40, height: "100%" }}>
        <div
          style={{
            flex: "0 0 460px",
            background: SURFACE,
            border: `2px solid ${LINE}`,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: MUTED, letterSpacing: 2 }}>
            WATCHLIST
          </div>
          <div>
            <div style={{ fontSize: 18, color: MUTED, marginBottom: 8 }}>CVE IDs</div>
            <div
              style={{
                border: `2px solid ${frame < T.click ? INK : LINE}`,
                padding: "12px 16px",
                fontSize: 26,
                fontWeight: 600,
                minHeight: 56,
              }}
            >
              {typed}
              <span style={{ opacity: caret ? 1 : 0 }}>|</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, color: MUTED, marginBottom: 8 }}>Releases and flavors</div>
            <div style={{ minHeight: 44 }}>
              <Chip label={FLAVOR} at={T.chip1} />
              <Chip label="22.04 linux-hwe-6.8" at={T.chip2} />
            </div>
          </div>
          <div
            style={{
              marginTop: "auto",
              alignSelf: "flex-start",
              transform: `scale(${buttonScale})`,
              background: frame >= T.click ? INK : SURFACE,
              color: frame >= T.click ? SURFACE : INK,
              border: `2px solid ${INK}`,
              padding: "14px 24px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {frame >= T.click ? "Watching" : "Track CVE"}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              background: SURFACE,
              border: `2px solid ${LINE}`,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              opacity: frame >= T.click ? 1 : 0.35,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: MUTED, letterSpacing: 2 }}>
                UBUNTU.COM TRACKER STATUS
              </span>
              <span style={{ fontSize: 18, color: MUTED }}>
                {frame >= T.click ? `polling every 10 min${pollDots}` : "not watching"}
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>
              {CVE} <span style={{ color: MUTED, fontWeight: 500 }}>on {FLAVOR}</span>
            </div>
            <div style={{ minHeight: 48 }}>
              <Status frame={frame} />
            </div>
          </div>

          {frame >= T.email && (
            <div
              style={{
                background: SURFACE,
                border: `2px solid ${INK}`,
                padding: 32,
                transform: `translateY(${emailY}px)`,
                opacity: emailIn,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                fontSize: 20,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: MUTED, letterSpacing: 2 }}>
                EMAIL
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {CVE}: pending to released on {FLAVOR}
              </div>
              <div>Fixed package: linux-image-generic {FIXED_VERSION}</div>
              <div>Run: sudo apt update && sudo apt install linux-image-generic</div>
              <div>Your logged mitigation can be rolled back: sudo nft delete table inet cve_2026_98432</div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
