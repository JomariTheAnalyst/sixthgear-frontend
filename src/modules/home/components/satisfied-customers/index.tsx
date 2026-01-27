"use client"

/**
 * Satisfied Customers Section
 * Polaroid marquee with alternating row directions
 * Paper cut design top/bottom
 */

import PolaroidCard from "./PolaroidCard"
import styles from "./polaroid.module.css"

interface CustomerItem {
  id: number
  name: string
  imageUrl: string
}

interface SatisfiedCustomersProps {
  sectionTitle?: string
  row1?: CustomerItem[]
  row2?: CustomerItem[]
}

// Generate random rotation for each card (-3 to 3 degrees)
const getRotation = (index: number) => {
  const rotations = [-3, -1.5, 0, 1.5, 3, -2, 2, -1, 1]
  return rotations[index % rotations.length]
}

export default function SatisfiedCustomers({
  sectionTitle = "Sixthgear Satisfied Customers",
  row1 = [],
  row2 = [],
}: SatisfiedCustomersProps) {
  // Don't render if both rows are empty
  if (row1.length === 0 && row2.length === 0) {
    return null
  }

  const rows = [
    {
      direction: "left" as const,
      speedSec: 45,
      items: row1,
    },
    {
      direction: "right" as const,
      speedSec: 50,
      items: row2,
    },
  ].filter((row) => row.items.length > 0) // Only include rows with items

  return (
    <section className="relative">
      {/* Top Paper Cut */}
      <div className="w-full -mb-1">
        <img
          src="/images/polaroid-marquee/top.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Main Section */}
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <div className="py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2
              className="text-4xl md:text-6xl lg:text-7xl text-white"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              {sectionTitle}
            </h2>
          </div>

          {/* Marquee Rows */}
          <div className="space-y-6 md:space-y-8">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="overflow-hidden">
                <div
                  className={`
                    flex gap-4 md:gap-6 w-max
                    ${
                      row.direction === "left"
                        ? styles.marqueeLeft
                        : styles.marqueeRight
                    }
                    ${styles.marqueeTrack}
                  `}
                  style={
                    { "--duration": `${row.speedSec}s` } as React.CSSProperties
                  }
                >
                  {/* Original items */}
                  {row.items.map((item, itemIndex) => (
                    <PolaroidCard
                      key={`original-${item.id}-${itemIndex}`}
                      item={{ image: item.imageUrl, label: item.name }}
                      rotation={getRotation(itemIndex)}
                    />
                  ))}
                  {/* Duplicated items for seamless loop */}
                  {row.items.map((item, itemIndex) => (
                    <PolaroidCard
                      key={`duplicate-${item.id}-${itemIndex}`}
                      item={{ image: item.imageUrl, label: item.name }}
                      rotation={getRotation(itemIndex)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Paper Cut */}
      <div className="w-full -mt-1">
        <img
          src="/images/polaroid-marquee/bottom.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>
    </section>
  )
}
