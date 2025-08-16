// Fix for qs stringify import issue
import qs from 'qs'

// Extend window type
declare global {
  interface Window {
    qs?: typeof qs
  }
}

// Make sure qs.stringify is available globally if needed
if (typeof window !== 'undefined') {
  window.qs = qs
}

export default defineNuxtPlugin(() => {
  // This ensures qs is properly initialized on both client and server
  return {
    provide: {
      qs: qs
    }
  }
})
