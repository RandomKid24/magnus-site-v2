import { 
  Settings, 
  Shield, 
  Target, 
  Cpu, 
  Layers, 
  Zap, 
  Hammer, 
  Scissors, 
  Flame, 
  Maximize, 
  PenTool, 
  Box,
  CheckCircle2,
  HardHat,
  Truck,
  Wrench,
  Factory,
  CheckSquare,
  RotateCcw,
  Gauge,
  Drill,
  ScanLine,
  Minus,
  CircleDot,
  Cog
} from 'lucide-react';

export const services = [
  {
    title: "CNC Milling & Turning",
    description: [
      "CNC Turning 1:",
      "Jaw-chuck size: 200mm",
      "Max turning length: 325mm",
      "Bore size: 40mm",
      "CNC Turning 2:",
      "Chuck size: 250mm",
      "Max turning length: 425mm",
      "Bore size: 60mm",
    ],
    icon: RotateCcw,
  },
  {
    title: "VMC Milling",
    description: [
      "VMC Milling 1:",
      "Bed size: 800 x 450",
      "X axis travel x Y axis travel x Z axis travel: 650 x 450 x 500",
      "Controller: Siemens",
      "VMC Milling 2:",
      "Bed size: 1000 x 500",
      "X x Y x Z: 800 x 500 x 500",
      "4th axis to be added",
    ],
    icon: Cpu,
  },
  {
    title: "DRO Milling",
    description: [
      "Bed size: 1270 x 254",
      "X x Y x Z: 760 x 400 x 500 mm",
    ],
    icon: Gauge,
  },
  {
    title: "Tapping M/C cum Drilling M/C",
    description: [
      "M6 – M16 capacity",
    ],
    icon: Drill,
  },
  {
    title: "Tapping M/C",
    description: [
      "M2 – M6 capacity",
    ],
    icon: ScanLine,
  },
  {
    title: "Bandsaw",
    description: [
      "5mm – 200mm cutting OD capacity",
    ],
    icon: Minus,
  },
  {
    title: "Drilling & Tapping",
    description: [
      "Precise drilling and tapping services",
      "For all industrial metal components",
    ],
    icon: CircleDot,
  },
  {
    title: "Cutting & Parting",
    description: [
      "Efficient material processing and component parting",
      "Minimal waste output",
    ],
    icon: Scissors,
  },
  {
    title: "Laser Cutting",
    description: [
      "High-speed, high-accuracy laser cutting",
      "Suitable for various sheet metal thicknesses",
    ],
    icon: Zap,
  },
  {
    title: "Switchgear Assembly",
    description: [
      "Expert assembly of industrial switchgear components",
      "Rigorous quality standards throughout",
    ],
    icon: Settings,
  },
  {
    title: "Switchgear Mechanism Manufacturing",
    description: [
      "High-precision mechanical components",
      "Designed for advanced switchgear systems",
    ],
    icon: Cog,
  },
  {
    title: "Welding & Fabrication",
    description: [
      "Structural and precision welding",
      "TIG, MIG, and arc techniques",
    ],
    icon: Flame,
  },
  {
    title: "Product Development",
    description: [
      "From concept to prototype",
      "Full industrial design lifecycle support",
    ],
    icon: PenTool,
  },
  {
    title: "Die & Mould Manufacturing",
    description: [
      "Custom die and mould manufacturing",
      "Suitable for casting and injection processes",
    ],
    icon: Box,
  },
];

export const philosophy = [
  {
    title: "Our Vision",
    description: "To provide the best value by delivering flexible and scalable manufacturing solutions for companies on the move.",
    icon: Target
  },
  {
    title: "Our Mission",
    description: "To become the trusted manufacturing partner for businesses by delivering precision engineered products and dependable industrial solutions.",
    icon: Shield
  }
];

export const whyChooseUs = [
  "ISO 9001:2015 Certified Manufacturing Process",
  "Advanced CNC & Milling Infrastructure",
  "Precision Inspection Equipment",
  "Experienced Engineering Team",
  "High Quality Industrial Components",
  "Custom Manufacturing Capabilities",
  "Reliable Turnaround & Support"
];

export const machinery = [
  "Vertical Milling Machines",
  "CNC Turning Machines",
  "DRO Milling Machines",
  "Drilling Machines",
  "Bandsaw Machines",
  "Tapping Machines"
];

export const products = [
  { title: "CNC Machined Component 01", image: "/product-1.jpeg" },
  { title: "Precision Bush & Shaft", image: "/product-2.jpeg" },
  { title: "Copper Connector Part", image: "/product-3.jpeg" },
  { title: "Switchgear Mechanism", image: "/product-4.jpeg" },
  { title: "Industrial Fitting", image: "/product-5.jpeg" },
  { title: "Aluminum Profile Part", image: "/product-6.jpeg" },
  { title: "Custom Steel Assembly", image: "/product-7.jpeg" },
  { title: "Brass Precision Part", image: "/product-8.jpeg" },
  { title: "CNC Milled Plate", image: "/product-9.jpeg" },
  { title: "Machined Housing", image: "/product-10.jpeg" },
  { title: "Internal Gear Component", image: "/product-11.jpeg" },
  { title: "Precision Ring Setup", image: "/product-12.jpeg" },
  { title: "Industrial Coupling", image: "/product-13.jpeg" },
  { title: "Custom Flange Piece", image: "/product-14.jpeg" },
  { title: "Aerospace Grade Part", image: "/product-15.jpeg" },
  { title: "Power Distribution Component", image: "/product-16.jpeg" },
  { title: "Mechanism Drive Shaft", image: "/product-17.jpeg" },
  { title: "Heavy Duty Bracket", image: "/product-18.jpeg" },
  { title: "Precision Valve Body", image: "/product-19.jpeg" },
  { title: "Hydraulic System Part", image: "/product-20.jpeg" },
  { title: "Machined Casting", image: "/product-21.jpeg" },
  { title: "Specialized Bolt Plate", image: "/product-22.jpeg" },
  { title: "Engineered Support Hub", image: "/product-23.jpeg" },
  { title: "High-Tolerance Spacer", image: "/product-24.jpeg" },
  { title: "Custom Threaded Part", image: "/product-25.jpeg" },
  { title: "Switchgear Base Plate", image: "/product-26.jpeg" },
  { title: "Rotary Component", image: "/product-27.jpeg" },
  { title: "Precision Guide Rail", image: "/product-28.jpeg" },
  { title: "Machined Mounting Kit", image: "/product-29.jpeg" },
  { title: "Industrial Bearing Hub", image: "/product-30.jpeg" },
  { title: "Custom Tooling Head", image: "/product-31.jpeg" },
  { title: "Final Assembly Part", image: "/product-32.jpeg" }
];

export const industries = [
  "Switchgear electrical",
  "Automobile",
  "Agriculture",
  "Poultry",
  "Aeronautics"
];

export const usps = [
  {
    title: "Precision Engineering",
    description: "We manufacture components with tight tolerances using advanced CNC and VMC machines. Every part is made to exact specifications — no shortcuts."
  },
  {
    title: "Rapid Turnaround",
    description: "Our streamlined production process means faster delivery without sacrificing quality. We respect your deadlines and plan accordingly."
  },
  {
    title: "End-to-End Solutions",
    description: "From prototyping to final assembly, we handle the entire manufacturing lifecycle under one roof — saving you time, cost, and coordination effort."
  },
  {
    title: "Multi-Industry Experience",
    description: "We serve switchgear, automobile, agriculture, poultry, and aeronautics industries. Our team understands the unique requirements of each sector."
  },
  {
    title: "In-House Quality Control",
    description: "We use calibrated instruments — digital verniers, micrometers, and dial gauges — to inspect every component before it leaves our facility."
  },
  {
    title: "Flexible & Scalable",
    description: "Whether it's a single prototype or a large production batch, we adapt to your volume requirements without compromising on consistency."
  },
  {
    title: "Experienced Team",
    description: "Our engineers and machinists bring years of hands-on experience in precision manufacturing, ensuring reliable output every time."
  },
  {
    title: "Trusted by Leading Brands",
    description: "We are a preferred manufacturing partner for top companies in electrical switchgear, automobile, and other critical industries."
  }
];

export const customers = [
  "Leading Electrical Switchgear Brands",
  "Top Automobile Manufacturers",
  "Agricultural Equipment Producers",
  "Aerospace & Aeronautics Innovators",
  "Poultry Infrastructure Providers"
];

export const qualityEquipment = [
  "Digital Vernier Calipers",
  "Micrometers",
  "Dial Gauges",
  "Precision Measuring Instruments"
];

export const contactInfo = {
  address: "Survey No. 107/2, Near Datir Mala, Ambad Gaon, Ambad, Nashik – 422010",
  email: "magnusenterprises20@gmail.com",
  phone: "+91 77200 46700",
  coordinates: { lat: 19.9405, lng: 73.7461 }
};
