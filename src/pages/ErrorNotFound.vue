<template>
  <div class="fullscreen bg-grad-4 text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 6vh">
        Eita! Essa página não existe 🥲
      </div>

      <div class="text-h2" style="opacity:.4">
        <q-toolbar-title class="row items-center">
          <q-avatar>
            <q-icon size="md" color="white" name="local_activity" />
          </q-avatar>
          <a :href="landingLink" style="text-decoration: none;" class="text-white q-pl-xs text-bold">
            Midnight Tickets
          </a>
        </q-toolbar-title>
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        to="/"
        icon="local_activity"
        label="Página Inicial"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>