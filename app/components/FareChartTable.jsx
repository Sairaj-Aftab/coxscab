import "@/app/styles/components/fare-chart.css";
const FareChartTable = () => {
  return (
    <div className="fare-chart-table">
      <div className="container">
        <div className="wrap">
          <div class="header">
            কক্সবাজার পৌরসভার টমটম/ ইজিবাইক (অযান্ত্রিক যান) এর পৌরসভা কর্তৃক
            নির্ধারিত ভাড়ার তালিকা
          </div>
          <table>
            <thead>
              <tr>
                <th>ক্রম নং</th>
                <th>নির্ধারিত এলাকার নাম</th>
                <th>জনপ্রতি ভাড়া</th>
                <th>রিজার্ভ ভাড়া</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>১</td>
                <td>রেল স্টেশন থেকে কলাতলী মোড়</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>২</td>
                <td>বাস টার্মিনাল হতে কলাতলী মোড়</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>৩</td>
                <td>রেল স্টেশন হতে বাস টার্মিনাল</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>৪</td>
                <td>রেল স্টেশন হতে হোটেল-মোটেল জোন</td>
                <td>৩০৳</td>
                <td>১৫০৳</td>
              </tr>
              <tr>
                <td>৫</td>
                <td>রেল স্টেশন হতে সুগন্ধা মোড় প্রধান সড়ক</td>
                <td>২৫৳</td>
                <td>১২৫৳</td>
              </tr>
              <tr>
                <td>৬</td>
                <td>বাস টার্মিনাল হতে কলাতলী বড়গুজার</td>
                <td>৩০৳</td>
                <td>১৫০৳</td>
              </tr>
              <tr>
                <td>৭</td>
                <td>বাস টার্মিনাল হতে লাবণী সী বিচ</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>৮</td>
                <td>বাস টার্মিনাল হতে বাইপাস রোড হয়ে কলাতলী মোড়</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>৯</td>
                <td>হলিডে মোড় হতে কলাতলী</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>১০</td>
                <td>কলাতলী হতে লাবণীজির পাড়</td>
                <td>৩০৳</td>
                <td>১৫০৳</td>
              </tr>
              <tr>
                <td>১১</td>
                <td>নাবানী সী বিচ হতে লাবণীজির পাড়</td>
                <td>১০৳</td>
                <td>৫০৳</td>
              </tr>
              <tr>
                <td>১২</td>
                <td>ডলফিন মোড় হতে হোটেল-মোটেল জোন</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>১৩</td>
                <td>ডলফিন মোড় হতে লাবণী পয়েন্ট</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>১৪</td>
                <td>ডলফিন মোড় হতে বিমান বন্দর</td>
                <td>২০৳</td>
                <td>১০০৳</td>
              </tr>
              <tr>
                <td>১৫</td>
                <td>ডলফিন মোড় হতে বাজারঘাটা</td>
                <td>১০৳</td>
                <td>৫০৳</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FareChartTable;
