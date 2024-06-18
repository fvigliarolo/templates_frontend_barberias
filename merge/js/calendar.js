import { barberos, error, months, servicios } from './globales.js'
import { getFetch, postFetch } from './fetch.js'

const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  eventWrappNombre = document.querySelector(".nombre-cliente "),
  eventWrappEmail = document.querySelector(".email-cliente "),
  eventWrappTelefono = document.querySelector(".telefono-cliente "),
  eventWrapperTitle = document.getElementById("event-wrapper-title"),
  addEventSubmit = document.querySelector(".add-event-btn"),
  back_btn_wrapper = document.querySelector('.back_btn_wrapper'),
  input_nombreCliente = document.getElementsByClassName('nombre-cliente')[0],
  input_mailCliente = document.getElementsByClassName('email-cliente')[0],
  input_telefonoCliente = document.getElementsByClassName('telefono-cliente')[0],
  buscarHorarios = document.getElementById('buscarHorarios'),
  calendarioLeft = document.getElementById('calendarioLeft'),
  seleccionServicios = document.getElementById('seleccionServicios'),
  calendarioRight = document.getElementById('calendarioRight'),
  contenedorServicio = document.getElementById("contenedorServicio"),
  spanNombreCliente = document.getElementById("spanNombreCliente"),
  spanEmailCliente = document.getElementById("spanEmailCliente"),
  spanTelefonoCliente = document.getElementById("spanTelefonoCliente"),
  totalYDuracion = document.getElementById("totalYDuracion");


prev.style.visibility = "hidden";
let precio;
function calcularTotalyDuracion() {
  let duracion = 0
  precio = 0
  for (let servicio in servicios) {
    if (servicios[servicio].DOMCheckbox != undefined) {
      if (servicios[servicio].DOMCheckbox.checked) {
        duracion += servicios[servicio].duracion
        precio += servicios[servicio].precio
      }
    }
  }
  totalYDuracion.innerHTML = `<span id="total" class="total">Total: $${precio}</span>
  <br>
  <span id="duracion" class="duracion">Duracion: ${duracion} minutos</span>`
}

crearServiciosEnDOM()

function crearServiciosEnDOM() {
  for (let servicio in servicios) {
    let seleccionServiciosCheckbox = document.createElement('div')
    seleccionServiciosCheckbox.className = "seleccionServiciosCheckbox"
    seleccionServiciosCheckbox.id = `seleccionServiciosCheckbox${servicio}`


    let checkboxLabel = document.createElement('div')
    checkboxLabel.className = "checkboxLabel"
    seleccionServiciosCheckbox.appendChild(checkboxLabel)
    let label = document.createElement('label')
    label.htmlFor = `checkboxServicios_${servicio}`
    label.className = `checkboxServicios_${servicio}`
    label.textContent = servicio
    let input = document.createElement('input')
    input.type = "checkbox"
    input.className = `checkboxServicios_${servicio}`
    input.name = `checkboxServicios_${servicio}`
    input.id = `checkboxServicios_${servicio}`
    input.checked = false
    checkboxLabel.appendChild(label)
    checkboxLabel.appendChild(input)

    let infoServicio = document.createElement('div')
    infoServicio.className = "infoServicio"
    infoServicio.id = `span${servicio}`
    let spanDuracion = document.createElement('span')
    spanDuracion.id = `spanDuracion${servicio}`
    spanDuracion.innerText = "Duracion: " + servicios[servicio].duracion + " min";
    let spanPrecio = document.createElement('span')
    spanPrecio.id = `spanPrecio${servicio}`
    spanPrecio.innerText = "Precio: $" + servicios[servicio].precio;
    infoServicio.appendChild(spanDuracion)
    infoServicio.appendChild(spanPrecio)
    seleccionServiciosCheckbox.appendChild(infoServicio)

    seleccionServicios.insertBefore(seleccionServiciosCheckbox, totalYDuracion)
    calcularTotalyDuracion()

    seleccionServiciosCheckbox.onclick = () => {
      input.onclick = () => {
        if (input.checked)
          input.checked = false
        else
          input.checked = true
        calcularTotalyDuracion()
      }
      if (input.checked)
        input.checked = false
      else
        input.checked = true
      calcularTotalyDuracion()
    }
    servicios[servicio].DOMCheckbox = input;
  }
}


let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let barberId;
let hora;
let eventoDate;
let errors = []
let selectElement = document.getElementById('mi-select');
let optionEmpty = document.createElement('option');
let lastDate;
let events3;
let eventsArr;
let btnServicios;


buscarHorarios.addEventListener("click", async () => {
    let serviciosSeleccionados = false
  for (let servicio in servicios) {
    if (servicios[servicio].DOMCheckbox.checked == true) {
      serviciosSeleccionados = true
    }
  }

  if (!serviciosSeleccionados){
    Swal.fire({
      title: 'Error',
      text: "Seleccione al menos un servicio",
      icon: 'error'
    });
  }else{

  contenedorServicio.style.display = 'none'
  let duracion = 0

  for (let servicio in servicios) {
    if (servicios[servicio].DOMCheckbox.checked)
      duracion += servicios[servicio].duracion
  }


  eventsArr = await postFetch("barberos", { duracion: duracion })



  seleccionServicios.style.display = 'none'
  calendarioLeft.style.display = 'block'
  calendarioRight.style.display = 'block'

  btnServicios = document.createElement("button");
  btnServicios.className = "btnServicios";
  btnServicios.id = "btnServicios";
  btnServicios.textContent = "Servicios";
  btnServicios.style.width = "75px";
  btnServicios.style.margin = "10px 10px 0 10px";
  btnServicios.onclick = () => {
    seleccionServicios.style.display = 'flex'
    calendarioLeft.style.display = 'none'
    calendarioRight.style.display = 'none'
    contenedorServicio.style.display = 'flex'
    contenedorServicio.style.flexDirection = 'column';
    contenedorServicio.style.alignItems = 'center';

    calendar.removeChild(btnServicios);
  }
  calendar.insertBefore(btnServicios, calendar.firstChild);

  initCalendar()
}
})


function initCalendar() {

  const firstDay = new Date(year, month, 1); // primer dia del mes actual
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;



  date.innerHTML = months[month] + " " + year;

  let days = "";
  let anio = year
  if (month == 1)
    anio = year - 1
  for (let x = day; x > 0; x--) {
    let event = false;
    let diaPrevio = prevLastDay.getDate() - x + 1

    eventsArr.forEach((eventObj) => {
      if (eventObj.day === diaPrevio && eventObj.month === month && eventObj.year === anio) {
        event = true
      }
    });
    if (event)
      days += `<div class="day prev-date event">${prevDays - x + 1}</div>`;
    else
      days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
        event = true;
      }
    });
    if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    let event = false;
    let anio = year
    if (month == 12)
      anio = year + 1
    eventsArr.forEach((eventObj) => {
      if (eventObj.day === j && eventObj.month === month + 2 && eventObj.year === anio) {
        event = true
      }
    });
    if (event)
      days += `<div class="day next-date event">${j}</div>`;
    else
      days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;


  // Quitamos estilos a los dias pasados
  const elemntDays = document.querySelector(".days");
  const hoy = new Date().getDate();
  elemntDays.childNodes.forEach((elementDay) => {
    if (!elementDay.className.includes("event")) {
      elementDay.classList.add("not-available")
    }else{
      elementDay.classList.add("available")
    }
  })

  addListner();
}

function prevMonth() {
  if ((month - 1) < today.getMonth())
    prev.style.visibility = "hidden"
  else {
    prev.style.visibility = "visible"
    month--;
    if ((month - 1) < today.getMonth()) // si vamos atras en el mes siguiente al actual, que desaparezca la flecha al llegar al mes actual 
      prev.style.visibility = "hidden"
    if (month < 0) {
      month = 11;
      year--;
    }
    initCalendar();
  }
}

function nextMonth() {
  prev.style.visibility = "visible"
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);



//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {

      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
    });
  });
}

function setToday() {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  console.log(`todaybtn ${today}`)
  initCalendar();
}

todayBtn.addEventListener("click", () => {
  setToday()
});

// verificamos que no se puedan ingresar formatos de fechas extranos
dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

  if (dateInput.value.length === 2 && dateInput.value.charAt(1) !== "/") {
    dateInput.value = dateInput.value.slice(0, 2) + "/" + dateInput.value.slice(2);
  } else if (dateInput.value.length === 1 && dateInput.value > 1) {
    dateInput.value = "0" + dateInput.value;
  } else if (dateInput.value.length === 3 && dateInput.value.charAt(2) !== "/") {
    dateInput.value = dateInput.value.slice(0, 2) + "/" + dateInput.value.slice(2);
  }

  if (dateInput.value.length > 5) {
    dateInput.value = dateInput.value.slice(0, 5);
  }

  if (e.inputType === "deleteContentBackward" && dateInput.value.length === 3 && dateInput.value.charAt(2) === "/") {
    dateInput.value = dateInput.value.slice(0, 2);
  }

  // Verificar si el primer número antes de "/" es mayor a 12
  const parts = dateInput.value.split("/");
  const month = parseInt(parts[0], 10);
  if (month > 12) {
    dateInput.value = "12/" + parts[1];
  }
});

// controlamos que no se pueda ingresar un numero de dia mayor al del mes que ingresamos
dateInput.addEventListener("input", (e) => {
  const inputValue = e.target.value.replace(/[^0-9/]/g, "");
  const parts = inputValue.split("/");
  const month = parts[0];
  const day = parts[1];

  if (month.length === 2 && day && day.length > 1 && day > getDaysInMonth(month)) {
    e.target.value = `${month}/${getDaysInMonth(month)}`;
  } else if (month.length > 2) {
    e.target.value = month.slice(0, 2);
  }
});

function getDaysInMonth(month) {
  const monthNumber = parseInt(month, 10);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return new Date(year, monthNumber, 0).getDate();
}


dateInput.addEventListener("blur", () => {
  const dateArr = dateInput.value.split("/");

  if (dateArr[1] < 10) {
    dateArr[1] = "0" + dateArr[1]
    dateInput.value = dateArr[0] + "/" + dateArr[1]
  }

})

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  function setActiveDay(dia) {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
      if (day.innerHTML == Number(dia)) {
        day.classList.add("active");
        getActiveDay(dia)
      } else {
        day.classList.remove("active")
      }
    })
  }

  const dateArr = dateInput.value.split("/");
  if (dateArr.length == 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length < 3 && dateArr[1] > 0 && dateArr[1] < 32) {
      setToday()
      if ((dateArr[0] - 1) < month){
      Swal.fire({
        title: 'Error',
        text: "Mes erroneo",
        icon: 'error'
      });
    }
      else if ((dateArr[1] < today.getDate()) && (dateArr[0] - 1) == month) {
        alert('dia anterior')
      } else {
        if (dateArr[0] > month) {
          let i = dateArr[0] - month - 1
          for (i; i > 0; i--) {
            nextMonth()
          }
        }
        setActiveDay(dateArr[1])


      }
      return;
    }
    Swal.fire({
      title: 'Error',
      text: "Fecha erronea",
      icon: 'error'
    });
  }
}

// function get active-day, day-name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toLocaleDateString('es-ES', { weekday: 'long' }).split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " de " + months[month] + " " + year;
}

//Agregar los valores posibles para el filtro por barbero
function setSelectBarberValues() {
  optionEmpty.value = ''; // Agregar una opción vacía como la primera opción
  optionEmpty.text = 'Todos los barberos';
  selectElement.appendChild(optionEmpty);

  for (let clave in barberos) {
    if (barberos.hasOwnProperty(clave)) {
      let valor = barberos[clave];

      let option = document.createElement('option');
      option.value = clave;
      option.text = valor;

      selectElement.appendChild(option);
    }
  }
}

function applySelectBarberoFilter() {
  let events;

  if (selectElement.value === '') {// Si se selecciona la opción vacía, se restablece la selección por defecto
    optionEmpty.selected = true;
    if (document.querySelector(".events").children[0].className != 'no-event' && lastDate == document.querySelector(".events").children[0].children[1].children[1].innerHTML) {
      events = document.querySelector(".events")
      events.innerHTML = events3.innerHTML
      lastDate = events.children[0].children[1].children[1].innerHTML
    }

  } else {
    if (document.querySelector(".events").children[0].className != 'no-event' && lastDate == document.querySelector(".events").children[0].children[1].children[1].innerHTML) {
      let events = document.querySelector(".events")

      events.childNodes.forEach((event) => event.remove())
      events = document.querySelector(".events")
      events.innerHTML = events3.innerHTML
      Object.entries(events.getElementsByClassName('event-barberID')).forEach((element) => {
        // comparamos el barberId seleccionado con cada uno de los elementos
        if (element[1].innerHTML != selectElement.value)
          element[1].parentElement.parentElement.remove()
      })

      lastDate = events.children[0].children[1].children[1].innerHTML
    }
    else {

      events = document.querySelector(".events")
      events3 = events.cloneNode(true)
      Object.entries(events.getElementsByClassName('event-barberID')).forEach((element) => {
        // comparamos el barberId seleccionado con cada uno de los elementos
        if (element[1].innerHTML != selectElement.value)
          element[1].parentElement.parentElement.remove()
      })

      lastDate = document.querySelector(".events").children[0].children[1].children[1].innerHTML
    }

  }
}

// Agregar un evento de cambio al elemento <select>
window.addEventListener('DOMContentLoaded', setSelectBarberValues());
selectElement.addEventListener('change', applySelectBarberoFilter);

function updateEvents(date) {
  let events = [];

  if (eventsContainer.children.length > 0)
    eventsContainer.innerHTML = ''

  eventsArr.forEach((event) => {
    if (date === event.day && month + 1 === event.month && year === event.year) {
      event.events.forEach((eventData) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
        let eventDataTime = eventData.time.split(":")[0] + ":" + eventData.time.split(":")[1]
        eventElement.innerHTML = `<div class="title">
          <span class="event-barberName">${eventData.title}</span>
          <span class="event-barberID" style="display: none;">${eventData.description}</span>
        </div>
        <div class="event-time">
          <span class="event-time-time">${eventDataTime}</span>
          <span class="event-date" style="display: none;">${eventData.date}</span>
        </div>`;

        events.push(eventElement);
      });
    }
  });

  if (events.length === 0) {
    const noEventElement = document.createElement("div");
    noEventElement.classList.add("no-event");
    noEventElement.innerHTML = "<h3>No quedan horas disponibles para el dia</h3>";
    eventsContainer.appendChild(noEventElement);
  } else {
    // funcion para transformar la hora con formato am/fm a 24hrs
    function getTimeFromSpan(spanElement) {
      var timeString = spanElement.textContent.trim();
      var timeParts = timeString.split(":");
      var hours = parseInt(timeParts[0]);
      var minutes = parseInt(timeParts[1]);
      var period = timeString.slice(-2);

      if (period.toLowerCase() === "pm" && hours < 12) {
        hours += 12;
      } else if (period.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      return hours * 100 + minutes;
    }
    // ordena de menor a mayor por hora
    let arrayOrdenado = events.sort(function (a, b) {
      let timeA = getTimeFromSpan(a.getElementsByClassName('event-time-time')[0])
      let timeB = getTimeFromSpan(b.getElementsByClassName('event-time-time')[0])
      return timeA - timeB;
    })
    arrayOrdenado.forEach((eventElement) => {
      eventsContainer.appendChild(eventElement);
    });
  }

  applySelectBarberoFilter();
}

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
  goBackWrapper()
});

//CIERRE EL MODAL CUANDO NO SE HACE CLICK DENTRO DEL CALENDARIO NI EN LOS EVENTOS
document.addEventListener("click", (e) => {
  if (!addEventWrapper.contains(e.target) && !eventsContainer.contains(e.target)) {
    addEventWrapper.classList.remove("active");
    goBackWrapper()
  }
});

//allow 50 chars in eventtitle
eventWrappNombre.addEventListener("input", (e) => {
  eventWrappNombre.value = eventWrappNombre.value.slice(0, 60);
});


//Borramos numeros en el campo nombre
eventWrappNombre.addEventListener("keyup", (e) => {
  e.target.value = e.target.value.replace(/\d/g, '');
});
//Verificar formato de mail

function validateEmail(mail) {
  let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(mail)
}

eventWrappTelefono.addEventListener("keyup", (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');
});

//function to add event to eventsArr
addEventSubmit.addEventListener("click", async () => {
  const NombreCliente = eventWrappNombre.value;
  const eventEmailCliente = eventWrappEmail.value;
  const eventTelefonoCliente = eventWrappTelefono.value;
  let serviciosReserva = ""
  let duracionServiciosReserva = 0

  for (let servicio in servicios) {
    if (servicios[servicio].DOMCheckbox.checked) {
      serviciosReserva += servicio + ", ";
      duracionServiciosReserva += servicios[servicio].duracion
    }
  }

  if (addEventSubmit.textContent == "Reservar") {
    if (errors.length > 0) {
      let errorMessages = errors.join(', ');
      Swal.fire({
        title: 'Errores encontrados',
        text: errorMessages,
        icon: 'error'
      });
      errors = []
      return
    } else {
      let datosReserva = []

      datosReserva.push(NombreCliente, eventEmailCliente, eventTelefonoCliente, eventoDate, hora, barberId, duracionServiciosReserva, serviciosReserva)

      if (eventsArr.length > 0) {
        Swal.fire({
          title: '<div style="display: flex; flex-direction: column; align-items: center;"><div>Procesando...</div><div class="loader"></div></div>',
          html: '<style>.loader {border: 16px solid #f3f3f3; border-radius: 50%; border-top: 16px solid #3498db; width: 120px; height: 120px !important; -webkit-animation: spin 2s linear infinite; /* Safari */ animation: spin 2s linear infinite;} @-webkit-keyframes spin {0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); }} @keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>',
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false 
        });

        let respuesta = await postFetch("reserva", { datosReserva: datosReserva });
      
        if (respuesta.respuesta == "Se envio un mail para confirmar la reserva") {
          Swal.close();
          Swal.fire({
            title: "Casi listo!",
            text: "Se envió un mail para confirmar la reserva.",
            icon: "success"
          });
        } else {
          Swal.close();
          Swal.fire({
            title: "Error!",
            text: "No se pudo hacer la reserva, algo salió mal.",
            icon: "error"
          });
        }
      }


      addEventWrapper.classList.remove("active");
      eventWrappNombre.value = "";
      eventWrappEmail.value = "";
      eventWrappTelefono.value = "";
      updateEvents(activeDay);
      const activeDayEl = document.querySelector(".day.active");
      if (!activeDayEl.classList.contains("event")) {
        activeDayEl.classList.add("event");
      }
    }

  } else {
    if (!validateEmail(eventEmailCliente) && eventEmailCliente != "")
      errors.push(error[3])
    if (isNaN(eventTelefonoCliente))
      errors.push(error[6])
    if (NombreCliente == "")
      errors.push(error[1])
    if (eventEmailCliente == "")
      errors.push(error[10])
    if (eventTelefonoCliente == "")
      errors.push(error[11])

    if (errors.length > 0) {
      let errorMessages = errors.join(', ');
      Swal.fire({
        title: 'Errores encontrados',
        text: errorMessages,
        icon: 'error'
      });
      errors = []
      return
    }
    else {

      addEventSubmit.textContent = "Reservar"
      document.querySelector('.add-event-footer').style.justifyContent = 'space-between'

      back_btn_wrapper.style.display = 'block'
      input_nombreCliente.style.display = 'none'
      input_mailCliente.style.display = 'none'
      input_telefonoCliente.style.display = 'none'
      spanNombreCliente.style.display = 'block'
      spanEmailCliente.style.display = 'block'
      spanTelefonoCliente.style.display = 'block'


      spanNombreCliente.innerHTML = "<b>Cliente:</b> " + NombreCliente
      spanNombreCliente.innerHTML += ", <u><i>" + eventTelefonoCliente + "</i></u>, " + eventEmailCliente
      spanEmailCliente.innerHTML = "<b>Servicios:</b> " + imprimirServicios(serviciosReserva) + " <i>(" + duracionServiciosReserva + " minutos)</i>"
      spanTelefonoCliente.innerHTML = "<b>Costo final: $<b>" + precio


    }
  }


});

function imprimirServicios(servicios) {
  let string = ""
  servicios = servicios.split(", ")
  servicios.forEach((servicio) => {
    string += servicio + ", "
  })
  // borrar ultima coma
  string = string.slice(0, -2)
  return string;

}

function openEventWrap(text) {
  goBackWrapper()
  addEventWrapper.classList.toggle("active");
  eventWrapperTitle.innerText = text
  eventWrapperTitle.style.fontWeight = "bold"
  // Scroll to the input field
  setTimeout(() => {
    eventWrappNombre.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500); 
}

function goBackWrapper() {
  back_btn_wrapper.style.display = 'none'
  input_nombreCliente.style.display = 'block'
  input_mailCliente.style.display = 'block'
  input_telefonoCliente.style.display = 'block'
  spanNombreCliente.style.display = 'none'
  spanEmailCliente.style.display = 'none'
  spanTelefonoCliente.style.display = 'none'
  eventWrapperTitle.style.display = 'block'

  addEventSubmit.textContent = "Siguiente"
  document.querySelector('.add-event-footer').style.justifyContent = 'center'
}

back_btn_wrapper.addEventListener("click", goBackWrapper)

eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {

    const eventBarberoID = e.target.getElementsByClassName('event-barberID')[0].innerHTML;
    const eventTime = e.target.getElementsByClassName('event-time-time')[0].innerHTML;
    const eventBarberName = e.target.getElementsByClassName('event-barberName')[0].innerHTML;
    const eventDate = e.target.getElementsByClassName('event-date')[0].innerHTML;
    eventoDate = eventDate



    hora = eventTime
    barberId = eventBarberoID

    let mostrarHora = eventTime.split(":")[0] + ":" + eventTime.split(":")[1]

    let mes = months[parseInt(eventoDate.split("/")[1], 10) - 1]
    let dia = eventoDate.split("/")[2]


    if (addEventWrapper.classList[1] == "active") {
      addEventWrapper.classList.remove("active");
      setTimeout(() => {
        openEventWrap("Barbero: " + eventBarberName + ", " + dia + " de " + mes + " " + mostrarHora + " hs")

      }, 300);

    } else {
      openEventWrap("Barbero: " + eventBarberName + ", " + dia + " de " + mes + " " + mostrarHora + " hs")
    }

    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        //if no events left in a day then remove that day from eventsArr
        if (event.events.length === 0) {
          eventsArr.splice(eventsArr.indexOf(event), 1);
          //remove event class from day
          const activeDayEl = document.querySelector(".day.active");
          if (activeDayEl.classList.contains("event")) {
            activeDayEl.classList.remove("event");
          }
        }
      }
    });
  }
});



// ejemplo de un evento
// ========================
// const eventsArr = [
//   {
//     day: 17,
//     month: 5,
//     year: 2023,
//     events: [
//       {
//         title: "Event 1 ",
//         time: "10:00 AM",
//         // dato: "a"
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//         // dato: "a"

//       },
//     ],
//   },  {
//     day: 17,
//     month: 5,
//     year: 2023,
//     events: [
//       {
//         title: "Event 3",
//         time: "12:00 AM",
//       },
//       {
//         title: "Event 4",
//         time: "13:00 PM",
//       },
//     ],
//   },
// ];
