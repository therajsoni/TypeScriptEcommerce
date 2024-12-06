function Loader() {
  return <div>Loader...</div>;
}

export default Loader;

export const Skeleton = ({ width = "unset" }: { width?: string }) => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
    </div>
  );
};
