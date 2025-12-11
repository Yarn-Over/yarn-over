import React, { useState } from 'react';
import { Download, Plus, Trash2, X, Palette, GripVertical } from 'lucide-react';

const YarnOverApp = () => {
  // Core State
  const [projectName, setProjectName] = useState('My Scarf');
  const [width, setWidth] = useState(40);
  const [selectedCraft, setSelectedCraft] = useState('knit');
  const [canvas, setCanvas] = useState([]);
  const [draggedStitch, setDraggedStitch] = useState(null);
  const [draggedCanvasIndex, setDraggedCanvasIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardCategory, setWizardCategory] = useState('');
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [showPatternPreview, setShowPatternPreview] = useState(false);
  
  // Gauge & Measurements
  const [stitchesPerInch, setStitchesPerInch] = useState(5);
  const [rowsPerInch, setRowsPerInch] = useState(7);
  const [desiredWidth, setDesiredWidth] = useState(8);
  const [desiredLength, setDesiredLength] = useState(60);
  const [selectedPreset, setSelectedPreset] = useState('scarf_standard');
  const [yarnWeight, setYarnWeight] = useState('worsted');

  // Yarn Weights Database (brands removed from pattern output)
  const yarnWeights = {
    fingering: {
      name: 'Fingering',
      needles: 'US 1-3 (2.25-3.25mm)',
      hooks: 'B-E (2.25-3.5mm)',
      stitchesPerInch: 7,
      rowsPerInch: 9
    },
    sport: {
      name: 'Sport',
      needles: 'US 3-5 (3.25-3.75mm)',
      hooks: 'E-G (3.5-4.5mm)',
      stitchesPerInch: 6,
      rowsPerInch: 8
    },
    dk: {
      name: 'DK (Light Worsted)',
      needles: 'US 5-7 (3.75-4.5mm)',
      hooks: 'G-I (4.5-5.5mm)',
      stitchesPerInch: 5.5,
      rowsPerInch: 7.5
    },
    worsted: {
      name: 'Worsted',
      needles: 'US 7-9 (4.5-5.5mm)',
      hooks: 'I-K (5.5-6.5mm)',
      stitchesPerInch: 5,
      rowsPerInch: 7
    },
    bulky: {
      name: 'Bulky',
      needles: 'US 9-11 (5.5-8mm)',
      hooks: 'K-M (6.5-9mm)',
      stitchesPerInch: 4,
      rowsPerInch: 5.5
    },
    super_bulky: {
      name: 'Super Bulky',
      needles: 'US 11-15 (8-10mm)',
      hooks: 'M-Q (9-15mm)',
      stitchesPerInch: 3,
      rowsPerInch: 4
    }
  };

  // Stitch Library
  const stitchLibrary = {
    knit: [
      // BASICS (3 stitches)
      {
        id: 'stockinette',
        name: 'Stockinette Stitch',
        category: 'basics',
        symbol: '⋮',
        color: '#E8F4F8',
        description: 'Classic smooth stitch',
        pattern: ['Row 1 (RS): Knit all stitches', 'Row 2 (WS): Purl all stitches'],
        rowRepeat: 2,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'garter',
        name: 'Garter Stitch',
        category: 'basics',
        symbol: '≡',
        color: '#FFF4E6',
        description: 'Ridged, reversible texture',
        pattern: ['All Rows: Knit all stitches'],
        rowRepeat: 2,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'ribbing',
        name: '2x2 Ribbing',
        category: 'basics',
        symbol: '∥',
        color: '#F0E6FF',
        description: 'Stretchy vertical ribs',
        pattern: ['All Rows: *K2, P2; repeat from * to end'],
        rowRepeat: 1,
        stitchMultiple: 4,
        difficulty: 'beginner'
      },
      // PATTERNED KNITS (12 stitches)
      {
        id: 'seed',
        name: 'Seed Stitch',
        category: 'patterned',
        symbol: '⋅⋅',
        color: '#E6F7E6',
        description: 'Textured bumpy surface',
        pattern: ['Row 1: *K1, P1; repeat from * to end', 'Row 2: *P1, K1; repeat from * to end'],
        rowRepeat: 2,
        stitchMultiple: 2,
        difficulty: 'beginner'
      },
      {
        id: 'moss',
        name: 'Moss Stitch',
        category: 'patterned',
        symbol: '▦',
        color: '#E6F4E6',
        description: 'Checkered texture',
        pattern: [
          'Rows 1-2: *K1, P1; repeat from * to end',
          'Rows 3-4: *P1, K1; repeat from * to end'
        ],
        rowRepeat: 4,
        stitchMultiple: 2,
        difficulty: 'easy'
      },
      {
        id: 'basket_weave',
        name: 'Basket Weave',
        category: 'patterned',
        symbol: '⊞',
        color: '#FFF9E6',
        description: 'Woven texture pattern',
        pattern: [
          'Rows 1-4: *K4, P4; repeat from * to end',
          'Rows 5-8: *P4, K4; repeat from * to end'
        ],
        rowRepeat: 8,
        stitchMultiple: 8,
        difficulty: 'easy'
      },
      {
        id: 'broken_rib',
        name: 'Broken Rib',
        category: 'patterned',
        symbol: '⫿',
        color: '#F5E6FF',
        description: 'Subtle textured ribbing',
        pattern: [
          'Row 1 (RS): *K2, P2; repeat from * to end',
          'Row 2 (WS): Knit all stitches'
        ],
        rowRepeat: 2,
        stitchMultiple: 4,
        difficulty: 'easy'
      },
      {
        id: 'simple_cable',
        name: 'Simple Cable',
        category: 'patterned',
        symbol: '⚭',
        color: '#E6F0FF',
        description: 'Basic rope cable',
        pattern: [
          'Row 1 (RS): P2, K4, P2',
          'Row 2 (WS): K2, P4, K2',
          'Row 3 (RS): P2, C4F (cable 4 front), P2',
          'Row 4 (WS): K2, P4, K2'
        ],
        rowRepeat: 4,
        stitchMultiple: 8,
        difficulty: 'intermediate',
        notes: 'C4F = Slip 2 sts to cable needle, hold in front, K2, K2 from cable needle'
      },
      {
        id: 'rope_cable',
        name: 'Rope Cable',
        category: 'patterned',
        symbol: '⥁',
        color: '#E6EFFF',
        description: 'Twisted rope effect',
        pattern: [
          'Row 1 (RS): P4, K6, P4',
          'Row 2 (WS): K4, P6, K4',
          'Row 3 (RS): P4, C6F, P4',
          'Row 4 (WS): K4, P6, K4',
          'Rows 5-6: Repeat Rows 1-2'
        ],
        rowRepeat: 6,
        stitchMultiple: 14,
        difficulty: 'intermediate',
        notes: 'C6F = Slip 3 sts to cable needle, hold in front, K3, K3 from cable needle'
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
          'Row 9: *C4B, C4F; repeat from * to end',
          'Rows 10, 12, 14, 16 (WS): *P4, K4; repeat from * to end',
          'Rows 11, 13, 15 (RS): *P4, K4; repeat from * to end',
          'Row 17: *C4F, C4B; repeat from * to end'
        ],
        rowRepeat: 16,
        stitchMultiple: 8,
        difficulty: 'advanced',
        notes: 'C4B/C4F = Cable 4 back/front'
      },
      {
        id: 'horseshoe_cable',
        name: 'Horseshoe Cable',
        category: 'patterned',
        symbol: '⊃',
        color: '#E6F5FF',
        description: 'U-shaped cable design',
        pattern: [
          'Row 1 (RS): P2, K8, P2',
          'Row 2 (WS): K2, P8, K2',
          'Row 3: P2, C4B, C4F, P2',
          'Row 4: K2, P8, K2',
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
          'Row 3 (RS): *[K2tog] 3 times, [YO, K1] 6 times, [K2tog] 3 times; repeat from * to end',
          'Row 4 (WS): Knit all stitches'
        ],
        rowRepeat: 4,
        stitchMultiple: 18,
        difficulty: 'intermediate'
      },
      {
        id: 'chevron_lace',
        name: 'Chevron Lace',
        category: 'patterned',
        symbol: '∧',
        color: '#F8F0FF',
        description: 'Zigzag lace design',
        pattern: [
          'Row 1 (RS): *K1, YO, K2, SSK, K2tog, K2, YO; repeat from * to end',
          'Row 2 (WS): Purl all stitches',
          'Row 3 (RS): *K2, YO, K1, SSK, K2tog, K1, YO, K1; repeat from * to end',
          'Row 4 (WS): Purl all stitches'
        ],
        rowRepeat: 4,
        stitchMultiple: 10,
        difficulty: 'intermediate',
        notes: 'SSK = Slip, Slip, Knit'
      },
      {
        id: 'waffle',
        name: 'Waffle Stitch',
        category: 'patterned',
        symbol: '⊞',
        color: '#FFF5E6',
        description: 'Thick, textured fabric',
        pattern: [
          'Row 1 (RS): *K1, P1; repeat from * to end',
          'Row 2 (WS): *K1, P1; repeat from * to end',
          'Row 3 (RS): *P1, K1; repeat from * to end',
          'Row 4 (WS): *P1, K1; repeat from * to end'
        ],
        rowRepeat: 4,
        stitchMultiple: 2,
        difficulty: 'easy'
      }
    ],
    crochet: [
      {
        id: 'single_crochet',
        name: 'Single Crochet',
        category: 'basics',
        symbol: '+',
        color: '#E8F4F8',
        description: 'Basic dense stitch',
        pattern: ['All Rows: Single crochet in each stitch across'],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'double_crochet',
        name: 'Double Crochet',
        category: 'basics',
        symbol: 'T',
        color: '#FFF4E6',
        description: 'Taller, looser stitch',
        pattern: ['All Rows: Double crochet in each stitch across'],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner'
      },
      {
        id: 'granny_square',
        name: 'Granny Square',
        category: 'patterned',
        symbol: '□',
        color: '#FFE6F0',
        description: 'Classic square motif',
        pattern: [
          'Round 1: Ch 4, 2 DC in ring, Ch 2, [3 DC, Ch 2] 3 times, join',
          'Round 2: Sl st to corner, Ch 3, 2 DC in same space, Ch 1, *[3 DC, Ch 2, 3 DC] in corner, Ch 1; repeat from *'
        ],
        rowRepeat: 2,
        stitchMultiple: 1,
        difficulty: 'intermediate'
      }
    ]
  };

  // Categories
  const categories = {
    all: 'All Stitches',
    basics: 'Basic Stitches',
    patterned: 'Patterned Knits'
  };

  // Project Categories for Step-by-Step
  const projectCategories = {
    scarves: { name: 'Scarves & Cowls', icon: '🧣', presets: ['scarf_standard', 'scarf_kids', 'scarf_extra_long', 'scarf_infinity', 'cowl', 'cowl_infinity', 'cowl_chunky', 'scarf_infinity_gift'] },
    hats: { name: 'Hats & Headwear', icon: '🧢', presets: ['beanie', 'beanie_brim', 'beanie_slouchy', 'headband'] },
    accessories: { name: 'Accessories', icon: '🧤', presets: ['fingerless_gloves', 'leg_warmers', 'hand_warmers'] },
    home: { name: 'Home Goods', icon: '🏠', presets: ['dishcloth', 'potholder', 'placemat', 'coaster_set', 'pillow_cover', 'table_runner', 'hanging_towel'] },
    blankets: { name: 'Blankets', icon: '🛋️', presets: ['baby_blanket', 'throw_blanket'] },
    bags: { name: 'Bags & Cases', icon: '👜', presets: ['market_bag', 'project_bag', 'laptop_sleeve', 'tablet_case', 'phone_sock'] },
    shawls: { name: 'Shawls & Wraps', icon: '🧶', presets: ['shawl_small', 'shawl_large'] },
    seasonal: { name: 'Seasonal', icon: '🎄', presets: ['christmas_stocking'] },
    quick: { name: 'Quick Projects', icon: '⚡', presets: ['bookmark', 'wash_mitt', 'cup_cozy', 'yoga_mat_strap'] }
  };

  // Project Presets with Descriptions
  const projectPresets = {
    scarf_standard: { name: "Standard Scarf", width: 8, length: 60, info: "A classic scarf that never goes out of style! This size works for most adults (about 8\" wide × 60\" long). Perfect for using up yarn stash or trying a new stitch pattern!", examples: ['🧣'] },
    scarf_kids: { name: "Kid's Scarf", width: 5, length: 48, info: "Perfect for the little ones in your life! Sized for kids ages 3-12 (about 5\" wide × 48\" long). Shorter and narrower makes it less overwhelming to knit and more comfortable for small necks.", examples: ['🧣'] },
    scarf_extra_long: { name: "Extra Long Scarf", width: 8, length: 84, info: "For those who love to wrap up! This generous scarf (8\" × 84\") can be wrapped multiple times for maximum coziness. Great for cold climates!", examples: ['🧣'] },
    scarf_infinity: { name: "Infinity Scarf (Cowl Style)", width: 12, length: 60, info: "A trendy loop scarf that stays put! Join the ends to create a cozy circle (12\" × 60\" before seaming). No more adjusting your scarf all day!", examples: ['🧣'] },
    shawl_small: { name: "Small Shawl/Shawlette", width: 48, length: 24, info: "A delicate shoulder wrap perfect for dressy occasions! This smaller shawl (48\" × 24\") adds elegance without overwhelming your outfit. Great first shawl project!", examples: ['🧶'] },
    shawl_large: { name: "Large Shawl/Wrap", width: 72, length: 36, info: "The ultimate cozy wrap! This generous shawl (72\" × 36\") can be draped, wrapped, or worn as a blanket scarf. A true labor of love that's worth every stitch!", examples: ['🧶'] },
    cowl: { name: "Standard Cowl", width: 24, length: 12, info: "A snug neck warmer that's quicker than a scarf! This cowl (24\" circumference × 12\" tall) is knit in the round for no seaming. Perfect weekend project!", examples: ['🧣'] },
    cowl_infinity: { name: "Infinity Cowl (Long)", width: 48, length: 12, info: "A versatile loop scarf! At 48\" around, this can be worn as a single loop or doubled for extra warmth. Great for layering!", examples: ['🧣'] },
    cowl_chunky: { name: "Chunky Cowl", width: 22, length: 14, info: "Quick knit in bulky yarn! This chunky cowl (22\" × 14\") works up in just a few hours. Perfect for last-minute gifts or instant gratification!", examples: ['🧣'] },
    beanie: { name: "Basic Beanie", width: 9, length: 8, info: "A classic hat that never goes out of style! This beanie has a folded brim for extra warmth and a slightly slouchy crown. Fits most adults (21-23\" head). Perfect for trying new stitch patterns!", examples: ['🧢'] },
    beanie_brim: { name: "Beanie with Extra Brim", width: 9, length: 10, info: "Extra cozy with a deep folded brim! The extended cuff (10\" tall) means more warmth for your ears. Great for cold climates or just looking super snuggly!", examples: ['🧢'] },
    beanie_slouchy: { name: "Slouchy Beanie", width: 10, length: 12, info: "Laid-back style with room to spare! This slouchy beanie has extra length for that relaxed, fashionable drape. Popular with all ages!", examples: ['🧢'] },
    headband: { name: "Headband/Ear Warmer", width: 4, length: 18, info: "Quick knit for keeping ears warm! This headband (4\" × 18\") is perfect for those days when a full hat is too much. Great project for using leftover yarn!", examples: ['👑'] },
    fingerless_gloves: { name: "Fingerless Gloves", width: 7, length: 8, info: "Stay warm while texting! These fingerless gloves (7\" circumference × 8\" long) keep hands cozy while leaving fingers free. Perfect for writers, artists, or anyone who needs dexterity!", examples: ['🧤'] },
    dishcloth: { name: "Dishcloth", width: 8, length: 8, info: "Practical and pretty! A handmade dishcloth (8\" × 8\") is perfect for learning new stitches. Use cotton yarn for best absorption. Great gifts!", examples: ['🧽'] },
    potholder: { name: "Potholder/Hot Pad", width: 8, length: 8, info: "Protect your counters in style! This potholder (8\" × 8\") uses double-thick cotton for heat protection. Add a hanging loop for convenience!", examples: ['🧽'] },
    placemat: { name: "Placemat", width: 12, length: 18, info: "Dress up your table! A handmade placemat (12\" × 18\") adds personality to any meal. Use washable cotton for easy care.", examples: ['🍽️'] },
    coaster_set: { name: "Coaster (Set of 4)", width: 4, length: 4, info: "Tiny but mighty! These coasters (4\" × 4\") are quick to make and perfect for gifts. Knit a set of 4-6 in coordinating colors!", examples: ['☕'] },
    pillow_cover: { name: "Pillow Cover", width: 16, length: 16, info: "Cozy up your space! This pillow cover (16\" × 16\") is knit flat and seamed, or can be knit in the round with an envelope closure. Choose a stitch that looks good on both sides!", examples: ['🛋️'] },
    table_runner: { name: "Table Runner", width: 14, length: 48, info: "Elegant table decor! This runner (14\" × 48\") is perfect for dining tables or sideboards. Lace stitches look especially beautiful for this project!", examples: ['🍽️'] },
    hanging_towel: { name: "Hanging Kitchen Towel", width: 12, length: 16, info: "Functional and decorative! Add a button loop at the top to hang from your oven door. Use absorbent cotton yarn. A thoughtful handmade gift!", examples: ['🧺'] },
    baby_blanket: { name: "Baby Blanket", width: 36, length: 36, info: "Welcome a new little one! This baby blanket (36\" × 36\") is the perfect size for a car seat, stroller, or crib. Choose soft, washable yarn - babies are messy! A treasured handmade gift.", examples: ['👶'] },
    throw_blanket: { name: "Throw Blanket/Afghan", width: 50, length: 60, info: "The ultimate cozy project! This throw (50\" × 60\") is perfect for couches, beds, or snuggling. It's a commitment (100+ hours) but so worth it. Great for using up a yarn stash!", examples: ['🛋️'] },
    market_bag: { name: "Market/Tote Bag", width: 14, length: 16, info: "Eco-friendly shopping in style! This sturdy tote (14\" × 16\") is perfect for groceries, books, or beach trips. Use tight stitches so things don't fall through!", examples: ['🛍️'] },
    project_bag: { name: "Project Bag (Small)", width: 10, length: 12, info: "Keep your knitting organized! This drawstring bag (10\" × 12\") is perfect for storing yarn and projects. Knitters making things for knitters - so meta!", examples: ['👜'] },
    laptop_sleeve: { name: "Laptop Sleeve", width: 12, length: 16, info: "Protect your tech with style! This padded sleeve (12\" × 16\") fits most 13\" laptops. Use tight stitches and consider adding a liner for extra cushioning.", examples: ['💻'] },
    tablet_case: { name: "Tablet/iPad Case", width: 8, length: 10, info: "Keep your tablet safe! This case (8\" × 10\") fits standard tablets. Add a button or zipper closure to keep it secure. Great gift for tech-loving friends!", examples: ['📱'] },
    phone_sock: { name: "Phone Sock/Cozy", width: 3, length: 6, info: "Tiny project, big impact! This phone cozy (3\" × 6\") protects your screen from scratches. Quick to knit - makes a great last-minute gift!", examples: ['📱'] },
    christmas_stocking: { name: "Christmas Stocking", width: 8, length: 18, info: "A holiday tradition! This stocking (8\" wide × 18\" long) is large enough for plenty of treats. Knit in festive colors or classic neutrals. Start in summer so it's ready for December!", examples: ['🎄'] },
    scarf_infinity_gift: { name: "Infinity Scarf (Gift Size)", width: 10, length: 50, info: "The perfect gift scarf! This size (10\" × 50\") works for most adults and knits up relatively quickly. Join ends to create a cozy loop that anyone will love!", examples: ['🎁'] },
    bookmark: { name: "Bookmark", width: 2, length: 8, info: "Perfect for beginners or using up scraps! This bookmark (2\" × 8\") takes less than an hour to make. Add a tassel for extra flair. Great for book club gifts!", examples: ['📚'] },
    wash_mitt: { name: "Bath/Wash Mitt", width: 8, length: 10, info: "Spa vibes at home! This mitt (8\" × 10\") is knit flat and seamed, leaving one end open for your hand. Use cotton for the shower or wool for a cozy handwarmer!", examples: ['🧼'] },
    leg_warmers: { name: "Leg Warmers", width: 12, length: 16, info: "80s style or practical warmth! These leg warmers (12\" circumference × 16\" long) are knit in the round like tall socks. Perfect for dancers, yoga, or just lounging!", examples: ['🧦'] },
    hand_warmers: { name: "Hand Warmers (Pair)", width: 8, length: 4, info: "Tiny pockets of warmth! These quick projects (8\" × 4\" each) are knit flat and seamed into tubes. Make a pair in an evening. Great stocking stuffers!", examples: ['🧤'] },
    cup_cozy: { name: "Cup Cozy/Sleeve", width: 10, length: 4, info: "Protect your hands from hot drinks! This cozy (10\" × 4\") wraps around your morning coffee. Add a button closure or leave it as a simple sleeve. Five-star gift for coffee lovers!", examples: ['☕'] },
    yoga_mat_strap: { name: "Yoga Mat Strap", width: 3, length: 40, info: "Carry your mat in style! This strap (3\" × 40\") can be adjusted with buckles or simply tied. Use strong yarn like cotton or acrylic. Namaste!", examples: ['🧘'] }
  };

  // Functions
  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    const preset = projectPresets[presetKey];
    setDesiredWidth(preset.width);
    setDesiredLength(preset.length);
    setProjectName(preset.name);
    setShowProjectInfo(true);
    
    const currentYarn = yarnWeights[yarnWeight];
    setStitchesPerInch(currentYarn.stitchesPerInch);
    setRowsPerInch(currentYarn.rowsPerInch);
    setWidth(Math.ceil(preset.width * currentYarn.stitchesPerInch * 1.15));
  };

  const handleYarnWeightChange = (weightKey) => {
    setYarnWeight(weightKey);
    const yarn = yarnWeights[weightKey];
    setStitchesPerInch(yarn.stitchesPerInch);
    setRowsPerInch(yarn.rowsPerInch);
    setWidth(Math.ceil(desiredWidth * yarn.stitchesPerInch * 1.15));
  };

  const handleDragStart = (stitch) => {
    setDraggedStitch(stitch);
  };

  const handleCanvasDragStart = (index) => {
    setDraggedCanvasIndex(index);
  };

  const handleCanvasDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCanvasIndex === null) return;
    
    if (draggedCanvasIndex !== index) {
      const newCanvas = [...canvas];
      const draggedItem = newCanvas[draggedCanvasIndex];
      newCanvas.splice(draggedCanvasIndex, 1);
      newCanvas.splice(index, 0, draggedItem);
      setCanvas(newCanvas);
      setDraggedCanvasIndex(index);
    }
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

  // Pattern Generation with prettier formatting
  const generatePattern = () => {
    const craftType = selectedCraft === 'knit' ? 'Knitting' : 'Crochet';
    const preset = projectPresets[selectedPreset];
    const yarn = yarnWeights[yarnWeight];
    const isInRound = ['beanie', 'beanie_brim', 'beanie_slouchy', 'cowl', 'cowl_infinity', 'cowl_chunky', 'fingerless_gloves'].some(key => selectedPreset.includes(key));
    
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
    
    pattern += `════════════════════════════════════════════════════════════════\n`;
    pattern += `LET'S GET STARTED!\n`;
    pattern += `════════════════════════════════════════════════════════════════\n\n`;
    
    if (isInRound) {
      pattern += `Cast on ${width} stitches and join in the round, being careful not to\n`;
      pattern += `twist your stitches. Place a stitch marker to mark the beginning of\n`;
      pattern += `the round.\n\n`;
    } else {
      pattern += `Cast on ${width} stitches.\n\n`;
    }
    
    pattern += `THE PATTERN:\n\n`;
    
    if (canvas.length === 0) {
      pattern += `Choose your stitch pattern from the designer and add it to create\n`;
      pattern += `your custom pattern!\n\n`;
    } else {
      canvas.forEach((section, index) => {
        const sectionName = section.sectionName || `Section ${index + 1}`;
        
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
        
        // Timing guidance
        if (selectedPreset.includes('beanie') || selectedPreset.includes('hat')) {
          if (sectionName.toLowerCase().includes('brim') || index === 0) {
            pattern += `Work in pattern for 2-3 inches (approximately 20-25 ${isInRound ? 'rounds' : 'rows'}).\n`;
            pattern += `This section takes about 30-45 minutes.\n\n`;
            pattern += `💡 Tip: Try on as you go! Everyone's head is different.\n\n`;
          } else if (sectionName.toLowerCase().includes('body') || index === 1) {
            pattern += `Continue in pattern until body measures 5-6 inches from brim\n`;
            pattern += `(approximately 45-50 ${isInRound ? 'rounds' : 'rows'}). This section takes\n`;
            pattern += `about 2-3 hours.\n\n`;
            pattern += `Your hat should measure about 7-8 inches total before starting decreases.\n\n`;
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
          pattern += `${isInRound ? 'rounds' : 'rows'}).\n`;
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
    }
    
    pattern += `════════════════════════════════════════════════════════════════\n`;
    pattern += `FINISHING TOUCHES\n`;
    pattern += `════════════════════════════════════════════════════════════════\n\n`;
    pattern += `You're almost done! Here's how to finish up:\n\n`;
    pattern += `1. Bind off all stitches loosely (you want this edge to have some\n`;
    pattern += `   stretch)\n`;
    pattern += `2. Weave in all your ends with a tapestry needle\n`;
    if (selectedPreset.includes('scarf_infinity') || selectedPreset.includes('cowl_infinity')) {
      pattern += `3. Seam the short ends together to create a loop (use mattress\n`;
      pattern += `   stitch for invisible seam)\n`;
    }
    if (selectedPreset.includes('beanie') || selectedPreset.includes('hat')) {
      pattern += `3. If you like, add a pompom to the top!\n`;
    }
    pattern += `${selectedPreset.includes('infinity') ? '4' : '3'}. Optional but recommended: Block your finished piece gently to\n`;
    pattern += `   even out stitches\n`;
    pattern += `   (Blocking helps even out your stitches and really makes your\n`;
    pattern += `   work shine!)\n\n`;
    
    pattern += `════════════════════════════════════════════════════════════════\n\n`;
    pattern += `Congratulations! You made a beautiful ${projectName}! 🎉\n\n`;
    pattern += `Created with ♥ using Yarn Over (yarnover.app)\n`;
    pattern += `Happy making! 🧶\n`;
    
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
  };

  // Beginner Mode Wizard with Categories
  if (beginnerMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl">🧶</span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Yarn Over</h1>
            </div>
            <p className="text-slate-600">Step-by-Step Pattern Designer</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`flex-1 h-2 mx-1 rounded ${wizardStep >= step ? 'bg-blue-500' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">Step {wizardStep} of 5</p>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            {wizardStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">What type of project?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(projectCategories).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setWizardCategory(key);
                        setWizardStep(2);
                      }}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                    >
                      <div className="text-4xl mb-2">{cat.icon}</div>
                      <div className="text-sm font-semibold text-gray-700">{cat.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div>
                <button
                  onClick={() => setWizardStep(1)}
                  className="mb-4 text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Back to categories
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose your {projectCategories[wizardCategory]?.name.toLowerCase()}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {projectCategories[wizardCategory]?.presets.map(presetKey => {
                    const preset = projectPresets[presetKey];
                    return (
                      <button
                        key={presetKey}
                        onClick={() => {
                          handlePresetChange(presetKey);
                          setWizardStep(3);
                        }}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{preset.examples[0]}</div>
                          <div>
                            <div className="text-sm font-semibold text-gray-700">{preset.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{preset.width}\" × {preset.length}\"</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">What yarn will you use?</h2>
                <div className="space-y-3">
                  {Object.entries(yarnWeights).map(([key, yarn]) => (
                    <button
                      key={key}
                      onClick={() => {
                        handleYarnWeightChange(key);
                        setWizardStep(4);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="font-bold text-gray-800">{yarn.name}</div>
                      <div className="text-sm text-gray-600">Needles: {yarn.needles}</div>
                      <div className="text-sm text-gray-500">Gauge: {yarn.stitchesPerInch} sts/inch</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose your stitch pattern</h2>
                
                {/* Knit/Crochet Toggle */}
                <div className="flex gap-2 mb-4 justify-center">
                  <button
                    onClick={() => setSelectedCraft('knit')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedCraft === 'knit'
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🧶 Knitting
                  </button>
                  <button
                    onClick={() => setSelectedCraft('crochet')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedCraft === 'crochet'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🪡 Crochet
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">Drag a stitch below to get started!</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 max-h-64 overflow-y-auto">
                  {getFilteredStitches().map(stitch => (
                    <div
                      key={stitch.id}
                      draggable
                      onDragStart={() => handleDragStart(stitch)}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all cursor-move text-center"
                      style={{ backgroundColor: stitch.color }}
                    >
                      <div className="text-3xl mb-2">{stitch.symbol}</div>
                      <div className="text-sm font-semibold text-gray-700">{stitch.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{stitch.difficulty}</div>
                    </div>
                  ))}
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-4 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 min-h-[200px] flex flex-col items-center justify-center"
                >
                  {canvas.length === 0 ? (
                    <div className="text-gray-500">
                      <Plus size={48} className="mx-auto mb-2 text-blue-400" />
                      <p>Drag a stitch here to add it to your pattern</p>
                    </div>
                  ) : (
                    <div className="w-full space-y-2">
                      {canvas.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                          <span className="font-semibold">{item.name}</span>
                          <button onClick={() => removeFromCanvas(item.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {canvas.length > 0 && (
                  <button
                    onClick={() => setWizardStep(5)}
                    className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Continue to Download
                  </button>
                )}
              </div>
            )}

            {wizardStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Your pattern is ready!</h2>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-2">Pattern Summary:</p>
                  <p className="text-gray-600">Project: {projectName}</p>
                  <p className="text-gray-600">Yarn: {yarnWeights[yarnWeight].name}</p>
                  <p className="text-gray-600">Stitches: {canvas.map(s => s.name).join(', ') || 'None yet'}</p>
                </div>
                
                {/* Preview Pattern */}
                <button
                  onClick={() => setShowPatternPreview(!showPatternPreview)}
                  className="w-full mb-4 px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                >
                  {showPatternPreview ? 'Hide' : 'Preview'} Pattern
                </button>
                
                {showPatternPreview && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{generatePattern()}</pre>
                  </div>
                )}
                
                <button
                  onClick={downloadPattern}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <Download size={24} />
                  Download Pattern
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            {wizardStep > 1 && wizardStep !== 2 && (
              <button
                onClick={() => setWizardStep(wizardStep - 1)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => setBeginnerMode(false)}
              className="ml-auto px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Switch to Advanced Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Advanced Mode (Main App)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-5xl">🧶</span>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800">Yarn Over</h1>
          </div>
          <p className="text-lg text-slate-600 mb-4">Design Your Dream Pattern in Minutes</p>
          <div className="flex items-center gap-4 flex-wrap justify-center text-sm text-slate-600 mb-6">
            <span>✓ Easy Pattern Designer</span>
            <span>✓ 15+ Stitches</span>
            <span>✓ 33 Project Types</span>
            <span>✓ Instant Download</span>
          </div>
          <div className="text-center">
            <button
              onClick={() => setBeginnerMode(!beginnerMode)}
              className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
            >
              {beginnerMode ? '🚀 Try Advanced Mode' : '✨ Switch to Step-by-Step'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Type */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🎯</span> Project Type
              </h2>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-700"
              >
                {Object.entries(projectPresets).map(([key, preset]) => (
                  <option key={key} value={key}>{preset.name}</option>
                ))}
              </select>
              
              {/* Project Info */}
              {showProjectInfo && (
                <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-800 text-sm">
                      About {projectPresets[selectedPreset].name}
                    </h4>
                    <button onClick={() => setShowProjectInfo(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{projectPresets[selectedPreset].info}</p>
                </div>
              )}
            </div>

            {/* Yarn Weight */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🧶</span> Yarn Weight
              </h2>
              <div className="space-y-3">
                {Object.entries(yarnWeights).map(([key, yarn]) => (
                  <button
                    key={key}
                    onClick={() => handleYarnWeightChange(key)}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                      yarnWeight === key 
                        ? 'border-blue-500 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-gray-800">{yarn.name}</div>
                    <div className="text-sm text-gray-600">Needles: {yarn.needles}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Gauge: {yarn.stitchesPerInch} sts/inch
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gauge Adjuster */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>📏</span> Gauge Adjuster
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stitches per inch
                  </label>
                  <input
                    type="number"
                    value={stitchesPerInch}
                    onChange={(e) => setStitchesPerInch(Number(e.target.value))}
                    step="0.5"
                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rows per inch
                  </label>
                  <input
                    type="number"
                    value={rowsPerInch}
                    onChange={(e) => setRowsPerInch(Number(e.target.value))}
                    step="0.5"
                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={recalculateGauge}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                >
                  Recalculate Width
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Current cast-on: {width} stitches
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column - Stitch Library */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>📚</span> Stitch Library
              </h2>
              
              {/* Knit/Crochet Toggle */}
              <div className="flex gap-2 mb-4 justify-center">
                <button
                  onClick={() => setSelectedCraft('knit')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCraft === 'knit'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🧶 Knitting
                </button>
                <button
                  onClick={() => setSelectedCraft('crochet')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCraft === 'crochet'
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🪡 Crochet
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {Object.entries(categories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      selectedCategory === key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Stitch Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {getFilteredStitches().map(stitch => (
                  <div
                    key={stitch.id}
                    draggable
                    onDragStart={() => handleDragStart(stitch)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all cursor-move"
                    style={{ backgroundColor: stitch.color }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{stitch.symbol}</div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">{stitch.name}</div>
                      <div className="text-xs text-gray-500">{stitch.difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Canvas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span>✨</span> Your Pattern
                </h2>
                {canvas.length > 0 && (
                  <button
                    onClick={clearCanvas}
                    className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-4 border-dashed border-blue-300 rounded-xl p-6 min-h-[400px] bg-blue-50 mb-4"
              >
                {canvas.length === 0 ? (
                  <div className="text-center text-gray-400 py-20">
                    <Plus size={64} className="mx-auto mb-4 text-blue-300" />
                    <p className="text-lg">Drag stitches here to build your pattern</p>
                    <p className="text-sm mt-2">Drag to reorder!</p>
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
                          <GripVertical size={20} className="text-gray-400" />
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
                        <button
                          onClick={() => removeFromCanvas(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview Pattern Button */}
              {canvas.length > 0 && (
                <button
                  onClick={() => setShowPatternPreview(!showPatternPreview)}
                  className="w-full mb-3 py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-slate-500 text-white hover:bg-slate-600 transition-all"
                >
                  {showPatternPreview ? 'Hide' : 'Preview'} Pattern
                </button>
              )}

              {/* Pattern Preview */}
              {showPatternPreview && canvas.length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto border-2 border-gray-200">
                  <pre className="text-xs whitespace-pre-wrap font-mono">{generatePattern()}</pre>
                </div>
              )}

              {/* Download Button */}
              <button
                onClick={downloadPattern}
                disabled={canvas.length === 0}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  canvas.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                }`}
              >
                <Download size={24} />
                Download Pattern
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Made with ♥ for the knitting community</p>
          <p className="mt-1">
            <a href="https://forms.gle/FnDRazzz7puzAaLt8" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
              📝 Help us improve! (2-min survey)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default YarnOverApp;
