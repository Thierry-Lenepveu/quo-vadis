import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import "../styles/User.css";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const firstNameHtmlElement = useRef<HTMLParagraphElement>(null);
  const lastNameHtmlElement = useRef<HTMLParagraphElement>(null);
  const emailHtmlElement = useRef<HTMLParagraphElement>(null);
  const occupationHtmlElement = useRef<HTMLParagraphElement>(null);

  const [modify, setModify] = useState(false);

  const transform = () => {
    const data: User = {} as User;
    data.first_name = firstNameHtmlElement.current?.textContent as string;
    data.last_name = lastNameHtmlElement.current?.textContent as string;
    data.email = emailHtmlElement.current?.textContent as string;
    data.occupation = occupationHtmlElement.current?.textContent as string;

    return data;
  };

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/users/${auth?.user_id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          navigate("/login");
        }

        return response.json();
      })
      .then((data: User) => {
        if (firstNameHtmlElement.current) {
          firstNameHtmlElement.current.textContent = data.first_name;
        }
        if (lastNameHtmlElement.current) {
          lastNameHtmlElement.current.textContent = data.last_name;
        }
        if (emailHtmlElement.current) {
          emailHtmlElement.current.textContent = data.email;
        }
        if (occupationHtmlElement.current) {
          occupationHtmlElement.current.textContent = data.occupation;
        }
      });
  }, [auth, navigate]);

  const handleLogout = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  const handleModify = async () => {
    if (modify) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${auth?.user_id}`,
        {
          method: "PUT",
          body: JSON.stringify(transform()),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        setModify(false);
        if (firstNameHtmlElement.current) {
          firstNameHtmlElement.current.contentEditable = "false";
          firstNameHtmlElement.current.classList.remove("editable");
        }
        if (lastNameHtmlElement.current) {
          lastNameHtmlElement.current.contentEditable = "false";
          lastNameHtmlElement.current.classList.remove("editable");
        }
        if (occupationHtmlElement.current) {
          occupationHtmlElement.current.contentEditable = "false";
          occupationHtmlElement.current.classList.remove("editable");
        }
      }
    } else {
      setModify(true);
      if (firstNameHtmlElement.current) {
        firstNameHtmlElement.current.contentEditable = "true";
        firstNameHtmlElement.current.classList.add("editable");
      }
      if (lastNameHtmlElement.current) {
        lastNameHtmlElement.current.contentEditable = "true";
        lastNameHtmlElement.current.classList.add("editable");
      }
      if (occupationHtmlElement.current) {
        occupationHtmlElement.current.contentEditable = "true";
        occupationHtmlElement.current.classList.add("editable");
      }
    }
  };
  return (
    <div className="user-container">
      <section>
        <h2>Espace utilisateur</h2>
      </section>
      <article>
        <section className="user-last-name">
          <p className="key">Nom: </p>
          <p className="user-last-name value" ref={lastNameHtmlElement} />
        </section>
        <section className="user-first-name">
          <p className="key">Prénom: </p>
          <p className="user-first-name value" ref={firstNameHtmlElement} />
        </section>
        <section className="user-email">
          <p className="key">Email: </p>
          <p className="user-email value" ref={emailHtmlElement} />
        </section>
        <section className="user-occupation">
          <p className="key">Profession: </p>
          <p className="user-occupation value" ref={occupationHtmlElement} />
        </section>
      </article>
      <section className="button-container">
        <button type="button" onClick={handleModify} className="modify-button">
          <img src="/images/edit-user.svg" alt="" />
          {modify ? "Sauvegarder" : "Modifier"}
        </button>
        <button type="button" onClick={handleLogout} className="logout-button">
          Se déconnecter
        </button>
      </section>
    </div>
  );
}

export default UserPage;
