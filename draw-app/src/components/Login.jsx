/* eslint-disable no-unused-vars */
import React from "react";

const Login = () => {
  return (
    <div className="signup-form">
      <section
        className="h-100 gradient-form"
        style={{ backgroundColor: "#eee" }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                          style={{ width: "185px" }}
                          alt="logo"
                        />
                        <h4 className="mt-1 mb-5 pb-1">
                           The Lotus 
                        </h4>
                      </div>

                      <form>
                        <p>Please login to your account</p>

                        <div className="form-outline mb-2">
                          <input
                            type="email"
                            id="form2Example11"
                            className="form-control"
                            placeholder=" email address"
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example11"
                          >
                            Email
                          </label>
                        </div>

                        <div className="form-outline mb-2">
                          <input
                            type="password"
                            id="form2Example22"
                            className="form-control"
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example22"
                          >
                            Password
                          </label>
                        </div>

                        <div className="text-center pt-1 mb-5 pb-1">
                          <button
                            className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                            type="button"
                          >
                            Log in
                          </button>
                       
                        </div>

                        <div className="d-flex align-items-center justify-content-center pb-4">
                          <p className="mb-0 me-2">Do not have an account?</p>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                          >
                            Create new
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">Collaborate Online</h4>
                      <p className="small mb-0">
                        Hey there!, welcome back to The Lotus. Your online
                        collaborative sketchboard. We hope you are enjoying your time with us, 
                        keep expanding your network and explore new features to enable you.           
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
