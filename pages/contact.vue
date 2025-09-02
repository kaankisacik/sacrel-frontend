<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center mb-12">
            <h1 class="sacrel-heading-xl text-sacrel-primary mb-6">İletişim</h1>
            <p class="sacrel-body-lg text-sacrel-neutral max-w-2xl mx-auto">
                Sorularınız için bize ulaşabilir, koleksiyonumuz hakkında bilgi alabilir veya kişisel alışveriş
                randevusu planlayabilirsiniz.
            </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
            <div class="bg-white p-8 rounded-lg shadow-lg">
                <h2 class="sacrel-heading-lg text-sacrel-primary mb-6">Mesaj Gönderin</h2>
                <form class="space-y-6" @submit.prevent="handleSubmit">
                    <div>
                        <label for="name"
                            class="block sacrel-body font-accent text-sacrel-primary mb-2">Adınız</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name"
                            v-model="form.name"
                            class="w-full px-4 py-3 border border-sacrel-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-sacrel-accent focus:border-transparent"
                            placeholder="Adınız ve soyadınız" />
                    </div>
                    <div>
                        <label for="email"
                            class="block sacrel-body font-accent text-sacrel-primary mb-2">E-posta *</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            v-model="form.email"
                            required
                            class="w-full px-4 py-3 border border-sacrel-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-sacrel-accent focus:border-transparent"
                            placeholder="eposta@ornek.com" />
                    </div>
                    <div>
                        <label for="phone"
                            class="block sacrel-body font-accent text-sacrel-primary mb-2">Telefon</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            name="phone"
                            v-model="form.phone"
                            class="w-full px-4 py-3 border border-sacrel-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-sacrel-accent focus:border-transparent"
                            placeholder="(555) 123-4567" />
                    </div>
                    <div>
                        <label for="message"
                            class="block sacrel-body font-accent text-sacrel-primary mb-2">Mesajınız *</label>
                        <textarea 
                            id="message" 
                            name="message" 
                            rows="5"
                            v-model="form.message"
                            required
                            class="w-full px-4 py-3 border border-sacrel-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-sacrel-accent focus:border-transparent resize-none"
                            placeholder="Mesajınızı buraya yazın..."></textarea>
                    </div>
                    <button type="submit"
                        class="w-full bg-sacrel-primary text-white py-3 px-6 rounded-md hover:bg-sacrel-accent transition duration-300 font-accent uppercase tracking-wider">
                        Mesaj Gönder
                    </button>
                </form>
            </div>

            <div class="space-y-8">
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h3 class="sacrel-heading-lg text-sacrel-primary mb-6">Butik Bilgileri</h3>
                    <div class="space-y-6">
                        <div>
                            <h4 class="sacrel-heading-md text-sacrel-accent mb-2">Adres</h4>
                            <p class="sacrel-body text-sacrel-neutral">
                                Nişantaşı Mahallesi<br />
                                Teşvikiye Caddesi No: 123<br />
                                Şişli, İstanbul
                            </p>
                        </div>
                        <div>
                            <h4 class="sacrel-heading-md text-sacrel-accent mb-2">İletişim</h4>
                            <div class="space-y-2 sacrel-body text-sacrel-neutral">
                                <p>Telefon: <a href="tel:+902121234567"
                                        class="hover:text-sacrel-accent transition duration-300">+90 212 123
                                        4567</a></p>
                                <p>E-posta: <a href="mailto:merhaba@sacrel.com"
                                        class="hover:text-sacrel-accent transition duration-300">merhaba@sacrel.com</a>
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 class="sacrel-heading-md text-sacrel-accent mb-2">Çalışma Saatleri</h4>
                            <div class="space-y-2 sacrel-body text-sacrel-neutral">
                                <p>Pazartesi - Cumartesi: 10:00 - 20:00</p>
                                <p>Pazar: 12:00 - 18:00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h3 class="sacrel-heading-lg text-sacrel-primary mb-4">Kişisel Alışveriş</h3>
                    <p class="sacrel-body text-sacrel-neutral mb-4">
                        Özel stil danışmanlığı ve kişisel alışveriş deneyimi için randevu alabilirsiniz.
                    </p>
                    <!-- <button
                        class="bg-sacrel-accent text-white py-2 px-6 rounded-md hover:bg-sacrel-primary transition duration-300 font-accent uppercase tracking-wider">
                        Randevu Al
                    </button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useContact, type ContactData } from '@/composables/useContact';

const { createContactMessage } = useContact();

const form = ref<ContactData>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  order_id: '',
});

const handleSubmit = async () => {
  // Validate required fields
  if (!form.value.email?.trim()) {
    alert('E-posta adresi zorunludur.');
    return;
  }
  
  if (!form.value.message?.trim()) {
    alert('Mesaj alanı zorunludur.');
    return;
  }

  try {
    await createContactMessage(form.value);
    alert('Mesajınız başarıyla gönderildi!');
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      order_id: '',
    };
  } catch (error) {
    console.error('Mesaj gönderilirken hata oluştu:', error);
    alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
  }
};
</script>
