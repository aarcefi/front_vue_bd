<script setup>
import {defineProps, defineEmits, ref, watch} from 'vue'
import {createTurno, updateTurno} from '@/functions.js'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  turno: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit'])

// Campos reactivos del formulario
const num_Turno = ref('')
const cod_Medico = ref(0)
const cod_Unidad = ref(0)
const cant_Pacientes_Asignados = ref(0)
const cant_Pacientes_Atendidos = ref(0)
const cod_Hptal = ref(0)
const cod_Dpto = ref(0)

const isEdit = ref(false)
const creationDialog = ref(false)
const errorMessage = ref('')
// Cargar datos si estamos editando
watch(() => props.turno, (nuevo) => {
  if (nuevo) {
    num_Turno.value = nuevo.num_Turno
    cod_Medico.value = nuevo.cod_Medico
    cod_Unidad.value = nuevo.cod_Unidad
    cant_Pacientes_Asignados.value = nuevo.cant_Pacientes_Asignados
    cant_Pacientes_Atendidos.value = nuevo.cant_Pacientes_Atendidos
    cod_Hptal.value = nuevo.cod_Hptal
    cod_Dpto.value = nuevo.cod_Dpto
    isEdit.value = true
  } else {
    limpiarFormulario()
    isEdit.value = false
  }
}, {immediate: true})

function limpiarFormulario() {
  num_Turno.value = ''
  cod_Medico.value = ''
  cod_Unidad.value = ''
  cant_Pacientes_Asignados.value = ""
  cant_Pacientes_Atendidos.value = ""
  cod_Hptal.value = ""
  cod_Dpto.value = ""
}

async function handleSubmit() {
  // Validaciones básicas
  if (!num_Turno.value || !cod_Unidad.value || !cod_Hptal.value) {
    alert('Completa los campos obligatorios')
    return
  }

  const datos = {
    num_Turno: parseInt(num_Turno.value),
    cod_Medico: parseInt(cod_Medico.value),
    cod_Unidad: parseInt(cod_Unidad.value),
    cant_Pacientes_Asignados: parseInt(cant_Pacientes_Asignados.value),
    cant_Pacientes_Atendidos: parseInt(cant_Pacientes_Atendidos.value),
    cod_Hptal: parseInt(cod_Hptal.value),
    cod_Dpto: parseInt(cod_Dpto.value)
  }

  try {
    let resultado
    if (isEdit.value) {
      await updateTurno(datos)
    } else {
      await createTurno(datos)
    }
    if (resultado?.success) {
      emit('submit')
      emit('update:modelValue', false)
      creationDialog.value = true
    } else {
      errorMessage.value = resultado?.error
    }
  } catch (err) {
    console.error(err)
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
      <v-card-title>{{ isEdit ? 'Editar Turno' : 'Nuevo Turno' }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="Número de Turno" v-model.number="num_Turno" required:disabled="isEdit"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Código Médico" v-model.number="cod_Medico"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Código Unidad" v-model.number="cod_Unidad" required:disabled="isEdit"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Pacientes Asignados" v-model.number="cant_Pacientes_Asignados" required/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Pacientes Atendidos" v-model.number="cant_Pacientes_Atendidos"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Código Hospital" v-model.number="cod_Hptal" required:disabled="isEdit"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Código Departamento" v-model.number="cod_Dpto" required:disabled="isEdit"/>
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

  <!-- Diálogo de éxito -->
  <v-dialog v-model="creationDialog" max-width="500px">
    <v-card class="pa-4 text-center">
      <v-card-title>{{ isEdit ? 'Turno actualizado' : 'Turno creado' }} con éxito</v-card-title>
      <v-card-actions class="d-flex justify-center mt-4">
        <v-btn color="success" @click="creationDialog = false">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>