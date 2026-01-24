// Marketing Module Exports
export { default as AnnouncementStrip } from "./components/announcement-strip"
export { default as MarqueeStrip } from "./components/announcement-strip/marquee-strip"
export {
  default as BannerSlot,
  BannerSlotServer,
} from "./components/banner-slot"
export { default as PopupAds } from "./components/popup-ads"
export {
  MarketingProvider,
  useMarketing,
  useBanners,
} from "./context/marketing-provider"
