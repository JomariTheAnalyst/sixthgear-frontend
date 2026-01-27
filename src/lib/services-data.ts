/**
 * Services Data
 * Comprehensive motorcycle services offered by Sixthgear
 */

export interface ServiceItem {
  name: string
}

export interface ServiceCategory {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  image: string
  heroImage?: string // Landscape hero background
  detailImage?: string // Portrait detail image
  items: string[]
}

export const servicesData: ServiceCategory[] = [
  {
    id: "preventive-maintenance",
    slug: "preventive-maintenance",
    title: "Service & Preventive Maintenance",
    shortTitle: "Preventive Maintenance",
    description:
      "Keep your motorcycle running at peak performance with our comprehensive preventive maintenance services. From routine PMS to seasonal care, we ensure your bike is always road-ready.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    items: [
      "Periodic Maintenance Service (PMS)",
      "Oil Change & Fluid Replacement",
      "Scheduled Service (Minor / Major)",
      "Pre-Ride Safety Inspection",
      "Long-Ride / Touring Preparation",
      "Storage & Seasonal Maintenance",
      "Break-In Service (New Motorcycles)",
    ],
  },
  {
    id: "repairs-diagnostics",
    slug: "repairs-diagnostics",
    title: "Repairs & Diagnostics",
    shortTitle: "Repairs & Diagnostics",
    description:
      "Advanced diagnostic equipment and expert technicians to identify and fix any issue. From brake systems to ECU diagnostics, we handle it all with precision.",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    items: [
      "Brake System Repair & Bleeding",
      "Clutch Adjustment & Replacement",
      "Engine Tune-Up & Performance Checks",
      "Electrical Diagnosis & Troubleshooting",
      "Charging System & Battery Testing",
      "Fuel System Cleaning & Calibration",
      "Cooling System Inspection & Repair",
      "Suspension Inspection & Adjustment",
      "ECU Scan & Error Code Diagnosis",
    ],
  },
  {
    id: "accessories-installation",
    slug: "accessories-installation",
    title: "Accessories & Custom Installation",
    shortTitle: "Custom Installation",
    description:
      "Transform your ride with professional accessory installation. From lighting upgrades to luggage systems, we ensure perfect fitment and functionality.",
    image:
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
    items: [
      "Accessory Installation & Calibration",
      "Lighting Upgrades (Aux Lights, LEDs)",
      "Horn, Electrical & Safety Upgrades",
      "GPS, Phone Mount & Navigation Setup",
      "Communication Systems Installation",
      "Crash Guards, Skid Plates & Sliders",
      "Luggage Systems & Mounting",
      "Windscreen, Seats & Ergonomic Mods",
    ],
  },
  {
    id: "wheels-drivetrain",
    slug: "wheels-drivetrain",
    title: "Wheels, Drivetrain & Handling",
    shortTitle: "Wheels & Drivetrain",
    description:
      "Expert care for your motorcycle's wheels and drivetrain. Proper alignment, balanced wheels, and smooth power delivery for the ultimate riding experience.",
    image:
      "https://images.unsplash.com/photo-1571293521801-fd3dbf02a4f2?w=800&q=80",
    items: [
      "Tyre Replacement & Wheel Balancing",
      "Chain and Sprocket Replacement",
      "Wheel Alignment & Inspection",
      "Steering Head Bearing Inspection",
      "Swingarm & Linkage Service",
    ],
  },
  {
    id: "detailing-protection",
    slug: "detailing-protection",
    title: "Detailing, Care & Protection",
    shortTitle: "Detailing & Care",
    description:
      "Keep your motorcycle looking showroom-fresh with our professional detailing services. From basic wash to ceramic coating, we protect your investment.",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
    items: [
      "Bike Washing & Professional Detailing",
      "Paint, Plastic & Metal Restoration",
      "Ceramic Coating & Paint Protection",
      "Rust Prevention & Treatment",
      "Engine & Undercarriage Cleaning",
    ],
  },
  {
    id: "performance-upgrades",
    slug: "performance-upgrades",
    title: "Performance & Upgrade Services",
    shortTitle: "Performance Upgrades",
    description:
      "Unlock your motorcycle's full potential with performance upgrades. Expert installation of exhaust systems, intake upgrades, and tuning support.",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    items: [
      "Exhaust Installation (Slip-On / Full System)",
      "Intake & Air Filter Upgrades",
      "Performance Tuning Support",
      "Weight Reduction & Setup Advice",
    ],
  },
  {
    id: "roadside-assistance",
    slug: "roadside-assistance",
    title: "Roadside Assistance & Recovery",
    shortTitle: "Roadside Assistance",
    description:
      "Stranded on the road? Our emergency recovery team is ready to help. Fast response times and professional handling of your motorcycle.",
    image:
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
    items: [
      "Motorcycle Towing Service",
      "Emergency Bike Rescue & Recovery",
      "Breakdown Assistance Coordination",
      "Accident Recovery Support",
    ],
  },
  {
    id: "rider-support",
    slug: "rider-support",
    title: "Rider Support & Convenience",
    shortTitle: "Rider Support",
    description:
      "Beyond repairs, we offer comprehensive rider support services. From pre-purchase inspections to warranty assistance, we've got you covered.",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    items: [
      "Pre-Purchase Motorcycle Inspection",
      "Troubleshooting & Consultation",
      "Warranty Support Assistance",
      "After-Service Check & Follow-Up",
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return servicesData.find((service) => service.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return servicesData.map((service) => service.slug)
}
