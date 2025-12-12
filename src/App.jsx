import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, X, Palette, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

const YarnOverApp = () => {
  const [mode, setMode] = useState('advanced');
  const [selectedCraft, setSelectedCraft] = useState('knit');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projectName, setProjectName] = useState('My Custom Pattern');
  const [width, setWidth] = useState(40);
  const [desiredWidth, setDesiredWidth] = useState(8);
  const [desiredLength, setDesiredLength] = useState(60);
  const [yarnWeight, setYarnWeight] = useState('worsted');
  const [stitchesPerInch, setStitchesPerInch] = useState(4.5);
  const [rowsPerInch, setRowsPerInch] = useState(6);
  const [canvas, setCanvas] = useState([]);
  const [draggedStitch, setDraggedStitch] = useState(null);
  const [draggedCanvasIndex, setDraggedCanvasIndex] = useState(null);
  const [showPatternPreview, setShowPatternPreview] = useState(false);

  // Step-by-step mode states
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategoryStep, setSelectedCategoryStep] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');

  const yarnWeights = {
    lace: { name: 'Lace', needles: 'US 000-1 (1.5-2.25mm)', hooks: '1.6-2.25mm (steel 6-B1)', gauge: 8 },
    fingering: { name: 'Fingering/Sock', needles: 'US 1-3 (2.25-3.25mm)', hooks: '2.25-3.5mm (B1-E4)', gauge: 7 },
    sport: { name: 'Sport', needles: 'US 3-5 (3.25-3.75mm)', hooks: '3.5-4.5mm (E4-7)', gauge: 6 },
    dk: { name: 'DK/Light Worsted', needles: 'US 5-6 (3.75-4mm)', hooks: '4.5-5.5mm (7-I9)', gauge: 5.5 },
    worsted: { name: 'Worsted/Aran', needles: 'US 7-9 (4.5-5.5mm)', hooks: '5.5-6.5mm (I9-K10.5)', gauge: 4.5 },
    bulky: { name: 'Bulky/Chunky', needles: 'US 9-11 (5.5-8mm)', hooks: '6.5-9mm (K10.5-M13)', gauge: 3.5 },
    super_bulky: { name: 'Super Bulky', needles: 'US 11-17 (8-12mm)', hooks: '9-15mm (M13-P)', gauge: 2 }
  };

  // Stitch Library with both knit and crochet stitches
  const stitchLibrary = {
    knit: [
      // Basic stitches
      {
        id: 'stockinette',
        name: 'Stockinette Stitch',
        category: 'basic',
        symbol: '▭',
        color: '#E8F5E9',
        description: 'Smooth and classic',
        pattern: [
          'Row 1 (RS): Knit all stitches',
          'Row 2 (WS): Purl all stitches'
        ],
        rowRepeat: 2,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'garter',
        name: 'Garter Stitch',
        category: 'basic',
        symbol: '≡',
        color: '#FFF9C4',
        description: 'Bumpy texture, both sides',
        pattern: ['Row 1: Knit all stitches'],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'seed',
        name: 'Seed Stitch',
        category: 'basic',
        symbol: '⋮',
        color: '#FFE0B2',
        description: 'Textured and reversible',
        pattern: [
          'Row 1: *K1, P1; repeat from * to end',
          'Row 2: *P1, K1; repeat from * to end'
        ],
        rowRepeat: 2,
        stitchMultiple: 2,
        difficulty: 'beginner'
      },
      // Patterned stitches
      {
        id: 'ribbing_2x2',
        name: '2x2 Ribbing',
        category: 'patterned',
        symbol: '∥',
        color: '#E1BEE7',
        description: 'Stretchy vertical lines',
        pattern: ['Row 1: *K2, P2; repeat from * to end'],
        rowRepeat: 1,
        stitchMultiple: 4,
        difficulty: 'beginner'
      },
      {
        id: 'ribbing_1x1',
        name: '1x1 Ribbing',
        category: 'patterned',
        symbol: '∣',
        color: '#F8BBD0',
        description: 'Classic stretchy edge',
        pattern: ['Row 1: *K1, P1; repeat from * to end'],
        rowRepeat: 1,
        stitchMultiple: 2,
        difficulty: 'beginner'
      },
      {
        id: 'moss',
        name: 'Moss Stitch',
        category: 'patterned',
        symbol: '◊',
        color: '#C5E1A5',
        description: 'Textured checkerboard',
        pattern: [
          'Rows 1-2: *K1, P1; repeat from * to end',
          'Rows 3-4: *P1, K1; repeat from * to end'
        ],
        rowRepeat: 4,
        stitchMultiple: 2,
        difficulty: 'beginner'
      },
      {
        id: 'basket_weave',
        name: 'Basket Weave',
        category: 'patterned',
        symbol: '▦',
        color: '#FFCCBC',
        description: 'Woven texture',
        pattern: [
          'Rows 1-4: *K4, P4; repeat from * to end',
          'Rows 5-8: *P4, K4; repeat from * to end'
        ],
        rowRepeat: 8,
        stitchMultiple: 8,
        difficulty: 'intermediate'
      },
      {
        id: 'honeycomb_cable',
        name: 'Honeycomb Cable',
        category: 'patterned',
        symbol: '⬡',
        color: '#FFF8E6',
        description: 'Intricate honeycomb pattern',
        pattern: [
          'Rows 1, 3, 5, 7 (RS): *K4, P4; repeat from * to end',
          'Rows 2, 4, 6, 8 (WS): *K4, P4; repeat from * to end',
          'Row 9 (RS): *C4B, C4F; repeat from * to end',
          'Rows 10, 12, 14, 16 (WS): *P4, K4; repeat from * to end',
          'Rows 11, 13, 15 (RS): *P4, K4; repeat from * to end'
        ],
        rowRepeat: 16,
        stitchMultiple: 8,
        difficulty: 'advanced',
        notes: 'C4B/C4F = Cable 4 back/front. Repeat these 16 rows for pattern.'
      },
      {
        id: 'horseshoe_cable',
        name: 'Horseshoe Cable',
        category: 'patterned',
        symbol: '⊃',
        color: '#E6F5FF',
        description: 'U-shaped cable design',
        pattern: [
          'Row 1 (RS): P2, *K8, P4; repeat from * to last 10 sts, K8, P2',
          'Row 2 (WS): K2, *P8, K4; repeat from * to last 10 sts, P8, K2',
          'Row 3: P2, *C4B, C4F, P4; repeat from * to last 10 sts, C4B, C4F, P2',
          'Row 4: Same as Row 2',
          'Rows 5-8: Repeat Rows 1-4'
        ],
        rowRepeat: 8,
        stitchMultiple: 12,
        difficulty: 'advanced'
      },
      {
        id: 'eyelet_lace',
        name: 'Eyelet Lace',
        category: 'patterned',
        symbol: '○',
        color: '#FFF0F5',
        description: 'Simple lace holes',
        pattern: [
          'Row 1 (RS): *K2tog, YO; repeat from * to end',
          'Row 2 (WS): Purl all stitches'
        ],
        rowRepeat: 2,
        stitchMultiple: 2,
        difficulty: 'intermediate',
        notes: 'YO = Yarn Over'
      },
      {
        id: 'feather_fan',
        name: 'Feather & Fan',
        category: 'patterned',
        symbol: '⩘',
        color: '#F0F8FF',
        description: 'Wavy lace pattern',
        pattern: [
          'Rows 1-2: Knit all stitches',
          'Row 3: *[K2tog] 3 times, [YO, K1] 6 times, [K2tog] 3 times; repeat from * to end',
          'Row 4: Purl all stitches'
        ],
        rowRepeat: 4,
        stitchMultiple: 18,
        difficulty: 'intermediate'
      },
      {
        id: 'zigzag',
        name: 'Zigzag Lace',
        category: 'patterned',
        symbol: '⚡',
        color: '#FFE4E1',
        description: 'Diagonal lace lines',
        pattern: [
          'Row 1 (RS): K1, *YO, SSK, K4; repeat from * to last st, K1',
          'Row 2 (WS): Purl all stitches',
          'Row 3: K2, *YO, SSK, K4; repeat from * to end',
          'Row 4: Purl all stitches'
        ],
        rowRepeat: 4,
        stitchMultiple: 6,
        difficulty: 'intermediate'
      },
      {
        id: 'herringbone',
        name: 'Herringbone',
        category: 'patterned',
        symbol: '⋰',
        color: '#E0E0E0',
        description: 'Diagonal texture',
        pattern: [
          'Row 1 (RS): *K2tog leaving sts on needle, K first st again, slip both off; repeat from * to end',
          'Row 2 (WS): *P2tog leaving sts on needle, P first st again, slip both off; repeat from * to end'
        ],
        rowRepeat: 2,
        stitchMultiple: 2,
        difficulty: 'intermediate'
      },
      {
        id: 'brioche',
        name: 'Brioche Stitch',
        category: 'patterned',
        symbol: '∿',
        color: '#F5F5DC',
        description: 'Squishy ribbed texture',
        pattern: [
          'Setup Row: *K1, YO, Sl1; repeat from * to end',
          'Row 1: *K1, Brk1; repeat from * to end',
          'Row 2: *Brk1, K1; repeat from * to end'
        ],
        rowRepeat: 2,
        stitchMultiple: 2,
        difficulty: 'advanced',
        notes: 'Brk1 = Knit the stitch together with its yarn over'
      },
      {
        id: 'chevron',
        name: 'Chevron/Ripple',
        category: 'patterned',
        symbol: '〰️',
        color: '#FFE5CC',
        description: 'V-shaped waves',
        pattern: [
          'Row 1: *K1, [K2tog] twice, [YO, K1] 3 times, YO, [SSK] twice; repeat from * to end',
          'Row 2: Purl all stitches'
        ],
        rowRepeat: 2,
        stitchMultiple: 14,
        difficulty: 'intermediate'
      }
    ],
    crochet: [
      {
        id: 'single_crochet',
        name: 'Single Crochet',
        category: 'basic',
        symbol: '+',
        color: '#E8F5E9',
        description: 'Dense and sturdy',
        pattern: [
          'Row 1: Insert hook, YO and pull through, YO and pull through both loops'
        ],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'double_crochet',
        name: 'Double Crochet',
        category: 'basic',
        symbol: 'T',
        color: '#FFF9C4',
        description: 'Taller and faster',
        pattern: [
          'Row 1: YO, insert hook, YO and pull through, [YO and pull through 2 loops] twice'
        ],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'granny_square',
        name: 'Granny Square',
        category: 'patterned',
        symbol: '□',
        color: '#FFE0B2',
        description: 'Classic cluster pattern',
        pattern: [
          'Round 1: Ch 3, 2 DC in ring, *Ch 2, 3 DC in ring; repeat from * 2 more times, Ch 2, join',
          'Round 2: *3 DC in corner space, Ch 2; repeat from * around'
        ],
        rowRepeat: 2,
        stitchMultiple: 3,
        difficulty: 'intermediate'
      }
    ]
  };

  // Project Categories
  const projectCategories = {
    scarves: { name: 'Scarves & Cowls', icon: '🧣', presets: ['scarf_standard', 'scarf_kids', 'scarf_extra_long', 'scarf_infinity', 'cowl', 'cowl_infinity', 'cowl_chunky'] },
    hats: { name: 'Hats & Headwear', icon: '🧢', presets: ['beanie', 'beanie_brim', 'beanie_slouchy', 'headband'] },
    accessories: { name: 'Accessories', icon: '🧤', presets: ['leg_warmers', 'cup_cozy'] },
    home: { name: 'Home Goods', icon: '🏠', presets: ['dishcloth', 'potholder', 'placemat', 'coaster_set', 'table_runner', 'hanging_towel'] },
    blankets: { name: 'Blankets', icon: '🛋️', presets: ['baby_blanket', 'throw_blanket'] },
    bags: { name: 'Bags', icon: '👜', presets: ['market_bag', 'project_bag'] },
    shawls: { name: 'Shawls & Wraps', icon: '🧶', presets: ['shawl_small', 'shawl_large'] },
    quick: { name: 'Quick Projects', icon: '⚡', presets: ['bookmark', 'yoga_mat_strap'] }
  };

  // Project Presets with Descriptions AND Shaping Information
  const projectPresets = {
    scarf_standard: { name: "Standard Scarf", width: 8, length: 60, info: "A classic scarf that never goes out of style! This size works for most adults (about 8\" wide × 60\" long). Perfect for using up yarn stash or trying a new stitch pattern!", examples: ['🧣'], shaping: null },
    scarf_kids: { name: "Kid's Scarf", width: 5, length: 48, info: "Perfect for the little ones in your life! Sized for kids ages 3-12 (about 5\" wide × 48\" long). Shorter and narrower makes it less overwhelming to knit and more comfortable for small necks.", examples: ['🧣'], shaping: null },
    scarf_extra_long: { name: "Extra Long Scarf", width: 8, length: 84, info: "For those who love to wrap up! This generous scarf (8\" × 84\") can be wrapped multiple times for maximum coziness. Great for cold climates!", examples: ['🧣'], shaping: null },
    scarf_infinity: { name: "Infinity Scarf (Cowl Style)", width: 12, length: 60, info: "A trendy loop scarf that stays put! Join the ends to create a cozy circle (12\" × 60\" before seaming). No more adjusting your scarf all day!", examples: ['🧣'], shaping: null },
    shawl_small: { name: "Small Shawl/Shawlette", width: 48, length: 24, info: "A delicate shoulder wrap perfect for dressy occasions! This smaller shawl (48\" × 24\") adds elegance without overwhelming your outfit. Great first shawl project!", examples: ['🧶'], shaping: 'triangular' },
    shawl_large: { name: "Large Shawl/Wrap", width: 72, length: 36, info: "The ultimate cozy wrap! This generous shawl (72\" × 36\") can be draped, wrapped, or worn as a blanket scarf. A true labor of love that's worth every stitch!", examples: ['🧶'], shaping: 'triangular' },
    cowl: { name: "Standard Cowl", width: 24, length: 12, info: "A snug neck warmer that's quicker than a scarf! This cowl (24\" circumference × 12\" tall) is knit in the round for no seaming. Perfect weekend project!", examples: ['🧣'], shaping: null },
    cowl_infinity: { name: "Infinity Cowl (Long)", width: 48, length: 12, info: "A versatile loop scarf! At 48\" around, this can be worn as a single loop or doubled for extra warmth. Great for layering!", examples: ['🧣'], shaping: null },
    cowl_chunky: { name: "Chunky Cowl", width: 22, length: 14, info: "Quick knit in bulky yarn! This chunky cowl (22\" × 14\") works up in just a few hours. Perfect for last-minute gifts or instant gratification!", examples: ['🧣'], shaping: null },
    beanie: { name: "Basic Beanie", width: 9, length: 8, info: "A classic hat that never goes out of style! This beanie (fits 21-23\" head) has a comfortable fit with shaped crown. Perfect for trying new stitch patterns!", examples: ['🧢'], shaping: 'hat_crown' },
    beanie_brim: { name: "Beanie with Extra Brim", width: 9, length: 10, info: "Extra cozy with a deep folded brim! The extended cuff means more warmth for your ears. Great for cold climates or just looking super snuggly!", examples: ['🧢'], shaping: 'hat_crown' },
    beanie_slouchy: { name: "Slouchy Beanie", width: 10, length: 12, info: "Laid-back style with room to spare! This slouchy beanie has extra length for that relaxed, fashionable drape. Popular with all ages!", examples: ['🧢'], shaping: 'hat_crown' },
    headband: { name: "Headband/Ear Warmer", width: 4, length: 18, info: "Quick knit for keeping ears warm! This headband (4\" × 18\") is perfect for those days when a full hat is too much. Great project for using leftover yarn!", examples: ['👑'], shaping: null },
    dishcloth: { name: "Dishcloth", width: 8, length: 8, info: "Practical and pretty! A handmade dishcloth (8\" × 8\") is perfect for learning new stitches. Use cotton yarn for best absorption. Great gifts!", examples: ['🧽'], shaping: null },
    potholder: { name: "Potholder/Hot Pad", width: 8, length: 8, info: "Protect your counters in style! This potholder (8\" × 8\") uses double-thick cotton for heat protection. Add a hanging loop for convenience!", examples: ['🧽'], shaping: null },
    placemat: { name: "Placemat", width: 12, length: 18, info: "Dress up your table! A handmade placemat (12\" × 18\") adds personality to any meal. Use washable cotton for easy care.", examples: ['🍽️'], shaping: null },
    coaster_set: { name: "Coaster (Set of 4)", width: 4, length: 4, info: "Tiny but mighty! These coasters (4\" × 4\") are quick to make and perfect for gifts. Knit a set of 4-6 in coordinating colors!", examples: ['☕'], shaping: null },
    table_runner: { name: "Table Runner", width: 14, length: 48, info: "Elegant table decor! This runner (14\" × 48\") is perfect for dining tables or sideboards. Lace stitches look especially beautiful for this project!", examples: ['🍽️'], shaping: null },
    hanging_towel: { name: "Hanging Kitchen Towel", width: 12, length: 16, info: "Functional and decorative! Add a button loop at the top to hang from your oven door. Use absorbent cotton yarn. A thoughtful handmade gift!", examples: ['🧺'], shaping: null },
    baby_blanket: { name: "Baby Blanket", width: 36, length: 36, info: "Welcome a new little one! This baby blanket (36\" × 36\") is the perfect size for a car seat, stroller, or crib. Choose soft, washable yarn - babies are messy! A treasured handmade gift.", examples: ['👶'], shaping: null },
    throw_blanket: { name: "Throw Blanket/Afghan", width: 50, length: 60, info: "The ultimate cozy project! This throw (50\" × 60\") is perfect for couches, beds, or snuggling. It's a commitment (100+ hours) but so worth it. Great for using up a yarn stash!", examples: ['🛋️'], shaping: null },
    market_bag: { name: "Market/Tote Bag", width: 14, length: 16, info: "Eco-friendly shopping in style! This sturdy tote (14\" wide × 16\" tall) features a flat base with corner gussets for structure. Perfect for groceries, books, or beach trips!", examples: ['🛍️'], shaping: 'bag_construction' },
    project_bag: { name: "Project Bag (Small)", width: 10, length: 12, info: "Keep your knitting organized! This drawstring bag (10\" wide × 12\" tall) has a circular base and gathered top. Perfect for storing yarn and WIPs. Knitters making things for knitters - so meta!", examples: ['👜'], shaping: 'bag_construction' },
    bookmark: { name: "Bookmark", width: 2, length: 8, info: "Perfect for beginners or using up scraps! This bookmark (2\" × 8\") takes less than an hour to make. Add a tassel for extra flair. Great for book club gifts!", examples: ['📚'], shaping: null },
    leg_warmers: { name: "Leg Warmers", width: 12, length: 16, info: "80s style or practical warmth! These leg warmers (12\" circumference × 16\" long) are knit in the round like tall socks. Perfect for dancers, yoga, or just lounging!", examples: ['🧦'], shaping: null },
    cup_cozy: { name: "Cup Cozy/Sleeve", width: 10, length: 4, info: "Protect your hands from hot drinks! This cozy (10\" × 4\") wraps around your morning coffee. Add a button closure or leave it as a simple sleeve. Five-star gift for coffee lovers!", examples: ['☕'], shaping: null },
    yoga_mat_strap: { name: "Yoga Mat Strap", width: 3, length: 40, info: "Carry your mat in style! This strap (3\" × 40\") can be adjusted with buckles or simply tied. Use strong yarn like cotton or acrylic. Namaste!", examples: ['🧘'], shaping: null }
  };

  // Hat Crown Shaping Calculator
  const calculateHatCrown = (initialStitches, stitchesPerInch) => {
    // Standard crown shaping: divide stitches into 8-12 sections
    const sections = initialStitches >= 96 ? 12 : initialStitches >= 80 ? 10 : 8;
    const stitchesPerSection = Math.floor(initialStitches / sections);
    
    const decreaseRounds = [];
    let currentStitches = initialStitches;
    let roundNum = 1;
    let stitchesBeforeDecrease = stitchesPerSection;
    
    while (currentStitches > sections * 2) {
      // Decrease round
      const newStitchCount = currentStitches - sections;
      stitchesBeforeDecrease = Math.floor(currentStitches / sections) - 1;
      
      decreaseRounds.push({
        round: roundNum,
        type: 'decrease',
        instruction: `*K${stitchesBeforeDecrease}, K2tog; repeat from * to end`,
        stitchCount: newStitchCount
      });
      
      currentStitches = newStitchCount;
      roundNum++;
      
      // Plain round (only if we have enough stitches left)
      if (currentStitches > sections * 2) {
        decreaseRounds.push({
          round: roundNum,
          type: 'plain',
          instruction: 'Knit all stitches',
          stitchCount: currentStitches
        });
        roundNum++;
      }
    }
    
    return {
      sections,
      rounds: decreaseRounds,
      finalStitches: currentStitches
    };
  };

  // Triangular Shaping Calculator (for shawls)
  const calculateTriangularShaping = (finalWidth, stitchesPerInch) => {
    const startingStitches = 3;
    const targetStitches = Math.ceil(finalWidth * stitchesPerInch);
    const stitchesToIncrease = targetStitches - startingStitches;
    
    // Increase 2 stitches every other row (one on each side)
    const increaseRows = Math.ceil(stitchesToIncrease / 2);
    const totalRows = increaseRows * 2; // Every other row
    
    const rows = [];
    let currentStitches = startingStitches;
    
    for (let i = 1; i <= totalRows && currentStitches < targetStitches; i++) {
      if (i % 2 === 1) {
        // Increase row
        rows.push({
          row: i,
          type: 'increase',
          instruction: `K1, M1, knit to last stitch, M1, K1`,
          stitchCount: currentStitches + 2
        });
        currentStitches += 2;
      } else {
        // Plain row
        rows.push({
          row: i,
          type: 'plain',
          instruction: 'Knit all stitches',
          stitchCount: currentStitches
        });
      }
    }
    
    return {
      startingStitches,
      finalStitches: currentStitches,
      rows,
      estimatedLength: Math.ceil(totalRows / (6 * 2)) // Approximate inches based on row gauge
    };
  };

  // Bag Construction Calculator
  const calculateBagConstruction = (width, height, stitchesPerInch, rowsPerInch) => {
    const baseWidth = Math.ceil(width * stitchesPerInch);
    const gussetDepth = Math.ceil((width * 0.25) * stitchesPerInch); // Gusset is 25% of width
    const sideHeight = Math.ceil(height * rowsPerInch);
    const handleLength = Math.ceil((width * 0.5) * stitchesPerInch); // Handle is 50% of bag width
    
    return {
      baseWidth,
      baseRows: Math.ceil((width * 0.25) * rowsPerInch), // Base is square (1/4 of width)
      gussetDepth,
      sideHeight,
      handleLength,
      handleRows: Math.ceil(12 * rowsPerInch) // 12 inches long
    };
  };

  // Drag & Drop Handlers
  const handleDragStart = (stitch) => {
    setDraggedStitch(stitch);
  };

  const handleCanvasDragStart = (index) => {
    setDraggedCanvasIndex(index);
  };

  const handleCanvasDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCanvasIndex === null || draggedCanvasIndex === index) return;
    
    const newCanvas = [...canvas];
    const draggedItem = newCanvas[draggedCanvasIndex];
    newCanvas.splice(draggedCanvasIndex, 1);
    newCanvas.splice(index, 0, draggedItem);
    setCanvas(newCanvas);
    setDraggedCanvasIndex(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedStitch) {
      setCanvas([...canvas, { ...draggedStitch, id: Date.now() }]);
      setDraggedStitch(null);
    }
    setDraggedCanvasIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Mobile: Tap to add stitch to canvas
  const handleStitchClick = (stitch) => {
    setCanvas([...canvas, { ...stitch, id: Date.now() }]);
  };

  // Mobile: Tap to move canvas items up/down
  const moveCanvasItem = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === canvas.length - 1) return;
    
    const newCanvas = [...canvas];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCanvas[index], newCanvas[targetIndex]] = [newCanvas[targetIndex], newCanvas[index]];
    setCanvas(newCanvas);
  };

  const removeFromCanvas = (id) => {
    setCanvas(canvas.filter(item => item.id !== id));
  };

  const clearCanvas = () => {
    setCanvas([]);
  };

  const getFilteredStitches = () => {
    const stitches = stitchLibrary[selectedCraft] || [];
    if (selectedCategory === 'all') return stitches;
    return stitches.filter(s => s.category === selectedCategory);
  };

  const recalculateGauge = () => {
    setWidth(Math.ceil(desiredWidth * stitchesPerInch * 1.15));
  };

  // Pattern Generation with Crown Shaping
  const generatePattern = () => {
    const craftType = selectedCraft === 'knit' ? 'Knitting' : 'Crochet';
    const preset = projectPresets[selectedPreset];
    const yarn = yarnWeights[yarnWeight];
    const isInRound = ['beanie', 'beanie_brim', 'beanie_slouchy', 'cowl', 'cowl_infinity', 'cowl_chunky', 'fingerless_gloves', 'leg_warmers'].some(key => selectedPreset.includes(key));
    const hasHatShaping = preset.shaping === 'hat_crown';
    const hasTriangularShaping = preset.shaping === 'triangular';
    const hasBagShaping = preset.shaping === 'bag_construction';
    
    let pattern = '';
    
    // Title Section
    pattern += `╔═══════════════════════════════════════════════════════════╗\n`;
    pattern += `║                                                           ║\n`;
    pattern += `║                    ${projectName.toUpperCase()}                    ║\n`;
    pattern += `║                                                           ║\n`;
    pattern += `╚═══════════════════════════════════════════════════════════╝\n\n`;
    
    pattern += `Hi! Let's make your ${projectName} together. This pattern will guide you\n`;
    pattern += `step-by-step through the process. Take your time and enjoy the journey!\n\n`;
    
    pattern += `════════════════════════════════════════════════════════════════\n`;
    pattern += `WHAT YOU'LL NEED:\n`;
    pattern += `════════════════════════════════════════════════════════════════\n\n`;
    
    pattern += `MATERIALS:\n`;
    pattern += `• ${yarn.name} weight yarn\n`;
    pattern += `  (you'll need about ${Math.ceil(desiredWidth * desiredLength * 0.5)} yards)\n\n`;
    
    pattern += `NEEDLES:\n`;
    pattern += `• ${selectedCraft === 'knit' ? yarn.needles : yarn.hooks}`;
    if (isInRound) pattern += ` circular, 16\" long`;
    pattern += `\n\n`;
    
    pattern += `OTHER NOTIONS:\n`;
    pattern += `• Tapestry needle for weaving in ends\n`;
    pattern += `• Scissors\n`;
    if (isInRound) pattern += `• Stitch marker (for marking beginning of round)\n`;
    pattern += `\n`;
    
    pattern += `GAUGE:\n`;
    pattern += `${stitchesPerInch} sts × ${rowsPerInch} rows = 1 inch in pattern stitch\n`;
    pattern += `(Gauge matters! Take the time to check yours matches this.)\n\n`;
    
    if (hasHatShaping) {
      pattern += `FINISHED SIZE:\n`;
      pattern += `${Math.round(desiredWidth * 2 * Math.PI)}\" circumference × ${desiredLength}\" tall (before crown)\n`;
      pattern += `Fits average adult head (21-23\" circumference)\n\n`;
    } else if (hasTriangularShaping) {
      pattern += `FINISHED SIZE:\n`;
      pattern += `Approximately ${desiredWidth}\" wide × ${desiredLength}\" long at center\n`;
      pattern += `Triangle shape - starts with 3 stitches and increases to full width\n\n`;
    } else if (hasBagShaping) {
      pattern += `FINISHED SIZE:\n`;
      pattern += `${desiredWidth}\" wide × ${desiredLength}\" tall\n`;
      pattern += `Includes shaped base and handles\n\n`;
    }
    
    pattern += `════════════════════════════════════════════════════════════════\n`;
    pattern += `LET'S GET STARTED!\n`;
    pattern += `════════════════════════════════════════════════════════════════\n\n`;
    
    if (hasTriangularShaping) {
      pattern += `Cast on 3 stitches.\n\n`;
      pattern += `💡 Tip: We'll be increasing at the edges to create a triangle shape!\n\n`;
    } else if (isInRound) {
      pattern += `Cast on ${width} stitches and join in the round, being careful not to\n`;
      pattern += `twist your stitches. Place a stitch marker to mark the beginning of\n`;
      pattern += `the round.\n\n`;
    } else {
      pattern += `Cast on ${width} stitches.\n\n`;
    }
    
    pattern += `THE PATTERN:\n\n`;
    
    if (canvas.length === 0) {
      if (hasTriangularShaping) {
        // For triangular shaping with no canvas, use default garter stitch
        pattern += `No stitch pattern selected - using Garter Stitch (recommended for\n`;
        pattern += `first-time shawl makers!)\n\n`;
      } else {
        pattern += `Choose your stitch pattern from the designer and add it to create\n`;
        pattern += `your custom pattern!\n\n`;
      }
    } else if (!hasTriangularShaping) {
      // Only display canvas sections for non-triangular projects
      canvas.forEach((section, index) => {
        const sectionName = section.sectionName || (hasHatShaping && index === 0 ? 'Brim' : hasHatShaping && index === 1 ? 'Body' : hasTriangularShaping ? 'Shawl Body' : hasBagShaping && index === 0 ? 'Base' : hasBagShaping && index === 1 ? 'Sides' : `Section ${index + 1}`);
        
        pattern += `────────────────────────────────────────────────────────────────\n`;
        pattern += `${sectionName.toUpperCase()}\n`;
        pattern += `────────────────────────────────────────────────────────────────\n\n`;
        
        if (section.notes) {
          pattern += `(${section.notes})\n\n`;
        }
        
        pattern += `We'll be working in ${section.name} for this section. `;
        if (section.difficulty === 'beginner') {
          pattern += `This is a beginner-friendly\nstitch - you've got this!\n\n`;
        } else if (section.difficulty === 'intermediate') {
          pattern += `This pattern requires\nsome attention but is very rewarding!\n\n`;
        } else {
          pattern += `This is an advanced stitch -\ntake your time and enjoy the challenge!\n\n`;
        }
        
        pattern += `Work as follows:\n\n`;
        section.pattern.forEach((row, i) => {
          const rowLabel = isInRound ? `   Round ${i + 1}` : `   ${row}`;
          pattern += `${isInRound ? rowLabel + ': ' + row.replace(/Row \d+ \((RS|WS)\): /, '').replace(/Row \d+: /, '') : rowLabel}\n`;
        });
        pattern += `\n`;
        
        if (section.notes && section.notes.includes('cable')) {
          pattern += `${section.notes}\n\n`;
        }
        
        // Timing guidance for hats
        if (hasHatShaping) {
          if (sectionName.toLowerCase().includes('brim') || index === 0) {
            pattern += `Work in pattern for 2-3 inches (approximately 20-25 rounds).\n`;
            pattern += `This section takes about 30-45 minutes.\n\n`;
            pattern += `💡 Tip: Try on as you go! Everyone's head is different.\n\n`;
          } else if (sectionName.toLowerCase().includes('body') || index === 1) {
            pattern += `Continue in pattern until body measures 5-6 inches from brim\n`;
            pattern += `(approximately 45-50 rounds). This section takes about 2-3 hours.\n\n`;
            pattern += `Your hat should measure about 7-8 inches total before starting crown.\n\n`;
          }
        } else if (selectedPreset.includes('scarf')) {
          pattern += `\nWork in pattern until scarf reaches desired length:\n`;
          pattern += `  • Kids (3-8 yrs): 36-48 inches\n`;
          pattern += `  • Kids (9-12 yrs): 48-54 inches\n`;
          pattern += `  • Adult: 60-72 inches\n\n`;
          pattern += `Time estimate: About 1 inch per hour (plan for ${Math.ceil(desiredLength/12)}-${Math.ceil(desiredLength/8)}\n`;
          pattern += `hours total).\n\n`;
          pattern += `💡 Tip: Scarves are a marathon! Take breaks and enjoy the process.\n\n`;
        } else if (selectedPreset.includes('cowl')) {
          pattern += `\nWork in pattern for ${desiredLength} inches (about ${Math.ceil(desiredLength * rowsPerInch)}\n`;
          pattern += `rounds).\n`;
          pattern += `This takes approximately ${Math.ceil(desiredLength/2)}-${Math.ceil(desiredLength/1.5)} hours.\n\n`;
        } else if (selectedPreset.includes('blanket')) {
          pattern += `\nContinue in pattern until piece measures ${desiredLength} inches from\n`;
          pattern += `cast-on edge.\n`;
          pattern += `This is a large project - expect 50-100+ hours depending on size!\n\n`;
          pattern += `💡 Tip: Break it into sections. Celebrate every 10 inches!\n\n`;
        } else {
          pattern += `\nRepeat these ${section.rowRepeat} ${isInRound ? 'round' : 'row'}${section.rowRepeat > 1 ? 's' : ''}`;
          pattern += ` until section measures\ndesired length`;
          if (desiredLength) {
            pattern += ` (about ${desiredLength} inches for this project).\n\n`;
          } else {
            pattern += `.\n\n`;
          }
          pattern += `💡 Tip: Place a stitch marker or note on paper each time you\n`;
          pattern += `complete the ${section.rowRepeat}-${isInRound ? 'round' : 'row'} repeat to help you keep track!\n\n`;
        }
      });
      
      // Add Crown Shaping for Hats
      if (hasHatShaping) {
        const crownShaping = calculateHatCrown(width, stitchesPerInch);
        
        pattern += `────────────────────────────────────────────────────────────────\n`;
        pattern += `CROWN SHAPING\n`;
        pattern += `────────────────────────────────────────────────────────────────\n\n`;
        
        pattern += `Time to shape the top! We'll decrease gradually to create a\n`;
        pattern += `nice rounded crown. You're dividing your ${width} stitches into\n`;
        pattern += `${crownShaping.sections} sections and decreasing in each section.\n\n`;
        
        pattern += `💡 Tip: Switch to double-pointed needles (DPNs) when it gets too\n`;
        pattern += `tight for your circular needles (usually around 40-50 stitches).\n\n`;
        
        pattern += `Work as follows:\n\n`;
        
        crownShaping.rounds.forEach((round, idx) => {
          if (round.type === 'decrease') {
            pattern += `   Round ${round.round}: ${round.instruction} (${round.stitchCount} sts remain)\n`;
          } else {
            pattern += `   Round ${round.round}: ${round.instruction}\n`;
          }
        });
        
        pattern += `\n`;
        pattern += `When you have ${crownShaping.finalStitches} stitches remaining:\n`;
        pattern += `1. Cut yarn, leaving a 12\" tail\n`;
        pattern += `2. Thread tail through tapestry needle\n`;
        pattern += `3. Thread through remaining ${crownShaping.finalStitches} stitches\n`;
        pattern += `4. Pull tight to close the crown\n`;
        pattern += `5. Secure with a few stitches on the inside\n\n`;
        
        pattern += `This crown shaping takes about 30-45 minutes.\n\n`;
      }
      
      // Add Bag Construction Instructions
      if (hasBagShaping) {
        const bagConstruction = calculateBagConstruction(desiredWidth, desiredLength, stitchesPerInch, rowsPerInch);
        
        pattern += `────────────────────────────────────────────────────────────────\n`;
        pattern += `BAG ASSEMBLY & HANDLES\n`;
        pattern += `────────────────────────────────────────────────────────────────\n\n`;
        
        pattern += `Your bag pieces are complete! Now let's add structure and handles.\n\n`;
        
        pattern += `CREATING THE BAG SHAPE:\n\n`;
        pattern += `1. Fold your rectangle in half, right sides together\n`;
        pattern += `2. Seam the sides using mattress stitch\n`;
        pattern += `3. For a flat bottom: Pinch corners and seam across\n`;
        pattern += `   (about ${Math.round(desiredWidth * 0.25)}\" from corner) to create gusset\n`;
        pattern += `4. Turn right side out\n\n`;
        
        pattern += `ADDING HANDLES:\n\n`;
        pattern += `Option 1 - Knitted I-Cord Handles:\n`;
        pattern += `• Cast on 4 stitches onto DPNs\n`;
        pattern += `• *Knit 4, slide stitches to other end of needle; repeat from *\n`;
        pattern += `• Continue for 12-14 inches\n`;
        pattern += `• Make two handles\n`;
        pattern += `• Sew securely to inside of bag, ${Math.round(desiredWidth * 0.2)}\" from side seams\n\n`;
        
        pattern += `Option 2 - Purchased Handles:\n`;
        pattern += `• Use wooden, leather, or fabric handles from craft store\n`;
        pattern += `• Fold top edge of bag over handle\n`;
        pattern += `• Sew securely with matching yarn\n\n`;
        
        pattern += `Option 3 - Simple Strap Handles:\n`;
        pattern += `• Cast on ${bagConstruction.handleLength} stitches\n`;
        pattern += `• Work in garter stitch (knit every row) for 2-3 inches\n`;
        pattern += `• Bind off\n`;
        pattern += `• Make two straps\n`;
        pattern += `• Sew to inside of bag, evenly spaced\n\n`;
        
        pattern += `💡 Tip: For extra strength, sew handles on with doubled yarn and\n`;
        pattern += `make multiple passes. Handles take the most stress!\n\n`;
        
        pattern += `REINFORCEMENT (Optional but Recommended):\n`;
        pattern += `• Add a fabric liner for structure\n`;
        pattern += `• Use interfacing or canvas fabric cut to bag size\n`;
        pattern += `• Hand-sew liner to top edge of bag\n`;
        pattern += `• This prevents stretching and adds durability\n\n`;
      }
    }
    
    // Add Triangular Shaping for Shawls - Integrated with Canvas Stitches
    // This runs OUTSIDE the canvas display logic so it works whether canvas is shown or not
    if (hasTriangularShaping) {
      const triangleShaping = calculateTriangularShaping(desiredWidth, stitchesPerInch);
      
      // Use first canvas stitch if available, otherwise default to garter
      const mainStitch = canvas.length > 0 ? canvas[0] : {
        id: 'garter',
        name: 'Garter Stitch',
        pattern: ['Row 1: Knit all stitches']
      };
      
      // Determine if pattern is simple or complex
      const simplePatterns = ['garter', 'stockinette', 'seed'];
      const isSimplePattern = simplePatterns.includes(mainStitch.id);
      
      pattern += `────────────────────────────────────────────────────────────────\n`;
      pattern += `SHAWL BODY - ${mainStitch.name} with Triangular Shaping\n`;
      pattern += `────────────────────────────────────────────────────────────────\n\n`;
      
      pattern += `We'll create the triangle shape while working in ${mainStitch.name}!\n`;
      pattern += `Starting with 3 stitches, we'll grow to approximately ${triangleShaping.finalStitches} stitches.\n\n`;
      
      pattern += `💡 Tip: Use stitch markers at the beginning and end to help track\n`;
      pattern += `where to place your increases. M1 = Make 1 (lift bar between\n`;
      pattern += `stitches and knit into the back of it).\n\n`;
      
      // Provide pattern-specific instructions
      if (mainStitch.id === 'garter') {
        pattern += `GARTER STITCH TRIANGLE:\n`;
        pattern += `This is the easiest shawl! All rows are knit.\n\n`;
        pattern += `   Row 1 (RS): K1, M1, K1, M1, K1 (5 sts)\n`;
        pattern += `   Row 2: Knit all stitches\n`;
        pattern += `   Row 3 (RS): K1, M1, knit to last stitch, M1, K1 (7 sts)\n`;
        pattern += `   Row 4: Knit all stitches\n`;
        pattern += `   Row 5 (RS): K1, M1, knit to last stitch, M1, K1 (9 sts)\n`;
        pattern += `   Row 6: Knit all stitches\n\n`;
        pattern += `Continue in this manner, increasing 2 stitches every RS row and\n`;
        pattern += `knitting every row, until shawl reaches ${desiredWidth}\" wide.\n\n`;
      } else if (mainStitch.id === 'stockinette') {
        pattern += `STOCKINETTE STITCH TRIANGLE:\n`;
        pattern += `Creates a smooth, classic shawl.\n\n`;
        pattern += `   Row 1 (RS): K1, M1, K1, M1, K1 (5 sts)\n`;
        pattern += `   Row 2 (WS): Purl all stitches\n`;
        pattern += `   Row 3 (RS): K1, M1, knit to last stitch, M1, K1 (7 sts)\n`;
        pattern += `   Row 4 (WS): Purl all stitches\n`;
        pattern += `   Row 5 (RS): K1, M1, knit to last stitch, M1, K1 (9 sts)\n`;
        pattern += `   Row 6 (WS): Purl all stitches\n\n`;
        pattern += `Continue in this manner: knit all stitches on RS rows (with increases\n`;
        pattern += `at edges) and purl all stitches on WS rows until shawl reaches\n`;
        pattern += `${desiredWidth}\" wide.\n\n`;
      } else if (mainStitch.id === 'seed') {
        pattern += `SEED STITCH TRIANGLE:\n`;
        pattern += `Creates a lovely textured shawl.\n\n`;
        pattern += `   Row 1 (RS): K1, M1, K1, M1, K1 (5 sts)\n`;
        pattern += `   Row 2: *P1, K1; repeat from * to last st, P1\n`;
        pattern += `   Row 3 (RS): K1, M1, work in seed st to last st, M1, K1 (7 sts)\n`;
        pattern += `   Row 4: Work all stitches in seed stitch pattern\n`;
        pattern += `   (if stitch shows as a knit, purl it; if it shows as a purl, knit it)\n\n`;
        pattern += `💡 Tip: Keep the first and last stitch of each row in stockinette\n`;
        pattern += `(K on RS, P on WS) for clean edges, working seed stitch in between.\n\n`;
        pattern += `Continue increasing 2 stitches every RS row while maintaining seed\n`;
        pattern += `stitch pattern until shawl reaches ${desiredWidth}\" wide.\n\n`;
      } else {
        // Complex patterns (ribbing, cables, lace)
        pattern += `PATTERN STITCH TRIANGLE:\n`;
        pattern += `We'll work ${mainStitch.name} while increasing for the triangle shape.\n\n`;
        
        pattern += `Starting Setup:\n`;
        pattern += `   Row 1 (RS): K1, M1, K1, M1, K1 (5 sts)\n`;
        pattern += `   Row 2 (WS): Work setup row for ${mainStitch.name}:\n`;
        
        // Show the first pattern row adapted for 5 stitches
        if (mainStitch.pattern[0]) {
          pattern += `      ${mainStitch.pattern[0].replace(/Row \d+ \((RS|WS)\): /, '').replace(/Row \d+: /, '')}\n`;
        }
        
        pattern += `\n   Row 3 (RS): K1, M1, work in established pattern to last st, M1, K1 (7 sts)\n`;
        pattern += `   Row 4 (WS): Work in pattern, incorporating new stitches\n\n`;
        
        pattern += `💡 IMPORTANT: As your triangle grows, you'll need to maintain the\n`;
        pattern += `pattern in the center while adding new stitches at the edges.\n\n`;
        
        if (mainStitch.stitchMultiple > 1) {
          pattern += `⚠️ NOTE: ${mainStitch.name} works on multiples of ${mainStitch.stitchMultiple} stitches.\n`;
          pattern += `Keep the edge stitches in stockinette (K on RS, P on WS) until you\n`;
          pattern += `have enough stitches to complete another pattern repeat. This creates\n`;
          pattern += `a stockinette border that transitions into the pattern.\n\n`;
        }
        
        pattern += `Continue increasing 2 stitches every RS row, working:\n`;
        pattern += `• Edge stitches in stockinette stitch (K on RS, P on WS)\n`;
        pattern += `• Center stitches in ${mainStitch.name}\n`;
        pattern += `• Add new stitches to pattern as you have enough for full repeats\n\n`;
        
        pattern += `Work until shawl reaches ${desiredWidth}\" wide at the top edge.\n\n`;
      }
      
      pattern += `FINISHING THE SHAWL:\n`;
      pattern += `When you reach desired size (approximately ${triangleShaping.finalStitches} stitches):\n`;
      pattern += `Bind off VERY loosely to maintain stretch and drape.\n\n`;
      pattern += `This shawl will grow quickly! Enjoy watching your triangle take shape.\n\n`;
    }
    
    pattern += `════════════════════════════════════════════════════════════════\n`;
    pattern += `FINISHING TOUCHES\n`;
    pattern += `════════════════════════════════════════════════════════════════\n\n`;
    pattern += `You're almost done! Here's how to finish up:\n\n`;
    
    if (hasTriangularShaping) {
      pattern += `1. Bind off all stitches VERY loosely (shawls need drape!)\n`;
      pattern += `2. Weave in all ends\n`;
      pattern += `3. Block your shawl by pinning to measurements and misting with water\n`;
      pattern += `4. Let dry completely before unpinning\n`;
      pattern += `\n💡 Blocking is essential for shawls - it opens up the lace and\n`;
      pattern += `creates beautiful drape!\n`;
    } else if (hasBagShaping) {
      pattern += `1. Weave in all ends securely (bags get lots of use!)\n`;
      pattern += `2. Block pieces flat before assembly if needed\n`;
      pattern += `3. Follow assembly instructions above for seaming and handles\n`;
      pattern += `4. Consider adding a fabric liner for extra strength\n`;
    } else if (!hasHatShaping) {
      pattern += `1. Bind off all stitches loosely (you want this edge to have some\n`;
      pattern += `   stretch)\n`;
      pattern += `2. Weave in all your ends with a tapestry needle\n`;
    } else {
      pattern += `1. Weave in all your ends with a tapestry needle\n`;
    }
    
    if (selectedPreset.includes('scarf_infinity') || selectedPreset.includes('cowl_infinity')) {
      pattern += `3. Seam the short ends together to create a loop (use mattress\n`;
      pattern += `   stitch for an invisible seam)\n`;
    }
    
    pattern += `\n════════════════════════════════════════════════════════════════\n`;
    pattern += `CONGRATULATIONS!\n`;
    pattern += `════════════════════════════════════════════════════════════════\n\n`;
    pattern += `You did it! Your beautiful ${projectName} is complete. Wear it with\n`;
    pattern += `pride knowing you created something amazing with your own two hands!\n\n`;
    pattern += `📸 Share your finished project with #YarnOverMade\n\n`;
    pattern += `Made with love by Yarn Over 🧶\n`;
    pattern += `yarnover.app\n\n`;
    pattern += `────────────────────────────────────────────────────────────────\n`;
    pattern += `We'd love your feedback! Take 2 minutes to help us improve:\n`;
    pattern += `https://forms.gle/FnDRazzz7puzAaLt8\n`;
    pattern += `────────────────────────────────────────────────────────────────\n`;
    
    return pattern;
  };

  const downloadPattern = () => {
    const pattern = generatePattern();
    const blob = new Blob([pattern], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_pattern.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track download event
    if (window.gtag) {
      window.gtag('event', 'pattern_download', {
        'project_name': projectName,
        'yarn_weight': yarnWeight,
        'craft_type': selectedCraft,
        'has_shaping': projectPresets[selectedPreset]?.shaping || 'none',
        'shaping_type': projectPresets[selectedPreset]?.shaping || 'none'
      });
    }
  };

  // Step-by-step mode functions
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const selectCategory = (category) => {
    setSelectedCategoryStep(category);
    nextStep();
  };

  const selectProject = (presetKey) => {
    const preset = projectPresets[presetKey];
    setSelectedPreset(presetKey);
    setProjectName(preset.name);
    setDesiredWidth(preset.width);
    setDesiredLength(preset.length);
    setWidth(Math.ceil(preset.width * stitchesPerInch * 1.15));
    nextStep();
  };

  const selectYarnWeight = (weight) => {
    setYarnWeight(weight);
    setStitchesPerInch(yarnWeights[weight].gauge);
    setRowsPerInch(yarnWeights[weight].gauge * 1.33);
    setWidth(Math.ceil(desiredWidth * yarnWeights[weight].gauge * 1.15));
    nextStep();
  };

  const finalizePattern = () => {
    if (canvas.length === 0) {
      alert('Please add at least one stitch pattern to your canvas!');
      return;
    }
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-3">
            🧶 Yarn Over
          </h1>
          <p className="text-gray-600">Design Your Dream Pattern in Minutes</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border-2 border-purple-300 p-1 bg-white">
            <button
              onClick={() => setMode('advanced')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'advanced'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Advanced Mode
            </button>
            <button
              onClick={() => setMode('step-by-step')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'step-by-step'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Step-by-Step
            </button>
          </div>
        </div>

        {mode === 'advanced' ? (
          // ADVANCED MODE
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Configuration */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-purple-600 mb-4">Project Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Project</label>
                    <select
                      value={selectedPreset}
                      onChange={(e) => {
                        const presetKey = e.target.value;
                        if (presetKey) {
                          const preset = projectPresets[presetKey];
                          setSelectedPreset(presetKey);
                          setProjectName(preset.name);
                          setDesiredWidth(preset.width);
                          setDesiredLength(preset.length);
                          setWidth(Math.ceil(preset.width * stitchesPerInch * 1.15));
                        }
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    >
                      <option value="">Select a project...</option>
                      {Object.entries(projectCategories).map(([catKey, category]) => (
                        <optgroup key={catKey} label={`${category.icon} ${category.name}`}>
                          {category.presets.map((presetKey) => (
                            <option key={presetKey} value={presetKey}>
                              {projectPresets[presetKey].name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yarn Weight</label>
                    <select
                      value={yarnWeight}
                      onChange={(e) => {
                        setYarnWeight(e.target.value);
                        setStitchesPerInch(yarnWeights[e.target.value].gauge);
                        setRowsPerInch(yarnWeights[e.target.value].gauge * 1.33);
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    >
                      {Object.entries(yarnWeights).map(([key, yarn]) => (
                        <option key={key} value={key}>{yarn.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desired Width (inches): {desiredWidth}"
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="72"
                      value={desiredWidth}
                      onChange={(e) => setDesiredWidth(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desired Length (inches): {desiredLength}"
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="84"
                      value={desiredLength}
                      onChange={(e) => setDesiredLength(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Gauge Adjuster */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-4">Gauge Adjuster</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stitches per inch: {stitchesPerInch}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={stitchesPerInch}
                      onChange={(e) => setStitchesPerInch(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rows per inch: {rowsPerInch}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={rowsPerInch}
                      onChange={(e) => setRowsPerInch(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  
                  <button
                    onClick={recalculateGauge}
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Recalculate Width
                  </button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    Cast on: <span className="font-bold text-purple-600">{width} stitches</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Column - Stitch Library */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-purple-600">Stitch Library</h2>
                <Palette size={24} className="text-purple-500" />
              </div>

              {/* Knit/Crochet Toggle */}
              <div className="flex gap-2 mb-4 justify-center">
                <button
                  onClick={() => setSelectedCraft('knit')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCraft === 'knit'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🧶 Knitting
                </button>
                <button
                  onClick={() => setSelectedCraft('crochet')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCraft === 'crochet'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🪡 Crochet
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('basic')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'basic'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setSelectedCategory('patterned')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'patterned'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Patterned
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3 hidden md:block">💡 Desktop: Drag | Mobile: Tap</p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getFilteredStitches().map((stitch) => (
                  <div
                    key={stitch.id}
                    draggable
                    onDragStart={() => handleDragStart(stitch)}
                    onClick={() => handleStitchClick(stitch)}
                    className="p-4 rounded-lg shadow-md cursor-move hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: stitch.color, borderLeft: `4px solid ${stitch.color}` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{stitch.symbol}</span>
                        <div>
                          <div className="font-bold text-gray-800">{stitch.name}</div>
                          <div className="text-sm text-gray-600">{stitch.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {stitch.rowRepeat} row{stitch.rowRepeat > 1 ? 's' : ''} • {stitch.difficulty}
                          </div>
                        </div>
                      </div>
                      <Plus size={20} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Canvas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-purple-600">Your Pattern</h2>
                {canvas.length > 0 && (
                  <button
                    onClick={clearCanvas}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-4 border-dashed border-purple-200 rounded-lg p-6 min-h-64"
              >
                {canvas.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <p className="hidden md:block">Drag stitches here to build your pattern</p>
                    <p className="md:hidden">Tap stitches to add them here</p>
                    <p className="text-sm mt-2 hidden md:block">Drag to reorder!</p>
                    <p className="text-sm mt-2 md:hidden">Use ↑↓ buttons to reorder</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {canvas.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleCanvasDragStart(index)}
                        onDragOver={(e) => handleCanvasDragOver(e, index)}
                        onDragEnd={() => setDraggedCanvasIndex(null)}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-move"
                        style={{ borderLeft: `4px solid ${item.color}` }}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical size={20} className="text-gray-400 hidden md:block" />
                          <div>
                            <div className="font-bold text-gray-800 flex items-center gap-2">
                              <span className="text-2xl">{item.symbol}</span>
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.rowRepeat} row{item.rowRepeat > 1 ? 's' : ''} • {item.difficulty}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Mobile: Up/Down buttons */}
                          <div className="flex flex-col md:hidden">
                            <button
                              onClick={() => moveCanvasItem(index, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded transition-colors ${
                                index === 0
                                  ? 'text-gray-300'
                                  : 'text-blue-500 hover:bg-blue-50'
                              }`}
                            >
                              <ChevronUp size={18} />
                            </button>
                            <button
                              onClick={() => moveCanvasItem(index, 'down')}
                              disabled={index === canvas.length - 1}
                              className={`p-1 rounded transition-colors ${
                                index === canvas.length - 1
                                  ? 'text-gray-300'
                                  : 'text-blue-500 hover:bg-blue-50'
                              }`}
                            >
                              <ChevronDown size={18} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCanvas(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview Pattern Button */}
              {canvas.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowPatternPreview(!showPatternPreview)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-3"
                  >
                    {showPatternPreview ? 'Hide' : 'Preview'} Pattern
                  </button>
                  
                  {showPatternPreview && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
                      <pre className="text-xs whitespace-pre-wrap font-mono">{generatePattern()}</pre>
                    </div>
                  )}
                </div>
              )}

              {canvas.length > 0 && (
                <button
                  onClick={downloadPattern}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-2 font-bold"
                >
                  <Download size={20} />
                  Download Pattern
                </button>
              )}
            </div>
          </div>
        ) : (
          // STEP-BY-STEP MODE
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Progress Indicator */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step}
                    </div>
                    <div className="text-xs mt-2 text-gray-600">
                      {step === 1 && 'Category'}
                      {step === 2 && 'Project'}
                      {step === 3 && 'Yarn'}
                      {step === 4 && 'Stitches'}
                      {step === 5 && 'Download'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1: Choose Category */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">What would you like to make?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(projectCategories).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => selectCategory(key)}
                        className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-300"
                      >
                        <div className="text-4xl mb-2">{category.icon}</div>
                        <div className="font-semibold text-gray-800">{category.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Project */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-2 text-center">
                    {projectCategories[selectedCategoryStep]?.name}
                  </h2>
                  <p className="text-gray-600 text-center mb-6">Choose your project</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {projectCategories[selectedCategoryStep]?.presets.map((presetKey) => {
                      const preset = projectPresets[presetKey];
                      return (
                        <button
                          key={presetKey}
                          onClick={() => selectProject(presetKey)}
                          className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-left"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{preset.examples[0]}</span>
                            <div className="flex-1">
                              <div className="font-bold text-gray-800 mb-1">{preset.name}</div>
                              <div className="text-sm text-gray-600">{preset.info}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={prevStep}
                    className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                </div>
              )}

              {/* Step 3: Choose Yarn Weight */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Choose your yarn weight</h2>
                  <div className="space-y-3">
                    {Object.entries(yarnWeights).map(([key, yarn]) => (
                      <button
                        key={key}
                        onClick={() => selectYarnWeight(key)}
                        className="w-full p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-left"
                      >
                        <div className="font-bold text-gray-800">{yarn.name}</div>
                        <div className="text-sm text-gray-600">
                          {selectedCraft === 'knit' ? yarn.needles : yarn.hooks}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={prevStep}
                    className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                </div>
              )}

              {/* Step 4: Choose Stitches */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Choose your stitches</h2>
                  
                  {/* Knit/Crochet Toggle */}
                  <div className="flex gap-2 mb-6 justify-center">
                    <button
                      onClick={() => setSelectedCraft('knit')}
                      className={`flex-1 max-w-xs px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCraft === 'knit'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🧶 Knitting
                    </button>
                    <button
                      onClick={() => setSelectedCraft('crochet')}
                      className={`flex-1 max-w-xs px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCraft === 'crochet'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🪡 Crochet
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 text-center">Tap stitches to add them • Tap ↑↓ to reorder</p>
                  
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto mb-4">
                    {(stitchLibrary[selectedCraft] || []).map((stitch) => (
                      <div
                        key={stitch.id}
                        onClick={() => handleStitchClick(stitch)}
                        className="p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: stitch.color }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{stitch.symbol}</span>
                          <div>
                            <div className="font-bold text-gray-800">{stitch.name}</div>
                            <div className="text-sm text-gray-600">{stitch.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Canvas */}
                  <div className="border-2 border-purple-200 rounded-lg p-4 min-h-32 mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Your Pattern:</h3>
                    {canvas.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">Tap stitches above to add them</p>
                    ) : (
                      <div className="space-y-2">
                        {canvas.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.symbol}</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <button
                                  onClick={() => moveCanvasItem(index, 'up')}
                                  disabled={index === 0}
                                  className={`p-1 rounded ${
                                    index === 0 ? 'text-gray-300' : 'text-blue-500'
                                  }`}
                                >
                                  <ChevronUp size={16} />
                                </button>
                                <button
                                  onClick={() => moveCanvasItem(index, 'down')}
                                  disabled={index === canvas.length - 1}
                                  className={`p-1 rounded ${
                                    index === canvas.length - 1 ? 'text-gray-300' : 'text-blue-500'
                                  }`}
                                >
                                  <ChevronDown size={16} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCanvas(item.id)}
                                className="p-1 text-red-500"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={finalizePattern}
                      className="flex-1 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Preview & Download */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Your pattern is ready!</h2>
                  
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{generatePattern()}</pre>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={downloadPattern}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-2 font-bold"
                    >
                      <Download size={20} />
                      Download Pattern
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Made with ♥ for the knitting community</p>
          <p className="mt-2">
            <a 
              href="https://forms.gle/FnDRazzz7puzAaLt8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              📝 Help us improve! (2-min survey)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default YarnOverApp;
