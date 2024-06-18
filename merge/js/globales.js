import { getFetch  } from "./fetch.js";

// const arr_horas_inicioAfin_por_barbero        = await getFetch('barberos');
const json_agenda                             = await getFetch('barberos/dia');
const json_barberInfo                         = await getFetch('barberos/data')

const barberos                                = {c05ada79dbe25: "alex", bf791a441a922:"Facu", df65fcd88bbe: "fede" }
let servicios                               = {pelo: {duracion:30, precio:350, DOMCheckbox: null}, barba:{duracion:15, precio:200, DOMCheckbox: null}, cejas: {duracion:15, precio:150, DOMCheckbox: null}}
const error = {
    1: "El nombre no puede ser vacio",
    2: "No se permite numeros en el nombre",
    3: "Verifique formato de mail",
    4: "Ingrese ambos contactos",
    5: "Error con barbero seleccionado",
    6: "No se permiten letras en el telefono",
    7: "Verifique la fecha ingresada",
    8: "Verifique la hora seleccionada",
    9: "La fecha debe ser vigente",
    10: "El email no puede ser vacio",
    11: "El telefono no puede ser vacio",
    12: "Debe seleccionar por lo menos 1 servicio",
  }
  
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

export  {barberos, error, months, json_agenda, json_barberInfo, servicios};
