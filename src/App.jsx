import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'todak-universe-planets';
const MAX_SELECTED_EMOTIONS = 3;
const MAX_SELECTED_STATEMENTS = 5;

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

const emotionStatements = [
  { id: 'calm-1', emotionId: 'calm', text: '지금은 천천히 숨을 고르고 싶다' },
  { id: 'calm-2', emotionId: 'calm', text: '조용한 곳에서 마음을 정리하고 싶다' },
  { id: 'hope-1', emotionId: 'hope', text: '작지만 다시 해볼 힘이 생긴다' },
  { id: 'hope-2', emotionId: 'hope', text: '앞으로 나아갈 단서가 보인다' },
  { id: 'love-1', emotionId: 'love', text: '누군가와 따뜻하게 연결되고 싶다' },
  { id: 'love-2', emotionId: 'love', text: '내 마음을 부드럽게 대해주고 싶다' },
  { id: 'focus-1', emotionId: 'focus', text: '지금 해야 할 일에 깊게 들어가고 싶다' },
  { id: 'focus-2', emotionId: 'focus', text: '흩어진 생각을 한곳에 모으고 싶다' },
  { id: 'courage-1', emotionId: 'courage', text: '두렵지만 한 걸음 움직이고 싶다' },
  { id: 'courage-2', emotionId: 'courage', text: '내 선택을 조금 더 믿어보고 싶다' },
  { id: 'anxiety-1', emotionId: 'anxiety', text: '마음이 계속 앞질러 걱정한다' },
  { id: 'anxiety-2', emotionId: 'anxiety', text: '확실하지 않은 일이 크게 느껴진다' },
  { id: 'sadness-1', emotionId: 'sadness', text: '마음이 가라앉아 움직이기 어렵다' },
  { id: 'sadness-2', emotionId: 'sadness', text: '오늘은 나를 조금 조심히 다루고 싶다' },
  { id: 'anger-1', emotionId: 'anger', text: '참아둔 감정이 뜨겁게 올라온다' },
  { id: 'anger-2', emotionId: 'anger', text: '내 경계가 침범당한 느낌이 든다' },
  { id: 'tired-1', emotionId: 'tired', text: '몸과 마음의 배터리가 낮다' },
  { id: 'tired-2', emotionId: 'tired', text: '아무것도 하지 않는 시간이 필요하다' },
  { id: 'joy-1', emotionId: 'joy', text: '가벼운 설렘이 몸을 움직이게 한다' },
  { id: 'joy-2', emotionId: 'joy', text: '오늘의 좋은 순간을 남기고 싶다' },
];

const careNotes = {
  calm: '지금의 안정감을 오래 붙잡으려 하기보다, 짧은 호흡 루틴으로 몸에 기억시켜보세요.',
  hope: '작은 기대는 기록해두면 다음 날 다시 켜기 쉬워요. 오늘의 가능성 한 가지를 남겨보세요.',
  love: '따뜻함이 필요한 날이에요. 나에게 다정한 문장 하나를 먼저 건네보세요.',
  focus: '몰입이 올라온 상태예요. 할 일을 아주 작게 쪼개 첫 10분만 시작해보세요.',
  courage: '용기는 긴장과 같이 오기도 해요. 무리하지 말고 가장 작은 행동 하나만 정해보세요.',
  anxiety: '불안은 미래를 빠르게 시뮬레이션할 때 커져요. 지금 통제 가능한 것 하나만 적어보세요.',
  sadness: '가라앉은 마음은 설득보다 돌봄이 먼저예요. 오늘은 회복에 필요한 속도를 허락해보세요.',
  anger: '분노는 중요한 경계 신호일 수 있어요. 바로 반응하기 전, 내가 지키고 싶은 것을 적어보세요.',
  tired: '피로는 의지 문제가 아니라 에너지 신호예요. 오늘의 목표를 과감히 줄여도 괜찮아요.',
  joy: '좋은 감정도 지나가요. 지금의 장면을 짧게 기록하면 나중에 다시 꺼내볼 수 있어요.',
};

const createSeededRandom = (seed) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const random = createSeededRandom(20260415);

const createGalaxyStars = (seed, count) => {
  const galaxyRandom = createSeededRandom(seed);

  return Array.from({ length: count }, (_, index) => {
    const armOffset = (index % 2) * Math.PI;
    const baseRadius = Math.pow(galaxyRandom(), 0.72) * 46;
    const radius = baseRadius < 7 ? 7 + galaxyRandom() * 5 : baseRadius;
    const twist = radius * 0.082;
    const angle = armOffset + twist + (galaxyRandom() - 0.5) * 0.92;
    const scatter = galaxyRandom() * 5.8;
    const x = 50 + Math.cos(angle) * radius + (galaxyRandom() - 0.5) * scatter;
    const y = 50 + Math.sin(angle) * radius * 0.42 + (galaxyRandom() - 0.5) * scatter * 0.8;
    const isCoreStar = radius < 13;

    return {
      id: `galaxy-star-${seed}-${index}`,
      x: Math.min(96, Math.max(4, x)).toFixed(2),
      y: Math.min(96, Math.max(4, y)).toFixed(2),
      size: (isCoreStar ? 0.84 + galaxyRandom() * 1.1 : 0.65 + galaxyRandom() * 1.55).toFixed(2),
      opacity: (isCoreStar ? 0.42 + galaxyRandom() * 0.38 : 0.26 + galaxyRandom() * 0.54).toFixed(2),
      softOpacity: (isCoreStar ? 0.22 + galaxyRandom() * 0.22 : 0.18 + galaxyRandom() * 0.24).toFixed(2),
      dimOpacity: (isCoreStar ? 0.12 + galaxyRandom() * 0.18 : 0.1 + galaxyRandom() * 0.16).toFixed(2),
      delay: (-galaxyRandom() * 10).toFixed(2),
    };
  });
};

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
  { id: 'galaxy-a', x: 18, y: 22, size: 150, rotation: -18, tone: '#78d7ff', delay: 0.1, stars: createGalaxyStars(7151, 92) },
  { id: 'galaxy-b', x: 82, y: 26, size: 118, rotation: 22, tone: '#ff9ecf', delay: 0.24, stars: createGalaxyStars(8226, 74) },
  { id: 'galaxy-c', x: 16, y: 78, size: 110, rotation: 38, tone: '#ffe27a', delay: 0.38, stars: createGalaxyStars(1678, 68) },
  { id: 'galaxy-d', x: 78, y: 76, size: 172, rotation: -32, tone: '#c69cff', delay: 0.52, stars: createGalaxyStars(7876, 106) },
  { id: 'galaxy-e', x: 50, y: 18, size: 86, rotation: 12, tone: '#9af7dc', delay: 0.66, stars: createGalaxyStars(5018, 56) },
];

const homeGalaxyStars = createGalaxyStars(20260416, 138);

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

const createEmotionProfile = (selectedEmotions, selectedStatements) => {
  const scores = selectedEmotions.reduce(
    (profile, emotion) => ({
      ...profile,
      [emotion.id]: 1,
    }),
    {},
  );

  selectedStatements.forEach((statement) => {
    scores[statement.emotionId] = (scores[statement.emotionId] ?? 0) + 1.35;
  });

  const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);

  return selectedEmotions
    .map((emotion) => ({
      id: emotion.id,
      label: emotion.label,
      color: emotion.palette[0],
      ratio: Math.round(((scores[emotion.id] ?? 0) / totalScore) * 100),
    }))
    .sort((firstEmotion, secondEmotion) => secondEmotion.ratio - firstEmotion.ratio);
};

const createPaletteFromProfile = (emotionProfile) => {
  const rankedEmotions = emotionProfile
    .map((profile) => emotions.find((emotion) => emotion.id === profile.id))
    .filter(Boolean);

  return createPaletteFromEmotions(rankedEmotions);
};

const createAuraFromProfile = (emotionProfile) => {
  const weightedColors = emotionProfile.flatMap((profile) => {
    const emotion = emotions.find((emotionItem) => emotionItem.id === profile.id);
    const weight = Math.max(1, Math.round(profile.ratio / 18));

    return Array.from({ length: weight }, () => emotion?.palette[0]).filter(Boolean);
  });

  return mixColors(weightedColors);
};

const getCareNote = (emotionId) => careNotes[emotionId] ?? '지금의 마음을 판단하지 말고, 관찰한 단어 하나만 남겨보세요.';

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

const createPlanet = (selectedEmotions, selectedStatements) => {
  const createdAt = new Date();
  const labels = selectedEmotions.map((emotion) => emotion.label);
  const emotionProfile = createEmotionProfile(selectedEmotions, selectedStatements);
  const palette = createPaletteFromProfile(emotionProfile);
  const aura = createAuraFromProfile(emotionProfile);
  const dominantEmotionId = emotionProfile[0]?.id ?? selectedEmotions[0].id;
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
    emotionProfile,
    emotionStatements: selectedStatements.map((statement) => statement.text),
    dominantEmotionId,
    psychology: selectedEmotions.map((emotion) => emotion.colorMeaning).join(' '),
    prompt: `${labels.join(', ')}이(가) 섞여 만들어진 오늘의 마음 행성이에요.`,
    careNote: getCareNote(dominantEmotionId),
    logs: [],
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
  const [selectedStatementIds, setSelectedStatementIds] = useState([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isBirdView, setIsBirdView] = useState(false);
  const [isHomeGalaxyLabelOpen, setIsHomeGalaxyLabelOpen] = useState(false);
  const [activePlanetNote, setActivePlanetNote] = useState('');
  const pinchStartDistanceRef = useRef(null);
  const [planets, setPlanets] = useState(() => {
    const savedPlanets = localStorage.getItem(STORAGE_KEY);
    return savedPlanets ? JSON.parse(savedPlanets) : [];
  });
  const [activePlanetId, setActivePlanetId] = useState(null);

  const selectedEmotions = selectedEmotionIds
    .map((emotionId) => emotions.find((emotion) => emotion.id === emotionId))
    .filter(Boolean);
  const selectedStatements = selectedStatementIds
    .map((statementId) => emotionStatements.find((statement) => statement.id === statementId))
    .filter(Boolean);
  const availableStatements = emotionStatements.filter((statement) => selectedEmotionIds.includes(statement.emotionId));
  const previewEmotionProfile =
    selectedEmotions.length > 0 ? createEmotionProfile(selectedEmotions, selectedStatements) : [];
  const previewPalette =
    previewEmotionProfile.length > 0 ? createPaletteFromProfile(previewEmotionProfile) : ['#dfe9ff', '#9af7dc', '#1f2946'];
  const previewAura =
    previewEmotionProfile.length > 0 ? createAuraFromProfile(previewEmotionProfile) : '#9af7dc';
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
    setActivePlanetNote('');
  }, [activePlanetId]);

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
        setSelectedStatementIds((currentStatementIds) =>
          currentStatementIds.filter((statementId) => {
            const statement = emotionStatements.find((emotionStatement) => emotionStatement.id === statementId);

            return statement?.emotionId !== emotionId;
          }),
        );
        return currentEmotionIds.filter((currentEmotionId) => currentEmotionId !== emotionId);
      }

      if (currentEmotionIds.length >= MAX_SELECTED_EMOTIONS) {
        return currentEmotionIds;
      }

      return [...currentEmotionIds, emotionId];
    });
  };

  const handleToggleStatement = (statementId) => {
    setSelectedStatementIds((currentStatementIds) => {
      if (currentStatementIds.includes(statementId)) {
        return currentStatementIds.filter((currentStatementId) => currentStatementId !== statementId);
      }

      if (currentStatementIds.length >= MAX_SELECTED_STATEMENTS) {
        return currentStatementIds;
      }

      return [...currentStatementIds, statementId];
    });
  };

  const handleCreatePlanet = () => {
    if (selectedEmotions.length === 0) {
      return;
    }

    const nextPlanet = createPlanet(selectedEmotions, selectedStatements);
    setPlanets((currentPlanets) => [nextPlanet, ...currentPlanets]);
    setActivePlanetId(nextPlanet.id);
    setSelectedEmotionIds([]);
    setSelectedStatementIds([]);
    setIsCreatorOpen(false);
    setIsBirdView(false);
  };

  const handleAddPlanetLog = (event) => {
    event.preventDefault();

    if (!activePlanet || activePlanetNote.trim().length === 0) {
      return;
    }

    const createdAt = new Date().toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const nextLog = {
      id: crypto.randomUUID(),
      text: activePlanetNote.trim(),
      createdAt,
    };

    setPlanets((currentPlanets) =>
      currentPlanets.map((planet) =>
        planet.id === activePlanet.id ? { ...planet, logs: [nextLog, ...(planet.logs ?? [])].slice(0, 6) } : planet,
      ),
    );
    setActivePlanetNote('');
  };

  const handleClearPlanets = () => {
    setPlanets([]);
    setActivePlanetId(null);
    setActivePlanetNote('');
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
        {distantGalaxies.map(({ id, x, y, size, rotation, tone, delay, stars }) => (
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
          >
            <span className="galaxy-core" />
            <span className="galaxy-star-cluster">
              {stars.map(
                ({
                  id: starId,
                  x: starX,
                  y: starY,
                  size: starSize,
                  opacity,
                  softOpacity,
                  dimOpacity,
                  delay: starDelay,
                }) => (
                <span
                  className="galaxy-star"
                  key={starId}
                  style={{
                    '--star-x': `${starX}%`,
                    '--star-y': `${starY}%`,
                    '--star-size': `${starSize}px`,
                    '--star-opacity': opacity,
                    '--star-soft-opacity': softOpacity,
                    '--star-dim-opacity': dimOpacity,
                    '--star-delay': `${starDelay}s`,
                  }}
                />
              ))}
            </span>
          </span>
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
              '--galaxy-tone': homeGalaxyTone,
            }}
          >
            <span className="galaxy-core" />
            <span className="galaxy-star-cluster">
              {homeGalaxyStars.map(
                ({
                  id: starId,
                  x: starX,
                  y: starY,
                  size: starSize,
                  opacity,
                  softOpacity,
                  dimOpacity,
                  delay: starDelay,
                }) => (
                <span
                  className="galaxy-star"
                  key={starId}
                  style={{
                    '--star-x': `${starX}%`,
                    '--star-y': `${starY}%`,
                    '--star-size': `${starSize}px`,
                    '--star-opacity': opacity,
                    '--star-soft-opacity': softOpacity,
                    '--star-dim-opacity': dimOpacity,
                    '--star-delay': `${starDelay}s`,
                  }}
                />
              ))}
            </span>
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
            <div className="planet-popover-header">
              <p className="eyebrow">Planet Note</p>
              <h2>{activePlanet.name}</h2>
              <div className="planet-meta">
                <span>{activePlanet.emotion}</span>
                <span>{activePlanet.createdAt}</span>
              </div>
            </div>
            <div className="planet-popover-body">
              {activePlanet.emotionProfile?.length > 0 && (
                <div className="ratio-stack" aria-label="감정군 비율">
                  {activePlanet.emotionProfile.map((profile) => (
                    <div className="ratio-item" key={profile.id}>
                      <span>{profile.label}</span>
                      <strong>{profile.ratio}%</strong>
                      <div className="ratio-track">
                        <i style={{ '--ratio': `${profile.ratio}%`, '--ratio-color': profile.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p>{activePlanet.prompt}</p>
              {activePlanet.emotionStatements?.length > 0 && (
                <div className="statement-summary">
                  <strong>선택한 마음 문장</strong>
                  {activePlanet.emotionStatements.map((statement) => (
                    <span key={statement}>{statement}</span>
                  ))}
                </div>
              )}
              <p>{activePlanet.psychology}</p>
              <div className="care-note">
                <strong>오늘의 쪽지</strong>
                <span>{activePlanet.careNote ?? getCareNote(activePlanet.dominantEmotionId)}</span>
              </div>
              <form className="mind-map-form" onSubmit={handleAddPlanetLog}>
                <label htmlFor="planet-log">마음 지도 기록</label>
                <textarea
                  id="planet-log"
                  value={activePlanetNote}
                  onChange={(event) => setActivePlanetNote(event.target.value)}
                  placeholder="오늘 이 행성에 남기고 싶은 장면이나 감정을 적어보세요."
                  rows="3"
                />
                <button className="ghost-button" type="submit" disabled={activePlanetNote.trim().length === 0}>
                  기록 남기기
                </button>
              </form>
              {activePlanet.logs?.length > 0 && (
                <div className="mind-log-list" aria-label="마음 지도 기록 목록">
                  {activePlanet.logs.map((log) => (
                    <article key={log.id}>
                      <time>{log.createdAt}</time>
                      <p>{log.text}</p>
                    </article>
                  ))}
                </div>
              )}
              <div className="palette-row" aria-label="행성 색상 팔레트">
                {activePlanet.palette.map((color) => (
                  <span key={color} style={{ backgroundColor: color }} />
                ))}
              </div>
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
              <div className="creator-choice-panel">
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

                <div className="statement-panel">
                  <div>
                    <p className="eyebrow">Mind Sentence</p>
                    <strong>마음 문장 선택 {selectedStatementIds.length}/{MAX_SELECTED_STATEMENTS}</strong>
                    <span>선택한 문장은 감정군 비율과 행성 색상에 더 강하게 반영돼요.</span>
                  </div>
                  <div className="statement-list" aria-label="마음 문장 선택">
                    {availableStatements.length > 0 ? (
                      availableStatements.map((statement) => {
                        const isSelected = selectedStatementIds.includes(statement.id);
                        const isDisabled = !isSelected && selectedStatementIds.length >= MAX_SELECTED_STATEMENTS;
                        const emotion = emotions.find((emotionItem) => emotionItem.id === statement.emotionId);

                        return (
                          <button
                            className={`statement-chip ${isSelected ? 'is-selected' : ''}`}
                            key={statement.id}
                            type="button"
                            onClick={() => handleToggleStatement(statement.id)}
                            disabled={isDisabled}
                            style={{ '--statement-tone': emotion?.palette[0] ?? '#9af7dc' }}
                          >
                            {statement.text}
                          </button>
                        );
                      })
                    ) : (
                      <p>먼저 감정 키워드를 선택하면 관련 마음 문장이 나타나요.</p>
                    )}
                  </div>
                </div>
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
                {previewEmotionProfile.length > 0 && (
                  <div className="ratio-stack preview-ratio" aria-label="예상 감정군 비율">
                    {previewEmotionProfile.map((profile) => (
                      <div className="ratio-item" key={profile.id}>
                        <span>{profile.label}</span>
                        <strong>{profile.ratio}%</strong>
                        <div className="ratio-track">
                          <i style={{ '--ratio': `${profile.ratio}%`, '--ratio-color': profile.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
