//ASYNC-AWAIT SIN RECURSIVIDAD
const fs = require('fs').promises
const path = require('path')
const dir = path.join(__dirname, 'input')
const Mostrar = false

const saberDirectorio = async (carpetasPath) => {
  const stat = await fs.stat(carpetasPath)
 if(stat.isDirectory()){
   return carpetasPath
  }else{
    try{
      throw new Error(`No es una carpeta : ${carpetasPath}`)
    }catch(error){
      Mostrar && console.log(error)
    }
  }
}

const mostrarTotal = (total) => { /* PODRIA HACERLO ASYNC COMO EN TODO EL CODIGO PERO ME AHORRO EN HACERLO PORQUE 
                                     NO TENGO NINGUNA FUNCION COMO EL FS.READDIR O PARECIDA PARA TENER PARALELISMO,
                                     CREO QUE TAMBIEN ME LO PODRIA HABER AHORRADO EN EL FS.STAT */
  console.log(` El Total de los seguros es ->  $ ${total} !!! `)
}

const validarOrdenes = async (arrayOrdenes) => {
  let total = 0
  for (let index = 0; index < arrayOrdenes.length; index++) { // ~ IDEM #1 ~
    const ordenValidarOrdenes = arrayOrdenes[index]
    if(ordenValidarOrdenes.endsWith('.json')){
      const leerOrden = await fs.readFile(ordenValidarOrdenes)
      const jsonString = leerOrden.toString()
      const jsonObjeto = JSON.parse(jsonString)
      total = total + jsonObjeto.total
    }
  }
  mostrarTotal(total) // ~ IDEM #2 ~
}

const leerCarpetas = async (arrayCarpetas) => {
  const arrayOrdenes = []
  for (let index = 0; index < arrayCarpetas.length; index++) {  // ~ IDEM #1 ~
    const carpetaLeerCarpetas = arrayCarpetas[index]
    const ordenes = await fs.readdir(carpetaLeerCarpetas)
    for (let index = 0; index < ordenes.length; index++) {
      const orden = ordenes[index]
      const ordenesPath = path.join(carpetaLeerCarpetas,orden)
      arrayOrdenes.push(ordenesPath)
    }
  }
  validarOrdenes(arrayOrdenes) // ~ IDEM #2 ~
}

 const procesarCarpetas = async(carpetas) => {
  const arrayCarpetas = []
  for (let index = 0; index < carpetas.length; index++) { // ~ SI USO EL FOREACH, NO ES LO MISMO POR LO QUE VI EN EL VIDEO NO? ~ #1
    const carpeta = carpetas[index]
    const carpetasPath = path.join(dir,carpeta)
    const carpetaFiltrada = await saberDirectorio(carpetasPath)
    if(carpetaFiltrada){
      arrayCarpetas.push(carpetaFiltrada)
    }
  }
   leerCarpetas(arrayCarpetas) // ~ HACE FALTA O ES MEJOR HACER RETURN EN LAS FUNCIONES ESTAS O ESTARIA BIEN ASI ? ~#2
}

const main = async _ => {
  const carpetas = await fs.readdir(dir) // ESPERO A QUE LEA EL INPUT (DESVENTAJA DEL CODIGO DE RECURSIVIDAD: SI ES UN ARCHIVO SE ROMPERIA EL CODIGO CREO)
  procesarCarpetas(carpetas) 
}

main()
