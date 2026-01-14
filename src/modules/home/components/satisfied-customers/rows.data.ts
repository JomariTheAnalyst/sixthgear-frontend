export type CustomerItem = {
  image: string
  label: string
}

export type CustomerRow = {
  direction: "left" | "right"
  speedSec: number
  items: CustomerItem[]
}

// Placeholder images - replace with actual customer photos
export const customerRows: CustomerRow[] = [
  {
    direction: "left",
    speedSec: 45,
    items: [
      { image: "/images/polaroid-marquee/satisfied-customers/002.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/002fg.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/003.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/004.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/004fg.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/005.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/007.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/009.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/010fg.jpg", label: "Sixth Gear Rider" },
    ],
  },
  {
    direction: "right",
    speedSec: 50,
    items: [
      { image: "/images/polaroid-marquee/satisfied-customers/011fg.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/012.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/012fg.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/013.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/014.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/015.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/016.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/018.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/019.jpg", label: "Sixth Gear Rider" },
      { image: "/images/polaroid-marquee/satisfied-customers/111.jpg", label: "Sixth Gear Rider" },
    ],
  },
]
