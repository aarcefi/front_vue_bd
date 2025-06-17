<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { createMedico, updateMedico } from '@/functions'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  medico: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const cod_Med = ref('')
const nombre_Med = ref('')
const apellidos = ref('')
const especialidad = ref('')
const num_Licencia = ref('')
const telefono = ref('')
const anios_Expmed = ref('')
const datos_Contacto = ref('')
const cod_Unidad = ref('')
const cod_Dpto = ref('')
const cod_Hptal = ref('')

const isEdit = ref(false)
const creationDialog = ref(false)
const errorMessage = ref('')

// Cargar datos si estamos editando
watch(() => props.medico, (nuevo) => {
  if (nuevo) {
    cod_Med.value = nuevo.cod_medico
    nombre_Med.value = nuevo.nombre_Med
    apellidos.value = nuevo.Apellidos
    especialidad.value = nuevo.especialidad
    num_Licencia.value = nuevo.licencia
    telefono.value = nuevo.telefono
    anios_Expmed.value = nuevo.anios_experiencia
    datos_Contacto.value = nuevo.contacto
    cod_Unidad.value = nuevo.unidad
    cod_Dpto.value = nuevo.departamento
    cod_Hptal.value = nuevo.hospital
    isEdit.value = true
  } else {
    limpiarFormulario()
    isEdit.value = false
  }
}, { immediate: true })

function limpiarFormulario() {
  cod_Med.value = ''
  nombre_Med.value = ''
  apellidos.value = ''
  especialidad.value = ''
  num_Licencia.value = ''
  telefono.value = ''
  anios_Expmed.value = ''
  datos_Contacto.value = ''
  cod_Unidad.value = ''
  cod_Dpto.value = ''
  cod_Hptal.value = ''
  errorMessage.value = ''
}

async function handleSubmit() {
  // Validaciones básicas
  if (!cod_Med.value || !nombre_Med.value.trim() || !especialidad.value.trim() ||
      !num_Licencia.value || !cod_Unidad.value || !cod_Dpto.value || !cod_Hptal.value) {
    errorMessage.value = 'Complete todos los campos obligatorios'
    return
  }

  const datos = {
    cod_Med: parseInt(cod_Med.value),
    nombre_Med: nombre_Med.value.trim(),
    Apellidos: apellidos.value.trim(),
    especialidad: especialidad.value.trim(),
    num_Licencia: parseInt(num_Licencia.value),
    telefono: telefono.value.trim(),
    anios_Expmed: parseInt(anios_Expmed.value),
    datos_Contacto: datos_Contacto.value.trim(),
    cod_Unidad: parseInt(cod_Unidad.value),
    cod_Dpto: parseInt(cod_Dpto.value),
    cod_Hptal: parseInt(cod_Hptal.value)

  }
  try {
    let resultado

    if (isEdit.value) {
      resultado = await updateMedico( datos)
    } else {
      resultado = await createMedico(datos)
  

    if (resultado.success){
      emit('submit')
      emit('update:modelValue', false)
      creationDialog.value = true
    }  
  }
  } catch (err) {
    console.error('Error:', err)
    errorMessage.value = err.response?.data?.error || err.message || 'Error desconocido'
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
      <v-card-title>{{ isEdit ? 'Editar Médico' : 'Nuevo Médico' }}</v-card-title>
      <v-card-text>
        <!-- Mensaje de error -->
        <v-alert
            v-if="errorMessage"
            type="error"
            class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>

        <v-container>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Código Médico"
                  v-model.number="cod_Med"
                  required
                  :disabled="isEdit"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Nombre del Médico"
                  v-model="nombre_Med"
                  required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Apellidos"
                  v-model="apellidos"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Especialidad"
                  v-model="especialidad"
                  required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Licencia Médica"
                  v-model.number="num_Licencia"
                  required :disabled="isEdit"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Teléfono"
                  v-model="telefono"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Años de experiencia"
                  type="number"
                  v-model.number="anios_Expmed"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Datos de contacto"
                  v-model="datos_Contacto"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                  label="Código Unidad"
                  v-model.number="cod_Unidad"
                  required :disabled="isEdit"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                  label="Código Departamento"
                  v-model.number="cod_Dpto"
                  required :disabled="isEdit"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                  label="Código Hospital"
                  v-model.number="cod_Hptal"
                  required :disabled="isEdit"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="$emit('update:modelValue', false)">
          Cancelar
        </v-btn>
        <v-btn color="success" @click="handleSubmit">Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo de éxito -->
  <v-dialog v-model="creationDialog" max-width="500px">
    <v-card class="pa-4 text-center">
      <v-card-title>{{ isEdit ? 'Médico actualizado' : 'Médico creado' }} con éxito</v-card-title>
      <v-card-actions class="d-flex justify-center mt-4">
        <v-btn color="success" @click="creationDialog = false">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>