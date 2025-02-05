import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data, loading } = useFetch(`/hotels/find/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { dates, options } = useContext(SearchContext);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0]?.endDate, dates[0]?.startDate);
  // console.log(days)
  // console.log(dates[0].endDate)

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? data?.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === data?.photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/login");
    }
  };

  // console.log(data.photos.length)
  // console.log(data);

  const localAreaHandler = () => {
    let city = data.city;
    if (city === "Ahmedabad") {
      navigate("/localarea/ahmedabad");
    }
    if (city === "Mumbai") {
      navigate("/localarea/mumbai");
    }
    if (city === "Delhi") {
      navigate("/localarea/delhi");
    }
  };

  return (
    <div id="hotellastpagediv">
      <Navbar />
      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]}
                  alt="Not available"
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <div
              className="ax"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div
                className="axone"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <h1 className="hotelTitle">{data.name}</h1>

                <div className="hotelAddress">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span className="hotelAddressinner">{data.address}</span>
                </div>

                <span className="hotelDistance">
                  Excellent location – {data.distance} Kms from airport
                </span>

                <span className="hotelPriceHighlight">
                  Book a stay over ₹ {data.cheapestPrice} at this property and
                  get a free airport taxi.
                </span>
              </div>

              <div className="axtwo">
                <button
                  className="localAreaBtn"
                  onClick={() => localAreaHandler()}
                >
                  <div>
                    <LocationOnIcon />
                  </div>
                  <div>Local Area</div>
                </button>
              </div>
            </div>

            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt="Not available"
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>

            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div>

              <div className="hotelDetailsPrice">
                <h1 className="hotelDetailsPriceh1">
                  Perfect for a {days}-night stay!
                </h1>
                <span className="hotelDetailsPricespan">
                  Located in the real heart of {data.city}, this property has a
                  rating of {data.rating}!
                </span>
                <h2>
                  <b>₹ {days * data.cheapestPrice * options.room}</b> ({days}{" "}
                  nights)
                </h2>
                <button onClick={handleClick} className="hotelDetailsPricebtn">
                  Reserve or Book Now!
                </button>
              </div>
            </div>
          </div>

          <div className="HotelFooter">
            <Footer />
          </div>
        </div>
      )}

      {openModal && (
        <div className="bookingmodal">
          <Reserve
            setOpen={setOpenModal}
            hotelId={id}
            className="bookingmodalinner"
          />
        </div>
      )}
    </div>
  );
};

export default Hotel;
