//ASYNC-AWAIT CON RECURSIVIDAD
/* 1er Problema y mas importante creo yo : NO ESTOY DEL TODO SEGURO SI ESTA BIEN COMO RESOLVI EL PROBLEMA DE MOSTRAR LAS ORDENES YA QUE TUVE QUE PONER "carpetsArchivosTotales"
EN -1 PORQUE SINO ME CONTABA QUE TENIA UNA CARPETA O ARCHIVO DE MAS.. NO SE PORQUE SERA Y COMO LO RESOLVERIAS VOS YA QUE NO PUEDO SABER EN LA PRIMERA INSTANCA EL TAMANO DE 
TODOS LOS ARCHIVOS Y CARPETAS TOTALES DEBIDO A QUE VA DE FORMA RECURSIVA */
const fs = require('fs').promises
const path = require('path')
const dir = path.join(__dirname, 'input')
let total = 0
const Mostrar = false
let carpetasArchivosTotales = -1 
let carpetasProcesadas = 0
let ordenesProcesadas = 0

const recorrerDirectorio = async (pathRelativo) => {
  const carpetasArchivos = await fs.readdir(pathRelativo)
  carpetasArchivosTotales += carpetasArchivos.length 
  for (let index = 0; index < carpetasArchivos.length; index++) {
    const carpetaArchivo = carpetasArchivos[index]
    const pathCarpetaArchivo = path.join(pathRelativo, carpetaArchivo)
    await procesarPath(pathCarpetaArchivo) /* POR CADA "pathCarpetaArchivo" VOY A ESPERAR QUE SE PROCESE, POR ESO PONGO EL AWAIT PERO NO SE LO ASIGNO A NINGUNA VARIABLE 
    YA QUE NO LO NECESITO. NO? */
  }
}

const calcularTotal = async (jsonObjeto) => {
  const totales = await (total = total + jsonObjeto.total)
  Mostrar && console.log(`Total Carpetas y Archivos :${carpetasArchivosTotales} || Carpetas Procesadas :${carpetasProcesadas}  Ordenes Procesadas  :${ordenesProcesadas}`)
  if(carpetasArchivosTotales === carpetasProcesadas + ordenesProcesadas){
    console.log(` El Total de los seguros es ->  $ ${total} !!! `)
  }
}

const validarJson = async (carpetasJson) => {
  try{
    const jsonString = carpetasJson.toString()
    const jsonObjeto = await JSON.parse(jsonString)
    if(!jsonObjeto.producto){
      throw new Error(`Falta producto : `)
    }else if(!jsonObjeto.hasOwnProperty('id')){
      throw new Error(`Falta id : `)
    }else if(!jsonObjeto.hasOwnProperty('total')){
      throw new Error(`Falta total : `)
    }else{
      calcularTotal(jsonObjeto)
    }
  }catch(error){
    Mostrar && console.log(`${error}  ${carpetasJson} `)
  }
}

const procesarArchivo = async (pathCarpetaArchivo) => {
  if(pathCarpetaArchivo.endsWith('.json')){
    const carpetasJson = await fs.readFile(pathCarpetaArchivo)
    if(carpetasJson){
      validarJson(carpetasJson)
    }
  }else{
    try{
      throw new Error(`${pathCarpetaArchivo} No termina en ".json "`)
    }catch(errorJson){
      Mostrar && console.log(errorJson)
    }
  }
}

const procesarPath = async (pathCarpetaArchivo) => {
  const stats = await fs.stat(pathCarpetaArchivo) // DUDA: NO SE SI HACE FALTA EL AWAIT EN EL STAT PERO LO PONGO PARA ASEGURARME
  if(stats.isDirectory()){
    carpetasProcesadas += 1
    return recorrerDirectorio(pathCarpetaArchivo) // TAMPOCO SE SI HACE FALTA RETORNAR DICHA FUNCION PERO POR LAS DUDAS TAMBIEN LE CLAVO RETURN A AMBAS FUNCIONES, SI FALLA EN ESTE CASO DEVUELVE UN PROMISE.RESOLVE().. ? IGUALMENTE TENGO TODO CATCHEADO, PERDON POR BURRO PERO TENIA ESA DUDA.
  }else if(stats.isFile()){
    ordenesProcesadas += 1
    return procesarArchivo(pathCarpetaArchivo)
    }
}

procesarPath(dir)