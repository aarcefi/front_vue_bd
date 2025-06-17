<!-- views/ListadoInformes.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { getAllInformes, deleteInforme } from '@/functions.js'

// Datos reactivos
const data = ref([])
const openCreateDialog = ref(false)
const selectedInforme = ref(null)

// Encabezados de la tabla
const headers = ref([
  'No. Informe',
  'Unidad',
  'Pacientes Atendidos',
  'Pacientes Alta',
  'Pacientes Admitidos',
  'Total Pacientes',
  'Turno',
  'Hora',
  'Fecha',
  'Hospital',
  'Departamento',
  'Acciones',
])

async function cargarDatos() {
  const informes = await getAllInformes()
  data.value = informes.map(i => ({
    num_Inf: i.num_Inf,
    cod_Unidad: i.cod_Unidad,
    cant_PacAt: i.cant_Pacientes_Atendidos,
    cant_PacAlta: i.cant_Pacientes_Alta,
    cant_PacAdm: i.cant_pac_adm,
    cant_TotalPac: i.cant_Total_Pacientes,
    num_Turno: i.num_Turno,
    hora_Inf:i.hora_Inf,
    fecha_Inf: i.fecha_Inf,
    cod_Hptal: i.cod_Hptal,
    cod_Dpto: i.cod_Dpto,
  }))
}

async function eliminarInforme(num_Inf,cod_Unidad,cod_Hptal,cod_Dpto) {
  if (confirm('¿Estás seguro de eliminar este informe?')) {
    try {
      const resultado= await deleteInforme(num_Inf,cod_Unidad ,cod_Hptal,cod_Dpto)
      if(resultado.error){
        alert(resultado.error)
      }
      await cargarDatos()
    } catch (err) {
      alert(`❌ Error al eliminar el informe: ${err.message}`)
    }
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <v-container class="d-flex flex-row align-center justify-start">
    <h1>Informes</h1>
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
        <td>{{ item.num_Inf }}</td>
        <td>{{ item.cod_Unidad }}</td>
        <td>{{ item.cant_PacAt }}</td>
        <td>{{ item.cant_PacAlta }}</td>
        <td>{{ item.cant_PacAdm }}</td>
        <td>{{ item.cant_TotalPac }}</td>
        <td>{{ item.num_Turno }}</td>
        <td>{{ item.hora_Inf }}</td>
        <td>{{ item.fecha_Inf }}</td>
        <td>{{ item.cod_Hptal }}</td>
        <td>{{ item.cod_Dpto }}</td>
        <td class="d-flex justify-start" style="gap: 8px">
          <v-btn
              icon
              size="x-small"
              color="red"
              title="Eliminar"
              @click="eliminarInforme(item.num_Inf,item.cod_Unidad,item.cod_Hptal, item.cod_Dpto)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>
  </v-container>

  <!-- Modal para agregar/editar -->
  <InformeDialog v-model="openCreateDialog" :informe="selectedInforme" @submit="cargarDatos" />
</template>

<style scoped>
.v-table {
  max-width: 100vw;
}
.no-wrap {
  white-space: nowrap;
}
</style>
