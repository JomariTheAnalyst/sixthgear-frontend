"use client"

import { useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { servicesData } from "@lib/services-data"

type MobileMenuProps = {
  regions: StoreRegion[]
  navLinks: { name: string; href: string; hasDropdown?: boolean }[]
}

export default function MobileMenu({ regions, navLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesExpanded, setIsServicesExpanded] = useState(false)

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={openMenu}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Mobile Menu Drawer */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={closeMenu} className="relative z-[100]">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          {/* Drawer Panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Menu
                  </Dialog.Title>
                  <button
                    onClick={closeMenu}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
                    aria-label="Close menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                  <ul className="space-y-1">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        {link.hasDropdown ? (
                          <div>
                            <button
                              onClick={() =>
                                setIsServicesExpanded(!isServicesExpanded)
                              }
                              className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                            >
                              <span>{link.name}</span>
                              <svg
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isServicesExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {/* Expandable Services List */}
                            {isServicesExpanded && (
                              <div className="mt-1 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                {servicesData.map((service) => (
                                  <LocalizedClientLink
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    onClick={closeMenu}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#F16D34] hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                  >
                                    <span>{service.title}</span>
                                  </LocalizedClientLink>
                                ))}
                                <LocalizedClientLink
                                  href="/services"
                                  onClick={closeMenu}
                                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#F16D34] hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                >
                                  <span>View All Services</span>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </LocalizedClientLink>
                              </div>
                            )}
                          </div>
                        ) : (
                          <LocalizedClientLink
                            href={link.href}
                            onClick={closeMenu}
                            className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                          >
                            {link.name}
                          </LocalizedClientLink>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="my-6 border-t border-gray-100" />

                  {/* Account Link */}
                  <ul className="space-y-1">
                    <li>
                      <LocalizedClientLink
                        href="/account"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        My Account
                      </LocalizedClientLink>
                    </li>
                  </ul>
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    © {new Date().getFullYear()} Sixthgear Motosupply
                  </p>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
