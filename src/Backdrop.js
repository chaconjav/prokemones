const Backdrop = (props) => {
  return (
    <div className="backdrop">
      <div className="modal">
        <div className="summary">
          <div>
            <img src={props.data.sprite_front} alt="" />
          </div>
          <div className="data">
            <div className="marked big">{props.data.name}</div>
            <div>
              Peso: {props.data.weight} Altura: {props.data.height}
            </div>
          </div>
        </div>
        <div className="summary">
          <div>
            <img src={props.data.sprite_back} alt="" />
          </div>
          <div>
            <div className="marked">Movimientos:</div>
            <div>{props.data.mov1}</div>
            <div>{props.data.mov2}</div>
            <div>{props.data.mov3}</div>
          </div>
        </div>
        <button
          onClick={() => {
            props.closeModal();
            document.querySelector("body").classList.remove("backdropOpen");
          }}
        >
          Close Modal Window
        </button>
      </div>
    </div>
  );
};

export default Backdrop;
