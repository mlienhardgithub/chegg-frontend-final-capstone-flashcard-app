import React, {useState} from "react";
import { Link, useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { createDeck } from "../utils/api/index";

export default function CreateDeck() {
  console.log('routeMatchOutput', useRouteMatch());
  const history = useHistory();

  const initialFormState = {
    name: '',
    description: ''
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
      setFormData({
          ...formData,
          [target.name]: target.value,
      });
  };

  function handleSubmit(event) {
      event.preventDefault();
      async function addDeck() {
          const abortController = new AbortController();
          try {
              console.log("Submitting: ", formData.name, formData.description);
              const name = formData.name;
              const description = formData.description;
              const payload = {name, description}; //package payload parameters
              const response = await createDeck(payload, abortController.signal)
              console.log('CreateDeck response.id:', response.id);
              history.push(`/decks/${response.id}`);
          } catch(error) {
              console.log('error:', error);
              abortController.abort(); // Cancels any pending request or response
          }
      }
      addDeck();
  }

  function handleCancel() {
    history.push("/");
    //<Redirect to="/"/>
  }

  return (
    <>
      <main className="container">
        <div className="card">
          <div className="card-body">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="bi bi-house-fill"></i>
                      <Link to="/">Home</Link>
                    </li>
                    <li
                        className="breadcrumb-item active" 
                        aria-current="page">
                      Create Deck
                    </li>
                </ol>
            </nav>
            <h2 className="card-title">
                Create Deck
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="name">Name: </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    placeholder="Deck Name"
                    value={formData.name}
                    required={true}
                    className="form-control" 
                />
                </div>
                <div className="form-group">
                <label htmlFor="description">Description: </label>
                <textarea
                    id="description"
                    type="text"
                    name="description"
                    onChange={handleChange}
                    placeholder="Brief description of the deck"
                    value={formData.description}
                    required={true}
                    rows={3} 
                    className="form-control" 
                />
                </div>
                <div className="btn-group" role="group">
                <button type="reset" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
                &nbsp;
                <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
