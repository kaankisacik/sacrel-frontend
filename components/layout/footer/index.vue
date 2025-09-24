<template>
  <footer class="bg-sacrel-primary py-12 px-6 w-full">
    <div class="w-full  ">
      <div class="max-w-3xl mx-auto text-center mb-8 ">
        <h2 class="sacrel-heading-xl text-sacrel-light mb-4">SACREL</h2>
        <p class="sacrel-body text-sacrel-neutral max-w-xl mx-auto">
          Modern kadın için butik moda. Sadelik ve zarafeti buluşturan özel
          tasarımlar.
        </p>
      </div>

      <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center mb-8 ">
        <div>
          <h4 class="sacrel-heading-sm text-sacrel-light mb-4">Menü</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/products"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
                >Ürünler</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/about"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
                >Hakkımızda</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
                >İletişim</NuxtLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h4 class="sacrel-heading-sm text-sacrel-light mb-4">İletişim</h4>
          <div class="space-y-2">
            <p class="sacrel-body-sm text-sacrel-neutral">+90 (539) 650 49 35</p>
            <p class="sacrel-body-sm text-sacrel-neutral">sacrelco@gmail.com</p>
            <p class="sacrel-body-sm text-sacrel-neutral">İstanbul</p>
          </div>
        </div>

        <div>
          <h4 class="sacrel-heading-sm text-sacrel-light mb-4">Takip Edin</h4>
          <div class="space-y-2">
            <NuxtLink
              href="https://www.instagram.com/sacrel.co/"
              target="_blank"
              class="block sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
              >Instagram</NuxtLink
            >
            <NuxtLink
              href="https://wa.me/905396504935?text=Merhaba"
              target="_blank"
              class="block sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
              >WhatsApp</NuxtLink
            >
          </div>
        </div>

        <div>
          <h4 class="sacrel-heading-sm text-sacrel-light mb-4">Yardım</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/policies/privacy-policy"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
                >Gizlilik Politikası</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/policies/sales-agreement"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
                >Satış Sözleşmesi</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/policies/consumer-rights"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300"
                >
                Tüketici Hakları
                </NuxtLink
              >
            </li>
          </ul>
          </div>
      </div>

      <div class=" max-w-3xl mx-auto border-t border-sacrel-neutral pt-6 text-center">
        <div class="flex justify-center space-x-4 ">
          <img
            src="/images/iyzico.png"
            alt="Bonafida Logo"
            class=" h-8 "
          />
          <img
            src="/images/mastercard.png"
            alt="Bonafida Logo"
            class=" h-8 "
          />
          <img
            src="/images/visa.png"
            alt="Bonafida Logo"
            class=" h-8 "
          />
        </div>
        <p class="sacrel-caption text-sacrel-neutral  mt-4">
          &copy; 2025
          <a href="https://www.bonafidayazilim.com" target="_blank"
            >BONAFIDA YAZILIM</a
          >. Tüm hakları saklıdır.
        </p>
        
      </div>

    
    </div>
  </footer>
</template>
