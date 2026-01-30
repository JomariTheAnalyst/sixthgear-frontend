import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions | Sixthgear Moto Supply",
  description:
    "Terms and conditions for using Sixthgear Moto Supply & Cafe services and purchasing products online.",
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Terms and Conditions
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-8">
            Welcome to Sixthgear Moto Supply & Cafe. By accessing our website
            and purchasing our products or services, you agree to be bound by
            these Terms and Conditions. Please read them carefully before using
            our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            By accessing and using the Sixthgear website, mobile application, or
            any of our services, you acknowledge that you have read, understood,
            and agree to be bound by these Terms and Conditions, as well as our
            Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed mb-12">
            If you do not agree with any part of these terms, you must not use
            our website or services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            2. Orders and Pricing
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            All orders placed through our website are subject to acceptance and
            product availability. We reserve the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Accept or decline any order for any reason</li>
            <li>Limit quantities purchased per person, household, or order</li>
            <li>Refuse service to anyone at any time</li>
            <li>Correct pricing errors or inaccuracies</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Pricing:</strong> All prices are listed in Philippine Pesos
            (PHP) unless otherwise stated. Prices are subject to change without
            notice. We reserve the right to cancel orders if a pricing error is
            discovered.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            3. Payment Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Payment must be completed before orders are processed and shipped.
            We accept the following payment methods:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Cash on Delivery (COD)</li>
            <li>Credit/Debit Cards (Visa, Mastercard, etc.)</li>
            <li>Online payment gateways (as available)</li>
            <li>Bank transfers (for specific orders)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Important:</strong> For Cash on Delivery orders, please
            prepare the exact amount. Our delivery personnel may have limited
            change available.
          </p>
          <p className="text-gray-700 leading-relaxed mb-12">
            All payment information is processed securely through our trusted
            payment partners. We do not store your complete credit card
            information on our servers.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            4. Shipping and Delivery
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We strive to deliver your orders promptly and safely:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Delivery Times:</strong> Estimated delivery times are
              provided at checkout and may vary based on location and carrier
              availability
            </li>
            <li>
              <strong>Shipping Costs:</strong> Calculated based on weight,
              dimensions, and destination
            </li>
            <li>
              <strong>Tracking:</strong> Tracking information will be provided
              once your order ships
            </li>
            <li>
              <strong>Delivery Address:</strong> You are responsible for
              providing accurate shipping information
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Note:</strong> Delivery times are estimates and not
            guaranteed. We are not responsible for delays caused by shipping
            carriers, weather conditions, or other circumstances beyond our
            control.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            5. Returns and Refunds
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We want you to be completely satisfied with your purchase. Please
            review our detailed{" "}
            <a
              href="/returns-warranty"
              className="text-blue-600 hover:underline font-semibold"
            >
              Returns and Warranty Policy
            </a>{" "}
            for complete information on:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-12 ml-4">
            <li>Return eligibility and timeframes</li>
            <li>Return process and requirements</li>
            <li>Refund processing times</li>
            <li>Non-returnable items</li>
            <li>Warranty coverage and claims</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            6. Service Appointments
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            For motorcycle service and maintenance appointments:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Appointments are confirmed upon approval and availability</li>
            <li>
              We may reschedule due to parts availability or technician workload
            </li>
            <li>Cancellations must be made at least 24 hours in advance</li>
            <li>Service estimates are provided before work begins</li>
            <li>Additional charges may apply for unforeseen repairs</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            We will contact you for approval before performing any work beyond
            the original scope or estimate.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            7. Intellectual Property
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            All content on this website, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Text, graphics, logos, images, and photographs</li>
            <li>Product descriptions and specifications</li>
            <li>Software, code, and website design</li>
            <li>Trademarks, service marks, and trade names</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            ...are owned by Sixthgear Moto Supply & Cafe or its licensors and
            are protected by intellectual property laws. You may not reproduce,
            distribute, modify, or create derivative works without our express
            written permission.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To the fullest extent permitted by law, Sixthgear Moto Supply & Cafe
            shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>
              Damages arising from use or inability to use our website or
              services
            </li>
            <li>Damages resulting from unauthorized access to your account</li>
            <li>Errors, mistakes, or inaccuracies in content</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            Our total liability for any claim arising from these Terms or your
            use of our services shall not exceed the amount you paid for the
            specific product or service giving rise to the claim.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            9. Changes to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We reserve the right to modify these Terms and Conditions at any
            time. Changes will be effective immediately upon posting to this
            page with an updated effective date.
          </p>
          <p className="text-gray-700 leading-relaxed mb-12">
            Your continued use of our website and services after changes are
            posted constitutes your acceptance of the modified Terms. We
            encourage you to review these Terms periodically.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            10. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions, concerns, or feedback regarding these
            Terms and Conditions, please contact us:
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:info@sixthgear.ph"
              className="text-blue-600 hover:underline"
            >
              info@sixthgear.ph
            </a>
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Business Name:</strong> Sixthgear Moto Supply & Cafe
          </p>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Location:</strong> Philippines
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            We aim to respond to all inquiries within 1-2 business days.
          </p>

          <p className="text-gray-700 text-sm mt-12">
            By using our website and services, you acknowledge that you have
            read, understood, and agree to be bound by these Terms and
            Conditions. Thank you for choosing Sixthgear Moto Supply & Cafe.
          </p>

          <p className="text-gray-700 text-sm mt-8">
            Last updated: January 28, 2026
          </p>
        </div>
      </div>
    </div>
  )
}
