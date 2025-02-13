import { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import type { UserRegister } from "../types/user";

function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const [passwordValid, setPasswordValid] = useState(false);
  const [bothPasswordsEqual, setBothPasswordsEqual] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const transform = (formData: FormData) => {
    const data: UserRegister = {} as UserRegister;
    data.first_name = formData.get("first_name") as string;
    data.last_name = formData.get("last_name") as string;
    data.email = formData.get("email") as string;
    data.occupation = formData.get("occupation") as string;
    data.password = formData.get("password") as string;

    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event?.currentTarget;

    event.preventDefault();
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/verify-email?email=${form.email.value}`,
    );
    if (response.ok) {
      setEmailExists(true);
      return;
    }

    setEmailExists(false);
    const formData = new FormData(form);
    response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      method: "POST",
      body: JSON.stringify(transform(formData)),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      navigate("/login");
    } else {
      setErrorMessage("Une erreur est survenue, veuillez réessayer plus tard");
    }
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPasswordValid(testString(password));
  };

  const handleChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const password = event.target.value;
    const confirmPasswordElement = document.getElementById(
      "password",
    ) as HTMLInputElement;
    setBothPasswordsEqual(password === confirmPasswordElement?.value);
  };

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChangeEmail = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const email = event.target.value;
    setEmailValid(isValidEmail(email));
  };

  const testString = (str: string) => {
    // Vérifie si la longueur de la chaîne est supérieure à 13
    if (str.length <= 12) {
      return false;
    }

    // Vérifie la présence d'au moins un des caractères spéciaux
    const specialChars = /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/;
    if (!specialChars.test(str)) {
      return false;
    }

    // Vérifie la présence d'au moins un chiffre
    const digitChars = /[0-9]/;
    if (!digitChars.test(str)) {
      return false;
    }

    // Vérifie la présence d'au moins une minuscule et une majuscule
    const hasLowerCase = /[a-z]/;
    const hasUpperCase = /[A-Z]/;
    if (!hasLowerCase.test(str) || !hasUpperCase.test(str)) {
      return false;
    }

    return true;
  };

  return (
    <div className="register-container">
      <article className="image-container">
        <img src="/images/login-quovadis.webp" alt="quovadis" />
      </article>
      <article className="register-container">
        <h2>Créer mon compte</h2>
        <form
          onSubmit={handleSubmit}
          className="login-user-form"
          id="login-user-form"
        >
          <label htmlFor="last-name">Nom *</label>
          <input
            type="text"
            placeholder="Nom *"
            name="last_name"
            id="last-name"
          />
          <label htmlFor="first-name">Prénom *</label>
          <input
            type="text"
            placeholder="Prénom *"
            name="first_name"
            id="first-name"
          />
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            placeholder="Email *"
            name="email"
            id="email"
            onChange={handleChangeEmail}
            className={emailValid ? "email" : "email error"}
          />
          {!emailValid && <p>Adresse email invalide.</p>}
          <label htmlFor="occupation">Profession</label>
          <input type="text" name="occupation" id="occupation" />
          <label htmlFor="password">Mot de passe *</label>
          <input
            type="password"
            placeholder="Mot de passe *"
            name="password"
            id="password"
            onChange={handleChangePassword}
            className={passwordValid ? "password" : "password error"}
          />
          {!passwordValid && (
            <p>
              {`Le mot de passe doit contenir au moins 13 caractères, une majuscule,
            une minuscule, un chiffre et un caractère spécial (!"#$%&'()*+,\x5C-./:;<=>?@[\x5D^_\x60\x7B|\x7D~)`}
            </p>
          )}
          {errorMessage && <p>{errorMessage}</p>}
          <label htmlFor="password-confirm">Confirmer le mot de passe *</label>
          <input
            type="password"
            placeholder="Confirmer le mot de passe *"
            name="passwordConfirm"
            id="password-confirm"
            className={
              bothPasswordsEqual ? "password-confirm" : "password-confirm error"
            }
            onChange={handleChangeConfirmPassword}
          />
          {!bothPasswordsEqual && <p>Les mots de passe ne correspondent pas</p>}
          {emailExists && <p>L'email ci-dessus est déjà utilisé.</p>}
          <div className="button-container">
            <button
              type="submit"
              disabled={!(passwordValid && bothPasswordsEqual)}
            >
              Créer le compte
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}

export default RegisterPage;
