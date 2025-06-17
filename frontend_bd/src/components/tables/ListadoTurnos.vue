<script setup>
import { ref, onMounted, computed } from 'vue'
import TurnoDialog from '@/components/modals/TurnoDialog.vue'
import { getAllTurnos, deleteTurno } from '@/functions.js'

// Datos reactivos
const data = ref([])
const openCreateDialog = ref(false)
const selectedTurno = ref(null)

// Filtros
const hospitales = ref([])
const departamentos = ref([])
const unidades = ref([])

const selectedHospital = ref('')
const selectedDepartamento = ref('')
const selectedUnidad = ref('')

// Encabezados de la tabla
const headers = ref([
  'Número Turno',
  'Médico',
  'Unidad',
  'Pacientes Asignados',
  'Pacientes Atendidos',
  'Hospital',
  'Departamento',
  'Acciones',
])

async function cargarDatos() {
  const turnos = await getAllTurnos()
  data.value = turnos.map(t => ({
    num_Turno: t.num_Turno,
    cod_Medico: t.cod_Medico || '-',
    cod_Unidad: t.cod_Unidad,
    cant_Pacientes_Asignados: t.cant_Pacientes_Asignados,
    cant_Pacientes_Atendidos: t.cant_Pacientes_Atendidos,
    cod_Hptal: t.cod_Hptal,
    cod_Dpto: t.cod_Dpto,
  }))

  // Cargar opciones para filtros
  hospitales.value = [...new Set(data.value.map(d => d.cod_Hptal))]
  departamentos.value = [...new Set(data.value.map(d => d.cod_Dpto))]
  unidades.value = [...new Set(data.value.map(d => d.cod_Unidad))]
}

function abrirModalAgregar() {
  selectedTurno.value = null
  openCreateDialog.value = true
}

function editarTurno(turno) {
  selectedTurno.value = turno
  openCreateDialog.value = true
}

async function handleDelete(turno) {
  if (confirm('¿Estás seguro de eliminar este turno?')) {
    try {
      await deleteTurno(turno.num_Turno, turno.cod_Unidad, turno.cod_Dpto, turno.cod_Hptal)
      await cargarDatos()
    } catch (err) {
      alert(`❌ Error al eliminar: ${err.message}`)
    }
  }
}

// Filtrar datos dinámicamente
const filteredData = computed(() => {
  return data.value.filter(item => {
    let match = true
    if (selectedHospital.value) match &&= item.cod_Hptal === selectedHospital.value
    if (selectedDepartamento.value) match &&= item.cod_Dpto === selectedDepartamento.value
    if (selectedUnidad.value) match &&= item.cod_Unidad === selectedUnidad.value
    return match
  })
})

onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <v-container class="d-flex flex-row align-center justify-start">
    <h1>Turnos</h1>
    <v-btn color="success" icon size="x-small" class="ml-2" @click="abrirModalAgregar">
      <v-icon>mdi-plus</v-icon>
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

  <h2 v-if="filteredData.length == 0">No hay turnos con esos filtros</h2>
  <v-container fluid width="80vw" v-else>
    <v-table fixed-header height="400px">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in filteredData" :key="idx">
          <td>{{ item.num_Turno }}</td>
          <td>{{ item.cod_Medico }}</td>
          <td>{{ item.cod_Unidad }}</td>
          <td>{{ item.cant_Pacientes_Asignados }}</td>
          <td>{{ item.cant_Pacientes_Atendidos }}</td>
          <td>{{ item.cod_Hptal }}</td>
          <td>{{ item.cod_Dpto }}</td>
          <td class="d-flex justify-end" style="gap: 8px">
            <v-btn icon size="x-small" color="primary" title="Editar" @click="editarTurno(item)">
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

  <!-- Modal para agregar/editar -->
  <TurnoDialog
    v-model="openCreateDialog"
    :turno="selectedTurno"
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