// TEMPORARY (Day 10): yeh sirf demo hai, data kahin save NAHI hota.
// Day 17 mein is poori file ko asli API call (fetch) se replace karenge.
//
// Error state test karne ke liye email mein error@test.com daalo.

export async function submitInquiry(payload) {
  // Server ka wait simulate karta hai
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (payload.email.toLowerCase() === 'error@test.com') {
    throw new Error('Could not send your request right now. Please try again in a moment.')
  }

  return { inquiryId: null, demo: true }
}