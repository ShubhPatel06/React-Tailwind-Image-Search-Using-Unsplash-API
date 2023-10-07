import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 21;

function App() {
  const searchValue = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      if (searchValue.current.value) {
        setErrorMsg("");
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchValue.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_ACCESS_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.");
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchValue.current.value);
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchValue.current.value = selection;
    fetchImages();
    resetSearch();
  };

  return (
    <div className="container flex justify-center flex-col min-h-screen mx-auto">
      <h1 className="title text-center mt-4 text-[#7676d7] text-4xl font-medium">
        Image Search
      </h1>
      {errorMsg && (
        <p className="error-msg text-red-600 text-center mt-4 text-lg font-bold">
          {errorMsg}
        </p>
      )}
      <div className="search-section flex justify-center items-center mt-4">
        <form onSubmit={handleSearch}>
          <input
            className="search-input min-w-[500px] p-3 border-2 border-gray-600 rounded-md outline-none"
            type="search"
            name="search"
            id="search"
            placeholder="Type something to search..."
            ref={searchValue}
          />
        </form>
      </div>
      <div className="filters font-semibold flex justify-center flex-wrap items-center gap-4 mt-4">
        <div
          className="text-white cursor-pointer px-2.5 py-[5px] rounded-[5px] bg-[#7676d7]"
          onClick={() => handleSelection("nature")}
        >
          Nature
        </div>
        <div
          className="text-white cursor-pointer px-2.5 py-[5px] rounded-[5px] bg-[#7676d7]"
          onClick={() => handleSelection("cars")}
        >
          Cars
        </div>
        <div
          className="text-white cursor-pointer px-2.5 py-[5px] rounded-[5px] bg-[#7676d7]"
          onClick={() => handleSelection("dogs")}
        >
          Dogs
        </div>
        <div
          className="text-white cursor-pointer px-2.5 py-[5px] rounded-[5px] bg-[#7676d7]"
          onClick={() => handleSelection("aeroplanes")}
        >
          Aeroplanes
        </div>
      </div>
      {loading ? (
        <p className="loading text-[#6565d4] text-center text-xl mt-5">
          Loading...
        </p>
      ) : (
        <>
          <div className="images mt-12 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 justify-center items-center">
            {images?.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className="image w-[200px] h-[200px] justify-self-center self-center transition-transform duration-[0.5s] ml-8 rounded-[10px] hover:translate-y-[-3px]"
              />
            ))}
          </div>
          <div className="buttons flex justify-center items-center gap-4 mt-12 mb-20">
            {page > 1 && (
              <button
                onClick={() => setPage(page - 1)}
                type="button"
                className=" bg-[#7676d7] shadow-none border-[none] outline-none px-2.5 py-[5px] rounded-[5px]  text-white font-semibold"
              >
                Previous
              </button>
            )}
            {page < totalPages && (
              <button
                onClick={() => setPage(page + 1)}
                type="button"
                className="bg-[#7676d7] shadow-none border-[none] outline-none px-2.5 py-[5px] rounded-[5px] text-white font-semibold"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
