import { Container, Heading, Text } from "@medusajs/ui"
import { paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const providerId = payment?.provider_id || (order as any).payment_provider_id

  // Determine display title
  const paymentTitle = 
    providerId === "manual" || providerId === "cod" 
      ? "Cash on Delivery" 
      : paymentInfoMap[providerId]?.title || providerId

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <Heading level="h2" className="text-lg font-bold text-gray-900 mb-4">
        Payment Information
      </Heading>
      
      <div className="space-y-4">
        <div>
          <Text className="text-sm font-medium text-gray-500 mb-1">
            Payment Method
          </Text>
          <div className="flex items-center gap-2">
            {paymentInfoMap[providerId]?.icon && (
              <Container className="flex items-center justify-center p-1 w-8 h-8 rounded bg-gray-50 border border-gray-100">
                {paymentInfoMap[providerId].icon}
              </Container>
            )}
            <Text className="text-base text-gray-900 font-medium">
              {paymentTitle}
            </Text>
          </div>
        </div>

        <div>
          <Text className="text-sm font-medium text-gray-500 mb-1">
            Payment Amount
          </Text>
          <Text className="text-base text-gray-900">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </Text>
        </div>
        
        {providerId === "manual" && (
          <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
            Please prepare the exact amount for the courier upon delivery.
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentDetails
