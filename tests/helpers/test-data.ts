/**
 * Test Data for E2E Tests
 *
 * Contains reusable test data for various test scenarios
 */

export const TEST_CUSTOMER = {
  email: "test@sixthgear.com",
  password: "Test123456!",
  firstName: "Test",
  lastName: "Customer",
  phone: "09123456789",
}

export const TEST_SHIPPING_ADDRESS = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  address1: "123 Rizal Street",
  address2: "Unit 456",
  city: "Manila",
  province: "Metro Manila",
  postalCode: "1000",
  phone: "09123456789",
  countryCode: "ph",
}

export const TEST_BILLING_ADDRESS = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  address1: "123 Rizal Street",
  address2: "Unit 456",
  city: "Manila",
  province: "Metro Manila",
  postalCode: "1000",
  phone: "09123456789",
  countryCode: "ph",
}

export const STRIPE_TEST_CARDS = {
  success: {
    number: "4242424242424242",
    expiry: "12/34",
    cvc: "123",
    zip: "12345",
  },
  declined: {
    number: "4000000000000002",
    expiry: "12/34",
    cvc: "123",
    zip: "12345",
  },
  requiresAuth: {
    number: "4000002500003155",
    expiry: "12/34",
    cvc: "123",
    zip: "12345",
  },
}

export const TEST_PRODUCTS = {
  tshirt: {
    name: "Medusa T-Shirt",
    variant: "S / Black",
  },
  hoodie: {
    name: "Medusa Hoodie",
    variant: "M / Gray",
  },
}

export const WAIT_TIMES = {
  short: 1000,
  medium: 3000,
  long: 5000,
  veryLong: 10000,
}
