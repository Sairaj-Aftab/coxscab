// "use client";
import { faker } from "@faker-js/faker";

// import DataTable from "datatables.net-dt";
import Image from "next/image";
// import "datatables.net-responsive-dt";
import "@/app/styles/components/rentcar-page.css";

const RentACarPage = () => {
  // new DataTable("#myTable");
  return (
    <div className="rent-car-page">
      <div className="container">
        <div className="wrap">
          <header>
            <h1>CoxsCar (Rent-A-Car)</h1>
            <marquee behavior="" direction="">
              <p>
                ★এই ভাড়া রেলওয়ে স্টেশন বা বিমানবন্দর থেকে কক্সবাজার শহরের যেকোন
                হোটেলের জন্য প্রয়োজ্য ★★ গাড়ি বুকিং এর পর চালকের ছবি দেখে
                নিশ্চিত হয়ে নিন ★★★ চালকের সাথে যোগাযোগে বিঘ্ন হলে গ্রুপ মনিটরের
                সাথে যোগাযোগ করুন ★★★★ অভিযোগের জন্য Coxscab Helpline এ কল করুন
              </p>
            </marquee>
          </header>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Driver Picture</th>
                  <th>Car Image</th>
                  <th>Driver Name</th>
                  <th>Mobile No</th>
                  <th>Group Monitor</th>
                  <th>Car Model</th>
                  <th>Seat Capacity</th>
                  <th>Rent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>3</td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "driver" })}
                      alt="Driver 1"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "car" })}
                      alt="Car"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>{faker.person.fullName()}</td>
                  <td>01825158590</td>
                  <td>
                    OWN <br /> 01825158590
                  </td>
                  <td>2007</td>
                  <td>4</td>
                  <td>1000</td>
                  <td class="status available">Available</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "driver" })}
                      alt="Driver 1"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "car" })}
                      alt="Car"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>{faker.person.fullName()}</td>
                  <td>01825158590</td>
                  <td>
                    OWN <br /> 01825158590
                  </td>
                  <td>2007</td>
                  <td>4</td>
                  <td>1000</td>
                  <td class="status available">Available</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "driver" })}
                      alt="Driver 1"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "car" })}
                      alt="Car"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>{faker.person.fullName()}</td>
                  <td>01825158590</td>
                  <td>
                    OWN <br /> 01825158590
                  </td>
                  <td>2007</td>
                  <td>4</td>
                  <td>1000</td>
                  <td class="status booked">Booked</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "driver" })}
                      alt="Driver 1"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "car" })}
                      alt="Car"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>{faker.person.fullName()}</td>
                  <td>01825158590</td>
                  <td>
                    OWN <br /> 01825158590
                  </td>
                  <td>2007</td>
                  <td>4</td>
                  <td>1000</td>
                  <td class="status available">Available</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "driver" })}
                      alt="Driver 1"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "car" })}
                      alt="Car"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>{faker.person.fullName()}</td>
                  <td>01825158590</td>
                  <td>
                    OWN <br /> 01825158590
                  </td>
                  <td>2007</td>
                  <td>4</td>
                  <td>1000</td>
                  <td class="status available">Available</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "driver" })}
                      alt="Driver 1"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>
                    <Image
                      src={faker.image.urlLoremFlickr({ category: "car" })}
                      alt="Car"
                      width={200}
                      height={200}
                      sizes="100vw"
                    />
                  </td>
                  <td>{faker.person.fullName()}</td>
                  <td>01825158590</td>
                  <td>
                    OWN <br /> 01825158590
                  </td>
                  <td>2007</td>
                  <td>4</td>
                  <td>1000</td>
                  <td class="status available">Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentACarPage;
