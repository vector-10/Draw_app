import React from "react"


const Footer = () => {
  return(
    <section className="footer"> 
    <footer className="text-center text-white" style={{backgroundColor: "#0a4275"}}>  
      <div className="container p-4 pb-0">     
        <section className="">
          <p className="d-flex justify-content-center align-items-center">
            <span className="me-3">Collaborate with Artists!</span>
            <button data-mdb-ripple-init type="button" className="btn btn-outline-light btn-rounded">
              Sign up!
            </button>
          </p>
        </section>      
      </div>   
      <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
        © 2023 Copyright:
        <a className="text-white" href="#">VectorWare</a>
      </div>
    
    </footer>
  
  </section>
  )

}

export default Footer;