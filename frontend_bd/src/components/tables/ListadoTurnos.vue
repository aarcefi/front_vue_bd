<!-- views/ListadoTurnos.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import TurnoDialog from '@/components/modals/TurnoDialog.vue'
import { getAllTurnos, deleteTurno } from '@/functions.js'

// Datos reactivos
const data = ref([])
const openCreateDialog = ref(false)
const selectedTurno = ref(null)

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
  data.value = turnos.map((t) => ({
    num_Turno: t.num_Turno,
    cod_Medico: t.cod_Medico || '-',
    cod_Unidad: t.cod_Unidad,
    cant_Pacientes_Asignados: t.cant_Pacientes_Asignados,
    cant_Pacientes_Atendidos: t.cant_Pacientes_Atendidos,
    cod_Hptal: t.cod_Hptal,
    cod_Dpto: t.cod_Dpto,
  }))
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
      await deleteTurno(turno.num_Turno,turno.cod_Unidad,turno.cod_Dpto,turno.cod_Hptal)
      await cargarDatos()
    } catch (err) {
      alert(`❌ Error al eliminar: ${err.message}`)
    }
  }
}

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

  <h2 v-if="data.length == 0">No hay contenido para mostrar</h2>
  <v-container fluid width="80vw" v-else>
    <v-table fixed-header height="400px">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in data" :key="idx">
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
            <v-btn
              icon
              size="x-small"
              color="red"
              title="Eliminar"
              @click="handleDelete(item)"
            >
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
