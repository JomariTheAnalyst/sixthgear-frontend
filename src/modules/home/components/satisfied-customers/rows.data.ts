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
      { image: "https://picsum.photos/seed/rider1/400/500", label: "Mark R." },
      { image: "https://picsum.photos/seed/rider2/400/500", label: "Juan D." },
      { image: "https://picsum.photos/seed/rider3/400/500", label: "Carlo M." },
      {
        image: "https://picsum.photos/seed/rider4/400/500",
        label: "Miguel S.",
      },
      { image: "https://picsum.photos/seed/rider5/400/500", label: "Paolo T." },
      { image: "https://picsum.photos/seed/rider6/400/500", label: "Jeric L." },
    ],
  },
  {
    direction: "right",
    speedSec: 50,
    items: [
      {
        image: "https://picsum.photos/seed/rider7/400/500",
        label: "Andrei V.",
      },
      { image: "https://picsum.photos/seed/rider8/400/500", label: "Kevin B." },
      { image: "https://picsum.photos/seed/rider9/400/500", label: "Ryan C." },
      {
        image: "https://picsum.photos/seed/rider10/400/500",
        label: "James P.",
      },
      {
        image: "https://picsum.photos/seed/rider11/400/500",
        label: "Chris A.",
      },
      {
        image: "https://picsum.photos/seed/rider12/400/500",
        label: "Dennis G.",
      },
    ],
  },
]
