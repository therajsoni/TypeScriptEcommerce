import { MdErrorOutline } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="container not-found">
      <span className="svg">
        <MdErrorOutline />
      </span>
      <h1>Page Not Found</h1>
    </div>
  );
}
