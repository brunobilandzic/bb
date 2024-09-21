import { useSelector } from "react-redux";

const LoadingWrapper = ({ children }) => {
  const isLoading = useSelector((state) => state.loadingState?.isLoading);

  return (
    <div>
      {isLoading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default LoadingWrapper;
