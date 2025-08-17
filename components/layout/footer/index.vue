<template>
  <footer class="bg-sacrel-primary py-12 px-6">
      <div class="max-w-4xl mx-auto">
       
        <div class="text-center mb-8">
          <h2 class="sacrel-heading-xl text-sacrel-light mb-4">SACREL</h2>
          <p class="sacrel-body text-sacrel-neutral max-w-xl mx-auto">
            Modern kadın için butik moda. Sadelik ve zarafeti buluşturan özel tasarımlar.
          </p>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-8">
          <div>
            <h4 class="sacrel-heading-sm text-sacrel-light mb-4">Menü</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/products" class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300">Ürünler</NuxtLink></li>
              <li><NuxtLink to="/about" class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300">Hakkımızda</NuxtLink></li>
              <li><NuxtLink to="/contact" class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300">İletişim</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h4 class="sacrel-heading-sm text-sacrel-light mb-4">İletişim</h4>
            <div class="space-y-2">
              <p class="sacrel-body-sm text-sacrel-neutral">+90 212 123 4567</p>
              <p class="sacrel-body-sm text-sacrel-neutral">merhaba@sacrel.com</p>
              <p class="sacrel-body-sm text-sacrel-neutral">İstanbul</p>
            </div>
          </div>
          
          <div>
            <h4 class="sacrel-heading-sm text-sacrel-light mb-4">Takip Edin</h4>
            <div class="space-y-2">
              <NuxtLink href="#" class="block sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300">Instagram</NuxtLink>
              <NuxtLink href="#" class="block sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300">Facebook</NuxtLink>
              <NuxtLink href="#" class="block sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300">WhatsApp</NuxtLink>
            </div>
          </div>
        </div>
        
       
        <div class="border-t border-sacrel-neutral pt-6 text-center">
          <p class="sacrel-caption text-sacrel-neutral">&copy; 2025 SACREL. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
    </template>