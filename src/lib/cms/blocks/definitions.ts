import type { BlockDefinition } from './types';

/**
 * Per-block editor configuration: which fields appear in the page builder and
 * what a freshly added block starts with. Defaults mirror the live site so new
 * blocks look right immediately.
 */

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
];

export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  hero: {
    type: 'hero',
    label: 'Hero',
    description: 'Full-screen brand intro with logo and scroll button.',
    fields: [
      { kind: 'text', path: 'tagline', label: 'Tagline' },
      { kind: 'text', path: 'button_text', label: 'Button Label' },
      { kind: 'text', path: 'button_target', label: 'Button Target (#anchor or /url)' },
    ],
    defaultData: () => ({
      tagline: 'Engineering for the Micron Absolute',
      button_text: 'Explore Site',
      button_target: '#why-us',
    }),
  },

  features: {
    type: 'features',
    label: 'Features (Why Choose Us)',
    description: 'Bento grid of advantages with rotating icons.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow Label' },
      { kind: 'text', path: 'title_plain', label: 'Title (plain line)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent line)' },
      {
        kind: 'list',
        path: 'items',
        label: 'Feature Cards',
        itemLabelKey: 'title',
        maxItems: 12,
        defaultItem: { title: '', description: '' },
        itemFields: [
          { kind: 'text', path: 'title', label: 'Title' },
          { kind: 'textarea', path: 'description', label: 'Description', rows: 3 },
        ],
      },
    ],
    defaultData: () => ({
      eyebrow: 'Advantages',
      title_plain: 'Why Choose',
      title_accent: 'Us?',
      items: [{ title: 'New advantage', description: 'Describe it here.' }],
    }),
  },

  products: {
    type: 'products',
    label: 'Product Portfolio',
    description: 'Square image grid of products/components.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow Label' },
      { kind: 'text', path: 'title_plain', label: 'Title (plain line)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent line)' },
      { kind: 'textarea', path: 'quote', label: 'Side Quote', rows: 2 },
      {
        kind: 'list',
        path: 'items',
        label: 'Products',
        itemLabelKey: 'title',
        maxItems: 64,
        defaultItem: { title: '', image_url: '' },
        itemFields: [
          { kind: 'text', path: 'title', label: 'Title' },
          { kind: 'image', path: 'image_url', label: 'Image' },
        ],
      },
    ],
    defaultData: () => ({
      eyebrow: 'Component Manifest',
      title_plain: 'Precision',
      title_accent: 'Product Portfolio.',
      quote: '"Engineered for reliability, manufactured for micron-level fidelity."',
      items: [{ title: 'New Product', image_url: '' }],
    }),
  },

  usps: {
    type: 'usps',
    label: "USP's",
    description: 'Grid of unique selling points.',
    fields: [
      { kind: 'text', path: 'title_plain', label: 'Title (plain line)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent word)' },
      { kind: 'textarea', path: 'intro', label: 'Intro Text', rows: 2 },
      {
        kind: 'list',
        path: 'items',
        label: 'USP Cards',
        itemLabelKey: 'title',
        maxItems: 24,
        defaultItem: { title: '', description: '' },
        itemFields: [
          { kind: 'text', path: 'title', label: 'Title' },
          { kind: 'textarea', path: 'description', label: 'Description', rows: 4 },
        ],
      },
    ],
    defaultData: () => ({
      title_plain: 'Our',
      title_accent: "USP's",
      intro: 'What sets us apart in the manufacturing landscape.',
      items: [{ title: 'New USP', description: 'Describe it here.' }],
    }),
  },

  customers: {
    type: 'customers',
    label: 'Customers',
    description: 'Centered strip of customer/brand badges.',
    fields: [
      { kind: 'text', path: 'title_plain', label: 'Title (plain word)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent word)' },
      { kind: 'textarea', path: 'subtitle', label: 'Subtitle', rows: 2 },
      {
        kind: 'stringList',
        path: 'items',
        label: 'Customer Labels',
        placeholder: 'e.g. Leading Electrical Switchgear Brands',
        maxItems: 24,
      },
    ],
    defaultData: () => ({
      title_plain: 'Our',
      title_accent: 'Customers',
      subtitle: 'Trusted by industry leaders across the globe.',
      items: ['New Customer'],
    }),
  },

  services: {
    type: 'services',
    label: 'Services Grid',
    description: 'Dense capabilities grid with icons and spec lists.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow Label' },
      { kind: 'text', path: 'title_plain', label: 'Title (plain line)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent line)' },
      {
        kind: 'list',
        path: 'items',
        label: 'Services',
        itemLabelKey: 'title',
        maxItems: 36,
        defaultItem: { title: '', icon: 'Cog', points: [] },
        itemFields: [
          { kind: 'text', path: 'title', label: 'Service Title' },
          {
            kind: 'select',
            path: 'icon',
            label: 'Icon',
            options: [
              { value: 'Settings', label: 'Settings' },
              { value: 'Shield', label: 'Shield' },
              { value: 'Target', label: 'Target' },
              { value: 'Cpu', label: 'Cpu' },
              { value: 'Layers', label: 'Layers' },
              { value: 'Zap', label: 'Zap' },
              { value: 'Hammer', label: 'Hammer' },
              { value: 'Scissors', label: 'Scissors' },
              { value: 'Flame', label: 'Flame' },
              { value: 'Maximize', label: 'Maximize' },
              { value: 'PenTool', label: 'Pen Tool' },
              { value: 'Box', label: 'Box' },
              { value: 'HardHat', label: 'Hard Hat' },
              { value: 'Truck', label: 'Truck' },
              { value: 'Wrench', label: 'Wrench' },
              { value: 'Factory', label: 'Factory' },
              { value: 'RotateCcw', label: 'Rotate' },
              { value: 'Gauge', label: 'Gauge' },
              { value: 'Drill', label: 'Drill' },
              { value: 'ScanLine', label: 'Scan Line' },
              { value: 'Minus', label: 'Minus' },
              { value: 'CircleDot', label: 'Circle Dot' },
              { value: 'Cog', label: 'Cog' },
            ],
          },
          {
            kind: 'stringList',
            path: 'points',
            label: 'Spec Points',
            placeholder: 'e.g. Jaw-chuck size: 200mm',
            maxItems: 12,
          },
        ],
      },
    ],
    defaultData: () => ({
      eyebrow: 'Capabilities',
      title_plain: 'Industrial',
      title_accent: 'Solutions Grid.',
      items: [{ title: 'New Service', icon: 'Cog', points: ['Specification…'] }],
    }),
  },

  industries: {
    type: 'industries',
    label: 'Industries',
    description: 'Sectors-we-serve cards with generated descriptions.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow Label' },
      { kind: 'text', path: 'title_plain', label: 'Title (plain line)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent line)' },
      { kind: 'textarea', path: 'intro', label: 'Intro Text', rows: 3 },
      {
        kind: 'stringList',
        path: 'items',
        label: 'Industries',
        placeholder: 'e.g. Switchgear electrical',
        maxItems: 10,
      },
    ],
    defaultData: () => ({
      eyebrow: 'Our Sectors',
      title_plain: 'Sectors We',
      title_accent: 'Work In.',
      intro:
        'We provide precision manufacturing solutions tailored to the unique demands of multiple critical industries.',
      items: ['New Industry'],
    }),
  },

  fleet: {
    type: 'fleet',
    label: 'Fleet / Machinery',
    description: 'Machinery list plus specification table.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow Label' },
      { kind: 'text', path: 'title_plain', label: 'Title (plain line)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent line)' },
      { kind: 'textarea', path: 'note', label: 'Side Note', rows: 2 },
      {
        kind: 'stringList',
        path: 'machines',
        label: 'Machines',
        placeholder: 'e.g. Vertical Milling Machines',
        maxItems: 18,
      },
      {
        kind: 'list',
        path: 'spec_rows',
        label: 'Spec Table Rows',
        itemLabelKey: 'machine_class',
        maxItems: 20,
        defaultItem: { machine_class: '', specification: '', application: '' },
        itemFields: [
          { kind: 'text', path: 'machine_class', label: 'Machine Class' },
          { kind: 'text', path: 'specification', label: 'Specification' },
          { kind: 'text', path: 'application', label: 'Primary Application' },
        ],
      },
    ],
    defaultData: () => ({
      eyebrow: 'Infrastructure',
      title_plain: 'Our Precision',
      title_accent: 'Machinery.',
      note: 'Tier-1 equipment maintained to micron-level accuracy standards.',
      machines: ['New Machine'],
      spec_rows: [{ machine_class: 'CNC VMC', specification: '800x500x500 MM', application: 'Complex Profile Milling' }],
    }),
  },

  gallery: {
    type: 'gallery',
    label: 'Gallery',
    description: 'Three-column process photo gallery.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow Label' },
      { kind: 'text', path: 'title_plain', label: 'Title (plain line)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent line)' },
      { kind: 'textarea', path: 'note', label: 'Side Note', rows: 2 },
      {
        kind: 'list',
        path: 'images',
        label: 'Images',
        itemLabelKey: 'title',
        maxItems: 24,
        defaultItem: { url: '', title: '', category: 'Process' },
        itemFields: [
          { kind: 'image', path: 'url', label: 'Image' },
          { kind: 'text', path: 'title', label: 'Title' },
          { kind: 'text', path: 'category', label: 'Category Tag' },
        ],
      },
    ],
    defaultData: () => ({
      eyebrow: 'Visuals',
      title_plain: 'The Shop',
      title_accent: 'Floor.',
      note: 'Capturing the raw precision of our daily operations.',
      images: [{ url: '', title: 'New Photo', category: 'Process' }],
    }),
  },

  about: {
    type: 'about',
    label: 'About / Philosophy',
    description: 'Brand narrative with mission/vision pillars.',
    fields: [
      { kind: 'text', path: 'established_label', label: 'Established Label' },
      { kind: 'text', path: 'title_plain', label: 'Title Line 1' },
      { kind: 'text', path: 'title_accent', label: 'Title Accent Word' },
      { kind: 'text', path: 'title_suffix', label: 'Title Suffix' },
      { kind: 'text', path: 'side_note', label: 'Side Note' },
      { kind: 'textarea', path: 'narrative_lead', label: 'Narrative Lead (supports **bold**)', rows: 3 },
      { kind: 'textarea', path: 'narrative_body', label: 'Narrative Body (supports **bold**)', rows: 4 },
      {
        kind: 'list',
        path: 'pillars',
        label: 'Pillars (Mission/Vision)',
        itemLabelKey: 'title',
        maxItems: 6,
        defaultItem: { title: '', description: '', icon: 'Target' },
        itemFields: [
          { kind: 'text', path: 'title', label: 'Title' },
          { kind: 'textarea', path: 'description', label: 'Description', rows: 3 },
          {
            kind: 'select',
            path: 'icon',
            label: 'Icon',
            options: [
              { value: 'Target', label: 'Target' },
              { value: 'Shield', label: 'Shield' },
              { value: 'Settings', label: 'Settings' },
              { value: 'Zap', label: 'Zap' },
              { value: 'Factory', label: 'Factory' },
              { value: 'Wrench', label: 'Wrench' },
            ],
          },
        ],
      },
      { kind: 'image', path: 'image_url', label: 'Wide Image' },
    ],
    defaultData: () => ({
      established_label: 'Established 2012',
      title_plain: 'THE',
      title_accent: 'MAGNUS',
      title_suffix: 'CORE.',
      side_note: 'Engineered in Nashik. Deployed Globally.',
      narrative_lead:
        'Magnus Enterprises is a **high-precision** manufacturing hub dedicated to the electrical, switchgear, and heavy engineering sectors.',
      narrative_body:
        'Since 2012, we have specialized in bridging the gap between complex design and physical reality. Our operations are governed by a single metric: **Geometric Fidelity.**',
      pillars: [{ title: 'Our Vision', description: 'Describe it here.', icon: 'Target' }],
      image_url: '',
    }),
  },

  quality: {
    type: 'quality',
    label: 'Quality Quote',
    description: 'Centered certification statement with checklist.',
    fields: [
      { kind: 'textarea', path: 'quote_plain', label: 'Quote (plain part)', rows: 3 },
      { kind: 'text', path: 'quote_accent', label: 'Quote (accent ending)' },
      { kind: 'text', path: 'certification', label: 'Certification Title' },
      { kind: 'text', path: 'certification_sub', label: 'Certification Subtitle' },
      {
        kind: 'stringList',
        path: 'checklist',
        label: 'Checklist Items',
        placeholder: 'e.g. Multi-stage micron inspection',
        maxItems: 8,
      },
    ],
    defaultData: () => ({
      quote_plain: '"Quality is not an act, it is a habit. In our workshop,',
      quote_accent: 'it is the law."',
      certification: 'ISO 9001:2015',
      certification_sub: 'Certificated Facility',
      checklist: ['Multi-stage micron inspection'],
    }),
  },

  contact: {
    type: 'contact',
    label: 'Contact',
    description: 'Contact details + inquiry form. Details come from Site Settings.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow Label' },
      { kind: 'text', path: 'title_plain', label: 'Title (plain lines)' },
      { kind: 'text', path: 'title_accent', label: 'Title (accent words)' },
    ],
    defaultData: () => ({
      eyebrow: 'Inquiries',
      title_plain: 'START A',
      title_accent: 'PRECISION PROJECT.',
    }),
  },

  text: {
    type: 'text',
    label: 'Text Section',
    description: 'Simple heading + paragraph section.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow (optional)' },
      { kind: 'text', path: 'heading', label: 'Heading (optional)' },
      { kind: 'textarea', path: 'body', label: 'Body (blank line = new paragraph; **bold** supported)', rows: 8 },
      { kind: 'select', path: 'align', label: 'Alignment', options: alignOptions },
    ],
    defaultData: () => ({
      heading: 'Section Heading',
      body: 'Write your content here.',
      align: 'left',
    }),
  },

  image: {
    type: 'image',
    label: 'Image',
    description: 'Single image with optional caption.',
    fields: [
      { kind: 'image', path: 'url', label: 'Image' },
      { kind: 'text', path: 'alt', label: 'Alt Text' },
      { kind: 'text', path: 'caption', label: 'Caption (optional)' },
      { kind: 'boolean', path: 'full_width', label: 'Full Width' },
    ],
    defaultData: () => ({ url: '', alt: '', full_width: false }),
  },

  pricing: {
    type: 'pricing',
    label: 'Pricing',
    description: 'Up to four pricing tiers.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow (optional)' },
      { kind: 'text', path: 'heading', label: 'Heading' },
      {
        kind: 'list',
        path: 'tiers',
        label: 'Tiers',
        itemLabelKey: 'name',
        maxItems: 4,
        defaultItem: {
          name: 'Tier',
          price: '₹0',
          period: '/mo',
          description: '',
          features: [],
          highlighted: false,
          button_text: 'Get Started',
          button_url: '#contact',
        },
        itemFields: [
          { kind: 'text', path: 'name', label: 'Name' },
          { kind: 'text', path: 'price', label: 'Price' },
          { kind: 'text', path: 'period', label: 'Period' },
          { kind: 'textarea', path: 'description', label: 'Description', rows: 2 },
          {
            kind: 'stringList',
            path: 'features',
            label: 'Features',
            placeholder: 'e.g. Rapid turnaround',
            maxItems: 10,
          },
          { kind: 'boolean', path: 'highlighted', label: 'Highlight this tier' },
          { kind: 'text', path: 'button_text', label: 'Button Label' },
          { kind: 'text', path: 'button_url', label: 'Button URL' },
        ],
      },
    ],
    defaultData: () => ({
      heading: 'Engagement Models',
      tiers: [
        {
          name: 'Prototype',
          price: 'Custom',
          period: '',
          description: 'Validate your design fast.',
          features: ['Rapid turnaround', 'DFM feedback'],
          highlighted: false,
          button_text: 'Start Now',
          button_url: '#contact',
        },
      ],
    }),
  },

  testimonials: {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Client quotes grid.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow (optional)' },
      { kind: 'text', path: 'heading', label: 'Heading' },
      {
        kind: 'list',
        path: 'items',
        label: 'Testimonials',
        itemLabelKey: 'author',
        maxItems: 9,
        defaultItem: { quote: '', author: '', role: '' },
        itemFields: [
          { kind: 'textarea', path: 'quote', label: 'Quote', rows: 3 },
          { kind: 'text', path: 'author', label: 'Author' },
          { kind: 'text', path: 'role', label: 'Role / Company' },
        ],
      },
    ],
    defaultData: () => ({
      heading: 'What Partners Say',
      items: [{ quote: 'Excellent precision and reliability.', author: 'New Author', role: 'Company' }],
    }),
  },

  faq: {
    type: 'faq',
    label: 'FAQ',
    description: 'Expandable question/answer accordion.',
    fields: [
      { kind: 'text', path: 'eyebrow', label: 'Eyebrow (optional)' },
      { kind: 'text', path: 'heading', label: 'Heading' },
      {
        kind: 'list',
        path: 'items',
        label: 'Questions',
        itemLabelKey: 'question',
        maxItems: 20,
        defaultItem: { question: '', answer: '' },
        itemFields: [
          { kind: 'text', path: 'question', label: 'Question' },
          { kind: 'textarea', path: 'answer', label: 'Answer', rows: 3 },
        ],
      },
    ],
    defaultData: () => ({
      heading: 'Frequently Asked Questions',
      items: [{ question: 'New question?', answer: 'The answer.' }],
    }),
  },

  cta: {
    type: 'cta',
    label: 'Call To Action',
    description: 'Full-width banner with primary/secondary buttons.',
    fields: [
      { kind: 'text', path: 'heading', label: 'Heading' },
      { kind: 'textarea', path: 'subheading', label: 'Subheading (optional)', rows: 2 },
      { kind: 'text', path: 'button_text', label: 'Primary Button Label' },
      { kind: 'text', path: 'button_url', label: 'Primary Button URL' },
      { kind: 'text', path: 'secondary_button_text', label: 'Secondary Button Label (optional)' },
      { kind: 'text', path: 'secondary_button_url', label: 'Secondary Button URL (optional)' },
    ],
    defaultData: () => ({
      heading: 'Ready to build something precise?',
      subheading: 'Tell us about your project and get a response within one business day.',
      button_text: 'Contact Us',
      button_url: '#contact',
    }),
  },

  custom: {
    type: 'custom',
    label: 'Custom',
    description: 'Free-form key/value entries with optional text.',
    fields: [
      { kind: 'text', path: 'heading', label: 'Heading (optional)' },
      { kind: 'textarea', path: 'body', label: 'Body (optional)', rows: 4 },
      {
        kind: 'list',
        path: 'entries',
        label: 'Entries',
        itemLabelKey: 'label',
        maxItems: 30,
        defaultItem: { label: '', value: '' },
        itemFields: [
          { kind: 'text', path: 'label', label: 'Label' },
          { kind: 'text', path: 'value', label: 'Value' },
        ],
      },
    ],
    defaultData: () => ({ entries: [{ label: 'Label', value: 'Value' }] }),
  },
};

/** Ordered list shown in the "Add block" picker. */
export const BLOCK_TYPE_ORDER = [
  'hero',
  'features',
  'products',
  'usps',
  'customers',
  'services',
  'industries',
  'fleet',
  'gallery',
  'about',
  'quality',
  'contact',
  'text',
  'image',
  'pricing',
  'testimonials',
  'faq',
  'cta',
  'custom',
] as const;
