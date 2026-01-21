export type Carrier = "jnt" | "lbc" | "ninjavan" | "lalamove" | "grab" | "moveit" | "toktok"

export const CARRIER_MAP: Record<string, { name: string; urlPattern?: string; homepage: string }> = {
  jnt: {
    name: "J&T Express",
    urlPattern: "https://www.jtexpress.ph/trajectoryQuery?billCodes={TRACKING_NUMBER}",
    homepage: "https://www.jtexpress.ph/",
  },
  lbc: {
    name: "LBC Express",
    urlPattern: "https://www.lbcexpress.com/track/?tracking_no={TRACKING_NUMBER}",
    homepage: "https://www.lbcexpress.com/",
  },
  ninjavan: {
    name: "Ninja Van",
    urlPattern: "https://www.ninjavan.co/en-ph/tracking?id={TRACKING_NUMBER}",
    homepage: "https://www.ninjavan.co/en-ph",
  },
  lalamove: {
    name: "Lalamove",
    homepage: "https://web.lalamove.com/",
  },
  grab: {
    name: "Grab Express",
    homepage: "https://www.grab.com/ph/express/",
  },
  moveit: {
    name: "Move It",
    homepage: "https://moveit.com.ph/",
  },
  toktok: {
    name: "TokTok",
    urlPattern: "https://toktok.ph/delivery/track?refId={TRACKING_NUMBER}",
    homepage: "https://toktok.ph/",
  },
}

export const getTrackingLink = (carrier: string, trackingNumber: string): string => {
  const normalizedCarrier = carrier?.toLowerCase().replace(/\s+/g, "")
  const provider = CARRIER_MAP[normalizedCarrier] || CARRIER_MAP[carrier]

  if (provider?.urlPattern) {
    return provider.urlPattern.replace("{TRACKING_NUMBER}", trackingNumber)
  }

  return provider?.homepage || "#"
}

export const getCarrierName = (carrier: string): string => {
  const normalizedCarrier = carrier?.toLowerCase().replace(/\s+/g, "")
  return CARRIER_MAP[normalizedCarrier]?.name || CARRIER_MAP[carrier]?.name || carrier || "Courier"
}
