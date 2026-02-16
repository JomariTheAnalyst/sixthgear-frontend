"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { InstantSearch, SearchBox, Hits, Configure } from "react-instantsearch"
import { searchClient, PRODUCT_INDEX_NAME } from "@lib/meilisearch-config"
import { X, Search } from "lucide-react"
import SearchHit from "../search-hit"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <InstantSearch
                  searchClient={searchClient}
                  indexName={PRODUCT_INDEX_NAME}
                >
                  <Configure hitsPerPage={10} />

                  {/* Search Header */}
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-gray-400" />
                      <SearchBox
                        placeholder="Search for products..."
                        classNames={{
                          root: "flex-1",
                          form: "relative",
                          input:
                            "w-full border-0 focus:ring-0 text-base placeholder-gray-400 focus:outline-none",
                          submit: "hidden",
                          reset: "hidden",
                        }}
                        autoFocus
                      />
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="max-h-[60vh] overflow-y-auto">
                    <Hits
                      hitComponent={({ hit }) => (
                        <SearchHit hit={hit} onClose={onClose} />
                      )}
                      classNames={{
                        root: "p-4",
                        list: "space-y-2",
                        item: "list-none",
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                            ↑↓
                          </kbd>{" "}
                          Navigate
                        </span>
                        <span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                            Enter
                          </kbd>{" "}
                          Select
                        </span>
                        <span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                            ESC
                          </kbd>{" "}
                          Close
                        </span>
                      </div>
                      <span className="text-gray-400">
                        Powered by Meilisearch
                      </span>
                    </div>
                  </div>
                </InstantSearch>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SearchModal
