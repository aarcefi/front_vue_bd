import axios from 'axios'

//*******************LOGIN************************************ */
export async function login(usuario) {
  const formData = new URLSearchParams()
  formData.append('username', usuario.username)
  formData.append('password', usuario.password)

  try {
    const response = await fetch(`http://localhost:9090/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })

    const data = await response.json()
    if (data.success === true) {
      localStorage.setItem('isLoggedIn', 'true')
      return true
    } else {
      alert(data.error || '❌ Credenciales incorrectas')
      return false
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err.message)
    alert('❌ Error al iniciar sesión')
    return false
  }
}

export async function register(usuario) {
  const formData = new URLSearchParams()
  formData.append('username', usuario.username)
  formData.append('password', usuario.password)

  try {
    const response = await fetch(`http://localhost:9090/api/usuarios/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })

    const data = await response.json()
    if (data.success === true) {
      alert('✅ Registro exitoso')
      return true
    } else {
      alert(data.error || '❌ No se pudo registrar')
      return false
    }
  } catch (err) {
    console.error('Error al registrar:', err.message)
    alert('❌ Error al registrar')
    return false
  }
}

//*****************************************PACIENTE
export async function getPacientes() {
  try {
    const response = await axios.get('http://localhost:9090/api/pacientes/getAll', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.pacientes || []
  } catch (error) {
    console.error('Error al obtener pacientes:', error.response?.data || error.message)
    return []
  }
}

export async function createPaciente(paciente) {
  const formData = new URLSearchParams()
  formData.append('num_Historia_clinica', paciente.num_Historia_clinica)
  formData.append('nombre_Paciente', paciente.nombre_Paciente)
  formData.append('direccion_Paciente', paciente.direccion_Paciente || '')
  formData.append('fecha_Nacimiento', paciente.fecha_Nacimiento)

  try {
    const response = await axios.post(
        'http://localhost:9090/api/pacientes/create',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
    )
    return response.data
  } catch (error) {
    console.error('Error al crear paciente:', error.response?.data || error.message)
    throw error
  }
}

export async function deletePaciente(num_Historia_Clinica) {
  try {
    const response = await axios.delete(
        `http://localhost:9090/api/pacientes/delete/${num_Historia_Clinica}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
    )
    alert(response.statusText)
  } catch (error) {
    alert(error)
  }
}

export async function getPacienteByHistoria(historia) {
  try {
    const response = await axios.get(`http://localhost:9090/api/pacientes/${historia}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data || {}
  } catch (error) {
    console.error('Error al obtener paciente:', error.response?.data || error.message)
    return {}
  }
}

export async function updatePaciente(historia, paciente) {
  const formData = new URLSearchParams()
  formData.append('nombre_Paciente', paciente.nombre_Paciente)
  formData.append('direccion_Paciente', paciente.direccion_Paciente || '')
  formData.append('fecha_Nacimiento', paciente.fecha_Nacimiento) 

  try {
    const response = await axios.put(
        `http://localhost:9090/api/pacientes/update/${historia}`,
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
    )
    return response.data
  } catch (error) {
    console.error('Error al actualizar paciente:', error.response?.data || error.message)
    throw error
  }
}

//----------------------------------------------------------------MEDICO
export async function getAllMedicos() {
  try {
    const response = await axios.get(`http://localhost:9090/api/medicos/getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.medicos || []
  } catch (error) {
    console.error('Error al obtener médicos:', error.response?.data || error.message)
    return []
  }
}

export async function getMedicoByCodigo(cod_Med) {
  try {
    const response = await axios.get(`http://localhost:9090/api/medicos/${cod_Med}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data || {}
  } catch (error) {
    console.error('Error al obtener médico:', error.response?.data || error.message)
    return {}
  }
}
export async function updateMedico( medico) {
  const formData = new URLSearchParams()
  formData.append('cod_Med', medico.cod_Med)
  formData.append('nombre_Med', medico.nombre_Med)
  formData.append('Apellidos', medico.Apellidos)
  formData.append('especialidad', medico.especialidad)
  formData.append('num_Licencia', medico.num_Licencia)
  formData.append('telefono', medico.telefono)
  formData.append('anios_Expmed', medico.anios_Expmed)
  formData.append('datos_Contacto', medico.datos_Contacto)
  formData.append('cod_Unidad', medico.cod_Unidad)
  formData.append('cod_Dpto', medico.cod_Dpto)
  formData.append('cod_Hptal', medico.cod_Hptal)

  try {
    const response = await axios.post('http://localhost:9090/api/medicos/update', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error al actualizar médico:', error.response?.data || error.message)
    throw error
  }
}

export async function deleteMedico(cod_Med, cod_Unidad, cod_Dpto, cod_Hptal) {
  try {
    const response = await axios.delete(
        `http://localhost:9090/api/medicos/delete/${cod_Med}/${cod_Unidad}/${cod_Dpto}/${cod_Hptal}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
    )
    return response.data
  } catch (error) {
    console.error('Error al eliminar médico:', error.response?.data || error.message)
    throw error
  }
}

export async function createMedico(medico) {
  const formData = new URLSearchParams()
  formData.append('cod_Med', medico.cod_Med)
  formData.append('nombre_Med', medico.nombre_Med)
  formData.append('Apellidos', medico.Apellidos)
  formData.append('especialidad', medico.especialidad)
  formData.append('num_Licencia', medico.num_Licencia)
  formData.append('telefono', medico.telefono)
  formData.append('anios_Expmed', medico.anios_Expmed)
  formData.append('datos_Contacto', medico.datos_Contacto)
  formData.append('cod_Unidad', medico.cod_Unidad)
  formData.append('cod_Dpto', medico.cod_Dpto)
  formData.append('cod_Hptal', medico.cod_Hptal)

  const response = await axios.post('http://localhost:9090/api/medicos/create', formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })

  return response.data
}

//------------------------------HOSPITAL---------------
export async function getHospitales(params) {
  
}


export async function getAllHospitals() {
  try {
    const response = await axios.get(`http://localhost:9090/api/hospitales/getAll`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data.hospitales || []
  } catch (error) {
    console.error('Error al obtener hospitales:', error.response?.data || error.message)
    return []
  }
}

export async function createHospital(hospital) {
  const formData = new URLSearchParams()
  formData.append('cod_Hptal', hospital.cod_Hptal)
  formData.append('nombre_hptal', hospital.nombre_hptal)

  const response = await axios.post(`http://localhost:9090/api/hospitales/create`, formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  return response.data
}

export async function updateHospital(hospital) {
  const formData = new URLSearchParams()
  formData.append('cod_hptal', hospital.cod_Hptal)
  formData.append('nombre_hptal', hospital.nombre_hptal)

  const response = await axios.put(`http://localhost:9090/api/hospitales/update`, formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  return response.data
}

export async function deleteHospital(cod_Hptal) {
  const response = await axios.delete(`http://localhost:9090/api/hospitales/delete/${cod_Hptal}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  return response.data
}

//-------------DEPARTAMENTO
export async function createDepartamento(departamento) {
  const formData = new URLSearchParams()
  formData.append('cod_Dpto', departamento.cod_Dpto)
  formData.append('nombre_Dpto', departamento.nombre_Dpto)
  formData.append('cod_Hptal', departamento.cod_Hptal)

  try {
    const response = await axios.post(`http://localhost:9090/api/departamentos/create`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error al crear departamento:', error.response?.data || error.message)
    throw error
  }
}

export async function getAllDepartamentos() {
  try {
    const response = await axios.get(`http://localhost:9090/api/departamentos/getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.departamentos || []
  } catch (error) {
    console.error('Error al obtener departamentos:', error.response?.data || error.message)
    return []
  }
}

export async function updateDepartamento(departamento) {
  const formData = new URLSearchParams()
  formData.append('cod_Dpto', departamento.cod_Dpto)
  formData.append('nombre_Dpto', departamento.nombre_Dpto)
  formData.append('cod_Hptal', departamento.cod_Hptal)


  const response = await axios.put(`http://localhost:9090/api/departamentos/update`, formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return response.data
}


export async function deleteDepartamento(cod_Hptal,cod_Dpto) {
  const response = await axios.delete(`http://localhost:9090/api/departamentos/delete/${cod_Hptal}/${cod_Dpto}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return response.data
}

//----------------------------------UNIDAD
export async function createUnidad(unidad) {
  const formData = new URLSearchParams()
  formData.append('cod_Unidad', unidad.cod_Unidad)
  formData.append('nombre_Unidad', unidad.nombre_Unidad)
  formData.append('ubicacion_Hptal', unidad.ubicacion_Hptal || '')
  formData.append('cod_Dpto', unidad.cod_Dpto)
  formData.append('cod_Hptal', unidad.cod_Hptal)

  try {
    const response = await axios.post(`http://localhost:9090/api/unidades/create`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error al crear unidad:', error.response?.data || error.message)
    throw error
  }
}


export async function updateUnidad(unidad) {
  const formData = new URLSearchParams()
  formData.append('cod_Unidad', unidad.cod_Unidad)
  formData.append('nombre_Unidad', unidad.nombre_Unidad)
  formData.append('ubicacion_Hptal', unidad.ubicacion_Hptal || '')
  formData.append('cod_Dpto', unidad.cod_Dpto)
  formData.append('cod_Hptal', unidad.cod_Hptal)
  const response = await axios.put(`http://localhost:9090/api/unidades/update/`, formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return response.data
}

export async function deleteUnidad( cod_Hptal, cod_Dpto,cod_Unidad) {

  const response = await axios.delete(
      `http://localhost:9090/api/unidades/delete/${cod_Hptal}/${cod_Dpto}/${cod_Unidad}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
  )
  return response.data
}

export async function getAllUnidades() {
  try {
    const response = await axios.get(`http://localhost:9090/api/unidades/getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.unidades || []
  } catch (error) {
    console.error('Error al obtener unidades:', error.response?.data || error.message)
    return []
  }
}

//-------------------------------------REGISTRO-------------------------
export async function updateRegistro(historia, cod_Unidad, datos) {
  const formData = new URLSearchParams()
  formData.append('fue_Atendido', datos.fue_Atendido)
  formData.append('causa_No_Atendido', datos.causa_No_Atendido || '')
  formData.append('estado', datos.estado || '')
  formData.append('fecha_Registro', datos.fecha_Registro || new Date().toISOString().split('T')[0])

  const response = await axios.put(`http://localhost:9090/api/registro/update/${historia}/${cod_Unidad}`, formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  return response.data
}
export async function deleteRegistro(params) {
  alert("CODIGO DE BORRAR")
}

export async function getAllRegistros() {
  try {
    const response = await axios.get(`http://localhost:9090/api/registro/getAll`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Respuesta del servidor:', response.data) // Depuración
    return response.data || []
  } catch (error) {
    console.error('Error al obtener registros:', error.response?.data || error.message)
    return [];
  }
}

export async function createRegistro(registro) {
  try {
    const formData = new URLSearchParams()
    formData.append('num_Historia_Clinica', registro.num_Historia_Clinica)
    formData.append('cod_Unidad', registro.cod_Unidad)
    formData.append('fue_Atendido', registro.fue_Atendido ? 'true' : 'false')
    formData.append('causa_No_Atendido', registro.causa_No_Atendido || '')
    formData.append('estado', registro.estado)
    formData.append('fecha_Registro', registro.fecha_Registro)

    const response = await axios.post('http://localhost:9090/api/registro/create', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return response.data
  } catch (err) {
    console.error('Error al crear médico:', err.response?.data || err.message)
    throw new Error(`No se pudo crear el médico: ${err.message}`)
  }
}

export async function getRegistroByHistoriaUnidad(historia, cod_Unidad) {
  try {
    const response = await axios.get(`http://localhost:9090/api/registro/${historia}/${cod_Unidad}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data || {}
  } catch (error) {
    console.error('Error al obtener registro:', error.response?.data || error.message)
    return {}
  }
}

//--------------------------------------INFORME
export async function createInforme(informe) {
  const formData = new URLSearchParams()
  formData.append('cod_Unidad', informe.cod_Unidad)
  formData.append('cant_Pacientes_Atendidos', informe.cant_Pacientes_Atendidos)
  formData.append('cant_Pacientes_Alta', informe.cant_Pacientes_Alta)
  formData.append('cant_pac_adm', informe.cant_pac_adm)
  formData.append('cant_Total_Pacientes', informe.cant_Total_Pacientes)
  formData.append('num_Turno', informe.num_Turno)
  formData.append('hora_Inf', informe.hora_Inf)
  formData.append('fecha_Inf', informe.fecha_Inf)
  formData.append('cod_Hptal', informe.cod_Hptal)
  formData.append('cod_Dpto', informe.cod_Dpto)

  try {
    const response = await axios.post(`http://localhost:9090/api/informes/create`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error al crear informe:', error.response?.data || error.message)
    throw error
  }
}

export async function getAllInformes() {
  try {
    const response = await axios.get(`http://localhost:9090/api/informes/getAll`,{
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.informes || []
  } catch (error) {
    console.error('Error al obtener informes:', error.response?.data || error.message)
    return []
  }
}

export async function updateInforme(params) {
  alert("CODIGO DE MODIFICAR")
}

export async function deleteInforme(numInf,codUnidad,codHptal,codDpto) {
  const response = await axios.delete(`http://localhost:9090/api/informes/delete/${numInf}/${codUnidad}/${codHptal}/${codDpto}`,{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return response.data
}

//---------------------------------TURNO
export async function createTurno(turno) {
  const formData = new URLSearchParams()
  formData.append('cod_Hptal', turno.cod_Hptal)
  formData.append('cod_Dpto', turno.cod_Dpto)
  formData.append('cod_Unidad', turno.cod_Unidad)
  formData.append('cod_Medico', turno.cod_Unidad)
  formData.append('num_Turno', turno.cod_Med)
  formData.append('cant_Pacientes_Atendidos', turno.cant_Pacientes_Atendidos)
  formData.append('cant_Pacientes_Asignados', turno.cant_Pacientes_Asignados)

  try {
    const response = await axios.post(`http://localhost:9090/api/turnos/create`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error al crear turno:', error.response?.data || error.message)
    throw error
  }
}

export async function getAllTurnos() {
  try {
    const response = await axios.get(`http://localhost:9090/api/turnos/getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.turnos || []
  } catch (error) {
    console.error('Error al obtener turnos:', error.response?.data || error.message)
    return []
  }
}

export async function updateTurno(params) {
  alert("CODIGO DE MODIFICAR")
}

export async function deleteTurno(num_Turno,cod_Unidad,cod_Dpto,cod_Hptal) {
  try {
    const response = await axios.delete(
        `http://localhost:9090/api/turnos/delete/${num_Turno}/${cod_Unidad}/${cod_Dpto}/${cod_Hptal}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
    )
    alert(response.statusText)
  } catch (error) {
    alert(error)
  }
}

//---------------------REPORTES
export async function getHospitalesConMasDe100Pacientes() {
  try {
    const response = await axios.get(`http://localhost:9090/api/hospitales/masde100`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.hospitales || []
  } catch (error) {
    console.error(
        'Error al obtener hospitales con más de 100 pacientes:',
        error.response?.data || error.message,
    )
    return []
  }
}

export async function getResumenPorHospitales() {
  try {
    const response = await axios.get(`http://localhost:9090/api/resumen/hospitales`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.resumen || []
  } catch (error) {
    console.error('Error al obtener resumen por hospitales:', error.response?.data || error.message)
    return []
  }
}

export async function getUnidadesARevisar() {
  try {
    const response = await axios.get(`http://localhost:9090/api/unidades/revisar-turno`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data.unidades || []
  } catch (error) {
    console.error('Error al obtener unidades a revisar:', error.response?.data || error.message)
    return []
  }
}


export async function getConsultasExitosas() {
  try {
    const response = await axios.get('http://localhost:9090/api/reportes/getConsultasExitosas', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data.consultas || []
  } catch (error) {
    console.error('Error al obtener consultas exitosas:', error.response?.data || error.message)
    return []
  }
}