import { useLocation } from "react-router-dom";

export function Callback() {

   const { hash } = useLocation();

   console.log("Callback hash:", hash);
    return (
        <div>
        <h1>Callback Page</h1>
        <p>Handling authentication callback...</p>
        </div>
    );
}