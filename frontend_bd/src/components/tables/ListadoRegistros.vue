<!-- views/ListadoRegistros.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import RegistroDialog from '@/components/modals/RegistroDialog.vue'
import { getAllRegistros, deleteRegistro } from '@/functions.js'

// Datos reactivos
const data = ref([])
const openCreateDialog = ref(false)
const selectedRegistro = ref(null)

// Encabezados de la tabla
const headers = ref([
  'Historia Clínica',
  'Unidad',
  'Fue Atendido',
  'Causa No Atendido',
  'Estado',
  'Fecha',
  'Código Hospital',
  'Código Departamento',
  'Acciones',
])

async function cargarDatos() {
  const registros = await getAllRegistros()
  data.value = registros.map(r => ({
    num_Historia_Clinica: r.num_Historia_Clinica,
    cod_Unidad: r.cod_Unidad,
    fue_Atendido: r.fue_Atendido,
    causa_No_Atendido: r.causa_No_Atendido,
    estado: r.estado,
    fecha_Registro: r.fecha_Registro,
    cod_Hptal: r.cod_Hptal,
    cod_Dpto: r.cod_Dpto 
  }))
}



function abrirModalAgregar() {
  selectedRegistro.value = null
  openCreateDialog.value = true
}

function editarRegistro(registro) {
  selectedRegistro.value = registro
  openCreateDialog.value = true
}

async function eliminarRegistro(cod_Unidad,cod_Dpto,cod_Hptal,num_Historia_clinica) {
  if (confirm('¿Estás seguro de eliminar este registro?')) {
    try {
      await deleteRegistro(cod_Unidad,cod_Dpto,cod_Hptal,num_Historia_clinica)
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
    <h1>Registros</h1>
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
          <td>{{ item.num_Historia_Clinica }}</td>
          <td>{{ item.cod_Unidad }}</td>
          <td>{{ item.fue_Atendido }}</td>
          <td>{{ item.causa_No_Atendido }}</td>
          <td>{{ item.estado  }}</td>
          <td>{{ item.fecha_Registro }}</td>
          <td>{{ item.cod_Hptal }}</td>
          <td>{{ item.cod_Dpto }}</td>
          <td class="d-flex justify-start" style="gap: 8px">
            <v-btn icon size="x-small" color="primary" title="Editar" @click="editarRegistro(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="x-small"
              color="red"
              title="Eliminar"
              @click="eliminarRegistro( item.cod_Unidad, item.cod_Dpto, item.cod_Hptal,item.num_Historia_Clinica)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <!-- Modal para agregar/editar -->
  <RegistroDialog v-model="openCreateDialog" :registro="selectedRegistro" @submit="cargarDatos" />
</template>

<style scoped>
.v-table {
  max-width: 100vw;
}
.no-wrap {
  white-space: nowrap;
}
</style>
