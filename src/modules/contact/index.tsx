"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
  subscribe: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "Required"
    if (!formData.lastName.trim()) newErrors.lastName = "Required"

    if (!formData.email.trim()) {
      newErrors.email = "Required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email"
    }

    if (!formData.message.trim()) newErrors.message = "Required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      subscribe: false,
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* HERO SECTION */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-8">
           {/* Background Image Placeholder (Replace with actual image) */}
           <div className="absolute inset-0 bg-gray-200">
             {/* Use an actual image here if available, e.g. /images/contact-hero.jpg */}
             <Image 
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop" 
                alt="Contact Hero"
                fill
                className="object-cover"
                priority
             />
             <div className="absolute inset-0 bg-black/10" />
           </div>

           {/* Centered Title */}
           <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight">
                Get in touch
              </h1>
           </div>

           {/* Floating Cards (Bottom Left) */}
           <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex gap-4">
              <div className="flex items-center gap-4 bg-[#2D2D2D] text-white px-6 py-4 rounded-xl min-w-[200px]">
                 <span className="text-sm font-medium">Drop us a message</span>
                 <div className="ml-auto w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                 </div>
              </div>
              <LocalizedClientLink href="/faq" className="flex items-center gap-4 bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-4 rounded-xl min-w-[180px] hover:bg-white transition-colors">
                 <span className="text-sm font-medium">View FAQs</span>
                 <div className="ml-auto w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                 </div>
              </LocalizedClientLink>
           </div>
        </div>

        {/* FORM SECTION */}
        <div className="w-full bg-[#EAEBE6] rounded-[2rem] px-6 py-16 md:px-20 md:py-24">
           <div className="max-w-4xl mx-auto">
              {/* Heading */}
              <h2 className="text-3xl md:text-5xl font-medium text-center text-[#1a1a1a] mb-16 leading-tight max-w-3xl mx-auto">
                 Let's collaborate – your next ride starts here
              </h2>

              {isSubmitted ? (
                 <div className="text-center py-20">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully</h3>
                    <p className="text-gray-600 mb-8">We'll get back to you shortly.</p>
                    <button onClick={() => setIsSubmitted(false)} className="text-[#F16D34] font-medium underline">Send another</button>
                 </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                   
                   {/* Name Row */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm text-[#4a4a4a]">First name *</label>
                         <input 
                           type="text" 
                           name="firstName"
                           value={formData.firstName}
                           onChange={handleChange}
                           className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-0 text-gray-900 placeholder-gray-400 shadow-sm"
                         />
                         {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm text-[#4a4a4a]">Last name *</label>
                         <input 
                           type="text" 
                           name="lastName"
                           value={formData.lastName}
                           onChange={handleChange}
                           className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-0 text-gray-900 placeholder-gray-400 shadow-sm"
                         />
                         {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                   </div>

                   {/* Email & Phone Row */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm text-[#4a4a4a]">Email address *</label>
                         <input 
                           type="email" 
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-0 text-gray-900 placeholder-gray-400 shadow-sm"
                         />
                         {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm text-[#4a4a4a]">Phone number</label>
                         <input 
                           type="tel" 
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-0 text-gray-900 placeholder-gray-400 shadow-sm"
                         />
                      </div>
                   </div>

                   {/* Subject */}
                   <div className="space-y-2">
                      <label className="text-sm text-[#4a4a4a]">Subject</label>
                      <div className="relative">
                         <select 
                           name="subject"
                           value={formData.subject}
                           onChange={handleChange}
                           className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-0 text-gray-900 shadow-sm appearance-none cursor-pointer"
                         >
                            <option value="">Please select</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Support">Support</option>
                            <option value="Partnership">Partnership</option>
                         </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                         </div>
                      </div>
                   </div>

                   {/* Message */}
                   <div className="space-y-2">
                      <label className="text-sm text-[#4a4a4a]">Leave us a message *</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full p-4 rounded-lg border-none bg-white focus:ring-0 text-gray-900 resize-none shadow-sm"
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                   </div>

                   {/* Checkbox */}
                   <div className="flex items-start gap-3 pt-2">
                      <input 
                        type="checkbox" 
                        name="subscribe"
                        checked={formData.subscribe}
                        onChange={handleChange}
                        id="subscribe"
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-0"
                      />
                      <label htmlFor="subscribe" className="text-sm text-[#4a4a4a] cursor-pointer selection:bg-none">
                         Subscribe to keep up with our upcoming events, opportunities and programs
                      </label>
                   </div>
                   
                   {/* Submit Button */}
                   <div className="flex justify-end pt-8">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex items-center gap-3 text-lg font-medium text-[#1a1a1a] hover:opacity-70 transition-opacity"
                      >
                         {isSubmitting ? "Sending..." : "Submit"}
                         <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                         </div>
                      </button>
                   </div>
                </form>
              )}
           </div>
        </div>

      </div>
    </div>
  )
}
