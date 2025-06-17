<!-- components/modals/InformeDialog.vue -->
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { createInforme } from '@/functions.js'

const props = defineProps({
  modelValue: Boolean,
  unidad: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

// Campos del formulario
const form = ref({
  num_Inf: 0,
  cod_Unidad: '',
  cant_PacAt : 0,
  cant_PacAlta: 0,
  cant_PacAdm: 0,
  cant_TotalPac: 0,
  num_Turno: 1,
  hora_Inf:new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
  fecha_Inf: new Date().toISOString().slice(0, 10),
  cod_Hptal: '',
  cod_Dpto: ''
})



const isEdit = ref(false)

// Cargar datos si viene una unidad
watch(() => props.unidad, (nuevo) => {
  if (nuevo) {
    form.value.cod_Unidad = nuevo.cod_Unidad
    form.value.cod_Hptal = nuevo.cod_Hptal
    form.value.cod_Dpto = nuevo.cod_Dpto
  }
}, { immediate: true })





// Manejo de submit
async function handleSubmit() {
  // Validaciones básicas
  

  try {
    await createInforme(form.value)
    emit('submit')
    emit('update:modelValue', false)
    emit('success') // Opcional: notificar éxito
  } catch (err) {
    alert(`❌ Error al guardar el informe: ${err.message}`)
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title>Generar Informe</v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="Turno" v-model.number="form.num_Turno" required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Hora del Informe" v-model="form.hora_Inf" type="time" disabled/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Fecha del Informe" v-model="form.fecha_Inf" type="date" disabled/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Código Hospital" v-model.number="form.cod_Hptal" disabled />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Código Departamento" v-model.number="form.cod_Dpto"disabled />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="$emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn color="success" @click="handleSubmit">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>