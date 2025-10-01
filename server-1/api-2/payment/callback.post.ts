// /**
//  * iyzico 3DS Callback Handler
//  * 
//  * Bu endpoint iyzico'dan gelen 3DS callback POST verilerini yakalar
//  * ve frontend'e yönlendirir.
//  */

// export default defineEventHandler(async (event) => {
//   try {
//     console.log('=== IYZICO CALLBACK RECEIVED ===');
//     console.log('Method:', getMethod(event));
//     console.log('URL:', getRequestURL(event));
//     console.log('Headers:', getHeaders(event));
    
//     if (getMethod(event) === 'POST') {
//       // POST verilerini al
//       const body = await readBody(event);
//       console.log('POST Body:', body);
//       console.log('POST Body Type:', typeof body);
//       console.log('POST Body Keys:', Object.keys(body || {}));
      
//       // URL parametrelerine dönüştür
//       const params = new URLSearchParams();
      
//       if (body.status) params.append('status', String(body.status));
//       if (body.paymentId) params.append('paymentId', String(body.paymentId));
//       if (body.conversationData) params.append('conversationData', String(body.conversationData));
//       if (body.conversationId) params.append('conversationId', String(body.conversationId));
//       if (body.mdStatus) params.append('mdStatus', String(body.mdStatus));
      
//       // Debug: tüm body alanlarını kontrol et
//       for (const [key, value] of Object.entries(body || {})) {
//         console.log(`Body field: ${key} = ${value}`);
//         if (!params.has(key)) {
//           params.append(key, String(value));
//         }
//       }
      
//       // GET endpoint'ine yönlendir
//       const redirectUrl = `/payment/callback/result?${params.toString()}`;
      
//       console.log('Redirecting to:', redirectUrl);
//       console.log('Parameters:', params.toString());
      
//       // HTML formu ile yönlendirme (POST callback'ler için daha güvenilir)
//       const html = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Payment Processing...</title>
//         </head>
//         <body>
//           <div style="text-align: center; padding: 50px;">
//             <h3>Ödeme işleniyor...</h3>
//             <p>Lütfen bekleyin...</p>
//           </div>
//           <form id="callbackForm" action="${redirectUrl}" method="GET" style="display: none;">
//           </form>
//           <script>
//             console.log('Redirecting to callback result page...');
//             window.location.href = '${redirectUrl}';
//           </script>
//         </body>
//         </html>
//       `;
      
//       return html;
      
//     } else {
//       // GET isteği için de işle
//       const query = getQuery(event);
//       console.log('GET Query:', query);
      
//       const params = new URLSearchParams();
      
//       for (const [key, value] of Object.entries(query || {})) {
//         params.append(key, String(value));
//       }
      
//       const redirectUrl = `/payment/callback/result?${params.toString()}`;
      
//       console.log('GET Redirecting to:', redirectUrl);
      
//       await sendRedirect(event, redirectUrl, 302);
//     }
    
//   } catch (error) {
//     console.error('=== CALLBACK ERROR ===');
//     console.error(error);
    
//     // Hata durumunda da frontend'e yönlendir
//     await sendRedirect(event, '/payment/callback/result?status=error&error=callback_processing_failed', 302);
//   }
// });