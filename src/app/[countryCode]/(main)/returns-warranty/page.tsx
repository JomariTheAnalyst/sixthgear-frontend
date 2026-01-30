import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns and Warranty | Sixthgear Moto Supply",
  description:
    "Returns and warranty policy for Sixthgear Moto Supply & Cafe purchases.",
}

export default function ReturnsWarrantyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Returns & Warranty Policy
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-12">
            At Sixthgear Moto Supply & Cafe, we stand behind the quality of our
            products. This policy outlines our return and warranty procedures to
            ensure your complete satisfaction with every purchase.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            Returns Policy
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
            1. Returns Eligibility
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We accept returns within <strong>7 days of delivery</strong> for
            items that meet the following criteria:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-12 ml-4">
            <li>Item is unused and in original condition</li>
            <li>Original packaging is intact and undamaged</li>
            <li>All tags, labels, and accessories are included</li>
            <li>
              Proof of purchase (receipt or order confirmation) is provided
            </li>
            <li>Item has not been installed or modified</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
            2. Non-Returnable Items
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The following items cannot be returned for hygiene, safety, or
            policy reasons:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Used, installed, or modified products</li>
            <li>Items damaged by misuse, accident, or improper installation</li>
            <li>Special order or custom-made items</li>
            <li>
              Clearance, sale, or final sale items (marked as non-returnable)
            </li>
            <li>Helmets and protective gear (once worn or used)</li>
            <li>Electrical items with broken seals</li>
            <li>Consumables (oils, lubricants, chemicals)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Note:</strong> Items marked as "Final Sale" or
            "Non-Returnable" at the time of purchase cannot be returned unless
            defective.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
            3. Return Process
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Follow these simple steps to initiate a return:
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <p className="font-bold text-gray-900">Step 1: Contact Us</p>
              <p className="text-gray-700 leading-relaxed">
                Email{" "}
                <a
                  href="mailto:info@sixthgear.ph"
                  className="text-blue-600 hover:underline"
                >
                  info@sixthgear.ph
                </a>{" "}
                with your order number and reason for return
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Step 2: Get Approval</p>
              <p className="text-gray-700 leading-relaxed">
                Wait for our team to review and approve your return request
                (usually within 24 hours)
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Step 3: Ship the Item</p>
              <p className="text-gray-700 leading-relaxed">
                Pack the item securely and ship it to our return address
                (provided in approval email)
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900">
                Step 4: Inspection & Refund
              </p>
              <p className="text-gray-700 leading-relaxed">
                Once we receive and inspect the item, your refund will be
                processed
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Shipping Costs:</strong> Return shipping costs are the
            customer's responsibility unless the item is defective or we shipped
            the wrong product.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
            4. Refunds
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Once your return is received and inspected, we will process your
            refund:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Refund Method:</strong> Refunds are issued to the original
              payment method
            </li>
            <li>
              <strong>Processing Time:</strong> 7-14 business days after
              inspection
            </li>
            <li>
              <strong>Refund Amount:</strong> Full purchase price (excluding
              shipping costs unless item is defective)
            </li>
            <li>
              <strong>Notification:</strong> You'll receive an email
              confirmation once the refund is processed
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Bank Processing:</strong> Please allow an additional 3-5
            business days for the refund to appear in your account, depending on
            your bank or payment provider.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            Warranty Policy
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
            5. Warranty Coverage
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Warranty coverage varies by product and manufacturer. Generally, our
            warranties cover:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Defects in Materials:</strong> Manufacturing defects or
              faulty materials
            </li>
            <li>
              <strong>Defects in Workmanship:</strong> Poor construction or
              assembly issues
            </li>
            <li>
              <strong>Functional Failures:</strong> Product fails to perform as
              intended under normal use
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Warranty Periods:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Motorcycle parts: 30-90 days (varies by brand)</li>
            <li>Helmets and gear: 6-12 months (manufacturer warranty)</li>
            <li>Accessories: 30-60 days</li>
            <li>Electronics: Manufacturer warranty (typically 1 year)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            Specific warranty terms are provided with each product. Please refer
            to the manufacturer's warranty card or documentation included with
            your purchase.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
            6. Warranty Exclusions
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Warranties do not cover damage or failure caused by:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Normal wear and tear from regular use</li>
            <li>Improper installation or incorrect application</li>
            <li>Accidents, crashes, or impact damage</li>
            <li>Modifications or alterations to the product</li>
            <li>Misuse, abuse, or neglect</li>
            <li>Failure to follow manufacturer's instructions</li>
            <li>Use in racing or competitive events (unless specified)</li>
            <li>
              Environmental damage (rust, corrosion from improper storage)
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Important:</strong> Warranty is void if the product has been
            tampered with, repaired by unauthorized personnel, or if serial
            numbers/labels have been removed or altered.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
            7. How to File a Warranty Claim
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            To file a warranty claim, please follow these steps:
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <p className="font-bold text-gray-900">
                Step 1: Gather Information
              </p>
              <p className="text-gray-700 leading-relaxed">
                Collect your order number, product details, and photos/videos of
                the issue
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Step 2: Contact Support</p>
              <p className="text-gray-700 leading-relaxed">
                Email{" "}
                <a
                  href="mailto:info@sixthgear.ph"
                  className="text-blue-600 hover:underline"
                >
                  info@sixthgear.ph
                </a>{" "}
                with subject line "Warranty Claim - [Order Number]"
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Step 3: Provide Details</p>
              <p className="text-gray-700 leading-relaxed">
                Include a clear description of the problem, when it occurred,
                and how the product was used
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900">
                Step 4: Await Instructions
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our team will review your claim and provide next steps (repair,
                replacement, or refund)
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-12">
            <strong>Response Time:</strong> We aim to respond to all warranty
            claims within 1-2 business days. Complex cases may require
            additional time for manufacturer consultation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
            Questions?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about our Returns and Warranty Policy,
            please don't hesitate to contact us:
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
            Our customer support team is here to help you with any concerns or
            questions about returns, refunds, or warranty claims.
          </p>

          <p className="text-gray-700 text-sm mt-12">
            This Returns and Warranty Policy is subject to change. We will
            notify customers of any significant changes. Your satisfaction is
            our priority, and we're committed to resolving any issues fairly and
            promptly.
          </p>

          <p className="text-gray-700 text-sm mt-8">
            Last updated: January 28, 2026
          </p>
        </div>
      </div>
    </div>
  )
}
