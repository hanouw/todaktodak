import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'todak-universe-planets';
const MAX_SELECTED_EMOTIONS = 3;

const emotions = [
  {
    id: 'calm',
    label: '고요',
    prompt: '숨을 길게 내쉬고 싶은 마음',
    colorMeaning: '파랑은 안정감, 신뢰, 긴장 완화를 돕는 색으로 알려져 있어요.',
    palette: ['#78d7ff', '#9af7dc', '#17375f'],
  },
  {
    id: 'hope',
    label: '희망',
    prompt: '다시 빛이 보이는 마음',
    colorMeaning: '노랑은 낙관, 활력, 가벼운 기대감을 떠올리게 해요.',
    palette: ['#ffe27a', '#a8ff9e', '#345b28'],
  },
  {
    id: 'love',
    label: '다정',
    prompt: '따뜻하게 기대고 싶은 마음',
    colorMeaning: '분홍은 친밀감, 애착, 정서적 온기를 표현해요.',
    palette: ['#ff9ecf', '#ffc3a6', '#64324f'],
  },
  {
    id: 'focus',
    label: '몰입',
    prompt: '중심이 또렷해지는 마음',
    colorMeaning: '남색과 보라는 깊이, 직관, 자기 성찰의 이미지를 만들어요.',
    palette: ['#8ea7ff', '#c69cff', '#1d2457'],
  },
  {
    id: 'courage',
    label: '용기',
    prompt: '한 걸음 내딛고 싶은 마음',
    colorMeaning: '주황은 에너지, 행동성, 자신감을 자극하는 색이에요.',
    palette: ['#ff8b5c', '#ffc05c', '#6a251e'],
  },
  {
    id: 'anxiety',
    label: '불안',
    prompt: '마음이 얇게 흔들리는 상태',
    colorMeaning: '연보라와 차가운 청색은 예민함과 내면의 긴장을 섬세하게 보여줘요.',
    palette: ['#b7a7ff', '#8bd8ff', '#26204f'],
  },
  {
    id: 'sadness',
    label: '슬픔',
    prompt: '천천히 가라앉는 마음',
    colorMeaning: '회청색은 차분함, 거리감, 감정의 침잠을 상징해요.',
    palette: ['#8fb4d8', '#b6c7d8', '#1f344b'],
  },
  {
    id: 'anger',
    label: '분노',
    prompt: '뜨거운 에너지가 솟는 상태',
    colorMeaning: '붉은색은 각성, 강한 에너지, 즉각적인 반응을 떠올리게 해요.',
    palette: ['#ff5d5d', '#ff9b6b', '#5b171f'],
  },
  {
    id: 'tired',
    label: '피로',
    prompt: '몸과 마음이 흐려진 상태',
    colorMeaning: '부드러운 회녹색은 휴식, 회복, 낮은 자극의 안정감을 줘요.',
    palette: ['#9fbca8', '#d7d0bd', '#2d3a34'],
  },
  {
    id: 'joy',
    label: '설렘',
    prompt: '작은 가능성이 반짝이는 마음',
    colorMeaning: '코랄과 금빛은 즐거움, 사회적 온기, 생동감을 강화해요.',
    palette: ['#ffb36b', '#ffd86b', '#6a3d1f'],
  },
];

const planetNames = ['루멘', '네아', '오르빗', '아일라', '솔린', '미라', '노바', '엘로'];

const createSeededRandom = (seed) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const random = createSeededRandom(20260415);

const ambientStars = Array.from({ length: 170 }, (_, index) => {
  const x = random();
  const y = random();
  const isTinyStar = random() < 0.36;
  const shouldRender = !isTinyStar || random() > 0.72;
  const opacity = isTinyStar ? 0.2 + random() * 0.22 : 0.34 + random() * 0.42;

  return {
    id: `ambient-star-${index}`,
    x: (x * 100).toFixed(2),
    y: (y * 100).toFixed(2),
    size: (isTinyStar ? 0.38 + random() * 0.34 : 0.72 + random() * 1.08).toFixed(2),
    opacity: opacity.toFixed(2),
    softOpacity: (opacity * 0.34).toFixed(2),
    midOpacity: (opacity * 0.58).toFixed(2),
    delay: (-random() * 18).toFixed(2),
    duration: (7.5 + random() * 12).toFixed(2),
    shouldRender,
  };
});

const shimmerStars = Array.from({ length: 38 }, (_, index) => ({
  id: `shimmer-star-${index}`,
  x: (random() * 100).toFixed(2),
  y: (random() * 100).toFixed(2),
  size: random() > 0.82 ? 2 : 1,
  delay: (-random() * 16).toFixed(2),
  duration: (6.5 + random() * 9.5).toFixed(2),
}));

const shootingStars = [
  { id: 'shooting-star-1', top: 18, left: 8, delay: 1.2, duration: 7.6 },
  { id: 'shooting-star-2', top: 36, left: 64, delay: 5.8, duration: 9.4 },
  { id: 'shooting-star-3', top: 68, left: 18, delay: 10.6, duration: 8.2 },
];

const distantGalaxies = [
  { id: 'galaxy-a', x: 18, y: 22, size: 150, rotation: -18, tone: '#78d7ff', delay: 0.1 },
  { id: 'galaxy-b', x: 82, y: 26, size: 118, rotation: 22, tone: '#ff9ecf', delay: 0.24 },
  { id: 'galaxy-c', x: 16, y: 78, size: 110, rotation: 38, tone: '#ffe27a', delay: 0.38 },
  { id: 'galaxy-d', x: 78, y: 76, size: 172, rotation: -32, tone: '#c69cff', delay: 0.52 },
  { id: 'galaxy-e', x: 50, y: 18, size: 86, rotation: 12, tone: '#9af7dc', delay: 0.66 },
];

const hexToRgb = (hex) => {
  const normalizedHex = hex.replace('#', '');
  return {
    r: parseInt(normalizedHex.slice(0, 2), 16),
    g: parseInt(normalizedHex.slice(2, 4), 16),
    b: parseInt(normalizedHex.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, '0'))
    .join('')}`;

const mixColors = (colors) => {
  const mixed = colors
    .map(hexToRgb)
    .reduce(
      (total, color) => ({
        r: total.r + color.r,
        g: total.g + color.g,
        b: total.b + color.b,
      }),
      { r: 0, g: 0, b: 0 },
    );

  return rgbToHex({
    r: mixed.r / colors.length,
    g: mixed.g / colors.length,
    b: mixed.b / colors.length,
  });
};

const createPaletteFromEmotions = (selectedEmotions) => {
  if (selectedEmotions.length === 1) {
    return selectedEmotions[0].palette;
  }

  return [
    selectedEmotions[0].palette[0],
    selectedEmotions[1].palette[0],
    selectedEmotions[2]?.palette[0] ?? mixColors(selectedEmotions.map((emotion) => emotion.palette[1])),
  ];
};

const getPlanetInfoPlacement = (planet) => {
  const { x, y } = planet.position;

  if (x > 66 && y < 42) {
    return 'is-bottom-left';
  }

  if (x > 72) {
    return 'is-top-left';
  }

  if (y < 30) {
    return 'is-bottom-right';
  }

  return 'is-top-right';
};

const getDisplayPosition = (planet, isBirdView) => {
  if (!isBirdView) {
    return planet.position;
  }

  return {
    x: 50 + (planet.position.x - 50) * 0.2,
    y: 50 + (planet.position.y - 50) * 0.2,
  };
};

const getTouchDistance = (touches) => {
  const [firstTouch, secondTouch] = touches;
  return Math.hypot(firstTouch.clientX - secondTouch.clientX, firstTouch.clientY - secondTouch.clientY);
};

const createPlanet = (selectedEmotions) => {
  const createdAt = new Date();
  const labels = selectedEmotions.map((emotion) => emotion.label);
  const palette = createPaletteFromEmotions(selectedEmotions);
  const aura = mixColors(selectedEmotions.map((emotion) => emotion.palette[0]));
  const size = 58 + Math.floor(Math.random() * 64);
  const position = {
    x: 12 + Math.floor(Math.random() * 76),
    y: 14 + Math.floor(Math.random() * 70),
  };

  return {
    id: crypto.randomUUID(),
    name: `${planetNames[Math.floor(Math.random() * planetNames.length)]}-${String(
      Math.floor(Math.random() * 90) + 10,
    )}`,
    emotionIds: selectedEmotions.map((emotion) => emotion.id),
    emotion: labels.join(' · '),
    psychology: selectedEmotions.map((emotion) => emotion.colorMeaning).join(' '),
    prompt: `${labels.join(', ')}이(가) 섞여 만들어진 오늘의 마음 행성이에요.`,
    palette,
    aura,
    size,
    position,
    createdAt: createdAt.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

function App() {
  const [selectedEmotionIds, setSelectedEmotionIds] = useState([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isBirdView, setIsBirdView] = useState(false);
  const [isHomeGalaxyLabelOpen, setIsHomeGalaxyLabelOpen] = useState(false);
  const pinchStartDistanceRef = useRef(null);
  const [planets, setPlanets] = useState(() => {
    const savedPlanets = localStorage.getItem(STORAGE_KEY);
    return savedPlanets ? JSON.parse(savedPlanets) : [];
  });
  const [activePlanetId, setActivePlanetId] = useState(null);

  const selectedEmotions = selectedEmotionIds
    .map((emotionId) => emotions.find((emotion) => emotion.id === emotionId))
    .filter(Boolean);
  const previewPalette =
    selectedEmotions.length > 0 ? createPaletteFromEmotions(selectedEmotions) : ['#dfe9ff', '#9af7dc', '#1f2946'];
  const previewAura =
    selectedEmotions.length > 0 ? mixColors(selectedEmotions.map((emotion) => emotion.palette[0])) : '#9af7dc';
  const activePlanet = planets.find((planet) => planet.id === activePlanetId);
  const homeGalaxyTone =
    planets.length > 0
      ? mixColors(planets.slice(0, Math.min(3, planets.length)).map((planet) => planet.aura ?? planet.palette[0]))
      : '#9af7dc';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planets));
  }, [planets]);

  useEffect(() => {
    if (!isBirdView) {
      setIsHomeGalaxyLabelOpen(false);
    }
  }, [isBirdView]);

  useEffect(() => {
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        setIsCreatorOpen(false);
        setActivePlanetId(null);
      }

      if ((event.ctrlKey || event.metaKey) && ['+', '-', '=', '0'].includes(event.key)) {
        event.preventDefault();
        setIsBirdView(event.key === '-');
      }
    };

    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, []);

  useEffect(() => {
    const preventBrowserZoom = (event) => {
      if (!event.ctrlKey) {
        return;
      }

      event.preventDefault();
      setIsBirdView(event.deltaY > 0);
    };

    const preventGestureZoom = (event) => {
      event.preventDefault();
    };

    window.addEventListener('wheel', preventBrowserZoom, { passive: false, capture: true });
    window.addEventListener('gesturestart', preventGestureZoom, { passive: false });
    window.addEventListener('gesturechange', preventGestureZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventBrowserZoom, { capture: true });
      window.removeEventListener('gesturestart', preventGestureZoom);
      window.removeEventListener('gesturechange', preventGestureZoom);
    };
  }, []);

  const handleToggleEmotion = (emotionId) => {
    setSelectedEmotionIds((currentEmotionIds) => {
      if (currentEmotionIds.includes(emotionId)) {
        return currentEmotionIds.filter((currentEmotionId) => currentEmotionId !== emotionId);
      }

      if (currentEmotionIds.length >= MAX_SELECTED_EMOTIONS) {
        return currentEmotionIds;
      }

      return [...currentEmotionIds, emotionId];
    });
  };

  const handleCreatePlanet = () => {
    if (selectedEmotions.length === 0) {
      return;
    }

    const nextPlanet = createPlanet(selectedEmotions);
    setPlanets((currentPlanets) => [nextPlanet, ...currentPlanets]);
    setActivePlanetId(nextPlanet.id);
    setSelectedEmotionIds([]);
    setIsCreatorOpen(false);
    setIsBirdView(false);
  };

  const handleClearPlanets = () => {
    setPlanets([]);
    setActivePlanetId(null);
    setIsBirdView(false);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      pinchStartDistanceRef.current = getTouchDistance(event.touches);
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchStartDistanceRef.current) {
      return;
    }

    const currentDistance = getTouchDistance(event.touches);

    if (currentDistance < pinchStartDistanceRef.current * 0.84) {
      setIsBirdView(true);
    }

    if (currentDistance > pinchStartDistanceRef.current * 1.14) {
      setIsBirdView(false);
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length < 2) {
      pinchStartDistanceRef.current = null;
    }
  };

  const handleWheel = (event) => {
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault();
    setIsBirdView(event.deltaY > 0);
  };

  return (
    <main className="app-shell">
      <div
        className={`universe-backdrop ${isBirdView ? 'is-bird-view' : ''}`}
        aria-hidden={planets.length === 0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div className="star-field star-field-a" />
        <div className="star-field star-field-b" />
        <div className="star-dust" />
        {ambientStars
          .filter(({ shouldRender }) => shouldRender)
          .map(({ id, x, y, size, opacity, softOpacity, midOpacity, delay, duration }) => (
            <span
              className="ambient-star"
              key={id}
              style={{
                '--x': `${x}%`,
                '--y': `${y}%`,
                '--star-size': `${size}px`,
                '--star-opacity': opacity,
                '--star-soft-opacity': softOpacity,
                '--star-mid-opacity': midOpacity,
                '--delay': `${delay}s`,
                '--duration': `${duration}s`,
              }}
            />
          ))}
        {shimmerStars.map(({ id, x, y, size, delay, duration }) => (
          <span
            className="twinkle-star"
            key={id}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--star-size': `${size}px`,
              '--delay': `${delay}s`,
              '--duration': `${duration}s`,
            }}
          />
        ))}
        {shootingStars.map(({ id, top, left, delay, duration }) => (
          <span
            className="shooting-star"
            key={id}
            style={{
              '--top': `${top}%`,
              '--left': `${left}%`,
              '--delay': `${delay}s`,
              '--duration': `${duration}s`,
            }}
          />
        ))}
        {distantGalaxies.map(({ id, x, y, size, rotation, tone, delay }) => (
          <span
            className="distant-galaxy"
            key={id}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--galaxy-size': `${size}px`,
              '--rotation': `${rotation}deg`,
              '--galaxy-tone': tone,
              '--delay': `${delay}s`,
            }}
          />
        ))}
        {planets.length > 0 && (
          <button
            className={`home-galaxy ${isHomeGalaxyLabelOpen ? 'is-label-open' : ''}`}
            type="button"
            aria-label="내 은하"
            aria-pressed={isHomeGalaxyLabelOpen}
            onMouseEnter={() => setIsHomeGalaxyLabelOpen(true)}
            onMouseLeave={() => setIsHomeGalaxyLabelOpen(false)}
            onFocus={() => setIsHomeGalaxyLabelOpen(true)}
            onBlur={() => setIsHomeGalaxyLabelOpen(false)}
            onClick={() => setIsHomeGalaxyLabelOpen((isOpen) => !isOpen)}
            style={{
              '--home-galaxy-tone': homeGalaxyTone,
            }}
          >
          </button>
        )}
        {planets.length > 0 && (
          <span className={`home-galaxy-label ${isHomeGalaxyLabelOpen ? 'is-visible' : ''}`}>내 은하</span>
        )}
        <div className="nebula nebula-one" />
        <div className="nebula nebula-two" />
        <div className="nebula nebula-three" />
        <div className="cosmic-ring ring-one" />
        <div className="cosmic-ring ring-two" />

        {planets.length > 0 &&
          planets.map((planet, index) => {
            const displayPosition = getDisplayPosition(planet, isBirdView);

            return (
              <button
                className={`map-planet ${activePlanet?.id === planet.id ? 'is-active' : ''}`}
                key={planet.id}
                type="button"
                onClick={() => setActivePlanetId(planet.id)}
                style={{
                  '--tone-one': planet.palette[0],
                  '--tone-two': planet.palette[1],
                  '--tone-three': planet.palette[2],
                  '--aura': planet.aura,
                  '--size': `${planet.size}px`,
                  '--planet-radius': `${(isBirdView ? planet.size * 0.2 : planet.size) / 2}px`,
                  '--x': `${displayPosition.x}%`,
                  '--y': `${displayPosition.y}%`,
                  '--delay': `${index * -0.9}s`,
                }}
                aria-label={`${planet.name} 행성 보기`}
              >
                <span />
              </button>
            );
          })}
        {activePlanet && (
          <aside
            className={`planet-popover ${getPlanetInfoPlacement(activePlanet)}`}
            style={{
              '--x': `${getDisplayPosition(activePlanet, isBirdView).x}%`,
              '--y': `${getDisplayPosition(activePlanet, isBirdView).y}%`,
              '--planet-offset': `${(isBirdView ? activePlanet.size * 0.55 : activePlanet.size) / 2 + 18}px`,
              '--aura': activePlanet.aura,
            }}
            role="dialog"
            aria-label={`${activePlanet.name} 행성 정보`}
          >
            <button className="popover-close" type="button" onClick={() => setActivePlanetId(null)}>
              닫기
            </button>
            <p className="eyebrow">Planet Note</p>
            <h2>{activePlanet.name}</h2>
            <div className="planet-meta">
              <span>{activePlanet.emotion}</span>
              <span>{activePlanet.createdAt}</span>
            </div>
            <p>{activePlanet.prompt}</p>
            <p>{activePlanet.psychology}</p>
            <div className="palette-row" aria-label="행성 색상 팔레트">
              {activePlanet.palette.map((color) => (
                <span key={color} style={{ backgroundColor: color }} />
              ))}
            </div>
          </aside>
        )}
      </div>

      <div className="space-controls" aria-label="우주 조작">
        <button className="primary-button" type="button" onClick={() => setIsCreatorOpen(true)}>
          행성 만들기
        </button>
        <button
          className="ghost-button"
          type="button"
          onClick={handleClearPlanets}
          disabled={planets.length === 0}
        >
          우주 비우기
        </button>
      </div>

      {isCreatorOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsCreatorOpen(false)}>
          <section
            className="creator-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="creator-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="close-button" type="button" onClick={() => setIsCreatorOpen(false)}>
              닫기
            </button>
            <div className="modal-heading">
              <p className="eyebrow">Create Planet</p>
              <h2 id="creator-title">지금의 감정 키워드를 골라주세요</h2>
              <p>
                최대 3개까지 선택할 수 있어요. 선택한 감정의 심리 색채가 섞여 행성의 표면,
                후광, 빛의 온도를 결정해요.
              </p>
            </div>

            <div className="creator-grid">
              <div className="emotion-list" aria-label="감정 키워드 선택">
                {emotions.map((emotion) => {
                  const isSelected = selectedEmotionIds.includes(emotion.id);
                  const isDisabled = !isSelected && selectedEmotionIds.length >= MAX_SELECTED_EMOTIONS;

                  return (
                    <button
                      className={`emotion-card ${isSelected ? 'is-selected' : ''}`}
                      key={emotion.id}
                      type="button"
                      onClick={() => handleToggleEmotion(emotion.id)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      style={{
                        '--tone-one': emotion.palette[0],
                        '--tone-two': emotion.palette[1],
                        '--tone-three': emotion.palette[2],
                      }}
                    >
                      <span className="emotion-orb" />
                      <strong>{emotion.label}</strong>
                      <span>{emotion.prompt}</span>
                      <small>{emotion.colorMeaning}</small>
                    </button>
                  );
                })}
              </div>

              <div className="modal-preview" aria-label="생성될 행성 미리보기">
                <div
                  className="planet-preview"
                  style={{
                    '--tone-one': previewPalette[0],
                    '--tone-two': previewPalette[1],
                    '--tone-three': previewPalette[2],
                    '--aura': previewAura,
                  }}
                >
                  <span />
                </div>
                <p className="preview-label">선택한 감정 {selectedEmotionIds.length}/3</p>
                <h3>{selectedEmotions.length > 0 ? selectedEmotions.map((emotion) => emotion.label).join(' · ') : '선택 전'}</h3>
                <p>
                  {selectedEmotions.length > 0
                    ? '선택한 감정의 색이 섞여 나만의 행성 팔레트가 만들어져요.'
                    : '현재 상태에 가까운 감정 키워드를 하나 이상 선택해주세요.'}
                </p>
                <button
                  className="primary-button"
                  type="button"
                  onClick={handleCreatePlanet}
                  disabled={selectedEmotions.length === 0}
                >
                  이 조합으로 행성 생성
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
