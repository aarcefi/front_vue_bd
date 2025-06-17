<script setup>
import { ref, onMounted, computed } from 'vue'
import MedicoDialog from '@/components/modals/MedicoDialog.vue'
import { getAllMedicos, deleteMedico } from '@/functions.js'
import { exportToPDF } from '@/utils/exportToPdf'

// Datos reactivos
const data = ref([])
const openCreateDialog = ref(false)
const selectedMedico = ref(null)

// Filtros
const hospitales = ref([])
const departamentos = ref([])
const unidades = ref([])

const selectedHospital = ref('')
const selectedDepartamento = ref('')
const selectedUnidad = ref('')

// Encabezados de la tabla
const headers = ref([
  'Código Médico',
  'Nombre ',
  'Apellidos',
  'Especialidad',
  'Licencia Médica',
  'Teléfono',
  'Años Experiencia',
  'Datos Contacto',
  'Unidad',
  'Departamento',
  'Hospital',
  'Acciones'
])

async function cargarDatos() {
  const medicos = await getAllMedicos()
  data.value = medicos.map(m => ({
    cod_medico: m.cod_Med,
    nombre_Med: m.nombre_Med,
    Apellidos: m.Apellidos,
    especialidad: m.especialidad,
    licencia: m.num_Licencia,
    telefono: m.telefono,
    anios_Expmed: m.anios_Expmed,
    contacto: m.datos_Contacto,
    unidad: m.cod_Unidad,
    departamento: m.cod_Dpto,
    hospital: m.cod_Hosp
  }))

  // Cargar opciones para filtros
  hospitales.value = [...new Set(data.value.map(d => d.hospital))]
  departamentos.value = [...new Set(data.value.map(d => d.departamento))]
  unidades.value = [...new Set(data.value.map(d => d.unidad))]
}

function abrirModalAgregar() {
  selectedMedico.value = null
  openCreateDialog.value = true
}

function editarMedico(medico) {
  selectedMedico.value = medico
  openCreateDialog.value = true
}

async function handleDelete(medico) {
  if (!confirm('¿Estás seguro de eliminar este médico?')) return
  try {
    await deleteMedico(
      medico.cod_medico,
      medico.unidad,
      medico.departamento,
      medico.hospital
    )
    await cargarDatos()
  } catch (err) {
    alert(`❌ Error al eliminar: ${err.response?.data?.error || err.message}`)
  }
}

// Exportar a PDF
function exportarAPDF() {
  const headersPDF = [
    'Cod. Médico', 'Nombre', 'Esp.', 'Licencia', 'Teléfono',
    'Años Exp.', 'Contacto', 'Unidad', 'Dpto.', 'Hospital'
  ]
  const columnsPDF = [
    'cod_medico', 'nombre_completo', 'especialidad', 'licencia',
    'telefono', 'anios_experiencia', 'contacto', 'unidad', 'departamento', 'hospital'
  ]

  exportToPDF(data.value, headersPDF, columnsPDF, 'medicos_lista', 'Listado de Médicos')
}

// Filtrar datos dinámicamente
const filteredData = computed(() => {
  return data.value.filter(item => {
    let match = true
    if (selectedHospital.value) match &&= item.hospital === selectedHospital.value
    if (selectedDepartamento.value) match &&= item.departamento === selectedDepartamento.value
    if (selectedUnidad.value) match &&= item.unidad === selectedUnidad.value
    return match
  })
})

onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <v-container class="d-flex flex-row align-center justify-start">
    <h1>Médicos</h1>
    <v-btn color="success" icon size="x-small" class="ml-2" @click="abrirModalAgregar">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn color="error" icon size="x-small" class="ml-2" @click="exportarAPDF">
      <v-icon>mdi-file-pdf-box</v-icon>
    </v-btn>
  </v-container>

  <!-- FILTROS -->
  <v-container fluid class="mt-4">
    <v-row dense>
      <v-col cols="12" sm="4">
        <v-select
          v-model="selectedHospital"
          :items="hospitales"
          label="Filtrar por Hospital"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="selectedDepartamento"
          :items="departamentos"
          label="Filtrar por Departamento"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="selectedUnidad"
          :items="unidades"
          label="Filtrar por Unidad"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
  </v-container>

  <h2 v-if="filteredData.length == 0">No hay médicos con esos filtros</h2>

  <v-container fluid width="90vw" v-else>
    <v-table fixed-header height="400px">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in filteredData" :key="idx">
          <td>{{ item.cod_medico }}</td>
          <td>{{ item.nombre_Med }}</td>
          <td>{{ item.Apellidos }}</td>
          <td>{{ item.especialidad }}</td>
          <td>{{ item.licencia }}</td>
          <td>{{ item.telefono }}</td>
          <td>{{ item.anios_Expmed }}</td>
          <td>{{ item.contacto }}</td>
          <td>{{ item.unidad }}</td>
          <td>{{ item.departamento }}</td>
          <td>{{ item.hospital }}</td>
          <td class="d-flex justify-end" style="gap: 8px;">
            <v-btn icon size="x-small" color="primary" title="Editar" @click="editarMedico(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon size="x-small" color="red" title="Eliminar" @click="handleDelete(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <!-- Modal para crear/editar -->
  <MedicoDialog
    v-model="openCreateDialog"
    :medico="selectedMedico"
    @submit="cargarDatos"
  />
</template>

<style scoped>
.v-table {
  max-width: 100vw;
}
.no-wrap {
  white-space: nowrap;
}
</style>