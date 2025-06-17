<script setup>
import { ref, onMounted, computed } from 'vue'
import DepartamentoDialog from '@/components/modals/DepartamentoDialog.vue'
import { getAllDepartamentos, deleteDepartamento } from '@/functions.js'

// Datos reactivos
const data = ref([])
const openCreateDialog = ref(false)
const selectedDepartamento = ref(null)

// Filtros
const hospitales = ref([])
const selectedHospital = ref('')

// Encabezados de la tabla
const headers = ref([
  'Código',
  'Nombre del Departamento',
  'Hospital',
  'Acciones'
])

async function cargarDatos() {
  const departamentos = await getAllDepartamentos()
  data.value = departamentos.map(d => ({
    cod_Dpto: d.cod_Dpto,
    nombre_Dpto: d.nombre_Dpto,
    cod_Hptal: d.cod_Hptal
  }))

  // Cargar opciones para filtros
  hospitales.value = [...new Set(data.value.map(d => d.cod_Hptal))]
}

function abrirModalAgregar() {
  selectedDepartamento.value = null
  openCreateDialog.value = true
}

function editarDepartamento(departamento) {
  selectedDepartamento.value = departamento
  openCreateDialog.value = true
}

async function eliminarDepartamento(cod_Hptal, cod_Dpto) {
  if (confirm('¿Estás seguro de eliminar este departamento?')) {
    try {
      const resultado = await deleteDepartamento(cod_Hptal, cod_Dpto)
      if (resultado.error) {
        alert(resultado.error)
      }
      await cargarDatos()
    } catch (err) {
      alert(`❌ Error al eliminar el departamento: ${err.message}`)
    }
  }
}

// Filtrar datos dinámicamente
const filteredData = computed(() => {
  return data.value.filter(item => {
    let match = true
    if (selectedHospital.value) match &&= item.cod_Hptal === selectedHospital.value
    return match
  })
})

onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <v-container class="d-flex flex-row align-center justify-start">
    <h1>Departamentos</h1>
    <v-btn color="success" icon size="x-small" class="ml-2" @click="abrirModalAgregar">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>

  <!-- FILTRO -->
  <v-container fluid class="mt-4">
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedHospital"
          :items="hospitales"
          label="Filtrar por Hospital"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
  </v-container>

  <h2 v-if="filteredData.length == 0">No hay departamentos con ese filtro</h2>
  <v-container fluid width="80vw" v-else>
    <v-table fixed-header height="400px">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in filteredData" :key="idx">
          <td>{{ item.cod_Dpto }}</td>
          <td>{{ item.nombre_Dpto }}</td>
          <td>{{ item.cod_Hptal }}</td>
          <td class="d-flex justify-start" style="gap: 8px;">
            <v-btn icon size="x-small" color="primary" title="Editar" @click="editarDepartamento(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon size="x-small" color="red" title="Eliminar" @click="eliminarDepartamento(item.cod_Hptal, item.cod_Dpto)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <!-- Modal para agregar/editar -->
  <DepartamentoDialog
    v-model="openCreateDialog"
    :departamento="selectedDepartamento"
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