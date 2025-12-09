import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, Download, Trash2, Plus, Info, Ruler, Eye, Palette, Play, X, Youtube, Image } from 'lucide-react';

const YarnOverApp = () => {
  const [projectName, setProjectName] = useState('My Scarf');
  const [width, setWidth] = useState(40);
  const [selectedCraft, setSelectedCraft] = useState('knit');
  const [canvas, setCanvas] = useState([]);
  const [colorwork, setColorwork] = useState({
    enabled: false,
    type: 'stripes', // 'stripes' or 'fairisle'
    colors: ['Main Color'],
    pattern: []
  });
  const [draggedStitch, setDraggedStitch] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [exampleGalleryOpen, setExampleGalleryOpen] = useState(false);
  const [currentPresetExamples, setCurrentPresetExamples] = useState([]);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [wizardStep, setWizardStep] = useState(1);
  
  // Pattern Builder state
  const [patternBuilderOpen, setPatternBuilderOpen] = useState(false);
  const [customPatterns, setCustomPatterns] = useState([]);
  const [buildingPattern, setBuildingPattern] = useState({
    name: '',
    rows: [],
    difficulty: 'intermediate',
    category: 'custom'
  });
  const [currentRow, setCurrentRow] = useState('');
  
  // Gauge calculator state
  const [stitchesPerInch, setStitchesPerInch] = useState(5);
  const [rowsPerInch, setRowsPerInch] = useState(7);
  const [desiredWidth, setDesiredWidth] = useState(8); // inches
  const [desiredLength, setDesiredLength] = useState(60); // inches
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [yarnWeight, setYarnWeight] = useState('worsted');
  
  // Yarn weight reference guide with shopping and substitution info
  const yarnWeights = {
    lace: {
      name: 'Lace / Fingering',
      number: '0-1',
      needles: 'US 1-3 (2.25-3.25mm)',
      hooks: 'B/1-E/4 (2.25-3.5mm)',
      gauge: '7-8 sts/inch',
      stitchesPerInch: 7.5,
      rowsPerInch: 10,
      description: 'Very fine yarn for lace and delicate projects',
      emoji: '🧵',
      yardsPerStitch: 0.04,
      thickness: 1,
      substitutes: ['Hold 2 strands of sewing thread', 'Crochet thread'],
      popularBrands: ['Malabrigo Lace', 'Knit Picks Gloss Lace', 'Cascade Heritage Silk'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=lace+weight+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/lace-weight-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/lace'
      }
    },
    fingering: {
      name: 'Fingering / Sock',
      number: '1',
      needles: 'US 1-3 (2.25-3.25mm)',
      hooks: 'B/1-E/4 (2.25-3.5mm)',
      gauge: '7-8 sts/inch',
      stitchesPerInch: 7.5,
      rowsPerInch: 10,
      description: 'Fine yarn for socks and lightweight garments',
      emoji: '🧦',
      yardsPerStitch: 0.04,
      thickness: 1.5,
      substitutes: ['Lace held double', 'Embroidery floss (multiple strands)'],
      popularBrands: ['Regia Sock Yarn', 'Patons Kroy Socks', 'Red Heart With Love'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=fingering+weight+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/fingering-weight-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/fingering'
      }
    },
    sport: {
      name: 'Sport / Baby',
      number: '2',
      needles: 'US 3-5 (3.25-3.75mm)',
      hooks: 'E/4-7 (3.5-4.5mm)',
      gauge: '6-7 sts/inch',
      stitchesPerInch: 6.5,
      rowsPerInch: 8.5,
      description: 'Light yarn for baby items and light garments',
      emoji: '👶',
      yardsPerStitch: 0.045,
      thickness: 2,
      substitutes: ['2 strands of fingering held together', 'DK on smaller needles'],
      popularBrands: ['Lion Brand Baby Soft', 'Cascade 220 Sport', 'Bernat Softee Baby'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=sport+weight+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/sport-weight-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/sport'
      }
    },
    dk: {
      name: 'DK / Light Worsted',
      number: '3',
      needles: 'US 5-7 (3.75-4.5mm)',
      hooks: '7-I/9 (4.5-5.5mm)',
      gauge: '5.5-6 sts/inch',
      stitchesPerInch: 5.75,
      rowsPerInch: 7.5,
      description: 'Versatile weight for most projects',
      emoji: '🧶',
      yardsPerStitch: 0.05,
      thickness: 2.5,
      substitutes: ['Sport held double', 'Worsted on smaller needles'],
      popularBrands: ['Cascade 220 Superwash', 'Patons Classic Wool DK', 'Lion Brand Pound of Love'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=dk+weight+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/dk-weight-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/dk'
      }
    },
    worsted: {
      name: 'Worsted / Aran',
      number: '4',
      needles: 'US 7-9 (4.5-5.5mm)',
      hooks: 'I/9-K/10.5 (5.5-6.5mm)',
      gauge: '4.5-5 sts/inch',
      stitchesPerInch: 5,
      rowsPerInch: 7,
      description: 'Most common weight, great for scarves and afghans',
      emoji: '🧣',
      yardsPerStitch: 0.06,
      thickness: 3,
      substitutes: ['2 strands of DK held together', 'Aran weight (nearly identical)'],
      popularBrands: ['Red Heart Super Saver', 'Lion Brand Wool-Ease', 'Caron Simply Soft'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=worsted+weight+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/worsted-weight-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/worsted'
      }
    },
    bulky: {
      name: 'Bulky / Chunky',
      number: '5',
      needles: 'US 9-11 (5.5-8mm)',
      hooks: 'K/10.5-M/13 (6.5-9mm)',
      gauge: '3.5-4 sts/inch',
      stitchesPerInch: 3.75,
      rowsPerInch: 5,
      description: 'Quick projects with thick, cozy yarn',
      emoji: '🧤',
      yardsPerStitch: 0.075,
      thickness: 4,
      substitutes: ['2 strands of worsted held together', 'Aran held double'],
      popularBrands: ['Lion Brand Hometown USA', 'Bernat Blanket', 'Red Heart Grande'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=bulky+weight+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/bulky-weight-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/bulky'
      }
    },
    super_bulky: {
      name: 'Super Bulky',
      number: '6',
      needles: 'US 11-17 (8-12.75mm)',
      hooks: 'M/13-Q (9-16mm)',
      gauge: '2.5-3 sts/inch',
      stitchesPerInch: 2.75,
      rowsPerInch: 4,
      description: 'Very thick yarn for ultra-quick projects',
      emoji: '🎿',
      yardsPerStitch: 0.1,
      thickness: 5,
      substitutes: ['2-3 strands of worsted held together', 'Bulky held double'],
      popularBrands: ['Lion Brand Wool-Ease Thick & Quick', 'Bernat Blanket Big', 'Red Heart Grande'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=super+bulky+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/super-bulky-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/super-bulky'
      }
    },
    jumbo: {
      name: 'Jumbo',
      number: '7',
      needles: 'US 17+ (12.75mm+)',
      hooks: 'Q+ (16mm+)',
      gauge: '2 sts/inch or fewer',
      stitchesPerInch: 2,
      rowsPerInch: 3,
      description: 'Extra thick yarn for dramatic projects',
      emoji: '🏔️',
      yardsPerStitch: 0.15,
      thickness: 6,
      substitutes: ['3-4 strands of worsted held together', '2 strands of bulky'],
      popularBrands: ['Bernat Mega Bulky', 'Lion Brand Wool-Ease Tonal', 'Loops & Threads Cozy Wool'],
      shoppingLinks: {
        amazon: 'https://www.amazon.com/s?k=jumbo+weight+yarn',
        lionbrand: 'https://www.lionbrand.com/collections/jumbo-yarn',
        knitpicks: 'https://www.knitpicks.com/yarn/jumbo'
      }
    }
  };

  // Project presets with example galleries
  // Project Structure Templates
  const projectStructures = {
    // SCARVES - Simple repeating patterns
    scarf_standard: {
      maxSections: 3,
      template: [
        { name: 'Main Pattern', type: 'repeating', required: true, suggestion: 'Choose your favorite stitch - this will repeat for the entire scarf' }
      ],
      shaping: null
    },
    scarf_kids: {
      maxSections: 3,
      template: [
        { name: 'Main Pattern', type: 'repeating', required: true }
      ]
    },
    scarf_extra_long: {
      maxSections: 4,
      template: [
        { name: 'Border (Optional)', type: 'edge', suggestion: 'Try garter or seed stitch for edges' },
        { name: 'Main Pattern Section 1', type: 'main', required: true },
        { name: 'Main Pattern Section 2', type: 'main' },
        { name: 'Border (Optional)', type: 'edge', suggestion: 'Match your starting border' }
      ]
    },
    scarf_infinity: {
      maxSections: 2,
      template: [
        { name: 'Main Pattern', type: 'repeating', required: true }
      ]
    },
    
    // HATS - Structured: Brim → Body → Crown
    beanie: {
      maxSections: 3,
      template: [
        { name: 'Brim', type: 'edge', required: true, suggestion: '2x2 Ribbing is classic for stretch' },
        { name: 'Body', type: 'main', required: true, suggestion: 'Your main pattern - shows on most of hat' },
        { name: 'Crown Decreases', type: 'shaping', required: true, autoGenerate: true }
      ],
      shaping: {
        crown: {
          instructions: [
            'Continue in pattern until hat measures desired length (typically 7-8" from cast on)',
            '',
            'BEGIN CROWN DECREASES:',
            'Round 1: *K8, K2tog; repeat from * to end',
            'Round 2: Knit all stitches',
            'Round 3: *K7, K2tog; repeat from * to end', 
            'Round 4: Knit all stitches',
            'Round 5: *K6, K2tog; repeat from * to end',
            'Round 6: Knit all stitches',
            'Continue decreasing every other round (K one less stitch before K2tog each time)',
            'When 8-10 stitches remain, cut yarn and thread through remaining stitches',
            'Pull tight and weave in end'
          ]
        }
      }
    },
    beanie_brim: {
      maxSections: 3,
      template: [
        { name: 'Brim/Cuff', type: 'edge', required: true, suggestion: 'Extra-long ribbing that folds up' },
        { name: 'Body', type: 'main', required: true },
        { name: 'Crown Decreases', type: 'shaping', required: true, autoGenerate: true }
      ],
      shaping: {
        crown: {
          instructions: [
            'Work in pattern until hat measures 8-9" from cast on (including folded brim)',
            'BEGIN CROWN DECREASES (same as basic beanie above)'
          ]
        }
      }
    },
    
    // COWLS - Simple or textured
    cowl: {
      maxSections: 2,
      template: [
        { name: 'Main Pattern', type: 'repeating', required: true, suggestion: 'Choose a stitch that looks good on both sides!' }
      ]
    },
    cowl_chunky: {
      maxSections: 2,
      template: [
        { name: 'Main Pattern', type: 'repeating', required: true }
      ]
    },
    
    // SHAWLS - Increases + pattern sections
    shawl_small: {
      maxSections: 4,
      template: [
        { name: 'Border', type: 'edge', suggestion: 'Garter stitch edge prevents curling' },
        { name: 'Section 1', type: 'main', required: true },
        { name: 'Section 2', type: 'main' },
        { name: 'Border', type: 'edge', suggestion: 'Match your starting border' }
      ],
      shaping: {
        increases: {
          instructions: [
            'This shawl is worked flat from the top down with increases',
            'Increase row (RS): K2, KFB, work pattern to last 4 sts, KFB, K2',
            'Work increase row every other row (on RS only)',
            'Continue until shawl reaches desired width'
          ]
        }
      }
    },
    shawl_large: {
      maxSections: 5,
      template: [
        { name: 'Border', type: 'edge' },
        { name: 'Section 1', type: 'main', required: true },
        { name: 'Section 2', type: 'main' },
        { name: 'Section 3', type: 'main' },
        { name: 'Border', type: 'edge' }
      ],
      shaping: {
        increases: {
          instructions: [
            'This shawl is worked flat from the top down with increases',
            'Increase row (RS): K2, KFB, work pattern to last 4 sts, KFB, K2',
            'Work increase row every other row (on RS only)',
            'Continue until shawl reaches desired width'
          ]
        }
      }
    },
    
    // ACCESSORIES - Simple
    headband: {
      maxSections: 2,
      template: [
        { name: 'Main Pattern', type: 'repeating', required: true }
      ]
    },
    fingerless_gloves: {
      maxSections: 2,
      template: [
        { name: 'Cuff', type: 'edge', required: true, suggestion: 'Ribbing for snug fit' },
        { name: 'Hand', type: 'main', required: true }
      ],
      shaping: {
        thumb: {
          instructions: [
            'THUMB OPENING:',
            'Work in pattern to last 6 stitches, place next 6 sts on holder for thumb',
            'Cast on 6 sts over the gap, continue in pattern',
            'Work until glove reaches desired length',
            'Bind off in pattern',
            '',
            'THUMB:',
            'Pick up 6 held stitches, pick up 6 sts from cast-on edge (12 sts total)',
            'Work in stockinette or pattern for 1-1.5 inches',
            'Bind off'
          ]
        }
      }
    },
    
    // HOME GOODS - Flat rectangles (simple)
    dishcloth: {
      maxSections: 1,
      template: [
        { name: 'Main Pattern', type: 'main', required: true, suggestion: 'Seed stitch or moss stitch work great!' }
      ]
    },
    potholder: {
      maxSections: 2,
      template: [
        { name: 'Border', type: 'edge', suggestion: 'Garter border lays flat' },
        { name: 'Center', type: 'main', required: true }
      ]
    },
    
    // BLANKETS - Sections or repeating
    baby_blanket: {
      maxSections: 5,
      template: [
        { name: 'Border', type: 'edge', suggestion: 'Garter stitch prevents curling' },
        { name: 'Main Pattern', type: 'main', required: true, suggestion: 'This will be most of your blanket!' },
        { name: 'Optional Accent', type: 'accent' },
        { name: 'Border', type: 'edge', suggestion: 'Match your starting border' }
      ]
    },
    throw_blanket: {
      maxSections: 6,
      template: [
        { name: 'Border', type: 'edge' },
        { name: 'Section 1', type: 'main', required: true },
        { name: 'Section 2', type: 'main' },
        { name: 'Section 3', type: 'main' },
        { name: 'Border', type: 'edge' }
      ]
    },
    
    // BAGS - Structured
    market_bag: {
      maxSections: 2,
      template: [
        { name: 'Main Pattern', type: 'main', required: true, suggestion: 'Tight stitch for strength!' }
      ],
      shaping: {
        handles: {
          instructions: [
            'HANDLES (make 2):',
            'Cast on 8 stitches',
            'Work in stockinette or pattern for 20-24 inches',
            'Bind off',
            'Sew securely to top edges of bag'
          ]
        }
      }
    },
    
    // Default for others
    custom: {
      maxSections: 10,
      template: [
        { name: 'Section 1', type: 'main', required: true }
      ]
    }
  };

  // Get current project structure
  const currentStructure = projectStructures[selectedPreset] || projectStructures.custom;
  const maxSections = currentStructure.maxSections || 10;

  const projectPresets = {
    custom: { name: 'Custom Size', width: 8, length: 60, examples: [] },
    
    // SCARVES & WRAPS
    scarf_standard: { 
      name: 'Standard Scarf', 
      width: 8, 
      length: 60,
      examples: [
        {
          id: 'kate_cable_scarf',
          title: 'Classic Cable Scarf',
          user: 'Kate (You)',
          emoji: '🧣',
          stitches: ['Cable (C6F)', 'Ribbing'],
          yarn: 'Worsted Weight Wool - Burgundy',
          time: '2 weeks',
          gauge: '5 sts/inch',
          description: 'My first scarf using Yarn Over! Combined cable stitch down the center with 2x2 ribbing on the edges for a classic look.'
        }
      ]
    },
    scarf_kids: { 
      name: 'Kids Scarf', 
      width: 6, 
      length: 40,
      examples: [
        {
          id: 'community_rainbow',
          title: 'Rainbow Garter Scarf',
          user: 'Add your project!',
          emoji: '🌈',
          stitches: ['Garter Stitch'],
          yarn: 'DK Weight Acrylic',
          time: '1 week',
          gauge: '5.5 sts/inch',
          description: 'Upload a photo of your kids scarf and share your pattern!'
        }
      ]
    },
    scarf_extra_long: { name: 'Extra Long Scarf', width: 8, length: 80, examples: [] },
    scarf_infinity: { name: 'Infinity Scarf', width: 10, length: 70, examples: [] },
    shawl_small: { name: 'Small Shawl/Wrap', width: 20, length: 60, examples: [] },
    shawl_large: { name: 'Large Shawl/Wrap', width: 30, length: 70, examples: [] },
    
    // COWLS
    cowl: { 
      name: 'Standard Cowl', 
      width: 12, 
      length: 30,
      examples: [
        {
          id: 'community_cowl1',
          title: 'Cozy Seed Stitch Cowl',
          user: 'Add your project!',
          emoji: '⭕',
          stitches: ['Seed Stitch'],
          yarn: 'Bulky Weight Alpaca',
          time: '1 weekend',
          gauge: '3.5 sts/inch',
          description: 'Share your cowl! Perfect weekend project.'
        }
      ]
    },
    cowl_chunky: { name: 'Chunky Cowl', width: 15, length: 24, examples: [] },
    cowl_long: { name: 'Long Cowl', width: 10, length: 40, examples: [] },
    
    // HATS & HEADWEAR
    beanie: { 
      name: 'Basic Beanie', 
      width: 20, 
      length: 10,
      examples: [
        {
          id: 'community_beanie',
          title: 'Your First Beanie',
          user: 'Add your project!',
          emoji: '🧢',
          stitches: ['Stockinette', 'Ribbing'],
          yarn: 'Worsted Weight',
          time: '3-4 days',
          gauge: '5 sts/inch',
          description: 'Upload your beanie creation! Great for gifts.'
        }
      ]
    },
    beanie_brim: { name: 'Beanie with Brim', width: 20, length: 12, examples: [] },
    headband: { name: 'Headband', width: 4, length: 20, examples: [] },
    
    // WEARABLES
    fingerless_gloves: { name: 'Fingerless Gloves (one)', width: 7, length: 8, examples: [] },
    
    // BAGS
    market_bag: { name: 'Market Bag', width: 14, length: 12, examples: [] },
    tote_bag: { name: 'Tote Bag', width: 16, length: 14, examples: [] },
    
    // TECH ACCESSORIES
    phone_cozy: { 
      name: 'Phone Cozy', 
      width: 3, 
      length: 6,
      examples: [
        {
          id: 'community_phone',
          title: 'Tech Cozy',
          user: 'Add your project!',
          emoji: '📱',
          stitches: ['Moss Stitch'],
          yarn: 'Sport Weight Cotton',
          time: '2 hours',
          gauge: '6 sts/inch',
          description: 'Quick and practical! Share your tech accessories.'
        }
      ]
    },
    tablet_cozy: { name: 'Tablet Cozy', width: 8, length: 10, examples: [] },
    laptop_sleeve: { name: 'Laptop Sleeve', width: 13, length: 10, examples: [] },
    
    // HOME GOODS
    dishcloth: { 
      name: 'Dishcloth', 
      width: 10, 
      length: 10,
      examples: [
        {
          id: 'community_dishcloth',
          title: 'Eco-Friendly Dishcloth',
          user: 'Add your project!',
          emoji: '🧽',
          stitches: ['Seed Stitch', 'Garter'],
          yarn: '100% Cotton',
          time: '2 hours',
          gauge: '5 sts/inch',
          description: 'Perfect beginner project! Share your first dishcloth.'
        }
      ]
    },
    potholder: { name: 'Potholder', width: 8, length: 8, examples: [] },
    coaster: { name: 'Coaster', width: 4, length: 4, examples: [] },
    coaster_set: { name: 'Coaster (set of 4)', width: 4, length: 4, examples: [] },
    placemat: { name: 'Placemat', width: 12, length: 18, examples: [] },
    table_runner: { name: 'Table Runner', width: 14, length: 72, examples: [] },
    
    // BLANKETS
    baby_blanket: { name: 'Baby Blanket', width: 30, length: 40, examples: [] },
    throw_blanket: { name: 'Throw Blanket', width: 50, length: 60, examples: [] },
    
    // BOOKMARKS & SMALL ITEMS
    bookmark: { 
      name: 'Bookmark', 
      width: 2, 
      length: 8,
      examples: [
        {
          id: 'community_bookmark',
          title: 'Pretty Lace Bookmark',
          user: 'Add your project!',
          emoji: '📖',
          stitches: ['Eyelet Lace'],
          yarn: 'Fingering Weight',
          time: '30 minutes',
          gauge: '7 sts/inch',
          description: 'Quick gift! Share your bookmark designs.'
        }
      ]
    },
    mug_cozy: { name: 'Mug Cozy', width: 10, length: 4, examples: [] }
  };

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    const preset = projectPresets[presetKey];
    setDesiredWidth(preset.width);
    setDesiredLength(preset.length);
    // Update stitch count based on new width
    setWidth(Math.round(preset.width * stitchesPerInch));
    // Auto-update project name if it matches a preset name or is default
    if (projectName === 'My Scarf' || Object.values(projectPresets).some(p => projectName.includes(p.name))) {
      setProjectName(`My ${preset.name}`);
    }
  };

  const handleYarnWeightChange = (weight) => {
    setYarnWeight(weight);
    const yarnData = yarnWeights[weight];
    // Auto-populate gauge based on yarn weight
    setStitchesPerInch(yarnData.stitchesPerInch);
    setRowsPerInch(yarnData.rowsPerInch);
    // Recalculate width
    setWidth(Math.round(desiredWidth * yarnData.stitchesPerInch));
  };
  
  const previewCanvasRef = useRef(null);

  // Expanded Stitch Library with categories
  const stitchLibrary = {
    knit: [
      // BASICS
      {
        id: 'stockinette',
        name: 'Stockinette Stitch',
        category: 'basics',
        symbol: '⋮',
        color: '#E8F4F8',
        texturePattern: 'vertical-lines',
        description: 'Classic smooth stitch',
        pattern: ['Row 1 (RS): Knit all stitches', 'Row 2 (WS): Purl all stitches'],
        rowRepeat: 2,
        stitchMultiple: 1,
        difficulty: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/pRV_ydM-RLM',
        videoTitle: 'How to Knit Stockinette Stitch'
      },
      {
        id: 'garter',
        name: 'Garter Stitch',
        category: 'basics',
        symbol: '≡',
        color: '#FFF4E6',
        texturePattern: 'horizontal-ridges',
        description: 'Ridged, reversible texture',
        pattern: ['All Rows: Knit all stitches'],
        rowRepeat: 2,
        stitchMultiple: 1,
        difficulty: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/9TL5C8Zzz4g',
        videoTitle: 'How to Knit Garter Stitch'
      },
      {
        id: 'ribbing',
        name: '2x2 Ribbing',
        category: 'basics',
        symbol: '∥',
        color: '#F0E6FF',
        texturePattern: 'vertical-columns',
        description: 'Stretchy vertical ribs',
        pattern: ['All Rows: *K2, P2; repeat from * to end'],
        rowRepeat: 1,
        stitchMultiple: 4,
        difficulty: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/lKnFzx12K3Q',
        videoTitle: 'How to Knit 2x2 Ribbing'
      },
      {
        id: 'seed',
        name: 'Seed Stitch',
        category: 'textured',
        symbol: '⋅⋅',
        color: '#E6F7E6',
        texturePattern: 'dotted',
        description: 'Textured bumpy surface',
        pattern: ['Row 1: *K1, P1; repeat from * to end', 'Row 2: *P1, K1; repeat from * to end'],
        rowRepeat: 2,
        stitchMultiple: 2,
        difficulty: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/xQmXg2xo2Eo',
        videoTitle: 'How to Knit Seed Stitch'
      },
      {
        id: 'moss',
        name: 'Moss Stitch',
        category: 'textured',
        symbol: '⋮⋅',
        color: '#E8FFE8',
        texturePattern: 'checkerboard',
        description: 'Alternating texture blocks',
        pattern: [
          'Rows 1-2: *K2, P2; repeat from * to end',
          'Rows 3-4: *P2, K2; repeat from * to end'
        ],
        rowRepeat: 4,
        stitchMultiple: 4,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/vR5WLr8ijCc',
        videoTitle: 'How to Knit Moss Stitch'
      },
      
      // CABLES
      {
        id: 'cable-simple',
        name: 'Simple Cable (C6F)',
        category: 'cables',
        symbol: '⚯',
        color: '#FFE6E6',
        texturePattern: 'cable-twist',
        description: 'Classic rope cable',
        pattern: [
          'Rows 1, 3, 5 (RS): P2, K6, P2',
          'Rows 2, 4, 6 (WS): K2, P6, K2',
          'Row 7 (RS): P2, C6F, P2',
          'Row 8 (WS): K2, P6, K2'
        ],
        rowRepeat: 8,
        stitchMultiple: 10,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/kQRZpO6kRYo',
        videoTitle: 'How to Knit Cable Stitch'
      },
      {
        id: 'cable-horseshoe',
        name: 'Horseshoe Cable',
        category: 'cables',
        symbol: '⊐⊏',
        color: '#FFD6D6',
        texturePattern: 'cable-horseshoe',
        description: 'Decorative horseshoe shape',
        pattern: [
          'Row 1 (RS): P3, C4B, C4F, P3',
          'Rows 2, 4, 6, 8 (WS): K3, P8, K3',
          'Rows 3, 5, 7: P3, K8, P3'
        ],
        rowRepeat: 8,
        stitchMultiple: 14,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/WN7mAwcDy68',
        videoTitle: 'How to Knit Horseshoe Cable'
      },
      {
        id: 'cable-braid',
        name: 'Three-Strand Braid',
        category: 'cables',
        symbol: '⚮',
        color: '#FFCCCC',
        texturePattern: 'cable-braid',
        description: 'Interwoven braid effect',
        pattern: [
          'Rows 1, 5 (RS): P2, K9, P2',
          'Rows 2, 4, 6 (WS): K2, P9, K2',
          'Row 3: P2, C3B, K3, C3F, P2'
        ],
        rowRepeat: 6,
        stitchMultiple: 13,
        difficulty: 'advanced',
        videoUrl: 'https://www.youtube.com/embed/g0aCfHzjp9M',
        videoTitle: 'How to Knit Braided Cable'
      },
      
      // LACE
      {
        id: 'lace-eyelet',
        name: 'Eyelet Lace',
        category: 'lace',
        symbol: '◌',
        color: '#FFF0F5',
        texturePattern: 'eyelet',
        description: 'Simple decorative holes',
        pattern: [
          'Row 1 (RS): K1, *YO, K2tog; repeat from * to last st, K1',
          'Row 2 (WS): Purl all stitches'
        ],
        rowRepeat: 2,
        stitchMultiple: 2,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/gZJhz5gV4lw',
        videoTitle: 'How to Knit Eyelet Lace'
      },
      {
        id: 'lace-feather',
        name: 'Feather & Fan',
        category: 'lace',
        symbol: '◠◡',
        color: '#F0F0FF',
        texturePattern: 'wave',
        description: 'Elegant scalloped edge',
        pattern: [
          'Row 1 (RS): Knit',
          'Row 2 (WS): Knit',
          'Row 3: *[K2tog] 3 times, [YO, K1] 6 times, [K2tog] 3 times; repeat from *',
          'Row 4: Purl'
        ],
        rowRepeat: 4,
        stitchMultiple: 18,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/RZzT3m1Ha3w',
        videoTitle: 'How to Knit Feather and Fan Stitch'
      },
      {
        id: 'lace-diamond',
        name: 'Diamond Lace',
        category: 'lace',
        symbol: '◇',
        color: '#E6E6FF',
        texturePattern: 'diamond',
        description: 'Delicate diamond shapes',
        pattern: [
          'Row 1 (RS): K3, *YO, SSK, K5, K2tog, YO, K1; repeat from *, end K3',
          'Row 2 and all WS rows: Purl',
          'Row 3: K2, *YO, K1, SSK, K3, K2tog, K1, YO, K1; repeat from *, end K2',
          'Row 5: K3, *YO, K1, SSK, K1, K2tog, K1, YO, K3; repeat from *',
          'Row 7: K4, *YO, K1, SK2P, K1, YO, K5; repeat from *, end K4'
        ],
        rowRepeat: 8,
        stitchMultiple: 10,
        difficulty: 'advanced',
        videoUrl: 'https://www.youtube.com/embed/YkL0YkYYlGc',
        videoTitle: 'How to Knit Diamond Lace'
      },
      
      // TEXTURED
      {
        id: 'honeycomb',
        name: 'Honeycomb Stitch',
        category: 'textured',
        symbol: '⬡',
        color: '#FFF9E6',
        texturePattern: 'honeycomb',
        description: 'Textured honeycomb pattern',
        pattern: [
          'Row 1 (RS): *K2, P2; repeat from * to end',
          'Row 2 (WS): *K2, P2; repeat from * to end',
          'Row 3: *P2, K2; repeat from * to end',
          'Row 4: *P2, K2; repeat from * to end'
        ],
        rowRepeat: 4,
        stitchMultiple: 4,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/YBxnIhOQfqs',
        videoTitle: 'How to Knit Honeycomb Stitch'
      },
      {
        id: 'basket-weave',
        name: 'Basket Weave',
        category: 'textured',
        symbol: '⊞',
        color: '#FFF5E1',
        texturePattern: 'basket',
        description: 'Woven basket texture',
        pattern: [
          'Rows 1-4: *K4, P4; repeat from * to end',
          'Rows 5-8: *P4, K4; repeat from * to end'
        ],
        rowRepeat: 8,
        stitchMultiple: 8,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/aW8uY8T0aOg',
        videoTitle: 'How to Knit Basket Weave Stitch'
      },
      {
        id: 'bobble',
        name: 'Bobble Stitch',
        category: 'textured',
        symbol: '●',
        color: '#FFE1E1',
        texturePattern: 'bobble',
        description: 'Raised 3D bobbles',
        pattern: [
          'Rows 1, 3, 5 (RS): Knit',
          'Rows 2, 4, 6 (WS): Purl',
          'Row 7 (RS): K4, *Make Bobble (K1, P1, K1, P1, K1 all in next st, turn, P5, turn, K5, turn, P2tog, P1, P2tog, turn, SK2P), K7; repeat from *'
        ],
        rowRepeat: 8,
        stitchMultiple: 8,
        difficulty: 'advanced',
        videoUrl: 'https://www.youtube.com/embed/KX6kEvb0Aqg',
        videoTitle: 'How to Knit Bobble Stitch'
      },
      
      // COMPOSITE PATTERNS - Multi-row designs
      {
        id: 'slip_stitch_texture',
        name: 'Slip Stitch Texture',
        category: 'composite',
        symbol: '⚡',
        color: '#FFF9E6',
        texturePattern: 'diagonal',
        description: 'Creates diagonal textured pattern with slip stitches',
        pattern: [
          'Row 1 (RS): Sl1, K to end',
          'Row 2 (WS): Sl1, K3, *(YO) 3 times, K1; repeat from * to last 4 sts, K4',
          'Row 3 (RS): Sl1, K to end, dropping all YO loops',
          'Row 4 (WS): Sl1, K to end'
        ],
        rowRepeat: 4,
        stitchMultiple: 1,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/SfOZuiY_LL8',
        videoTitle: 'Slip Stitch Patterns'
      },
      {
        id: 'eyelet_chevron',
        name: 'Eyelet Chevron',
        category: 'composite',
        symbol: '∧∨',
        color: '#E6F3FF',
        texturePattern: 'zigzag',
        description: 'Lacy chevron pattern with yarn overs',
        pattern: [
          'Row 1 (RS): *K1, YO, K2, SK2P, K2, YO; repeat from *',
          'Row 2 and all WS rows: Purl',
          'Row 3 (RS): *K2, YO, K1, SK2P, K1, YO, K1; repeat from *',
          'Row 5 (RS): *K3, YO, SK2P, YO, K2; repeat from *',
          'Row 6: Purl'
        ],
        rowRepeat: 6,
        stitchMultiple: 8,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/BkChBLxiQX4',
        videoTitle: 'Lace Chevron Pattern'
      },
      {
        id: 'mock_cable',
        name: 'Mock Cable Twist',
        category: 'composite',
        symbol: '⚭',
        color: '#FFEEF0',
        texturePattern: 'twisted',
        description: 'Cable-like twist without a cable needle',
        pattern: [
          'Rows 1 & 3 (RS): *P2, K4, P2; repeat from *',
          'Rows 2 & 4 (WS): *K2, P4, K2; repeat from *',
          'Row 5 (RS): *P2, K2tog but leave on needle, knit first st again, slip both sts off needle, P2; repeat from *',
          'Row 6 (WS): *K2, P4, K2; repeat from *'
        ],
        rowRepeat: 6,
        stitchMultiple: 8,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/Hs0N5v7kU4Q',
        videoTitle: 'Mock Cable Technique'
      },
      {
        id: 'garter_lace',
        name: 'Garter & Lace Band',
        category: 'composite',
        symbol: '⋈',
        color: '#F5EDFF',
        texturePattern: 'mixed',
        description: 'Alternating garter and eyelet lace sections',
        pattern: [
          'Rows 1-4: Knit all stitches (garter)',
          'Row 5 (RS): K2, *YO, K2tog; repeat from * to last 2 sts, K2',
          'Row 6 (WS): Knit',
          'Row 7 (RS): K2, *K2tog, YO; repeat from * to last 2 sts, K2',
          'Row 8 (WS): Knit',
          'Rows 9-12: Knit all stitches (garter)'
        ],
        rowRepeat: 12,
        stitchMultiple: 2,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/q9-HCTB7Vhw',
        videoTitle: 'Garter Lace Combinations'
      },
      {
        id: 'braided_traveling',
        name: 'Braided Traveling Stitch',
        category: 'composite',
        symbol: '⥮',
        color: '#FFF0F5',
        texturePattern: 'diagonal',
        description: 'Stitches travel diagonally creating braid effect',
        pattern: [
          'Row 1 (RS): *P2, RT (K2tog, leave on needle, knit first st again), P2; repeat from *',
          'Row 2 (WS): *K2, P2, K2; repeat from *',
          'Row 3 (RS): *P1, RT, LT (slip 1, K1, PSSO but leave on needle, knit skipped st), P1; repeat from *',
          'Row 4 (WS): *K1, P4, K1; repeat from *',
          'Row 5 (RS): *RT, P2, LT; repeat from *',
          'Row 6 (WS): *P1, K4, P1; repeat from *'
        ],
        rowRepeat: 6,
        stitchMultiple: 6,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/8Bb5M-fkCUc',
        videoTitle: 'Traveling Stitch Techniques'
      },
      {
        id: 'trinity_stitch',
        name: 'Trinity / Blackberry Stitch',
        category: 'composite',
        symbol: '⦿',
        color: '#FFFACD',
        texturePattern: 'bumpy',
        description: 'Highly textured 3D stitch pattern',
        pattern: [
          'Row 1 (RS): Purl',
          'Row 2 (WS): *(K1, P1, K1) all in next st, P3tog; repeat from *',
          'Row 3 (RS): Purl',
          'Row 4 (WS): *P3tog, (K1, P1, K1) all in next st; repeat from *'
        ],
        rowRepeat: 4,
        stitchMultiple: 4,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/O8OFyq6w3Jk',
        videoTitle: 'Trinity Stitch Tutorial'
      }
    ],
    crochet: [
      {
        id: 'single',
        name: 'Single Crochet',
        category: 'basics',
        symbol: '×',
        color: '#E8F4F8',
        texturePattern: 'tight-grid',
        description: 'Basic tight stitch',
        pattern: ['All Rows: Single crochet in each stitch across'],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/aAxGTnVNJiE',
        videoTitle: 'How to Single Crochet'
      },
      {
        id: 'double',
        name: 'Double Crochet',
        category: 'basics',
        symbol: 'T',
        color: '#FFF4E6',
        texturePattern: 'open-grid',
        description: 'Taller, looser stitch',
        pattern: ['All Rows: Double crochet in each stitch across'],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/eKEW45bjR8E',
        videoTitle: 'How to Double Crochet'
      },
      {
        id: 'half-double',
        name: 'Half Double Crochet',
        category: 'basics',
        symbol: 'T̶',
        color: '#F0FFE6',
        texturePattern: 'medium-grid',
        description: 'Medium height stitch',
        pattern: ['All Rows: Half double crochet in each stitch across'],
        rowRepeat: 1,
        stitchMultiple: 1,
        difficulty: 'beginner',
        videoUrl: 'https://www.youtube.com/embed/VQn8i1D6Ixo',
        videoTitle: 'How to Half Double Crochet'
      },
      {
        id: 'granny',
        name: 'Granny Stripe',
        category: 'textured',
        symbol: '⌇',
        color: '#F0E6FF',
        texturePattern: 'granny',
        description: 'Classic granny square pattern',
        pattern: ['Row 1: *3 DC in next st, skip 2 sts; repeat from * to end'],
        rowRepeat: 1,
        stitchMultiple: 3,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/fz96WgcN8jk',
        videoTitle: 'How to Crochet Granny Stripe'
      },
      {
        id: 'shell',
        name: 'Shell Stitch',
        category: 'textured',
        symbol: '∪',
        color: '#FFE6F0',
        texturePattern: 'shell',
        description: 'Fan-shaped shells',
        pattern: [
          'Row 1: *Skip 2 sts, 5 DC in next st (shell made), skip 2 sts, SC in next st; repeat from *',
          'Row 2: Ch 3, 2 DC in first st, *SC in center DC of shell, shell in SC; repeat from *'
        ],
        rowRepeat: 2,
        stitchMultiple: 6,
        difficulty: 'intermediate',
        videoUrl: 'https://www.youtube.com/embed/w_bnN56CGXI',
        videoTitle: 'How to Crochet Shell Stitch'
      },
      {
        id: 'v-stitch',
        name: 'V-Stitch',
        category: 'lace',
        symbol: 'V',
        color: '#E6F0FF',
        texturePattern: 'v-pattern',
        description: 'Open, airy V shapes',
        pattern: [
          'Row 1: *(DC, Ch 1, DC) in next st (V-st made), skip 1 st; repeat from *',
          'Row 2: *V-st in ch-1 space of previous V-st; repeat from *'
        ],
        rowRepeat: 1,
        stitchMultiple: 2,
        difficulty: 'easy',
        videoUrl: 'https://www.youtube.com/embed/RJiqVbZWCZk',
        videoTitle: 'How to Crochet V-Stitch'
      }
    ]
  };

  const categories = {
    all: 'All Stitches',
    beginner: 'Beginner',
    easy: 'Easy',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    basics: 'Basic Stitches',
    cables: 'Cables',
    lace: 'Lace',
    textured: 'Textured',
    composite: 'Multi-Row Patterns',
    custom: 'My Custom Patterns'
  };

  // Difficulty order for sorting
  const difficultyOrder = {
    beginner: 1,
    easy: 2,
    intermediate: 3,
    advanced: 4
  };

  // Calculate dimensions
  const widthInInches = width / stitchesPerInch;
  const estimatedRows = Math.ceil(desiredLength * rowsPerInch);
  const estimatedStitches = Math.ceil(desiredWidth * stitchesPerInch);
  const totalStitches = canvas.reduce((sum, section) => {
    if (!section) return sum;
    return sum + (width * section.rowRepeat);
  }, 0);
  
  // Calculate yarn yardage needed
  const totalYardage = Math.ceil(estimatedStitches * estimatedRows * yarnWeights[yarnWeight].yardsPerStitch);
  const totalYardageWithBuffer = Math.ceil(totalYardage * 1.15); // Add 15% buffer

  // Filter stitches by category or difficulty, then sort by difficulty level
  const filteredStitches = (() => {
    let stitches = [...stitchLibrary[selectedCraft], ...customPatterns];
    
    // Filter by category or difficulty
    if (selectedCategory !== 'all') {
      if (['beginner', 'easy', 'intermediate', 'advanced'].includes(selectedCategory)) {
        // Filter by difficulty
        stitches = stitches.filter(s => s.difficulty === selectedCategory);
      } else {
        // Filter by category
        stitches = stitches.filter(s => s.category === selectedCategory);
      }
    }
    
    // Sort by difficulty (beginner first, advanced last)
    return stitches.sort((a, b) => {
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
  })();

  // Draw visual preview
  useEffect(() => {
    if (!showPreview || !previewCanvasRef.current) return;
    
    const canvasElement = previewCanvasRef.current;
    const ctx = canvasElement.getContext('2d');
    const cellSize = 8; // Size of each "stitch" cell
    
    // Set canvas size
    canvasElement.width = Math.min(width * cellSize, 600);
    canvasElement.height = Math.max(200, canvas.length * 40 || 200);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    if (canvas.length === 0) return;
    
    let yOffset = 0;
    
    canvas.forEach((section) => {
      if (!section) return;
      
      const sectionHeight = section.rowRepeat * 5;
      
      // Draw section background
      ctx.fillStyle = section.color;
      ctx.fillRect(0, yOffset, canvasElement.width, sectionHeight);
      
      // Draw texture pattern
      drawTexturePattern(ctx, section.texturePattern, 0, yOffset, canvasElement.width, sectionHeight, cellSize);
      
      yOffset += sectionHeight;
    });
  }, [canvas, width, showPreview]);

  const drawTexturePattern = (ctx, pattern, x, y, width, height, cellSize) => {
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 1;
    
    switch (pattern) {
      case 'vertical-lines':
        for (let i = x; i < x + width; i += cellSize) {
          ctx.beginPath();
          ctx.moveTo(i, y);
          ctx.lineTo(i, y + height);
          ctx.stroke();
        }
        break;
      
      case 'horizontal-ridges':
        for (let i = y; i < y + height; i += cellSize * 2) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(x, i, width, cellSize);
        }
        break;
      
      case 'vertical-columns':
        for (let i = x; i < x + width; i += cellSize * 2) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(i, y, cellSize, height);
        }
        break;
      
      case 'dotted':
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let i = x; i < x + width; i += cellSize) {
          for (let j = y; j < y + height; j += cellSize) {
            if ((i / cellSize + j / cellSize) % 2 === 0) {
              ctx.beginPath();
              ctx.arc(i + cellSize / 2, j + cellSize / 2, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        break;
      
      case 'cable-twist':
        ctx.strokeStyle = 'rgba(100, 50, 50, 0.4)';
        ctx.lineWidth = 2;
        for (let i = x; i < x + width; i += cellSize * 3) {
          ctx.beginPath();
          ctx.moveTo(i, y);
          ctx.bezierCurveTo(i + cellSize, y + height / 3, i + cellSize * 2, y + 2 * height / 3, i + cellSize * 3, y + height);
          ctx.stroke();
        }
        break;
      
      case 'honeycomb':
        ctx.strokeStyle = 'rgba(200, 150, 0, 0.3)';
        const hexSize = cellSize * 1.5;
        for (let i = x; i < x + width; i += hexSize * 1.5) {
          for (let j = y; j < y + height; j += hexSize * 2) {
            drawHexagon(ctx, i + (j / hexSize % 2) * hexSize * 0.75, j, hexSize * 0.5);
          }
        }
        break;
      
      case 'eyelet':
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = x + cellSize; i < x + width; i += cellSize * 2) {
          for (let j = y + cellSize; j < y + height; j += cellSize * 2) {
            ctx.beginPath();
            ctx.arc(i, j, cellSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      
      case 'wave':
        ctx.strokeStyle = 'rgba(100, 100, 200, 0.4)';
        ctx.lineWidth = 2;
        for (let j = y; j < y + height; j += cellSize * 3) {
          ctx.beginPath();
          ctx.moveTo(x, j);
          for (let i = x; i < x + width; i += cellSize) {
            const waveY = j + Math.sin(i / cellSize) * cellSize;
            ctx.lineTo(i, waveY);
          }
          ctx.stroke();
        }
        break;
        
      default:
        // Simple grid
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
        for (let i = x; i < x + width; i += cellSize) {
          ctx.beginPath();
          ctx.moveTo(i, y);
          ctx.lineTo(i, y + height);
          ctx.stroke();
        }
        for (let i = y; i < y + height; i += cellSize) {
          ctx.beginPath();
          ctx.moveTo(x, i);
          ctx.lineTo(x + width, i);
          ctx.stroke();
        }
    }
  };

  const drawHexagon = (ctx, x, y, size) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const handleDragStart = (stitch) => {
    setDraggedStitch(stitch);
  };

  const handleDrop = (index) => {
    if (draggedStitch) {
      const newCanvas = [...canvas];
      newCanvas[index] = draggedStitch;
      setCanvas(newCanvas);
      setDraggedStitch(null);
    }
  };

  const addSection = () => {
    setCanvas([...canvas, null]);
  };

  const removeSection = (index) => {
    const newCanvas = canvas.filter((_, i) => i !== index);
    setCanvas(newCanvas);
  };

  const openVideoModal = (stitch) => {
    setCurrentVideo(stitch);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setCurrentVideo(null);
  };

  const openExampleGallery = () => {
    const preset = projectPresets[selectedPreset];
    setCurrentPresetExamples(preset.examples || []);
    setExampleGalleryOpen(true);
  };

  const closeExampleGallery = () => {
    setExampleGalleryOpen(false);
  };

  const generatePattern = () => {
    if (canvas.length === 0) return '';
    
    let pattern = `${projectName}\n`;
    pattern += `${'='.repeat(projectName.length)}\n\n`;
    pattern += `A ${projectPresets[selectedPreset].name} • ${desiredWidth}" × ${desiredLength}"\n\n`;
    
    pattern += `WHAT YOU'LL NEED:\n`;
    pattern += `• Yarn: ${yarnWeights[yarnWeight].name} (${totalYardageWithBuffer} yards)\n`;
    pattern += `  Popular brands: ${yarnWeights[yarnWeight].popularBrands.slice(0, 2).join(', ')}\n`;
    
    // Add colorwork info if enabled
    if (colorwork.enabled && colorwork.colors.length > 1) {
      pattern += `• Colors needed: ${colorwork.colors.length} (${colorwork.colors.join(', ')})\n`;
      if (colorwork.type === 'stripes') {
        pattern += `  Stripe pattern: See colorwork section below\n`;
      }
    }
    
    if (selectedCraft === 'knit') {
      pattern += `• Needles: ${yarnWeights[yarnWeight].needles}\n`;
    } else {
      pattern += `• Hook: ${yarnWeights[yarnWeight].hooks}\n`;
    }
    pattern += `• Gauge: ${stitchesPerInch} sts × ${rowsPerInch} rows per inch\n`;
    
    // Add any special notions based on project
    const structure = currentStructure;
    if (structure.shaping?.thumb) {
      pattern += `• Stitch holders or waste yarn for thumb\n`;
    }
    if (structure.shaping?.handles) {
      pattern += `• Tapestry needle for seaming handles\n`;
    }
    
    pattern += `\n`;
    
    pattern += `CAN'T FIND THIS YARN?\n`;
    pattern += `Try: ${yarnWeights[yarnWeight].substitutes.slice(0, 2).join(' OR ')}\n\n`;
    
    pattern += `LET'S GET STARTED:\n`;
    pattern += `Cast on ${estimatedStitches} stitches (this gives you your ${desiredWidth}" width)\n\n`;
    
    // Add colorwork instructions if enabled
    if (colorwork.enabled && colorwork.type === 'stripes' && colorwork.pattern.length > 0) {
      pattern += `COLORWORK - STRIPE PATTERN:\n`;
      colorwork.pattern.forEach((stripe, idx) => {
        pattern += `  ${stripe.color}: ${stripe.rows} rows\n`;
      });
      pattern += `  Repeat this sequence throughout\n\n`;
    }
    
    // Add pattern sections with template guidance
    canvas.forEach((section, idx) => {
      if (section) {
        // Add template section name if available
        const templateSection = structure.template && structure.template[idx];
        const sectionLabel = templateSection ? templateSection.name : `Section ${idx + 1}`;
        
        pattern += `${idx + 1}. ${sectionLabel}: ${section.name} (${section.difficulty})\n`;
        section.pattern.forEach((row) => {
          pattern += `   ${row}\n`;
        });
        pattern += `   Repeat these ${section.rowRepeat} rows until section measures desired length\n\n`;
      }
    });
    
    // Add shaping instructions if project has them
    if (structure.shaping) {
      pattern += `SHAPING:\n`;
      pattern += `${'-'.repeat(50)}\n`;
      
      if (structure.shaping.crown) {
        pattern += `CROWN DECREASES (for top of hat):\n`;
        structure.shaping.crown.instructions.forEach(line => {
          pattern += `${line}\n`;
        });
        pattern += `\n`;
      }
      
      if (structure.shaping.increases) {
        pattern += `INCREASES (for shawl shaping):\n`;
        structure.shaping.increases.instructions.forEach(line => {
          pattern += `${line}\n`;
        });
        pattern += `\n`;
      }
      
      if (structure.shaping.thumb) {
        pattern += structure.shaping.thumb.instructions.join('\n');
        pattern += `\n\n`;
      }
      
      if (structure.shaping.handles) {
        pattern += structure.shaping.handles.instructions.join('\n');
        pattern += `\n\n`;
      }
    }
    
    pattern += `FINISHING UP:\n`;
    pattern += `• Bind off all stitches loosely\n`;
    pattern += `• Weave in any loose ends with a tapestry needle\n`;
    pattern += `• Block gently to ${desiredWidth}" × ${desiredLength}" (optional but recommended!)\n\n`;
    pattern += `${'-'.repeat(50)}\n`;
    pattern += `Created with Yarn Over • yarnover.app\n`;
    pattern += `Happy making! 🧶\n`;
    
    return pattern;
  };

  // Pattern Builder Functions
  const addRowToPattern = () => {
    if (!currentRow.trim()) return;
    
    setBuildingPattern(prev => ({
      ...prev,
      rows: [...prev.rows, currentRow]
    }));
    setCurrentRow('');
  };
  
  const deleteRow = (index) => {
    setBuildingPattern(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index)
    }));
  };
  
  const saveCustomPattern = () => {
    if (!buildingPattern.name.trim() || buildingPattern.rows.length === 0) {
      alert('Please add a pattern name and at least one row!');
      return;
    }
    
    const newPattern = {
      id: `custom_${Date.now()}`,
      name: buildingPattern.name,
      category: 'custom',
      symbol: '✨',
      color: '#E8F5E9',
      texturePattern: 'custom',
      description: `Custom ${buildingPattern.rows.length}-row pattern`,
      pattern: buildingPattern.rows,
      rowRepeat: buildingPattern.rows.length,
      stitchMultiple: 1,
      difficulty: buildingPattern.difficulty,
      videoUrl: '',
      videoTitle: ''
    };
    
    setCustomPatterns(prev => [...prev, newPattern]);
    
    // Reset builder
    setBuildingPattern({
      name: '',
      rows: [],
      difficulty: 'intermediate',
      category: 'custom'
    });
    setPatternBuilderOpen(false);
    
    alert(`Pattern "${newPattern.name}" saved! Find it in "My Custom Patterns" category.`);
  };
  
  const clearBuilder = () => {
    if (buildingPattern.rows.length > 0) {
      if (confirm('Clear all rows? This cannot be undone.')) {
        setBuildingPattern({
          name: '',
          rows: [],
          difficulty: 'intermediate',
          category: 'custom'
        });
        setCurrentRow('');
      }
    }
  };

  const downloadPattern = () => {
    const pattern = generatePattern();
    const blob = new Blob([pattern], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-')}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 p-2 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-700">
              🧶 Yarn Over
            </h1>
            {/* Mode Toggle */}
            <button
              onClick={() => {
                setBeginnerMode(!beginnerMode);
                setWizardStep(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md ${
                beginnerMode 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-300'
              }`}
            >
              {beginnerMode ? '🚀 Try Advanced Mode' : '✨ Switch to Step-by-Step'}
            </button>
          </div>
          
          {/* Hero Copy */}
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl font-semibold text-slate-600 mb-3">
              {beginnerMode ? 'We\'ll guide you through each step!' : 'Design Your Dream Pattern in Minutes'}
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              Create custom knitting & crochet patterns with drag-and-drop stitches, automatic yardage calculation, and professional pattern downloads. No experience needed!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600 font-bold">✓</span>
                <span>22 Stitches with Videos</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600 font-bold">✓</span>
                <span>33 Project Presets</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600 font-bold">✓</span>
                <span>Smart Yarn Calculator</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600 font-bold">✓</span>
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        {beginnerMode ? (
          /* BEGINNER MODE - Step by Step Wizard */
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                      wizardStep >= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        wizardStep > step ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">
                  {wizardStep === 1 && 'Step 1: Choose What You\'re Making'}
                  {wizardStep === 2 && 'Step 2: Select Your Yarn & Tools'}
                  {wizardStep === 3 && 'Step 3: Pick Your Stitches'}
                  {wizardStep === 4 && 'Step 4: Review & Download'}
                </p>
              </div>
            </div>

            {/* Step 1: Project Type */}
            {wizardStep === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What would you like to make?</h2>
                
                {/* Scarves & Wraps */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-600 mb-3">🧣 Scarves & Wraps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['scarf_standard', 'scarf_kids', 'scarf_extra_long', 'scarf_infinity', 'shawl_small', 'shawl_large'].map((key) => (
                      <button
                        key={key}
                        onClick={() => { handlePresetChange(key); setWizardStep(2); }}
                        className="p-4 border-2 border-gray-200 hover:border-slate-400 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="font-bold text-gray-800">{projectPresets[key].name}</div>
                        <div className="text-sm text-gray-600">{projectPresets[key].width}" × {projectPresets[key].length}"</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cowls */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-600 mb-3">⭕ Cowls</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['cowl', 'cowl_chunky', 'cowl_long'].map((key) => (
                      <button
                        key={key}
                        onClick={() => { handlePresetChange(key); setWizardStep(2); }}
                        className="p-4 border-2 border-gray-200 hover:border-slate-400 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="font-bold text-gray-800">{projectPresets[key].name}</div>
                        <div className="text-sm text-gray-600">{projectPresets[key].width}" × {projectPresets[key].length}"</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hats & Accessories */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-600 mb-3">🧢 Hats & Accessories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['beanie', 'beanie_brim', 'headband', 'fingerless_gloves'].map((key) => (
                      <button
                        key={key}
                        onClick={() => { handlePresetChange(key); setWizardStep(2); }}
                        className="p-4 border-2 border-gray-200 hover:border-slate-400 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="font-bold text-gray-800">{projectPresets[key].name}</div>
                        <div className="text-sm text-gray-600">{projectPresets[key].width}" × {projectPresets[key].length}"</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bags */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-600 mb-3">🛍️ Bags</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['market_bag', 'tote_bag'].map((key) => (
                      <button
                        key={key}
                        onClick={() => { handlePresetChange(key); setWizardStep(2); }}
                        className="p-4 border-2 border-gray-200 hover:border-slate-400 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="font-bold text-gray-800">{projectPresets[key].name}</div>
                        <div className="text-sm text-gray-600">{projectPresets[key].width}" × {projectPresets[key].length}"</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech Accessories */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-600 mb-3">📱 Tech Accessories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['phone_cozy', 'tablet_cozy', 'laptop_sleeve'].map((key) => (
                      <button
                        key={key}
                        onClick={() => { handlePresetChange(key); setWizardStep(2); }}
                        className="p-4 border-2 border-gray-200 hover:border-slate-400 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="font-bold text-gray-800">{projectPresets[key].name}</div>
                        <div className="text-sm text-gray-600">{projectPresets[key].width}" × {projectPresets[key].length}"</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Home Goods */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-600 mb-3">🏠 Home Goods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['dishcloth', 'potholder', 'coaster', 'coaster_set', 'placemat', 'table_runner', 'mug_cozy'].map((key) => (
                      <button
                        key={key}
                        onClick={() => { handlePresetChange(key); setWizardStep(2); }}
                        className="p-4 border-2 border-gray-200 hover:border-slate-400 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="font-bold text-gray-800">{projectPresets[key].name}</div>
                        <div className="text-sm text-gray-600">{projectPresets[key].width}" × {projectPresets[key].length}"</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blankets & More */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-600 mb-3">🛋️ Blankets & More</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['baby_blanket', 'throw_blanket', 'bookmark'].map((key) => (
                      <button
                        key={key}
                        onClick={() => { handlePresetChange(key); setWizardStep(2); }}
                        className="p-4 border-2 border-gray-200 hover:border-slate-400 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="font-bold text-gray-800">{projectPresets[key].name}</div>
                        <div className="text-sm text-gray-600">{projectPresets[key].width}" × {projectPresets[key].length}"</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setBeginnerMode(false)}
                  className="mt-6 text-slate-500 hover:text-slate-600 text-sm"
                >
                  ← Back to Advanced Mode
                </button>
              </div>
            )}

            {/* Step 2: Yarn Selection */}
            {wizardStep === 2 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What yarn will you use?</h2>
                <p className="text-gray-600 mb-6">Choose the thickness of your yarn. Don't worry - we'll tell you what needle or hook size you need!</p>
                
                <div className="space-y-3 mb-6">
                  {Object.entries(yarnWeights).map(([key, yarn]) => (
                    <button
                      key={key}
                      onClick={() => {
                        handleYarnWeightChange(key);
                      }}
                      className={`w-full p-4 rounded-xl border-3 text-left transition-all ${
                        yarnWeight === key 
                          ? 'border-slate-400 bg-slate-50' 
                          : 'border-gray-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{yarn.emoji}</span>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-800">{yarn.name}</div>
                          <div className="text-sm text-gray-600">{yarn.description}</div>
                        </div>
                        {yarnWeight === key && (
                          <span className="text-green-500 text-2xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Show selected yarn info */}
                {yarnWeight && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-green-900 mb-2">✓ Great choice!</h3>
                    <p className="text-green-800 mb-2">
                      You'll need: <strong>{selectedCraft === 'knit' ? yarnWeights[yarnWeight].needles : yarnWeights[yarnWeight].hooks}</strong>
                    </p>
                    <p className="text-green-800">
                      Estimated yarn needed: <strong>{totalYardageWithBuffer} yards</strong>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="flex-1 px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Next: Choose Stitches →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Stitch Selection */}
            {wizardStep === 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pick your stitches</h2>
                <p className="text-gray-600 mb-6">Click on stitches to add them to your pattern. Start with beginner stitches if you're new!</p>

                {/* Filter by difficulty */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {['beginner', 'easy', 'intermediate', 'advanced'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedCategory(diff)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        selectedCategory === diff
                          ? 'bg-slate-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-slate-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Show All
                  </button>
                </div>

                {/* Stitch Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-[600px] overflow-y-auto">
                  {filteredStitches.map((stitch) => (
                    <button
                      key={stitch.id}
                      onClick={() => {
                        const emptyIndex = canvas.findIndex(s => s === null);
                        if (emptyIndex !== -1) {
                          const newCanvas = [...canvas];
                          newCanvas[emptyIndex] = stitch;
                          setCanvas(newCanvas);
                        } else {
                          setCanvas([...canvas, stitch]);
                        }
                      }}
                      className="p-4 border-2 border-gray-200 hover:border-slate-300 rounded-xl text-left transition-all hover:shadow-lg"
                      style={{ backgroundColor: stitch.color }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{stitch.symbol}</span>
                        <div className="flex-1">
                          <div className="font-bold text-gray-800">{stitch.name}</div>
                          <div className="text-sm text-gray-600">{stitch.description}</div>
                        </div>
                        <span className="text-2xl">+</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Current Pattern Preview */}
                {canvas.length > 0 && (
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-slate-700 mb-2">Your Pattern ({canvas.length} sections):</h3>
                    <div className="space-y-2">
                      {canvas.map((section, idx) => (
                        section && (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span>{section.symbol}</span>
                            <span className="font-medium">{section.name}</span>
                            <button
                              onClick={() => removeSection(idx)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setWizardStep(4)}
                    disabled={canvas.length === 0}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      canvas.length > 0
                        ? 'bg-slate-500 hover:bg-slate-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canvas.length > 0 ? 'Review Pattern →' : 'Add at least one stitch'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Download */}
            {wizardStep === 4 && canvas.some(s => s !== null) && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">✓ Your pattern is ready!</h2>
                
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-green-900 text-lg mb-4">Pattern Summary</h3>
                  <div className="space-y-2 text-green-800">
                    <p><strong>Project:</strong> {projectPresets[selectedPreset].name}</p>
                    <p><strong>Size:</strong> {desiredWidth}" × {desiredLength}"</p>
                    <p><strong>Yarn:</strong> {yarnWeights[yarnWeight].name}</p>
                    <p><strong>Tools:</strong> {selectedCraft === 'knit' ? yarnWeights[yarnWeight].needles : yarnWeights[yarnWeight].hooks}</p>
                    <p><strong>Yarn Needed:</strong> {totalYardageWithBuffer} yards</p>
                    <p><strong>Stitches:</strong> {canvas.filter(s => s).map(s => s.name).join(', ')}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Preview:</h4>
                  <pre className="text-xs whitespace-pre-wrap font-mono bg-white p-4 rounded border border-gray-200 max-h-60 overflow-y-auto">
                    {generatePattern()}
                  </pre>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={downloadPattern}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download size={20} />
                    Download Your Pattern
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setBeginnerMode(false);
                    }}
                    className="text-slate-500 hover:text-slate-600 font-semibold"
                  >
                    Try Advanced Mode for more features →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ADVANCED MODE - Full Featured Interface */
          <>
        {/* Project Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Project Settings</h3>
          
          {/* Project Type Selector - Full Width */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📏 Select Project Type (33 Presets!)
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-400 focus:outline-none bg-white text-base"
            >
              <option value="custom">{projectPresets.custom.name}</option>
              
              <optgroup label="📿 Scarves & Wraps">
                <option value="scarf_standard">{projectPresets.scarf_standard.name}</option>
                <option value="scarf_kids">{projectPresets.scarf_kids.name}</option>
                <option value="scarf_extra_long">{projectPresets.scarf_extra_long.name}</option>
                <option value="scarf_infinity">{projectPresets.scarf_infinity.name}</option>
                <option value="shawl_small">{projectPresets.shawl_small.name}</option>
                <option value="shawl_large">{projectPresets.shawl_large.name}</option>
              </optgroup>
              
              <optgroup label="⭕ Cowls">
                <option value="cowl">{projectPresets.cowl.name}</option>
                <option value="cowl_chunky">{projectPresets.cowl_chunky.name}</option>
                <option value="cowl_long">{projectPresets.cowl_long.name}</option>
              </optgroup>
              
              <optgroup label="🧢 Hats & Headwear">
                <option value="beanie">{projectPresets.beanie.name}</option>
                <option value="beanie_brim">{projectPresets.beanie_brim.name}</option>
                <option value="headband">{projectPresets.headband.name}</option>
              </optgroup>
              
              <optgroup label="🧤 Wearables">
                <option value="fingerless_gloves">{projectPresets.fingerless_gloves.name}</option>
              </optgroup>
              
              <optgroup label="🛍️ Bags">
                <option value="market_bag">{projectPresets.market_bag.name}</option>
                <option value="tote_bag">{projectPresets.tote_bag.name}</option>
              </optgroup>
              
              <optgroup label="📱 Tech Accessories">
                <option value="phone_cozy">{projectPresets.phone_cozy.name}</option>
                <option value="tablet_cozy">{projectPresets.tablet_cozy.name}</option>
                <option value="laptop_sleeve">{projectPresets.laptop_sleeve.name}</option>
              </optgroup>
              
              <optgroup label="🏠 Home Goods">
                <option value="dishcloth">{projectPresets.dishcloth.name}</option>
                <option value="potholder">{projectPresets.potholder.name}</option>
                <option value="coaster">{projectPresets.coaster.name}</option>
                <option value="coaster_set">{projectPresets.coaster_set.name}</option>
                <option value="placemat">{projectPresets.placemat.name}</option>
                <option value="table_runner">{projectPresets.table_runner.name}</option>
                <option value="mug_cozy">{projectPresets.mug_cozy.name}</option>
              </optgroup>
              
              <optgroup label="🛏️ Blankets">
                <option value="baby_blanket">{projectPresets.baby_blanket.name}</option>
                <option value="throw_blanket">{projectPresets.throw_blanket.name}</option>
              </optgroup>
              
              <optgroup label="📖 Small Items">
                <option value="bookmark">{projectPresets.bookmark.name}</option>
              </optgroup>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              💡 Select any preset and customize dimensions in the gauge calculator below
            </p>
          </div>
          
          {/* View Examples Button */}
          {projectPresets[selectedPreset].examples.length > 0 && (
            <div className="mb-4">
              <button
                onClick={openExampleGallery}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-400 to-slate-400 text-white rounded-lg hover:from-slate-500 hover:to-slate-500 transition-all shadow-md"
              >
                <Eye size={20} />
                <span className="font-semibold">View Example Projects ({projectPresets[selectedPreset].examples.length})</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                🌟 See what others have made + share your own!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-slate-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Craft Type
              </label>
              <select
                value={selectedCraft}
                onChange={(e) => {
                  setSelectedCraft(e.target.value);
                  setCanvas([]);
                  setSelectedCategory('all');
                }}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-slate-400 focus:outline-none"
              >
                <option value="knit">Knitting</option>
                <option value="crochet">Crochet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Stitch Width
              </label>
              <div className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold">
                {width} stitches ({widthInInches.toFixed(1)}")
              </div>
            </div>
          </div>
        </div>

        {/* Gauge Calculator */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-100 rounded-2xl shadow-xl p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="text-slate-600" size={24} />
            <h3 className="text-lg font-bold text-gray-800">Gauge Calculator & Dimensions</h3>
          </div>

          {/* Yarn Weight Selector */}
          <div className="mb-6 p-4 bg-white/70 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                🧶 Select Your Yarn Weight
              </label>
              <button
                onClick={() => alert('🧶 YARN WEIGHT GUIDE\n\nYarn weight determines how thick your yarn is, which affects:\n\n• What size needles/hooks to use\n• How many stitches per inch (gauge)\n• How your finished project will look\n\nFor example:\n• Lace yarn = tiny needles, 7+ stitches/inch, delicate fabric\n• Bulky yarn = large needles, 3-4 stitches/inch, thick & cozy\n\nThe app auto-fills recommended needle sizes and typical gauge when you select your yarn weight. You can always adjust if your personal gauge is different!\n\n💡 TIP: Always knit a gauge swatch to check your personal tension!')}
                className="text-slate-500 hover:text-slate-600 transition-colors"
                title="Learn about yarn weights"
              >
                <Info size={20} />
              </button>
            </div>
            <select
              value={yarnWeight}
              onChange={(e) => handleYarnWeightChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-400 focus:outline-none bg-white text-base font-medium"
            >
              {Object.entries(yarnWeights).map(([key, yarn]) => (
                <option key={key} value={key}>
                  {yarn.emoji} {yarn.name} (#{yarn.number}) - {yarn.gauge}
                </option>
              ))}
            </select>
            
            {/* Comprehensive Yarn Info Section */}
            <div className="mt-3 space-y-3">
              {/* Visual Thickness Chart */}
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-semibold text-gray-800 text-sm mb-3">📊 Yarn Thickness Comparison</h4>
                <div className="space-y-2">
                  {Object.entries(yarnWeights).map(([key, yarn]) => (
                    <div 
                      key={key}
                      className={`flex items-center gap-3 p-2 rounded ${
                        yarnWeight === key ? 'bg-slate-100 border-2 border-slate-300' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-16 text-xs font-medium text-gray-600">
                        #{yarn.number}
                      </div>
                      <div className="flex-1">
                        <div 
                          className="bg-gradient-to-r from-slate-300 to-pink-400 rounded-full"
                          style={{ 
                            height: `${yarn.thickness * 4}px`,
                            width: `${Math.min(yarn.thickness * 30, 100)}%`
                          }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-700 w-32">
                        {yarn.emoji} {yarn.name.split(' / ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Size & Gauge */}
              <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-50 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">
                      {selectedCraft === 'knit' ? '🪡 Needle Size:' : '🪝 Hook Size:'}
                    </span>
                    <div className="text-gray-700 font-medium mt-1">
                      {selectedCraft === 'knit' ? yarnWeights[yarnWeight].needles : yarnWeights[yarnWeight].hooks}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">📏 Typical Gauge:</span>
                    <div className="text-gray-700 font-medium mt-1">
                      {yarnWeights[yarnWeight].gauge}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 italic">
                  💡 {yarnWeights[yarnWeight].description}
                </p>
              </div>

              {/* Yarn Yardage Calculator */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 text-sm mb-2 flex items-center gap-2">
                  📐 Estimated Yarn Needed
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Minimum yardage:</span>
                    <span className="font-bold text-green-900">{totalYardage} yards</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Recommended (with 15% buffer):</span>
                    <span className="font-bold text-green-900 text-lg">{totalYardageWithBuffer} yards</span>
                  </div>
                  <div className="pt-2 border-t border-green-200">
                    <p className="text-xs text-gray-600">
                      💡 <strong>Tip:</strong> This estimate assumes average tension. Buy an extra skein if you knit loosely or want to be safe!
                    </p>
                  </div>
                </div>
              </div>

              {/* Shopping Links */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm mb-3 flex items-center gap-2">
                  🛒 Shop for {yarnWeights[yarnWeight].name}
                </h4>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 mb-2">Popular brands: {yarnWeights[yarnWeight].popularBrands.join(', ')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <a
                      href={yarnWeights[yarnWeight].shoppingLinks.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-center text-sm font-semibold transition-colors"
                    >
                      Amazon
                    </a>
                    <a
                      href={yarnWeights[yarnWeight].shoppingLinks.lionbrand}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center text-sm font-semibold transition-colors"
                    >
                      Lion Brand
                    </a>
                    <a
                      href={yarnWeights[yarnWeight].shoppingLinks.knitpicks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-center text-sm font-semibold transition-colors"
                    >
                      KnitPicks
                    </a>
                  </div>
                </div>
              </div>

              {/* Yarn Substitutes */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 text-sm mb-2 flex items-center gap-2">
                  🔄 Can't Find This Yarn Weight?
                </h4>
                <p className="text-sm text-gray-700 mb-2">Try these substitutes:</p>
                <ul className="space-y-1">
                  {yarnWeights[yarnWeight].substitutes.map((sub, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-600 mt-3 italic">
                  💡 Always knit a gauge swatch when substituting yarn!
                </p>
              </div>

              {/* Auto-Fill Notice */}
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-300">
                <p className="text-xs text-slate-700 font-medium text-center">
                  ✨ Gauge has been auto-populated! Adjust in the fields below if your personal gauge differs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stitches per inch
              </label>
              <input
                type="number"
                step="0.5"
                value={stitchesPerInch}
                onChange={(e) => {
                  setStitchesPerInch(parseFloat(e.target.value));
                  setWidth(Math.round(desiredWidth * parseFloat(e.target.value)));
                }}
                min="1"
                max="15"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-400 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rows per inch
              </label>
              <input
                type="number"
                step="0.5"
                value={rowsPerInch}
                onChange={(e) => setRowsPerInch(parseFloat(e.target.value))}
                min="1"
                max="20"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-400 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Desired width (inches)
              </label>
              <input
                type="number"
                value={desiredWidth}
                onChange={(e) => {
                  const newWidth = parseInt(e.target.value);
                  setDesiredWidth(newWidth);
                  setWidth(Math.round(newWidth * stitchesPerInch));
                  setSelectedPreset('custom');
                }}
                min="4"
                max="100"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-400 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Desired length (inches)
              </label>
              <input
                type="number"
                value={desiredLength}
                onChange={(e) => {
                  setDesiredLength(parseInt(e.target.value));
                  setSelectedPreset('custom');
                }}
                min="4"
                max="200"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-400 focus:outline-none bg-white"
              />
            </div>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Project Size:</span>
                <div className="font-bold text-slate-700">{desiredWidth}" × {desiredLength}"</div>
              </div>
              <div>
                <span className="text-gray-600">Cast On:</span>
                <div className="font-bold text-slate-700">{estimatedStitches} sts</div>
              </div>
              <div>
                <span className="text-gray-600">Est. Rows:</span>
                <div className="font-bold text-slate-700">{estimatedRows}</div>
              </div>
              <div>
                <span className="text-gray-600">Total Stitches:</span>
                <div className="font-bold text-slate-700">{totalStitches.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Current Width:</span>
                <div className="font-bold text-slate-700">{width} sts ({widthInInches.toFixed(1)}")</div>
              </div>
              <div className="bg-green-100 px-2 py-1 rounded">
                <span className="text-gray-600">Yarn Needed:</span>
                <div className="font-bold text-green-900">{totalYardageWithBuffer} yds</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Colorwork / Stripes (Optional) */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">🎨 Colorwork (Optional)</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={colorwork.enabled}
                onChange={(e) => setColorwork(prev => ({ ...prev, enabled: e.target.checked }))}
                className="w-5 h-5 text-slate-500 rounded"
              />
              <span className="text-sm font-semibold text-gray-700">Enable Stripes</span>
            </label>
          </div>
          
          {colorwork.enabled && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add simple stripe patterns to your project. (Full Fairisle charting coming in V4!)
              </p>
              
              {/* Color List */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Colors in Your Project:
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colorwork.colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium">{color}</span>
                      {colorwork.colors.length > 1 && (
                        <button
                          onClick={() => {
                            setColorwork(prev => ({
                              ...prev,
                              colors: prev.colors.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const newColor = prompt('Color name (e.g., "Cream", "Navy", "Color B"):');
                    if (newColor) {
                      setColorwork(prev => ({
                        ...prev,
                        colors: [...prev.colors, newColor]
                      }));
                    }
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 font-semibold"
                >
                  + Add Color
                </button>
              </div>
              
              {/* Stripe Pattern */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stripe Pattern:
                </label>
                {colorwork.pattern.map((stripe, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <select
                      value={stripe.color}
                      onChange={(e) => {
                        const newPattern = [...colorwork.pattern];
                        newPattern[idx].color = e.target.value;
                        setColorwork(prev => ({ ...prev, pattern: newPattern }));
                      }}
                      className="flex-1 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm"
                    >
                      {colorwork.colors.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={stripe.rows}
                      onChange={(e) => {
                        const newPattern = [...colorwork.pattern];
                        newPattern[idx].rows = parseInt(e.target.value);
                        setColorwork(prev => ({ ...prev, pattern: newPattern }));
                      }}
                      min="1"
                      max="100"
                      className="w-20 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm"
                    />
                    <span className="text-sm text-gray-600">rows</span>
                    <button
                      onClick={() => {
                        setColorwork(prev => ({
                          ...prev,
                          pattern: prev.pattern.filter((_, i) => i !== idx)
                        }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setColorwork(prev => ({
                      ...prev,
                      pattern: [...prev.pattern, { color: colorwork.colors[0], rows: 4 }]
                    }));
                  }}
                  className="text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  + Add Stripe
                </button>
                {colorwork.pattern.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    This pattern will repeat throughout your project
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stitch Library */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-slate-700">
                  Stitch Library
                </h2>
                <div className="flex gap-2">
                  <Youtube size={24} className="text-red-600" title="Video tutorials available!" />
                  <Palette size={24} className="text-slate-500" />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Filter by:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-slate-400 focus:outline-none text-sm"
                >
                  <option value="all">{categories.all}</option>
                  <optgroup label="By Difficulty">
                    <option value="beginner">{categories.beginner}</option>
                    <option value="easy">{categories.easy}</option>
                    <option value="intermediate">{categories.intermediate}</option>
                    <option value="advanced">{categories.advanced}</option>
                  </optgroup>
                  <optgroup label="By Type">
                    <option value="basics">{categories.basics}</option>
                    <option value="cables">{categories.cables}</option>
                    <option value="lace">{categories.lace}</option>
                    <option value="textured">{categories.textured}</option>
                    <option value="composite">{categories.composite}</option>
                    <option value="custom">{categories.custom}</option>
                  </optgroup>
                </select>
              </div>
              
              {/* Pattern Builder Button */}
              <button
                onClick={() => setPatternBuilderOpen(true)}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 font-semibold"
              >
                <span className="text-xl">✨</span>
                Build Custom Pattern
              </button>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredStitches.map((stitch) => {
                  // Difficulty color coding
                  const difficultyColors = {
                    beginner: 'bg-green-100 text-green-800 border-green-300',
                    easy: 'bg-blue-100 text-blue-800 border-blue-300',
                    intermediate: 'bg-orange-100 text-orange-800 border-orange-300',
                    advanced: 'bg-red-100 text-red-800 border-red-300'
                  };
                  
                  const difficultyIcons = {
                    beginner: '●',
                    easy: '●●',
                    intermediate: '●●●',
                    advanced: '●●●●'
                  };
                  
                  return (
                    <div
                      key={stitch.id}
                      className="relative p-3 rounded-xl border-2 border-gray-200 hover:border-slate-300 hover:shadow-lg transition-all bg-white overflow-hidden"
                    >
                      {/* Visual Stitch Pattern Background */}
                      <div 
                        className="absolute top-0 right-0 w-20 h-20 opacity-20"
                        style={{ 
                          backgroundColor: stitch.color,
                          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                        }}
                      />
                      
                      <div
                        draggable
                        onDragStart={() => handleDragStart(stitch)}
                        className="cursor-move relative z-10"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <GripVertical size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                          
                          {/* Larger, more prominent stitch symbol */}
                          <div 
                            className="w-12 h-12 flex items-center justify-center text-3xl flex-shrink-0 rounded-lg"
                            style={{ 
                              backgroundColor: stitch.color,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            {stitch.symbol}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-800 text-sm">{stitch.name}</div>
                            <div className="text-xs text-gray-600 line-clamp-2">{stitch.description}</div>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded border ${difficultyColors[stitch.difficulty]}`}>
                                {difficultyIcons[stitch.difficulty]} {stitch.difficulty}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-300">
                                ×{stitch.stitchMultiple}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Video Tutorial Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openVideoModal(stitch);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110 z-20"
                        title="Watch tutorial"
                      >
                        <Play size={16} fill="white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2">
            {/* Visual Preview */}
            {showPreview && canvas.some(s => s !== null) && (
              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye size={24} className="text-slate-500" />
                    <h3 className="text-lg font-bold text-gray-800">Visual Preview</h3>
                  </div>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-slate-500 hover:text-slate-600"
                  >
                    Hide Preview
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
                  <canvas
                    ref={previewCanvasRef}
                    className="border-2 border-gray-200 rounded"
                  />
                </div>
              </div>
            )}

            {/* Project Template Guidance */}
            {currentStructure.template && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 md:p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📐</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {projectPresets[selectedPreset].name} Template Guide
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Recommended structure ({canvas.length} of {maxSections} sections used):
                    </p>
                    <div className="space-y-2">
                      {currentStructure.template.map((section, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-start gap-2 text-sm ${
                            canvas[idx] ? 'text-green-700' : section.required ? 'text-gray-800' : 'text-gray-500'
                          }`}
                        >
                          <span className="flex-shrink-0">
                            {canvas[idx] ? '✅' : section.required ? '📍' : '○'}
                          </span>
                          <div>
                            <span className="font-semibold">{section.name}</span>
                            {section.required && <span className="text-red-600 ml-1">*</span>}
                            {section.suggestion && (
                              <div className="text-xs text-gray-600 mt-0.5">
                                💡 {section.suggestion}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {canvas.length >= maxSections && (
                      <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          ⚠️ You've reached the recommended maximum of {maxSections} sections for this project type.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-slate-700">
                  Your Pattern
                </h2>
                <button
                  onClick={addSection}
                  disabled={canvas.length >= maxSections}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                    canvas.length >= maxSections
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-slate-500 text-white hover:bg-slate-600'
                  }`}
                >
                  <Plus size={18} />
                  Add Section {canvas.length >= maxSections && `(Max ${maxSections})`}
                </button>
              </div>

              {canvas.length === 0 ? (
                <div className="text-center py-12 md:py-16 border-4 border-dashed border-gray-300 rounded-xl">
                  <p className="text-gray-500 text-base md:text-lg mb-2">
                    Your pattern canvas is empty
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click "Add Section" then drag stitches here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {canvas.map((section, index) => {
                    // Difficulty color coding
                    const difficultyColors = {
                      beginner: 'bg-green-100 text-green-800 border-green-300',
                      easy: 'bg-blue-100 text-blue-800 border-blue-300',
                      intermediate: 'bg-orange-100 text-orange-800 border-orange-300',
                      advanced: 'bg-red-100 text-red-800 border-red-300'
                    };
                    
                    const difficultyIcons = {
                      beginner: '●',
                      easy: '●●',
                      intermediate: '●●●',
                      advanced: '●●●●'
                    };
                    
                    return (
                      <div
                        key={index}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        className={`p-4 md:p-6 rounded-xl border-4 border-dashed transition-all ${
                          section
                            ? 'border-slate-300 shadow-lg'
                            : 'border-gray-300 hover:border-slate-300'
                        }`}
                        style={section ? { backgroundColor: section.color } : {}}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0 mt-1">
                              Section {index + 1}
                            </span>
                            {section && (
                              <>
                                <span className="text-3xl md:text-4xl flex-shrink-0">{section.symbol}</span>
                                <div className="min-w-0">
                                  <div className="font-bold text-gray-800 text-sm md:text-base">
                                    {section.name}
                                  </div>
                                  <div className="text-xs md:text-sm text-gray-600">
                                    {section.description}
                                  </div>
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${difficultyColors[section.difficulty]}`}>
                                      {difficultyIcons[section.difficulty]} {section.difficulty}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 bg-white/70 rounded">
                                      {section.rowRepeat} row repeat
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {section && (
                              <button
                                onClick={() => openVideoModal(section)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Watch tutorial"
                              >
                                <Play size={16} fill="white" />
                              </button>
                            )}
                            <button
                              onClick={() => removeSection(index)}
                              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        {!section && (
                          <p className="text-center text-gray-400 py-4 text-sm">
                            Drag a stitch here
                          </p>
                        )}
                        {section && (
                          <div className="mt-3 text-xs md:text-sm text-gray-600 bg-white/50 p-3 rounded-lg">
                            {section.pattern.map((row, idx) => (
                              <div key={idx} className="mb-1">{row}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pattern Output */}
            {canvas.some(s => s !== null) && (
              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-700">
                    Generated Pattern
                  </h2>
                  <button
                    onClick={downloadPattern}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 md:p-6 rounded-xl text-xs md:text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                  {generatePattern()}
                </pre>
              </div>
            )}
          </div>
        </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-xs md:text-sm space-y-2">
          <p className="font-bold text-slate-700 text-base">🎉 Complete Pattern Design System</p>
          <p>💡 Drag stitches from the library to build your pattern</p>
          <p>📏 Choose from <strong>33 preset sizes</strong> including scarves, cowls, hats, bags, tech cozies, home goods & more!</p>
          <p>🧶 <strong>Comprehensive Yarn Helper:</strong> Visual thickness chart • Yardage calculator • Shopping links • Substitution guide</p>
          <p>🌟 View example projects & share your own creations in the community gallery!</p>
          <p>🎯 22 stitches organized by difficulty: <span className="text-green-700">● Beginner</span> → <span className="text-blue-700">●● Easy</span> → <span className="text-orange-700">●●● Intermediate</span> → <span className="text-red-700">●●●● Advanced</span></p>
          <p>📺 Video tutorials for every stitch • 👁️ Live visual preview • 📐 Auto gauge calculator</p>
        </div>

        {/* Video Modal */}
        {videoModalOpen && currentVideo && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={closeVideoModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-500 to-slate-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Youtube className="text-white" size={28} />
                  <div>
                    <h3 className="text-white font-bold text-lg">{currentVideo.name}</h3>
                    <p className="text-white/80 text-sm">{currentVideo.videoTitle}</p>
                  </div>
                </div>
                <button
                  onClick={closeVideoModal}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Video Container */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={currentVideo.videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentVideo.videoTitle}
                />
              </div>

              {/* Stitch Info */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Pattern Instructions:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {currentVideo.pattern.map((row, idx) => (
                        <div key={idx}>{row}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Stitch Details:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className="font-semibold text-gray-800 capitalize">{currentVideo.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stitch Multiple:</span>
                        <span className="font-semibold text-gray-800">{currentVideo.stitchMultiple}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Row Repeat:</span>
                        <span className="font-semibold text-gray-800">{currentVideo.rowRepeat} rows</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-semibold text-gray-800 capitalize">{currentVideo.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Add the stitch to the first empty section or create new section
                    const emptyIndex = canvas.findIndex(s => s === null);
                    if (emptyIndex !== -1) {
                      handleDrop(emptyIndex);
                      setDraggedStitch(currentVideo);
                    } else {
                      setCanvas([...canvas, currentVideo]);
                    }
                    closeVideoModal();
                  }}
                  className="mt-4 w-full px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                >
                  Add This Stitch to My Pattern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pattern Builder Modal */}
        {patternBuilderOpen && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setPatternBuilderOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">✨</span>
                    <div>
                      <h3 className="text-white font-bold text-2xl">Pattern Builder</h3>
                      <p className="text-white/90 text-sm">Create your own multi-row stitch pattern</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPatternBuilderOpen(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>

              {/* Builder Content */}
              <div className="p-6 space-y-6">
                {/* Pattern Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Pattern Name *
                  </label>
                  <input
                    type="text"
                    value={buildingPattern.name}
                    onChange={(e) => setBuildingPattern(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., My Custom Cable, Textured X Pattern"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none text-base"
                  />
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['beginner', 'easy', 'intermediate', 'advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setBuildingPattern(prev => ({ ...prev, difficulty: level }))}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          buildingPattern.difficulty === level
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Add Rows to Your Pattern
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentRow}
                      onChange={(e) => setCurrentRow(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addRowToPattern()}
                      placeholder="e.g., Row 1: K2, P2, repeat to end"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none text-base"
                    />
                    <button
                      onClick={addRowToPattern}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
                    >
                      Add Row
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Be specific! Include row numbers and full instructions. Press Enter or click "Add Row"
                  </p>
                </div>

                {/* Pattern Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-gray-800">
                      Pattern Preview ({buildingPattern.rows.length} rows)
                    </label>
                    {buildingPattern.rows.length > 0 && (
                      <button
                        onClick={clearBuilder}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {buildingPattern.rows.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-gray-400 text-sm">No rows added yet. Start building your pattern above!</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                      {buildingPattern.rows.map((row, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex-1">
                            <span className="text-xs font-bold text-emerald-600">Row {index + 1}</span>
                            <p className="text-sm text-gray-800 mt-1">{row}</p>
                          </div>
                          <button
                            onClick={() => deleteRow(index)}
                            className="ml-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Common Abbreviations Helper */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 text-sm mb-2">📚 Common Abbreviations:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-700">
                    <div><strong>K</strong> - Knit</div>
                    <div><strong>P</strong> - Purl</div>
                    <div><strong>YO</strong> - Yarn Over</div>
                    <div><strong>K2tog</strong> - Knit 2 together</div>
                    <div><strong>SSK</strong> - Slip Slip Knit</div>
                    <div><strong>Sl</strong> - Slip stitch</div>
                    <div><strong>RS</strong> - Right side</div>
                    <div><strong>WS</strong> - Wrong side</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setPatternBuilderOpen(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCustomPattern}
                    disabled={!buildingPattern.name.trim() || buildingPattern.rows.length === 0}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      buildingPattern.name.trim() && buildingPattern.rows.length > 0
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save Pattern ✨
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Example Gallery Modal */}
        {exampleGalleryOpen && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeExampleGallery}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-500 to-slate-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-2xl">{projectPresets[selectedPreset].name} Gallery</h3>
                    <p className="text-white/90 text-sm mt-1">See what the community has created! ✨</p>
                  </div>
                  <button
                    onClick={closeExampleGallery}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Example Projects Grid */}
              <div className="p-6 bg-gray-50 max-h-[600px] overflow-y-auto">
                {currentPresetExamples.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No examples yet for this project type</p>
                    <p className="text-gray-400">Be the first to share your creation!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentPresetExamples.map((example) => (
                      <div 
                        key={example.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-slate-200 hover:border-slate-300 transition-all"
                      >
                        {/* Project Image/Emoji */}
                        <div className="bg-gradient-to-br from-slate-100 to-slate-100 h-48 flex items-center justify-center text-8xl">
                          {example.emoji}
                        </div>
                        
                        {/* Project Info */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-lg text-gray-800">{example.title}</h4>
                              <p className="text-sm text-slate-500">by {example.user}</p>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                              ⏱️ {example.time}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4">{example.description}</p>
                          
                          {/* Project Details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-gray-700 min-w-[80px]">Stitches:</span>
                              <div className="flex flex-wrap gap-1">
                                {example.stitches.map((stitch, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                    {stitch}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700 min-w-[80px]">Yarn:</span>
                              <span className="text-gray-600">{example.yarn}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700 min-w-[80px]">Gauge:</span>
                              <span className="text-gray-600">{example.gauge}</span>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          {example.user === 'Kate (You)' ? (
                            <button 
                              className="mt-4 w-full px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                              onClick={() => {
                                closeExampleGallery();
                              }}
                            >
                              Use This Design
                            </button>
                          ) : (
                            <button 
                              className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-slate-400 to-slate-400 text-white rounded-lg hover:from-slate-500 hover:to-slate-500 transition-colors font-semibold"
                              onClick={() => alert('Upload feature coming soon! You\'ll be able to share photos and details of your finished projects.')}
                            >
                              📸 Upload Your Project
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Community Upload Section */}
                <div className="mt-6 p-6 bg-gradient-to-r from-slate-100 to-slate-100 rounded-xl border-2 border-dashed border-slate-300">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">📸 Share Your Creation!</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Made a {projectPresets[selectedPreset].name}? Upload your photo and inspire others!
                  </p>
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-slate-400 to-slate-400 text-white rounded-lg hover:from-slate-500 hover:to-slate-500 transition-all shadow-lg font-semibold"
                    onClick={() => alert('🎉 Upload feature coming soon!\n\nYou\'ll be able to:\n• Upload project photos\n• Share your pattern modifications\n• Add yarn & time details\n• Inspire other makers!')}
                  >
                    Upload Your Project
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    💡 Coming soon: Full community gallery with likes, comments, and pattern sharing!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YarnOverApp;
