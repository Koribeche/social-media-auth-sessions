import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

export default function Accueil({ user }) {
  const navigate = useNavigate();
  return (
    <div className="w-100 text-center">
      {user ? (
        <div>
          <img src={user.photo} className="userpic" alt="users profile" />
          <div>
            <span className="fw-bold">
              {user.nom} {user.prenom}
            </span>
            <p> {user.email} </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="btn btn-primary" onClick={() => navigate("/login")}>
            <FaSignInAlt /> Login
          </div>
        </div>
      )}
    </div>
  );
}
