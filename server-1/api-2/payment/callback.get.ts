// /**
//  * iyzico 3DS Callback Handler - GET
//  */

// export default defineEventHandler(async (event) => {
//   try {
//     console.log('=== IYZICO CALLBACK GET RECEIVED ===');
    
//     const query = getQuery(event);
//     console.log('GET Query:', query);
    
//     // Frontend callback sayfasına yönlendir
//     const params = new URLSearchParams();
    
//     if (query.status) params.append('status', String(query.status));
//     if (query.paymentId) params.append('paymentId', String(query.paymentId));
//     if (query.conversationData) params.append('conversationData', String(query.conversationData));
//     if (query.conversationId) params.append('conversationId', String(query.conversationId));
//     if (query.mdStatus) params.append('mdStatus', String(query.mdStatus));
    
//     const redirectUrl = `/payment/callback/result?${params.toString()}`;
    
//     console.log('GET Redirecting to:', redirectUrl);
    
//     await sendRedirect(event, redirectUrl, 302);
    
//   } catch (error) {
//     console.error('=== CALLBACK GET ERROR ===');
//     console.error(error);
    
//     await sendRedirect(event, '/payment/callback/result?status=error&error=callback_processing_failed', 302);
//   }
// });