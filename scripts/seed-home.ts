import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SECTIONS: Array<{ type: string; data: Record<string, unknown> }> = [
  {
    type: 'hero',
    data: {
      tagline: 'Engineering for the Micron Absolute',
      button_text: 'Explore Site',
      button_target: '#why-us',
    },
  },
  {
    type: 'features',
    data: {
      eyebrow: 'Advantages',
      title_plain: 'Why Choose',
      title_accent: 'Us?',
      items: [
        {
          title: 'ISO 9001:2015 Certified Manufacturing Process',
          description:
            'Our entire manufacturing pipeline is certified to meet rigorous international quality standards.',
        },
        {
          title: 'Advanced CNC & Milling Infrastructure',
          description:
            'Equipped with state-of-the-art machinery capable of handling complex geometries.',
        },
        {
          title: 'Precision Inspection Equipment',
          description:
            'Every component undergoes strict multi-stage inspection using calibrated instruments.',
        },
        {
          title: 'Experienced Engineering Team',
          description:
            'Our team consists of highly skilled engineers with decades of industrial experience.',
        },
        {
          title: 'High Quality Industrial Components',
          description:
            'We source only premium materials to manufacture parts that withstand tough environments.',
        },
        {
          title: 'Custom Manufacturing Capabilities',
          description:
            'From prototypes to mass production, our flexible setup adapts to your requirements.',
        },
        {
          title: 'Reliable Turnaround & Support',
          description:
            'Streamlined processes and dedicated logistics ensure products are delivered exactly when needed.',
        },
      ],
    },
  },
  {
    type: 'products',
    data: {
      eyebrow: 'Component Manifest',
      title_plain: 'PRECISION',
      title_accent: 'PRODUCT PORTFOLIO.',
      quote: '"Engineered for reliability, manufactured for micron-level fidelity."',
      items: [
        { title: 'CNC Machined Component 01', image_url: '/product-1.jpeg' },
        { title: 'Precision Bush & Shaft', image_url: '/product-2.jpeg' },
        { title: 'Copper Connector Part', image_url: '/product-3.jpeg' },
        { title: 'Switchgear Mechanism', image_url: '/product-4.jpeg' },
        { title: 'Industrial Fitting', image_url: '/product-5.jpeg' },
        { title: 'Aluminum Profile Part', image_url: '/product-6.jpeg' },
        { title: 'Custom Steel Assembly', image_url: '/product-7.jpeg' },
        { title: 'Brass Precision Part', image_url: '/product-8.jpeg' },
        { title: 'CNC Milled Plate', image_url: '/product-9.jpeg' },
        { title: 'Machined Housing', image_url: '/product-10.jpeg' },
        { title: 'Internal Gear Component', image_url: '/product-11.jpeg' },
        { title: 'Precision Ring Setup', image_url: '/product-12.jpeg' },
        { title: 'Industrial Coupling', image_url: '/product-13.jpeg' },
        { title: 'Custom Flange Piece', image_url: '/product-14.jpeg' },
        { title: 'Aerospace Grade Part', image_url: '/product-15.jpeg' },
        { title: 'Power Distribution Component', image_url: '/product-16.jpeg' },
        { title: 'Mechanism Drive Shaft', image_url: '/product-17.jpeg' },
        { title: 'Heavy Duty Bracket', image_url: '/product-18.jpeg' },
        { title: 'Precision Valve Body', image_url: '/product-19.jpeg' },
        { title: 'Hydraulic System Part', image_url: '/product-20.jpeg' },
        { title: 'Machined Casting', image_url: '/product-21.jpeg' },
        { title: 'Specialized Bolt Plate', image_url: '/product-22.jpeg' },
        { title: 'Engineered Support Hub', image_url: '/product-23.jpeg' },
        { title: 'High-Tolerance Spacer', image_url: '/product-24.jpeg' },
        { title: 'Custom Threaded Part', image_url: '/product-25.jpeg' },
        { title: 'Switchgear Base Plate', image_url: '/product-26.jpeg' },
        { title: 'Rotary Component', image_url: '/product-27.jpeg' },
        { title: 'Precision Guide Rail', image_url: '/product-28.jpeg' },
        { title: 'Machined Mounting Kit', image_url: '/product-29.jpeg' },
        { title: 'Industrial Bearing Hub', image_url: '/product-30.jpeg' },
        { title: 'Custom Tooling Head', image_url: '/product-31.jpeg' },
        { title: 'Final Assembly Part', image_url: '/product-32.jpeg' },
      ],
    },
  },
  {
    type: 'usps',
    data: {
      title_plain: 'Our',
      title_accent: "USP's",
      intro: 'What sets us apart in the manufacturing landscape.',
      items: [
        {
          title: 'Precision Engineering',
          description:
            'We manufacture components with tight tolerances using advanced CNC and VMC machines. Every part is made to exact specifications — no shortcuts.',
        },
        {
          title: 'Rapid Turnaround',
          description:
            'Our streamlined production process means faster delivery without sacrificing quality. We respect your deadlines and plan accordingly.',
        },
        {
          title: 'End-to-End Solutions',
          description:
            'From prototyping to final assembly, we handle the entire manufacturing lifecycle under one roof — saving you time, cost, and coordination effort.',
        },
        {
          title: 'Multi-Industry Experience',
          description:
            'We serve switchgear, automobile, agriculture, poultry, and aeronautics industries. Our team understands the unique requirements of each sector.',
        },
        {
          title: 'In-House Quality Control',
          description:
            'We use calibrated instruments — digital verniers, micrometers, and dial gauges — to inspect every component before it leaves our facility.',
        },
        {
          title: 'Flexible & Scalable',
          description:
            "Whether it's a single prototype or a large production batch, we adapt to your volume requirements without compromising on consistency.",
        },
        {
          title: 'Experienced Team',
          description:
            'Our engineers and machinists bring years of hands-on experience in precision manufacturing, ensuring reliable output every time.',
        },
        {
          title: 'Trusted by Leading Brands',
          description:
            'We are a preferred manufacturing partner for top companies in electrical switchgear, automobile, and other critical industries.',
        },
      ],
    },
  },
  {
    type: 'customers',
    data: {
      title_plain: 'Our',
      title_accent: 'Customers',
      subtitle: 'Trusted by industry leaders across the globe.',
      items: [
        'Leading Electrical Switchgear Brands',
        'Top Automobile Manufacturers',
        'Agricultural Equipment Producers',
        'Aerospace & Aeronautics Innovators',
        'Poultry Infrastructure Providers',
      ],
    },
  },
  {
    type: 'services',
    data: {
      eyebrow: 'Capabilities',
      title_plain: 'INDUSTRIAL',
      title_accent: 'SOLUTIONS GRID.',
      items: [
        {
          title: 'CNC Milling & Turning',
          icon: 'RotateCcw',
          points: [
            'CNC Turning 1:',
            'Jaw-chuck size: 200mm',
            'Max turning length: 325mm',
            'Bore size: 40mm',
            'CNC Turning 2:',
            'Chuck size: 250mm',
            'Max turning length: 425mm',
            'Bore size: 60mm',
          ],
        },
        {
          title: 'VMC Milling',
          icon: 'Cpu',
          points: [
            'VMC Milling 1:',
            'Bed size: 800 x 450',
            'X axis travel x Y axis travel x Z axis travel: 650 x 450 x 500',
            'Controller: Siemens',
            'VMC Milling 2:',
            'Bed size: 1000 x 500',
            'X x Y x Z: 800 x 500 x 500',
            '4th axis to be added',
          ],
        },
        {
          title: 'DRO Milling',
          icon: 'Gauge',
          points: ['Bed size: 1270 x 254', 'X x Y x Z: 760 x 400 x 500 mm'],
        },
        {
          title: 'Tapping M/C cum Drilling M/C',
          icon: 'Drill',
          points: ['M6 – M16 capacity'],
        },
        { title: 'Tapping M/C', icon: 'ScanLine', points: ['M2 – M6 capacity'] },
        {
          title: 'Bandsaw',
          icon: 'Minus',
          points: ['5mm – 200mm cutting OD capacity'],
        },
        {
          title: 'Drilling & Tapping',
          icon: 'CircleDot',
          points: [
            'Precise drilling and tapping services',
            'For all industrial metal components',
          ],
        },
        {
          title: 'Cutting & Parting',
          icon: 'Scissors',
          points: [
            'Efficient material processing and component parting',
            'Minimal waste output',
          ],
        },
        {
          title: 'Laser Cutting',
          icon: 'Zap',
          points: [
            'High-speed, high-accuracy laser cutting',
            'Suitable for various sheet metal thicknesses',
          ],
        },
        {
          title: 'Switchgear Assembly',
          icon: 'Settings',
          points: [
            'Expert assembly of industrial switchgear components',
            'Rigorous quality standards throughout',
          ],
        },
        {
          title: 'Switchgear Mechanism Manufacturing',
          icon: 'Cog',
          points: [
            'High-precision mechanical components',
            'Designed for advanced switchgear systems',
          ],
        },
        {
          title: 'Welding & Fabrication',
          icon: 'Flame',
          points: ['Structural and precision welding', 'TIG, MIG, and arc techniques'],
        },
        {
          title: 'Product Development',
          icon: 'PenTool',
          points: ['From concept to prototype', 'Full industrial design lifecycle support'],
        },
        {
          title: 'Die & Mould Manufacturing',
          icon: 'Box',
          points: [
            'Custom die and mould manufacturing',
            'Suitable for casting and injection processes',
          ],
        },
      ],
    },
  },
  {
    type: 'industries',
    data: {
      eyebrow: 'Our Sectors',
      title_plain: 'Sectors We',
      title_accent: 'Work In.',
      intro:
        'We provide precision manufacturing solutions tailored to the unique demands of multiple critical industries.',
      items: [
        'Switchgear electrical',
        'Automobile',
        'Agriculture',
        'Poultry',
        'Aeronautics',
      ],
    },
  },
  {
    type: 'fleet',
    data: {
      eyebrow: 'Infrastructure',
      title_plain: 'OUR PRECISION',
      title_accent: 'MACHINERY.',
      note: 'Tier-1 equipment maintained to micron-level accuracy standards.',
      machines: [
        'Vertical Milling Machines',
        'CNC Turning Machines',
        'DRO Milling Machines',
        'Drilling Machines',
        'Bandsaw Machines',
        'Tapping Machines',
      ],
      spec_rows: [
        {
          machine_class: 'CNC VMC',
          specification: '800x500x500 MM',
          application: 'Complex Profile Milling',
        },
        {
          machine_class: 'CNC VMC',
          specification: '800x500x500 MM',
          application: 'Complex Profile Milling',
        },
        {
          machine_class: 'CNC VMC',
          specification: '800x500x500 MM',
          application: 'Complex Profile Milling',
        },
      ],
    },
  },
  {
    type: 'gallery',
    data: {
      eyebrow: 'Visuals',
      title_plain: 'THE SHOP',
      title_accent: 'FLOOR.',
      note: 'Capturing the raw precision of our daily operations.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
          title: 'Vertical Milling',
          category: 'Process',
        },
        {
          url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
          title: 'Quality Control',
          category: 'Inspection',
        },
        {
          url: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800',
          title: 'CNC Turning',
          category: 'Machining',
        },
      ],
    },
  },
  {
    type: 'about',
    data: {
      established_label: 'Established 2012',
      title_plain: 'THE',
      title_accent: 'MAGNUS',
      title_suffix: 'CORE.',
      side_note: 'Engineered in Nashik. Deployed Globally.',
      narrative_lead:
        'Magnus Enterprises is a __high-precision__ manufacturing hub dedicated to the electrical, switchgear, and heavy engineering sectors.',
      narrative_body:
        'Since 2012, we have specialized in bridging the gap between complex design and physical reality. Our operations are governed by a single metric: **Geometric Fidelity.**',
      pillars: [
        {
          title: 'Our Vision',
          description:
            'To provide the best value by delivering flexible and scalable manufacturing solutions for companies on the move.',
          icon: 'Target',
        },
        {
          title: 'Our Mission',
          description:
            'To become the trusted manufacturing partner for businesses by delivering precision engineered products and dependable industrial solutions.',
          icon: 'Shield',
        },
      ],
      image_url:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2000',
    },
  },
  {
    type: 'quality',
    data: {
      quote_plain: '"Quality is not an act, it is a habit. In our workshop,',
      quote_accent: 'it is the law."',
      certification: 'ISO 9001:2015',
      certification_sub: 'Certificated Facility',
      checklist: [
        'Multi-stage micron inspection',
        'Calibrated measuring instruments',
        'Raw material traceability',
        'Zero-defect delivery policy',
      ],
    },
  },
  {
    type: 'contact',
    data: {
      eyebrow: 'Inquiries',
      title_plain: 'START A',
      title_accent: 'PRECISION PROJECT.',
    },
  },
];

async function main() {
  const { data: existing, error: findErr } = await admin
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .maybeSingle();
  if (findErr) {
    console.error('Failed to look up home page:', findErr.message);
    process.exit(1);
  }

  let pageId: string;
  if (existing?.id) {
    pageId = existing.id;
    const { error } = await admin
      .from('pages')
      .update({ title: 'Home', status: 'published', published_at: new Date().toISOString() })
      .eq('id', pageId);
    if (error) {
      console.error('Failed to update home page:', error.message);
      process.exit(1);
    }
    console.log('Existing "home" page re-published.');
  } else {
    const { data, error } = await admin
      .from('pages')
      .insert({ slug: 'home', title: 'Home', status: 'published', published_at: new Date().toISOString() })
      .select('id')
      .single();
    if (error || !data) {
      console.error('Failed to create home page:', error?.message);
      process.exit(1);
    }
    pageId = data.id;
    console.log('Created "home" page (published).');
  }

  const { error: delErr } = await admin.from('page_sections').delete().eq('page_id', pageId);
  if (delErr) {
    console.error('Failed to clear old sections:', delErr.message);
    process.exit(1);
  }

  const rows = SECTIONS.map((s, i) => ({
    page_id: pageId,
    type: s.type,
    position: i,
    data: s.data,
  }));

  const { error: insErr } = await admin.from('page_sections').insert(rows);
  if (insErr) {
    console.error('Failed to insert sections:', insErr.message);
    process.exit(1);
  }
  console.log(`Inserted ${rows.length} sections in original order:`);
  rows.forEach((r, i) => console.log(`  ${i + 1}. ${r.type}`));
  console.log('\nDone. The homepage is now fully database-driven.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
