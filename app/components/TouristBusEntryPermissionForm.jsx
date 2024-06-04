import "@/app/styles/components/tourist-bus-entry-permission-from.css";
const TouristBusEntryPermissionForm = () => {
  return (
    <div className="tourist-bus-entry-permission">
      <div className="container">
        <div className="wrap">
          <h1>Tourist Bus Entry Permission</h1>
          <form action="">
            <div className="form-group">
              <label htmlFor="applicantName">
                Applicant Name (আবেদনকারীর নাম)
              </label>
              <input
                type="text"
                id="applicantName"
                name="applicantName"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                Mobile No (মোবাইল নাম্বার উদাহরণস্বরূপ: 01320108413)
              </label>
              <input type="text" id="phone" name="phone" required />
            </div>

            <div className="form-group">
              <label htmlFor="institutionName">
                Institution Name (প্রতিষ্ঠানের নাম)
              </label>
              <textarea
                name="institutionName"
                id="institutionName"
                rows="2"
                cols="60"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="arrivalPlace">Arrival Place (আগমনের স্থান)</label>
              <textarea
                name="arrivalPlace"
                id="arrivalPlace"
                rows="2"
                cols="60"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="arrivalDate">Arrival Date (আগমনের তারিখ)</label>
              <input type="date" id="arrivalDate" name="arrivalDate" required />
            </div>
            <div className="form-group">
              <label htmlFor="arrivalTime">Arrival Time(আগমনের সময়)</label>
              <input type="text" id="arrivalTime" name="arrivalTime" required />
            </div>
            <div className="form-group">
              <label htmlFor="numberTourist">
                No of Tourists(পর্যটকের সংখ্যা)
              </label>
              <input
                type="number"
                id="numberTourist"
                name="numberTourist"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="numberBus">No of Bus(বাসের সংখ্যা)</label>
              <input type="number" id="numberBus" name="numberBus" required />
            </div>
            <div className="form-group">
              <label htmlFor="vehicleRegNo">Reg No of Vehicle(গাড়ির নং)</label>
              <input
                type="text"
                id="vehicleRegNo"
                name="vehicleRegNo"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="TransportName">
                Name of Transport(পরিবহনের নাম)
              </label>
              <input
                type="text"
                id="TransportName"
                name="TransportName"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="destinationName">Destination (হোটেলের নাম)</label>
              <input
                type="text"
                id="destinationName"
                name="destinationName"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="parkingPlace">
                Parking Place(পার্কিং এর স্থান)
              </label>
              <input
                type="text"
                id="parkingPlace"
                name="parkingPlace"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="returnDate">Return Date (প্রস্থানের তারিখ)</label>
              <input type="date" id="returnDate" name="returnDate" required />
            </div>
            <div className="form-group">
              <label htmlFor="returnTime">Return Time(প্রস্থানের সময়)</label>
              <input type="text" id="returnTime" name="returnTime" required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                name="description"
                id="description"
                rows="4"
                cols="60"
              ></textarea>
            </div>
            <div className="form-group terms-condition">
              <input type="checkbox" id="agree" name="agree" required />
              <ul>
                <label htmlFor="agree">Terms & Condition (অবশ্যই পালনীয়)</label>
                <li>১) আবেদনকারীকে অবশ্যই গাড়িতে থাকতে হবে।</li>
                <li>২) ট্রাফিক আইন মেনে চলতে হবে।</li>
                <li>
                  ৩) যাত্রী নামার সাথে সাথে বাস সুনির্দিষ্ট পার্কিং এ চলে যেতে
                  হবে।
                </li>
                <li>৪) সড়কের পাশে পার্কিং করা যাবে না।</li>
                <li>৫) যত্রতত্র আবর্জনা ফেলা যাবে না।</li>
              </ul>
            </div>
            <button type="button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TouristBusEntryPermissionForm;
