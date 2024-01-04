import React, {useState} from "react";
import { Link, useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { createDeck } from "../utils/api/index";
import DeckForm from "./DeckForm";

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
            <DeckForm
                name={formData.name}
                description={formData.description}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleCancel={handleCancel}
            />
          </div>
        </div>
      </main>
    </>
  );
}
