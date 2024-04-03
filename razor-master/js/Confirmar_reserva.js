
import { postFetch } from "./fetch.js";

const Confirmar_reserva = async () => {

      const urlParams = new URLSearchParams(window.location.search.split('?')[1]);
      const codigo = urlParams.get('codigo');
      const reserva_id = urlParams.get('reserva_id');
      const mail = urlParams.get('mail');

     let response = await hacer_reserva(codigo, reserva_id, mail);
     if(response == "Se confirmo la reserva con exito"){;
      document.querySelector(".contenedorConfirmarReserva").innerHTML = `
      <div class="contenedor2 style="
      background: var(--third-txt);
      width: 50%;
      border-radius: 10px;
      height: 50%;
      display: flex;
      align-content: center;
  "">
       <div class="contenedor3" style="
       background: var(--event-clr);
       width: 98%;
       height: 98%;
       display: flex;
       align-items: center;
       justify-content: center;
       margin: auto;
       border-radius: 10px;
   ">
           <h1 style="
           color: var(--background);
       ">Reserva realizada con exito</h1>
       </div>
      </div>`
        return view;
     }else{
      document.querySelector(".contenedorConfirmarReserva").innerHTML = `
      <div class="contenedor2 style="
      background: var(--third-txt);
      width: 50%;
      border-radius: 10px;
      height: 50%;
      display: flex;
      align-content: center;
  "">
       <div class="contenedor3" style="
       background: red;
       width: 98%;
       height: 98%;
       display: flex;
       align-items: center;
       justify-content: center;
       margin: auto;
       border-radius: 10px;
   ">
           <h1 style="
           color: var(--background);
       ">No se pudo confirmar la reserva</h1>
       </div>
      </div>`
      return view
    }
    
    
 
  };


  async function hacer_reserva(codigo, reserva_id, mail) {
    let datos_de_reserva = [codigo, reserva_id, mail]
    let response = await postFetch('reserva/confirmar_reserva', datos_de_reserva);
    return response
}
  
  export default Confirmar_reserva;

  