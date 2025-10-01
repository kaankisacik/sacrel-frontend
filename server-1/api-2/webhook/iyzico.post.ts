// /**
//  * iyzico Webhook Handler
//  * 
//  * Bu endpoint iyzico'dan gelen webhook bildirimlerini yakalar
//  * ve ödeme doğrulamalarını yapar.
//  * 
//  * Webhook'lar 3DS akışının son konusudur ve:
//  * - Her 15 saniyede bir gönderilir
//  * - Sunucu 200 yanıtını alana kadar devam eder
//  * - Her 10 dakikada bir
//  * - Maksimum 3 kere
//  */

// interface IyzicoWebhook {
//   iyziEventTime: number;
//   iyziEventType: string; // API_AUTH, THREE_DS_AUTH, BKM_AUTH
//   iyziReferenceCode: string;
//   paymentId: string;
//   paymentConversationId: string;
//   status: string; // SUCCESS, FAILURE
// }

// export default defineEventHandler(async (event) => {
//   try {
//     // POST method kontrolü
//     if (getMethod(event) !== 'POST') {
//       throw createError({
//         statusCode: 405,
//         statusMessage: 'Method Not Allowed'
//       });
//     }

//     // Request body'yi al
//     const body = await readBody(event) as IyzicoWebhook;
    
//     console.log('=== IYZICO WEBHOOK RECEIVED ===');
//     console.log('Event Time:', new Date(body.iyziEventTime).toISOString());
//     console.log('Event Type:', body.iyziEventType);
//     console.log('Reference Code:', body.iyziReferenceCode);
//     console.log('Payment ID:', body.paymentId);
//     console.log('Conversation ID:', body.paymentConversationId);
//     console.log('Status:', body.status);

//     // Webhook doğrulama
//     if (!body.paymentId || !body.status || !body.iyziEventType) {
//       console.error('Invalid webhook data received');
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Invalid webhook data'
//       });
//     }

//     // Event type kontrolü
//     const validEventTypes = ['API_AUTH', 'THREE_DS_AUTH', 'BKM_AUTH'];
//     if (!validEventTypes.includes(body.iyziEventType)) {
//       console.error('Invalid event type:', body.iyziEventType);
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Invalid event type'
//       });
//     }

//     // Burada webhook verilerini veritabanına kaydetmek veya
//     // diğer iş mantığı işlemlerini yapmak gerekir
    
//     if (body.status === 'SUCCESS') {
//       console.log('✅ Payment successful webhook received');
      
//       // Başarılı ödeme için işlemler:
//       // 1. Sipariş durumunu güncelle
//       // 2. E-posta gönder
//       // 3. Stok güncelle
//       // 4. Diğer entegrasyonları tetikle
      
//       await processSuccessfulPayment({
//         paymentId: body.paymentId,
//         conversationId: body.paymentConversationId,
//         eventTime: body.iyziEventTime,
//         referenceCode: body.iyziReferenceCode
//       });
      
//     } else if (body.status === 'FAILURE') {
//       console.log('❌ Payment failed webhook received');
      
//       // Başarısız ödeme için işlemler:
//       // 1. Sipariş durumunu güncelle
//       // 2. Hata bildirimi gönder
//       // 3. Stok geri al (eğer rezerve edildiyse)
      
//       await processFailedPayment({
//         paymentId: body.paymentId,
//         conversationId: body.paymentConversationId,
//         eventTime: body.iyziEventTime,
//         referenceCode: body.iyziReferenceCode
//       });
//     }

//     // iyzico'ya 200 yanıtı dön (önemli!)
//     return {
//       status: 'success',
//       message: 'Webhook processed successfully',
//       timestamp: Date.now()
//     };

//   } catch (error) {
//     console.error('=== WEBHOOK PROCESSING ERROR ===');
//     console.error(error);

//     // Hata durumunda da 200 dönmek bazen daha iyi olabilir
//     // çünkü iyzico tekrar denemekten vazgeçer
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Webhook processing failed'
//     });
//   }
// });

// // Başarılı ödeme işleme fonksiyonu
// async function processSuccessfulPayment(data: {
//   paymentId: string;
//   conversationId: string;
//   eventTime: number;
//   referenceCode: string;
// }) {
//   try {
//     console.log('Processing successful payment:', data.paymentId);
    
//     // Burada aşağıdaki işlemler yapılmalı:
    
//     // 1. Veritabanında ödeme durumunu güncelle
//     // await updatePaymentStatus(data.paymentId, 'completed');
    
//     // 2. Sipariş durumunu güncelle
//     // await updateOrderStatus(data.conversationId, 'paid');
    
//     // 3. Müşteriye e-posta gönder
//     // await sendPaymentConfirmationEmail(data.conversationId);
    
//     // 4. SMS bildirimi gönder (opsiyonel)
//     // await sendSMSNotification(data.conversationId);
    
//     // 5. Stok güncelle
//     // await updateInventory(data.conversationId);
    
//     // 6. Diğer sistemlere bildirim gönder
//     // await notifyExternalSystems(data);
    
//     // 7. Analytics ve raporlama
//     // await trackPaymentEvent('payment_completed', data);
    
//     console.log('✅ Successful payment processed:', data.paymentId);
    
//   } catch (error) {
//     console.error('Error processing successful payment:', error);
//     throw error;
//   }
// }

// // Başarısız ödeme işleme fonksiyonu
// async function processFailedPayment(data: {
//   paymentId: string;
//   conversationId: string;
//   eventTime: number;
//   referenceCode: string;
// }) {
//   try {
//     console.log('Processing failed payment:', data.paymentId);
    
//     // Burada aşağıdaki işlemler yapılmalı:
    
//     // 1. Veritabanında ödeme durumunu güncelle
//     // await updatePaymentStatus(data.paymentId, 'failed');
    
//     // 2. Sipariş durumunu güncelle
//     // await updateOrderStatus(data.conversationId, 'payment_failed');
    
//     // 3. Rezerve edilen stoku geri al
//     // await releaseReservedInventory(data.conversationId);
    
//     // 4. Müşteriye bilgilendirme e-postası gönder
//     // await sendPaymentFailedEmail(data.conversationId);
    
//     // 5. Analytics ve raporlama
//     // await trackPaymentEvent('payment_failed', data);
    
//     console.log('❌ Failed payment processed:', data.paymentId);
    
//   } catch (error) {
//     console.error('Error processing failed payment:', error);
//     throw error;
//   }
// }