const fingerMap = {
  // Left pinky
  '`': 'l-pinky', '~': 'l-pinky', '1': 'l-pinky', '!': 'l-pinky',
  'q': 'l-pinky', 'Q': 'l-pinky', 'a': 'l-pinky', 'A': 'l-pinky',
  'z': 'l-pinky', 'Z': 'l-pinky',
  // Left ring
  '2': 'l-ring', '@': 'l-ring',
  'w': 'l-ring', 'W': 'l-ring', 's': 'l-ring', 'S': 'l-ring',
  'x': 'l-ring', 'X': 'l-ring',
  // Left middle
  '3': 'l-middle', '#': 'l-middle',
  'e': 'l-middle', 'E': 'l-middle', 'd': 'l-middle', 'D': 'l-middle',
  'c': 'l-middle', 'C': 'l-middle',
  // Left index
  '4': 'l-index', '$': 'l-index', '5': 'l-index', '%': 'l-index',
  'r': 'l-index', 'R': 'l-index', 't': 'l-index', 'T': 'l-index',
  'f': 'l-index', 'F': 'l-index', 'g': 'l-index', 'G': 'l-index',
  'v': 'l-index', 'V': 'l-index', 'b': 'l-index', 'B': 'l-index',
  // Right index
  '6': 'r-index', '^': 'r-index', '7': 'r-index', '&': 'r-index',
  'y': 'r-index', 'Y': 'r-index', 'u': 'r-index', 'U': 'r-index',
  'h': 'r-index', 'H': 'r-index', 'j': 'r-index', 'J': 'r-index',
  'n': 'r-index', 'N': 'r-index', 'm': 'r-index', 'M': 'r-index',
  // Right middle
  '8': 'r-middle', '*': 'r-middle',
  'i': 'r-middle', 'I': 'r-middle', 'k': 'r-middle', 'K': 'r-middle',
  ',': 'r-middle', '<': 'r-middle',
  // Right ring
  '9': 'r-ring', '(': 'r-ring',
  'o': 'r-ring', 'O': 'r-ring', 'l': 'r-ring', 'L': 'r-ring',
  '.': 'r-ring', '>': 'r-ring',
  // Right pinky
  '0': 'r-pinky', ')': 'r-pinky', '-': 'r-pinky', '_': 'r-pinky',
  '=': 'r-pinky', '+': 'r-pinky', 'p': 'r-pinky', 'P': 'r-pinky',
  ';': 'r-pinky', ':': 'r-pinky', "'": 'r-pinky', '"': 'r-pinky',
  '/': 'r-pinky', '?': 'r-pinky', '[': 'r-pinky', '{': 'r-pinky',
  ']': 'r-pinky', '}': 'r-pinky', '\\': 'r-pinky', '|': 'r-pinky',
  '\n': 'r-pinky',
  // Thumbs
  ' ': 'r-thumb',
};

const fingerNumbers = {
  'l-pinky': 5,
  'l-ring': 4,
  'l-middle': 3,
  'l-index': 2,
  'l-thumb': 1,
  'r-thumb': 1,
  'r-index': 2,
  'r-middle': 3,
  'r-ring': 4,
  'r-pinky': 5,
};

const fingerLabels = {
  'l-pinky': 'Left Pinky',
  'l-ring': 'Left Ring',
  'l-middle': 'Left Middle',
  'l-index': 'Left Index',
  'l-thumb': 'Left Thumb',
  'r-thumb': 'Right Thumb',
  'r-index': 'Right Index',
  'r-middle': 'Right Middle',
  'r-ring': 'Right Ring',
  'r-pinky': 'Right Pinky',
};

const Hand = ({ side, activeFinger }) => {
  const leftFingerData = [
    { id: 'l-pinky',  x: 8,  y: 14, w: 14, h: 40, rx: 7 },
    { id: 'l-ring',   x: 26, y: 6,  w: 14, h: 48, rx: 7 },
    { id: 'l-middle', x: 44, y: 2,  w: 14, h: 52, rx: 7 },
    { id: 'l-index',  x: 62, y: 8,  w: 14, h: 46, rx: 7 },
    { id: 'l-thumb',  x: 78, y: 42, w: 16, h: 30, rx: 8 },
  ];

  const rightFingerData = [
    { id: 'r-thumb',  x: 6,  y: 42, w: 16, h: 30, rx: 8 },
    { id: 'r-index',  x: 24, y: 8,  w: 14, h: 46, rx: 7 },
    { id: 'r-middle', x: 42, y: 2,  w: 14, h: 52, rx: 7 },
    { id: 'r-ring',   x: 60, y: 6,  w: 14, h: 48, rx: 7 },
    { id: 'r-pinky',  x: 78, y: 14, w: 14, h: 40, rx: 7 },
  ];

  const fingerData = side === 'left' ? leftFingerData : rightFingerData;
  const palmX = side === 'left' ? 8 : 6;
  const palmW = side === 'left' ? 84 : 86;

  // Check if the active finger belongs to this hand
  const isThisHand = activeFinger && activeFinger.startsWith(side === 'left' ? 'l-' : 'r-');
  const activeNumber = isThisHand ? fingerNumbers[activeFinger] : null;

  return (
    <svg viewBox="0 0 100 115" className="hand-svg">
      {/* Palm */}
      <rect
        x={palmX} y={50} width={palmW} height={50} rx={12}
        className={`hand-palm ${isThisHand ? 'active' : ''}`}
      />
      {/* Big finger number centered on the palm */}
      {activeNumber != null && (
        <text
          x={palmX + palmW / 2}
          y={75}
          textAnchor="middle"
          dominantBaseline="central"
          className="palm-number"
        >
          {activeNumber}
        </text>
      )}
      {/* Fingers */}
      {fingerData.map((f) => (
        <rect
          key={f.id}
          x={f.x} y={f.y} width={f.w} height={f.h} rx={f.rx}
          className={`hand-finger ${activeFinger === f.id ? 'active' : ''}`}
        />
      ))}
      {/* Finger tip dots */}
      {fingerData.map((f) => (
        <circle
          key={`dot-${f.id}`}
          cx={f.x + f.w / 2}
          cy={f.y + 8}
          r={3}
          className={`finger-dot ${activeFinger === f.id ? 'active' : ''}`}
        />
      ))}
    </svg>
  );
};

const HandGuide = ({ currentChar }) => {
  const activeFinger = currentChar != null ? (fingerMap[currentChar] || null) : null;
  const label = activeFinger ? fingerLabels[activeFinger] : '';

  return (
    <div className="hand-guide">
      <div className="hands-container">
        <div className="hand-wrapper">
          <Hand side="left" activeFinger={activeFinger} />
          <span className="hand-label">Left</span>
        </div>
        <div className="hand-wrapper">
          <Hand side="right" activeFinger={activeFinger} />
          <span className="hand-label">Right</span>
        </div>
      </div>
      {label && (
        <div className="finger-hint">
          <span className="finger-hint-text">{label}</span>
        </div>
      )}
    </div>
  );
};

export default HandGuide;
